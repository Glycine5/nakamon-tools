const fs = require('fs'); 
const html = fs.readFileSync('C:/Users/MN/.gemini/antigravity-ide/brain/70598b31-3bd4-423e-9b2f-a5ae20b6258d/.system_generated/steps/616/content.md', 'utf8'); 
const cheerio = require('cheerio'); 
const $ = cheerio.load(html); 

$('table').each((i, table) => { 
  const text = $(table).text().replace(/\s+/g, ' ').substring(0, 100); 
  console.log('Table ' + i + ': ' + text); 
});
