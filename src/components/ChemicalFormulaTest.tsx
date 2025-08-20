import React from 'react';
import { ChemicalFormula } from './MarkdownRenderer';

const ChemicalFormulaTest: React.FC = () => {
  const testFormulas = [
    'H2O', 'CO2', 'H+', 'OH-', 'NaCl', 'H2SO4', 'NaOH', 'HCl', 'Ca2+', 'Fe3+', 'CuSO4'
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">化学公式渲染测试</h2>
      <div className="space-y-2">
        {testFormulas.map((formula, index) => (
          <div key={index} className="flex items-center space-x-4">
            <span className="text-gray-600 w-20">{formula}:</span>
            <ChemicalFormula>{formula}</ChemicalFormula>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChemicalFormulaTest;
