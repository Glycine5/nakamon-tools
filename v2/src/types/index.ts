export interface Monster {
  hp: number; // 0
  mp: number; // 1
  power: number; // 2
  guard: number; // 3
  magic: number; // 4
  heal: number; // 5
  speed: number; // 6
  dexterity: number; // 7 (きようさ)
  isEnemy: number; // 8 (敵味方変数)
  name: string; // 9
  nonAttribute: number; // 10
  // 属性弱点耐性
  mera: number; // 11
  gira: number; // 12
  io: number; // 13
  hyado: number; // 14
  bagi: number; // 15
  jiba: number; // 16
  dein: number; // 17
  doruma: number; // 18
  healActionFactor: number; // 19 (回復行動用の1。性格補正で0.8や0.3などへ)
  // 状態異常耐性
  sleep: number; // 20
  paralyze: number; // 21 (マヒ)
  confuse: number; // 22 (混乱)
  illusion: number; // 23 (幻惑)
  poison: number; // 24
  death: number; // 25 (即死)
  curse: number; // 26
  stop: number; // 27 (休み)
  seal: number; // 28 (封印)
  charm: number; // 29 (魅了)
  // デバフ耐性
  atkDown: number; // 30
  defDown: number; // 31
  spdDown: number; // 32
  spellResDown: number; // 33
  family: number; // 34 (系統: 0けもの 1ドラゴン 2物質 3エレメント 4ゾンビ 5水 6悪魔 7植物 8スライム 9鳥 10？？？ 11マシン 12虫 13怪人)
  guardRate: number; // 35
  evasionRate: number; // 36 (みかわし率)
  zaba: number; // 37 (ザバ耐性)
  raw?: (number | string)[]; // 元のタプルをそのまま格納
}

export interface Skill {
  name: string;
  // raw[0]: 倍率, raw[1]: 複合タイプ('hukugou'等), raw[4]: 単体2全体, raw[5]: 会心/計算タイプ(大暴れ等), raw[6]: 属性, raw[7]: 消費MP
  raw: (number | string)[];
}

export interface Personality {
  name: string;
  // [HP, MP, ちから, みのまもり, こうげき魔力, かいふく魔力, すばやさ, きようさ, 回復因子補正]
  modifiers: number[];
}
