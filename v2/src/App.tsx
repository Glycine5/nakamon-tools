import React, { useState } from 'react';
import './index.css';
import { Damedasu } from './components/Damedasu';
import { TwoPan } from './components/TwoPan';

type TabType = 'damedasu' | 'twopan';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('damedasu');

  return (
    <div className="container">
      <div className="dq-window" style={{ marginBottom: '24px' }}>
        <h1>DQW ツール V2</h1>
        <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>〜 ドラクエ風UIエディション 〜</p>
      </div>

      <div className="dq-window flex-row" style={{ justifyContent: 'center', marginBottom: '24px' }}>
        <button 
          className={`dq-button ${activeTab === 'damedasu' ? 'active' : ''}`}
          onClick={() => setActiveTab('damedasu')}
        >
          ダメダス
        </button>
        <button 
          className={`dq-button ${activeTab === 'twopan' ? 'active' : ''}`}
          onClick={() => setActiveTab('twopan')}
        >
          ツーパン
        </button>
      </div>

      <div>
        {activeTab === 'damedasu' && <Damedasu />}
        {activeTab === 'twopan' && <TwoPan />}
      </div>
    </div>
  );
}

export default App;
