import React, { useState } from 'react';
import { monsterMap } from '../data/monsters';
import { monsterList, getMonsterStepFamily } from '../data/skills';
import { Dropdown } from './Dropdown';
import { getAttributeTextColor } from '../data/constants';

export const TaiseiSearch: React.FC = () => {
  // --- タブ切り替え ---
  const [activeTab, setActiveTab] = useState<'matrix' | 'filter'>('filter'); // デフォルトはオリジナルの耐性絞り込み

  // --- 耐性比較マトリクス用の状態 ---
  const [selectedMonsters, setSelectedMonsters] = useState<string[]>(['キラーマシン', 'オーシャンボーン', 'ヘルバトラー']);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFit, setIsFit] = useState<boolean>(true);
  const [zoomScale, setZoomScale] = useState<number>(0.9);

  // --- マトリクス用の動的スタイル計算 ---
  const baseFontSize = 0.82;
  const currentFontSize = `${baseFontSize * zoomScale}rem`;
  const cellPadding = `${Math.round(5 * zoomScale)}px ${Math.round(4 * zoomScale)}px`;
  const headerPadding = `${Math.round(8 * zoomScale)}px ${Math.round(5 * zoomScale)}px`;
  const stickyColWidth = isFit ? `${Math.round(75 * zoomScale)}px` : `${Math.round(95 * zoomScale)}px`;
  const colWidth = isFit ? 'auto' : `${Math.round(80 * zoomScale)}px`;

  const addMonster = (name: string) => {
    if (selectedMonsters.length >= 5) return; // 最大5体まで同時比較
    if (!selectedMonsters.includes(name)) {
      setSelectedMonsters([...selectedMonsters, name]);
    }
  };

  const removeMonster = (name: string) => {
    setSelectedMonsters(selectedMonsters.filter(m => m !== name));
  };

  const attributes = [
    { idx: 11, name: 'メラ' },
    { idx: 12, name: 'ギラ' },
    { idx: 13, name: 'イオ' },
    { idx: 14, name: 'ヒャド' },
    { idx: 15, name: 'バギ' },
    { idx: 16, name: 'ジバ' },
    { idx: 17, name: 'デイン' },
    { idx: 18, name: 'ドルマ' },
    { idx: 37, name: 'ザバ' },
  ];

  const ailments = [
    { idx: 20, name: '眠り' },
    { idx: 21, name: '麻痺' },
    { idx: 22, name: '混乱' },
    { idx: 23, name: '幻惑' },
    { idx: 24, name: '毒' },
    { idx: 25, name: '即死' },
    { idx: 26, name: '呪い' },
    { idx: 27, name: '休み' },
    { idx: 28, name: '封印' },
    { idx: 29, name: '魅了' },
  ];

  const debuffs = [
    { idx: 30, name: '攻撃減' },
    { idx: 31, name: '守備減' },
    { idx: 32, name: '素早さ減' },
    { idx: 33, name: '呪耐減' },
  ];

  // 耐性の強さ（倍率）に応じて色分けスタイルを返す (比較マトリクス用)
  const getResistStyle = (val: number, isAilment: boolean = false) => {
    if (isAilment) {
      if (val >= 100) return { backgroundColor: 'rgba(0, 135, 163, 0.15)', color: 'var(--accent-blue)', fontWeight: 'bold' };
      if (val >= 50) return { backgroundColor: 'rgba(46, 213, 115, 0.12)', color: 'var(--accent-green)', fontWeight: 'bold' };
      if (val === 0) return { color: 'var(--text-secondary)' };
      return { backgroundColor: 'rgba(197, 168, 128, 0.25)', color: 'var(--accent-gold)', fontWeight: 'bold' };
    } else {
      if (val <= 0.5) return { backgroundColor: 'rgba(0, 135, 163, 0.15)', color: 'var(--accent-blue)', fontWeight: 'bold' };
      if (val < 1.0) return { backgroundColor: 'rgba(46, 213, 115, 0.12)', color: 'var(--accent-green)', fontWeight: 'bold' };
      if (val === 1.0) return { color: 'var(--text-secondary)' };
      if (val <= 1.25) return { backgroundColor: 'rgba(197, 168, 128, 0.25)', color: 'var(--accent-gold)', fontWeight: 'bold' };
      return { backgroundColor: 'rgba(142, 36, 48, 0.15)', color: 'var(--accent-red)', fontWeight: 'bold' };
    }
  };

  const formatResistVal = (val: number, isAilment: boolean = false) => {
    if (isAilment) {
      return `${val}%`;
    } else {
      const pct = Math.round((1.0 - val) * 100);
      if (pct > 0) return `+${pct}%`;
      if (pct < 0) return `${pct}%`;
      return '0%';
    }
  };


  // --- オリジナル耐性検索用の状態とロジック ---
  const [attr1, setAttr1] = useState<string>('メラ');
  const [attr2, setAttr2] = useState<string>('選択なし');
  
  // 歩数フィルターの状態（複数選択）
  const [selectedSteps, setSelectedSteps] = useState<string[]>(['18k', '13k']);

  const filteredMonsterList = monsterList.filter(name => {
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStep = selectedSteps.includes(getMonsterStepFamily(name));
    return matchesSearch && matchesStep;
  });

  const elementList = ['メラ', 'ギラ', 'イオ', 'ヒャド', 'バギ', 'ジバ', 'デイン', 'ドルマ', 'ザバ'];
  const statusList = ['眠り', '麻痺', '混乱', '幻惑', '毒', '即死', '呪い', '休み', '封印', '魅了'];

  const choices = [
    '選択なし', 
    'メラ', 'ギラ', 'イオ', 'ヒャド', 'バギ', 'ジバ', 'デイン', 'ドルマ', 'ザバ',
    '眠り', '麻痺', '混乱', '幻惑', '毒', '即死', '呪い', '休み', '封印', '魅了'
  ];

  const attrMap: { [key: string]: number } = {
    'メラ': 11, 'ギラ': 12, 'イオ': 13, 'ヒャド': 14, 'バギ': 15, 'ジバ': 16, 'デイン': 17, 'ドルマ': 18, 'ザバ': 37,
    '眠り': 20, '麻痺': 21, '混乱': 22, '幻惑': 23, '毒': 24, '即死': 25, '呪い': 26, '休み': 27, '封印': 28, '魅了': 29
  };

  const isResistant = (attrName: string, val: number | undefined) => {
    if (val === undefined) return false;
    if (elementList.includes(attrName)) {
      // 0% (等倍=1.0) も含める。弱点(1.0より大きい)は除く
      return val <= 1.0;
    } else if (statusList.includes(attrName)) {
      // 0% (耐性なし) も含める
      return val >= 0;
    }
    return true;
  };

  const getResistanceScore = (attrName: string, val: number | undefined) => {
    if (val === undefined) return 0.0;
    if (elementList.includes(attrName)) {
      return 1.0 - val;
    } else if (statusList.includes(attrName)) {
      return val / 100.0;
    }
    return 0.0;
  };

  const renderFilterBadge = (attrName: string, val: number | undefined) => {
    if (val === undefined) return null;
    if (elementList.includes(attrName)) {
      const pct = Math.round((1.0 - val) * 100);
      const signPct = pct > 0 ? `+${pct}%` : pct < 0 ? `${pct}%` : '0%';
      const bg = pct > 0 ? 'rgba(39, 174, 96, 0.12)' 
               : pct < 0 ? 'rgba(214, 48, 49, 0.1)' 
               : 'var(--bg-secondary)';
      const color = pct > 0 ? 'var(--accent-green)' 
                  : pct < 0 ? 'var(--accent-red)' 
                  : 'var(--text-muted)';
      return (
        <span className="badge" style={{ background: bg, color, padding: '4px 10px', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 'bold' }}>
          {signPct}
        </span>
      );
    } else if (statusList.includes(attrName)) {
      const pct = val;
      const bg = pct >= 100 ? 'rgba(0, 135, 163, 0.12)' 
               : pct >= 50 ? 'rgba(39, 174, 96, 0.12)' 
               : pct > 0 ? 'rgba(198, 124, 0, 0.1)' 
               : 'var(--bg-secondary)';
      const color = pct >= 100 ? 'var(--accent-blue)' 
                  : pct >= 50 ? 'var(--accent-green)' 
                  : pct > 0 ? 'var(--accent-gold)' 
                  : 'var(--text-muted)';
      return (
        <span className="badge" style={{ background: bg, color, padding: '4px 10px', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 'bold' }}>
          {pct}%
        </span>
      );
    }
    return String(val);
  };

  // 絞り込みとソートの実行
  const idx1 = attrMap[attr1];
  const idx2 = attrMap[attr2];

  const searchResults: any[] = [];
  if (attr1 !== '選択なし' || attr2 !== '選択なし') {
    monsterList.forEach(name => {
      // 歩数フィルターに合致しているか確認
      const step = getMonsterStepFamily(name);
      if (!selectedSteps.includes(step)) return;

      const m = monsterMap[name];
      if (m && m.raw) {
        let val1: number | undefined = undefined;
        let val2: number | undefined = undefined;

        if (attr1 !== '選択なし' && idx1 !== undefined) {
          val1 = m.raw[idx1] as number;
        }
        if (attr2 !== '選択なし' && idx2 !== undefined) {
          val2 = m.raw[idx2] as number;
        }

        // 絞り込み条件（AND条件）
        let match = true;
        if (attr1 !== '選択なし' && !isResistant(attr1, val1)) match = false;
        if (attr2 !== '選択なし' && !isResistant(attr2, val2)) match = false;

        if (match) {
          let sortKey = 0.0;
          if (val1 !== undefined) sortKey += getResistanceScore(attr1, val1);
          if (val2 !== undefined) sortKey += getResistanceScore(attr2, val2);

          searchResults.push({
            name,
            val1,
            val2,
            sortKey,
            step
          });
        }
      }
    });

    // 耐性が高い順（スコア順）に降順ソート
    searchResults.sort((a, b) => b.sortKey - a.sortKey);
  }

  return (
    <div className="fade-in">
      <div className="tab-header" style={{ marginBottom: '10px' }}>
        <h2>耐性検索</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          属性耐性・状態異常耐性の絞り込み検索や、複数モンスターでの耐性比較マトリクスが可能です。
        </p>
      </div>

      {/* サブナビゲーションタブ */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
        <button 
          className={`btn ${activeTab === 'filter' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('filter')}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          🔍 耐性絞り込み
        </button>
        <button 
          className={`btn ${activeTab === 'matrix' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('matrix')}
          style={{ padding: '8px 16px', fontSize: '0.9rem' }}
        >
          📊 耐性比較マトリクス
        </button>
      </div>

      {/* 共通の歩数複数選択フィルター */}
      <div className="glass-panel" style={{ padding: '10px 16px', marginBottom: '20px', zIndex: 3 }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
          🚶‍♂️ 歩数フィルター
        </label>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap', width: '100%' }}>
          {['18k', '13k', '10k', 'その他'].map(step => {
            const checked = selectedSteps.includes(step);
            return (
              <label 
                key={step} 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '4px', 
                  fontSize: '0.97rem', 
                  cursor: 'pointer',
                  userSelect: 'none',
                  background: checked ? 'rgba(229, 169, 59, 0.1)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${checked ? 'var(--accent-gold)' : 'rgba(255,255,255,0.06)'}`,
                  padding: '4px 0',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
                  color: checked ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                <input 
                  type="checkbox" 
                  checked={checked}
                  onChange={() => {
                    if (checked) {
                      setSelectedSteps(selectedSteps.filter(s => s !== step));
                    } else {
                      setSelectedSteps([...selectedSteps, step]);
                    }
                  }}
                  style={{ 
                    cursor: 'pointer',
                    accentColor: 'var(--accent-gold)',
                    margin: 0
                  }}
                />
                <span style={{ fontSize: '0.93rem', fontWeight: 'bold' }}>{step}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 1. 耐性絞り込み (オリジナル) */}
      {activeTab === 'filter' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '20px', zIndex: 2 }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-gold)', marginBottom: '16px' }}>耐性属性・状態異常の選択</h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>耐性 1</label>
                <Dropdown 
                  options={choices.filter(v => v !== '選択なし')} 
                  value={attr1} 
                  onChange={setAttr1} 
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>耐性 2 (任意)</label>
                <Dropdown 
                  options={choices} 
                  value={attr2} 
                  onChange={setAttr2} 
                />
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px 12px', zIndex: 1 }}>
            {attr1 === '選択なし' && attr2 === '選択なし' ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                耐性を選択してください（片方または両方）
              </div>
            ) : selectedSteps.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                歩数フィルターを1つ以上選択してください。
              </div>
            ) : searchResults.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                該当する耐性を持つモンスターは見つかりませんでした。
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.0rem', color: 'var(--text-muted)', marginBottom: '12px', paddingLeft: '8px' }}>
                  🎯 耐性が高い順の一覧 ({searchResults.length}件)
                </h3>
                
                {/* 絞り込み結果リスト表示 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden' }}>
                  {/* テーブルヘッダー */}
                  <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '10px 14px', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ flex: '2.3' }}>モンスター名</div>
                    {attr1 !== '選択なし' && (
                      <div style={{ flex: '1', textAlign: 'center' }}>{attr1}{elementList.includes(attr1) ? '(%)' : ''}</div>
                    )}
                    {attr2 !== '選択なし' && (
                      <div style={{ flex: '1', textAlign: 'center' }}>{attr2}{elementList.includes(attr2) ? '(%)' : ''}</div>
                    )}
                  </div>


                  {/* モンスターリスト行 */}
                  {searchResults.map((r, index) => {
                    return (
                      <div 
                        key={r.name} 
                        style={{ 
                          display: 'flex', 
                          background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', 
                          padding: '12px 14px', 
                          fontSize: '0.93rem', 
                          alignItems: 'center', 
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          transition: 'background-color 0.2s'
                        }}
                        className="list-row-hover"
                      >
                        <div style={{ flex: '2.3', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                          {r.name}
                        </div>
                        {attr1 !== '選択なし' && (
                          <div style={{ flex: '1', textAlign: 'center' }}>
                            {renderFilterBadge(attr1, r.val1)}
                          </div>
                        )}
                        {attr2 !== '選択なし' && (
                          <div style={{ flex: '1', textAlign: 'center' }}>
                            {renderFilterBadge(attr2, r.val2)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. 耐性比較マトリクス */}
      {activeTab === 'matrix' && (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* モンスター選択検索パネル */}
          <div className="glass-panel" style={{ padding: '20px', flex: '1 1 300px', maxHeight: '420px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.03rem', marginBottom: '12px', color: 'var(--accent-gold)' }}>➕ モンスターを追加</h3>
            <input 
              className="form-input" 
              placeholder="モンスター名で検索..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '12px' }}
            />
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
              {filteredMonsterList.map(name => {
                const active = selectedMonsters.includes(name);
                return (
                  <div 
                    key={name} 
                    onClick={() => active ? removeMonster(name) : addMonster(name)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: active ? 'rgba(229,169,59,0.1)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${active ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)'}`,
                      color: active ? 'var(--accent-gold)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span>{name}</span>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                      {active ? '選択中' : '追加'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 比較カード */}
          <div style={{ flex: '3 1 400px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            {selectedMonsters.length === 0 ? (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                モンスターを追加して比較を開始してください。
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '12px 6px' }}>
                {/* プレミアム表示オプションバー */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap',
                  gap: '12px',
                  padding: '6px 12px 12px 12px',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>表示オプション:</span>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.97rem', cursor: 'pointer', userSelect: 'none' }}>
                      <input 
                        type="checkbox" 
                        checked={isFit} 
                        onChange={(e) => setIsFit(e.target.checked)}
                        style={{ 
                          cursor: 'pointer',
                          accentColor: 'var(--accent-gold)',
                          width: '14px',
                          height: '14px'
                        }}
                      />
                      <span>画面幅に収める (フィット)</span>
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexGrow: 1, justifyContent: 'flex-end', maxWidth: '280px' }}>
                    <span style={{ fontSize: '0.93rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>縮小</span>
                    <input 
                      type="range" 
                      min="0.55" 
                      max="1.1" 
                      step="0.05" 
                      value={zoomScale} 
                      onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                      style={{ 
                        cursor: 'pointer',
                        accentColor: 'var(--accent-gold)',
                        width: '100%',
                        height: '4px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '2px',
                        outline: 'none'
                      }}
                    />
                    <span style={{ fontSize: '0.93rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', minWidth: '70px', textAlign: 'right' }}>
                      拡大 ({Math.round(zoomScale * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="table-scroll-container" style={{ position: 'relative' }}>
                  <table style={{ width: '100%', minWidth: isFit ? '0' : '450px', fontSize: currentFontSize, tableLayout: isFit ? 'fixed' : 'auto' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                        <th className="sticky-col" style={{ padding: headerPadding, minWidth: stickyColWidth, width: stickyColWidth }}>耐性項目</th>
                        {selectedMonsters.map(name => (
                          <th key={name} style={{ padding: headerPadding, minWidth: colWidth, width: colWidth }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <span style={{ 
                                fontWeight: 'bold', 
                                color: 'var(--accent-gold)',
                                fontSize: isFit ? `${0.75 * zoomScale}rem` : `${0.82 * zoomScale}rem`,
                                display: 'block',
                                width: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: isFit ? 'nowrap' : 'normal',
                                lineHeight: '1.2'
                              }} title={name}>{name}</span>
                              <button 
                                onClick={() => removeMonster(name)}
                                style={{
                                  background: 'rgba(142, 36, 48, 0.06)',
                                  border: 'none',
                                  color: 'var(--accent-red)',
                                  cursor: 'pointer',
                                  fontSize: `${0.68 * zoomScale}rem`,
                                  padding: '1px 5px',
                                  borderRadius: '3px',
                                  marginTop: '3px',
                                  transition: 'all 0.2s',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'var(--accent-red)';
                                  e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'rgba(142, 36, 48, 0.06)';
                                  e.currentTarget.style.color = 'var(--accent-red)';
                                }}
                              >
                                削除
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <td className="sticky-col" style={{ padding: cellPadding, color: 'var(--accent-blue)', fontWeight: 'bold', minWidth: stickyColWidth, width: stickyColWidth }}>🔥 属性耐性</td>
                        <td colSpan={selectedMonsters.length} style={{ textAlign: 'left', padding: cellPadding, fontSize: `${0.75 * zoomScale}rem`, color: 'var(--text-muted)' }}></td>
                      </tr>
                      {attributes.map(attr => (
                        <tr key={attr.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td className="sticky-col" style={{ padding: cellPadding, color: getAttributeTextColor(attr.name), fontWeight: 'bold', minWidth: stickyColWidth, width: stickyColWidth }}>{attr.name}</td>
                          {selectedMonsters.map(name => {
                            const m = monsterMap[name] || monsterMap['デフォルト'];
                            const val = m.raw ? (m.raw[attr.idx] as number) : 1;
                            return (
                              <td key={name} style={{ padding: cellPadding, ...getResistStyle(val, false) }}>
                                {formatResistVal(val, false)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}

                      <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <td className="sticky-col" style={{ padding: cellPadding, color: 'var(--text-primary)', fontWeight: 'bold', minWidth: stickyColWidth, width: stickyColWidth }}>💤 状態異常</td>
                        <td colSpan={selectedMonsters.length} style={{ textAlign: 'left', padding: cellPadding, fontSize: `${0.75 * zoomScale}rem`, color: 'var(--text-muted)' }}></td>
                      </tr>
                      {ailments.map(ail => (
                        <tr key={ail.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td className="sticky-col" style={{ padding: cellPadding, color: 'var(--text-secondary)', minWidth: stickyColWidth, width: stickyColWidth }}>{ail.name}</td>
                          {selectedMonsters.map(name => {
                            const m = monsterMap[name] || monsterMap['デフォルト'];
                            const val = m.raw ? (m.raw[ail.idx] as number) : 0;
                            return (
                              <td key={name} style={{ padding: cellPadding, ...getResistStyle(val, true) }}>
                                {formatResistVal(val, true)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}

                      <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <td className="sticky-col" style={{ padding: cellPadding, color: 'var(--text-primary)', fontWeight: 'bold', minWidth: stickyColWidth, width: stickyColWidth }}>📉 ステータス低下</td>
                        <td colSpan={selectedMonsters.length} style={{ textAlign: 'left', padding: cellPadding, fontSize: `${0.75 * zoomScale}rem`, color: 'var(--text-muted)' }}></td>
                      </tr>
                      {debuffs.map(deb => (
                        <tr key={deb.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td className="sticky-col" style={{ padding: cellPadding, color: 'var(--text-secondary)', minWidth: stickyColWidth, width: stickyColWidth }}>{deb.name}</td>
                          {selectedMonsters.map(name => {
                            const m = monsterMap[name] || monsterMap['デフォルト'];
                            const val = m.raw ? (m.raw[deb.idx] as number) : 0;
                            return (
                              <td key={name} style={{ padding: cellPadding, ...getResistStyle(val, true) }}>
                                {formatResistVal(val, true)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
