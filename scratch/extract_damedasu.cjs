const fs = require('fs');

let content = fs.readFileSync('src/components/Damedasu.tsx', 'utf8');

// Find all useState definitions
const stateRegex = /const \[([a-zA-Z0-9_]+), set[a-zA-Z0-9_]+\] = useState/g;
let match;
const states = [];
while ((match = stateRegex.exec(content)) !== null) {
  states.push(match[1]);
}

// Remove things that are not settings (like UI state if any, e.g. atkOpen)
const exclude = ['atkOpen', 'defOpen', 'skillOpen', 'isPresetModalOpen'];
const saveStates = states.filter(s => !exclude.includes(s));

const getCurrentDataStr = `
  const getCurrentPresetData = () => ({
    ${saveStates.join(',\n    ')}
  });
`;

const loadDataStr = `
  const loadPresetData = (data: any) => {
    ${saveStates.map(s => `if (data.${s} !== undefined) set${s.charAt(0).toUpperCase() + s.slice(1)}(data.${s});`).join('\n    ')}
  };

  const handleSavePreset = () => {
    const name = window.prompt('保存するプリセット名を入力してください');
    if (name) {
      savePreset('damedasu', name, getCurrentPresetData());
      alert('「' + name + '」を保存しました！');
    }
  };
`;

console.log(getCurrentDataStr);
console.log(loadDataStr);
