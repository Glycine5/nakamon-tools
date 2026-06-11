import React, { useState } from 'react';
import { monsterMap } from '../data/monsters';
import { getMonsterStepFamily } from '../data/skills';
import { familyNames, personalities, qualifications } from '../data/constants';
import rawMonsterTraits from '../data/monster_traits.json';

const monsterTraits = rawMonsterTraits as Record<string, { skills: string[], traits: string[], slots: string[] }>;

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
      let contextData = '';
      const matchedMonsters = Object.keys(monsterMap).filter(name => input.includes(name));

      const relevantKeywords = new Set<string>();
      Object.values(monsterTraits).forEach(td => {
        td.skills.forEach(s => {
          const sName = s.split(' / ')[0].trim();
          if (sName.length > 1 && input.includes(sName)) relevantKeywords.add(sName);
        });
        td.traits.forEach(t => {
          const tName = t.split(' / ')[0].trim().replace(/[A-Z～S]+/g, '').trim();
          if (tName.length > 1 && input.includes(tName)) relevantKeywords.add(tName);
        });
      });

      const keywordToMonsters: Record<string, string[]> = {};
      Array.from(relevantKeywords).forEach(keyword => {
        const matching = Object.keys(monsterMap).filter(name => {
          const mName = name.replace(/\d+$/, '');
          const td = monsterTraits[mName];
          if (!td) return false;
          return td.skills.some(s => s.includes(keyword)) || td.traits.some(t => t.includes(keyword));
        });
        if (matching.length > 0) {
          keywordToMonsters[keyword] = matching;
        }
      });

      const matchedQualKey = Object.keys(qualifications).find(q => input.includes(q)) || '極';
      const matchedPersKey = Object.keys(personalities).find(p => input.includes(p)) || '性格';
      const qualMult = qualifications[matchedQualKey];
      const persMods = personalities[matchedPersKey].modifiers;

      const allMonsters = Object.values(monsterMap);
      const maxHp = Math.max(...allMonsters.map(m => m.hp));
      const maxPower = Math.max(...allMonsters.map(m => m.power));
      const maxGuard = Math.max(...allMonsters.map(m => m.guard));
      const maxMagic = Math.max(...allMonsters.map(m => m.magic));
      const maxHeal = Math.max(...allMonsters.map(m => m.heal));
      const maxSpeed = Math.max(...allMonsters.map(m => m.speed));
      const maxDex = Math.max(...allMonsters.map(m => m.dexterity));

      const getAiStepFamilyStr = (name: string): string => {
        const family = getMonsterStepFamily(name);
        if (family === '18k') return '18000歩族';
        if (family === '13k') return '13000歩族';
        if (family === '10k') return '10000歩族';
        return '7000歩以下のタマゴ または スカウト産';
      };

      if (matchedMonsters.length > 0) {
        contextData = '\n\n【参考データ（アプリ内最新ステータス）】\n';
        
        matchedMonsters.forEach(name => {
          const m = monsterMap[name];
          const familyName = familyNames[m.family];

          const hp = Math.floor(m.hp * qualMult * persMods[0]);
          const power = Math.floor(m.power * qualMult * persMods[1]);
          const guard = Math.floor(m.guard * qualMult * persMods[2]);
          const magic = Math.floor(m.magic * qualMult * persMods[3]);
          const heal = Math.floor(m.heal * qualMult * persMods[4]);
          const speed = Math.floor(m.speed * qualMult * persMods[5]);
          const dexterity = Math.floor(m.dexterity * qualMult * persMods[6]);

          const evaluateStat = (val: number, max: number) => {
            const ratio = val / max;
            if (ratio >= 0.8) return 'トップクラス';
            if (ratio >= 0.6) return '高め';
            if (ratio >= 0.4) return '普通';
            if (ratio >= 0.2) return '低め';
            return 'かなり低い';
          };

          const hpEval = evaluateStat(hp, maxHp);
          const powerEval = evaluateStat(power, maxPower);
          const guardEval = evaluateStat(guard, maxGuard);
          const magicEval = evaluateStat(magic, maxMagic);
          const healEval = evaluateStat(heal, maxHeal);
          const speedEval = evaluateStat(speed, maxSpeed);
          const dexEval = evaluateStat(dexterity, maxDex);

          const highStats: string[] = [];
          const avgStats: string[] = [];
          const lowStats: string[] = [];

          const addStat = (name: string, ev: string, val: number) => {
            const str = `${name} ${val}(${ev})`;
            if (ev === 'トップクラス' || ev === '高め') highStats.push(str);
            else if (ev === '普通') avgStats.push(str);
            else lowStats.push(str);
          };

          addStat('HP', hpEval, hp);
          addStat('攻撃力', powerEval, power);
          addStat('守備力', guardEval, guard);
          addStat('攻撃魔力', magicEval, magic);
          addStat('回復魔力', healEval, heal);
          addStat('すばやさ', speedEval, speed);
          addStat('きようさ', dexEval, dexterity);

          const attrs = [
            { n: 'メラ', v: m.mera }, { n: 'ギラ', v: m.gira }, { n: 'イオ', v: m.io }, 
            { n: 'ヒャド', v: m.hyado }, { n: 'バギ', v: m.bagi }, { n: 'ジバリア', v: m.jiba }, 
            { n: 'デイン', v: m.dein }, { n: 'ドルマ', v: m.doruma }, { n: 'ザバ', v: m.zaba }
          ];

          const attackType = magic > power ? "高い攻撃魔力を活かした魔法攻撃が主体です。" : "高い攻撃力を活かした物理攻撃が主体です。";
          const qualStr = matchedQualKey === '極' && matchedPersKey === '性格' ? '' : ` (${matchedQualKey} / ${matchedPersKey})`;
          const stepFamily = getAiStepFamilyStr(name);

          contextData += `- モンスター名: ${name}${qualStr} (系統: ${familyName})\n`;
          contextData += `  【タマゴ孵化歩数】: ${stepFamily}\n`;
          contextData += `  【戦闘スタイル】: ${attackType}\n`;
          contextData += `  【長所（高いステータス）】: ${highStats.length > 0 ? highStats.join('、') : '特になし'}\n`;
          contextData += `  【平均的なステータス】: ${avgStats.length > 0 ? avgStats.join('、') : '特になし'}\n`;
          contextData += `  【短所（低いステータス）】: ${lowStats.length > 0 ? lowStats.join('、') : '特になし'}\n`;

          contextData += `  【属性耐性】\n`;
          contextData += `    - 弱点(ダメージ大): ${attrs.filter(a => a.v > 1.0).map(a => a.n).join('、') || 'なし'}\n`;
          contextData += `    - 耐性(ダメージ小): ${attrs.filter(a => a.v < 1.0).map(a => a.n).join('、') || 'なし'}\n`;

          const traitsData = monsterTraits[name.replace(/\d+$/, '')];
          if (traitsData) {
            const uniqueSkills = Array.from(new Set(traitsData.skills));
            const uniqueTraits = Array.from(new Set(traitsData.traits)).filter(t => !uniqueSkills.includes(t));
            
            contextData += `  【習得スキル】: ${uniqueSkills.length > 0 ? uniqueSkills.join(' / ') : '不明'}\n`;
            contextData += `  【特殊効果（特性など）】: ${uniqueTraits.length > 0 ? uniqueTraits.join(' / ') : '不明'}\n`;
            contextData += `  【継承玉スロット】: ${traitsData.slots.length > 0 ? traitsData.slots.join('・') : 'なし/不明'}\n`;
          }
          contextData += `\n`;
        });
      }

      if (Object.keys(keywordToMonsters).length > 0) {
        contextData += '\n\n【関連するスキル・特殊効果を持つモンスター一覧】\n';
        for (const [kw, monsters] of Object.entries(keywordToMonsters)) {
           contextData += `- 「${kw}」を持つモンスター: ${monsters.join('、')}\n`;
        }
      }

      const baseSystemPrompt = `あなたはドラゴンクエストウォークの「なかまモンスター」に特化した専門のアドバイザーです。
ユーザーからの質問に対して、提供された参考データに基づいて客観的な事実のみを回答してください。
回答の際には、AI独自の解釈や推測（「○○だから強い」「○○に期待できる」など）を含めず、データに記載されている強みや弱みをそのまま伝えてください。
挨拶などの前置きは省略し、すぐに本題から回答を始めてください。

【重要な前提知識】
- 「すばやさD～S」のような表記は、その能力がDランクから成長が始まり、最大でSランクまで成長しうることを意味します。
- ユーザーからの「〇〇の継承玉が抜けるのはだれ？」「〇〇が抜けるのはだれ？」という質問は、「〇〇の特殊効果や習得スキルを持つモンスターはだれ？」と同じ意味です。該当するスキルや特殊効果を持つモンスターを回答してください。`;
      
      const finalSystemPrompt = baseSystemPrompt + contextData;

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
      <div className="tab-header" style={{ marginBottom: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          ✨ AI (Gemma試運転)
          <span style={{ fontSize: '0.8rem', background: 'var(--accent-blue)', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>Beta</span>
        </h2>
      </div>

      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '600px', padding: '0' }}>
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

        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="質問を入力してください... (例: 極みいっぴきおおかみのりゅうおうは何歩族？)"
              disabled={loading}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
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
