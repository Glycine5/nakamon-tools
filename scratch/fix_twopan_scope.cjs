const fs = require('fs');

let content = fs.readFileSync('src/components/TwoPan.tsx', 'utf8');

// The block to extract starts with 'const getCurrentPresetData = () => ({'
// and ends with '  };\n\n  const handleSavePreset = () => {\n    const name = window.prompt(\'保存するプリセット名を入力してください\');\n    if (name) {\n      savePreset(\'twopan\', name, getCurrentPresetData());\n      alert(\'「\' + name + \'」を保存しました！\');\n    }\n  };\n'
// Let's use string operations

const startIdx = content.indexOf('  const getCurrentPresetData = () => ({');
const endMarker = '  };\n\n  return (val === \'physical_zen\' || val === \'physical_tan\' || val === \'spell_zen\' || val === \'spell_tan\') ? val : \'physical_tan\';';
const justBeforeEndMarker = '  };\n\n';

if (startIdx !== -1) {
  // Find the exact block
  const block = content.substring(startIdx, content.indexOf(endMarker));
  
  // Remove it from the current position
  content = content.replace(block, '');
  
  // Find the final return (
  const lastReturnIdx = content.lastIndexOf('  return (\n    <div className="fade-in">');
  if (lastReturnIdx !== -1) {
    // Insert it before the last return (
    content = content.slice(0, lastReturnIdx) + block + '\n' + content.slice(lastReturnIdx);
  }
}

if (!content.includes('const [isPresetModalOpen')) {
  content = content.replace(
    "React.FC = () => {",
    "React.FC = () => {\n  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);"
  );
}

fs.writeFileSync('src/components/TwoPan.tsx', content, 'utf8');
console.log('Fixed TwoPan.tsx');
