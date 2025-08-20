import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

export interface RingProps {
  stroke?: string;
  rotate?: number; // 旋转角度
  baseWidth?: number; // 中段的目标粗细（px）
  variation?: number; // 首尾变细幅度 0~1（越大两端越细）
  wobble?: number; // 边缘抖动强度 0~2
  gapDeg?: number; // 缺口角度（度）
  overshootDeg?: number; // 对称超出角度（度）—若提供，会覆盖 overlapRatio 的推导
  overlapRatio?: number; // 两端交叠程度相对 gap 的比例（0~1），默认 0.2 = 超出去五分之一
  bulgePx?: number; // 半径起伏的幅度（像素），营造“有高有低”
  bellPower?: number; // 厚度“钟形”幂次，越大中段越饱满
  endTaper?: number; // 收笔更细(0~1)，越大尾端越细
  overWindowDeg?: number; // 尾段抬起窗口长度（度）
  forkOffsetPx?: number; // 尾段最大外推量（像素），用于“分叉”幻觉（平滑过渡）
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

function buildSingleRibbonPath(
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
  forkMaxPx: number,
  overWindowRad: number
): string {
  const twoPi = Math.PI * 2;
  const coreStart = -Math.PI / 6; // 基准起点
  const thetaStart = coreStart - overshootStartRad;
  const thetaEnd = coreStart + (twoPi - gapRad) + overshootEndRad;
  const segments = 220;

  const outer: [number, number][] = [];
  const inner: [number, number][] = [];

  const phase = Math.random() * twoPi;
  const bulgePhase = Math.random() * twoPi;

  const totalLen = thetaEnd - thetaStart;
  const overStart = thetaEnd - overWindowRad; // 尾段抬起开始

  for (let i = 0; i <= segments; i++) {
    const t = thetaStart + (i / segments) * totalLen;
    const progress = (t - thetaStart) / totalLen; // 0..1

    // 中段饱满、两端细
    const minThickness = Math.max(0.7, baseWidth * (1 - variation));
    const bell = Math.pow(Math.sin(Math.PI * progress), bellPower);
    const endFactor = 1 - endTaper * smoothstep(0.85, 1.0, progress);
    const thickness = (minThickness + (baseWidth - minThickness) * bell) * endFactor;

    // 半径起伏（有高有低）
    const rxVar = rx + bulgePx * Math.sin(2 * t + bulgePhase);
    const ryVar = ry + bulgePx * 0.8 * Math.cos(2.2 * t + bulgePhase * 0.9);

    // 椭圆外法线（用梯度近似）
    const nxRaw = Math.cos(t) / Math.max(1e-3, rxVar);
    const nyRaw = Math.sin(t) / Math.max(1e-3, ryVar);
    const nLen = Math.hypot(nxRaw, nyRaw) || 1;
    const nx = nxRaw / nLen;
    const ny = nyRaw / nLen;

    // 尾段平滑外推量：仅在 overStart→thetaEnd 生效
    const fork = forkMaxPx * Math.pow(smoothstep(overStart, thetaEnd, t), 1.25);

    // 抖动
    const jitterX = wobble * 0.6 * Math.sin(7 * t + phase * 0.7);
    const jitterY = wobble * 0.6 * Math.cos(5 * t + phase * 0.9);

    const ox = rxVar + thickness / 2 + fork; // 外沿叠加外推
    const oy = ryVar + thickness / 2 + fork;
    const ix = rxVar - thickness / 2 + fork; // 内沿同向外推，形成整体“抬起”
    const iy = ryVar - thickness / 2 + fork;

    const O: [number, number] = [cx + (ox * Math.cos(t)) + jitterX + nx * 0, cy + (oy * Math.sin(t)) + jitterY + ny * 0];
    const I: [number, number] = [cx + (ix * Math.cos(t)) - jitterX + nx * 0, cy + (iy * Math.sin(t)) - jitterY + ny * 0];

    outer.push(O);
    inner.push(I);
  }

  const move = (p: [number, number]) => `M ${p[0]} ${p[1]}`;
  const line = (p: [number, number]) => `L ${p[0]} ${p[1]}`;

  let d = move(outer[0]);
  for (let i = 1; i < outer.length; i++) d += ` ${line(outer[i])}`;
  for (let i = inner.length - 1; i >= 0; i--) d += ` ${line(inner[i])}`;
  d += ' Z';
  return d;
}

const Ring: React.FC<RingProps> = ({
  stroke = '#fff',
  rotate = 0,
  baseWidth = 3.0,
  variation = 0.72,
  wobble = 0.7,
  gapDeg = 26,
  overshootDeg,
  overlapRatio = 0.2,
  bulgePx = 2.5,
  bellPower = 1.6,
  endTaper = 0.25,
  overWindowDeg = 24,
  forkOffsetPx = 3,
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

    // 动态边距，确保不裁剪
    const pad = Math.max(16, Math.ceil(baseWidth * 4 + bulgePx * 3 + wobble * 4 + 12 + forkOffsetPx * 2));
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
      : (gapRad + overlapRad) / 2 + (2 * Math.PI) / 180; // 尾端略多

    const overWindowRad = Math.max((overWindowDeg * Math.PI) / 180, (12 * Math.PI) / 180);

    const d = buildSingleRibbonPath(
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
      forkOffsetPx,
      overWindowRad
    );

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', `rotate(${rotate} ${cx} ${cy})`);
    group.setAttribute('filter', 'url(#chalk-ring-filter)');

    const fill = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fill.setAttribute('d', d);
    fill.setAttribute('fill', stroke);
    fill.setAttribute('fill-rule', 'evenodd');
    fill.setAttribute('clip-rule', 'evenodd');
    fill.setAttribute('opacity', '0.86');

    const edge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    edge.setAttribute('d', d);
    edge.setAttribute('fill', 'none');
    edge.setAttribute('stroke', stroke);
    edge.setAttribute('stroke-width', '1');
    edge.setAttribute('opacity', '0.78');

    group.appendChild(fill);
    group.appendChild(edge);
    svg.appendChild(group);
  }, [contentSize.width, contentSize.height, stroke, rotate, baseWidth, variation, wobble, gapDeg, overshootDeg, overlapRatio, bulgePx, bellPower, endTaper, overWindowDeg, forkOffsetPx]);

  return (
    <span ref={wrapperRef} className={`ring-wrapper ${className ?? ''}`.trim()}>
      <svg ref={svgRef} className="inline-svg-overlay ring-svg" aria-hidden="true" />
      <span className="ring-content">{children}</span>
    </span>
  );
};

export default Ring;
