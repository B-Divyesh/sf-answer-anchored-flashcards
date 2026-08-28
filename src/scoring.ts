import type { Card, ScoreResult } from './types';

export function normalize(value: string): string {
  return value.normalize('NFKC').trim().toLocaleLowerCase().replace(/\s+/g, ' ');
}

function containsCompleteRubricItem(answer: string, item: string): boolean {
  const escaped = normalize(item).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}(?=$|[^\\p{L}\\p{N}])`, 'iu').test(answer);
}

export function scoreCard(card: Card, typed: string): ScoreResult {
  if (card.type === 'exact') {
    const expected = [card.answer, ...card.aliases].map(normalize);
    const pass = expected.includes(normalize(typed));
    return { score: pass ? 1 : 0, matched: pass ? [card.answer] : [], missing: pass ? [] : [card.answer], label: pass ? 'Exact match' : 'No exact match' };
  }
  if (card.type === 'numeric') {
    const actual = Number(typed.replaceAll(',', '').trim());
    const expected = Number(card.answer);
    const pass = Number.isFinite(actual) && Math.abs(actual - expected) <= card.tolerance;
    return { score: pass ? 1 : 0, matched: pass ? [typed] : [], missing: pass ? [] : [`${card.answer} ± ${card.tolerance}`], label: pass ? 'Within tolerance' : 'Outside tolerance' };
  }
  const entered = normalize(typed);
  const matched = card.checklist.filter(item => containsCompleteRubricItem(entered, item));
  const missing = card.checklist.filter(item => !matched.includes(item));
  const score = card.checklist.length ? matched.length / card.checklist.length : 0;
  return { score, matched, missing, label: `Matched ${matched.length} of ${card.checklist.length}` };
}

export function nextInterval(card: Card, score: number, confidence: string): { days: number; explanation: string } {
  if (score < 0.5) return { days: 0, explanation: 'Fewer than half of the rubric points matched. Review again in 10 minutes.' };
  if (score < 0.8) return { days: 1, explanation: 'Some rubric points matched. The card returns tomorrow.' };
  const base = card.reviewCount === 0 ? 1 : Math.max(2, Math.round(card.intervalDays * 2.2));
  const factor = confidence === 'unsure' ? 0.7 : confidence === 'certain' ? 1.15 : 1;
  const days = Math.max(1, Math.round(base * factor));
  const confidenceNote = confidence === 'unsure' ? 'Unsure confidence shortened it.' : confidence === 'certain' ? 'Certain confidence added a small extension.' : 'Close confidence kept the standard interval.';
  return { days, explanation: `The rubric passed. ${confidenceNote}` };
}

export function dueDate(days: number): string {
  return new Date(Date.now() + (days === 0 ? 10 * 60000 : days * 86400000)).toISOString();
}
