import React, { useState } from 'react';
import { Damedasu } from './components/Damedasu';
import { Darehaya } from './components/Darehaya';
import { TaiseiSearch } from './components/TaiseiSearch';
import { Gyakubiki } from './components/Gyakubiki';
import { TwoPan } from './components/TwoPan';
import { Yobisute } from './components/Yobisute';
import { Tips } from './components/Tips';
import { GemmaChat } from './components/GemmaChat';

type TabType = 'damedasu' | 'darehaya' | 'taisei' | 'gyakubiki' | 'twopan' | 'yobisute' | 'tips' | 'gemma';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    return (localStorage.getItem('dqw_activeTab') as TabType) || 'damedasu';
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    localStorage.setItem('dqw_activeTab', tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'damedasu':
        return <Damedasu />;
      case 'darehaya':
        return <Darehaya />;
      case 'taisei':
        return <TaiseiSearch />;
      case 'gyakubiki':
        return <Gyakubiki />;
      case 'twopan':
        return <TwoPan />;
      case 'yobisute':
        return <Yobisute />;
      case 'tips':
        return <Tips />;
      case 'gemma':
        return <GemmaChat />;
      default:
        return <Damedasu />;
    }
  };

  return (
    <div className="app-container">
      {/* プレミアムヘッダー */}
      <header className="app-header glass-panel" style={{ padding: '20px 30px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1>DQWなかまモンスターツール</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem' }}>
            ドラクエウォークなかまモンスター総合シミュレータ＆最適化ツール (Cloudflare Pages版)
          </p>
        </div>
      </header>

      {/* ナビゲーションタブ */}
      <nav className="tab-container">
        <button 
          className={`tab-btn ${activeTab === 'damedasu' ? 'active' : ''}`} 
          onClick={() => handleTabChange('damedasu')}
        >
          <span>⚔️</span>
          <span>ダメダス</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'darehaya' ? 'active' : ''}`} 
          onClick={() => handleTabChange('darehaya')}
        >
          <span>🏃</span>
          <span>誰はや</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'taisei' ? 'active' : ''}`} 
          onClick={() => handleTabChange('taisei')}
        >
          <span>🛡️</span>
          <span>耐性検索</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'gyakubiki' ? 'active' : ''}`} 
          onClick={() => handleTabChange('gyakubiki')}
        >
          <span>🔍</span>
          <span>逆引き</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'twopan' ? 'active' : ''}`} 
          onClick={() => handleTabChange('twopan')}
        >
          <span>⚡</span>
          <span>ツーパン</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'yobisute' ? 'active' : ''}`} 
          onClick={() => handleTabChange('yobisute')}
        >
          <span>📊</span>
          <span>呼びステ</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tips' ? 'active' : ''}`} 
          onClick={() => handleTabChange('tips')}
        >
          <span>💡</span>
          <span>Tips</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'gemma' ? 'active' : ''}`} 
          onClick={() => handleTabChange('gemma')}
        >
          <span>🤖</span>
          <span>Gemma(AI)</span>
        </button>
      </nav>

      {/* メインコンテンツ */}
      <main style={{ minHeight: '500px' }}>
        {renderContent()}
      </main>

      {/* フッター */}
      <footer style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.03)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <p>© 2026 DQW Nakama Monsters Tools Developed by ぐらい</p>
      </footer>
    </div>
  );
};

export default App;
