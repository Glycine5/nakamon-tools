import React, { useEffect, useState } from 'react';
import type { Preset, PresetType } from '../utils/presetManager';
import { getPresets, deletePreset } from '../utils/presetManager';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: PresetType;
  onLoad: (data: any) => void;
}

export const PresetModal: React.FC<PresetModalProps> = ({ isOpen, onClose, type, onLoad }) => {
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPresets(getPresets(type));
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`プリセット「${name}」を削除してもよろしいですか？`)) {
      deletePreset(id);
      setPresets(getPresets(type));
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 9999,
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--accent-gold)' }}>📂 プリセットを呼び出す</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
        </div>

        <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
          {presets.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
              保存されたプリセットはありません。
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {presets.map(p => (
                <div key={p.id} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, cursor: 'pointer' }} onClick={() => { onLoad(p.data); onClose(); }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-primary)' }}>{p.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(p.timestamp).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id, p.name); }}
                    style={{
                      background: 'rgba(142, 36, 48, 0.1)',
                      border: '1px solid rgba(142, 36, 48, 0.3)',
                      color: 'var(--accent-red)',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
