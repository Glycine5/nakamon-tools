const fs = require('fs');

// 1. Fix PresetModal.tsx
let modal = fs.readFileSync('src/components/PresetModal.tsx', 'utf8');
modal = modal.replace(
  "import { Preset, PresetType, getPresets, deletePreset }",
  "import type { Preset, PresetType } from '../utils/presetManager';\nimport { getPresets, deletePreset }"
);
fs.writeFileSync('src/components/PresetModal.tsx', modal, 'utf8');

// 2. Fix TwoPan.tsx imports
let twopan = fs.readFileSync('src/components/TwoPan.tsx', 'utf8');
if (!twopan.includes('import { savePreset }')) {
  twopan = twopan.replace(
    "import { Dropdown } from './Dropdown';",
    "import { Dropdown } from './Dropdown';\nimport { savePreset } from '../utils/presetManager';\nimport { PresetModal } from './PresetModal';"
  );
}

// Ensure PresetModal is injected at the end for TwoPan
if (!twopan.includes('<PresetModal')) {
  // find last index of </div>
  const idx = twopan.lastIndexOf('</div>');
  if (idx !== -1) {
    twopan = twopan.slice(0, idx) + `\n      <PresetModal isOpen={isPresetModalOpen} onClose={() => setIsPresetModalOpen(false)} type="twopan" onLoad={loadPresetData} />\n    ` + twopan.slice(idx);
  }
}
fs.writeFileSync('src/components/TwoPan.tsx', twopan, 'utf8');

// 3. Ensure PresetModal is injected at the end for Damedasu
let damedasu = fs.readFileSync('src/components/Damedasu.tsx', 'utf8');
if (!damedasu.includes('<PresetModal')) {
  const idx = damedasu.lastIndexOf('</div>');
  if (idx !== -1) {
    damedasu = damedasu.slice(0, idx) + `\n      <PresetModal isOpen={isPresetModalOpen} onClose={() => setIsPresetModalOpen(false)} type="damedasu" onLoad={loadPresetData} />\n    ` + damedasu.slice(idx);
  }
}
fs.writeFileSync('src/components/Damedasu.tsx', damedasu, 'utf8');

console.log('Fixed imports and injected modal.');
