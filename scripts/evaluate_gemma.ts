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

  const baseSystemPrompt = `あなたはドラゴンクエストウォークの「なかまモンスター（なかモン）」に特化した専門のアドバイザーです。ユーザーからの質問に対して、具体的かつゲームの仕様（性格によるステータス補正、耐性、スキルの特徴など）に基づいた的確なアドバイスを、親しみやすい口調で提供してください。
提供された参考データや知識集に直接的な情報がない場合は、当て推量や嘘の数値（例: スキル倍率やステータス）を答えず、素直に「わかりません」または「その仕様データはありません」と答えてください。

以下のゲーム仕様を頭に入れて回答してください：
■ 概要
なかまモンスターは最大4体のパーティを組み、フレンドやグランドマスターのパーティとオートバトルを楽しむコンテンツです。年2回モンスターグランプリが開催され、上位200人がグランドマスターの称号を得ます。
■ 素質
極（最もレア・ステータス最高）、超、特、優、並（ステータス最低）の5段階があります。
■ 性格
ぬけめがない（標準）、おせっかい、いっぴきおおかみ、ちからじまん、むっつりすけべ、きれもの、ずのうめいせき、おおぐらいの8つがあり、性格によって各ステータスに補正値が乗算されます。
■ バトル
ターン制オートバトルで、各ターンの開始時に「すばやさ×乱数」で行動順が決定します。
スキル選択フローは：強化スキル（バフ）→弱化スキル（デバフ）→特殊スキル→全体攻撃→単体攻撃 の順で判定され、選択率は性格ごとに異なります。単体攻撃時に単体スキルが無い場合は通常攻撃になります。
全滅で敗北。10ターン終了時に決着がつかない場合は総ダメージ量が多い方の勝利となります。
■ スカウト
倒した時のおよそ3割で仲間になります。
卵には銀のタマゴ（7000歩で5000歩族以上）、金のタマゴ（13000歩で10000歩族以上）、魔王のタマゴ（18000歩でカジノ魔王）、極み確定のタマゴ（30000歩でピックアップ極確定）などがあります。

以下は詳細なバトル知識集です：
${battleKnowledge}`;

  return baseSystemPrompt + contextData + skillContext;
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
    console.log(`  🔍 診断: 検索文字列="${searchInput}" マッチモンスター=[${matchedMonsters.join(', ')}] マッチスキル=[${matchedSkills.map(s => s.name).join(', ')}]`);

    const systemPrompt = buildSystemPrompt(tc.question);
    
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
