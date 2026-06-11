const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('C:/Users/MN/.gemini/antigravity-ide/brain/70598b31-3bd4-423e-9b2f-a5ae20b6258d/.system_generated/steps/598/content.md', 'utf8');
const $ = cheerio.load(html);

const links = [];
$('td').each((i, td) => {
  const a = $(td).find('a').first();
  if (a.length > 0) {
    const href = a.attr('href');
    if (href && href.startsWith('data/')) {
      const name = $(td).text().trim();
      links.push({ name, href });
    }
  }
});

console.log('Found links:', links.length);
console.log(links.find(l => l.name.includes('ジャミラス')));
