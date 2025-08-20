import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './CurlyBraceDemo.css';

// Generate a scalable curly brace SVG string based on a provided height in SVG units
function makeSvg(height: number) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -${height / 2 + 250} 889 ${height}">
  <defs>
    <path id="top" d="M712 899L718 893V876V865Q718 854 704 846Q627 793 577 710T510 525Q510 524 509 521Q505 493 504 349Q504 345 504 334Q504 277 504 240Q504 -2 503 -4Q502 -8 494 -9T444 -10Q392 -10 390 -9Q387 -8 386 -5Q384 5 384 230Q384 262 384 312T383 382Q383 481 392 535T434 656Q510 806 664 892L677 899H712Z"/>
    <path id="bottom" d="M718 -893L712 -899H677L666 -893Q542 -825 468 -714T385 -476Q384 -466 384 -282Q384 3 385 5L389 9Q392 10 444 10Q486 10 494 9T503 4Q504 2 504 -239V-310V-366Q504 -470 508 -513T530 -609Q546 -657 569 -698T617 -767T661 -812T699 -843T717 -856T718 -876V-893Z"/>
    <path id="middle" d="M389 1159Q391 1160 455 1160Q496 1160 498 1159Q501 1158 502 1155Q504 1145 504 924Q504 691 503 682Q494 549 425 439T243 259L229 250L243 241Q349 175 421 66T503 -182Q504 -191 504 -424Q504 -600 504 -629T499 -659H498Q496 -660 444 -660T390 -659Q387 -658 386 -655Q384 -645 384 -425V-282Q384 -176 377 -116T342 10Q325 54 301 92T255 155T214 196T183 222T171 232Q170 233 170 250T171 268Q171 269 191 284T240 331T300 407T354 524T383 679Q384 691 384 925Q384 1152 385 1155L389 1159Z"/>
    <path id="bar" d="M384 0 H504 V100 H384 Z"/>
  </defs>
  <g fill="currentColor" transform="scale(1,-1)">
    <use href="#top" transform="translate(0, ${height / 2 - 659})"/>
    <use href="#bottom" transform="translate(0, -${height / 2 - 1159})"/>
    <use href="#middle"/>
    <use href="#bar" transform="translate(0, 1150) scale(1, ${(height - 3600) / 200})"/>
    <use href="#bar" transform="translate(0, -${height / 2 - 1150}) scale(1, ${(height - 3600) / 200})"/>
  </g>
</svg>`;
}

function computeSvgUnitsFromPixels(contentHeightPx: number): number {
  // Ensure the bars have non-negative scale; 3600 is the base from the glyph metrics
  // Use a multiplier so small pixel heights still produce a visible stretch
  const MIN_UNITS = 3600;
  const UNITS_PER_PX = 18; // tuning factor; adjust for visual density
  return Math.max(MIN_UNITS, Math.round(MIN_UNITS + contentHeightPx * UNITS_PER_PX));
}

const CurlyBraceDemo: React.FC = () => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentHeightPx, setContentHeightPx] = useState<number>(240);
  const [autoHeight, setAutoHeight] = useState<boolean>(true);
  const [manualHeightPx, setManualHeightPx] = useState<number>(240);

  // Observe content height changes
  useEffect(() => {
    if (!contentRef.current) return;
    const element = contentRef.current;
    const update = () => {
      const measured = element.scrollHeight;
      setContentHeightPx(Math.max(40, measured));
    };
    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(element);
    return () => ro.disconnect();
  }, []);

  const effectiveContentHeightPx = autoHeight ? contentHeightPx : manualHeightPx;

  const svgUnits = useMemo(() => computeSvgUnitsFromPixels(effectiveContentHeightPx), [effectiveContentHeightPx]);

  const leftBraceSvg = useMemo(() => makeSvg(svgUnits), [svgUnits]);
  const rightBraceSvg = useMemo(() => makeSvg(svgUnits), [svgUnits]);

  const onManualHeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!Number.isNaN(value)) {
      setManualHeightPx(Math.max(40, value));
    }
  }, []);

  return (
    <div className="brace-demo-page">
      <h2>大括号自适应高度演示</h2>
      <div className="controls">
        <label className="control">
          <input type="checkbox" checked={autoHeight} onChange={(e) => setAutoHeight(e.target.checked)} /> 自动高度
        </label>
        {!autoHeight && (
          <label className="control">
            高度(px)：
            <input type="number" min={40} step={10} value={manualHeightPx} onChange={onManualHeightChange} />
          </label>
        )}
        <span className="hint">当前内容高度：{Math.round(contentHeightPx)}px</span>
      </div>

      <div className="brace-layout" style={{ height: effectiveContentHeightPx }}>
        <div className="brace-svg left" aria-hidden="true" dangerouslySetInnerHTML={{ __html: leftBraceSvg }} />
        <div className="brace-content" ref={contentRef}>
          <div className="content-block" contentEditable suppressContentEditableWarning>
            在这里输入或粘贴内容，左、右大括号会根据内容高度自动伸缩。\n\n可切换“自动高度”，也可以手动指定高度（px）。
          </div>
        </div>
        <div className="brace-svg right" aria-hidden="true" dangerouslySetInnerHTML={{ __html: rightBraceSvg }} />
      </div>
    </div>
  );
};

export default CurlyBraceDemo;


