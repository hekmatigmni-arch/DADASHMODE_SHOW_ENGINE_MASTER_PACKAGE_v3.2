import React, { useRef, useEffect } from 'react';
import { PreviewFootageType } from '../../types/broadcastLayout';

interface PreviewFootageSimProps {
  type: PreviewFootageType;
  customMediaUrl?: string | null;
  roundNumber?: number;
}

export const PreviewFootageSim: React.FC<PreviewFootageSimProps> = ({
  type,
  customMediaUrl,
  roundNumber = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated background simulation canvas
  useEffect(() => {
    if (type !== 'footage_sim') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      // Studio background gradient
      const bgGrad = ctx.createRadialGradient(w / 2, h * 0.45, 80, w / 2, h * 0.5, w * 0.7);
      bgGrad.addColorStop(0, '#1c2438');
      bgGrad.addColorStop(0.5, '#0c1220');
      bgGrad.addColorStop(1, '#05070d');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Studio lighting rigs / soft ambient flares
      ctx.fillStyle = 'rgba(0, 167, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(w * 0.2, h * 0.25, 260, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 215, 0, 0.06)';
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.25, 260, 0, Math.PI * 2);
      ctx.fill();

      // Studio Challenge Table (center horizon)
      const tableY = h * 0.64;
      const tableGrad = ctx.createLinearGradient(0, tableY, 0, h);
      tableGrad.addColorStop(0, '#1a1f2c');
      tableGrad.addColorStop(0.1, '#11151f');
      tableGrad.addColorStop(1, '#0a0c14');
      ctx.fillStyle = tableGrad;
      ctx.fillRect(0, tableY, w, h - tableY);

      // Table bevel edge highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, tableY);
      ctx.lineTo(w, tableY);
      ctx.stroke();

      // Creator Left: ELIAS (Red team silhouette / avatar at left edge)
      const eliasX = w * 0.18;
      const eliasY = tableY - 120 + Math.sin(t * 0.8) * 4;
      // Head
      ctx.fillStyle = '#ff2a55';
      ctx.beginPath();
      ctx.arc(eliasX, eliasY - 60, 42, 0, Math.PI * 2);
      ctx.fill();
      // Face indicator
      ctx.fillStyle = '#ffccd5';
      ctx.beginPath();
      ctx.arc(eliasX + 6, eliasY - 62, 14, 0, Math.PI * 2);
      ctx.fill();
      // Shoulders
      ctx.fillStyle = '#cc1439';
      ctx.beginPath();
      ctx.ellipse(eliasX, eliasY + 30, 75, 55, 0, 0, Math.PI * 2);
      ctx.fill();
      // Elias Label
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('ELIAS (الیس)', eliasX, eliasY + 110);

      // Creator Right: EMAD (Green team silhouette / avatar at right edge)
      const emadX = w * 0.82;
      const emadY = tableY - 120 + Math.sin(t * 0.8 + 1.5) * 4;
      // Head
      ctx.fillStyle = '#00e676';
      ctx.beginPath();
      ctx.arc(emadX, emadY - 60, 42, 0, Math.PI * 2);
      ctx.fill();
      // Face indicator
      ctx.fillStyle = '#ccffdd';
      ctx.beginPath();
      ctx.arc(emadX - 6, emadY - 62, 14, 0, Math.PI * 2);
      ctx.fill();
      // Shoulders
      ctx.fillStyle = '#00a854';
      ctx.beginPath();
      ctx.ellipse(emadX, emadY + 30, 75, 55, 0, 0, Math.PI * 2);
      ctx.fill();
      // Emad Label
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('EMAD (عماد)', emadX, emadY + 110);

      // CENTER ACTION ZONE: Hands and challenge props in motion
      const centerX = w * 0.5;
      const propY = tableY - 40;

      // Round-specific center challenge props
      if (roundNumber === 1) {
        // Cup Tower pyramid
        const cupW = 32;
        const cupH = 40;
        ctx.fillStyle = '#ffd700';
        ctx.strokeStyle = '#b8860b';
        ctx.lineWidth = 2;
        // 4 base cups
        for (let i = 0; i < 4; i++) {
          const cx = centerX - 60 + i * 40;
          ctx.fillRect(cx - cupW / 2, propY - cupH, cupW, cupH);
          ctx.strokeRect(cx - cupW / 2, propY - cupH, cupW, cupH);
        }
        // 3 layer cups
        for (let i = 0; i < 3; i++) {
          const cx = centerX - 40 + i * 40;
          ctx.fillRect(cx - cupW / 2, propY - cupH * 2 + 5, cupW, cupH);
          ctx.strokeRect(cx - cupW / 2, propY - cupH * 2 + 5, cupW, cupH);
        }
      } else if (roundNumber === 2) {
        // Distance Basketball Mini-Hoop
        ctx.strokeStyle = '#ff9900';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.ellipse(centerX, propY - 80, 50, 20, 0, 0, Math.PI * 2);
        ctx.stroke();
        // Flying ball
        const ballX = centerX - 120 + ((t * 80) % 240);
        const ballY = propY - 120 - Math.sin((ballX - centerX) / 50) * 40;
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.arc(ballX, ballY, 18, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // 6 Mystery Boxes on table
        for (let b = 1; b <= 6; b++) {
          const bx = centerX - 175 + (b - 1) * 70;
          ctx.fillStyle = b % 2 === 0 ? '#1f293d' : '#2a364f';
          ctx.strokeStyle = '#ffd700';
          ctx.lineWidth = 2;
          ctx.fillRect(bx - 25, propY - 50, 50, 50);
          ctx.strokeRect(bx - 25, propY - 50, 50, 50);
          ctx.font = 'bold 16px monospace';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(`${b}`, bx, propY - 20);
        }
      }

      // Animated Player Hands entering center zone
      const handLeftX = eliasX + 120 + Math.sin(t * 1.5) * 35;
      const handLeftY = propY - 20 + Math.cos(t * 1.5) * 15;
      ctx.fillStyle = '#e8a882';
      ctx.beginPath();
      ctx.ellipse(handLeftX, handLeftY, 24, 16, 0.2, 0, Math.PI * 2);
      ctx.fill();

      const handRightX = emadX - 120 - Math.cos(t * 1.5) * 35;
      const handRightY = propY - 20 + Math.sin(t * 1.5) * 15;
      ctx.fillStyle = '#e8a882';
      ctx.beginPath();
      ctx.ellipse(handRightX, handRightY, 24, 16, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Clear Center Protected Zone label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ محدوده اصلی ویدیوی یوتیوب (چهره‌ها، دست‌ها و چالش در مرکز کاملاً دیده می‌شوند)', centerX, h * 0.88);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [type, roundNumber]);

  if (type === 'checkerboard') {
    return (
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundColor: '#121212',
          backgroundImage: `
            linear-gradient(45deg, #1c1c1c 25%, transparent 25%),
            linear-gradient(-45deg, #1c1c1c 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #1c1c1c 75%),
            linear-gradient(-45deg, transparent 75%, #1c1c1c 75%)
          `,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
        }}
      />
    );
  }

  if (type === 'chroma_green') {
    return <div className="absolute inset-0 z-0 bg-[#00FF00] pointer-events-none" />;
  }

  if (type === 'capcut_black') {
    return <div className="absolute inset-0 z-0 bg-[#000000] pointer-events-none" />;
  }

  if (type === 'custom_upload' && customMediaUrl) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
        {customMediaUrl.endsWith('.mp4') || customMediaUrl.endsWith('.webm') ? (
          <video
            src={customMediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={customMediaUrl}
            alt="Custom uploaded footage"
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  }

  // Default: footage_sim
  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
    />
  );
};
