export type PresetType = 'damedasu' | 'twopan';

export interface Preset {
  id: string;
  name: string;
  type: PresetType;
  timestamp: number;
  data: any;
}

const STORAGE_KEY = 'dqw_buddy_presets';

export const getPresets = (type?: PresetType): Preset[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const allPresets: Preset[] = JSON.parse(raw);
    if (type) {
      return allPresets.filter(p => p.type === type).sort((a, b) => b.timestamp - a.timestamp);
    }
    return allPresets.sort((a, b) => b.timestamp - a.timestamp);
  } catch (e) {
    console.error('Failed to load presets', e);
    return [];
  }
};

export const savePreset = (type: PresetType, name: string, data: any): void => {
  const newPreset: Preset = {
    id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
    name,
    type,
    timestamp: Date.now(),
    data
  };
  
  const allPresets = getPresets();
  allPresets.push(newPreset);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allPresets));
};

export const deletePreset = (id: string): void => {
  const allPresets = getPresets();
  const filtered = allPresets.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
