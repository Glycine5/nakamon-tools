const fs = require('fs');

function injectButtons(file) {
  let content = fs.readFileSync(file, 'utf8');

  const buttons = `
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '12px' }}>
        <button onClick={handleSavePreset} style={{ background: 'rgba(229,169,59,0.1)', border: '1px solid rgba(229,169,59,0.3)', color: 'var(--accent-gold)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}>💾 保存</button>
        <button onClick={() => setIsPresetModalOpen(true)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}>📂 呼出</button>
      </div>`;

  if (!content.includes('💾 保存')) {
    content = content.replace(
      /<div className="fade-in">/,
      '<div className="fade-in">' + buttons
    );
  }
  
  fs.writeFileSync(file, content, 'utf8');
}

injectButtons('src/components/Damedasu.tsx');
injectButtons('src/components/TwoPan.tsx');

console.log('Injected buttons.');
