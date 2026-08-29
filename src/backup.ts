import type { AppData, Card, Review } from './types';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const bytesToBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const base64ToBytes = (value: string) => Uint8Array.from(atob(value), char => char.charCodeAt(0));

export class BackupValidationError extends Error {
  constructor() {
    super('This backup has invalid card or review data.');
    this.name = 'BackupValidationError';
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value: unknown): value is string => typeof value === 'string';
const isRequiredText = (value: unknown): value is string => {
  return isText(value) && value.trim().length > 0;
};
const isTextList = (value: unknown, required = false): value is string[] => Array.isArray(value) && value.every(item => required ? isRequiredText(item) : isText(item));
const isNonNegativeInteger = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
};
const isIsoTimestamp = (value: unknown): value is string => {
  if (!isText(value)) return false;
  const time = new Date(value);
  return Number.isFinite(time.getTime()) && time.toISOString() === value;
};

function isCard(value: unknown): value is Card {
  if (!isRecord(value)) return false;
  if (!isRequiredText(value.id) || !isRequiredText(value.deck) || !isRequiredText(value.prompt) || !isText(value.answer)) return false;
  if (!isTextList(value.aliases, true) || !isTextList(value.checklist, true)) return false;
  if (!isNonNegativeInteger(value.intervalDays) || !isNonNegativeInteger(value.reviewCount) || !isIsoTimestamp(value.dueAt) || !isIsoTimestamp(value.createdAt)) return false;
  if (typeof value.tolerance !== 'number' || !Number.isFinite(value.tolerance) || value.tolerance < 0) return false;
  if (value.type === 'exact') return isRequiredText(value.answer) && value.checklist.length === 0 && value.tolerance === 0;
  if (value.type === 'numeric') return value.aliases.length === 0 && value.checklist.length === 0 && value.answer.trim() !== '' && Number.isFinite(Number(value.answer));
  if (value.type === 'checklist') return value.answer === '' && value.aliases.length === 0 && value.tolerance === 0 && value.checklist.length >= 2;
  return false;
}

function isReview(value: unknown): value is Review {
  if (!isRecord(value)) return false;
  return isRequiredText(value.id) && isRequiredText(value.cardId) && isRequiredText(value.prompt) && isRequiredText(value.typedAnswer)
    && (value.confidence === 'unsure' || value.confidence === 'close' || value.confidence === 'certain')
    && typeof value.score === 'number' && Number.isFinite(value.score) && value.score >= 0 && value.score <= 1
    && isTextList(value.matched, true) && isTextList(value.missing, true)
    && isIsoTimestamp(value.reviewedAt) && isNonNegativeInteger(value.previousInterval) && isNonNegativeInteger(value.nextInterval)
    && isIsoTimestamp(value.dueAt) && isRequiredText(value.explanation);
}

function validateAppData(value: unknown): AppData {
  if (!isRecord(value) || !Array.isArray(value.cards) || !Array.isArray(value.reviews)) throw new BackupValidationError();
  if (!value.cards.every(isCard) || !value.reviews.every(isReview)) throw new BackupValidationError();
  const cardIds = value.cards.map(card => card.id);
  const reviewIds = value.reviews.map(review => review.id);
  if (new Set(cardIds).size !== cardIds.length || new Set(reviewIds).size !== reviewIds.length) throw new BackupValidationError();
  return { cards: value.cards, reviews: value.reviews };
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 180000, hash: 'SHA-256' }, material,
    { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
  );
}

export async function encryptBackup(data: AppData, passphrase: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(data)));
  return JSON.stringify({ format: 'recall-anchor-backup', version: 1, cipher: 'AES-GCM', kdf: 'PBKDF2-SHA256-180000', salt: bytesToBase64(salt), iv: bytesToBase64(iv), data: bytesToBase64(new Uint8Array(ciphertext)) }, null, 2);
}

export async function decryptBackup(text: string, passphrase: string): Promise<AppData> {
  const envelope = JSON.parse(text) as Record<string, string | number>;
  if (envelope.format !== 'recall-anchor-backup' || envelope.version !== 1) throw new Error('This is not a Recall Anchor backup.');
  const salt = base64ToBytes(String(envelope.salt));
  const iv = base64ToBytes(String(envelope.iv));
  const key = await deriveKey(passphrase, salt);
  const clear = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, base64ToBytes(String(envelope.data)));
  const parsed = JSON.parse(decoder.decode(clear)) as unknown;
  return validateAppData(parsed);
}

const csvValue = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const rowsToCsv = (rows: unknown[][]) => rows.map(row => row.map(csvValue).join(',')).join('\r\n');

export function reviewsCsv(reviews: Review[]): string {
  return rowsToCsv([
    ['Reviewed at', 'Prompt', 'Typed answer', 'Confidence', 'Score', 'Matched', 'Missing', 'Previous interval', 'Next interval', 'Next due'],
    ...reviews.map(review => [review.reviewedAt, review.prompt, review.typedAnswer, review.confidence, Math.round(review.score * 100) + '%', review.matched.join('; '), review.missing.join('; '), review.previousInterval, review.nextInterval, review.dueAt])
  ]);
}

export function ankiCsv(cards: Card[]): string {
  return rowsToCsv([
    ['Front', 'Back', 'Card type', 'Rubric', 'Deck', 'Tags'],
    ...cards.map(card => [card.prompt, card.type === 'checklist' ? card.checklist.join('; ') : card.answer, card.type, card.type === 'numeric' ? `± ${card.tolerance}` : card.type === 'exact' ? card.aliases.join('; ') : card.checklist.join('; '), card.deck, 'recall-anchor'])
  ]);
}

export function downloadFile(name: string, contents: string, type: string): void {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
