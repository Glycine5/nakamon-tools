import React, { useState, useEffect } from 'react';
import { monsterMap } from '../data/monsters';
import { monsterList } from '../data/skills';
import { personalities, qualifications, getAttributeTextColor } from '../data/constants';
import { calcMonsterStatus } from '../utils/calculator';
import type { Monster } from '../types';
import { Dropdown } from './Dropdown';

// 各モンスターの所属する歩族を判定する関数
const getMonsterStepFamily = (name: string): string => {
  const idx = monsterList.indexOf(name);
  if (idx === -1) return 'その他';

  const idxKillerMachine = monsterList.indexOf('キラーマシン');
  const idxMaou = monsterList.indexOf('まおうのつかい');
  const idxMaiden = monsterList.indexOf('メイデンドール');
  const idxWight = monsterList.indexOf('ワイトキング');
  const idxDashlan = monsterList.indexOf('ダッシュラン');
  const idxHellCondor = monsterList.indexOf('ヘルコンドル');

  if (idxKillerMachine !== -1 && idxMaou !== -1 && idx >= idxKillerMachine && idx <= idxMaou) {
    return '18k';
  } else if (idxMaiden !== -1 && idxWight !== -1 && idx >= idxMaiden && idx <= idxWight) {
    return '13k';
  } else if (idxDashlan !== -1 && idxHellCondor !== -1 && idx >= idxDashlan && idx <= idxHellCondor) {
    return '10k';
  } else {
    return 'その他';
  }
};

export const Yobisute: React.FC = () => {
  // --- 状態管理 ---
  // モンスター 1 (左)
  const [mon1Name, setMon1Name] = useState<string>(() => localStorage.getItem('dqw_yob_mon1Name') || 'キラーマシン');
  const [mon1Pers, setMon1Pers] = useState<string>(() => localStorage.getItem('dqw_yob_mon1Pers') || 'いっぴきおおかみ');
  const [mon1Qual, setMon1Qual] = useState<string>(() => localStorage.getItem('dqw_yob_mon1Qual') || '極');
  
  // モンスター 2 (右)
  const [mon2Name, setMon2Name] = useState<string>(() => localStorage.getItem('dqw_yob_mon2Name') || 'キラーマシン');
  const [mon2Pers, setMon2Pers] = useState<string>(() => localStorage.getItem('dqw_yob_mon2Pers') || 'いっぴきおおかみ');
  const [mon2Qual, setMon2Qual] = useState<string>(() => localStorage.getItem('dqw_yob_mon2Qual') || '極');

  // --- 歩数フィルター状態 ---
  const [mon1StepFilter, setMon1StepFilter] = useState<string>('18k');
  const [mon2StepFilter, setMon2StepFilter] = useState<string>('18k');

  // 絞り込み後のモンスター一覧を生成する関数（10kの時は優先モンスターを先頭にする）
  const getFilteredMonsters = (filter: string) => {
    let filtered = monsterList.filter(name => filter === 'すべて' || getMonsterStepFamily(name) === filter);
    if (filter === '10k') {
      const priority = ['キラーパンサー', 'シルバーデビル', 'ドラゴスライム'];
      const pinned = priority.filter(name => filtered.includes(name));
      const rest = filtered.filter(name => !priority.includes(name));
      filtered = [...pinned, ...rest];
    }
    return filtered;
  };

  const handleMon1StepFilterChange = (filter: string) => {
    setMon1StepFilter(filter);
    if (filter !== 'すべて') {
      const filtered = getFilteredMonsters(filter);
      if (filtered.length > 0 && !filtered.includes(mon1Name)) {
        setMon1Name(filtered[0]);
      }
    }
  };

  const handleMon2StepFilterChange = (filter: string) => {
    setMon2StepFilter(filter);
    if (filter !== 'すべて') {
      const filtered = getFilteredMonsters(filter);
      if (filtered.length > 0 && !filtered.includes(mon2Name)) {
        setMon2Name(filtered[0]);
      }
    }
  };

  const filteredMon1List = getFilteredMonsters(mon1StepFilter);
  const filteredMon2List = getFilteredMonsters(mon2StepFilter);

  const [mon1Status, setMon1Status] = useState<Monster | null>(null);
  const [mon2Status, setMon2Status] = useState<Monster | null>(null);

  // localStorage への保存
  useEffect(() => {
    localStorage.setItem('dqw_yob_mon1Name', mon1Name);
    localStorage.setItem('dqw_yob_mon1Pers', mon1Pers);
    localStorage.setItem('dqw_yob_mon1Qual', mon1Qual);
    localStorage.setItem('dqw_yob_mon2Name', mon2Name);
    localStorage.setItem('dqw_yob_mon2Pers', mon2Pers);
    localStorage.setItem('dqw_yob_mon2Qual', mon2Qual);
  }, [mon1Name, mon1Pers, mon1Qual, mon2Name, mon2Pers, mon2Qual]);

  // ステータス連動
  useEffect(() => {
    const b = monsterMap[mon1Name] || monsterMap['デフォルト'];
    setMon1Status(calcMonsterStatus(b, personalities[mon1Pers], qualifications[mon1Qual]));
  }, [mon1Name, mon1Pers, mon1Qual]);

  useEffect(() => {
    const b = monsterMap[mon2Name] || monsterMap['デフォルト'];
    setMon2Status(calcMonsterStatus(b, personalities[mon2Pers], qualifications[mon2Qual]));
  }, [mon2Name, mon2Pers, mon2Qual]);

  if (!mon1Status || !mon2Status) return null;

  // 属性耐性リスト
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

  // 状態異常耐性リスト
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

  // ステータス弱体耐性
  const debuffs = [
    { idx: 30, name: '攻撃減' },
    { idx: 31, name: '守備減' },
    { idx: 32, name: '素早さ減' },
    { idx: 33, name: '呪耐減' },
  ];

  // 属性耐性表示 (例: 1.5倍 -> -50%, 0.5倍 -> 50%)
  const formatAttrResist = (val: number) => {
    const percent = Math.floor(100 * (1 - val));
    return `${percent}%`;
  };



  // 比較での優劣ハイライトスタイル (ライトテーマ向けに深い青で見やすく調整)
  const getCompareStyle = (val1: number, val2: number, lowerIsBetter: boolean = false) => {
    if (val1 === val2) return { color: 'var(--text-primary)', fontWeight: 'normal' };
    const isVal1Better = lowerIsBetter ? val1 < val2 : val1 > val2;
    return isVal1Better 
      ? { color: 'var(--text-primary)', fontWeight: 'bold' } 
      : { color: 'var(--text-primary)', fontWeight: 'normal' };
  };

  return (
    <div className="fade-in">
      <div className="tab-header" style={{ marginBottom: '10px' }}>
        <h2>ステータス呼び出し(呼びステ)</h2>
      </div>

      <div className="dashboard-grid">
        {/* モンスター選択パネル */}
        <div className="glass-panel" style={{ padding: '14px', overflow: 'visible' }}>
          <div className="responsive-grid-2">
            {/* モンスター 1 (左) */}
            <div className="responsive-divider-right">
              <span style={{ fontSize: '0.9rem', color: 'var(--accent-blue)', fontWeight: 'bold' }}>🔵 モンスターA</span>
              <div className="step-family-selector" style={{ marginTop: '4px', marginBottom: '6px' }}>
                {['すべて', '18k', '13k', '10k', 'その他'].map(filter => (
                  <label key={filter} className="step-family-option">
                    <input 
                      type="radio" 
                      name="mon1StepFilter" 
                      value={filter} 
                      checked={mon1StepFilter === filter} 
                      onChange={() => handleMon1StepFilterChange(filter)} 
                    />
                    <span>{filter}</span>
                  </label>
                ))}
              </div>
              <Dropdown 
                options={filteredMon1List} 
                value={mon1Name} 
                onChange={setMon1Name} 
                style={{ fontSize: '1.0rem' }} 
              />
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                <Dropdown 
                  options={Object.keys(personalities)} 
                  value={mon1Pers} 
                  onChange={setMon1Pers} 
                  style={{ fontSize: '0.9rem', flex: 1 }} 
                />
                <Dropdown 
                  options={Object.keys(qualifications)} 
                  value={mon1Qual} 
                  onChange={setMon1Qual} 
                  style={{ fontSize: '0.9rem', flex: 1 }} 
                />
              </div>
            </div>

            {/* モンスター 2 (右) */}
            <div style={{ paddingLeft: '2px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--accent-red)', fontWeight: 'bold' }}>🔴 モンスターB</span>
              <div className="step-family-selector" style={{ marginTop: '4px', marginBottom: '6px' }}>
                {['すべて', '18k', '13k', '10k', 'その他'].map(filter => (
                  <label key={filter} className="step-family-option">
                    <input 
                      type="radio" 
                      name="mon2StepFilter" 
                      value={filter} 
                      checked={mon2StepFilter === filter} 
                      onChange={() => handleMon2StepFilterChange(filter)} 
                    />
                    <span>{filter}</span>
                  </label>
                ))}
              </div>
              <Dropdown 
                options={filteredMon2List} 
                value={mon2Name} 
                onChange={setMon2Name} 
                style={{ fontSize: '1.0rem' }} 
                align="right"
              />
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                <Dropdown 
                  options={Object.keys(personalities)} 
                  value={mon2Pers} 
                  onChange={setMon2Pers} 
                  style={{ fontSize: '0.9rem', flex: 1 }} 
                  align="right"
                />
                <Dropdown 
                  options={Object.keys(qualifications)} 
                  value={mon2Qual} 
                  onChange={setMon2Qual} 
                  style={{ fontSize: '0.9rem', flex: 1 }} 
                  align="right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 1. 基本能力値の並列マトリクス */}
        <div className="glass-panel" style={{ padding: '14px' }}>
          <h3 style={{ color: 'var(--accent-gold)', fontSize: '1.0rem', marginBottom: '10px' }}>📊 ステータス比較</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.0rem', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <th style={{ padding: '6px', textAlign: 'left' }}>ステータス</th>
                <th style={{ padding: '6px', color: 'var(--accent-blue)' }}>{mon1Name}</th>
                <th style={{ padding: '6px', color: 'var(--accent-red)' }}>{mon2Name}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: '最大HP', key: 'hp' },
                { name: '最大MP', key: 'mp' },
                { name: 'こうげき力', key: 'power' },
                { name: 'しゅび力', key: 'guard' },
                { name: '攻撃魔力', key: 'magic' },
                { name: '回復魔力', key: 'heal' },
                { name: 'すばやさ', key: 'speed' },
                { name: 'きようさ', key: 'dexterity' },
              ].map(stat => {
                const val1 = (mon1Status as any)[stat.key] || 0;
                const val2 = (mon2Status as any)[stat.key] || 0;
                return (
                  <tr key={stat.name} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.03)' }}>
                    <td style={{ padding: '8px 6px', textAlign: 'left', color: 'var(--text-secondary)' }}>{stat.name}</td>
                    <td style={{ padding: '8px 6px', ...getCompareStyle(val1, val2) }}>{val1}</td>
                    <td style={{ padding: '8px 6px', ...getCompareStyle(val2, val1) }}>{val2}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 2. 属性耐性の並列マトリクス */}
        <div className="glass-panel" style={{ padding: '14px' }}>
          <h3 style={{ color: 'var(--accent-blue)', fontSize: '1.0rem', marginBottom: '10px' }}>🔥 属性耐性</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.0rem', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <th style={{ padding: '6px', textAlign: 'left' }}>属性</th>
                <th style={{ padding: '6px' }}>{mon1Name}</th>
                <th style={{ padding: '6px' }}>{mon2Name}</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map(attr => {
                const val1 = mon1Status.raw ? (mon1Status.raw[attr.idx] as number) : 1;
                const val2 = mon2Status.raw ? (mon2Status.raw[attr.idx] as number) : 1;
                return (
                  <tr key={attr.name} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.03)' }}>
                    <td style={{ padding: '6px', textAlign: 'left', color: getAttributeTextColor(attr.name), fontWeight: 'bold' }}>{attr.name}</td>
                    <td style={{ padding: '6px', ...getCompareStyle(val1, val2, true) }}>
                      {formatAttrResist(val1)}
                    </td>
                    <td style={{ padding: '6px', ...getCompareStyle(val2, val1, true) }}>
                      {formatAttrResist(val2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 3. 状態異常・低下耐性の並列マトリクス */}
        <div className="glass-panel" style={{ padding: '14px' }}>
          <h3 style={{ color: 'var(--accent-red)', fontSize: '1.0rem', marginBottom: '10px' }}>💤 状態異常耐性</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.97rem', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <th style={{ padding: '6px', textAlign: 'left' }}>異常・低下項目</th>
                <th style={{ padding: '6px' }}>{mon1Name}</th>
                <th style={{ padding: '6px' }}>{mon2Name}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <td colSpan={3} style={{ textAlign: 'left', padding: '4px 6px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent-red)' }}>💤 状態異常</td>
              </tr>
              {ailments.map(ail => {
                const val1 = mon1Status.raw ? (mon1Status.raw[ail.idx] as number) : 0;
                const val2 = mon2Status.raw ? (mon2Status.raw[ail.idx] as number) : 0;
                return (
                  <tr key={ail.name} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.03)' }}>
                    <td style={{ padding: '5px 6px', textAlign: 'left', color: 'var(--text-secondary)', paddingLeft: '14px' }}>{ail.name}</td>
                    <td style={{ padding: '5px 6px', ...getCompareStyle(val1, val2) }}>
                      {`${val1}%`}
                    </td>
                    <td style={{ padding: '5px 6px', ...getCompareStyle(val2, val1) }}>
                      {`${val2}%`}
                    </td>
                  </tr>
                );
              })}
              <tr style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
                <td colSpan={3} style={{ textAlign: 'left', padding: '4px 6px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent-red)' }}>📉 ステータス低下</td>
              </tr>
              {debuffs.map(deb => {
                const val1 = mon1Status.raw ? (mon1Status.raw[deb.idx] as number) : 0;
                const val2 = mon2Status.raw ? (mon2Status.raw[deb.idx] as number) : 0;
                return (
                  <tr key={deb.name} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.03)' }}>
                    <td style={{ padding: '5px 6px', textAlign: 'left', color: 'var(--text-secondary)', paddingLeft: '14px' }}>{deb.name}</td>
                    <td style={{ padding: '5px 6px', ...getCompareStyle(val1, val2) }}>
                      {`${val1}%`}
                    </td>
                    <td style={{ padding: '5px 6px', ...getCompareStyle(val2, val1) }}>
                      {`${val2}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
