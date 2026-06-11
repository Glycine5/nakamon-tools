const fs = require('fs');

function modifyFile(file, prefix) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add handleReset
  const resetFunc = `
  const handleReset = () => {
    if (window.confirm('すべての設定を初期状態に戻しますか？（保存したプリセットは消えません）')) {
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith('${prefix}')) localStorage.removeItem(k);
      });
      window.location.reload();
    }
  };
`;

  if (!content.includes('handleReset = () =>')) {
    content = content.replace(
      "const handleSavePreset = () => {",
      resetFunc + "\n  const handleSavePreset = () => {"
    );
  }

  // 2. Replace the buttons div
  const oldButtonsRegex = /<div style=\{\{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '12px' \}\}>[\s\S]*?<\/div>/;
  
  const newButtons = `
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <button onClick={handleReset} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>🔄</span> リセット
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleSavePreset} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}>💾 保存</button>
          <button onClick={() => setIsPresetModalOpen(true)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}>📂 呼出</button>
        </div>
      </div>`;

  content = content.replace(oldButtonsRegex, newButtons.trim());

  fs.writeFileSync(file, content, 'utf8');
}

modifyFile('src/components/Damedasu.tsx', 'dqw_dam_');
modifyFile('src/components/TwoPan.tsx', 'dqw_two_');

console.log('Modified Damedasu.tsx and TwoPan.tsx');
