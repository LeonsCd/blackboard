import React, { useEffect, useRef } from 'react';
import './ChalkStaticDemo.css';

const ChalkStaticDemo: React.FC = () => {
  // A: Chalkboard section
  const chalkCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chalkContainerRef = useRef<HTMLDivElement | null>(null);
  // B: Crayon section
  const crayonCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const crayonContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = chalkCanvasRef.current;
    const container = chalkContainerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      const { clientWidth, clientHeight } = container;
      canvas.width = clientWidth;
      canvas.height = clientHeight;
    };

    const drawBackgroundPattern = (context: CanvasRenderingContext2D, width: number, height: number) => {
      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = 64;
      patternCanvas.height = 64;
      const pctx = patternCanvas.getContext('2d')!;

      // Base chalkboard color
      pctx.fillStyle = '#213c2b';
      pctx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

      // Subtle streaks
      pctx.strokeStyle = 'rgba(255,255,255,0.03)';
      pctx.lineWidth = 1;
      for (let i = -64; i < 64; i += 8) {
        pctx.beginPath();
        pctx.moveTo(i, 0);
        pctx.lineTo(i + 64, 64);
        pctx.stroke();
      }

      // Light speckles
      for (let i = 0; i < 120; i++) {
        const x = Math.random() * 64;
        const y = Math.random() * 64;
        const r = Math.random() * 0.6 + 0.2;
        pctx.fillStyle = 'rgba(255,255,255,0.02)';
        pctx.beginPath();
        pctx.arc(x, y, r, 0, Math.PI * 2);
        pctx.fill();
      }

      const pattern = context.createPattern(patternCanvas, 'repeat');
      if (pattern) {
        context.fillStyle = pattern;
        context.fillRect(0, 0, width, height);
      } else {
        // fallback
        context.fillStyle = '#213c2b';
        context.fillRect(0, 0, width, height);
      }
    };

    const drawChalkLine = (
      context: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      brushDiameter = 7
    ) => {
      context.lineCap = 'round';
      context.lineWidth = brushDiameter;
      context.strokeStyle = `rgba(255,255,255,${0.4 + Math.random() * 0.2})`;

      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();

      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const length = Math.max(1, Math.round(distance / (5 / brushDiameter)));
      const xUnit = dx / length;
      const yUnit = dy / length;

      for (let i = 0; i < length; i++) {
        const xCurrent = x1 + i * xUnit;
        const yCurrent = y1 + i * yUnit;
        const xRandom = xCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
        const yRandom = yCurrent + (Math.random() - 0.5) * brushDiameter * 1.2;
        context.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
      }
    };

    const drawChalkCircle = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
      brushDiameter = 7
    ) => {
      context.lineCap = 'round';
      context.lineWidth = brushDiameter;
      context.strokeStyle = `rgba(255,255,255,${0.4 + Math.random() * 0.2})`;

      context.beginPath();
      context.arc(cx, cy, r, 0, Math.PI * 2);
      context.stroke();

      const circumference = 2 * Math.PI * r;
      const steps = Math.max(12, Math.round(circumference / (5 / brushDiameter)));
      for (let i = 0; i < steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const x = cx + r * Math.cos(t);
        const y = cy + r * Math.sin(t);
        const xRandom = x + (Math.random() - 0.5) * brushDiameter * 1.2;
        const yRandom = y + (Math.random() - 0.5) * brushDiameter * 1.2;
        context.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
      }
    };

    const redraw = () => {
      setSize();
      const { width, height } = canvas;
      drawBackgroundPattern(ctx, width, height);

      // Draw a straight line
      const margin = Math.min(width, height) * 0.12;
      const x1 = margin;
      const y1 = height * 0.25;
      const x2 = width - margin;
      const y2 = height * 0.25;
      drawChalkLine(ctx, x1, y1, x2, y2, 8);

      // Draw a circle
      const radius = Math.min(width, height) * 0.18;
      const cx = width * 0.5;
      const cy = height * 0.6;
      drawChalkCircle(ctx, cx, cy, radius, 10);
    };

    redraw();

    const handleResize = () => redraw();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // B. Crayon oval around text on white paper
  useEffect(() => {
    const canvas = crayonCanvasRef.current;
    const container = crayonContainerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      const { clientWidth, clientHeight } = container;
      canvas.width = clientWidth;
      canvas.height = clientHeight;
    };

    const drawWhitePaperBackground = (context: CanvasRenderingContext2D, width: number, height: number) => {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, width, height);
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const r = Math.random() * 0.6;
        context.fillStyle = 'rgba(0,0,0,0.02)';
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2);
        context.fill();
      }
    };

    const drawCrayonOval = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      color: string
    ) => {
      const passes = [
        { width: 14, alpha: 0.35, jitter: 2.2 },
        { width: 12, alpha: 0.55, jitter: 1.6 },
        { width: 9, alpha: 0.9, jitter: 1.1 }
      ];

      const pointsCount = 180;
      const base = new Array(pointsCount).fill(0).map((_, i) => {
        const t = (i / pointsCount) * Math.PI * 2;
        return {
          x: cx + rx * Math.cos(t),
          y: cy + ry * Math.sin(t)
        };
      });

      for (const p of passes) {
        context.strokeStyle = color.replace('ALPHA', String(p.alpha));
        context.lineWidth = p.width;
        context.lineCap = 'round';
        context.beginPath();
        const first = base[0];
        context.moveTo(first.x, first.y);
        for (let i = 1; i < base.length; i++) {
          const b = base[i];
          const nx = -((b.y - cy) / (ry || 1));
          const ny = (b.x - cx) / (rx || 1);
          const mag = Math.hypot(nx, ny) || 1;
          const j = p.jitter * (Math.random() - 0.5);
          context.lineTo(b.x + (nx / mag) * j, b.y + (ny / mag) * j);
        }
        context.closePath();
        context.stroke();
      }

      // short tail overlap
      context.strokeStyle = color.replace('ALPHA', '0.9');
      context.lineWidth = 9;
      context.lineCap = 'round';
      const startAngle = -Math.PI;
      const tailLen = Math.PI * 0.18;
      context.beginPath();
      for (let t = startAngle; t < startAngle + tailLen; t += 0.05) {
        const x = cx + rx * Math.cos(t);
        const y = cy + ry * Math.sin(t);
        if (t === startAngle) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    };

    const redraw = () => {
      setSize();
      const { width, height } = canvas;
      drawWhitePaperBackground(ctx, width, height);

      const fontSize = Math.max(22, Math.min(64, Math.floor(Math.min(width, height) * 0.08)));
      ctx.font = `${fontSize}px system-ui, -apple-system, Segoe UI, Roboto, Arial`;
      ctx.fillStyle = '#111';
      const text = '∠PAB = 90°';
      const metrics = ctx.measureText(text);
      const textWidth = metrics.width;
      const textHeight = fontSize * 1.2;
      const textX = (width - textWidth) / 2;
      const textY = height * 0.5;
      ctx.textBaseline = 'middle';
      ctx.fillText(text, textX, textY);

      const padX = textWidth * 0.18;
      const padY = textHeight * 0.6;
      const cx = textX + textWidth / 2;
      const cy = textY;
      const rx = textWidth / 2 + padX;
      const ry = textHeight / 2 + padY;
      drawCrayonOval(ctx, cx, cy, rx, ry, 'rgba(32,114,255,ALPHA)');
    };

    redraw();
    const onResize = () => redraw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="chalk-static-page">
      <div className="section-title">粉笔颗粒感（黑板）</div>
      <div className="panel" ref={chalkContainerRef}>
        <canvas ref={chalkCanvasRef} className="chalk-canvas" />
      </div>

      <div className="section-title">蜡笔圈选（白纸）</div>
      <div className="panel" ref={crayonContainerRef}>
        <canvas ref={crayonCanvasRef} className="chalk-canvas" />
      </div>
    </div>
  );
};

export default ChalkStaticDemo;


