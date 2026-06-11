const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processIcons() {
  const input = path.join(__dirname, 'public', 'apple-touch-icon.png');
  
  await sharp(input)
    .resize(180, 180)
    .flatten({ background: '#ffffff' })
    .toFile(path.join(__dirname, 'public', 'apple-touch-icon-180.png'));

  await sharp(input)
    .resize(192, 192)
    .flatten({ background: '#ffffff' })
    .toFile(path.join(__dirname, 'public', 'icon-192.png'));

  await sharp(input)
    .resize(512, 512)
    .flatten({ background: '#ffffff' })
    .toFile(path.join(__dirname, 'public', 'icon-512.png'));

  fs.copyFileSync(path.join(__dirname, 'public', 'apple-touch-icon-180.png'), path.join(__dirname, 'public', 'apple-touch-icon.png'));
  console.log('Icons processed successfully.');
}

processIcons().catch(console.error);
