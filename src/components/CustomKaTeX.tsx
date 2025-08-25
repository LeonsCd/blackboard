import React, { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface CustomKaTeXProps {
  expression: string;
  onRender?: (elements: HTMLElement[]) => void;
}

const CustomKaTeX: React.FC<CustomKaTeXProps> = ({ expression, onRender }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        // 扩展 KaTeX 宏定义
        const macros = {
          '\\class': '\\htmlClass{#1}{#2}',
          '\\id': '\\htmlId{#1}{#2}',
          '\\customtag': '\\htmlClass{custom-tag}{#1}',
          '\\findable': '\\htmlClass{findable-element}{#1}',
        };

        katex.render(expression, containerRef.current, {
          throwOnError: false,
          errorColor: '#cc0000',
          displayMode: true,
          macros,
          // 自定义渲染器
          output: 'html',
          strict: false,
          trust: (context) => {
            // 允许使用与可定位相关的 HTML 扩展
            const allowed = ['\\htmlClass', '\\htmlId'];
            return allowed.includes(context.command);
          },
        });

        // 渲染完成后查找所有带有特定class的元素
        if (onRender) {
          const findableElements = containerRef.current.querySelectorAll('.findable-element');
          onRender(Array.from(findableElements) as HTMLElement[]);

          // 为每个可查找元素添加点击事件
          findableElements.forEach((element, index) => {
            element.setAttribute('data-index', index.toString());
            element.addEventListener('click', () => {
              console.log(`点击了第 ${index} 个可查找元素:`, element);
            });
          });
        }
      } catch (error) {
        console.warn('KaTeX渲染失败:', error);
        if (containerRef.current) {
          containerRef.current.textContent = `渲染错误: ${expression}`;
        }
      }
    }
  }, [expression, onRender]);

  return (
    <div className="custom-katex">
      <div ref={containerRef} className="katex-container" />
    </div>
  );
};

export default CustomKaTeX;
