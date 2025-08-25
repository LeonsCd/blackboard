import React from 'react';
import 'katex/dist/katex.min.css';
import './MathBlackboard.css';
import CustomKaTeX from './CustomKaTeX';

const MathBlackboard: React.FC = () => {
  const mathExpressions = [
    '\\colorbox{red}{2020}',
    '\\cancel{张三}',
    '\\bcancel{lisi}',
    '{\\color{red}\\bcancel{abc}}',
    '\\frac{2\\cancel{x}}{\\cancel{x}}',
    // 使用可定位的自定义语法
    '{\\color{red}\\bcancel{abc}}\\class{findable-element}{E=mc^2}\\frac{2\\cancel{x}}{\\cancel{x}}',
    '\\id{special-node}{x+y=z}'
  ];

  return (
    <div className="math-blackboard">
      <h1 className="math-title">数学板书</h1>
      <div className="math-content">
        {mathExpressions.map((expression, index) => (
          <div key={index} className="math-expression">
            <CustomKaTeX expression={expression} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MathBlackboard;
