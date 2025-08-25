import React from 'react';
import { useCounterStore } from '../store/useCounterStore';

const buttonStyle: React.CSSProperties = {
  padding: '8px 12px',
  marginRight: 8,
  background: '#111827',
  color: '#fff',
  borderRadius: 6,
  border: '1px solid #374151',
  cursor: 'pointer',
};

const cardStyle: React.CSSProperties = {
  maxWidth: 520,
  margin: '0 auto',
  background: 'rgba(17,24,39,0.6)',
  border: '1px solid #374151',
  borderRadius: 12,
  padding: 24,
  color: '#E5E7EB',
};

const ZustandDemo: React.FC = () => {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div style={{ padding: 24 }}>
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Zustand 计数器演示</h2>
        <p style={{ fontSize: 48, margin: '16px 0' }}>{count}</p>
        <div>
          <button style={buttonStyle} onClick={increment}>+1</button>
          <button style={buttonStyle} onClick={decrement}>-1</button>
          <button style={buttonStyle} onClick={reset}>重置</button>
        </div>
      </div>
    </div>
  );
};

export default ZustandDemo;


