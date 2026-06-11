const fs = require('fs');
let content = fs.readFileSync('src/components/Damedasu.tsx', 'utf8');
if (!content.includes('const [isPresetModalOpen')) {
  content = content.replace(
    "React.FC = () => {",
    "React.FC = () => {\n  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);"
  );
  fs.writeFileSync('src/components/Damedasu.tsx', content, 'utf8');
}
console.log('Fixed Damedasu.tsx');
