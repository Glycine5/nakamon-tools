import { monsterMap } from '../src/data/monsters';
import { rawSkills } from '../src/data/skills';
import { battleKnowledge } from '../src/data/battleKnowledge';

// 略称マッピング
const abbreviationMap: Record<string, string> = {
  'キラマ': 'キラーマシン',
  'オシャン': 'オーシャンボーン',
  'オーシャン': 'オーシャンボーン',
  'スラジェネ': 'スライムジェネラル',
  'ジェネラル': 'スライムジェネラル',
  'ホブリ': 'ホークブリザード',
  'りゅう': 'りゅうおう',
  '竜王': 'りゅうおう',
  'デスピ': 'デスピサロ',
  'ワイト': 'ワイトキング',
  'キラパン': 'キラーパンサー',
  'ドラゴス': 'ドラゴスライム',
  'シルデビ': 'シルバーデビル',
  'よろきし': 'よろいのきし',
  'スラナイ': 'スライムナイト',
  'スカドラ': 'スカイドラゴン',
  'バトレク': 'バトルレックス',
  'キンスラ': 'キングスライム',
  'ボンナイ': 'ボーンナイト',
  'うご石': 'うごくせきぞう',
  'まおつか': 'まおうのつかい',
  'メイデン': 'メイデンドール',

  'サイクロン': '灼熱サイクロン',
  'ゴドスマ': 'ゴッドスマッシュ',
  'テンペ': 'テンペストブロウ',
  'デスク': 'デスクロー',
  '冥王': '冥王の炎鎌',
  '氷結': '氷結らんげき',
  'ハッスル': 'ハッスルブレイク',
  'ベホマ': 'ベホマラー',
  'メイル': 'メイルストローム',

  'おせ': 'おせっかい',
  'いっぴき': 'いっぴきおおかみ',
  'いぴ': 'いっぴきおおかみ',
  'おおかみ': 'いっぴきおおかみ',
  'ちから': 'ちからじまん',
  'むっつり': 'むっつりすけべ',
  'ずのう': 'ずのうめいせき',
  'ぬけめ': 'ぬけめがない',
};

const getElementName = (idx: number) => {
  switch (idx) {
    case 11: return 'メラ';
    case 12: return 'ギラ';
    case 13: return 'イオ';
    case 14: return 'ヒャド';
    case 15: return 'バギ';
    case 16: return 'ジバリア';
    case 17: return 'デイン';
    case 18: return 'ドルマ';
    case 19: return '回復';
    case 37: return 'ザバ';
    default: return '無属性';
  }
};

// プロンプト構築関数
function buildSystemPrompt(input: string): string {
  let searchInput = input;
  Object.entries(abbreviationMap).forEach(([abbr, canonical]) => {
    if (input.includes(abbr)) {
      searchInput += ` ${canonical}`;
    }
  });

  // モンスターRAG
  let contextData = '';
  const matchedMonsters = Object.keys(monsterMap).filter(name => searchInput.includes(name));
  if (matchedMonsters.length > 0) {
    contextData = '\n\n【参考データ（アプリ内最新ステータス）】\n';
    matchedMonsters.forEach(name => {
      const m = monsterMap[name];
      const attrs = [
        { n: 'メラ', v: m.mera }, { n: 'ギラ', v: m.gira }, { n: 'イオ', v: m.io }, 
        { n: 'ヒャド', v: m.hyado }, { n: 'バギ', v: m.bagi }, { n: 'ジバリア', v: m.jiba }, 
        { n: 'デイン', v: m.dein }, { n: 'ドルマ', v: m.doruma }, { n: 'ザバ', v: m.zaba }
      ];
      const weaknesses = attrs.filter(a => a.v > 1.0).map(a => a.n).join('、') || 'なし';
      const resistances = attrs.filter(a => a.v < 1.0).map(a => a.n).join('、') || 'なし';

      contextData += `- ${name}: HP ${m.hp}, 攻撃力 ${m.power}, 守備力 ${m.guard}, すばやさ ${m.speed}\n`;
      contextData += `  弱点属性(ダメージ大): ${weaknesses}\n`;
      contextData += `  耐性属性(ダメージ小): ${resistances}\n`;
    });
  }

  // スキルRAG
  let skillContext = '';
  const matchedSkills = Object.values(rawSkills).filter(skill => searchInput.includes(skill.name));
  if (matchedSkills.length > 0) {
    skillContext = '\n\n【参考データ（スキル詳細仕様）】\n';
    matchedSkills.forEach(s => {
      if (!s.raw) return;
      const mag = s.raw[0];
      const isSpell = s.raw[5] === 1;
      const isBreath = s.raw[5] === 2;
      const isHeal = s.raw[5] === 3 || s.raw[5] === 4 || s.raw[6] === 19;
      const mp = s.raw[7];
      const element = getElementName(s.raw[6] as number);
      
      let typeStr = '';
      if (isHeal) typeStr = '回復';
      else if (isSpell) typeStr = '呪文';
      else if (isBreath) typeStr = 'ブレス';
      else typeStr = '物理/体技';

      const targetStr = s.raw[4] === 2 || s.raw[4] === 4 ? '全体' : '単体';

      skillContext += `- ${s.name}: カテゴリ ${typeStr}(${targetStr}), 消費MP ${mp}, 属性 ${element}, 基本威力/倍率 ${mag}${!isSpell && !isBreath && !isHeal ? '倍' : ''}\n`;
    });
  }

  // ステータスランキング（攻撃力や素早さが高いモンスター）の検知と動的コンテキスト注入
  let statContext = '';
  const queryLower = searchInput.toLowerCase();
  
  const getTopMonstersByStat = (statKey: 'hp' | 'power' | 'guard' | 'speed' | 'magic' | 'heal', statLabel: string, count = 10) => {
    const sorted = Object.values(monsterMap)
      .filter(m => m.name !== 'デフォルト')
      .sort((a, b) => b[statKey] - a[statKey])
      .slice(0, count);
    
    let text = `\n【参考データ（${statLabel}が高いモンスターのトップ${count}ランキング）】\n`;
    sorted.forEach((m, idx) => {
      text += `${idx + 1}位. ${m.name}: ${statLabel} ${m[statKey]} (HP ${m.hp}, 攻撃力 ${m.power}, 守備力 ${m.guard}, すばやさ ${m.speed})\n`;
    });
    return text;
  };

  const isStatQuery = (keywords: string[]) => keywords.some(k => queryLower.includes(k));
  const statKeywords = ['高い', '最高', '一番', '最大', '多い', 'ランキング', 'トップ', '順位', '最強', 'つよい', '強い'];
  
  if (statKeywords.some(k => queryLower.includes(k))) {
    if (isStatQuery(['攻撃', 'ちから', '力', 'こうげき'])) {
      statContext += getTopMonstersByStat('power', 'ちから(攻撃力)');
    }
    if (isStatQuery(['すばやさ', '素早さ', '速い', 'はやい', 'スピード'])) {
      statContext += getTopMonstersByStat('speed', 'すばやさ');
    }
    if (isStatQuery(['hp', '体', 'ライフ', 'タフ'])) {
      statContext += getTopMonstersByStat('hp', '最大HP');
    }
    if (isStatQuery(['守備', 'しゅび', '防御', 'かたい', '硬い'])) {
      statContext += getTopMonstersByStat('guard', '守備力');
    }
    if (isStatQuery(['攻魔', 'こうま', '魔法', 'こうげきまりょく'])) {
      statContext += getTopMonstersByStat('magic', '攻撃魔力');
    }
    if (isStatQuery(['回魔', 'かいま', '回復', 'かいふくまりょく'])) {
      statContext += getTopMonstersByStat('heal', '回復魔力');
    }
  }

  // 知識ベース(battleKnowledge)の動的フィルタリング (RAG)
  let relevantKnowledge = '';
  const sections = battleKnowledge.split(/(?=\n■ )/);
  
  // ヘッダー/イントロ部分の追加
  const firstSection = sections[0];
  if (!firstSection.trim().startsWith('■')) {
    relevantKnowledge += firstSection;
  }

  sections.forEach(section => {
    if (!section.trim().startsWith('■')) return;
    
    // セクションタイトルの抽出
    const match = section.match(/■\s*([^\n]+)/);
    if (!match) return;
    const title = match[1];
    const lowerTitle = title.toLowerCase();
    
    let matched = false;
    
    // タイトルがクエリに含まれるかチェック
    if (queryLower.includes(lowerTitle)) {
      matched = true;
    }
    
    // セクション毎のキーワードマッピング
    const sectionKeywords: Record<string, string[]> = {
      'ゲーム概要': ['ルール', '時間', 'ターン', 'オート', '勝敗', '概要'],
      '�  const baseSystemPrompt = `あなたはドラゴンクエストウォークの「なかまモンスター（なかモン）」に特化した専門のアドバイザーです。ユーザーからの質問に対して、具体的かつゲーム of 仕様（性格によるステータス補正、耐性、スキルの特徴など）に基づいた的確なアドバイスを、親しみやすい口調で提供してください。
提供された参考データや知識集に直接的な情報がない（または推測も困難な）場合は、当て推量や嘘の数値（例: スキル倍率やステータス）を答えず、素直に「わかりません」または「その仕様データはありません」と答えてください。ただし、提供された参考データや知識集に類する表現がある場合は、言葉の揺れや文脈（例: 「×1000」→「1000倍」、「死亡している味方からランダム」→「死亡している味方」等）を柔軟に解釈して適切に回答してください。
モンスターのステータス数値（HP、攻撃力/ちから、守備力、すばやさ等）や属性耐性、スキルの基本威力、消費MPなどの具体的な数値について質問された場合は、必ず提供された「参考データ」に記載されている正確な数値（例: 「キラーマシン: HP 1006, 攻撃力 619, 守備力 702, すばやさ 613」など）を最優先で、そのまま数字で回答してください。
ユーザーはモンスター名やスキル名を略称（例: キラマ＝キラーマシン、オシャン＝オーシャンボーン、サイクロン＝灼熱サイクロン、ゴドスマ＝ゴッドスマッシュ等）で質問することがあります。その場合は、対応する正式名称のデータに基づいて適切に回答してください。`�フ', '攻撃'],
      'スキル分類': ['スキル', '呪文', 'ブレス', '体技', '反射', '多段', '回復呪文', 'マホカンタ'],
      '状態異常': ['異常', '麻痺', '眠り', '混乱', '魅了', '休み', '猛毒', '呪い', '封印', 'マヌーサ', 'まもりのたて'],
      'バフ・デバフ': ['強化', '弱体', '上昇', '低下', 'ピオラ', 'バイシオン', 'スカラ', 'フバーハ', 'マホカンタ', '霧', '怒り'],
      'いきなりスキル': ['いきなり', 'アームライオン', 'りゅうおう', 'ヘルクラウダー', 'ガチャコッコ', 'ジェネラル', 'テンタクルス', 'ジャミラス', 'バルボロス', 'ミイラ男', 'スカルゴン', 'ドルイド', 'グレイトマーマン', 'シャドー', 'ネルゲル'],
      '回復AI': ['回復', '閾値', 'しきいち', 'ベホマラー', 'ハッスル', '一発解決'],
      '特殊メカニクス': ['ジバリカ', 'ジバリーナ', '波動', '魅惑', '覚醒', '死亡'],
      '行動順の決まり方': ['行動順', 'でんこうせっか', 'ピオラ', '乱数', '素早さ', '順番'],
      '攻撃ターゲット': ['ターゲット', '標的', '狙う', '対象', 'おおあばれ', 'ランダム', 'ザオラル', 'ジバリア']
    };
    
    for (const [key, keywords] of Object.entries(sectionKeywords)) {
      if (lowerTitle.includes(key.toLowerCase()) && keywords.some(kw => queryLower.includes(kw.toLowerCase()))) {
        matched = true;
        break;
      }
    }
    
    if (matched) {
      relevantKnowledge += '\n' + section.trim() + '\n';
    }
  });

  // もし何もマッチしなかった場合は、基本ルールと概要だけを入れておく
  if (relevantKnowledge.trim() === '===========================================================\nなかまモンスター 総合知識集\n（ローカルAI質問応答用）\n===========================================================') {
    const defaultSections = sections.filter(s => s.includes('ゲーム概要') || s.includes('素質と性格'));
    defaultSections.forEach(s => {
      relevantKnowledge += '\n' + s.trim() + '\n';
    });
  }

  const baseSystemPrompt = `あなたはドラゴンクエストウォークの「なかまモンスター（なかモン）」に特化した専門のアドバイザーです。ユーザーからの質問に対して、具体的かつゲームの仕様（性格によるステータス補正、耐性、スキルの特徴など）に基づいた的確なアドバイスを、親しみやすい口調で提供してください。
提供された参考データや知識集に直接的な情報がない場合は、当て推量や嘘の数値（例: スキル倍率やステータス）を答えず、素直に「わかりません」または「その仕様データはありません」と答えてください。
モンスターのステータス数値（HP、攻撃力/ちから、守備力、すばやさ等）や属性耐性、スキルの基本威力、消費MPなどの具体的な数値について質問された場合は、必ず提供された「参考データ」に記載されている正確な数値（例: 「キラーマシン: HP 1006, 攻撃力 619, 守備力 702, すばやさ 613」など）を最優先で、そのまま数字で回答してください。
ユーザーはモンスター名やスキル名を略称（例: キラマ＝キラーマシン、オシャン＝オーシャンボーン、サイクロン＝灼熱サイクロン、ゴドスマ＝ゴッドスマッシュ等）で質問することがあります。その場合は、対応する正式名称のデータに基づいて適切に回答してください。

以下のゲーム仕様を頭に入れて回答してください：
${relevantKnowledge}`;

  return baseSystemPrompt + contextData + skillContext + statContext;
}

// テストケース
interface TestCase {
  question: string;
  expectedKeywords: string[];
}

const testCases: TestCase[] = [
  {
    question: '状態異常の優先順位を教えてください。',
    expectedKeywords: ['麻痺', '眠り', '混乱', '魅了', '休み']
  },
  {
    question: '金のタマゴは何歩で孵化しますか？',
    expectedKeywords: ['13000', '13,000']
  },
  {
    question: 'おせっかいの回復閾値は何%ですか？',
    expectedKeywords: ['80']
  },
  {
    question: '灼熱サイクロンの倍率は？',
    expectedKeywords: ['1.5']
  },
  {
    question: 'キラマの基本すばやさは？',
    expectedKeywords: ['613'] // キラーマシンのすばやさは613
  },
  {
    question: '存在しないスキル「デインズマ」の倍率は何倍？',
    expectedKeywords: ['わかりません', 'データはありません', '情報がありません', '不可能です', '含まれていません']
  },
  {
    question: '一番攻撃力の高いモンスターは？',
    expectedKeywords: ['ネルゲル', 'キラーパンサー', 'まおうのつかい']
  },
  {
    question: '一番すばやさが高いモンスターは誰？',
    expectedKeywords: ['キラーパンサー', 'ドラゴスライム']
  },
  {
    question: 'でんこうせっかが発動すると、素早さは何倍になりますか？',
    expectedKeywords: ['1000', '１０００']
  },
  {
    question: '単体攻撃のターゲット選択で倒せる敵がいる場合、インデックスがどういう敵を選びますか？',
    expectedKeywords: ['小さい', '先頭', 'インデックス']
  },
  {
    question: 'ザオラルなどの蘇生スキルを使うとき、どの味方をターゲットにしますか？',
    expectedKeywords: ['ランダム', '死亡']
  }
];

async function runTests() {
  console.log('=== Gemma AI 評価＆プロンプトテスト開始 ===\n');
  let passedCount = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    console.log(`[テスト ${i + 1}] 質問: ${tc.question}`);
    
    // 診断ログの出力
    let searchInput = tc.question;
    Object.entries(abbreviationMap).forEach(([abbr, canonical]) => {
      if (tc.question.includes(abbr)) {
        searchInput += ` ${canonical}`;
      }
    });
    const matchedMonsters = Object.keys(monsterMap).filter(name => searchInput.includes(name));
    const matchedSkills = Object.values(rawSkills).filter(skill => searchInput.includes(skill.name));
    const systemPrompt = buildSystemPrompt(tc.question);
    const matchedSections: string[] = [];
    const sectionHeaders = systemPrompt.match(/■\s*[^\n]+/g) || [];
    sectionHeaders.forEach(header => {
      matchedSections.push(header.trim());
    });
    console.log(`  🔍 診断: 検索文字列="${searchInput}" マッチモンスター=[${matchedMonsters.join(', ')}] マッチスキル=[${matchedSkills.map(s => s.name).join(', ')}] マッチ知識=[${matchedSections.join(', ')}]`);
    
    try {
      const response = await fetch('https://nakamon-tools.pages.dev/api/gemma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: tc.question,
          systemPrompt: systemPrompt
        })
      });

      const data = await response.json();
      const answer = data.response || '';

      console.log(`-> 回答:\n${answer}\n`);

      // キーワード判定
      const passed = tc.expectedKeywords.some(keyword => answer.includes(keyword));
      if (passed) {
        console.log(`結果: ✅ 合格 (期待キーワード: ${tc.expectedKeywords.join('/')})\n`);
        passedCount++;
      } else {
        console.log(`結果: ❌ 不合格 (期待キーワード: ${tc.expectedKeywords.join('/')})\n`);
      }
    } catch (e: any) {
      console.log(`結果: 💥 エラー (${e.message})\n`);
    }
  }

  console.log(`=== テスト終了: 合格率 ${passedCount}/${testCases.length} (${Math.round((passedCount/testCases.length)*100)}%) ===`);
}

runTests();
