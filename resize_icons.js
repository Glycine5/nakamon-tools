const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processIcons() {
  const input = path.join(__dirname, 'public', 'apple-touch-icon.png');
  
  // Create 180x180 for iOS (flatten to white to remove transparency just in case)
  await sharp(input)
    .resize(180, 180)
    .flatten({ background: '#ffffff' })
    .toFile(path.join(__dirname, 'public', 'apple-touch-icon-180.png'));

  // 192x192 for Android manifest
  await sharp(input)
    .resize(192, 192)
    .flatten({ background: '#ffffff' })
    .toFile(path.join(__dirname, 'public', 'icon-192.png'));

  // 512x512 for Android manifest
  await sharp(input)
    .resize(512, 512)
    .flatten({ background: '#ffffff' })
    .toFile(path.join(__dirname, 'public', 'icon-512.png'));

  // Overwrite the original just in case it's hardcoded somewhere
  fs.copyFileSync(path.join(__dirname, 'public', 'apple-touch-icon-180.png'), path.join(__dirname, 'public', 'apple-touch-icon.png'));
  console.log('Icons processed successfully.');
}

processIcons().catch(console.error);
