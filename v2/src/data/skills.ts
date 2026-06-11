import type { Skill } from '../types';

export const rawSkills: Record<string, Skill> = {
  // 呪文・ブレス・回復
  mera: { name: 'メラ', raw: [15, 20, 1200, 500, 1, 1, 11, 17] },
  hyado: { name: 'ヒャド', raw: [15, 20, 1200, 500, 1, 1, 14, 17] },
  doruma: { name: 'ドルマ', raw: [15, 20, 1200, 500, 1, 1, 18, 17] },
  dein: { name: 'デイン', raw: [15, 20, 1200, 500, 1, 1, 17, 17] },
  merami: { name: 'メラミ', raw: [15, 30, 1200, 610, 1, 1, 11, 20] },
  dorukuma: { name: 'ドルクマ', raw: [15, 30, 1200, 610, 1, 1, 18, 20] },
  soruhurea: { name: 'ソルフレア', raw: [15, 40, 1200, 740, 1, 1, 13, 24] },
  raidein: { name: 'ライデイン', raw: [15, 40, 1200, 740, 1, 1, 17, 24] },
  dorutuyo: { name: 'ドルクマ強', raw: [15, 40, 1200, 740, 1, 1, 18, 24] },
  merazoma: { name: 'メラゾーマ', raw: [15, 50, 1200, 940, 1, 1, 11, 28] },
  iomata_1: { name: 'イオマタx1', raw: [15, 13, 1200, 235, 1, 1, 13, 28] },
  iomata: { name: 'イオマータ', raw: [15, 50, 1200, 940, 1, 1, 13, 28] },
  ikazuti: { name: '聖なるいかずち', raw: [15, 50, 1200, 940, 1, 1, 17, 28] },
  dorumoa: { name: 'ドルモーア', raw: [15, 50, 1200, 940, 1, 1, 18, 28] },
  suigeki: { name: '蒼玉の水撃', raw: [15, 50, 1200, 940, 1, 1, 14, 28] },
  sennetu: { name: '閃熱の魔弾', raw: [15, 50, 1200, 940, 1, 1, 12, 28] },
  iora: { name: 'イオラ', raw: [15, 20, 1200, 290, 2, 1, 13, 28] },
  hyadaruko: { name: 'ヒャダルコ', raw: [15, 20, 1200, 290, 2, 1, 14, 28] },
  bagima: { name: 'バギマ', raw: [15, 20, 1200, 290, 2, 1, 15, 28] },
  begirama: { name: 'ベギラマ', raw: [15, 20, 1200, 290, 2, 1, 12, 28] },
  bagikuro: { name: 'バギクロス', raw: [15, 25, 1200, 360, 2, 1, 15, 34] },
  hyadatuyo: { name: 'ヒャダルコ強', raw: [15, 25, 1200, 360, 2, 1, 14, 34] },
  begituyo: { name: 'ベギラマ強', raw: [15, 25, 1200, 360, 2, 1, 12, 34] },
  ionazun: { name: 'イオナズン', raw: [15, 30, 1200, 460, 2, 1, 13, 40] },
  mahyado: { name: 'マヒャド', raw: [15, 30, 1200, 460, 2, 1, 14, 40] },
  begiragon: { name: 'ベギラゴン', raw: [15, 30, 1200, 460, 2, 1, 12, 40] },
  gigadein: { name: 'ギガデイン', raw: [15, 30, 1200, 460, 2, 1, 17, 40] },
  grandtenp: { name: 'グランドテンペスト', raw: [15, 30, 1200, 460, 2, 1, 15, 40] },
  daitinomukui: { name: '大地の報い', raw: [15, 30, 1200, 460, 2, 1, 16, 40] },
  kuronomahou: { name: '黒の魔砲', raw: [15, 30, 1200, 400, 2, 1, 18, 40] },
  zazanpa: { name: 'ざざん波', raw: [15, 30, 1200, 460, 2, 1, 37, 40] },
  zibarika: { name: 'ジバリカ', raw: [15, 30, 1200, 440, 1, 1, 16, 40] },
  zibarina: { name: 'ジバリーナ', raw: [15, 30, 1200, 315, 2, 1, 16, 40] },
  behomara: { name: 'ベホマラー', raw: [15, 50, 1200, 550, 4, 3, 19, 42] },
  iyasinouebu: { name: 'いやしのウェーブ', raw: [15, 45, 1200, 440, 4, 3, 19, 36] },
  iyasinokaze: { name: 'いやしのかぜ', raw: [15, 40, 1200, 300, 4, 3, 19, 29] },
  behoimi: { name: 'ベホイミ', raw: [15, 50, 1200, 700, 3, 3, 19, 18] },
  hoimi: { name: 'ホイミ', raw: [15, 45, 1200, 450, 3, 3, 19, 14] },
  hirufangukai: { name: 'ヒールファング回復', raw: [15, 45, 1200, 450, 1, 3, 19, 0] },
  hastle_break_kai: { name: 'ハッスルブレイク回', raw: [15, 35, 1200, 380, 4, 3, 19, 14] },
  none_kai: { name: '回復なし', raw: [1, 1, 1, 1, 3, 2, 19, 0] },

  // ブレス
  kakyuu: { name: '火球バズーカ', raw: [15, 40, 2400, 740, 1, 2, 11, 24] },
  hyoukai: { name: '氷塊バズーカ', raw: [15, 40, 2400, 740, 1, 2, 14, 24] },
  bouhuu: { name: '暴風バズーカ', raw: [15, 50, 2400, 940, 1, 2, 15, 28] },
  raikobaz: { name: '雷光バズーカ', raw: [15, 50, 2400, 940, 1, 2, 17, 28] },
  hinoiki: { name: '火の息', raw: [15, 15, 2400, 230, 2, 2, 11, 24] },
  kaennnoiki: { name: '火炎の息', raw: [15, 20, 2400, 290, 2, 2, 11, 28] },
  koorinoiki: { name: '氷の息', raw: [15, 20, 2400, 290, 2, 2, 14, 28] },
  tatumaki: { name: 'たつまき', raw: [15, 20, 2400, 290, 2, 2, 15, 28] },
  sandoburesu: { name: 'サンドブレス', raw: [15, 20, 2400, 290, 2, 1, 16, 28] },
  hagehono: { name: '激しい炎', raw: [15, 25, 2400, 360, 2, 2, 11, 34] },
  hubuki: { name: '凍える吹雪', raw: [15, 25, 2400, 360, 2, 2, 14, 34] },
  hikabure: { name: '光のブレス', raw: [15, 25, 2400, 360, 2, 2, 13, 34] },
  yamibure: { name: '闇のブレス', raw: [15, 25, 2400, 360, 2, 2, 18, 34] },
  sandosutomu: { name: 'サンドストーム', raw: [15, 25, 2400, 360, 2, 2, 16, 34] },
  kounetunogasu: { name: 'こうねつのガス', raw: [15, 30, 2400, 400, 2, 2, 11, 40] },
  kagayakuiki: { name: 'かがやく息', raw: [15, 30, 2400, 460, 2, 2, 14, 40] },
  hikarino: { name: 'ひかりのほのお', raw: [15, 30, 2400, 400, 2, 2, 13, 40] },
  plazma: { name: 'プラズマストーム', raw: [15, 30, 2400, 460, 2, 2, 17, 40] },

  // 物理単体
  kurimuzon: { name: 'クリムゾンバード', raw: [3.0, 0, 0, 0, 1, 6, 12, 28] },
  godosumasyu: { name: 'ゴッドスマッシュ', raw: [3.0, 0, 0, 0, 1, 6, 13, 28] },
  gigaso: { name: 'ギガソード', raw: [3.0, 0, 0, 0, 1, 6, 17, 28] },
  dethcrow: { name: 'デスクロー', raw: [3.0, 0, 0, 0, 1, 8, 11, 28] },
  dethcrow_ichi: { name: 'デスクローx1', raw: [1.0, 0, 0, 0, 1, 7, 11, 28] },
  meiounoengama: { name: '冥王の炎鎌', raw: [2.6, 0, 0, 0, 1, 6, 11, 28] },
  meioutyokugeki: { name: '冥王(直撃)', raw: [2.6, 0, 0, 0, 1, 6, 11, 28] },
  tenpest: { name: 'テンペストブロウ', raw: [3.0, 0, 0, 0, 1, 8, 15, 28] },
  tenpest_ichi: { name: 'テンペストブロウx1', raw: [1.5, 0, 0, 0, 1, 7, 15, 28] },
  hyouketu: { name: '氷結らんげき', raw: [3.0, 0, 0, 0, 1, 8, 14, 28] },
  hyouketu_ichi: { name: '氷結らんげきx1', raw: [0.75, 0, 0, 0, 1, 5, 14, 28] },
  ice_blast: { name: 'アイスブラスト', raw: [1.55, 'hukugou', 0, 0, 1, 6, 14, 28] },
  hagekiri: { name: 'はげしく斬りつける', raw: [3, 0, 0, 0, 1, 8, 10, 28] },
  hagekiri_ichi: { name: 'はげしく斬りつけるx1', raw: [0.75, 0, 0, 0, 1, 5, 10, 28] },
  asubureiku: { name: 'アースブレイク', raw: [2.6, 0, 0, 0, 1, 6, 16, 28] },
  w_atack: { name: 'Wアタック', raw: [1.6, 0, 0, 0, 1, 8, 10, 24] },
  w_atack_ichi: { name: 'Wアタックx1', raw: [0.8, 0, 0, 0, 1, 5, 10, 24] },
  hitosuraisa: { name: 'ヒートスライサー', raw: [2.4, 0, 0, 0, 1, 6, 12, 24] },
  daitinoitigeki: { name: '大地の一撃', raw: [2.4, 0, 0, 0, 1, 6, 16, 24] },
  sikkoku: { name: '漆黒の爪', raw: [2.1, 0, 0, 0, 1, 8, 18, 24] },
  sikkoku_ichi: { name: '漆黒の爪x1', raw: [0.7, 0, 0, 0, 1, 5, 18, 24] },
  masyoudan: { name: '魔瘴弾', raw: [2.4, 0, 0, 0, 1, 6, 18, 24] },
  taigakuro: { name: 'タイガークロー', raw: [2.4, 0, 0, 0, 1, 8, 10, 24] },
  taigakuro_ichi: { name: 'タイガークローx1', raw: [0.8, 0, 0, 0, 1, 5, 10, 24] },
  rekoukenmasin: { name: '裂鋼拳(対マシン)', raw: [2.4, 0, 0, 0, 1, 8, 10, 20] },
  rekoukenmasin_ichi: { name: '裂鋼拳(対マシン)x1', raw: [1.2, 0, 0, 0, 1, 7, 10, 20] },
  doragongirisoragon: { name: 'ドラゴン斬り(対ドラゴン)', raw: [2.3, 0, 0, 0, 1, 6, 10, 20] },
  yomiokurizonbi: { name: '黄泉送り(対ゾンビ)', raw: [2.3, 0, 0, 0, 1, 6, 10, 20] },
  reborusuraisa: { name: 'レボルスライサー', raw: [2.0, 0, 0, 0, 1, 6, 15, 24] },
  takuru: { name: 'タックル', raw: [2.0, 0, 0, 0, 1, 6, 10, 24] },
  sirudobureiku: { name: 'シールドブレイク', raw: [1.90, 0, 0, 0, 1, 6, 10, 24] },
  hirufangu: { name: 'ヒールファング', raw: [1.90, 0, 0, 0, 1, 6, 18, 24] },
  ooabare: { name: '大暴れx1', raw: [0.65, 0, 0, 0, 1, 5, 10, 0] },
  raikou: { name: '雷光さみだれ突き', raw: [1.0, 0, 0, 0, 1, 7, 17, 32] },
  samidare: { name: 'さみだれx1', raw: [0.8, 0, 0, 0, 1, 5, 10, 32] },
  meidou: { name: '大地の鳴動', raw: [1.0, 0, 0, 0, 1, 7, 16, 32] },
  seikenzuki: { name: 'せいけんづき', raw: [1.90, 0, 0, 0, 1, 6, 10, 20] },
  sinkugiri: { name: 'しんくう斬り', raw: [1.90, 0, 0, 0, 1, 6, 15, 20] },
  taibokuzansyokubutu: { name: 'たいぼく斬(対植物)', raw: [1.90, 0, 0, 0, 1, 6, 10, 17] },
  kamaitatieremento: { name: 'かまいたち(対エレメント)', raw: [1.90, 0, 0, 0, 1, 6, 10, 17] },
  kemonozukikemono: { name: 'けものづき(対けもの)', raw: [1.90, 0, 0, 0, 1, 6, 10, 17] },
  rekouken: { name: '裂鋼拳', raw: [1.70, 0, 0, 0, 1, 8, 10, 20] },
  rekouken_ichi: { name: '裂鋼拳x1', raw: [0.85, 0, 0, 0, 1, 5, 10, 20] },
  doragongiri: { name: 'ドラゴン斬り', raw: [1.70, 0, 0, 0, 1, 6, 10, 20] },
  yomiokuri: { name: '黄泉送り', raw: [1.70, 0, 0, 0, 1, 6, 10, 20] },
  yaibakudaki: { name: 'やいばくだき', raw: [1.6, 0, 0, 0, 1, 6, 10, 20] },
  taiatari: { name: 'たいあたり', raw: [1.6, 0, 0, 0, 1, 6, 10, 20] },
  kabutowari: { name: 'かぶとわり', raw: [1.6, 0, 0, 0, 1, 6, 10, 20] },
  kaengiri: { name: 'かえん斬り', raw: [1.5, 0, 0, 0, 1, 6, 11, 17] },
  mahyadogiri: { name: 'マヒャド斬り', raw: [1.5, 0, 0, 0, 1, 6, 14, 17] },
  inazumagiri: { name: 'いなずま斬り', raw: [1.5, 0, 0, 0, 1, 6, 17, 17] },
  taibokuzan: { name: 'たいぼく斬', raw: [1.3, 0, 0, 0, 1, 6, 10, 17] },
  kamaitati: { name: 'かまいたち', raw: [1.3, 0, 0, 0, 1, 6, 10, 17] },
  kemonozuki: { name: 'けものづき', raw: [1.3, 0, 0, 0, 1, 6, 10, 17] },
  sirudoataku: { name: 'シールドアタック', raw: [1.0, 0, 0, 0, 1, 6, 10, 20] },
  mahikougeki: { name: 'マヒ攻撃', raw: [1.3, 0, 0, 0, 1, 6, 10, 20] },
  moudokukougeki: { name: 'もうどく攻撃', raw: [1.3, 0, 0, 0, 1, 6, 10, 20] },
  noroikougeki: { name: 'のろい攻撃', raw: [1.3, 0, 0, 0, 1, 6, 10, 20] },
  nemurikougeki: { name: 'ねむり攻撃', raw: [1.3, 0, 0, 0, 1, 6, 10, 20] },
  konrankougeki: { name: '混乱攻撃', raw: [1.3, 0, 0, 0, 1, 6, 10, 20] },
  asibarai: { name: 'あしばらい', raw: [1.0, 0, 0, 0, 1, 6, 10, 20] },
  hastle_break: { name: 'ハッスルブレイク', raw: [1.3, 'koukai', 0, 0, 2, 7, 10, 40] },
  none: { name: '通常攻撃', raw: [1.0, 0, 0, 0, 1, 6, 10, 0] },

  // 物理全体
  meirusutoromumizu: { name: 'メイルストローム(水)', raw: [1.7, 0, 0, 0, 2, 7, 15, 40] },
  syakunetusaikuron: { name: '灼熱サイクロン', raw: [1.5, 0, 0, 0, 2, 7, 11, 40] },
  sinigaminoitigeki: { name: '死神の一撃', raw: [1.5, 0, 0, 0, 2, 7, 18, 40] },
  seintoinpakuto: { name: 'セイントインパクト', raw: [1.5, 0, 0, 0, 2, 7, 13, 40] },
  heatinf: { name: 'ヒートインフェルノ', raw: [1.5, 0, 0, 0, 2, 7, 12, 40] },
  landimpact: { name: 'ランドインパクト', raw: [1.3, 0, 0, 0, 2, 7, 16, 40] },
  meirusutoromu: { name: 'メイルストローム', raw: [1.4, 0, 0, 0, 2, 7, 15, 40] },
  kingupuresu: { name: 'キングプレス', raw: [1.3, 0, 0, 0, 2, 7, 10, 40] },
  frozen_w: { name: 'フローズンウィップ', raw: [0.9, 'hukugou', 0, 0, 2, 7, 14, 40] },
  senretukaitengiri: { name: '閃烈回転斬り', raw: [1.2, 0, 0, 0, 2, 7, 12, 34] },
  hyouganotosi: { name: '氷岩おとし', raw: [1.2, 0, 0, 0, 2, 7, 14, 34] },
  purazumauebu: { name: 'プラズマウェーブ', raw: [1.2, 0, 0, 0, 2, 7, 17, 34] },
  rihusurasyu: { name: 'リーフスラッシュ', raw: [1.2, 0, 0, 0, 2, 7, 15, 34] },
  gansekiotosi: { name: '岩石おとし', raw: [1.2, 0, 0, 0, 2, 7, 16, 34] },
  koubakunagiharai: { name: '光爆なぎはらい', raw: [1.2, 0, 0, 0, 2, 7, 13, 34] },
  kaenrekuukyakutori: { name: '火炎裂空脚(対鳥)', raw: [1.2, 0, 0, 0, 2, 7, 11, 28] },
  syakunetunagiharai: { name: '灼熱なぎはらい', raw: [1.05, 0, 0, 0, 2, 7, 11, 34] },
  kingudamusodo: { name: 'キングダムソード', raw: [1.05, 0, 0, 0, 2, 7, 10, 34] },
  bunmawasi: { name: 'ぶんまわし', raw: [1.0, 0, 0, 0, 2, 7, 10, 0] },
  inazuma: { name: 'いなずま', raw: [1.0, 0, 0, 0, 2, 7, 17, 28] },
  sinkuuha: { name: 'しんくうは', raw: [1.0, 0, 0, 0, 2, 7, 15, 28] },
  asusuingu: { name: 'アーススイング', raw: [1.0, 0, 0, 0, 2, 7, 16, 28] },
  syainsukoru: { name: 'シャインスコール', raw: [1.0, 0, 0, 0, 2, 7, 17, 28] },
  naitomeasodo: { name: 'ナイトメアソード', raw: [1.0, 0, 0, 0, 2, 7, 18, 28] },
  kaenrekuukyaku: { name: '火炎裂空脚', raw: [0.9, 0, 0, 0, 2, 5, 11, 0] },
  dengeki: { name: 'でんげき', raw: [1.1, 0, 0, 0, 3, 5, 17, 40] },
  kaitentataki: { name: '回転たたき', raw: [0.8, 0, 0, 0, 3, 5, 10, 0] },
  hagesiiotakebi: { name: 'はげしいおたけび', raw: [0.9, 0, 0, 0, 4, 5, 10, 0] },
  bital_impact: { name: 'バイタルインパクト', raw: [1.2, 'koukai', 0, 0, 2, 7, 10, 40] }
};

// リスト類
export const monsterList: string[] = [
  'キラーマシン', 'ヘルバトラー', 'オーシャンボーン', 'スライムジェネラル','ホークブリザード','ホークブリザード49',
  'りゅうおう','デスピサロ','バルボロス', 'デスタムーア','グレイナル','ネルゲル', 'ハーゴン','オルゴデミーラ', 'やかんのまじん',
  'ギガンテス','まおうのつかい','メイデンドール','メイデンドール49', 'ヘルバオム', 'ジュリアンテ','わかめおうじ','うごくせきぞう','きとうし','アームライオン','ジャミラス',
  'バトルレックス', 'キングスライム','ボーンナイト','スカイドラゴン',
  'シャドーサタン','ヘルクラウダー','テンタクルス','グレイトマーマン',
  'ゴーレム','ワイトキング','ダッシュラン', 'ガーゴイル','デビルアーマ', 'キラーパンサー','ハーゴンきし','ドラゴスライム','シルバーデビル',
  'ひとつめピエロ','とらおとこ','よろいのきし','スライムナイト','ほのおのせんし',
  'ドラゴン','トロル','だいまどう','シールドオーガ','シールドオーガ49','カメレオンマン',
  'キメラ','ホークマン','さまようよろい', 'ヘルコンドル','マッドフィンガー', 'スカルゴン', 'スカルゴン49',
  'ガニラス','てんどうしし', 'ブラティーポ','スライムタワ','リカント','びっくりサタン','どろにんぎょう',
  'シャドー', 'ブリザード', 'ミイラ男', 'リザードマン', 'デンデン竜', 'ガチャコッコ',
  'ミニデーモン', 'ドルイド', 'ごろつき', 'ヘルボックル','マリンスライム',
  'マリンスライム49', 'メーダ', 'てつのさそり', 'ひとくいばこ', 'わらいぶくろ',
  'リリパット','アルミラージ','おばけきのこ','おばけキャンドル', 'ねこまどう', 'デッドペッカー', 'テンツク',
  'コロネホワイト', 'スライムコロネ','バブルスライム','おおがらす', 'ファーラット',
  'ぶちスライム','ベビーパンサー', 'プリズニャン', 'スライム', 'ホイミスライム',
  'メラゴースト', 'ゴースト', 'くさったしたい', 'ドラゴンキッズ', 'メタッピー',
  'からくり兵', 'グレムリン', 'モーモン', 'ブラウニー', 'オニオーン', 'じんめんじゅ',
  'ポイズンリザード', 'だいおうキッズ', 'キャタピラー', 'ドラキー','ばくだんいわ',
  'ひとくいサーベル','あくまのツボ','ビッグハット','おにこぞう','ズッキーニャ','ナスビナーラ','ももんじゃ'
];

export const skillZenList: string[] = [
  '全体物理', '灼熱サイクロン', '死神の一撃', 'セイントインパクト',
  'ヒートインフェルノ', 'ランドインパクト', 'メイルストローム', 'キングプレス',
  'フローズンウィップ', 'バイタルインパクト',
  '閃烈回転斬り', '氷岩おとし', 'プラズマウ', 'リーフスラ',
  '岩石おとし', '光爆なぎ', '灼熱なぎ', 'キングダム',
  'ぶんまわし', 'いなずま', 'しんくうは', 'アーススイ',
  'シャインス', 'ナイトメア', '火炎裂空脚', 'でんげき', 
  '回転たたき', 'はげしいお'
];

export const skillTanList: string[] = [
  '単体物理','クリムゾンバード', 'ギガソード', 'デスクロー','冥王の炎鎌','冥王(直撃)',
  'デスクx1', 'テンペストブロウ', 'テンペx1', 'ゴッドスマッシュ',
  '氷結らんげき', '氷結x1', 'アイスブラスト', 'はげしく斬りつける', 'はげ斬x1', 'アースブレイク', 'ハッスルブレイク',
  'ヒートスライサー', '大地の一撃', '漆黒の爪', '漆黒x1', 'タイガークロー','魔瘴弾',
  'タイガx1', 'レボルスラ', 'タックル', 'シールドブ', 'ヒールファ',
  '大暴れx1', '雷光x1', '鳴動x1', 'せいけんづ', 'しんくう斬','Wアタック','Wアタx1',
  '裂鋼拳', '裂鋼x1', 'ドラゴン斬', '黄泉送り', 'やいばくだ',
  'たいあたり', 'かぶとわり', 'かえん斬り', 'マヒャド斬',
  'いなずま斬', 'たいぼく斬', 'かまいたち', 'けものづき', 'シールドア',
  'マヒ攻撃', 'もうどく攻', 'のろい攻撃', 'ねむり攻撃', '混乱攻撃',
  'あしばらい', '通常攻撃'
];

export const jumonZenList: string[] = [
  '全体・呪文ブレス', 'ギガデイン', 'ベギラゴン', 'マヒャド', 'イオナズン','グランドテンペスト', '大地の報い',
  '黒の魔砲', 'ざざん波', 'こうねつのガス', 'かがやく息', 'ひかりのほのお', 'プラズマストーム', '激しい炎', '凍える吹雪',
  '光のブレス', '闇のブレス', 'ベギラマ強', 'ヒャダル強', 'バギクロス',
  'サンドスト', '火の息', '火炎の息', '氷の息', 'たつまき', 'サンドブレ',
  'ベギラマ', 'バギマ', 'ヒャダルコ', 'イオラ','ジバリーナ','ベホマラー','いやしのウェーブ',
  'いやしかぜ'
];

export const jumonTanList: string[] = [
  '単体・呪文ブレス','閃熱の魔弾','イオマータ','イオマタx1', 'せいなるいかずち', '蒼玉の水撃',
  'ドルモーア', 'メラゾーマ', '雷光バズーカ', '暴風バズーカ','火球バズーカ',
  '氷塊バズーカ', 'ドルクマ強', 'ライデイン', 'ソルフレア', 'ハッスル回', 'ドルクマ',
  'メラミ', 'デイン', 'ドルマ', 'ヒャド','ジバリカ','ベホイミ','ホイミ',
  'ヒルファ回'
];

// テキストとスキルのマッピング関数
export function getZenPhysicalSkill(text: string, enemyFamily: number): { skill: Skill; label: string } {
  let skillKey = '';
  switch (text) {
    case 'サイクロン': case '灼熱サイクロン': skillKey = 'syakunetusaikuron'; break;
    case '死神の一撃': skillKey = 'sinigaminoitigeki'; break;
    case 'セイント': case 'セイントインパクト': skillKey = 'seintoinpakuto'; break;
    case 'メイルスト': case 'メイルストローム':
      if (enemyFamily === 5) { // 水系
        return { skill: rawSkills.meirusutoromumizu, label: 'メイル水' };
      }
      skillKey = 'meirusutoromu';
      break;
    case 'ヒートイン': case 'ヒートインフェルノ': skillKey = 'heatinf'; break;
    case 'ランドイン': case 'ランドインパクト': skillKey = 'landimpact'; break;
    case 'キングプレ': case 'キングプレス': skillKey = 'kingupuresu'; break;
    case 'フローズン': case 'フローズンウィップ': skillKey = 'frozen_w'; break;
    case '閃烈回転': case '閃烈回転斬り': skillKey = 'senretukaitengiri'; break;
    case '氷岩おとし': skillKey = 'hyouganotosi'; break;
    case 'プラズマウ': skillKey = 'purazumauebu'; break;
    case 'リーフスラ': skillKey = 'rihusurasyu'; break;
    case '岩石おとし': skillKey = 'gansekiotosi'; break;
    case '光爆なぎ': skillKey = 'koubakunagiharai'; break;
    case '灼熱なぎ': skillKey = 'syakunetunagiharai'; break;
    case 'キングダム': skillKey = 'kingudamusodo'; break;
    case 'ぶんまわし': skillKey = 'bunmawasi'; break;
    case 'inazuma': case 'いなずま': skillKey = 'inazuma'; break;
    case 'しんくうは': skillKey = 'sinkuuha'; break;
    case 'アーススイ': skillKey = 'asusuingu'; break;
    case 'シャインス': skillKey = 'syainsukoru'; break;
    case 'ナイトメア': skillKey = 'naitomeasodo'; break;
    case '火炎裂空脚':
      if (enemyFamily === 9) { // 鳥系
        return { skill: rawSkills.kaenrekuukyakutori, label: '火炎裂 鳥' };
      }
      skillKey = 'kaenrekuukyaku';
      break;
    case 'でんげき': skillKey = 'dengeki'; break;
    case '回転たたき': skillKey = 'kaitentataki'; break;
    case 'はげしいお': skillKey = 'hagesiiotakebi'; break;
    case 'バイタルイ': case 'バイタルインパクト': skillKey = 'bital_impact'; break;
    default: skillKey = 'none';
  }
  return { skill: rawSkills[skillKey] || rawSkills.none, label: text };
}

export function getTanPhysicalSkill(text: string, enemyFamily: number): { skill: Skill; label: string } {
  let skillKey = '';
  switch (text) {
    case 'クリムゾン': case 'クリムゾンバード': skillKey = 'kurimuzon'; break;
    case 'ゴッドスマ': case 'ゴッドスマッシュ': skillKey = 'godosumasyu'; break;
    case 'ギガソード': skillKey = 'gigaso'; break;
    case 'テンペスト': case 'テンペストブロウ': skillKey = 'tenpest'; break;
    case 'テンペx1': skillKey = 'tenpest_ichi'; break;
    case 'デスクロー': skillKey = 'dethcrow'; break;
    case 'デスクx1': skillKey = 'dethcrow_ichi'; break;
    case '冥王の炎鎌': skillKey = 'meiounoengama'; break;
    case '冥王(直撃)': skillKey = 'meioutyokugeki'; break;
    case '氷結らんげ': case '氷結らんげき': skillKey = 'hyouketu'; break;
    case '氷結x1': skillKey = 'hyouketu_ichi'; break;
    case 'アイスブラ': case 'アイスブラスト': skillKey = 'ice_blast'; break;
    case 'はげ斬り': case 'はげしく斬りつける': skillKey = 'hagekiri'; break;
    case 'はげ斬x1': skillKey = 'hagekiri_ichi'; break;
    case 'アースブレ': case 'アースブレイク': skillKey = 'asubureiku'; break;
    case 'ヒートスラ': case 'ヒートスライサー': skillKey = 'hitosuraisa'; break;
    case '大地の一撃': skillKey = 'daitinoitigeki'; break;
    case '魔瘴弾': skillKey = 'masyoudan'; break;
    case '漆黒の爪': skillKey = 'sikkoku'; break;
    case '漆黒x1': skillKey = 'sikkoku_ichi'; break;
    case 'タイガーク': case 'タイガークロー': skillKey = 'taigakuro'; break;
    case 'タイガx1': skillKey = 'taigakuro_ichi'; break;
    case 'レボルスラ': skillKey = 'reborusuraisa'; break;
    case 'タックル': skillKey = 'takuru'; break;
    case 'シールドブ': skillKey = 'sirudobureiku'; break;
    case 'ヒールファ': skillKey = 'hirufangu'; break;
    case '大暴れx1': skillKey = 'ooabare'; break;
    case '雷光x1': skillKey = 'raikou'; break;
    case '鳴動x1': skillKey = 'meidou'; break;
    case 'さみだれx1': skillKey = 'samidare'; break;
    case 'せいけんづ': skillKey = 'seikenzuki'; break;
    case 'しんくう斬': skillKey = 'sinkugiri'; break;
    case 'Wアタック': skillKey = 'w_atack'; break;
    case 'Wアタx1': skillKey = 'w_atack_ichi'; break;
    case '裂鋼拳':
      if (enemyFamily === 11) { // マシン系
        return { skill: rawSkills.rekoukenmasin, label: '裂鋼拳 特化' };
      }
      skillKey = 'rekouken';
      break;
    case '裂鋼x1':
      if (enemyFamily === 11) {
        return { skill: rawSkills.rekoukenmasin_ichi, label: '裂鋼x1 特化' };
      }
      skillKey = 'rekouken_ichi';
      break;
    case 'ドラゴン斬':
      if (enemyFamily === 1) { // ドラゴン系
        return { skill: rawSkills.doragongirisoragon, label: 'ドラゴン斬 特化' };
      }
      skillKey = 'doragongiri';
      break;
    case '黄泉送り':
      if (enemyFamily === 4) { // ゾンビ系
        return { skill: rawSkills.yomiokurizonbi, label: '黄泉送り 特化' };
      }
      skillKey = 'yomiokuri';
      break;
    case 'やいばくだ': skillKey = 'yaibakudaki'; break;
    case 'たいあたり': skillKey = 'taiatari'; break;
    case 'kabutowari': case 'かぶとわり': skillKey = 'kabutowari'; break;
    case 'かえん斬り': skillKey = 'kaengiri'; break;
    case 'マヒャド斬': skillKey = 'mahyadogiri'; break;
    case 'いなずま斬': skillKey = 'inazumagiri'; break;
    case 'たいぼく斬':
      if (enemyFamily === 7) { // 植物系
        return { skill: rawSkills.taibokuzansyokubutu, label: 'たいぼく斬 特化' };
      }
      skillKey = 'taibokuzan';
      break;
    case 'かまいたち':
      if (enemyFamily === 3) { // エレメント系
        return { skill: rawSkills.kamaitatieremento, label: 'かまいたち 特化' };
      }
      skillKey = 'kamaitati';
      break;
    case 'けものづき':
      if (enemyFamily === 0) { // けもの系
        return { skill: rawSkills.kemonozukikemono, label: 'けものづき 特化' };
      }
      skillKey = 'kemonozuki';
      break;
    case 'シールドア': skillKey = 'sirudoataku'; break;
    case 'マヒ攻撃': skillKey = 'mahikougeki'; break;
    case 'もうどく攻': skillKey = 'moudokukougeki'; break;
    case 'のろい攻撃': skillKey = 'noroikougeki'; break;
    case 'ねむり攻撃': skillKey = 'nemurikougeki'; break;
    case '混乱攻撃': skillKey = 'konrankougeki'; break;
    case 'あしばらい': skillKey = 'asibarai'; break;
    case 'ハッスルブ': case 'ハッスルブレイク': skillKey = 'hastle_break'; break;
    default: skillKey = 'none';
  }
  return { skill: rawSkills[skillKey] || rawSkills.none, label: text };
}

export function getJumonSkill(text: string): Skill {
  let skillKey = '';
  switch (text) {
    case 'ギガデイン': skillKey = 'gigadein'; break;
    case 'ベギラゴン': skillKey = 'begiragon'; break;
    case 'マヒャド': skillKey = 'mahyado'; break;
    case 'イオナズン': skillKey = 'ionazun'; break;
    case '黒の魔砲': skillKey = 'kuronomahou'; break;
    case 'グランテン': case 'グランドテンペスト': skillKey = 'grandtenp'; break;
    case '大地の報い': skillKey = 'daitinomukui'; break;
    case 'ざざん波': skillKey = 'zazanpa'; break;
    case 'ベギラ強': case 'ベギラマ強': skillKey = 'begituyo'; break;
    case 'ヒャダル強': skillKey = 'hyadatuyo'; break;
    case 'バギクロス': skillKey = 'bagikuro'; break;
    case 'ベギラマ': skillKey = 'begirama'; break;
    case 'バギマ': skillKey = 'bagima'; break;
    case 'ヒャダルコ': skillKey = 'hyadaruko'; break;
    case 'イオラ': skillKey = 'iora'; break;
    case 'ジバリーナ': skillKey = 'zibarina'; break;
    case 'こうねつの': case 'こうねつのガス': skillKey = 'kounetunogasu'; break;
    case 'かがやく息': skillKey = 'kagayakuiki'; break;
    case 'ひかりのほ': case 'ひかりのほのお': skillKey = 'hikarino'; break;
    case 'プラズマ': case 'プラズマストーム': skillKey = 'plazma'; break;
    case '激しい炎': skillKey = 'hagehono'; break;
    case '凍える吹雪': skillKey = 'hubuki'; break;
    case '光のブレス': skillKey = 'hikabure'; break;
    case '闇のブレス': skillKey = 'yamibure'; break;
    case 'サンドスト': skillKey = 'sandosutomu'; break;
    case '火の息': skillKey = 'hinoiki'; break;
    case '火炎 of 息': case '火炎の息': skillKey = 'kaennnoiki'; break;
    case '氷 of 息': case '氷の息': skillKey = 'koorinoiki'; break;
    case 'たつまき': skillKey = 'tatumaki'; break;
    case 'サンドブレ': skillKey = 'sandoburesu'; break;
    case 'ベホマラー': skillKey = 'behomara'; break;
    case 'ウェーブ': case 'いやしのウェーブ': skillKey = 'iyasinouebu'; break;
    case 'いやしかぜ': skillKey = 'iyasinokaze'; break;
    default: skillKey = 'none';
  }
  return rawSkills[skillKey] || rawSkills.none;
}

export function getBreathSkill(text: string): Skill {
  let skillKey = '';
  switch (text) {
    case '火球バズー': case '火球バズーカ': skillKey = 'kakyuu'; break;
    case '氷塊バズー': case '氷塊バズーカ': skillKey = 'hyoukai'; break;
    case '暴風バズー': case '暴風バズーカ': skillKey = 'bouhuu'; break;
    case '雷光バズー': case '雷光バズーカ': skillKey = 'raikobaz'; break;
    case 'いかずち': case 'せいなるいかずち': skillKey = 'ikazuti'; break;
    case 'イオマータ': skillKey = 'iomata'; break;
    case 'イオマatax1': case 'イオマタx1': skillKey = 'iomata_1'; break;
    case '蒼玉 of 水撃': case '蒼玉の水撃': skillKey = 'suigeki'; break;
    case 'ドルモーア': skillKey = 'dorumoa'; break;
    case 'メラゾーマ': skillKey = 'merazoma'; break;
    case '閃熱 of 魔弾': case '閃熱の魔弾': case '閃熱of魔弾': skillKey = 'sennetu'; break;
    case 'ドルクマ強': skillKey = 'dorutuyo'; break;
    case 'ライデイン': skillKey = 'raidein'; break;
    case 'ソルフレア': skillKey = 'soruhurea'; break;
    case 'ドルクマ': skillKey = 'dorukuma'; break;
    case 'メラミ': skillKey = 'merami'; break;
    case 'デイン': skillKey = 'dein'; break;
    case 'ドルマ': skillKey = 'doruma'; break;
    case 'ジバリカ': skillKey = 'zibarika'; break;
    case 'メラ': skillKey = 'mera'; break;
    case 'ヒャド': skillKey = 'hyado'; break;
    case 'ベホイミ': skillKey = 'behoimi'; break;
    case 'ホイミ': skillKey = 'hoimi'; break;
    case 'ヒルファ回': skillKey = 'hirufangukai'; break;
    case 'ハッスル回': skillKey = 'hastle_break_kai'; break;
    default: skillKey = 'none';
  }
  return rawSkills[skillKey] || rawSkills.none;
}
