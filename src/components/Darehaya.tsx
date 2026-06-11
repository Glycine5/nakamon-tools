import React, { useState, useEffect } from 'react';
import { monsterMap } from '../data/monsters';
import { monsterList, getMonsterStepFamily } from '../data/skills';
import { personalities, qualifications } from '../data/constants';
import { calcMonsterStatus } from '../utils/calculator';
import type { Monster } from '../types';
import { Dropdown } from './Dropdown';



export const Darehaya: React.FC = () => {
  // --- スマホ用アコーディオン開閉状態 ---
  const [mon1Open, setMon1Open] = useState<boolean>(true);
  const [mon2Open, setMon2Open] = useState<boolean>(false);

  // --- 状態管理 ---
  // モンスター 1 (左 / 味方)
  const [mon1Name, setMon1Name] = useState<string>(() => localStorage.getItem('dqw_dh_mon1Name') || 'キラーマシン');
  const [mon1Pers, setMon1Pers] = useState<string>(() => localStorage.getItem('dqw_dh_mon1Pers') || 'いっぴきおおかみ');
  const [mon1Qual, setMon1Qual] = useState<string>(() => localStorage.getItem('dqw_dh_mon1Qual') || '極');
  const [mon1InputMode, setMon1InputMode] = useState<'individual' | 'direct'>(() => {
    const val = localStorage.getItem('dqw_dh_mon1InputMode');
    return (val === 'individual' || val === 'direct') ? val : 'individual';
  });
  const [mon1Ikkatu, setMon1Ikkatu] = useState<string>(() => localStorage.getItem('dqw_dh_mon1Ikkatu') || '0');
  const [mon1Seityou, setMon1Seityou] = useState<string>(() => localStorage.getItem('dqw_dh_mon1Seityou') || '0');
  const [mon1Slot1, setMon1Slot1] = useState<string>(() => localStorage.getItem('dqw_dh_mon1Slot1') || '0');
  const [mon1Slot2, setMon1Slot2] = useState<string>(() => localStorage.getItem('dqw_dh_mon1Slot2') || '0');
  const [mon1Slot3, setMon1Slot3] = useState<string>(() => localStorage.getItem('dqw_dh_mon1Slot3') || '0');
  const [mon1Buff, setMon1Buff] = useState<string>(() => localStorage.getItem('dqw_dh_mon1Buff') || '0');

  // モンスター 2 (右 / 敵)
  const [mon2Name, setMon2Name] = useState<string>(() => localStorage.getItem('dqw_dh_mon2Name') || 'キラーマシン');
  const [mon2Pers, setMon2Pers] = useState<string>(() => localStorage.getItem('dqw_dh_mon2Pers') || 'いっぴきおおかみ');
  const [mon2Qual, setMon2Qual] = useState<string>(() => localStorage.getItem('dqw_dh_mon2Qual') || '極');
  const [mon2InputMode, setMon2InputMode] = useState<'individual' | 'direct'>(() => {
    const val = localStorage.getItem('dqw_dh_mon2InputMode');
    return (val === 'individual' || val === 'direct') ? val : 'individual';
  });
  const [mon2Ikkatu, setMon2Ikkatu] = useState<string>(() => localStorage.getItem('dqw_dh_mon2Ikkatu') || '0');
  const [mon2Seityou, setMon2Seityou] = useState<string>(() => localStorage.getItem('dqw_dh_mon2Seityou') || '0');
  const [mon2Slot1, setMon2Slot1] = useState<string>(() => localStorage.getItem('dqw_dh_mon2Slot1') || '0');
  const [mon2Slot2, setMon2Slot2] = useState<string>(() => localStorage.getItem('dqw_dh_mon2Slot2') || '0');
  const [mon2Slot3, setMon2Slot3] = useState<string>(() => localStorage.getItem('dqw_dh_mon2Slot3') || '0');
  const [mon2Buff, setMon2Buff] = useState<string>(() => localStorage.getItem('dqw_dh_mon2Buff') || '0');

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

  // 補正後ステータス
  const [mon1Status, setMon1Status] = useState<Monster | null>(null);
  const [mon2Status, setMon2Status] = useState<Monster | null>(null);

  // localStorage への保存
  useEffect(() => {
    localStorage.setItem('dqw_dh_mon1Name', mon1Name);
    localStorage.setItem('dqw_dh_mon1Pers', mon1Pers);
    localStorage.setItem('dqw_dh_mon1Qual', mon1Qual);
    localStorage.setItem('dqw_dh_mon1InputMode', mon1InputMode);
    localStorage.setItem('dqw_dh_mon1Ikkatu', mon1Ikkatu);
    localStorage.setItem('dqw_dh_mon1Seityou', mon1Seityou);
    localStorage.setItem('dqw_dh_mon1Slot1', mon1Slot1);
    localStorage.setItem('dqw_dh_mon1Slot2', mon1Slot2);
    localStorage.setItem('dqw_dh_mon1Slot3', mon1Slot3);
    localStorage.setItem('dqw_dh_mon1Buff', mon1Buff);

    localStorage.setItem('dqw_dh_mon2Name', mon2Name);
    localStorage.setItem('dqw_dh_mon2Pers', mon2Pers);
    localStorage.setItem('dqw_dh_mon2Qual', mon2Qual);
    localStorage.setItem('dqw_dh_mon2InputMode', mon2InputMode);
    localStorage.setItem('dqw_dh_mon2Ikkatu', mon2Ikkatu);
    localStorage.setItem('dqw_dh_mon2Seityou', mon2Seityou);
    localStorage.setItem('dqw_dh_mon2Slot1', mon2Slot1);
    localStorage.setItem('dqw_dh_mon2Slot2', mon2Slot2);
    localStorage.setItem('dqw_dh_mon2Slot3', mon2Slot3);
    localStorage.setItem('dqw_dh_mon2Buff', mon2Buff);
  }, [
    mon1Name, mon1Pers, mon1Qual, mon1InputMode, mon1Ikkatu, mon1Seityou, mon1Slot1, mon1Slot2, mon1Slot3, mon1Buff,
    mon2Name, mon2Pers, mon2Qual, mon2InputMode, mon2Ikkatu, mon2Seityou, mon2Slot1, mon2Slot2, mon2Slot3, mon2Buff
  ]);

  // --- 計算用すばやさ ---
  const [agil1, setAgil1] = useState<number>(0);
  const [agil2, setAgil2] = useState<number>(0);
  const [winRate, setWinRate] = useState<number>(0);

  // ヘルパー: オリジナル Spinner 文字列から数値部分を抽出
  const parseSelectVal = (text: string): number => {
    const matched = text.replace(/[^0-9-]/g, "");
    return parseInt(matched, 10) || 0;
  };

  // ステータス更新
  useEffect(() => {
    const base1 = monsterMap[mon1Name] || monsterMap['デフォルト'];
    const pers1 = personalities[mon1Pers] || personalities['性格'];
    const qual1 = qualifications[mon1Qual] || 1;
    setMon1Status(calcMonsterStatus(base1, pers1, qual1));
  }, [mon1Name, mon1Pers, mon1Qual]);

  useEffect(() => {
    const base2 = monsterMap[mon2Name] || monsterMap['デフォルト'];
    const pers2 = personalities[mon2Pers] || personalities['性格'];
    const qual2 = qualifications[mon2Qual] || 1;
    setMon2Status(calcMonsterStatus(base2, pers2, qual2));
  }, [mon2Name, mon2Pers, mon2Qual]);

  // すばやさ合計・バフ適用計算
  useEffect(() => {
    if (!mon1Status) return;
    const baseSuba = mon1Status.speed;
    let finalSuba = 0;
    if (mon1InputMode === 'direct') {
      finalSuba = baseSuba + parseSelectVal(mon1Ikkatu);
    } else {
      finalSuba = baseSuba + parseSelectVal(mon1Seityou) + parseSelectVal(mon1Slot1) + parseSelectVal(mon1Slot2) + parseSelectVal(mon1Slot3);
    }
    // バフ適用 (1段階で+20%、2段階で+40%、デバフも同様)
    const buffVal = parseSelectVal(mon1Buff);
    const buffFactor = (10 + 2 * buffVal) / 10;
    setAgil1(Math.floor(finalSuba * buffFactor));
  }, [mon1Status, mon1InputMode, mon1Ikkatu, mon1Seityou, mon1Slot1, mon1Slot2, mon1Slot3, mon1Buff]);

  useEffect(() => {
    if (!mon2Status) return;
    const baseSuba = mon2Status.speed;
    let finalSuba = 0;
    if (mon2InputMode === 'direct') {
      finalSuba = baseSuba + parseSelectVal(mon2Ikkatu);
    } else {
      finalSuba = baseSuba + parseSelectVal(mon2Seityou) + parseSelectVal(mon2Slot1) + parseSelectVal(mon2Slot2) + parseSelectVal(mon2Slot3);
    }
    const buffVal = parseSelectVal(mon2Buff);
    const buffFactor = (10 + 2 * buffVal) / 10;
    setAgil2(Math.floor(finalSuba * buffFactor));
  }, [mon2Status, mon2InputMode, mon2Ikkatu, mon2Seityou, mon2Slot1, mon2Slot2, mon2Slot3, mon2Buff]);

  // 先制確率シミュレート (16x16通り)
  useEffect(() => {
    const factors = Array.from({ length: 16 }, (_, i) => 1.00 + i * 0.01);
    const A_arr = factors.map(f => Math.floor(agil1 * f));
    const B_arr = factors.map(f => Math.floor(agil2 * f));

    let winCount = 0;
    A_arr.forEach(a => {
      B_arr.forEach(b => {
        if (b <= a) {
          winCount++;
        }
      });
    });

    setWinRate((winCount / 256) * 100);
  }, [agil1, agil2]);

  const mon1BaseSpeed = mon1Status ? mon1Status.speed : 0;
  const mon1IseiSpeed = mon1InputMode === 'direct' 
    ? parseSelectVal(mon1Ikkatu) 
    : parseSelectVal(mon1Seityou) + parseSelectVal(mon1Slot1) + parseSelectVal(mon1Slot2) + parseSelectVal(mon1Slot3);

  const mon2BaseSpeed = mon2Status ? mon2Status.speed : 0;
  const mon2IseiSpeed = mon2InputMode === 'direct' 
    ? parseSelectVal(mon2Ikkatu) 
    : parseSelectVal(mon2Seityou) + parseSelectVal(mon2Slot1) + parseSelectVal(mon2Slot2) + parseSelectVal(mon2Slot3);

  // すばやさ乱数比較用の範囲計算
  const mon1Min = agil1;
  const mon1Max = Math.floor(agil1 * 1.15);
  const mon2Min = agil2;
  const mon2Max = Math.floor(agil2 * 1.15);

  const minVal = Math.min(mon1Min, mon2Min);
  const maxVal = Math.max(mon1Max, mon2Max);
  const diff = maxVal - minVal;

  // 共通のスケール範囲（左右に10%ずつのバッファを設け、かつ最低10の余白を設ける）
  const buffer = Math.max(Math.round(diff * 0.1), 10);
  const scaleMin = Math.max(0, minVal - buffer);
  const scaleMax = maxVal + buffer;
  const scaleRange = scaleMax - scaleMin || 1; // 0除算対策

  const getPercent = (val: number) => {
    const pct = ((val - scaleMin) / scaleRange) * 100;
    return Math.max(0, Math.min(100, pct)); // 0% ~ 100% の範囲に収める
  };

  const mon1Left = getPercent(mon1Min);
  const mon1Width = Math.max(8, getPercent(mon1Max) - mon1Left); // 最低幅を確保

  const mon2Left = getPercent(mon2Min);
  const mon2Width = Math.max(8, getPercent(mon2Max) - mon2Left);

  return (
    <div className="fade-in">
      <div className="tab-header" style={{ marginBottom: '10px' }}>
        <h2>誰はや - すばやさ比較 & 先制率</h2>
      </div>

      <div className="dashboard-grid">
        {/* 1. 確率シミュレーション結果 (スマホでの操作性を考慮し最上部に配置) */}
        <div className="glass-panel glow-gold" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--accent-gold)', marginBottom: '8px', fontSize: '1rem' }}>🏆 先制率</h3>
          
          <div style={{ 
            position: 'relative',
            width: '140px', 
            height: '140px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            {/* SVG Progress Circle */}
            <svg width="140" height="140" style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
              {/* Background Track */}
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="transparent"
                stroke="rgba(197, 168, 128, 0.15)"
                strokeWidth="6"
              />
              {/* Animated Foreground Progress */}
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="transparent"
                stroke="var(--accent-gold)"
                strokeWidth="6"
                strokeDasharray="377"
                strokeDashoffset={377 - (377 * winRate) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.35s ease' }}
              />
            </svg>
            
            {/* Centered Percentage Text */}
            <div style={{ 
              zIndex: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <div style={{ fontSize: '1.73rem', fontWeight: '900', color: 'var(--accent-gold)' }}>
                {winRate.toFixed(1)}%
              </div>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '12px' }}>
            すばやさ乱数（1.00〜1.15倍）
          </p>

          {/* すばやさ乱数比較 ビジュアルレンジバー */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>味方: {mon1Min} 〜 {mon1Max}</span>
                <span style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>敵: {mon2Min} 〜 {mon2Max}</span>
              </div>

              {/* 共通の数軸ゲージ */}
              <div style={{ 
                position: 'relative', 
                height: '38px', 
                background: 'rgba(0, 0, 0, 0.04)', 
                borderRadius: '6px', 
                border: '1px solid rgba(0, 0, 0, 0.03)',
                margin: '4px 0 6px 0',
                padding: '2px 0'
              }}>
                {/* 味方（青）のレンジバー */}
                <div style={{
                  position: 'absolute',
                  left: `${mon1Left}%`,
                  width: `${mon1Width}%`,
                  height: '11px',
                  top: '5px',
                  background: 'linear-gradient(90deg, #1b2a4b, #2c3e6b)',
                  borderRadius: '10px',
                  boxShadow: '0 1px 3px rgba(27, 42, 75, 0.15)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />

                {/* 敵（赤）のレンジバー */}
                <div style={{
                  position: 'absolute',
                  left: `${mon2Left}%`,
                  width: `${mon2Width}%`,
                  height: '11px',
                  bottom: '5px',
                  background: 'linear-gradient(90deg, #8e2430, #b23b49)',
                  borderRadius: '10px',
                  boxShadow: '0 1px 3px rgba(142, 36, 48, 0.15)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
              
              {/* スケールの両端表示 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.77rem', color: 'var(--text-muted)' }}>
                <span>遅 ({scaleMin})</span>
                <span>速 ({scaleMax})</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. モンスター 1 (味方) アコーディオン */}
        <div className="glass-panel">
          <div className="collapsible-header" onClick={() => setMon1Open(!mon1Open)}>
            <h3 style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '1.0rem' }}>
              🔵 味方すばやさ: <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{agil1}</span>
              <span style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, rgba(27, 42, 75, 0.12), rgba(27, 42, 75, 0.05))',
                border: '1px solid rgba(27, 42, 75, 0.25)',
                borderRadius: '20px',
                padding: '2px 12px',
                fontSize: '0.93rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '0.02em',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}>
                {mon1Name} / {mon1Pers} / {mon1Qual} ({mon1BaseSpeed} + {mon1IseiSpeed})
              </span>
            </h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{mon1Open ? '▲' : '▼'}</span>
          </div>
          
          {mon1Open && (
            <div className="collapsible-content">
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>モンスター（歩数フィルター）</label>
                <div className="step-family-selector">
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
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>性格</label>
                  <Dropdown 
                    options={Object.keys(personalities)} 
                    value={mon1Pers} 
                    onChange={setMon1Pers} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>素質</label>
                  <Dropdown 
                    options={Object.keys(qualifications)} 
                    value={mon1Qual} 
                    onChange={setMon1Qual} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <button 
                  className={`btn ${mon1InputMode === 'individual' ? 'btn-primary' : ''}`} 
                  style={{ flex: 1, height: '36px', fontSize: '0.93rem' }}
                  onClick={() => setMon1InputMode('individual')}
                >
                  詳細個別入力
                </button>
                <button 
                  className={`btn ${mon1InputMode === 'direct' ? 'btn-primary' : ''}`} 
                  style={{ flex: 1, height: '36px', fontSize: '0.93rem' }}
                  onClick={() => setMon1InputMode('direct')}
                >
                  一括入力
                </button>
              </div>


              {mon1InputMode === 'individual' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>成長すばやさ</label>
                      <Dropdown 
                        options={['0', '7(D)', '15(C)', '25(B)', '35(A)', '50(S)']} 
                        value={mon1Seityou} 
                        onChange={setMon1Seityou} 
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>継承玉①</label>
                      <Dropdown 
                        options={['0', '7(D)', '15(C)', '25(B)', '35(A)', '50(S)']} 
                        value={mon1Slot1} 
                        onChange={setMon1Slot1} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>継承玉②</label>
                      <Dropdown 
                        options={['0', '7(D)', '15(C)', '25(B)', '35(A)', '50(S)']} 
                        value={mon1Slot2} 
                        onChange={setMon1Slot2} 
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>継承玉③</label>
                      <Dropdown 
                        options={['0', '7(D)', '15(C)', '25(B)', '35(A)', '50(S)']} 
                        value={mon1Slot3} 
                        onChange={setMon1Slot3} 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>すばやさ合計</label>
                  <Dropdown 
                    options={['0','7(D)','14','15(C)','21','22','25(B)','29','30','32','35(A)','37','39','40','42','45','47','49','50(S)','55','57','60','64','65','67','70','72','75','77','80','82','85','90','92','95','100','105','107','110','115','120','125','135','150']} 
                    value={mon1Ikkatu} 
                    onChange={setMon1Ikkatu} 
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>すばやさバフ段階</label>
                <Dropdown 
                  options={[
                    { value: '-2', label: '-2段階 (-40%)' },
                    { value: '-1', label: '-1段階 (-20%)' },
                    { value: '0', label: '無し (±0%)' },
                    { value: '+1', label: '+1段階 (+20%)' },
                    { value: '+2', label: '+2段階 (+40%)' }
                  ]} 
                  value={mon1Buff} 
                  onChange={setMon1Buff} 
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. モンスター 2 (敵) アコーディオン */}
        <div className="glass-panel">
          <div className="collapsible-header" onClick={() => setMon2Open(!mon2Open)}>
            <h3 style={{ color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '1.0rem' }}>
              🔴 敵すばやさ: <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{agil2}</span>
              <span style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, rgba(142, 36, 48, 0.12), rgba(142, 36, 48, 0.05))',
                border: '1px solid rgba(142, 36, 48, 0.25)',
                borderRadius: '20px',
                padding: '2px 12px',
                fontSize: '0.93rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '0.02em',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}>
                {mon2Name} / {mon2Pers} / {mon2Qual} ({mon2BaseSpeed} + {mon2IseiSpeed})
              </span>
            </h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{mon2Open ? '▲' : '▼'}</span>
          </div>
          
          {mon2Open && (
            <div className="collapsible-content">
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>モンスター（歩数フィルター）</label>
                <div className="step-family-selector">
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
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>性格</label>
                  <Dropdown 
                    options={Object.keys(personalities)} 
                    value={mon2Pers} 
                    onChange={setMon2Pers} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>素質</label>
                  <Dropdown 
                    options={Object.keys(qualifications)} 
                    value={mon2Qual} 
                    onChange={setMon2Qual} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <button 
                  className={`btn ${mon2InputMode === 'individual' ? 'btn-primary' : ''}`} 
                  style={{ flex: 1, height: '36px', fontSize: '0.93rem' }}
                  onClick={() => setMon2InputMode('individual')}
                >
                  詳細個別入力
                </button>
                <button 
                  className={`btn ${mon2InputMode === 'direct' ? 'btn-primary' : ''}`} 
                  style={{ flex: 1, height: '36px', fontSize: '0.93rem' }}
                  onClick={() => setMon2InputMode('direct')}
                >
                  一括入力
                </button>
              </div>

              {mon2InputMode === 'individual' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>成長すばやさ</label>
                      <Dropdown 
                        options={['0', '7(D)', '15(C)', '25(B)', '35(A)', '50(S)']} 
                        value={mon2Seityou} 
                        onChange={setMon2Seityou} 
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>継承玉①</label>
                      <Dropdown 
                        options={['0', '7(D)', '15(C)', '25(B)', '35(A)', '50(S)']} 
                        value={mon2Slot1} 
                        onChange={setMon2Slot1} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>継承玉②</label>
                      <Dropdown 
                        options={['0', '7(D)', '15(C)', '25(B)', '35(A)', '50(S)']} 
                        value={mon2Slot2} 
                        onChange={setMon2Slot2} 
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>継承玉③</label>
                      <Dropdown 
                        options={['0', '7(D)', '15(C)', '25(B)', '35(A)', '50(S)']} 
                        value={mon2Slot3} 
                        onChange={setMon2Slot3} 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>すばやさ合計</label>
                  <Dropdown 
                    options={['0','7(D)','14','15(C)','21','22','25(B)','29','30','32','35(A)','37','39','40','42','45','47','49','50(S)','55','57','60','64','65','67','70','72','75','77','80','82','85','90','92','95','100','105','107','110','115','120','125','135','150']} 
                    value={mon2Ikkatu} 
                    onChange={setMon2Ikkatu} 
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>すばやさバフ段階</label>
                <Dropdown 
                  options={[
                    { value: '-2', label: '-2段階 (-40%)' },
                    { value: '-1', label: '-1段階 (-20%)' },
                    { value: '0', label: '無し (±0%)' },
                    { value: '+1', label: '+1段階 (+20%)' },
                    { value: '+2', label: '+2段階 (+40%)' }
                  ]} 
                  value={mon2Buff} 
                  onChange={setMon2Buff} 
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

