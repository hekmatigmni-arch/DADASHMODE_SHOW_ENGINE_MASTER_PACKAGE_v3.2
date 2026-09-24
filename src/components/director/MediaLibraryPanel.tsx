import React, { useEffect, useState } from 'react';
import { deleteImage, listImages, MEDIA_CHANGED, MediaRecord, saveImage } from '../../engine/mediaLibrary';
import { storyEngine } from '../../engine/storyEngine';

export const MediaLibraryPanel: React.FC<{ onPresent: (id: string) => void }> = ({ onPresent }) => {
  const [items, setItems] = useState<MediaRecord[]>([]);
  const [kind, setKind] = useState<'card' | 'print' | 'scene'>('card');
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const reload = () => listImages().then((found) => { if (active) setItems(found.filter((item) => item.kind !== 'logo')); }).catch(() => setError('فهرست تصاویر در این مرورگر در دسترس نیست.'));
    reload();
    window.addEventListener(MEDIA_CHANGED, reload);
    return () => { active = false; window.removeEventListener(MEDIA_CHANGED, reload); };
  }, []);
  return (
    <section className="mt-6 bg-neutral-900 p-4 rounded-xl" dir="rtl">
      <h3 className="font-black text-lg">آرشیو کارت‌ها و تصاویر صحنه</h3>
      <p className="mt-2 text-sm text-neutral-300">فایل‌های چاپی، کارت‌ها و تصاویر هر اپیزود را اینجا نگه دارید؛ «نمایش» تصویر را در خروجی و ضبط گرافیکی قرار می‌دهد. فایل‌ها فقط روی این مرورگر ذخیره می‌شوند.</p>
      <div className="flex flex-wrap items-center gap-3 my-4">
        <select aria-label="نوع تصویر" value={kind} onChange={(event) => setKind(event.target.value as typeof kind)} className="min-h-11 bg-neutral-800 rounded px-3">
          <option value="card">کارت مسابقه</option><option value="print">تصویر چاپی</option><option value="scene">تصویر صحنه</option>
        </select>
        <input type="file" accept="image/png,image/jpeg,image/webp" multiple aria-label="بارگذاری تصاویر کارت و صحنه" onChange={async (event) => {
          const files = Array.from(event.target.files || []);
          for (const file of files) {
            try { await saveImage(file, kind, storyEngine.getCurrentEpisode().id, file.name); }
            catch (reason) { setError(`${file.name}: ${reason instanceof Error ? reason.message : 'بارگذاری نشد'}`); }
          }
          event.target.value = '';
        }} className="text-sm max-w-full" />
      </div>
      {error && <p role="alert" className="text-red-300">{error}</p>}
      {items.length === 0 && <p className="text-neutral-400">هنوز کارت یا تصویری بارگذاری نشده است.</p>}
      <div className="flex flex-wrap gap-3">
        {items.map((item) => <div key={item.id} className="min-w-48 max-w-64 border border-neutral-700 rounded-lg p-3">
          <p className="font-bold truncate">{item.title}</p>
          <p className="text-xs text-neutral-400">{item.kind} | {item.width}×{item.height} | {item.episodeId}</p>
          <div className="flex gap-2 mt-3">
            <button className="min-h-11 rounded bg-amber-700 px-3" onClick={() => onPresent(item.id)}>نمایش و ضبط</button>
            <button className="min-h-11 rounded bg-neutral-700 px-3" onClick={async () => { await deleteImage(item.id); }}>حذف</button>
          </div>
        </div>)}
      </div>
    </section>
  );
};
