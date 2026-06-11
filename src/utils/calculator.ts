import type { Monster, Personality, Skill } from '../types';

/**
 * 性格と素質に応じてモンスターの補正後ステータスを算出します。
 */
export function calcMonsterStatus(
  monster: Monster,
  personality: Personality,
  qualificationValue: number
): Monster {
  return {
    ...monster,
    hp: Math.ceil(qualificationValue * personality.modifiers[0] * monster.hp),
    mp: Math.ceil(qualificationValue * personality.modifiers[1] * monster.mp),
    power: Math.ceil(qualificationValue * personality.modifiers[2] * monster.power),
    guard: Math.ceil(qualificationValue * personality.modifiers[3] * monster.guard),
    magic: Math.ceil(qualificationValue * personality.modifiers[4] * monster.magic),
    heal: Math.ceil(qualificationValue * personality.modifiers[5] * monster.heal),
    speed: Math.ceil(qualificationValue * personality.modifiers[6] * monster.speed),
    dexterity: Math.ceil(qualificationValue * personality.modifiers[7] * monster.dexterity),
    // 回復行動率因子の補正
    healActionFactor: monster.healActionFactor * personality.modifiers[8],
  };
}

export interface PhysicalDamageResult {
  basic: number;
  damage: number;
  max: number;
  min: number;
}

/**
 * 物理ダメージ（単体・全体）を計算します。
 */
export function calcPhysicalDamage(params: {
  power: number;
  guard: number;
  syubi_hosei: number;
  skala_hosei: number;
  skill_mag: number;
  resist: number;
  zokusei_tai_hosei: number;
  zantaitai_hosei: number;
  keitou_tai_hosei: number;
  zokusei_hosei: number;
  zokuzen_hosei: number;
  keitou_hosei: number;
  additional_mag: number;
  kouryu_mag: number;
  isBousou: boolean;
  bousouType?: number; // raw[5] の値 (5: 大暴れ会心, 6: 貫通, 7: デスクロー等)
}): PhysicalDamageResult {
  const {
    power,
    guard,
    syubi_hosei,
    skala_hosei,
    skill_mag,
    resist,
    zokusei_tai_hosei,
    zantaitai_hosei,
    keitou_tai_hosei,
    zokusei_hosei,
    zokuzen_hosei,
    keitou_hosei,
    additional_mag,
    kouryu_mag,
    isBousou,
    bousouType
  } = params;

  // 基本ダメージ
  const finalGuard = guard + syubi_hosei;
  const basic_damage = Math.floor(Math.max(0, power / 2 - (finalGuard * (1 + 0.2 * skala_hosei)) / 4));

  const zokusei_factor = 1 + Math.floor(zokusei_hosei + zokuzen_hosei) / 100;
  const common_multiplier =
    additional_mag *
    kouryu_mag *
    (resist - zokusei_tai_hosei / 100) *
    (1 - zantaitai_hosei / 100) *
    (1 - keitou_tai_hosei / 100) *
    (1 + keitou_hosei / 100);

  // 通常時のダメージ計算
  let damage = Math.floor(basic_damage * skill_mag * common_multiplier * zokusei_factor);

  const dev = Math.floor(basic_damage / 16) + 1;

  let max_damage = Math.floor((basic_damage + dev) * skill_mag * common_multiplier * zokusei_factor);
  let mini_damage = Math.floor((basic_damage - dev) * skill_mag * common_multiplier * zokusei_factor);

  // 会心（暴走）時の特別補正
  if (isBousou) {
    if (bousouType === 5 || bousouType === 7) {
      // 会心スキル (大暴れ, デスクロー等)
      damage = Math.floor(1.8 * damage);
      max_damage = Math.floor(2.0 * max_damage);
      mini_damage = Math.floor(1.6 * mini_damage);
    } else if (bousouType === 6) {
      // 貫通タイプ (物理単発) の会心ダメージ
      // 方法1: 守備力無視（skill_magなし）
      const pre_basic1 = Math.floor(Math.max(0, power));
      const pre_damage1 = Math.floor(pre_basic1 * common_multiplier * zokusei_factor);
      const pre_max1 = Math.floor((pre_basic1 + Math.floor(pre_basic1 / 16) + 1) * common_multiplier * zokusei_factor);
      const pre_min1 = Math.floor((pre_basic1 - Math.floor(pre_basic1 / 16) - 1) * common_multiplier * zokusei_factor);

      // 方法2: 通常の基本ダメージ × 1.6 × skill_mag
      const pre_damage2 = Math.floor(basic_damage * 1.6 * skill_mag * common_multiplier * zokusei_factor);
      const pre_max2 = Math.floor((basic_damage + Math.floor(basic_damage / 16) + 1) * 1.6 * skill_mag * common_multiplier * zokusei_factor);
      const pre_min2 = Math.floor((basic_damage - Math.floor(basic_damage / 16) - 1) * 1.6 * skill_mag * common_multiplier * zokusei_factor);

      // 大きい方を採用
      if (pre_damage1 > pre_damage2) {
        damage = pre_damage1;
        max_damage = pre_max1;
        mini_damage = pre_min1;
      } else {
        damage = pre_damage2;
        max_damage = pre_max2;
        mini_damage = pre_min2;
      }
    } else {
      // デフォルトの会心倍率
      damage = Math.floor(damage * 1.8);
      max_damage = Math.floor(max_damage * 2.0);
      mini_damage = Math.floor(mini_damage * 1.6);
    }
  }

  return {
    basic: basic_damage,
    damage,
    max: max_damage,
    min: mini_damage
  };
}

export interface SpellBreathDamageResult {
  basic: number;
  damage: number;
  max: number;
  min: number;
  max_basic: number;
  mini_basic: number;
}

/**
 * 呪文・ブレス・回復スキルによるダメージ／回復量を計算します。
 */
export function calcJumonBreathDamage(params: {
  skill: Skill;
  magicOrHeal: number; // こうげき魔力 または かいふく魔力
  power: number; // ちから (ブレスや攻魔複合の判定に必要かも、あるいは引数整理)
  kouma_hosei: number; // 魔力補正値
  resist: number; // 属性耐性
  zokusei_tai_hosei: number; // 属性耐性補正
  additional_mag: number; // 追加倍率 (フォース等)
  zokusei_hosei: number; // 属性ダメージ補正
  zokuzen_hosei: number; // 属性ダメージ全補正
  keitou_hosei: number; // 系統ダメージ補正
  skeitou_tai_hosei: number; // 呪文/ブレス系統耐性補正
  jumontai_hosei: number; // 呪文/ブレス耐性補正
  keitou_tai_hosei: number; // 系統耐性補正
  kouryu_mag: number; // 光竜のかがやき倍率
  is_healing?: boolean;
  isBousou?: boolean; // 会心暴走スイッチ
}): SpellBreathDamageResult {
  const {
    skill,
    magicOrHeal,
    kouma_hosei,
    resist,
    zokusei_tai_hosei,
    additional_mag,
    zokusei_hosei,
    zokuzen_hosei,
    keitou_hosei,
    jumontai_hosei,
    keitou_tai_hosei,
    kouryu_mag,
    is_healing = false,
    isBousou = false
  } = params;

  // skill.raw 配列からパラメータを取得
  // ブレスの場合は raw[3] が上限ではない場合があるが、元のPythonの CalcDamage.damage_jumon 依存で計算
  // 呪文の比例計算パラメータ [0-3]
  // [0] mini_power_int, [1] max_power_int, [2] mini_mpower_int, [3] max_mpower_int?
  // 元の python コードより：
  // mini_power_int = skill[0], m_power_int = skill[1]??
  // Python:
  // basic_damage_m = mini_power_int + (m_power_int + kouma_hosei - mini_mpower_int) * (max_power_int - mini_power_int) / (max_mpower_int - mini_mpower_int)
  // Pythonの引数呼び出し側:
  // mini_power_int = self.skill_jumon[0], m_power_int = m_power (これは攻撃モンスターの魔力), max_power_int = self.skill_jumon[1]?
  // Pythonの引数:
  // CalcDamage.damage_jumon(
  //   self.skill_jumon[0], m_power, self.kouma_hosei, self.skill_jumon[1], self.skill_jumon[2], self.skill_jumon[3], ...
  // )
  // すなわち：
  // mini_power_int = skill[0]
  // m_power_int = m_power (攻撃側魔力)
  // kouma_hosei = kouma_hosei (魔力補正)
  // mini_mpower_int = skill[1]
  // max_power_int = skill[2]
  // max_mpower_int = skill[3]
  const skill_mini_mpower = skill.raw[0] as number; // 最低魔力
  const skill_mini_power = skill.raw[1] as number;  // 最低威力
  const skill_max_mpower = skill.raw[2] as number; // 最高魔力
  const skill_max_power = skill.raw[3] as number;  // 最高威力

  // 魔力のキャップ処理
  const current_magic = magicOrHeal + kouma_hosei;
  const capped_magic = Math.max(skill_mini_mpower, Math.min(skill_max_mpower, current_magic));

  // 比例計算による基礎ダメージ算出
  let basic_damage_m =
    skill_mini_power +
    ((capped_magic - skill_mini_mpower) * (skill_max_power - skill_mini_power)) /
      (skill_max_mpower - skill_mini_mpower);
  
  if (isNaN(basic_damage_m)) {
    basic_damage_m = 0;
  }
  basic_damage_m = Math.floor(basic_damage_m);

  // 属性ダメージ倍率 (回復と攻撃で乗算の仕方が異なる)
  const zokusei_factor = is_healing
    ? (1 + zokusei_hosei / 100) * (1 + zokuzen_hosei / 100)
    : 1 + zokusei_hosei / 100 + zokuzen_hosei / 100;

  const common_multiplier =
    (resist - zokusei_tai_hosei / 100) *
    additional_mag *
    kouryu_mag *
    zokusei_factor *
    (1 + keitou_hosei / 100) *
    (1 - keitou_tai_hosei / 100) *
    (1 - jumontai_hosei / 100);

  let damage_jumon = basic_damage_m * common_multiplier;
  damage_jumon = Math.floor(damage_jumon);

  // ランダム振れ幅 (6%)
  const max_basic_damage_m = basic_damage_m + Math.floor(0.06 * basic_damage_m);
  const mini_basic_damage_m = basic_damage_m - Math.floor(0.06 * basic_damage_m);

  // 系統耐性は max_damage / mini_damage の時だけ適用される？ (元の Python コードの bug あるいは仕様を忠実に移植)
  // Python: max_damage_jumon = max_basic_damage_m*(resist_jumon-zokusei_tai_hosei/100)*additional_mag_jumon*kouryu_mag*zokusei_factor*(1+keitou_hosei/100)*(1-keitou_tai_hosei/100)*(1-jumontai_hosei/100)
  // 系統耐性補正 (keitou_tai_hosei) を掛けている
  const edge_multiplier =
    (resist - zokusei_tai_hosei / 100) *
    additional_mag *
    kouryu_mag *
    zokusei_factor *
    (1 + keitou_hosei / 100) *
    (1 - keitou_tai_hosei / 100) * // ここが keitou_tai_hosei になっている
    (1 - jumontai_hosei / 100);

  let max_damage_jumon = max_basic_damage_m;
  let mini_damage_jumon = mini_basic_damage_m;

  // 暴走時の補正（ブレス raw[5] === 2 以外に適用：1.5～2.0倍）
  // 元のPython (main.py) に合わせ、basic_damage に対して先に倍率を掛け、小数点切り捨てを行ってから edge_multiplier を掛ける
  if (isBousou && skill.raw[5] !== 2) {
    max_damage_jumon = Math.floor(max_damage_jumon * 2.0);
    mini_damage_jumon = Math.floor(mini_damage_jumon * 1.5);
  }

  max_damage_jumon = Math.floor(max_damage_jumon * edge_multiplier);
  mini_damage_jumon = Math.floor(mini_damage_jumon * edge_multiplier);

  if (isBousou && skill.raw[5] !== 2) {
    damage_jumon = Math.floor((max_damage_jumon + mini_damage_jumon) / 2);
  }

  return {
    basic: basic_damage_m,
    damage: damage_jumon,
    max: max_damage_jumon,
    min: mini_damage_jumon,
    max_basic: max_basic_damage_m,
    mini_basic: mini_basic_damage_m
  };
}
