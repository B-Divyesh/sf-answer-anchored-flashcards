import type { AppData, Card } from './types';

const now = () => new Date().toISOString();

export const sampleCards: Card[] = [
  {
    id: 'sample-exact', deck: 'Foundations', prompt: 'Which organelle produces most cellular ATP?',
    type: 'exact', answer: 'mitochondria', aliases: ['mitochondrion'], tolerance: 0, checklist: [],
    intervalDays: 1, dueAt: '2020-01-01T00:00:00.000Z', reviewCount: 2, createdAt: now()
  },
  {
    id: 'sample-number', deck: 'Foundations', prompt: 'What is the speed of light in vacuum, in km/s?',
    type: 'numeric', answer: '299792', aliases: [], tolerance: 10, checklist: [],
    intervalDays: 3, dueAt: '2020-01-01T00:00:00.000Z', reviewCount: 3, createdAt: now()
  },
  {
    id: 'sample-list', deck: 'Field notes', prompt: 'Name the three parts of a scientific explanation.',
    type: 'checklist', answer: '', aliases: [], tolerance: 0,
    checklist: ['claim', 'evidence', 'reasoning'], intervalDays: 1,
    dueAt: '2020-01-01T00:00:00.000Z', reviewCount: 1, createdAt: now()
  }
];

export const sampleReviews = [
  { id: 'r1', cardId: 'sample-exact', prompt: sampleCards[0].prompt, typedAnswer: 'mitochondria', confidence: 'close' as const, score: 1, matched: ['mitochondria'], missing: [], reviewedAt: new Date(Date.now() - 86400000 * 3).toISOString(), previousInterval: 1, nextInterval: 3, dueAt: now(), explanation: 'Exact answer matched. Close confidence kept the standard interval.' },
  { id: 'r2', cardId: 'sample-list', prompt: sampleCards[2].prompt, typedAnswer: 'claim and evidence', confidence: 'certain' as const, score: 0.67, matched: ['claim', 'evidence'], missing: ['reasoning'], reviewedAt: new Date(Date.now() - 86400000).toISOString(), previousInterval: 1, nextInterval: 1, dueAt: now(), explanation: 'Matched 2 of 3 checklist items. The card returns tomorrow.' }
];

export const sampleData = (): AppData => ({
  cards: structuredClone(sampleCards), reviews: structuredClone(sampleReviews)
});

export const emptyData = (): AppData => ({ cards: [], reviews: [] });
