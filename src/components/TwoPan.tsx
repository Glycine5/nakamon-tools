import React, { useState, useEffect } from 'react';
import { monsterMap } from '../data/monsters';
import { 
  monsterList, 
  skillZenList, 
  skillTanList, 
  jumonZenList, 
  jumonTanList,
  getZenPhysicalSkill,
  getTanPhysicalSkill,
  getJumonSkill,
  getBreathSkill,
  getMonsterStepFamily
} from '../data/skills';
import { personalities, qualifications } from '../data/constants';
import { calcMonsterStatus, calcPhysicalDamage, calcJumonBreathDamage } from '../utils/calculator';
import type { Monster } from '../types';
import { Dropdown } from './Dropdown';
import { savePreset } from '../utils/presetManager';
import { PresetModal } from './PresetModal';



export const TwoPan: React.FC = () => {
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  // --- スマホ用アコーディオン開閉状態 ---
  const [atkAOpen, setAtkAOpen] = useState<boolean>(true);
  const [atkBOpen, setAtkBOpen] = useState<boolean>(false);
  const [defOpen, setDefOpen] = useState<boolean>(false);

  // --- 状態管理 ---
  // 1. 攻撃者 A
  const [atkAName, setAtkAName] = useState<string>(() => localStorage.getItem('dqw_two_atkAName') || 'キラーマシン');
  const [atkAPers, setAtkAPers] = useState<string>(() => localStorage.getItem('dqw_two_atkAPers') || 'いっぴきおおかみ');
  const [atkAQual, setAtkAQual] = useState<string>(() => localStorage.getItem('dqw_two_atkAQual') || '極');
  const [atkASkillType, setAtkASkillType] = useState<'physical_zen' | 'physical_tan' | 'spell_zen' | 'spell_tan'>(() => {
    const val = localStorage.getItem('dqw_two_atkASkillType');

  return (val === 'physical_zen' || val === 'physical_tan' || val === 'spell_zen' || val === 'spell_tan') ? val : 'physical_tan';
  });
  const [atkASkillName, setAtkASkillName] = useState<string>(() => localStorage.getItem('dqw_two_atkASkillName') || '通常攻撃');
  const [atkABaiki, setAtkABaiki] = useState<string>(() => localStorage.getItem('dqw_two_atkABaiki') || '0');
  const [atkAForce, setAtkAForce] = useState<string>(() => localStorage.getItem('dqw_two_atkAForce') || '-');
  const [atkAKougeki, setAtkAKougeki] = useState<string>(() => localStorage.getItem('dqw_two_atkAKougeki') || '0');
  const [atkAKouma, setAtkAKouma] = useState<string>(() => localStorage.getItem('dqw_two_atkAKouma') || '0');
  const [atkAKiyousa, setAtkAKiyousa] = useState<string>(() => localStorage.getItem('dqw_two_atkAKiyousa') || '0');
  const [atkAZokusei, setAtkAZokusei] = useState<string>(() => localStorage.getItem('dqw_two_atkAZokusei') || '0');
  const [atkAZokuzen, setAtkAZokuzen] = useState<string>(() => localStorage.getItem('dqw_two_atkAZokuzen') || '0');
  const [atkAKeitou, setAtkAKeitou] = useState<string>(() => localStorage.getItem('dqw_two_atkAKeitou') || '0');
  const [atkAKouryu, setAtkAKouryu] = useState<string>(() => localStorage.getItem('dqw_two_atkAKouryu') || '0');
  const [atkABousou, setAtkABousou] = useState<boolean>(() => localStorage.getItem('dqw_two_atkABousou') === 'true');

  // 2. 攻撃者 B
  const [atkBName, setAtkBName] = useState<string>(() => localStorage.getItem('dqw_two_atkBName') || 'キラーマシン');
  const [atkBPers, setAtkBPers] = useState<string>(() => localStorage.getItem('dqw_two_atkBPers') || 'いっぴきおおかみ');
  const [atkBQual, setAtkBQual] = useState<string>(() => localStorage.getItem('dqw_two_atkBQual') || '極');
  const [atkBSkillType, setAtkBSkillType] = useState<'physical_zen' | 'physical_tan' | 'spell_zen' | 'spell_tan'>(() => {
    const val = localStorage.getItem('dqw_two_atkBSkillType');
    return (val === 'physical_zen' || val === 'physical_tan' || val === 'spell_zen' || val === 'spell_tan') ? val : 'spell_tan';
  });
  const [atkBSkillName, setAtkBSkillName] = useState<string>(() => localStorage.getItem('dqw_two_atkBSkillName') || 'メラゾーマ');
  const [atkBBaiki, setAtkBBaiki] = useState<string>(() => localStorage.getItem('dqw_two_atkBBaiki') || '0');
  const [atkBForce, setAtkBForce] = useState<string>(() => localStorage.getItem('dqw_two_atkBForce') || '-');
  const [atkBKougeki, setAtkBKougeki] = useState<string>(() => localStorage.getItem('dqw_two_atkBKougeki') || '0');
  const [atkBKouma, setAtkBKouma] = useState<string>(() => localStorage.getItem('dqw_two_atkBKouma') || '0');
  const [atkBKiyousa, setAtkBKiyousa] = useState<string>(() => localStorage.getItem('dqw_two_atkBKiyousa') || '0');
  const [atkBZokusei, setAtkBZokusei] = useState<string>(() => localStorage.getItem('dqw_two_atkBZokusei') || '0');
  const [atkBZokuzen, setAtkBZokuzen] = useState<string>(() => localStorage.getItem('dqw_two_atkBZokuzen') || '0');
  const [atkBKeitou, setAtkBKeitou] = useState<string>(() => localStorage.getItem('dqw_two_atkBKeitou') || '0');
  const [atkBKouryu, setAtkBKouryu] = useState<string>(() => localStorage.getItem('dqw_two_atkBKouryu') || '0');
  const [atkBBousou, setAtkBBousou] = useState<boolean>(() => localStorage.getItem('dqw_two_atkBBousou') === 'true');

  // 3. 防御者 (敵)
  const [defName, setDefName] = useState<string>(() => localStorage.getItem('dqw_two_defName') || 'キラーマシン');
  const [defPers, setDefPers] = useState<string>(() => localStorage.getItem('dqw_two_defPers') || 'いっぴきおおかみ');
  const [defQual, setDefQual] = useState<string>(() => localStorage.getItem('dqw_two_defQual') || '極');
  const [defSkalaText, setDefSkalaText] = useState<string>(() => localStorage.getItem('dqw_two_defSkalaText') || '0');
  const [defAdditionalHPText, setDefAdditionalHPText] = useState<string>(() => localStorage.getItem('dqw_two_defAdditionalHPText') || '0'); // 継承玉等による追加HP (オリジナル選択肢)
  const [defSyubi, setDefSyubi] = useState<string>(() => localStorage.getItem('dqw_two_defSyubi') || '0');
  const [defZokuseiTai, setDefZokuseiTai] = useState<string>(() => localStorage.getItem('dqw_two_defZokuseiTai') || '0');
  const [defKeitouTai, setDefKeitouTai] = useState<string>(() => localStorage.getItem('dqw_two_defKeitouTai') || '0');
  const [defZantai, setDefZantai] = useState<string>(() => localStorage.getItem('dqw_two_defZantai') || '0');
  const [defJumon, setDefJumon] = useState<string>(() => localStorage.getItem('dqw_two_defJumon') || '0');
  const [defBreath, setDefBreath] = useState<string>(() => localStorage.getItem('dqw_two_defBreath') || '0');

  // --- 歩数フィルター状態 ---
  const [atkAStepFilter, setAtkAStepFilter] = useState<string>('18k');
  const [atkBStepFilter, setAtkBStepFilter] = useState<string>('18k');
  const [defStepFilter, setDefStepFilter] = useState<string>('18k');

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

  const handleAtkAStepFilterChange = (filter: string) => {
    setAtkAStepFilter(filter);
    if (filter !== 'すべて') {
      const filtered = getFilteredMonsters(filter);
      if (filtered.length > 0 && !filtered.includes(atkAName)) {
        setAtkAName(filtered[0]);
      }
    }
  };

  const handleAtkBStepFilterChange = (filter: string) => {
    setAtkBStepFilter(filter);
    if (filter !== 'すべて') {
      const filtered = getFilteredMonsters(filter);
      if (filtered.length > 0 && !filtered.includes(atkBName)) {
        setAtkBName(filtered[0]);
      }
    }
  };

  const handleDefStepFilterChange = (filter: string) => {
    setDefStepFilter(filter);
    if (filter !== 'すべて') {
      const filtered = getFilteredMonsters(filter);
      if (filtered.length > 0 && !filtered.includes(defName)) {
        setDefName(filtered[0]);
      }
    }
  };

  const filteredAtkAMonsterList = getFilteredMonsters(atkAStepFilter);
  const filteredAtkBMonsterList = getFilteredMonsters(atkBStepFilter);
  const filteredDefMonsterList = getFilteredMonsters(defStepFilter);

  // 補正後ステータス
  const [atkAStatus, setAtkAStatus] = useState<Monster | null>(null);
  const [atkBStatus, setAtkBStatus] = useState<Monster | null>(null);
  const [defStatus, setDefStatus] = useState<Monster | null>(null);

  // localStorage への保存
  useEffect(() => {
    localStorage.setItem('dqw_two_atkAName', atkAName);
    localStorage.setItem('dqw_two_atkAPers', atkAPers);
    localStorage.setItem('dqw_two_atkAQual', atkAQual);
    localStorage.setItem('dqw_two_atkASkillType', atkASkillType);
    localStorage.setItem('dqw_two_atkASkillName', atkASkillName);
    localStorage.setItem('dqw_two_atkABaiki', atkABaiki);
    localStorage.setItem('dqw_two_atkAForce', atkAForce);
    localStorage.setItem('dqw_two_atkAKougeki', atkAKougeki);
    localStorage.setItem('dqw_two_atkAKouma', atkAKouma);
    localStorage.setItem('dqw_two_atkAKiyousa', atkAKiyousa);
    localStorage.setItem('dqw_two_atkAZokusei', atkAZokusei);
    localStorage.setItem('dqw_two_atkAZokuzen', atkAZokuzen);
    localStorage.setItem('dqw_two_atkAKeitou', atkAKeitou);
    localStorage.setItem('dqw_two_atkAKouryu', atkAKouryu);
    localStorage.setItem('dqw_two_atkABousou', String(atkABousou));

    localStorage.setItem('dqw_two_atkBName', atkBName);
    localStorage.setItem('dqw_two_atkBPers', atkBPers);
    localStorage.setItem('dqw_two_atkBQual', atkBQual);
    localStorage.setItem('dqw_two_atkBSkillType', atkBSkillType);
    localStorage.setItem('dqw_two_atkBSkillName', atkBSkillName);
    localStorage.setItem('dqw_two_atkBBaiki', atkBBaiki);
    localStorage.setItem('dqw_two_atkBForce', atkBForce);
    localStorage.setItem('dqw_two_atkBKougeki', atkBKougeki);
    localStorage.setItem('dqw_two_atkBKouma', atkBKouma);
    localStorage.setItem('dqw_two_atkBKiyousa', atkBKiyousa);
    localStorage.setItem('dqw_two_atkBZokusei', atkBZokusei);
    localStorage.setItem('dqw_two_atkBZokuzen', atkBZokuzen);
    localStorage.setItem('dqw_two_atkBKeitou', atkBKeitou);
    localStorage.setItem('dqw_two_atkBKouryu', atkBKouryu);
    localStorage.setItem('dqw_two_atkBBousou', String(atkBBousou));

    localStorage.setItem('dqw_two_defName', defName);
    localStorage.setItem('dqw_two_defPers', defPers);
    localStorage.setItem('dqw_two_defQual', defQual);
    localStorage.setItem('dqw_two_defSkalaText', defSkalaText);
    localStorage.setItem('dqw_two_defAdditionalHPText', defAdditionalHPText);
    localStorage.setItem('dqw_two_defSyubi', defSyubi);
    localStorage.setItem('dqw_two_defZokuseiTai', defZokuseiTai);
    localStorage.setItem('dqw_two_defKeitouTai', defKeitouTai);
    localStorage.setItem('dqw_two_defZantai', defZantai);
    localStorage.setItem('dqw_two_defJumon', defJumon);
    localStorage.setItem('dqw_two_defBreath', defBreath);
  }, [
    atkAName, atkAPers, atkAQual, atkASkillType, atkASkillName, atkABaiki, atkAForce, atkAKougeki, atkAKouma, atkAKiyousa, atkAZokusei, atkAZokuzen, atkAKeitou, atkAKouryu, atkABousou,
    atkBName, atkBPers, atkBQual, atkBSkillType, atkBSkillName, atkBBaiki, atkBForce, atkBKougeki, atkBKouma, atkBKiyousa, atkBZokusei, atkBZokuzen, atkBKeitou, atkBKouryu, atkBBousou,
    defName, defPers, defQual, defSkalaText, defAdditionalHPText, defSyubi, defZokuseiTai, defKeitouTai, defZantai, defJumon, defBreath
  ]);

  // ヘルパー: オリジナル Spinner 文字列から数値部分を抽出
  const parseSelectVal = (text: string): number => {
    const matched = text.replace(/[^0-9-]/g, "");
    return parseInt(matched, 10) || 0;
  };

  // ステータス連動
  useEffect(() => {
    const b = monsterMap[atkAName] || monsterMap['デフォルト'];
    setAtkAStatus(calcMonsterStatus(b, personalities[atkAPers], qualifications[atkAQual]));
  }, [atkAName, atkAPers, atkAQual]);

  useEffect(() => {
    const b = monsterMap[atkBName] || monsterMap['デフォルト'];
    setAtkBStatus(calcMonsterStatus(b, personalities[atkBPers], qualifications[atkBQual]));
  }, [atkBName, atkBPers, atkBQual]);

  useEffect(() => {
    const b = monsterMap[defName] || monsterMap['デフォルト'];
    setDefStatus(calcMonsterStatus(b, personalities[defPers], qualifications[defQual]));
  }, [defName, defPers, defQual]);

  // スキル選択の選択肢動的切り替え
  const getSkillOptions = (type: string) => {
    switch (type) {
      case 'physical_zen': return skillZenList;
      case 'physical_tan': return skillTanList;
      case 'spell_zen': return jumonZenList;
      case 'spell_tan': return jumonTanList;
      default: return [];
    }
  };

  useEffect(() => {
    const opts = getSkillOptions(atkASkillType);
    if (!opts.includes(atkASkillName)) {
      setAtkASkillName(opts[0] || '');
    }
  }, [atkASkillType]);

  useEffect(() => {
    const opts = getSkillOptions(atkBSkillType);
    if (!opts.includes(atkBSkillName)) {
      setAtkBSkillName(opts[0] || '');
    }
  }, [atkBSkillType]);

  if (!atkAStatus || !atkBStatus || !defStatus) return null;

  // --- 補正値のパース ---
  const syubiHosei = parseSelectVal(defSyubi);
  const skalaHosei = parseSelectVal(defSkalaText);
  const zokuseiTaiHosei = parseSelectVal(defZokuseiTai);
  const keitouTaiHosei = parseSelectVal(defKeitouTai);
  const zantaiTaiHosei = parseSelectVal(defZantai);
  const jumonTaiHosei = parseSelectVal(defJumon);
  const breathTaiHosei = parseSelectVal(defBreath);

  // --- ダメージ算出関数 ---
  const calculateDamageForAttacker = (
    status: Monster,
    skillType: string,
    skillName: string,
    kougekiHosei: number,
    koumaHosei: number,
    baikiHosei: number,
    zokuseiHosei: number,
    zokuzenHosei: number,
    keitouHosei: number,
    kouryuMag: number,
    force: string,
    kiyousaHosei: number,
    isBousou: boolean
  ) => {
    let min = 0, avg = 0, max = 0;

    if (skillType === 'physical_zen' || skillType === 'physical_tan') {
      const isZen = skillType === 'physical_zen';
      const skillData = isZen 
        ? getZenPhysicalSkill(skillName, defStatus.family) 
        : getTanPhysicalSkill(skillName, defStatus.family);
      
      const zokusei = force === 'ドルマ' && skillData.skill.raw[6] === 10 ? 18 : (skillData.skill.raw[6] as number);
      const resist = defStatus.raw ? (defStatus.raw[zokusei] as number) : 1;
      const addMag = force === 'ドルマ' && zokusei === 18 ? 0.8 : 1;
      
      let finalPower = status.power;
      if (skillData.skill.raw[1] === 'hukugou') {
        finalPower = Math.floor(0.85 * (status.power + kougekiHosei) * (1 + 0.2 * baikiHosei)) + Math.floor(0.85 * (status.magic + koumaHosei));
      } else if (skillData.skill.raw[1] === 'koukai') {
        finalPower = Math.floor(0.50 * (status.power + kougekiHosei) * (1 + 0.2 * baikiHosei)) + Math.floor(1.30 * (status.heal + koumaHosei));
      } else {
        finalPower = (status.power + kougekiHosei) * (1 + 0.2 * baikiHosei);
      }

      const res = calcPhysicalDamage({
        power: finalPower,
        guard: skillName === '冥王(直撃)' ? 0 : defStatus.guard,
        syubi_hosei: skillName === '冥王(直撃)' ? 0 : syubiHosei,
        skala_hosei: skalaHosei,
        skill_mag: skillData.skill.raw[0] as number,
        resist,
        zokusei_tai_hosei: zokuseiTaiHosei,
        zantaitai_hosei: zantaiTaiHosei,
        keitou_tai_hosei: keitouTaiHosei,
        zokusei_hosei: zokuseiHosei,
        zokuzen_hosei: zokuzenHosei,
        keitou_hosei: keitouHosei,
        additional_mag: addMag,
        kouryu_mag: kouryuMag,
        isBousou,
        bousouType: skillData.skill.raw[5] as number
      });
      min = res.min;
      avg = res.damage;
      max = res.max;
    } else {
      const isZen = skillType === 'spell_zen';
      const skillData = isZen ? getJumonSkill(skillName) : getBreathSkill(skillName);
      const zokusei = skillData.raw[6] as number;
      const isHeal = zokusei === 19;
      const resist = isHeal ? 1 : (defStatus.raw ? (defStatus.raw[zokusei] as number) : 1);
      const isBreath = skillData.raw[5] === 2;

      let currentMagicOrHeal = isHeal ? status.heal : status.magic;
      if (isBreath) {
        const currentPower = status.power + kougekiHosei;
        const currentDex = status.dexterity + kiyousaHosei;
        currentMagicOrHeal = Math.floor(currentPower * (1 + 0.2 * baikiHosei)) + currentDex;
      }
      
      const res = calcJumonBreathDamage({
        skill: skillData,
        magicOrHeal: currentMagicOrHeal,
        power: status.power,
        kouma_hosei: koumaHosei,
        resist,
        zokusei_tai_hosei: isHeal ? 0 : zokuseiTaiHosei,
        additional_mag: 1,
        zokusei_hosei: zokuseiHosei,
        zokuzen_hosei: zokuzenHosei,
        keitou_hosei: keitouHosei,
        skeitou_tai_hosei: isHeal ? 0 : (skillData.raw[5] === 2 ? breathTaiHosei : jumonTaiHosei),
        jumontai_hosei: isHeal ? 0 : (skillData.raw[5] === 2 ? breathTaiHosei : jumonTaiHosei),
        keitou_tai_hosei: isHeal ? 0 : keitouTaiHosei,
        kouryu_mag: kouryuMag,
        is_healing: isHeal,
        isBousou
      });
      
      min = isHeal ? 0 : res.min;
      avg = isHeal ? 0 : res.damage;
      max = isHeal ? 0 : res.max;
    }

    return { min, avg, max };
  };

  // 攻撃者 A
  const kougekiHoseiA = parseSelectVal(atkAKougeki);
  const koumaHoseiA = parseSelectVal(atkAKouma);
  const baikiHoseiA = parseSelectVal(atkABaiki);
  const zokuseiHoseiA = parseSelectVal(atkAZokusei);
  const zokuzenHoseiA = parseSelectVal(atkAZokuzen);
  const keitouHoseiA = parseSelectVal(atkAKeitou);
  const kouryuMagA = atkAKouryu === '+1' ? 1.2 : atkAKouryu === '+2' ? 1.4 : atkAKouryu === '+3' ? 1.6 : atkAKouryu === '+4' ? 1.8 : 1;

  // 攻撃者 B
  const kougekiHoseiB = parseSelectVal(atkBKougeki);
  const koumaHoseiB = parseSelectVal(atkBKouma);
  const baikiHoseiB = parseSelectVal(atkBBaiki);
  const zokuseiHoseiB = parseSelectVal(atkBZokusei);
  const zokuzenHoseiB = parseSelectVal(atkBZokuzen);
  const keitouHoseiB = parseSelectVal(atkBKeitou);
  const kouryuMagB = atkBKouryu === '+1' ? 1.2 : atkBKouryu === '+2' ? 1.4 : atkBKouryu === '+3' ? 1.6 : atkBKouryu === '+4' ? 1.8 : 1;

  const resA = calculateDamageForAttacker(
    atkAStatus, atkASkillType, atkASkillName, 
    kougekiHoseiA, koumaHoseiA, baikiHoseiA, zokuseiHoseiA, zokuzenHoseiA, keitouHoseiA, kouryuMagA, atkAForce,
    parseSelectVal(atkAKiyousa), atkABousou
  );
  const resB = calculateDamageForAttacker(
    atkBStatus, atkBSkillType, atkBSkillName, 
    kougekiHoseiB, koumaHoseiB, baikiHoseiB, zokuseiHoseiB, zokuzenHoseiB, keitouHoseiB, kouryuMagB, atkBForce,
    parseSelectVal(atkBKiyousa), atkBBousou
  );

  // 合計ダメージと判定
  const totalMin = resA.min + resB.min;
  const totalAvg = resA.avg + resB.avg;
  const totalMax = resA.max + resB.max;

  const defAdditionalHP = parseSelectVal(defAdditionalHPText);
  const targetHP = defStatus.hp + defAdditionalHP;

  // 16分割の代表点を作成して全256通りのダメージ組み合わせから撃破確率を計算
  const getDamageCandidates = (min: number, max: number): number[] => {
    if (min === max) return [min];
    const cand: number[] = [];
    for (let i = 0; i < 16; i++) {
      cand.push(min + (max - min) * (i / 15));
    }
    return cand;
  };

  const candA = getDamageCandidates(resA.min, resA.max);
  const candB = getDamageCandidates(resB.min, resB.max);

  let winCount = 0;
  let totalCombinations = 0;
  for (const dA of candA) {
    for (const dB of candB) {
      if (dA + dB >= targetHP) {
        winCount++;
      }
      totalCombinations++;
    }
  }

  const killProb = totalCombinations > 0 ? (winCount / totalCombinations) * 100 : 0;

  // 判定文言の生成
  let killStatus = '';
  if (killProb === 100) {
    killStatus = '100%';
  } else if (killProb === 0) {
    killStatus = '0%';
  } else {
    killStatus = `${killProb.toFixed(1)}%`;
  }

  const getKillStatusColor = () => {
    if (killProb === 100) return 'var(--accent-green)';
    if (killProb >= 50) return 'var(--accent-blue)';
    if (killProb > 0) return 'var(--accent-gold)';
    return 'var(--text-secondary)';
  };

  // 閉じたとき用の補正値サマリーテキスト生成
  const getAtkAHoseiSummary = () => {
    const list: string[] = [];
    if (atkAZokusei !== '0') list.push(`属性+${atkAZokusei}%`);
    if (atkAZokuzen !== '0') list.push(`全属+${atkAZokuzen}%`);
    if (atkAKeitou !== '0') list.push(`系統+${atkAKeitou}%`);
    if (atkAKougeki !== '0') list.push(`力+${atkAKougeki}`);
    if (atkAKouma !== '0') list.push(`魔回+${atkAKouma}`);
    if (atkAKiyousa !== '0') list.push(`きよ+${atkAKiyousa}`);
    if (atkABaiki !== '0') list.push(`バイキ:${atkABaiki > '0' ? '+' : ''}${atkABaiki}`);
    if (atkAKouryu !== '0') list.push(`光竜:${atkAKouryu}`);
    if (atkAForce !== '-') list.push(`F:${atkAForce}`);
    if (atkABousou) list.push('会心ON');
    return list.length > 0 ? list.join(', ') : '';
  };

  const getAtkBHoseiSummary = () => {
    const list: string[] = [];
    if (atkBZokusei !== '0') list.push(`属性+${atkBZokusei}%`);
    if (atkBZokuzen !== '0') list.push(`全属+${atkBZokuzen}%`);
    if (atkBKeitou !== '0') list.push(`系統+${atkBKeitou}%`);
    if (atkBKougeki !== '0') list.push(`力+${atkBKougeki}`);
    if (atkBKouma !== '0') list.push(`魔回+${atkBKouma}`);
    if (atkBKiyousa !== '0') list.push(`きよ+${atkBKiyousa}`);
    if (atkBBaiki !== '0') list.push(`バイキ:${atkBBaiki > '0' ? '+' : ''}${atkBBaiki}`);
    if (atkBKouryu !== '0') list.push(`光竜:${atkBKouryu}`);
    if (atkBForce !== '-') list.push(`F:${atkBForce}`);
    if (atkBBousou) list.push('会心ON');
    return list.length > 0 ? list.join(', ') : '';
  };

  const getDefHoseiSummary = () => {
    const list: string[] = [];
    if (defAdditionalHPText !== '0') list.push(`HP+${defAdditionalHPText}`);
    if (defSyubi !== '0') list.push(`守備+${defSyubi}`);
    if (defSkalaText !== '0') list.push(`スカラ:${defSkalaText > '0' ? '+' : ''}${defSkalaText}`);
    if (defZokuseiTai !== '0') list.push(`属耐+${defZokuseiTai}%`);
    if (defKeitouTai !== '0') list.push(`系耐+${defKeitouTai}%`);
    if (defZantai !== '0') list.push(`斬体耐+${defZantai}%`);
    if (defJumon !== '0') list.push(`呪耐+${defJumon}%`);
    if (defBreath !== '0') list.push(`ブ耐+${defBreath}%`);
    return list.length > 0 ? list.join(', ') : '';
  };

  const getCurrentPresetData = () => ({
    atkAName,
    atkAPers,
    atkAQual,
    atkASkillType,
    atkASkillName,
    atkABaiki,
    atkAForce,
    atkAKougeki,
    atkAKouma,
    atkAKiyousa,
    atkAZokusei,
    atkAZokuzen,
    atkAKeitou,
    atkAKouryu,
    atkABousou,
    atkBName,
    atkBPers,
    atkBQual,
    atkBSkillType,
    atkBSkillName,
    atkBBaiki,
    atkBForce,
    atkBKougeki,
    atkBKouma,
    atkBKiyousa,
    atkBZokusei,
    atkBZokuzen,
    atkBKeitou,
    atkBKouryu,
    atkBBousou,
    defName,
    defPers,
    defQual,
    defSkalaText,
    defAdditionalHPText,
    defSyubi,
    defZokuseiTai,
    defKeitouTai,
    defZantai,
    defJumon,
    defBreath,
    atkAStepFilter,
    atkBStepFilter,
    defStepFilter,
    atkAStatus,
    atkBStatus,
    defStatus
  });

  const loadPresetData = (data: any) => {
    if (data.atkAName !== undefined) setAtkAName(data.atkAName);
    if (data.atkAPers !== undefined) setAtkAPers(data.atkAPers);
    if (data.atkAQual !== undefined) setAtkAQual(data.atkAQual);
    if (data.atkASkillType !== undefined) setAtkASkillType(data.atkASkillType);
    if (data.atkASkillName !== undefined) setAtkASkillName(data.atkASkillName);
    if (data.atkABaiki !== undefined) setAtkABaiki(data.atkABaiki);
    if (data.atkAForce !== undefined) setAtkAForce(data.atkAForce);
    if (data.atkAKougeki !== undefined) setAtkAKougeki(data.atkAKougeki);
    if (data.atkAKouma !== undefined) setAtkAKouma(data.atkAKouma);
    if (data.atkAKiyousa !== undefined) setAtkAKiyousa(data.atkAKiyousa);
    if (data.atkAZokusei !== undefined) setAtkAZokusei(data.atkAZokusei);
    if (data.atkAZokuzen !== undefined) setAtkAZokuzen(data.atkAZokuzen);
    if (data.atkAKeitou !== undefined) setAtkAKeitou(data.atkAKeitou);
    if (data.atkAKouryu !== undefined) setAtkAKouryu(data.atkAKouryu);
    if (data.atkABousou !== undefined) setAtkABousou(data.atkABousou);
    if (data.atkBName !== undefined) setAtkBName(data.atkBName);
    if (data.atkBPers !== undefined) setAtkBPers(data.atkBPers);
    if (data.atkBQual !== undefined) setAtkBQual(data.atkBQual);
    if (data.atkBSkillType !== undefined) setAtkBSkillType(data.atkBSkillType);
    if (data.atkBSkillName !== undefined) setAtkBSkillName(data.atkBSkillName);
    if (data.atkBBaiki !== undefined) setAtkBBaiki(data.atkBBaiki);
    if (data.atkBForce !== undefined) setAtkBForce(data.atkBForce);
    if (data.atkBKougeki !== undefined) setAtkBKougeki(data.atkBKougeki);
    if (data.atkBKouma !== undefined) setAtkBKouma(data.atkBKouma);
    if (data.atkBKiyousa !== undefined) setAtkBKiyousa(data.atkBKiyousa);
    if (data.atkBZokusei !== undefined) setAtkBZokusei(data.atkBZokusei);
    if (data.atkBZokuzen !== undefined) setAtkBZokuzen(data.atkBZokuzen);
    if (data.atkBKeitou !== undefined) setAtkBKeitou(data.atkBKeitou);
    if (data.atkBKouryu !== undefined) setAtkBKouryu(data.atkBKouryu);
    if (data.atkBBousou !== undefined) setAtkBBousou(data.atkBBousou);
    if (data.defName !== undefined) setDefName(data.defName);
    if (data.defPers !== undefined) setDefPers(data.defPers);
    if (data.defQual !== undefined) setDefQual(data.defQual);
    if (data.defSkalaText !== undefined) setDefSkalaText(data.defSkalaText);
    if (data.defAdditionalHPText !== undefined) setDefAdditionalHPText(data.defAdditionalHPText);
    if (data.defSyubi !== undefined) setDefSyubi(data.defSyubi);
    if (data.defZokuseiTai !== undefined) setDefZokuseiTai(data.defZokuseiTai);
    if (data.defKeitouTai !== undefined) setDefKeitouTai(data.defKeitouTai);
    if (data.defZantai !== undefined) setDefZantai(data.defZantai);
    if (data.defJumon !== undefined) setDefJumon(data.defJumon);
    if (data.defBreath !== undefined) setDefBreath(data.defBreath);
    if (data.atkAStepFilter !== undefined) setAtkAStepFilter(data.atkAStepFilter);
    if (data.atkBStepFilter !== undefined) setAtkBStepFilter(data.atkBStepFilter);
    if (data.defStepFilter !== undefined) setDefStepFilter(data.defStepFilter);
    if (data.atkAStatus !== undefined) setAtkAStatus(data.atkAStatus);
    if (data.atkBStatus !== undefined) setAtkBStatus(data.atkBStatus);
    if (data.defStatus !== undefined) setDefStatus(data.defStatus);
  };

  
  const handleReset = () => {
    if (window.confirm('すべての設定を初期状態に戻しますか？（保存したプリセットは消えません）')) {
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith('dqw_two_')) localStorage.removeItem(k);
      });
      window.location.reload();
    }
  };

  const handleSavePreset = () => {
    const name = window.prompt('保存するプリセット名を入力してください');
    if (name) {
      savePreset('twopan', name, getCurrentPresetData());
      alert('「' + name + '」を保存しました！');
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <button onClick={handleReset} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>🔄</span> リセット
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleSavePreset} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}>💾 保存</button>
          <button onClick={() => setIsPresetModalOpen(true)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}>📂 呼出</button>
        </div>
      </div>
      <div className="tab-header" style={{ marginBottom: '10px' }}>
        <h2>ツーパン</h2>
      </div>

      <div className="dashboard-grid">
        {/* 1. 合計結果 (スマホ操作用に最上部に配置) */}
        <div className="glass-panel glow-gold" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', gap: '10px' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.97rem' }}>🔥 ツーパン判定</h4>
          
          <div style={{ fontSize: '1.33rem', fontWeight: '900', color: getKillStatusColor() }}>
            {killStatus}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '4px' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '6px', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)' }}>最少合計</div>
              <div style={{ fontSize: '1.0rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{totalMin}</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '6px', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)' }}>平均合計</div>
              <div style={{ fontSize: '1.0rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{totalAvg}</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '6px', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)' }}>最大合計</div>
              <div style={{ fontSize: '1.0rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{totalMax}</div>
            </div>
          </div>

          <div style={{ 
            fontSize: '1.0rem', 
            color: 'var(--text-secondary)', 
            borderTop: '1px solid rgba(0,0,0,0.05)', 
            paddingTop: '10px',
            marginTop: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>🎯 ターゲットHP ({defName})</span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{targetHP}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>⚔️ 攻撃A ({atkAName})</span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{resA.min} 〜 {resA.max}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>⚔️ 攻撃B ({atkBName})</span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{resB.min} 〜 {resB.max}</strong>
            </div>
          </div>
        </div>

        {/* 2. 攻撃者 A アコーディオン */}
        <div className="glass-panel">
          <div className="collapsible-header" onClick={() => setAtkAOpen(!atkAOpen)}>
            <h3 style={{ color: 'var(--accent-blue)', fontSize: '1.0rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              ⚔️ アタッカーA
              <span style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, rgba(27, 42, 75, 0.12), rgba(27, 42, 75, 0.05))',
                border: '1px solid rgba(27, 42, 75, 0.25)',
                borderRadius: '20px',
                padding: '2px 8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '0.02em',
                transition: 'all 0.3s ease',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}>{atkAName} / {atkAPers} / {atkASkillName}</span>
              {!atkAOpen && getAtkAHoseiSummary() && (
                <span style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.05))',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '20px',
                  padding: '2px 8px',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  color: '#e28700',
                  letterSpacing: '0.02em',
                  whiteSpace: 'normal',
                  wordBreak: 'break-all'
                }}>
                  {getAtkAHoseiSummary()}
                </span>
              )}
            </h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {atkAOpen ? '▲' : '▼'}
            </span>
          </div>

          {atkAOpen && (
            <div className="collapsible-content">
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>モンスター（歩数フィルター）</label>
                <div className="step-family-selector">
                  {['すべて', '18k', '13k', '10k', 'その他'].map(filter => (
                    <label key={filter} className="step-family-option">
                      <input 
                        type="radio" 
                        name="atkAStepFilter" 
                        value={filter} 
                        checked={atkAStepFilter === filter} 
                        onChange={() => handleAtkAStepFilterChange(filter)} 
                      />
                      <span>{filter}</span>
                    </label>
                  ))}
                </div>
                <Dropdown 
                  options={filteredAtkAMonsterList} 
                  value={atkAName} 
                  onChange={setAtkAName} 
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Dropdown 
                  options={Object.keys(personalities)} 
                  value={atkAPers} 
                  onChange={setAtkAPers} 
                  style={{ flex: 1 }}
                />
                <Dropdown 
                  options={Object.keys(qualifications)} 
                  value={atkAQual} 
                  onChange={setAtkAQual} 
                  style={{ flex: 1 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', background: 'var(--bg-secondary)', padding: '8px 4px', borderRadius: '8px', fontSize: '0.83rem', textAlign: 'center' }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>ちから</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkAStatus.power}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>攻魔</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkAStatus.magic}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>力＋攻魔</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkAStatus.power + atkAStatus.magic}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>力＋きよ</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkAStatus.power + atkAStatus.dexterity}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>力＋回魔</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkAStatus.power + atkAStatus.heal}</strong>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>スキルタイプ</label>
                <div className="step-family-selector" style={{ marginBottom: '8px' }}>
                  {[
                    { value: 'physical_tan', label: '単体物理' },
                    { value: 'physical_zen', label: '全体物理' },
                    { value: 'spell_tan', label: '単体呪ブ' },
                    { value: 'spell_zen', label: '全体呪ブ' }
                  ].map(item => (
                    <label key={item.value} className="step-family-option">
                      <input 
                        type="radio" 
                        name="atkASkillType" 
                        value={item.value} 
                        checked={atkASkillType === item.value} 
                        onChange={() => setAtkASkillType(item.value as any)} 
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>使用スキル</label>
                <Dropdown 
                  options={getSkillOptions(atkASkillType)} 
                  value={atkASkillName} 
                  onChange={setAtkASkillName} 
                />
              </div>

              {/* 攻撃モンスターA 補正 */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-blue)', marginBottom: '8px' }}>アタッカー補正</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>属性(斬･呪･ブ)</label>
                    <Dropdown options={['0', '1', '2(D)', '3', '4(C)', '5', '6', '7(B)', '8', '9', '10(A)', '11', '12', '13', '14', '15(S)', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '52', '55', '60']} value={atkAZokusei} onChange={setAtkAZokusei} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>属性全</label>
                    <Dropdown options={['0', '1(D)', '2(C)', '3', '4(B)', '5', '6', '7(A)', '8', '9', '10(S)', '11', '12', '13', '14', '15', '16', '17', '18', '20', '21', '22', '23', '25', '30']} value={atkAZokuzen} onChange={setAtkAZokuzen} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>系統</label>
                    <Dropdown options={['0', '3(D)', '6(C)', '9', '10(B)', '12', '13', '14(A)', '15', '16', '18', '19', '20(S)', '22', '23', '24', '26', '27', '28', '29', '30', '31', '32', '33', '34', '36', '37', '38', '40', '42', '43', '44', '46', '48', '50', '54', '60']} value={atkAKeitou} onChange={setAtkAKeitou} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>こうげき力</label>
                    <Dropdown options={['0', '4(D)', '8(C)', '12', '13(B)', '17', '20(A)', '21', '24', '26', '28', '30(S)', '33', '34', '38', '39', '40', '43', '48', '50', '53', '58', '60', '63', '64', '68', '70', '73', '80', '90', '93', '94', '98', '100', '103', '110', '120']} value={atkAKougeki} onChange={setAtkAKougeki} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>攻魔/回魔</label>
                    <Dropdown options={['0', '4(D)', '8(C)', '12', '13(B)', '17', '20(A)', '21', '24', '26', '28', '30(S)', '33', '34', '38', '39', '40', '43', '48', '50', '53', '58', '60', '63', '64', '68', '70', '73', '80', '90', '93', '94', '98', '100', '103', '110', '120']} value={atkAKouma} onChange={setAtkAKouma} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>きようさ</label>
                    <Dropdown options={['0', '4(D)', '8(C)', '12', '13(B)', '17', '20(A)', '21', '24', '26', '28', '30(S)', '33', '34', '38', '39', '40', '43', '48', '50', '53', '58', '60', '63', '64', '68', '70', '73', '80', '90', '93', '94', '98', '100', '103', '110', '120']} value={atkAKiyousa} onChange={setAtkAKiyousa} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>バイキ</label>
                    <Dropdown options={['-2', '-1', '0', '+1', '+2']} value={atkABaiki} onChange={setAtkABaiki} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>光竜/神託</label>
                    <Dropdown options={['0', '+1', '+2', '+3', '+4']} value={atkAKouryu} onChange={setAtkAKouryu} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>フォース</label>
                    <Dropdown options={['-', 'ドルマ']} value={atkAForce} onChange={setAtkAForce} />
                  </div>
                </div>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px',
                  fontSize: '0.93rem', color: 'var(--text-secondary)', cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={atkABousou}
                    onChange={e => setAtkABousou(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span>⚡ 会心/暴走</span>
                </label>
              </div>

            </div>
          )}
        </div>

        {/* 3. 攻撃者 B アコーディオン */}
        <div className="glass-panel">
          <div className="collapsible-header" onClick={() => setAtkBOpen(!atkBOpen)}>
            <h3 style={{ color: 'var(--accent-blue)', fontSize: '1.0rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              ⚔️ アタッカーB
              <span style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, rgba(27, 42, 75, 0.12), rgba(27, 42, 75, 0.05))',
                border: '1px solid rgba(27, 42, 75, 0.25)',
                borderRadius: '20px',
                padding: '2px 8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '0.02em',
                transition: 'all 0.3s ease',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}>{atkBName} / {atkBPers} / {atkBSkillName}</span>
              {!atkBOpen && getAtkBHoseiSummary() && (
                <span style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.05))',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '20px',
                  padding: '2px 8px',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  color: '#e28700',
                  letterSpacing: '0.02em',
                  whiteSpace: 'normal',
                  wordBreak: 'break-all'
                }}>
                  {getAtkBHoseiSummary()}
                </span>
              )}
            </h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {atkBOpen ? '▲' : '▼'}
            </span>
          </div>

          {atkBOpen && (
            <div className="collapsible-content">
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>モンスター（歩数フィルター）</label>
                <div className="step-family-selector">
                  {['すべて', '18k', '13k', '10k', 'その他'].map(filter => (
                    <label key={filter} className="step-family-option">
                      <input 
                        type="radio" 
                        name="atkBStepFilter" 
                        value={filter} 
                        checked={atkBStepFilter === filter} 
                        onChange={() => handleAtkBStepFilterChange(filter)} 
                      />
                      <span>{filter}</span>
                    </label>
                  ))}
                </div>
                <Dropdown 
                  options={filteredAtkBMonsterList} 
                  value={atkBName} 
                  onChange={setAtkBName} 
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Dropdown 
                  options={Object.keys(personalities)} 
                  value={atkBPers} 
                  onChange={setAtkBPers} 
                  style={{ flex: 1 }}
                />
                <Dropdown 
                  options={Object.keys(qualifications)} 
                  value={atkBQual} 
                  onChange={setAtkBQual} 
                  style={{ flex: 1 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', background: 'var(--bg-secondary)', padding: '8px 4px', borderRadius: '8px', fontSize: '0.83rem', textAlign: 'center' }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>ちから</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkBStatus.power}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>攻魔</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkBStatus.magic}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>力＋攻魔</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkBStatus.power + atkBStatus.magic}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>力＋きよ</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkBStatus.power + atkBStatus.dexterity}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>力＋回魔</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkBStatus.power + atkBStatus.heal}</strong>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>スキルタイプ</label>
                <div className="step-family-selector" style={{ marginBottom: '8px' }}>
                  {[
                    { value: 'spell_tan', label: '単体呪ブ' },
                    { value: 'spell_zen', label: '全体呪ブ' },
                    { value: 'physical_tan', label: '単体物理' },
                    { value: 'physical_zen', label: '全体物理' }
                  ].map(item => (
                    <label key={item.value} className="step-family-option">
                      <input 
                        type="radio" 
                        name="atkBSkillType" 
                        value={item.value} 
                        checked={atkBSkillType === item.value} 
                        onChange={() => setAtkBSkillType(item.value as any)} 
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>使用スキル</label>
                <Dropdown 
                  options={getSkillOptions(atkBSkillType)} 
                  value={atkBSkillName} 
                  onChange={setAtkBSkillName} 
                />
              </div>

              {/* 攻撃モンスターB 補正 */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-blue)', marginBottom: '8px' }}>アタッカー補正</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>属性(斬･呪･ブ)</label>
                    <Dropdown options={['0', '1', '2(D)', '3', '4(C)', '5', '6', '7(B)', '8', '9', '10(A)', '11', '12', '13', '14', '15(S)', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '52', '55', '60']} value={atkBZokusei} onChange={setAtkBZokusei} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>属性全</label>
                    <Dropdown options={['0', '1(D)', '2(C)', '3', '4(B)', '5', '6', '7(A)', '8', '9', '10(S)', '11', '12', '13', '14', '15', '16', '17', '18', '20', '21', '22', '23', '25', '30']} value={atkBZokuzen} onChange={setAtkBZokuzen} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>系統</label>
                    <Dropdown options={['0', '3(D)', '6(C)', '9', '10(B)', '12', '13', '14(A)', '15', '16', '18', '19', '20(S)', '22', '23', '24', '26', '27', '28', '29', '30', '31', '32', '33', '34', '36', '37', '38', '40', '42', '43', '44', '46', '48', '50', '54', '60']} value={atkBKeitou} onChange={setAtkBKeitou} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>こうげき力</label>
                    <Dropdown options={['0', '4(D)', '8(C)', '12', '13(B)', '17', '20(A)', '21', '24', '26', '28', '30(S)', '33', '34', '38', '39', '40', '43', '48', '50', '53', '58', '60', '63', '64', '68', '70', '73', '80', '90', '93', '94', '98', '100', '103', '110', '120']} value={atkBKougeki} onChange={setAtkBKougeki} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>攻魔/回魔</label>
                    <Dropdown options={['0', '4(D)', '8(C)', '12', '13(B)', '17', '20(A)', '21', '24', '26', '28', '30(S)', '33', '34', '38', '39', '40', '43', '48', '50', '53', '58', '60', '63', '64', '68', '70', '73', '80', '90', '93', '94', '98', '100', '103', '110', '120']} value={atkBKouma} onChange={setAtkBKouma} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>きようさ</label>
                    <Dropdown options={['0', '4(D)', '8(C)', '12', '13(B)', '17', '20(A)', '21', '24', '26', '28', '30(S)', '33', '34', '38', '39', '40', '43', '48', '50', '53', '58', '60', '63', '64', '68', '70', '73', '80', '90', '93', '94', '98', '100', '103', '110', '120']} value={atkBKiyousa} onChange={setAtkBKiyousa} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>バイキ</label>
                    <Dropdown options={['-2', '-1', '0', '+1', '+2']} value={atkBBaiki} onChange={setAtkBBaiki} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>光竜/神託</label>
                    <Dropdown options={['0', '+1', '+2', '+3', '+4']} value={atkBKouryu} onChange={setAtkBKouryu} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>フォース</label>
                    <Dropdown options={['-', 'ドルマ']} value={atkBForce} onChange={setAtkBForce} />
                  </div>
                </div>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px',
                  fontSize: '0.93rem', color: 'var(--text-secondary)', cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={atkBBousou}
                    onChange={e => setAtkBBousou(e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span>⚡ 会心/暴走</span>
                </label>
              </div>

            </div>
          )}
        </div>

        {/* 4. 防御者 アコーディオン */}
        <div className="glass-panel">
          <div className="collapsible-header" onClick={() => setDefOpen(!defOpen)}>
            <h3 style={{ color: 'var(--accent-red)', fontSize: '1.0rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              🎯 ターゲット
              <span style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, rgba(142, 36, 48, 0.12), rgba(142, 36, 48, 0.05))',
                border: '1px solid rgba(142, 36, 48, 0.25)',
                borderRadius: '20px',
                padding: '2px 8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '0.02em',
                transition: 'all 0.3s ease',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}>{defName} / {defPers}</span>
              {!defOpen && getDefHoseiSummary() && (
                <span style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.05))',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '20px',
                  padding: '2px 8px',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  color: '#e28700',
                  letterSpacing: '0.02em',
                  whiteSpace: 'normal',
                  wordBreak: 'break-all'
                }}>
                  {getDefHoseiSummary()}
                </span>
              )}
            </h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {defOpen ? '▲' : `▼ (HP:${targetHP})`}
            </span>
          </div>

          {defOpen && (
            <div className="collapsible-content">
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>モンスター（歩数フィルター）</label>
                <div className="step-family-selector">
                  {['すべて', '18k', '13k', '10k', 'その他'].map(filter => (
                    <label key={filter} className="step-family-option">
                      <input 
                        type="radio" 
                        name="defStepFilter" 
                        value={filter} 
                        checked={defStepFilter === filter} 
                        onChange={() => handleDefStepFilterChange(filter)} 
                      />
                      <span>{filter}</span>
                    </label>
                  ))}
                </div>
                <Dropdown 
                  options={filteredDefMonsterList} 
                  value={defName} 
                  onChange={setDefName} 
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Dropdown 
                  options={Object.keys(personalities)} 
                  value={defPers} 
                  onChange={setDefPers} 
                  style={{ flex: 1 }}
                />
                <Dropdown 
                  options={Object.keys(qualifications)} 
                  value={defQual} 
                  onChange={setDefQual} 
                  style={{ flex: 1 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', background: 'rgba(255, 255, 255, 0.5)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>
                <div>HP: <strong style={{ color: 'var(--text-primary)' }}>{defStatus.hp}</strong></div>
                <div>守備: <strong style={{ color: 'var(--text-primary)' }}>{defStatus.guard}</strong></div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>HP</label>
                  <Dropdown 
                    options={["0", "10(D)", "20(C)", "30", "35(B)", "40", "45", "50(A)", "55", "60", "65", "70(S)", "75", "80", "85", "90", "95", "100", "105", "110", "115", "120", "125", "130", "135", "140", "145", "150", "155", "160", "165", "170", "175", "180", "185", "190", "195", "200", "205", "210", "215", "220", "225", "230", "235", "240", "245", "250", "255", "260", "265", "270", "275", "280", "290", "295", "300", "310", "315", "330", "350"]} 
                    value={defAdditionalHPText} 
                    onChange={setDefAdditionalHPText} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>しゅび力</label>
                  <Dropdown 
                    options={['0', '4(D)', '8(C)', '12', '13(B)', '17', '20(A)', '21', '24', '26', '28', '30(S)', '33', '34', '35', '38', '39', '40', '43', '45', '48', '50', '53', '58', '60', '63','64','68', '70', '73', '80', '90', '93', '94', '98', '100', '103', '110', '120']} 
                    value={defSyubi} 
                    onChange={setDefSyubi} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>スカラ段階</label>
                  <Dropdown 
                    options={['-2', '-1', '0', '+1', '+2']} 
                    value={defSkalaText} 
                    onChange={setDefSkalaText} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>属性耐性%</label>
                  <Dropdown 
                    options={['0', '3(D)', '6(C)', '9', '10(B)', '12', '13', '14(A)', '16', '20(S)', '23', '24', '26', '27', '29', '30', '32', '33', '34', '36', '37', '38', '40', '43', '44', '46', '48', '50', '54', '60']} 
                    value={defZokuseiTai} 
                    onChange={setDefZokuseiTai} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>系統耐性%</label>
                  <Dropdown 
                    options={['0', '7(D)', '14', '15(C)', '21', '22', '25(B)', '29', '30', '32', '35(A)', '37', '42', '47', '50(S)', '55', '57', '60', '65', '67', '75', '85', '95', '100', '105', '107', '110', '112', '114', '115', '117', '122', '125', '127', '130', '132', '135', '140', '142', '145', '150', '155', '157', '160', '165', '170', '175', '185', '200']} 
                    value={defKeitouTai} 
                    onChange={setDefKeitouTai} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>斬体耐%</label>
                  <Dropdown 
                    options={['0', '2(D)', '4(C)', '6', '7(B)', '8', '9', '10(A)', '12', '14', '15(S)', '16', '17', '18', '19', '22', '24', '25', '27', '30', '32', '34', '37', '40', '45', '46', '47', '48', '49', '50', '52', '55', '60']} 
                    value={defZantai} 
                    onChange={setDefZantai} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>呪文耐%</label>
                  <Dropdown 
                    options={['0', '2(D)', '4(C)', '6', '7(B)', '8', '9', '10(A)', '12', '14', '15(S)', '16', '17', '18', '19', '22', '24', '25', '27', '30', '32', '34', '37', '40', '45', '46', '47', '48', '49', '50', '52', '55', '60']} 
                    value={defJumon} 
                    onChange={setDefJumon} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>ブレス耐%</label>
                  <Dropdown 
                    options={['0', '2(D)', '4(C)', '6', '7(B)', '8', '9', '10(A)', '12', '14', '15(S)', '16', '17', '18', '19', '22', '24', '25', '27', '30', '32', '34', '37', '40', '45', '46', '47', '48', '49', '50', '52', '55', '60']} 
                    value={defBreath} 
                    onChange={setDefBreath} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    
      <PresetModal isOpen={isPresetModalOpen} onClose={() => setIsPresetModalOpen(false)} type="twopan" onLoad={loadPresetData} />
    </div>
  );
};
