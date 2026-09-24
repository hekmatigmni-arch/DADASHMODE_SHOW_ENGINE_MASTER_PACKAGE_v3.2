export type MediaKind = 'logo' | 'card' | 'print' | 'scene';
export interface MediaRecord {
  id: string;
  episodeId: string;
  kind: MediaKind;
  title: string;
  blob: Blob;
  width: number;
  height: number;
  createdAt: number;
}

const DATABASE = 'dadashmode-media-v1';
const STORE = 'images';
export const MEDIA_CHANGED = 'dadashmode-media-changed';

function openLibrary(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('حافظهٔ تصویری این مرورگر پشتیبانی نمی‌شود.'));
    const request = indexedDB.open(DATABASE, 2);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: 'id' });
      if (!request.result.objectStoreNames.contains('voice-cues')) request.result.createObjectStore('voice-cues', { keyPath: 'text' });
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function transaction<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>, storeName = STORE): Promise<T> {
  const db = await openLibrary();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const request = action(tx.objectStore(storeName));
    tx.oncomplete = () => { db.close(); resolve(request.result); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error); };
  });
}

export async function validateImage(file: File): Promise<{ width: number; height: number }> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type))
    throw new Error('فقط تصویر PNG، JPEG یا WebP پذیرفته می‌شود. SVG آپلودی به دلیل خطر اسکریپت پذیرفته نیست.');
  if (!file.size || file.size > 10 * 1024 * 1024) throw new Error('اندازهٔ تصویر باید کمتر از ۱۰ مگابایت باشد.');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth > 8192 || image.naturalHeight > 8192)
      throw new Error('ابعاد تصویر نامعتبر است یا از ۸۱۹۲ پیکسل بیشتر است.');
    return { width: image.naturalWidth, height: image.naturalHeight };
  } catch (error) {
    throw error instanceof Error ? error : new Error('فایل تصویر خراب است.');
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function saveImage(file: File, kind: MediaKind, episodeId: string, title: string): Promise<MediaRecord> {
  const { width, height } = await validateImage(file);
  const record: MediaRecord = {
    id: kind === 'logo' ? 'brand-logo' : crypto.randomUUID(),
    episodeId, kind, title: title.trim() || file.name, blob: file,
    width, height, createdAt: Date.now(),
  };
  await transaction('readwrite', (store) => store.put(record));
  window.dispatchEvent(new Event(MEDIA_CHANGED));
  return record;
}

export async function getImage(id: string): Promise<MediaRecord | undefined> {
  return transaction('readonly', (store) => store.get(id));
}

export async function listImages(): Promise<MediaRecord[]> {
  return transaction('readonly', (store) => store.getAll());
}

export async function deleteImage(id: string): Promise<void> {
  await transaction('readwrite', (store) => store.delete(id));
  window.dispatchEvent(new Event(MEDIA_CHANGED));
}

export interface OfflineVoiceCue { text: string; blob: Blob; checksum: string; createdAt: number }

export async function saveOfflineVoiceCue(text: string, file: File): Promise<OfflineVoiceCue> {
  const spokenText = text.trim();
  if (!spokenText || spokenText.length > 2000) throw new Error('متن دیالوگ باید بین ۱ تا ۲۰۰۰ حرف باشد.');
  if (!file.size || file.size > 20 * 1024 * 1024) throw new Error('فایل صوتی باید کمتر از ۲۰ مگابایت باشد.');
  const bytes = await file.arrayBuffer();
  const header = new TextDecoder('ascii').decode(bytes.slice(0, 12));
  if (!header.startsWith('RIFF') || header.slice(8, 12) !== 'WAVE') throw new Error('فقط فایل WAV معتبر پذیرفته می‌شود.');
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  const checksum = Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  const cue = { text: spokenText, blob: file as Blob, checksum, createdAt: Date.now() };
  await transaction('readwrite', (store) => store.put(cue), 'voice-cues');
  return cue;
}

export async function getOfflineVoiceCue(text: string): Promise<OfflineVoiceCue | undefined> {
  return transaction('readonly', (store) => store.get(text.trim()), 'voice-cues');
}
