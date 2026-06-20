import React, { useState } from 'react';
import { monsterMap } from '../data/monsters';
import { battleKnowledge } from '../data/battleKnowledge';
import { rawSkills } from '../data/skills';

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

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const GemmaChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '質問してね！' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 略称の展開を行って、コンテキストマッチングのヒット率を上げる
      let searchInput = input;
      Object.entries(abbreviationMap).forEach(([abbr, canonical]) => {
        if (input.includes(abbr)) {
          searchInput += ` ${canonical}`;
        }
      });

      // --- RAG: 文中に含まれるモンスターを検知してカンペを作成 ---
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

      // --- RAG: 文中に含まれるスキルを検知してカンペを作成 ---
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
ユーザーはモンスター名やスキル名を略称（例: キラマ＝キラーマシン、オシャン＝オーシャンボーン、サイクロン＝灼熱サイクロン、ゴドスマ＝ゴッドスマッシュ等）で質問することがあります。その場合は、対応する正式名称のデータに基づいて適切に回答してください。

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
      const finalSystemPrompt = baseSystemPrompt + contextData + skillContext;

      const response = await fetch('/api/gemma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          systemPrompt: finalSystemPrompt
        })
      });

      const data = await response.json();
      
      if (response.ok && data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `エラーが発生しました: ${data.error || '不明なエラー'}` }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `通信エラー: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="tab-header" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          ✨ AI (Gemma試運転)
          <span style={{ fontSize: '0.8rem', background: 'var(--accent-blue)', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>Beta</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
          ⚠️ Gemmaは勉強中であり、間違えることがあります。
        </p>
      </div>

      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '480px', padding: '0' }}>
        
        {/* チャット履歴エリア */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '50%', 
                background: msg.role === 'user' ? 'var(--accent-gold)' : 'var(--accent-blue)',
                display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem',
                flexShrink: 0
              }}>
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div style={{
                background: msg.role === 'user' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                padding: '12px 16px',
                borderRadius: '12px',
                borderTopRightRadius: msg.role === 'user' ? '4px' : '12px',
                borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '12px',
                maxWidth: '80%',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🤖</div>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '12px', borderTopLeftRadius: '4px' }}>
                <span className="typing-indicator">考え中...</span>
              </div>
            </div>
          )}
        </div>

        {/* 入力エリア */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="質問を入力してください... (例: キラーマシンの弱点は？)"
              disabled={loading}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'black',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              style={{
                background: 'var(--accent-blue)',
                color: 'white',
                border: 'none',
                padding: '0 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.5 : 1
              }}
            >
              送信
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
