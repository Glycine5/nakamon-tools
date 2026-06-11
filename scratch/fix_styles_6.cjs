const fs = require('fs');

// 1. Update TaiseiSearch.tsx
let taisei = fs.readFileSync('src/components/TaiseiSearch.tsx', 'utf8');
taisei = taisei.replace(
  /style=\{\{ padding: '8px 16px', fontSize: '1\.0rem' \}\}\s*>\s*🔍 耐性絞り込み/g, 
  "style={{ padding: '8px 16px', fontSize: '0.9rem' }}\n        >\n          🔍 耐性絞り込み"
);
taisei = taisei.replace(
  /style=\{\{ padding: '8px 16px', fontSize: '1\.0rem' \}\}\s*>\s*📊 耐性比較マトリクス/g, 
  "style={{ padding: '8px 16px', fontSize: '0.9rem' }}\n        >\n          📊 耐性比較マトリクス"
);
fs.writeFileSync('src/components/TaiseiSearch.tsx', taisei, 'utf8');

// 2. Update Damedasu.tsx
let damedasu = fs.readFileSync('src/components/Damedasu.tsx', 'utf8');
damedasu = damedasu.replace(/fontSize: '0\.77rem', color: 'var\(--text-muted\)'/g, "fontSize: '0.88rem', color: 'var(--text-muted)'");
fs.writeFileSync('src/components/Damedasu.tsx', damedasu, 'utf8');

console.log('done fixing styles');
