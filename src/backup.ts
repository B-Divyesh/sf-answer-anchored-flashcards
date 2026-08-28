import type { AppData, Card, Review } from './types';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const bytesToBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const base64ToBytes = (value: string) => Uint8Array.from(atob(value), char => char.charCodeAt(0));

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
  const parsed = JSON.parse(decoder.decode(clear)) as AppData;
  if (!Array.isArray(parsed.cards) || !Array.isArray(parsed.reviews)) throw new Error('The backup does not contain cards and reviews.');
  return parsed;
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
