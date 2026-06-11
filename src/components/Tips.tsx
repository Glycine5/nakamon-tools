import React from 'react';

export const Tips: React.FC = () => {
  return (
    <div className="glass-panel" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '2px solid var(--accent-primary)', paddingBottom: '10px', marginBottom: '20px' }}>
        💡 使い方 Tips
      </h2>

      <section style={{ marginBottom: '30px' }}>
        <h3 style={{ color: 'var(--text-highlight)', marginBottom: '10px' }}>⚔️ ダメダス（ダメージ計算）の補正の選び方</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* 1. 属性 (斬・呪・ブ) / 系統 */}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--accent-secondary)' }}>1. 属性 (斬・呪・ブ) / 系統</h4>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>属性:</strong> 「メラ斬体(呪文・ブレス)+10%」などの特定属性への補正値の合計を入力します。
                <div style={{ fontSize: '0.9em', color: 'var(--text-muted)', marginTop: '4px' }}>
                  ※10%を選択すると全属性が10%盛られた状態になります。例えば、氷結乱撃(ヒャド)とメイルストロム(バギ)など、単体と全体で異なる属性の補正を同時に設定することはできません。
                </div>
              </li>
              <li style={{ marginBottom: '4px' }}>
                <strong>属性全:</strong> 「メラ・全+10%」などの補正値の合計を入力します。
              </li>
              <li>
                <strong>系統:</strong> 「撃・スライム+20%」などの系統補正値の合計を入力します。
              </li>
            </ul>
          </div>

          {/* 2. 光竜・神託 */}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--accent-secondary)' }}>2. 光竜・神託</h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              光竜1段階で+1、2段階で+2です。神託は+2です。光竜と神託の数値を足したものを選択してください。<br />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9em' }}>例: 光竜1段階(+1)と神託(+2)で「+3」を選択</span>
            </p>
          </div>

          {/* 3. 耐性（守備側）の入力 */}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--accent-secondary)' }}>3. 耐性（守備側）の入力</h4>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '4px' }}>
                <strong>属性耐性:</strong> ターゲットの「耐・メラ+30%」などの値を入力します。
              </li>
              <li style={{ marginBottom: '4px' }}>
                <strong>系統耐性:</strong> 「耐・スライム+20%」などの値を入力します。
              </li>
              <li>
                <strong>斬体・呪文・ブレス耐性:</strong> 「耐・斬撃、耐・体技」「耐・じゅもん」「耐・ブレス」の数値を入力します。
                <div style={{ fontSize: '0.9em', color: 'var(--text-muted)', marginTop: '4px' }}>
                  ※斬撃と体技の区別はされていません。
                </div>
              </li>
            </ul>
          </div>

          {/* 4. 特殊な補正 */}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '8px', color: 'var(--accent-secondary)' }}>4. 特殊な補正</h4>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '4px' }}>
                <strong>会心/暴走:</strong> チェックを入れると、会心の一撃や魔力暴走時のダメージが表示されます。
              </li>
              <li>
                <strong>フォース:</strong> アタッカー、ターゲットのドルマフォースを設定できます。
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3 style={{ color: 'var(--text-highlight)', marginBottom: '10px' }}>💡 その他の便利な使い方</h3>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <li>
              <strong>折りたたみ機能:</strong> アタッカー設定やターゲット設定の右上の「▲」で項目を閉じることができます。<br/>
              <span style={{ fontSize: '0.95em' }}>閉じた状態でも設定した項目が表示されるため、スクリーンショットを撮って一画面に収める際に便利です。</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
