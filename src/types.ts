export type CardType = 'exact' | 'numeric' | 'checklist';

export interface Card {
  id: string;
  deck: string;
  prompt: string;
  type: CardType;
  answer: string;
  aliases: string[];
  tolerance: number;
  checklist: string[];
  intervalDays: number;
  dueAt: string;
  reviewCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  cardId: string;
  prompt: string;
  typedAnswer: string;
  confidence: 'unsure' | 'close' | 'certain';
  score: number;
  matched: string[];
  missing: string[];
  reviewedAt: string;
  previousInterval: number;
  nextInterval: number;
  dueAt: string;
  explanation: string;
}

export interface AppData {
  cards: Card[];
  reviews: Review[];
}

export interface ScoreResult {
  score: number;
  matched: string[];
  missing: string[];
  label: string;
}
