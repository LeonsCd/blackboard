import React, { useEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import './BlackboardDemo.css';
import Ribbon from './Ribbon';
import Ring from './Ring';
import RingLayered from './RingLayered';

// 颜色映射
const COLOR_MAP = {
  yellow: '#ffe678',
  orange: '#ffb681',
  pink: '#ff9eb3',
  blue: '#9ad4ff',
};

// Rough.js 类型定义
interface RoughCanvas {
  ellipse: (x: number, y: number, width: number, height: number, options: Record<string, unknown>) => SVGElement;
  curve: (points: [number, number][], options: Record<string, unknown>) => SVGElement;
}

const BlackboardDemo: React.FC = () => {
  // 全局手绘交互 SVG
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [pathEl, setPathEl] = useState<SVGElement | null>(null);
  const [points, setPoints] = useState<[number, number][]>([]);
  const [rc, setRc] = useState<RoughCanvas | null>(null);

  // 初始化roughjs
  useEffect(() => {
    if (svgRef.current) {
      const roughCanvas = rough.svg(svgRef.current) as unknown as RoughCanvas;
      setRc(roughCanvas);
    }
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    svgRef.current.setAttribute('width', String(window.innerWidth));
    svgRef.current.setAttribute('height', String(window.innerHeight));
    const onResize = () => {
      if (!svgRef.current) return;
      svgRef.current.setAttribute('width', String(window.innerWidth));
      svgRef.current.setAttribute('height', String(window.innerHeight));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 手绘交互
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!e.altKey || !svgRef.current || !rc) return;
    setDrawing(true);
    const newPoints: [number, number][] = [[e.clientX, e.clientY]];
    setPoints(newPoints);
    const newPathEl = rc.curve(newPoints, { stroke: '#fff', strokeWidth: 2, roughness: 3, bowing: 2 });
    setPathEl(newPathEl);
    svgRef.current.appendChild(newPathEl);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drawing || !svgRef.current || !rc || !pathEl) return;
    const newPoints: [number, number][] = [...points, [e.clientX, e.clientY]];
    setPoints(newPoints);
    svgRef.current.removeChild(pathEl);
    const newPathEl = rc.curve(newPoints, { stroke: '#fff', strokeWidth: 2, roughness: 3, bowing: 2 });
    setPathEl(newPathEl);
    svgRef.current.appendChild(newPathEl);
  };
  const handlePointerUp = () => {
    setDrawing(false);
    setPoints([]);
    setPathEl(null);
  };

  return (
    <div className="blackboard-container">
      {/* 背景层 */}
      <div className="noise-layer" />
      <div className="scratch-layer" />

      {/* 手绘交互层（Alt按住绘制） */}
      <svg
        ref={svgRef}
        className="fx-svg"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      <main className="board" id="board">
        <div className="title">练上，可知全等条件如下</div>

        <div className="chalk-text">
          1. ∠PMA = ∠AOB = 90°（直角）
        </div>
        <div className="chalk-text">
          2. ∠PAM = ∠OBA <Ribbon color={COLOR_MAP.yellow}>同角的余角相等</Ribbon>
        </div>
        <div className="chalk-text">
          3. PA = AB <Ribbon color="rgba(255, 81, 28, 0.22)">等腰直角三角形△PAB的两直角边</Ribbon>
        </div>

        <div className="answers" style={{ gap: 24 }}>
          {/* 左：旧版（单路径丝带） 右：新版（两层+羽化） */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ color: '#fff', opacity: .8, fontSize: 14 }}>单路径</div>
            <Ring stroke="#ff8d8d" gapDeg={22} overshootDeg={28} overWindowDeg={44} baseWidth={3.0} bellPower={1.8} endTaper={0.32} wobble={0.6} bulgePx={2.0} rotate={-10}>
              <span className="answer">答案：A</span>
            </Ring>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ color: '#fff', opacity: .8, fontSize: 14 }}>单路径（极开口）</div>
            <Ring
              stroke="#ff8d8d"
              gapDeg={16}
              overshootDeg={48}
              overWindowDeg={84}
              baseWidth={2.6}
              bellPower={2.0}
              endTaper={0.38}
              wobble={0.55}
              bulgePx={1.6}
              forkOffsetPx={3.8}
              rotate={-12}
            >
              <span className="answer">答案：A</span>
            </Ring>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ color: '#fff', opacity: .8, fontSize: 14 }}>两层+羽化</div>
            <RingLayered stroke="#ffe678" gapDeg={20} overlapRatio={0.35} overWindowDeg={60} baseWidth={3.0} bellPower={1.8} endTaper={0.32} wobble={0.6} bulgePx={2.0} forkOffsetPx={3.0} rotate={-10}>
              <span className="answer">答案：B</span>
            </RingLayered>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ color: '#fff', opacity: .8, fontSize: 14 }}>两层+羽化（极开口）</div>
            <RingLayered
              stroke="#ffe678"
              gapDeg={16}
              overshootDeg={50}
              overWindowDeg={84}
              baseWidth={2.6}
              bellPower={2.0}
              endTaper={0.38}
              wobble={0.55}
              bulgePx={1.6}
              forkOffsetPx={3.8}
              featherDeg={5.0}
              rotate={-12}
            >
              <span className="answer">答案：B</span>
            </RingLayered>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlackboardDemo;
