import React from 'react';
import { attributeNames } from '../data/constants';

interface AttributeBadgeProps {
  attrId: number;
}

export const AttributeBadge: React.FC<AttributeBadgeProps> = ({ attrId }) => {
  const styles: Record<number, { bg: string, border: string, text: string }> = {
    10: { bg: 'rgba(116, 125, 140, 0.12)', border: 'rgba(116, 125, 140, 0.3)', text: 'var(--text-secondary)' }, // 無属性
    11: { bg: 'rgba(255, 71, 87, 0.12)', border: 'rgba(255, 71, 87, 0.3)', text: '#d63031' }, // メラ
    12: { bg: 'rgba(255, 165, 2, 0.12)', border: 'rgba(255, 165, 2, 0.3)', text: '#e17055' }, // ギラ
    13: { bg: 'rgba(236, 204, 104, 0.18)', border: 'rgba(236, 204, 104, 0.45)', text: '#8a6d1c' }, // イオ
    14: { bg: 'rgba(112, 161, 255, 0.12)', border: 'rgba(112, 161, 255, 0.3)', text: '#1e90ff' }, // ヒャド
    15: { bg: 'rgba(46, 213, 115, 0.12)', border: 'rgba(46, 213, 115, 0.3)', text: '#20bf6b' }, // バギ
    16: { bg: 'rgba(210, 180, 140, 0.18)', border: 'rgba(210, 180, 140, 0.4)', text: '#70532f' }, // ジバ
    17: { bg: 'rgba(255, 213, 0, 0.14)', border: 'rgba(255, 213, 0, 0.4)', text: '#b38600' }, // デイン (雷光イエロー・イオの茶金と差別化)
    18: { bg: 'rgba(165, 94, 234, 0.12)', border: 'rgba(165, 94, 234, 0.3)', text: '#6c5ce7' }, // ドルマ
    37: { bg: 'rgba(0, 206, 201, 0.12)', border: 'rgba(0, 206, 201, 0.35)', text: '#00979f' }, // ザバ (波しぶきアクア・ヒャドの青と差別化)
    19: { bg: 'rgba(255, 107, 129, 0.12)', border: 'rgba(255, 107, 129, 0.3)', text: '#e84393' }  // 回復
  };
  
  const attrName = attributeNames[attrId] || '無';
  const style = styles[attrId] || { bg: 'rgba(116, 125, 140, 0.12)', border: 'rgba(116, 125, 140, 0.3)', text: 'var(--text-secondary)' };
  
  return (
    <span style={{
      display: 'inline-block',
      backgroundColor: style.bg,
      border: `1px solid ${style.border}`,
      color: style.text,
      borderRadius: '4px',
      padding: '2px 8px',
      fontSize: '0.83rem',
      fontWeight: 'bold',
      letterSpacing: '0.02em',
      lineHeight: '1.2'
    }}>
      {attrName}
    </span>
  );
};
