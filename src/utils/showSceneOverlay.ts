import { PublicBroadcastState } from '../types/game';

export interface ShowOverlay { type: string; message?: string; id: number }

export function drawShowOverlay(ctx: CanvasRenderingContext2D, state: PublicBroadcastState, overlay: ShowOverlay | null, image?: HTMLImageElement | null) {
  if (!overlay || !['ROUND_INTRO', 'SHOW_ASSET'].includes(overlay.type)) return;
  const { width, height } = ctx.canvas;
  ctx.save();
  ctx.fillStyle = '#152635';
  ctx.fillRect(0, 0, width, height);
  const pad = width * .065;
  ctx.fillStyle = '#f1c45c';
  ctx.font = `bold ${Math.round(width * .021)}px sans-serif`;
  ctx.direction = 'rtl';
  ctx.textAlign = 'right';
  ctx.fillText('DADASHMODE  /  معرفی مرحله', width - pad, height * .13);
  if (overlay.type === 'SHOW_ASSET') {
    if (image?.complete && image.naturalWidth) {
      const scale = Math.min((width - 2 * pad) / image.naturalWidth, height * .66 / image.naturalHeight);
      const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
      ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
    } else {
      ctx.fillStyle = '#f7eee0'; ctx.fillText('تصویر در حال آماده‌سازی است', width - pad, height * .5);
    }
  } else {
    ctx.fillStyle = '#f7eee0';
    ctx.font = `bold ${Math.round(width * .06)}px sans-serif`;
    ctx.fillText(state.round.persianTitle, width - pad, height * .39, width - 2 * pad);
    ctx.font = `${Math.round(width * .03)}px sans-serif`;
    const words = (overlay.message || state.round.persianRule || '').split(/\s+/);
    let line = '';
    let y = height * .54;
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > width - 2 * pad && line) {
        ctx.fillText(line, width - pad, y); y += height * .08; line = word;
      } else line = next;
    }
    if (line) ctx.fillText(line, width - pad, y);
  }
  ctx.fillStyle = '#e6d4b4';
  ctx.font = `${Math.round(width * .021)}px sans-serif`;
  ctx.fillText(`مرحله ${state.round.current} از ${state.round.total}`, width - pad, height * .91);
  ctx.restore();
}
