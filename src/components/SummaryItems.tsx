import React from 'react';

// 補正のまとめ表示 ("属性+10%, 系統+5%, ...") を項目単位で折り返す。
// 項目の途中(数字や記号の途中)では改行しない。
export const SummaryItems: React.FC<{ text: string }> = ({ text }) => {
  const items = text.split(', ');
  return (
    <>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span style={{ whiteSpace: 'nowrap' }}>{i < items.length - 1 ? `${item},` : item}</span>
          {i < items.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </>
  );
};
