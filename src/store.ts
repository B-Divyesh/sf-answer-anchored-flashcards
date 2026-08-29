import type { AppData, Card } from './types';
import { emptyData, sampleData } from './data';

const DB_VERSION = 1;
export const FREE_CARD_LIMIT = 30;

export class CardLimitError extends Error {
  constructor() {
    super(`The free plan holds ${FREE_CARD_LIMIT} cards. Remove a card or add a Desk license before saving another.`);
    this.name = 'CardLimitError';
  }
}

function openDb(demo: boolean): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(demo ? 'recall-anchor-demo' : 'recall-anchor', DB_VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore('app');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadData(demo: boolean): Promise<AppData> {
  const db = await openDb(demo);
  const found = await new Promise<AppData | undefined>((resolve, reject) => {
    const request = db.transaction('app').objectStore('app').get('data');
    request.onsuccess = () => resolve(request.result as AppData | undefined);
    request.onerror = () => reject(request.error);
  });
  db.close();
  if (found) return found;
  const initial = demo ? sampleData() : emptyData();
  await saveData(demo, initial);
  return initial;
}

export async function saveData(demo: boolean, data: AppData): Promise<void> {
  const db = await openDb(demo);
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('app', 'readwrite');
    tx.objectStore('app').put(data, 'data');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

/**
 * Apply a mutation to the newest stored snapshot in one IndexedDB transaction.
 * Read-modify-write calls are serialized by IndexedDB, so a stale tab cannot
 * replace cards or reviews written by another tab.
 */
export async function updateData(demo: boolean, update: (current: AppData) => AppData): Promise<AppData> {
  const db = await openDb(demo);
  return new Promise<AppData>((resolve, reject) => {
    const tx = db.transaction('app', 'readwrite');
    const store = tx.objectStore('app');
    const request = store.get('data');
    let next: AppData | undefined;
    request.onsuccess = () => {
      try {
        const current = (request.result as AppData | undefined) ?? (demo ? sampleData() : emptyData());
        next = update(structuredClone(current));
        store.put(next, 'data');
      } catch (error) {
        tx.abort();
        reject(error);
      }
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => { db.close(); resolve(next!); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => db.close();
  });
}

/**
 * Add one card against the newest stored snapshot. The stable card id makes a
 * repeated submission idempotent, while the limit check and write share the
 * same transaction so concurrent tabs cannot cross the free-plan boundary.
 */
export function addCardToStore(demo: boolean, card: Card, unlimited: boolean): Promise<AppData> {
  return updateData(demo, current => {
    if (current.cards.some(item => item.id === card.id)) return current;
    if (!unlimited && current.cards.length >= FREE_CARD_LIMIT) throw new CardLimitError();
    current.cards.push(card);
    return current;
  });
}

export async function resetDemo(): Promise<AppData> {
  const data = sampleData();
  await saveData(true, data);
  return data;
}
