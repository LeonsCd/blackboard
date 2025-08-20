import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface RibbonProps {
  color?: string; // 如: 'yellow' | '#ffb681' | 'rgba(...)'
  cycles?: number;
  amp?: number; // 自定义振幅，像素
  className?: string;
  children: React.ReactNode;
}

interface Size { width: number; height: number; }

function buildWavyPath(width: number, height: number, options: { step?: number; amp?: number; cycles?: number } = {}): string {
  const step = options.step || Math.max(12, Math.min(28, Math.floor(width / 36)));
  const amp = options.amp ?? Math.min(6, Math.max(2, height * 0.12));
  const cycles = options.cycles ?? 2;
  const x = 0;
  const y = 0;
  const w = width;
  const h = height;

  const top: [number, number][] = [];
  const bottom: [number, number][] = [];
  for (let i = 0; i <= w; i += step) {
    const t = i / w;
    const yy = y + Math.sin(t * Math.PI * 2 * cycles) * amp;
    top.push([x + i, yy]);
    bottom.push([x + i, yy + h]);
  }
  const endY = y + Math.sin(2 * Math.PI * cycles) * amp;
  top[top.length - 1] = [x + w, endY];
  bottom[bottom.length - 1] = [x + w, endY + h];

  const segmentsFrom = (pts: [number, number][], isMove: boolean) => {
    let d = '';
    if (isMove) d += `M ${pts[0][0]} ${pts[0][1]}`; else d += `L ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [cx, cy] = pts[i];
      const [nx, ny] = pts[i + 1];
      const mx = (cx + nx) / 2;
      const my = (cy + ny) / 2;
      d += ` Q ${cx} ${cy} ${mx} ${my}`;
    }
    d += ` L ${pts[pts.length - 1][0]} ${pts[pts.length - 1][1]}`;
    return d;
  };

  let d = segmentsFrom(top, true);
  d += ` L ${x + w} ${bottom[bottom.length - 1][1]}`;
  d += segmentsFrom(bottom.slice().reverse(), false);
  d += ` L ${x} ${top[0][1]}`;
  d += ' Z';
  return d;
}

const Ribbon: React.FC<RibbonProps> = ({ color = 'rgba(255, 81, 28, 0.22)', cycles = 2, amp, className, children }) => {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setSize({ width: Math.ceil(rect.width) + 16, height: Math.ceil(rect.height) + 12 }); // padding
    });
    ro.observe(el);
    const rect = el.getBoundingClientRect();
    setSize({ width: Math.ceil(rect.width) + 16, height: Math.ceil(rect.height) + 12 });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    svgRef.current.setAttribute('width', String(size.width));
    svgRef.current.setAttribute('height', String(size.height));

    const existing = svgRef.current.querySelectorAll('path');
    existing.forEach(n => n.remove());

    if (size.width === 0 || size.height === 0) return;

    const d = buildWavyPath(size.width, size.height, { cycles, amp });

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', color);
    path.setAttribute('stroke', 'none');
    path.setAttribute('filter', 'url(#ribbon-blur)');

    let defs = svgRef.current.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svgRef.current.appendChild(defs);
    }
    if (!svgRef.current.querySelector('#ribbon-blur')) {
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', 'ribbon-blur');
      const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
      blur.setAttribute('stdDeviation', '0.9');
      filter.appendChild(blur);
      defs.appendChild(filter);
    }

    const edge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    edge.setAttribute('d', d);
    edge.setAttribute('fill', 'none');
    edge.setAttribute('stroke', color);
    edge.setAttribute('stroke-width', '1.2');
    edge.setAttribute('opacity', '0.5');
    edge.setAttribute('filter', 'url(#ribbon-blur)');
    edge.setAttribute('stroke-linejoin', 'round');
    edge.setAttribute('stroke-linecap', 'round');

    svgRef.current.appendChild(path);
    svgRef.current.appendChild(edge);
  }, [size.width, size.height, color, cycles, amp]);

  return (
    <span ref={wrapperRef} className={`ribbon-wrapper ${className ?? ''}`.trim()}>
      <svg ref={svgRef} className="inline-svg-overlay" aria-hidden="true" />
      <span className="ribbon-content">{children}</span>
    </span>
  );
};

export default Ribbon;
