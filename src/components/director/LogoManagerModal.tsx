import React, { useState } from 'react';
import { WolfBrandLogo } from '../brand/WolfBrandLogo';
import { X } from 'lucide-react';
import { deleteImage, saveImage } from '../../engine/mediaLibrary';

interface LogoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoManagerModal: React.FC<LogoManagerModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState('');

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in" dir="rtl">
      <div className="w-full max-w-2xl bg-neutral-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-white font-['Vazirmatn']">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <WolfBrandLogo variant="3d" size="sm" showText={false} />
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300">
                موتور نشان و هویت بصری گرگ (LOGO & BRAND ENGINE)
              </h2>
              <p className="text-xs text-neutral-400">
                نسخه‌های شفاف، ۳ بعدی متالیک و مخصوص هاد تلویزیونی (تضمین ایمنی کروماکی)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-amber-200">شفافیت و ایمنی کروماکی تصاویر آپلودی خودکار تأیید نمی‌شود؛ پیش‌نمایش را قبل از ضبط بررسی کنید.</p>

        {/* Variants Grid */}
        <section className="flex flex-col gap-3 rounded-xl bg-neutral-950 p-4">
          <h3 className="font-bold">لوگوی اختصاصی خود را بارگذاری کنید</h3>
          <p className="text-sm text-neutral-300">تصویر روی این دستگاه ذخیره و در نمایشگر تماشاگر و اتاق فرمان جایگزین می‌شود. برای پس‌زمینهٔ شفاف، فایل PNG شفاف بارگذاری کنید؛ حذف خودکار پس‌زمینه هنوز وجود ندارد.</p>
          <input aria-label="بارگذاری لوگوی تصویر" type="file" accept="image/png,image/jpeg,image/webp"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                const saved = await saveImage(file, 'logo', 'global', file.name);
                setStatus(`لوگو ذخیره شد: ${saved.width}×${saved.height} پیکسل.`);
              } catch (error) { setStatus(error instanceof Error ? error.message : 'ذخیره لوگو انجام نشد.'); }
              event.target.value = '';
            }} className="w-full text-sm" />
          <button type="button" onClick={async () => { try { await deleteImage('brand-logo'); setStatus('لوگوی پیش‌فرض برگشت.'); } catch { setStatus('حذف لوگو ناموفق بود.'); } }}
            className="min-h-11 rounded-lg bg-neutral-800 px-4">بازگشت به نشان پیش‌فرض</button>
          {status && <p role="status" className="text-sm text-amber-200">{status}</p>}
        </section>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Variant 1: 3D Metallic */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/30 flex flex-col items-center justify-between gap-3 text-center">
            <span className="text-xs font-bold text-amber-300">نسخه ۳ بعدی متالیک (قهرمانی)</span>
            <div className="p-4">
              <WolfBrandLogo variant="3d" size="lg" />
            </div>
          </div>

          {/* Variant 2: HUD Clean Vector */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-cyan-500/30 flex flex-col items-center justify-between gap-3 text-center">
            <span className="text-xs font-bold text-cyan-300">نسخه شفاف HUD (پخش زنده)</span>
            <div className="p-4">
              <WolfBrandLogo variant="hud" size="lg" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
