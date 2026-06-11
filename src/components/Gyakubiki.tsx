import React, { useState } from 'react';
import { monsterMap } from '../data/monsters';
import { monsterList } from '../data/skills';
import { personalities, qualifications } from '../data/constants';
import { Dropdown } from './Dropdown';

interface HPResult {
  monster: string;
  personality: string;
  quality: string;
  items: string[];
}

interface MPResult {
  monster: string;
  personality: string;
  quality: string;
  items: string[];
}

interface MatchingResult {
  monster: string;
  personality: string;
  quality: string;
  items_hp: string[];
  items_mp: string[];
}

export const Gyakubiki: React.FC = () => {
  const [condOpen, setCondOpen] = useState<boolean>(true);
  const [targetHPText, setTargetHPText] = useState<string>('');
  const [targetMPText, setTargetMPText] = useState<string>('');
  const [monsterFilter, setMonsterFilter] = useState<string>('全検索');
  const [includeLower, setIncludeLower] = useState<boolean>(false); // 優・並などの下位素質を含める
  const [simpleMode, setSimpleMode] = useState<boolean>(true); // 継承数が最小の組み合わせのみ表示

  const [results, setResults] = useState<any[]>([]);
  const [message, setMessage] = useState<string>('');

  const itemsHP: Record<string, number> = { "HPS": 70, "HPA": 50, "HPB": 35, "HPC": 20, "HPD": 10 };
  const itemsMP: Record<string, number> = { "MPS": 40, "MPA": 27, "MPB": 17, "MPC": 10, "MPD": 5 };

  // 重複あり組み合わせの生成
  const getCombinationsWithReplacement = <T,>(array: T[], r: number): T[][] => {
    if (r === 0) return [[]];
    const results: T[][] = [];
    const helper = (index: number, current: T[]) => {
      if (current.length === r) {
        results.push([...current]);
        return;
      }
      for (let i = index; i < array.length; i++) {
        current.push(array[i]);
        helper(i, current);
        current.pop();
      }
    };
    helper(0, []);
    return results;
  };

  const handleSearch = () => {
    const targetHP = targetHPText.trim() ? parseInt(targetHPText) : null;
    const targetMP = targetMPText.trim() ? parseInt(targetMPText) : null;

    if (targetHP === null && targetMP === null) {
      setMessage('目標HPまたは目標MPを入力してください。');
      setResults([]);
      return;
    }

    setMessage('');
    
    // 素質フィルター
    const allowedQualities = includeLower 
      ? ["極", "超", "特", "優", "並"] 
      : ["極", "超"];

    // 継承組み合わせ (0~3個)
    const hpCombos: string[][] = [];
    for (let r = 0; r <= 3; r++) {
      hpCombos.push(...getCombinationsWithReplacement(Object.keys(itemsHP), r));
    }

    const mpCombos: string[][] = [];
    for (let r = 0; r <= 3; r++) {
      mpCombos.push(...getCombinationsWithReplacement(Object.keys(itemsMP), r));
    }

    const monsterNames = monsterFilter === '全検索' 
      ? monsterList 
      : [monsterFilter];

    const resultHP: HPResult[] = [];
    const resultMP: MPResult[] = [];

    // HP 逆引き探索
    if (targetHP !== null) {
      monsterNames.forEach(mName => {
        const m = monsterMap[mName];
        if (!m) return;
        Object.keys(personalities).forEach(pName => {
          if (pName === '性格') return;
          const pRate = personalities[pName].modifiers[0]; // HP補正
          allowedQualities.forEach(qName => {
            const qRate = qualifications[qName];
            const adjustedHP = Math.ceil(m.hp * pRate * qRate);
            
            hpCombos.forEach(combo => {
              const itemTotal = combo.reduce((sum, item) => sum + itemsHP[item], 0);
              if (adjustedHP + itemTotal === targetHP) {
                resultHP.push({
                  monster: mName,
                  personality: pName,
                  quality: qName,
                  items: combo
                });
              }
            });
          });
        });
      });
    }

    // MP 逆引き探索
    if (targetMP !== null) {
      monsterNames.forEach(mName => {
        const m = monsterMap[mName];
        if (!m) return;
        Object.keys(personalities).forEach(pName => {
          if (pName === '性格') return;
          const pRate = personalities[pName].modifiers[1]; // MP補正
          allowedQualities.forEach(qName => {
            const qRate = qualifications[qName];
            const adjustedMP = Math.ceil(m.mp * pRate * qRate);
            
            mpCombos.forEach(combo => {
              const itemTotal = combo.reduce((sum, item) => sum + itemsMP[item], 0);
              if (adjustedMP + itemTotal === targetMP) {
                resultMP.push({
                  monster: mName,
                  personality: pName,
                  quality: qName,
                  items: combo
                });
              }
            });
          });
        });
      });
    }

    let finalResults: any[] = [];

    if (targetHP !== null && targetMP !== null) {
      // 両方指定されている場合 (HPとMPのアイテム合計が3個以下の組み合わせ)
      const mpMap: Record<string, MPResult[]> = {};
      resultMP.forEach(res => {
        const key = `${res.monster}_${res.personality}_${res.quality}`;
        if (!mpMap[key]) mpMap[key] = [];
        mpMap[key].push(res);
      });

      const matching: MatchingResult[] = [];
      resultHP.forEach(hpRes => {
        const key = `${hpRes.monster}_${hpRes.personality}_${hpRes.quality}`;
        if (mpMap[key]) {
          mpMap[key].forEach(mpRes => {
            if (hpRes.items.length + mpRes.items.length <= 3) {
              matching.push({
                monster: hpRes.monster,
                personality: hpRes.personality,
                quality: hpRes.quality,
                items_hp: hpRes.items,
                items_mp: mpRes.items
              });
            }
          });
        }
      });

      if (matching.length > 0) {
        if (simpleMode) {
          const minLen = Math.min(...matching.map(res => res.items_hp.length + res.items_mp.length));
          finalResults = matching.filter(res => res.items_hp.length + res.items_mp.length === minLen);
        } else {
          finalResults = matching;
        }
      } else {
        setMessage('両方の条件をスロット3つ以内で同時に満たす組み合わせはありませんでした。個別の結果を表示します。');
        finalResults = [
          ...resultHP.map(r => ({ ...r, type: 'HPのみ一致' })),
          ...resultMP.map(r => ({ ...r, type: 'MPのみ一致' }))
        ];
      }
    } else if (targetHP !== null) {
      finalResults = resultHP.map(r => ({ ...r, type: 'HP一致' }));
      if (simpleMode && finalResults.length > 0) {
        const minLen = Math.min(...finalResults.map(res => res.items.length));
        finalResults = finalResults.filter(res => res.items.length === minLen);
      }
    } else if (targetMP !== null) {
      finalResults = resultMP.map(r => ({ ...r, type: 'MP一致' }));
      if (simpleMode && finalResults.length > 0) {
        const minLen = Math.min(...finalResults.map(res => res.items.length));
        finalResults = finalResults.filter(res => res.items.length === minLen);
      }
    }

    setResults(finalResults);
    if (finalResults.length === 0 && !message) {
      setMessage('一致する組み合わせは見つかりませんでした。目標値や条件を変更してください。');
    }
  };

  return (
    <div className="fade-in">
      <div className="tab-header" style={{ marginBottom: '16px' }}>
        <h2>HP、MP逆引き検索</h2>
      </div>

      <div className="dashboard-grid">
        {/* 左カラム：条件設定 (スマホ対応アコーディオン) */}
        <div className="glass-panel">
          <div className="collapsible-header" onClick={() => setCondOpen(!condOpen)}>
            <h3 style={{ color: 'var(--accent-gold)', fontSize: '1.0rem' }}>
              🔍 探索条件設定 {results.length > 0 && `(HP:${targetHPText} MP:${targetMPText})`}
            </h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{condOpen ? '▲' : '▼'}</span>
          </div>
          
          {condOpen && (
            <div className="collapsible-content">
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>HP値</label>
                  <input 
                    className="form-input" 
                    type="number" 
                    placeholder="例: 1200" 
                    value={targetHPText} 
                    onChange={(e) => setTargetHPText(e.target.value)} 
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>MP値</label>
                  <input 
                    className="form-input" 
                    type="number" 
                    placeholder="例: 450" 
                    value={targetMPText} 
                    onChange={(e) => setTargetMPText(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>対象モンスター</label>
                <Dropdown 
                  options={['全検索', ...monsterList]} 
                  value={monsterFilter} 
                  onChange={setMonsterFilter} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div className="switch-container">
                  <span style={{ fontSize: '0.95rem' }}>下位素質を含める (特・優・並)</span>
                  <label className="switch">
                    <input type="checkbox" checked={includeLower} onChange={(e) => setIncludeLower(e.target.checked)} />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="switch-container">
                  <span style={{ fontSize: '0.95rem' }}>継承スロット数を最小に抑える</span>
                  <label className="switch">
                    <input type="checkbox" checked={simpleMode} onChange={(e) => setSimpleMode(e.target.checked)} />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleSearch} style={{ justifyContent: 'center', marginTop: '6px', width: '100%' }}>
                逆引き探索を実行する
              </button>
            </div>
          )}
        </div>

        {/* 右カラム：検索結果リスト */}
        <div className="glass-panel" style={{ padding: '24px', flex: '2 1 600px', display: 'flex', flexDirection: 'column', maxHeight: '600px' }}>
          <h3 style={{ color: 'var(--accent-gold)', marginBottom: '16px', fontSize: '1.03rem' }}>
            🎯 探索結果 ({results.length} 件)
          </h3>

          {message && (
            <div style={{ color: 'var(--accent-red)', fontSize: '0.95rem', marginBottom: '12px', padding: '8px 12px', background: 'rgba(255,71,87,0.05)', borderRadius: '6px', border: '1px solid rgba(255,71,87,0.15)' }}>
              {message}
            </div>
          )}

          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '6px' }}>
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                条件を指定して上のボタンを押すと、達成可能な組み合わせがここに一覧表示されます。
              </div>
            ) : (
              results.map((res, i) => {
                const isHpMp = res.items_hp !== undefined;
                return (
                  <div 
                    key={i} 
                    style={{ 
                      background: 'rgba(255,255,255,0.02)', 
                      padding: '16px', 
                      borderRadius: '10px', 
                      border: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-gold)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.98rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>{res.monster}</span>
                      <span className="badge badge-blue">{res.type || '最適構成'}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', fontSize: '1.0rem', color: 'var(--text-secondary)' }}>
                      <div>性格: <strong style={{ color: 'var(--text-primary)' }}>{res.personality}</strong></div>
                      <div>素質: <strong style={{ color: 'var(--text-primary)' }}>{res.quality}</strong></div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8px', marginTop: '4px' }}>
                      {isHpMp ? (
                        <>
                          <div style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: 'var(--accent-blue)' }}>HP玉:</span>
                            {res.items_hp.length === 0 ? <span style={{ color: 'var(--text-muted)' }}>無し</span> : res.items_hp.map((item: string, j: number) => <span key={j} className="badge badge-gold" style={{ padding: '2px 6px', fontSize: '0.85rem' }}>{item}</span>)}
                          </div>
                          <div style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: 'var(--accent-green)' }}>MP玉:</span>
                            {res.items_mp.length === 0 ? <span style={{ color: 'var(--text-muted)' }}>無し</span> : res.items_mp.map((item: string, j: number) => <span key={j} className="badge badge-blue" style={{ padding: '2px 6px', fontSize: '0.85rem' }}>{item}</span>)}
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: 'var(--accent-blue)' }}>必要玉:</span>
                          {res.items.length === 0 ? <span style={{ color: 'var(--text-muted)' }}>無し</span> : res.items.map((item: string, j: number) => <span key={j} className="badge badge-gold" style={{ padding: '2px 6px', fontSize: '0.85rem' }}>{item}</span>)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
