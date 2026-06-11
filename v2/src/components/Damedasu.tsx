import React, { useState, useEffect } from 'react';
import { monsterMap } from '../data/monsters';
import { AttributeBadge } from './AttributeBadge';
import { savePreset } from '../utils/presetManager';
import { PresetModal } from './PresetModal';
import { 
  monsterList, 
  skillZenList, 
  skillTanList, 
  jumonZenList, 
  jumonTanList,
  getZenPhysicalSkill,
  getTanPhysicalSkill,
  getJumonSkill,
  getBreathSkill
} from '../data/skills';
import { personalities, qualifications, familyNames, getAttributeTextColor } from '../data/constants';
import { calcMonsterStatus, calcPhysicalDamage, calcJumonBreathDamage } from '../utils/calculator';
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

export const Damedasu: React.FC = () => {
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  // --- スマホ用アコーディオン開閉状態 ---
  const [atkOpen, setAtkOpen] = useState<boolean>(true);
  const [defOpen, setDefOpen] = useState<boolean>(false); // デフォルトでは閉じて省スペース化
  const [resOpen, setResOpen] = useState<boolean>(true);
  const [atkHoseiOpen, setAtkHoseiOpen] = useState<boolean>(false);
  const [defHoseiOpen, setDefHoseiOpen] = useState<boolean>(false);

  // --- 状態管理 ---
  // 攻撃側
  const [atkMonsterName, setAtkMonsterName] = useState<string>(() => localStorage.getItem('dqw_dam_atkMonsterName') || 'キラーマシン');
  const [atkPersonality, setAtkPersonality] = useState<string>(() => localStorage.getItem('dqw_dam_atkPersonality') || 'いっぴきおおかみ');
  const [atkQuality, setAtkQuality] = useState<string>(() => localStorage.getItem('dqw_dam_atkQuality') || '極');
  
  // 攻撃側 継承スピナー補正（オリジナル Spinner 項目対応）
  const [atkZokusei, setAtkZokusei] = useState<string>(() => localStorage.getItem('dqw_dam_atkZokusei') || '0');
  const [atkZokuzen, setAtkZokuzen] = useState<string>(() => localStorage.getItem('dqw_dam_atkZokuzen') || '0');
  const [atkKeitou, setAtkKeitou] = useState<string>(() => localStorage.getItem('dqw_dam_atkKeitou') || '0');
  const [atkKougeki, setAtkKougeki] = useState<string>(() => localStorage.getItem('dqw_dam_atkKougeki') || '0');
  const [atkKouma, setAtkKouma] = useState<string>(() => localStorage.getItem('dqw_dam_atkKouma') || '0');
  const [atkKiyousa, setAtkKiyousa] = useState<string>(() => localStorage.getItem('dqw_dam_atkKiyousa') || '0');
  const [atkBaikiText, setAtkBaikiText] = useState<string>(() => localStorage.getItem('dqw_dam_atkBaikiText') || '0');
  const [atkKouryu, setAtkKouryu] = useState<string>(() => localStorage.getItem('dqw_dam_atkKouryu') || '0');
  const [atkForce, setAtkForce] = useState<string>(() => localStorage.getItem('dqw_dam_atkForce') || '-');
  const [isBousou, setIsBousou] = useState<boolean>(() => localStorage.getItem('dqw_dam_isBousou') === 'true');

  // 守備側
  const [defMonsterName, setDefMonsterName] = useState<string>(() => localStorage.getItem('dqw_dam_defMonsterName') || 'キラーマシン');
  const [defPersonality, setDefPersonality] = useState<string>(() => localStorage.getItem('dqw_dam_defPersonality') || 'いっぴきおおかみ');
  const [defQuality, setDefQuality] = useState<string>(() => localStorage.getItem('dqw_dam_defQuality') || '極');
  
  // 守備側 継承スピナー補正（オリジナル Spinner 項目対応）
  const [defZokuseiTai, setDefZokuseiTai] = useState<string>(() => localStorage.getItem('dqw_dam_defZokuseiTai') || '0');
  const [defKeitouTai, setDefKeitouTai] = useState<string>(() => localStorage.getItem('dqw_dam_defKeitouTai') || '0');
  const [defSyubi, setDefSyubi] = useState<string>(() => localStorage.getItem('dqw_dam_defSyubi') || '0');
  const [defZantai, setDefZantai] = useState<string>(() => localStorage.getItem('dqw_dam_defZantai') || '0');
  const [defJumon, setDefJumon] = useState<string>(() => localStorage.getItem('dqw_dam_defJumon') || '0');
  const [defBreath, setDefBreath] = useState<string>(() => localStorage.getItem('dqw_dam_defBreath') || '0');
  const [defSkalaText, setDefSkalaText] = useState<string>(() => localStorage.getItem('dqw_dam_defSkalaText') || '0');
  const [defForce, setDefForce] = useState<string>(() => localStorage.getItem('dqw_dam_defForce') || '-');
  const [remHPMode, setRemHPMode] = useState<boolean>(() => localStorage.getItem('dqw_dam_remHPMode') === 'true');

  // スキル選択
  const [skillZenPhys, setSkillZenPhys] = useState<string>(() => localStorage.getItem('dqw_dam_skillZenPhys') || '全体物理');
  const [skillTanPhys, setSkillTanPhys] = useState<string>(() => localStorage.getItem('dqw_dam_skillTanPhys') || '単体物理');
  const [skillZenJumon, setSkillZenJumon] = useState<string>(() => localStorage.getItem('dqw_dam_skillZenJumon') || '全体・呪文ブレス');
  const [skillTanJumon, setSkillTanJumon] = useState<string>(() => localStorage.getItem('dqw_dam_skillTanJumon') || '単体・呪文ブレス');

  // --- 歩数フィルター状態 ---
  const [atkStepFilter, setAtkStepFilter] = useState<string>('18k');
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

  const handleAtkStepFilterChange = (filter: string) => {
    setAtkStepFilter(filter);
    if (filter !== 'すべて') {
      const filtered = getFilteredMonsters(filter);
      if (filtered.length > 0 && !filtered.includes(atkMonsterName)) {
        setAtkMonsterName(filtered[0]);
      }
    }
  };

  const handleDefStepFilterChange = (filter: string) => {
    setDefStepFilter(filter);
    if (filter !== 'すべて') {
      const filtered = getFilteredMonsters(filter);
      if (filtered.length > 0 && !filtered.includes(defMonsterName)) {
        setDefMonsterName(filtered[0]);
      }
    }
  };

  const filteredAtkMonsterList = getFilteredMonsters(atkStepFilter);
  const filteredDefMonsterList = getFilteredMonsters(defStepFilter);

  // --- localStorage への保存 ---
  useEffect(() => {
    localStorage.setItem('dqw_dam_atkMonsterName', atkMonsterName);
    localStorage.setItem('dqw_dam_atkPersonality', atkPersonality);
    localStorage.setItem('dqw_dam_atkQuality', atkQuality);
    localStorage.setItem('dqw_dam_atkZokusei', atkZokusei);
    localStorage.setItem('dqw_dam_atkZokuzen', atkZokuzen);
    localStorage.setItem('dqw_dam_atkKeitou', atkKeitou);
    localStorage.setItem('dqw_dam_atkKougeki', atkKougeki);
    localStorage.setItem('dqw_dam_atkKouma', atkKouma);
    localStorage.setItem('dqw_dam_atkKiyousa', atkKiyousa);
    localStorage.setItem('dqw_dam_atkBaikiText', atkBaikiText);
    localStorage.setItem('dqw_dam_atkKouryu', atkKouryu);
    localStorage.setItem('dqw_dam_atkForce', atkForce);
    localStorage.setItem('dqw_dam_isBousou', String(isBousou));

    localStorage.setItem('dqw_dam_defMonsterName', defMonsterName);
    localStorage.setItem('dqw_dam_defPersonality', defPersonality);
    localStorage.setItem('dqw_dam_defQuality', defQuality);
    localStorage.setItem('dqw_dam_defZokuseiTai', defZokuseiTai);
    localStorage.setItem('dqw_dam_defKeitouTai', defKeitouTai);
    localStorage.setItem('dqw_dam_defSyubi', defSyubi);
    localStorage.setItem('dqw_dam_defZantai', defZantai);
    localStorage.setItem('dqw_dam_defJumon', defJumon);
    localStorage.setItem('dqw_dam_defBreath', defBreath);
    localStorage.setItem('dqw_dam_defSkalaText', defSkalaText);
    localStorage.setItem('dqw_dam_defForce', defForce);
    localStorage.setItem('dqw_dam_remHPMode', String(remHPMode));

    localStorage.setItem('dqw_dam_skillZenPhys', skillZenPhys);
    localStorage.setItem('dqw_dam_skillTanPhys', skillTanPhys);
    localStorage.setItem('dqw_dam_skillZenJumon', skillZenJumon);
    localStorage.setItem('dqw_dam_skillTanJumon', skillTanJumon);
  }, [
    atkMonsterName, atkPersonality, atkQuality, atkZokusei, atkZokuzen, atkKeitou, atkKougeki, atkKouma, atkKiyousa, atkBaikiText, atkKouryu, atkForce, isBousou,
    defMonsterName, defPersonality, defQuality, defZokuseiTai, defKeitouTai, defSyubi, defZantai, defJumon, defBreath, defSkalaText, defForce, remHPMode,
    skillZenPhys, skillTanPhys, skillZenJumon, skillTanJumon
  ]);

  // 計算後のステータス
  const [atkFinalStatus, setAtkFinalStatus] = useState<Monster | null>(null);
  const [defFinalStatus, setDefFinalStatus] = useState<Monster | null>(null);

  // ヘルパー: オリジナル Spinner 文字列から数値部分を抽出
  const parseSelectVal = (text: string): number => {
    const matched = text.replace(/[^0-9-]/g, "");
    return parseInt(matched) || 0;
  };

  // --- リアクティブステータス計算 ---
  useEffect(() => {
    const baseAtk = monsterMap[atkMonsterName] || monsterMap['デフォルト'];
    const pers = personalities[atkPersonality] || personalities['性格'];
    const qual = qualifications[atkQuality] || 1;
    setAtkFinalStatus(calcMonsterStatus(baseAtk, pers, qual));
  }, [atkMonsterName, atkPersonality, atkQuality]);

  useEffect(() => {
    const baseDef = monsterMap[defMonsterName] || monsterMap['デフォルト'];
    const pers = personalities[defPersonality] || personalities['性格'];
    const qual = qualifications[defQuality] || 1;
    setDefFinalStatus(calcMonsterStatus(baseDef, pers, qual));
  }, [defMonsterName, defPersonality, defQuality]);

  if (!atkFinalStatus || !defFinalStatus) return null;

  // --- 補正値のパース ---
  const kougekiHosei = parseSelectVal(atkKougeki);
  const koumaHosei = parseSelectVal(atkKouma);
  const baikiHosei = parseSelectVal(atkBaikiText);
  const zokuseiHosei = parseSelectVal(atkZokusei);
  const zokuzenHosei = parseSelectVal(atkZokuzen);
  const keitouHosei = parseSelectVal(atkKeitou);

  const syubiHosei = parseSelectVal(defSyubi);
  const skalaHosei = parseSelectVal(defSkalaText);
  const zokuseiTaiHosei = parseSelectVal(defZokuseiTai);
  const keitouTaiHosei = parseSelectVal(defKeitouTai);
  const zantaiTaiHosei = parseSelectVal(defZantai);
  const jumonTaiHosei = parseSelectVal(defJumon);
  const breathTaiHosei = parseSelectVal(defBreath);

  // 光竜의加護補正値
  const kouryuMag = atkKouryu === '+1' ? 1.2 : atkKouryu === '+2' ? 1.4 : atkKouryu === '+3' ? 1.6 : atkKouryu === '+4' ? 1.8 : 1;

  // 1. 全体物理
  const zenPhysSkillData = getZenPhysicalSkill(skillZenPhys, defFinalStatus.family);
  const zenPhysZokusei = (atkForce === 'ドルマ' || defForce === 'ドルマ') && zenPhysSkillData.skill.raw[6] === 10 ? 18 : (zenPhysSkillData.skill.raw[6] as number);
  const zenPhysResist = defFinalStatus.raw ? (defFinalStatus.raw[zenPhysZokusei] as number) : 1;
  const zenPhysAddMag = (atkForce === 'ドルマ' || defForce === 'ドルマ') && zenPhysZokusei === 18 ? 0.8 : 1;
  
  let zenPhysPower = atkFinalStatus.power;
  if (zenPhysSkillData.skill.raw[1] === 'hukugou') {
    zenPhysPower = Math.floor(0.85 * (atkFinalStatus.power + kougekiHosei) * (1 + 0.2 * baikiHosei)) + Math.floor(0.85 * (atkFinalStatus.magic + koumaHosei));
  } else if (zenPhysSkillData.skill.raw[1] === 'koukai') {
    zenPhysPower = Math.floor(0.50 * (atkFinalStatus.power + kougekiHosei) * (1 + 0.2 * baikiHosei)) + Math.floor(1.30 * (atkFinalStatus.heal + koumaHosei));
  } else {
    zenPhysPower = (atkFinalStatus.power + kougekiHosei) * (1 + 0.2 * baikiHosei);
  }

  const zenPhysResult = calcPhysicalDamage({
    power: zenPhysPower,
    guard: defFinalStatus.guard,
    syubi_hosei: syubiHosei,
    skala_hosei: skalaHosei,
    skill_mag: zenPhysSkillData.skill.raw[0] as number,
    resist: zenPhysResist,
    zokusei_tai_hosei: zokuseiTaiHosei,
    zantaitai_hosei: zantaiTaiHosei,
    keitou_tai_hosei: keitouTaiHosei,
    zokusei_hosei: zokuseiHosei,
    zokuzen_hosei: zokuzenHosei,
    keitou_hosei: keitouHosei,
    additional_mag: zenPhysAddMag,
    kouryu_mag: kouryuMag,
    isBousou,
    bousouType: zenPhysSkillData.skill.raw[5] as number
  });

  // 2. 単体物理
  const tanPhysSkillData = getTanPhysicalSkill(skillTanPhys, defFinalStatus.family);
  const tanPhysZokusei = (atkForce === 'ドルマ' || defForce === 'ドルマ') && tanPhysSkillData.skill.raw[6] === 10 ? 18 : (tanPhysSkillData.skill.raw[6] as number);
  const tanPhysResist = defFinalStatus.raw ? (defFinalStatus.raw[tanPhysZokusei] as number) : 1;
  const tanPhysAddMag = (atkForce === 'ドルマ' || defForce === 'ドルマ') && tanPhysZokusei === 18 ? 0.8 : 1;
  
  let tanPhysPower = atkFinalStatus.power;
  const targetGuard = skillTanPhys === '冥王(直撃)' ? 0 : defFinalStatus.guard;
  const targetSyubiHosei = skillTanPhys === '冥王(直撃)' ? 0 : syubiHosei;


  if (tanPhysSkillData.skill.raw[1] === 'hukugou') {
    tanPhysPower = Math.floor(0.85 * (atkFinalStatus.power + kougekiHosei) * (1 + 0.2 * baikiHosei)) + Math.floor(0.85 * (atkFinalStatus.magic + koumaHosei));
  } else if (tanPhysSkillData.skill.raw[1] === 'koukai') {
    tanPhysPower = Math.floor(0.50 * (atkFinalStatus.power + kougekiHosei) * (1 + 0.2 * baikiHosei)) + Math.floor(1.30 * (atkFinalStatus.heal + koumaHosei));
  } else {
    tanPhysPower = (atkFinalStatus.power + kougekiHosei) * (1 + 0.2 * baikiHosei);
  }

  const tanPhysResult = calcPhysicalDamage({
    power: tanPhysPower,
    guard: targetGuard,
    syubi_hosei: targetSyubiHosei,
    skala_hosei: skalaHosei,
    skill_mag: tanPhysSkillData.skill.raw[0] as number,
    resist: tanPhysResist,
    zokusei_tai_hosei: zokuseiTaiHosei,
    zantaitai_hosei: zantaiTaiHosei,
    keitou_tai_hosei: keitouTaiHosei,
    zokusei_hosei: zokuseiHosei,
    zokuzen_hosei: zokuzenHosei,
    keitou_hosei: keitouHosei,
    additional_mag: tanPhysAddMag,
    kouryu_mag: kouryuMag,
    isBousou,
    bousouType: tanPhysSkillData.skill.raw[5] as number
  });

  // 3. 全体呪文・全体ブレス
  const zenJumonSkill = getJumonSkill(skillZenJumon);
  const zenJumonZokusei = zenJumonSkill.raw[6] as number;
  const isZenHeal = zenJumonZokusei === 19;
  const isZenBreath = zenJumonSkill.raw[5] === 2;

  let zenMagicOrHeal = isZenHeal ? atkFinalStatus.heal : atkFinalStatus.magic;
  if (isZenBreath) {
    const currentPower = atkFinalStatus.power + kougekiHosei;
    const currentDex = atkFinalStatus.dexterity + parseSelectVal(atkKiyousa);
    zenMagicOrHeal = Math.floor(currentPower * (1 + 0.2 * baikiHosei)) + currentDex;
  }

  const zenJumonResist = isZenHeal ? 1 : (defFinalStatus.raw ? (defFinalStatus.raw[zenJumonZokusei] as number) : 1);
  const zenJumonResult = calcJumonBreathDamage({
    skill: zenJumonSkill,
    magicOrHeal: zenMagicOrHeal,
    power: atkFinalStatus.power,
    kouma_hosei: koumaHosei,
    resist: zenJumonResist,
    zokusei_tai_hosei: isZenHeal ? 0 : zokuseiTaiHosei,
    additional_mag: 1,
    zokusei_hosei: zokuseiHosei,
    zokuzen_hosei: zokuzenHosei,
    keitou_hosei: keitouHosei,
    skeitou_tai_hosei: isZenHeal ? 0 : (zenJumonSkill.raw[5] === 2 ? breathTaiHosei : jumonTaiHosei),
    jumontai_hosei: isZenHeal ? 0 : (zenJumonSkill.raw[5] === 2 ? breathTaiHosei : jumonTaiHosei),
    keitou_tai_hosei: isZenHeal ? 0 : keitouTaiHosei,
    kouryu_mag: kouryuMag,
    is_healing: isZenHeal,
    isBousou
  });

  // 4. 単体呪文・単体ブレス
  const tanJumonSkill = getBreathSkill(skillTanJumon);
  const tanJumonZokusei = tanJumonSkill.raw[6] as number;
  const isTanHeal = tanJumonZokusei === 19;
  const isTanBreath = tanJumonSkill.raw[5] === 2;

  let tanMagicOrHeal = isTanHeal ? atkFinalStatus.heal : atkFinalStatus.magic;
  if (isTanBreath) {
    const currentPower = atkFinalStatus.power + kougekiHosei;
    const currentDex = atkFinalStatus.dexterity + parseSelectVal(atkKiyousa);
    tanMagicOrHeal = Math.floor(currentPower * (1 + 0.2 * baikiHosei)) + currentDex;
  }

  const tanJumonResist = isTanHeal ? 1 : (defFinalStatus.raw ? (defFinalStatus.raw[tanJumonZokusei] as number) : 1);
  const tanJumonResult = calcJumonBreathDamage({
    skill: tanJumonSkill,
    magicOrHeal: tanMagicOrHeal,
    power: atkFinalStatus.power,
    kouma_hosei: koumaHosei,
    resist: tanJumonResist,
    zokusei_tai_hosei: isTanHeal ? 0 : zokuseiTaiHosei,
    additional_mag: 1,
    zokusei_hosei: zokuseiHosei,
    zokuzen_hosei: zokuzenHosei,
    keitou_hosei: keitouHosei,
    skeitou_tai_hosei: isTanHeal ? 0 : (tanJumonSkill.raw[5] === 2 ? breathTaiHosei : jumonTaiHosei),
    jumontai_hosei: isTanHeal ? 0 : (tanJumonSkill.raw[5] === 2 ? breathTaiHosei : jumonTaiHosei),
    keitou_tai_hosei: isTanHeal ? 0 : keitouTaiHosei,
    kouryu_mag: kouryuMag,
    is_healing: isTanHeal,
    isBousou
  });

  // 閉じたとき用の補正値サマリーテキスト生成
  const getAtkHoseiSummary = () => {
    const list: string[] = [];
    if (atkZokusei !== '0') list.push(`属性+${atkZokusei}%`);
    if (atkZokuzen !== '0') list.push(`全属+${atkZokuzen}%`);
    if (atkKeitou !== '0') list.push(`系統+${atkKeitou}%`);
    if (atkKougeki !== '0') list.push(`力+${atkKougeki}`);
    if (atkKouma !== '0') list.push(`魔回+${atkKouma}`);
    if (atkKiyousa !== '0') list.push(`きよ+${atkKiyousa}`);
    if (atkBaikiText !== '0') list.push(`バイキ:${atkBaikiText > '0' ? '+' : ''}${atkBaikiText}`);
    if (atkKouryu !== '0') list.push(`光竜:${atkKouryu}`);
    if (atkForce !== '-') list.push(`F:${atkForce}`);
    if (isBousou) list.push('会心ON');
    return list.length > 0 ? list.join(', ') : '';
  };

  const getDefHoseiSummary = () => {
    const list: string[] = [];
    if (defSyubi !== '0') list.push(`守備+${defSyubi}`);
    if (defSkalaText !== '0') list.push(`スカラ:${defSkalaText > '0' ? '+' : ''}${defSkalaText}`);
    if (defZokuseiTai !== '0') list.push(`属耐+${defZokuseiTai}%`);
    if (defKeitouTai !== '0') list.push(`系耐+${defKeitouTai}%`);
    if (defZantai !== '0') list.push(`斬体耐+${defZantai}%`);
    if (defJumon !== '0') list.push(`呪耐+${defJumon}%`);
    if (defBreath !== '0') list.push(`ブ耐+${defBreath}%`);
    if (defForce !== '-') list.push(`F:${defForce}`);
    return list.length > 0 ? list.join(', ') : '';
  };

  // 表示用ヘルパー (スキル名が未選択状態なら "-" を表示、ダメージ0以下なら "-")
  const renderHPText = (resultVal: number, skillName: string, defaultName: string) => {
    if (skillName === defaultName) {
      return '-';
    }
    if (remHPMode) {
      const remain = defFinalStatus.hp - resultVal;
      return remain <= 0 ? '0' : `${remain} 残`;
    }
    return resultVal <= 0 ? '-' : resultVal;
  };

  const getResSummary = () => {
    const list: string[] = [];
    if (skillZenPhys !== '全体物理') {
      const minVal = renderHPText(zenPhysResult.min, skillZenPhys, '全体物理');
      const avgVal = renderHPText(zenPhysResult.damage, skillZenPhys, '全体物理');
      const maxVal = renderHPText(zenPhysResult.max, skillZenPhys, '全体物理');
      list.push(`${skillZenPhys}:${minVal}〜${maxVal}(${avgVal})`);
    }
    if (skillTanPhys !== '単体物理') {
      const minVal = renderHPText(tanPhysResult.min, skillTanPhys, '単体物理');
      const avgVal = renderHPText(tanPhysResult.damage, skillTanPhys, '単体物理');
      const maxVal = renderHPText(tanPhysResult.max, skillTanPhys, '単体物理');
      list.push(`${skillTanPhys}:${minVal}〜${maxVal}(${avgVal})`);
    }
    if (skillZenJumon !== '全体・呪文ブレス') {
      const minVal = renderHPText(zenJumonResult.min, skillZenJumon, '全体・呪文ブレス');
      const avgVal = renderHPText(zenJumonResult.damage, skillZenJumon, '全体・呪文ブレス');
      const maxVal = renderHPText(zenJumonResult.max, skillZenJumon, '全体・呪文ブレス');
      list.push(`${skillZenJumon}:${minVal}〜${maxVal}(${avgVal})`);
    }
    if (skillTanJumon !== '単体・呪文ブレス') {
      const minVal = renderHPText(tanJumonResult.min, skillTanJumon, '単体・呪文ブレス');
      const avgVal = renderHPText(tanJumonResult.damage, skillTanJumon, '単体・呪文ブレス');
      const maxVal = renderHPText(tanJumonResult.max, skillTanJumon, '単体・呪文ブレス');
      list.push(`${skillTanJumon}:${minVal}〜${maxVal}(${avgVal})`);
    }

    const opts: string[] = [];
    if (isBousou) opts.push('会心ON');
    if (remHPMode) opts.push('残りHP');

    const skillPart = list.length > 0 ? list.join(' / ') : '';
    const optsPart = opts.length > 0 ? `(${opts.join(', ')})` : '';

    if (skillPart && optsPart) return `${skillPart} ${optsPart}`;
    return skillPart || optsPart || '';
  };


  const getCurrentPresetData = () => ({
    resOpen,
    atkHoseiOpen,
    defHoseiOpen,
    atkMonsterName,
    atkPersonality,
    atkQuality,
    atkZokusei,
    atkZokuzen,
    atkKeitou,
    atkKougeki,
    atkKouma,
    atkKiyousa,
    atkBaikiText,
    atkKouryu,
    atkForce,
    isBousou,
    defMonsterName,
    defPersonality,
    defQuality,
    defZokuseiTai,
    defKeitouTai,
    defSyubi,
    defZantai,
    defJumon,
    defBreath,
    defSkalaText,
    defForce,
    remHPMode,
    skillZenPhys,
    skillTanPhys,
    skillZenJumon,
    skillTanJumon,
    atkStepFilter,
    defStepFilter,
    atkFinalStatus,
    defFinalStatus
  });

  const loadPresetData = (data: any) => {
    if (data.resOpen !== undefined) setResOpen(data.resOpen);
    if (data.atkHoseiOpen !== undefined) setAtkHoseiOpen(data.atkHoseiOpen);
    if (data.defHoseiOpen !== undefined) setDefHoseiOpen(data.defHoseiOpen);
    if (data.atkMonsterName !== undefined) setAtkMonsterName(data.atkMonsterName);
    if (data.atkPersonality !== undefined) setAtkPersonality(data.atkPersonality);
    if (data.atkQuality !== undefined) setAtkQuality(data.atkQuality);
    if (data.atkZokusei !== undefined) setAtkZokusei(data.atkZokusei);
    if (data.atkZokuzen !== undefined) setAtkZokuzen(data.atkZokuzen);
    if (data.atkKeitou !== undefined) setAtkKeitou(data.atkKeitou);
    if (data.atkKougeki !== undefined) setAtkKougeki(data.atkKougeki);
    if (data.atkKouma !== undefined) setAtkKouma(data.atkKouma);
    if (data.atkKiyousa !== undefined) setAtkKiyousa(data.atkKiyousa);
    if (data.atkBaikiText !== undefined) setAtkBaikiText(data.atkBaikiText);
    if (data.atkKouryu !== undefined) setAtkKouryu(data.atkKouryu);
    if (data.atkForce !== undefined) setAtkForce(data.atkForce);
    if (data.isBousou !== undefined) setIsBousou(data.isBousou);
    if (data.defMonsterName !== undefined) setDefMonsterName(data.defMonsterName);
    if (data.defPersonality !== undefined) setDefPersonality(data.defPersonality);
    if (data.defQuality !== undefined) setDefQuality(data.defQuality);
    if (data.defZokuseiTai !== undefined) setDefZokuseiTai(data.defZokuseiTai);
    if (data.defKeitouTai !== undefined) setDefKeitouTai(data.defKeitouTai);
    if (data.defSyubi !== undefined) setDefSyubi(data.defSyubi);
    if (data.defZantai !== undefined) setDefZantai(data.defZantai);
    if (data.defJumon !== undefined) setDefJumon(data.defJumon);
    if (data.defBreath !== undefined) setDefBreath(data.defBreath);
    if (data.defSkalaText !== undefined) setDefSkalaText(data.defSkalaText);
    if (data.defForce !== undefined) setDefForce(data.defForce);
    if (data.remHPMode !== undefined) setRemHPMode(data.remHPMode);
    if (data.skillZenPhys !== undefined) setSkillZenPhys(data.skillZenPhys);
    if (data.skillTanPhys !== undefined) setSkillTanPhys(data.skillTanPhys);
    if (data.skillZenJumon !== undefined) setSkillZenJumon(data.skillZenJumon);
    if (data.skillTanJumon !== undefined) setSkillTanJumon(data.skillTanJumon);
    if (data.atkStepFilter !== undefined) setAtkStepFilter(data.atkStepFilter);
    if (data.defStepFilter !== undefined) setDefStepFilter(data.defStepFilter);
    if (data.atkFinalStatus !== undefined) setAtkFinalStatus(data.atkFinalStatus);
    if (data.defFinalStatus !== undefined) setDefFinalStatus(data.defFinalStatus);
  };

  
  const handleReset = () => {
    if (window.confirm('すべての設定を初期状態に戻しますか？（保存したプリセットは消えません）')) {
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith('dqw_dam_')) localStorage.removeItem(k);
      });
      window.location.reload();
    }
  };

  const handleSavePreset = () => {
    const name = window.prompt('保存するプリセット名を入力してください');
    if (name) {
      savePreset('damedasu', name, getCurrentPresetData());
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
      <div className="dashboard-grid">
        
        {/* 1. 攻撃側モンスター設定 アコーディオン */}
        <div className="glass-panel">
          <div className="collapsible-header" onClick={() => setAtkOpen(!atkOpen)}>
            <h3 style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              ⚔️ アタッカー設定
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
              }}>{atkMonsterName} / {atkPersonality} / {atkQuality}</span>
              {!atkOpen && getAtkHoseiSummary() && (
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
                  {getAtkHoseiSummary()}
                </span>
              )}
            </h3>
            <span style={{ color: 'var(--text-muted)' }}>{atkOpen ? '▲' : '▼'}</span>
          </div>
          
          {atkOpen && (
            <div className="collapsible-content">
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>モンスター（歩数フィルター）</label>
                <div className="step-family-selector">
                  {['すべて', '18k', '13k', '10k', 'その他'].map(filter => (
                    <label key={filter} className="step-family-option">
                      <input 
                        type="radio" 
                        name="atkStepFilter" 
                        value={filter} 
                        checked={atkStepFilter === filter} 
                        onChange={() => handleAtkStepFilterChange(filter)} 
                      />
                      <span>{filter}</span>
                    </label>
                  ))}
                </div>
                <Dropdown 
                  options={filteredAtkMonsterList} 
                  value={atkMonsterName} 
                  onChange={setAtkMonsterName} 
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>性格</label>
                  <Dropdown 
                    options={Object.keys(personalities)} 
                    value={atkPersonality} 
                    onChange={setAtkPersonality} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>素質</label>
                  <Dropdown 
                    options={Object.keys(qualifications)} 
                    value={atkQuality} 
                    onChange={setAtkQuality} 
                  />
                </div>
              </div>

              {/* 攻撃側ステータス表示グリッド: HP/MP/すばやさを排除し、力/攻魔/力＋攻魔/力+きよ/力+回魔を表示 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', background: 'var(--bg-secondary)', padding: '10px 4px', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center' }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>ちから</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkFinalStatus.power}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>攻魔</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkFinalStatus.magic}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>力＋攻魔</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkFinalStatus.power + atkFinalStatus.magic}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>力＋きよ</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkFinalStatus.power + atkFinalStatus.dexterity}</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>力＋回魔</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{atkFinalStatus.power + atkFinalStatus.heal}</strong>
                </div>
              </div>

              {/* 攻撃モンスター補正 */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
                <div 
                  className="collapsible-header" 
                  onClick={() => setAtkHoseiOpen(!atkHoseiOpen)}
                  style={{ marginBottom: atkHoseiOpen ? '10px' : '0', padding: '2px 0' }}
                >
                  <h4 style={{ fontSize: '0.97rem', color: 'var(--accent-blue)', fontWeight: 'bold' }}>
                    ✨ アタッカー補正
                  </h4>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {atkHoseiOpen ? '▲' : '▼'}
                  </span>
                </div>
                
                {atkHoseiOpen && (
                  <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>属性(斬･呪･ブ)</label>
                        <Dropdown options={['0', '1', '2(D)', '3', '4(C)', '5', '6', '7(B)', '8', '9', '10(A)', '11', '12', '13', '14', '15(S)', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '52', '55', '60']} value={atkZokusei} onChange={setAtkZokusei} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>属性全</label>
                        <Dropdown options={['0', '1(D)', '2(C)', '3', '4(B)', '5', '6', '7(A)', '8', '9', '10(S)', '11', '12', '13', '14', '15', '16', '17', '18', '20', '21', '22', '23', '25', '30']} value={atkZokuzen} onChange={setAtkZokuzen} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>系統</label>
                        <Dropdown options={['0', '3(D)', '6(C)', '9', '10(B)', '12', '13', '14(A)', '15', '16', '18', '19', '20(S)', '22', '23', '24', '26', '27', '28', '29', '30', '31', '32', '33', '34', '36', '37', '38', '40', '42', '43', '44', '46', '48', '50', '54', '60']} value={atkKeitou} onChange={setAtkKeitou} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>こうげき力</label>
                        <Dropdown options={['0', '4(D)', '8(C)', '12', '13(B)', '17', '20(A)', '21', '24', '26', '28', '30(S)', '33', '34', '38', '39', '40', '43', '48', '50', '53', '58', '60', '63', '64', '68', '70', '73', '80', '90', '93', '94', '98', '100', '103', '110', '120']} value={atkKougeki} onChange={setAtkKougeki} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>攻魔/回魔</label>
                        <Dropdown options={['0', '4(D)', '8(C)', '12', '13(B)', '17', '20(A)', '21', '24', '26', '28', '30(S)', '33', '34', '38', '39', '40', '43', '48', '50', '53', '58', '60', '63', '64', '68', '70', '73', '80', '90', '93', '94', '98', '100', '103', '110', '120']} value={atkKouma} onChange={setAtkKouma} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>きようさ</label>
                        <Dropdown options={['0', '4(D)', '8(C)', '12', '13(B)', '17', '20(A)', '21', '24', '26', '28', '30(S)', '33', '34', '38', '39', '40', '43', '48', '50', '53', '58', '60', '63', '64', '68', '70', '73', '80', '90', '93', '94', '98', '100', '103', '110', '120']} value={atkKiyousa} onChange={setAtkKiyousa} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>バイキ</label>
                        <Dropdown options={['-2', '-1', '0', '+1', '+2']} value={atkBaikiText} onChange={setAtkBaikiText} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>光竜/神託</label>
                        <Dropdown options={['0', '+1', '+2', '+3', '+4']} value={atkKouryu} onChange={setAtkKouryu} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>フォース</label>
                        <Dropdown options={['-', 'ドルマ']} value={atkForce} onChange={setAtkForce} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}
          </div>





        {/* 2. 守備側モンスター設定 アコーディオン */}
        <div className="glass-panel">
          <div className="collapsible-header" onClick={() => setDefOpen(!defOpen)}>
            <h3 style={{ color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              🎯 ターゲット設定
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
              }}>{defMonsterName} / {defPersonality} / {defQuality}</span>
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
            <span style={{ color: 'var(--text-muted)' }}>{defOpen ? '▲' : '▼'}</span>
          </div>

          {defOpen && (
            <div className="collapsible-content">
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>モンスター（歩数フィルター）</label>
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
                  value={defMonsterName} 
                  onChange={setDefMonsterName} 
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>性格</label>
                  <Dropdown 
                    options={Object.keys(personalities)} 
                    value={defPersonality} 
                    onChange={setDefPersonality} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>素質</label>
                  <Dropdown 
                    options={Object.keys(qualifications)} 
                    value={defQuality} 
                    onChange={setDefQuality} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>
                <div>HP: <strong>{defFinalStatus.hp}</strong></div>
                <div>守備: <strong>{defFinalStatus.guard}</strong></div>
                <div>系統: <strong>{familyNames[defFinalStatus.family] || '不明'}</strong></div>
              </div>

              {/* 守備側モンスターの属性耐性一覧 */}
              <div style={{ marginTop: '8px', padding: '10px', background: 'var(--bg-secondary)', borderRadius: '8px', textAlign: 'left' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '8px' }}>🛡️ 属性耐性</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', fontSize: '0.85rem', textAlign: 'center' }}>
                  {[
                    { idx: 11, name: 'メラ' },
                    { idx: 12, name: 'ギラ' },
                    { idx: 13, name: 'イオ' },
                    { idx: 14, name: 'ヒャド' },
                    { idx: 15, name: 'バギ' },
                    { idx: 16, name: 'ジバ' },
                    { idx: 17, name: 'デイン' },
                    { idx: 18, name: 'ドルマ' },
                    { idx: 37, name: 'ザバ' },
                  ].map(attr => {
                    const val = defFinalStatus.raw ? (defFinalStatus.raw[attr.idx] as number) : 1.0;
                    const pct = Math.round((1.0 - val) * 100);
                    const label = pct > 0 ? `+${pct}%` : pct < 0 ? `${pct}%` : '0%';
                    const color = pct > 0 ? 'var(--accent-green)' : pct < 0 ? 'var(--accent-red)' : 'var(--text-secondary)';
                    return (
                      <div key={attr.name} style={{ background: 'rgba(255, 255, 255, 0.4)', padding: '4px 2px', borderRadius: '4px' }}>
                        <div style={{ color: getAttributeTextColor(attr.name), fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1px' }}>{attr.name}</div>
                        <strong style={{ color }}>{label}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 守備モンスター補正 (折りたたみ) */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
                <div 
                  className="collapsible-header" 
                  onClick={() => setDefHoseiOpen(!defHoseiOpen)}
                  style={{ marginBottom: defHoseiOpen ? '10px' : '0', padding: '2px 0' }}
                >
                  <h4 style={{ fontSize: '0.97rem', color: 'var(--accent-red)', fontWeight: 'bold' }}>
                    🎯 ターゲット補正
                  </h4>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {defHoseiOpen ? '▲' : '▼'}
                  </span>
                </div>
                
                {defHoseiOpen && (
                  <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>しゅび力</label>
                        <Dropdown options={['0', '4(D)', '8(C)', '12', '13(B)', '17', '20(A)', '21', '24', '26', '28', '30(S)', '33', '34', '35', '38', '39', '40', '43', '45', '48', '50', '53', '58', '60', '63','64','68', '70', '73', '80', '90', '93', '94', '98', '100', '103', '110', '120']} value={defSyubi} onChange={setDefSyubi} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>スカラ</label>
                        <Dropdown options={['-2', '-1', '0', '+1', '+2']} value={defSkalaText} onChange={setDefSkalaText} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>属性耐性%</label>
                        <Dropdown options={['0', '3(D)', '6(C)', '9', '10(B)', '12', '13', '14(A)', '16', '20(S)', '23', '24', '26', '27', '29', '30', '32', '33', '34', '36', '37', '38', '40', '43', '44', '46', '48', '50', '54', '60']} value={defZokuseiTai} onChange={setDefZokuseiTai} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>系統耐性%</label>
                        <Dropdown options={['0', '7(D)', '14', '15(C)', '21', '22', '25(B)', '29', '30', '32', '35(A)', '37', '42', '47', '50(S)', '55', '57', '60', '65', '67', '75', '85', '95', '100', '105', '107', '110', '112', '114', '115', '117', '122', '125', '127', '130', '132', '135', '140', '142', '145', '150', '155', '157', '160', '165', '170', '175', '185', '200']} value={defKeitouTai} onChange={setDefKeitouTai} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>斬体耐%</label>
                        <Dropdown options={['0', '2(D)', '4(C)', '6', '7(B)', '8', '9', '10(A)', '12', '14', '15(S)', '16', '17', '18', '19', '22', '24', '25', '27', '30', '32', '34', '37', '40', '45', '46', '47', '48', '49', '50', '52', '55', '60']} value={defZantai} onChange={setDefZantai} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>呪文耐%</label>
                        <Dropdown options={['0', '2(D)', '4(C)', '6', '7(B)', '8', '9', '10(A)', '12', '14', '15(S)', '16', '17', '18', '19', '22', '24', '25', '27', '30', '32', '34', '37', '40', '45', '46', '47', '48', '49', '50', '52', '55', '60']} value={defJumon} onChange={setDefJumon} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ブレス耐%</label>
                        <Dropdown options={['0', '2(D)', '4(C)', '6', '7(B)', '8', '9', '10(A)', '12', '14', '15(S)', '16', '17', '18', '19', '22', '24', '25', '27', '30', '32', '34', '37', '40', '45', '46', '47', '48', '49', '50', '52', '55', '60']} value={defBreath} onChange={setDefBreath} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginTop: '10px', marginBottom: '10px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>フォース</label>
                        <Dropdown options={['-', 'ドルマ']} value={defForce} onChange={setDefForce} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. ダメージ計算パネル (常時見やすく) */}
        <div className="glass-panel">
          <div className="collapsible-header" onClick={() => setResOpen(!resOpen)}>
            <h3 style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              📊 スキル選択＆ダメージ表示
              {!resOpen && getResSummary() && (
                <span style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, rgba(27, 42, 75, 0.12), rgba(27, 42, 75, 0.05))',
                  border: '1px solid rgba(27, 42, 75, 0.25)',
                  borderRadius: '20px',
                  padding: '2px 12px',
                  fontSize: '0.87rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.02em',
                  whiteSpace: 'normal',
                  wordBreak: 'break-all'
                }}>
                  {getResSummary()}
                </span>
              )}
            </h3>
            <span style={{ color: 'var(--text-muted)' }}>{resOpen ? '▲' : '▼'}</span>
          </div>

          {resOpen && (
            <div className="collapsible-content" style={{ gap: '8px' }}>
              
              {/* 会心暴走スイッチと残りHPスイッチ */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                gap: '8px', 
                flexWrap: 'wrap',
                background: 'rgba(255,255,255,0.03)', 
                padding: '8px 12px', 
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '2px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div className="switch-container" style={{ width: 'auto', gap: '8px', margin: 0, display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>💥 会心/暴走</span>
                  <label className="switch">
                    <input type="checkbox" checked={isBousou} onChange={(e) => setIsBousou(e.target.checked)} />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="switch-container" style={{ width: 'auto', gap: '8px', margin: 0, display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>❤️ 残りHP表示</span>
                  <label className="switch">
                    <input type="checkbox" checked={remHPMode} onChange={(e) => setRemHPMode(e.target.checked)} />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
              
              {/* 全体物理 */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>🌐 全体物理</span>
                  <Dropdown 
                    options={skillZenList} 
                    value={skillZenPhys} 
                    onChange={setSkillZenPhys} 
                    style={{ marginLeft: 'auto', width: '120px', height: '28px', fontSize: '0.93rem', transform: 'translateX(4px)' }}
                  />
                </div>
                <div style={{ fontSize: '0.87rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span>属性:</span>
                  <AttributeBadge attrId={zenPhysSkillData.skill.raw[6] as number} />
                  <span style={{ color: 'rgba(255,255,255,0.08)' }}>|</span>
                  <span>倍率: {Math.floor((zenPhysSkillData.skill.raw[0] as number) * 100)}%</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', textAlign: 'center' }}>
                  <div style={{ background: 'var(--bg-primary)', padding: '4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>最少</div>
                    <div style={{ fontSize: '0.97rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{renderHPText(zenPhysResult.min, skillZenPhys, '全体物理')}</div>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>平均</div>
                    <div style={{ fontSize: '0.97rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{renderHPText(zenPhysResult.damage, skillZenPhys, '全体物理')}</div>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>最大</div>
                    <div style={{ fontSize: '0.97rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{renderHPText(zenPhysResult.max, skillZenPhys, '全体物理')}</div>
                  </div>
                </div>
              </div>

              {/* 単体物理 */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>🎯 単体物理</span>
                  <Dropdown 
                    options={skillTanList} 
                    value={skillTanPhys} 
                    onChange={setSkillTanPhys} 
                    style={{ marginLeft: 'auto', width: '120px', height: '28px', fontSize: '0.93rem', transform: 'translateX(4px)' }}
                  />
                </div>
                <div style={{ fontSize: '0.87rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span>属性:</span>
                  <AttributeBadge attrId={tanPhysSkillData.skill.raw[6] as number} />
                  <span style={{ color: 'rgba(255,255,255,0.08)' }}>|</span>
                  <span>倍率: {Math.floor((tanPhysSkillData.skill.raw[0] as number) * 100)}%</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', textAlign: 'center' }}>
                  <div style={{ background: 'var(--bg-primary)', padding: '4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>最少</div>
                    <div style={{ fontSize: '0.97rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{renderHPText(tanPhysResult.min, skillTanPhys, '単体物理')}</div>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>平均</div>
                    <div style={{ fontSize: '0.97rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{renderHPText(tanPhysResult.damage, skillTanPhys, '単体物理')}</div>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>最大</div>
                    <div style={{ fontSize: '0.97rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{renderHPText(tanPhysResult.max, skillTanPhys, '単体物理')}</div>
                  </div>
                </div>
              </div>

              {/* 全体呪文・ブレス */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>🌌 全体呪文・ブレス・回復</span>
                  <Dropdown 
                    options={jumonZenList} 
                    value={skillZenJumon} 
                    onChange={setSkillZenJumon} 
                    style={{ marginLeft: 'auto', width: '120px', height: '28px', fontSize: '0.93rem', transform: 'translateX(4px)' }}
                  />
                </div>
                <div style={{ fontSize: '0.87rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span>属性:</span>
                  <AttributeBadge attrId={zenJumonSkill.raw[6] as number} />
                  <span style={{ color: 'rgba(255,255,255,0.08)' }}>|</span>
                  <span>{isZenHeal ? '回復スキル' : '攻撃スキル'}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', textAlign: 'center' }}>
                  <div style={{ background: 'var(--bg-primary)', padding: '4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>最少</div>
                    <div style={{ fontSize: '0.97rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{renderHPText(zenJumonResult.min, skillZenJumon, '全体・呪文ブレス')}</div>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>平均</div>
                    <div style={{ fontSize: '0.97rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{renderHPText(zenJumonResult.damage, skillZenJumon, '全体・呪文ブレス')}</div>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>最大</div>
                    <div style={{ fontSize: '0.97rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{renderHPText(zenJumonResult.max, skillZenJumon, '全体・呪文ブレス')}</div>
                  </div>
                </div>
              </div>

              {/* 単体呪文・ブレス */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>⚡ 単体呪文・ブレス・回復</span>
                  <Dropdown 
                    options={jumonTanList} 
                    value={skillTanJumon} 
                    onChange={setSkillTanJumon} 
                    style={{ marginLeft: 'auto', width: '120px', height: '28px', fontSize: '0.93rem', transform: 'translateX(4px)' }}
                  />
                </div>
                <div style={{ fontSize: '0.87rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span>属性:</span>
                  <AttributeBadge attrId={tanJumonSkill.raw[6] as number} />
                  <span style={{ color: 'rgba(255,255,255,0.08)' }}>|</span>
                  <span>{isTanHeal ? '回復スキル' : '攻撃スキル'}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', textAlign: 'center' }}>
                  <div style={{ background: 'var(--bg-primary)', padding: '4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>最少</div>
                    <div style={{ fontSize: '0.97rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{renderHPText(tanJumonResult.min, skillTanJumon, '単体・呪文ブレス')}</div>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>平均</div>
                    <div style={{ fontSize: '0.97rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{renderHPText(tanJumonResult.damage, skillTanJumon, '単体・呪文ブレス')}</div>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '4px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>最大</div>
                    <div style={{ fontSize: '0.97rem', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{renderHPText(tanJumonResult.max, skillTanJumon, '単体・呪文ブレス')}</div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    
      <PresetModal isOpen={isPresetModalOpen} onClose={() => setIsPresetModalOpen(false)} type="damedasu" onLoad={loadPresetData} />
    </div>
  );
};

