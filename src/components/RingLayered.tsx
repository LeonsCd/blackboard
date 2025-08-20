import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface RingLayeredProps {
  stroke?: string;
  rotate?: number; // 旋转角度
  baseWidth?: number; // 中段目标粗细
  variation?: number; // 首尾变细幅度 0~1
  wobble?: number; // 边缘抖动强度
  gapDeg?: number; // 缺口角度
  overshootDeg?: number; // 对称外甩角
  overlapRatio?: number; // 交叠比例（当未给 overshootDeg 时使用）
  bulgePx?: number; // 半径起伏幅度
  bellPower?: number; // 中段饱满度
  endTaper?: number; // 尾段收细
  overWindowDeg?: number; // 尾段覆盖窗口长度
  forkOffsetPx?: number; // 尾段最大外推量
  featherDeg?: number; // 覆盖段起点回退角（羽化/消接缝）
  className?: string;
  children: React.ReactNode;
}

const ensureFilters = (svg: SVGSVGElement) => {
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);
  }
  if (!svg.querySelector('#chalk-ring-filter')) {
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'chalk-ring-filter');
    filter.setAttribute('x', '-10%');
    filter.setAttribute('y', '-10%');
    filter.setAttribute('width', '120%');
    filter.setAttribute('height', '120%');

    const turb = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
    turb.setAttribute('type', 'fractalNoise');
    turb.setAttribute('baseFrequency', '0.8');
    turb.setAttribute('numOctaves', '2');
    turb.setAttribute('seed', String(Math.floor(Math.random() * 10000)));
    turb.setAttribute('result', 'noise');

    const disp = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
    disp.setAttribute('in', 'SourceGraphic');
    disp.setAttribute('in2', 'noise');
    disp.setAttribute('scale', '1.3');
    disp.setAttribute('xChannelSelector', 'R');
    disp.setAttribute('yChannelSelector', 'G');

    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    blur.setAttribute('stdDeviation', '0.25');

    filter.appendChild(turb);
    filter.appendChild(disp);
    filter.appendChild(blur);
    defs.appendChild(filter);
  }
};

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function buildSplitBandPaths(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  baseWidth: number,
  variation: number,
  wobble: number,
  gapRad: number,
  overshootStartRad: number,
  overshootEndRad: number,
  bulgePx: number,
  bellPower: number,
  endTaper: number,
  overWindowRad: number,
  forkMaxPx: number,
  featherRad: number
): { dUnder: string; dOver: string } {
  const twoPi = Math.PI * 2;
  const coreStart = -Math.PI / 6;
  const thetaStart = coreStart - overshootStartRad;
  const thetaEnd = coreStart + (twoPi - gapRad) + overshootEndRad;
  const segments = 220;

  const outerUnder: [number, number][] = [];
  const innerUnder: [number, number][] = [];
  const outerOver: [number, number][] = [];
  const innerOver: [number, number][] = [];

  const phase = Math.random() * twoPi;
  const bulgePhase = Math.random() * twoPi;

  const totalLen = thetaEnd - thetaStart;
  const overStartCore = thetaEnd - overWindowRad;
  const overStart = overStartCore - featherRad; // 回退少许，羽化接缝

  for (let i = 0; i <= segments; i++) {
    const t = thetaStart + (i / segments) * totalLen;
    const progress = (t - thetaStart) / totalLen; // 0..1

    const minThickness = Math.max(0.7, baseWidth * (1 - variation));
    const bell = Math.pow(Math.sin(Math.PI * progress), bellPower);
    const endFactor = 1 - endTaper * smoothstep(0.85, 1.0, progress);
    const thickness = (minThickness + (baseWidth - minThickness) * bell) * endFactor;

    const rxVar = rx + bulgePx * Math.sin(2 * t + bulgePhase);
    const ryVar = ry + bulgePx * 0.8 * Math.cos(2.2 * t + bulgePhase * 0.9);

    // 平滑外推：仅在 overStartCore→thetaEnd 内提升到 forkMax
    const fork = forkMaxPx * Math.pow(smoothstep(overStartCore, thetaEnd, t), 1.25);

    const jitterX = wobble * 0.6 * Math.sin(7 * t + phase * 0.7);
    const jitterY = wobble * 0.6 * Math.cos(5 * t + phase * 0.9);

    const ox = rxVar + thickness / 2 + fork;
    const oy = ryVar + thickness / 2 + fork;
    const ix = rxVar - thickness / 2 + fork;
    const iy = ryVar - thickness / 2 + fork;

    const O: [number, number] = [cx + (ox * Math.cos(t)) + jitterX, cy + (oy * Math.sin(t)) + jitterY];
    const I: [number, number] = [cx + (ix * Math.cos(t)) - jitterX, cy + (iy * Math.sin(t)) - jitterY];

    if (t < overStart) {
      outerUnder.push(O);
      innerUnder.push(I);
    } else {
      outerOver.push(O);
      innerOver.push(I);
    }
  }

  const move = (p: [number, number]) => `M ${p[0]} ${p[1]}`;
  const line = (p: [number, number]) => `L ${p[0]} ${p[1]}`;

  let dUnder = '';
  if (outerUnder.length > 0) {
    dUnder = move(outerUnder[0]);
    for (let i = 1; i < outerUnder.length; i++) dUnder += ` ${line(outerUnder[i])}`;
    for (let i = innerUnder.length - 1; i >= 0; i--) dUnder += ` ${line(innerUnder[i])}`;
    dUnder += ' Z';
  }

  let dOver = '';
  if (outerOver.length > 0) {
    dOver = move(outerOver[0]);
    for (let i = 1; i < outerOver.length; i++) dOver += ` ${line(outerOver[i])}`;
    for (let i = innerOver.length - 1; i >= 0; i--) dOver += ` ${line(innerOver[i])}`;
    dOver += ' Z';
  }

  return { dUnder, dOver };
}

const RingLayered: React.FC<RingLayeredProps> = ({
  stroke = '#fff',
  rotate = 0,
  baseWidth = 3.0,
  variation = 0.72,
  wobble = 0.7,
  gapDeg = 20,
  overshootDeg,
  overlapRatio = 0.35,
  bulgePx = 2.0,
  bellPower = 1.8,
  endTaper = 0.32,
  overWindowDeg = 60,
  forkOffsetPx = 3.0,
  featherDeg = 3.0,
  className,
  children,
}) => {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [contentSize, setContentSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setContentSize({ width: Math.ceil(rect.width), height: Math.ceil(rect.height) });
    });
    ro.observe(el);
    const rect = el.getBoundingClientRect();
    setContentSize({ width: Math.ceil(rect.width), height: Math.ceil(rect.height) });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const pad = Math.max(18, Math.ceil(baseWidth * 4 + bulgePx * 3 + wobble * 4 + 12 + forkOffsetPx * 2));
    const svgW = contentSize.width + pad * 2;
    const svgH = contentSize.height + pad * 2;

    svg.style.left = `-${pad}px`;
    svg.style.top = `-${pad}px`;

    svg.setAttribute('width', String(svgW));
    svg.setAttribute('height', String(svgH));

    while (svg.firstChild) svg.removeChild(svg.firstChild);
    if (svgW === 0 || svgH === 0) return;

    ensureFilters(svg);

    const cx = svgW / 2;
    const cy = svgH / 2;
    const rx = contentSize.width / 2;
    const ry = contentSize.height / 2;

    const gapRad = (gapDeg * Math.PI) / 180;
    const overlapRad = overshootDeg === undefined ? Math.max(4 * (Math.PI / 180), gapRad * overlapRatio) : 0;
    const overshootStartRad = (overshootDeg !== undefined)
      ? (overshootDeg * Math.PI) / 180
      : (gapRad + overlapRad) / 2;
    const overshootEndRad = (overshootDeg !== undefined)
      ? (overshootDeg * Math.PI) / 180
      : (gapRad + overlapRad) / 2 + (2 * Math.PI) / 180;

    const overWindowRad = Math.max((overWindowDeg * Math.PI) / 180, (20 * Math.PI) / 180);
    const featherRad = (featherDeg * Math.PI) / 180;

    const { dUnder, dOver } = buildSplitBandPaths(
      cx,
      cy,
      rx,
      ry,
      baseWidth,
      variation,
      wobble,
      gapRad,
      overshootStartRad,
      overshootEndRad,
      bulgePx,
      bellPower,
      endTaper,
      overWindowRad,
      forkOffsetPx,
      featherRad
    );

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', `rotate(${rotate} ${cx} ${cy})`);
    group.setAttribute('filter', 'url(#chalk-ring-filter)');

    if (dUnder) {
      const fill = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      fill.setAttribute('d', dUnder);
      fill.setAttribute('fill', stroke);
      fill.setAttribute('fill-rule', 'evenodd');
      fill.setAttribute('clip-rule', 'evenodd');
      fill.setAttribute('opacity', '0.72');
      const edge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      edge.setAttribute('d', dUnder);
      edge.setAttribute('fill', 'none');
      edge.setAttribute('stroke', stroke);
      edge.setAttribute('stroke-width', '0.8');
      edge.setAttribute('opacity', '0.58');
      group.appendChild(fill);
      group.appendChild(edge);
    }

    if (dOver) {
      const fillO = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      fillO.setAttribute('d', dOver);
      fillO.setAttribute('fill', stroke);
      fillO.setAttribute('fill-rule', 'evenodd');
      fillO.setAttribute('clip-rule', 'evenodd');
      fillO.setAttribute('opacity', '0.9');
      const edgeO = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      edgeO.setAttribute('d', dOver);
      edgeO.setAttribute('fill', 'none');
      edgeO.setAttribute('stroke', stroke);
      edgeO.setAttribute('stroke-width', '1.05');
      edgeO.setAttribute('opacity', '0.82');
      group.appendChild(fillO);
      group.appendChild(edgeO);
    }

    svg.appendChild(group);
  }, [contentSize.width, contentSize.height, stroke, rotate, baseWidth, variation, wobble, gapDeg, overshootDeg, overlapRatio, bulgePx, bellPower, endTaper, overWindowDeg, forkOffsetPx, featherDeg]);

  return (
    <span ref={wrapperRef} className={`ring-wrapper ${className ?? ''}`.trim()}>
      <svg ref={svgRef} className="inline-svg-overlay ring-svg" aria-hidden="true" />
      <span className="ring-content">{children}</span>
    </span>
  );
};

export default RingLayered;
