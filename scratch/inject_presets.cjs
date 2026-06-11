const fs = require('fs');

function inject(file, typeName, statesListStr, loadDataMapStr) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add imports
  if (!content.includes('savePreset')) {
    content = content.replace(
      "import { AttributeBadge } from './AttributeBadge';",
      "import { AttributeBadge } from './AttributeBadge';\nimport { savePreset } from '../utils/presetManager';\nimport { PresetModal } from './PresetModal';"
    );
  }

  // 2. Add isPresetModalOpen state
  if (!content.includes('isPresetModalOpen')) {
    content = content.replace(
      "// --- UIタブ ---",
      "const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);\n  // --- UIタブ ---"
    );
  }

  // 3. Add Preset methods right before `return (`
  const methods = `
  const getCurrentPresetData = () => ({
    ${statesListStr}
  });

  const loadPresetData = (data: any) => {
    ${loadDataMapStr}
  };

  const handleSavePreset = () => {
    const name = window.prompt('保存するプリセット名を入力してください');
    if (name) {
      savePreset('${typeName}', name, getCurrentPresetData());
      alert('「' + name + '」を保存しました！');
    }
  };
`;

  if (!content.includes('handleSavePreset')) {
    content = content.replace(
      "  return (",
      methods + "\n  return ("
    );
  }

  // 4. Add buttons
  const buttonsStr = `
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleSavePreset} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>💾 保存</button>
          <button onClick={() => setIsPresetModalOpen(true)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>📂 呼出</button>
        </div>`;

  if (!content.includes('💾 保存')) {
    if (typeName === 'damedasu') {
      content = content.replace(
        "<h2>ダメダス（ダメージ計算）</h2>",
        "<h2>ダメダス（ダメージ計算）</h2>" + buttonsStr
      );
    } else {
      content = content.replace(
        "<h2>ツーパン（2パン計算）</h2>",
        "<h2>ツーパン（2パン計算）</h2>" + buttonsStr
      );
    }
  }
  
  // 5. Add Modal at the end
  const modalStr = `
      <PresetModal 
        isOpen={isPresetModalOpen} 
        onClose={() => setIsPresetModalOpen(false)} 
        type="${typeName}" 
        onLoad={loadPresetData} 
      />
    </div>`;
    
  if (!content.includes('<PresetModal')) {
    // Replace the very last closing div
    content = content.replace(/<\/div>\s*;\s*};\s*$/m, modalStr + "\n  );\n};\n");
  }

  fs.writeFileSync(file, content, 'utf8');
}


const damedasuStates = `resOpen,
    atkHoseiOpen,
    defHoseiOpen,
    atkMonsterName,
    atkPersonality,
    atkQuality,
    atkZokusei,
    atkZokuzen,
    atkKeitou,
    atkKougeki,
    atkKouma,
    atkKiyousa,
    atkBaikiText,
    atkKouryu,
    atkForce,
    isBousou,
    defMonsterName,
    defPersonality,
    defQuality,
    defZokuseiTai,
    defKeitouTai,
    defSyubi,
    defZantai,
    defJumon,
    defBreath,
    defSkalaText,
    defForce,
    remHPMode,
    skillZenPhys,
    skillTanPhys,
    skillZenJumon,
    skillTanJumon,
    atkStepFilter,
    defStepFilter,
    atkFinalStatus,
    defFinalStatus`;

const damedasuLoad = `if (data.resOpen !== undefined) setResOpen(data.resOpen);
    if (data.atkHoseiOpen !== undefined) setAtkHoseiOpen(data.atkHoseiOpen);
    if (data.defHoseiOpen !== undefined) setDefHoseiOpen(data.defHoseiOpen);
    if (data.atkMonsterName !== undefined) setAtkMonsterName(data.atkMonsterName);
    if (data.atkPersonality !== undefined) setAtkPersonality(data.atkPersonality);
    if (data.atkQuality !== undefined) setAtkQuality(data.atkQuality);
    if (data.atkZokusei !== undefined) setAtkZokusei(data.atkZokusei);
    if (data.atkZokuzen !== undefined) setAtkZokuzen(data.atkZokuzen);
    if (data.atkKeitou !== undefined) setAtkKeitou(data.atkKeitou);
    if (data.atkKougeki !== undefined) setAtkKougeki(data.atkKougeki);
    if (data.atkKouma !== undefined) setAtkKouma(data.atkKouma);
    if (data.atkKiyousa !== undefined) setAtkKiyousa(data.atkKiyousa);
    if (data.atkBaikiText !== undefined) setAtkBaikiText(data.atkBaikiText);
    if (data.atkKouryu !== undefined) setAtkKouryu(data.atkKouryu);
    if (data.atkForce !== undefined) setAtkForce(data.atkForce);
    if (data.isBousou !== undefined) setIsBousou(data.isBousou);
    if (data.defMonsterName !== undefined) setDefMonsterName(data.defMonsterName);
    if (data.defPersonality !== undefined) setDefPersonality(data.defPersonality);
    if (data.defQuality !== undefined) setDefQuality(data.defQuality);
    if (data.defZokuseiTai !== undefined) setDefZokuseiTai(data.defZokuseiTai);
    if (data.defKeitouTai !== undefined) setDefKeitouTai(data.defKeitouTai);
    if (data.defSyubi !== undefined) setDefSyubi(data.defSyubi);
    if (data.defZantai !== undefined) setDefZantai(data.defZantai);
    if (data.defJumon !== undefined) setDefJumon(data.defJumon);
    if (data.defBreath !== undefined) setDefBreath(data.defBreath);
    if (data.defSkalaText !== undefined) setDefSkalaText(data.defSkalaText);
    if (data.defForce !== undefined) setDefForce(data.defForce);
    if (data.remHPMode !== undefined) setRemHPMode(data.remHPMode);
    if (data.skillZenPhys !== undefined) setSkillZenPhys(data.skillZenPhys);
    if (data.skillTanPhys !== undefined) setSkillTanPhys(data.skillTanPhys);
    if (data.skillZenJumon !== undefined) setSkillZenJumon(data.skillZenJumon);
    if (data.skillTanJumon !== undefined) setSkillTanJumon(data.skillTanJumon);
    if (data.atkStepFilter !== undefined) setAtkStepFilter(data.atkStepFilter);
    if (data.defStepFilter !== undefined) setDefStepFilter(data.defStepFilter);
    if (data.atkFinalStatus !== undefined) setAtkFinalStatus(data.atkFinalStatus);
    if (data.defFinalStatus !== undefined) setDefFinalStatus(data.defFinalStatus);`;


const twopanStates = `atkAName,
    atkAPers,
    atkAQual,
    atkASkillType,
    atkASkillName,
    atkABaiki,
    atkAForce,
    atkAKougeki,
    atkAKouma,
    atkAKiyousa,
    atkAZokusei,
    atkAZokuzen,
    atkAKeitou,
    atkAKouryu,
    atkABousou,
    atkBName,
    atkBPers,
    atkBQual,
    atkBSkillType,
    atkBSkillName,
    atkBBaiki,
    atkBForce,
    atkBKougeki,
    atkBKouma,
    atkBKiyousa,
    atkBZokusei,
    atkBZokuzen,
    atkBKeitou,
    atkBKouryu,
    atkBBousou,
    defName,
    defPers,
    defQual,
    defSkalaText,
    defAdditionalHPText,
    defSyubi,
    defZokuseiTai,
    defKeitouTai,
    defZantai,
    defJumon,
    defBreath,
    atkAStepFilter,
    atkBStepFilter,
    defStepFilter,
    atkAStatus,
    atkBStatus,
    defStatus`;
    
const twopanLoad = `if (data.atkAName !== undefined) setAtkAName(data.atkAName);
    if (data.atkAPers !== undefined) setAtkAPers(data.atkAPers);
    if (data.atkAQual !== undefined) setAtkAQual(data.atkAQual);
    if (data.atkASkillType !== undefined) setAtkASkillType(data.atkASkillType);
    if (data.atkASkillName !== undefined) setAtkASkillName(data.atkASkillName);
    if (data.atkABaiki !== undefined) setAtkABaiki(data.atkABaiki);
    if (data.atkAForce !== undefined) setAtkAForce(data.atkAForce);
    if (data.atkAKougeki !== undefined) setAtkAKougeki(data.atkAKougeki);
    if (data.atkAKouma !== undefined) setAtkAKouma(data.atkAKouma);
    if (data.atkAKiyousa !== undefined) setAtkAKiyousa(data.atkAKiyousa);
    if (data.atkAZokusei !== undefined) setAtkAZokusei(data.atkAZokusei);
    if (data.atkAZokuzen !== undefined) setAtkAZokuzen(data.atkAZokuzen);
    if (data.atkAKeitou !== undefined) setAtkAKeitou(data.atkAKeitou);
    if (data.atkAKouryu !== undefined) setAtkAKouryu(data.atkAKouryu);
    if (data.atkABousou !== undefined) setAtkABousou(data.atkABousou);
    if (data.atkBName !== undefined) setAtkBName(data.atkBName);
    if (data.atkBPers !== undefined) setAtkBPers(data.atkBPers);
    if (data.atkBQual !== undefined) setAtkBQual(data.atkBQual);
    if (data.atkBSkillType !== undefined) setAtkBSkillType(data.atkBSkillType);
    if (data.atkBSkillName !== undefined) setAtkBSkillName(data.atkBSkillName);
    if (data.atkBBaiki !== undefined) setAtkBBaiki(data.atkBBaiki);
    if (data.atkBForce !== undefined) setAtkBForce(data.atkBForce);
    if (data.atkBKougeki !== undefined) setAtkBKougeki(data.atkBKougeki);
    if (data.atkBKouma !== undefined) setAtkBKouma(data.atkBKouma);
    if (data.atkBKiyousa !== undefined) setAtkBKiyousa(data.atkBKiyousa);
    if (data.atkBZokusei !== undefined) setAtkBZokusei(data.atkBZokusei);
    if (data.atkBZokuzen !== undefined) setAtkBZokuzen(data.atkBZokuzen);
    if (data.atkBKeitou !== undefined) setAtkBKeitou(data.atkBKeitou);
    if (data.atkBKouryu !== undefined) setAtkBKouryu(data.atkBKouryu);
    if (data.atkBBousou !== undefined) setAtkBBousou(data.atkBBousou);
    if (data.defName !== undefined) setDefName(data.defName);
    if (data.defPers !== undefined) setDefPers(data.defPers);
    if (data.defQual !== undefined) setDefQual(data.defQual);
    if (data.defSkalaText !== undefined) setDefSkalaText(data.defSkalaText);
    if (data.defAdditionalHPText !== undefined) setDefAdditionalHPText(data.defAdditionalHPText);
    if (data.defSyubi !== undefined) setDefSyubi(data.defSyubi);
    if (data.defZokuseiTai !== undefined) setDefZokuseiTai(data.defZokuseiTai);
    if (data.defKeitouTai !== undefined) setDefKeitouTai(data.defKeitouTai);
    if (data.defZantai !== undefined) setDefZantai(data.defZantai);
    if (data.defJumon !== undefined) setDefJumon(data.defJumon);
    if (data.defBreath !== undefined) setDefBreath(data.defBreath);
    if (data.atkAStepFilter !== undefined) setAtkAStepFilter(data.atkAStepFilter);
    if (data.atkBStepFilter !== undefined) setAtkBStepFilter(data.atkBStepFilter);
    if (data.defStepFilter !== undefined) setDefStepFilter(data.defStepFilter);
    if (data.atkAStatus !== undefined) setAtkAStatus(data.atkAStatus);
    if (data.atkBStatus !== undefined) setAtkBStatus(data.atkBStatus);
    if (data.defStatus !== undefined) setDefStatus(data.defStatus);`;

inject('src/components/Damedasu.tsx', 'damedasu', damedasuStates, damedasuLoad);
inject('src/components/TwoPan.tsx', 'twopan', twopanStates, twopanLoad);
console.log('injected presets!');
