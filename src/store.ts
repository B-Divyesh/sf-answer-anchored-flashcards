import type { AppData } from './types';
import { emptyData, sampleData } from './data';

const DB_VERSION = 1;

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

export async function resetDemo(): Promise<AppData> {
  const data = sampleData();
  await saveData(true, data);
  return data;
}
