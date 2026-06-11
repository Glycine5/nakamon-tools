const axios = require('axios');
const cheerio = require('cheerio');

async function test() {
  const url = 'https://9db.jp/dqwalk/data/11803';
  console.log(`Fetching ${url}...`);
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  
  const monsterData = {
    name: '',
    skills: [],
    traits: [],
    slots: []
  };

  // Get monster name from h1
  monsterData.name = $('h1').text().replace(/の評価.*/, '').trim();

  // Try to find the skills section
  // It usually has a table with "スキル"
  $('table').each((i, table) => {
    const text = $(table).text();
    if (text.includes('習得スキル') || text.includes('スキル名')) {
      $(table).find('tr').each((j, row) => {
        const cols = $(row).find('td, th');
        if (cols.length >= 2) {
          const skillName = $(cols[0]).text().trim();
          if (skillName && skillName !== 'スキル名' && skillName !== '習得スキル') {
             // Just capture text of the row for now to see structure
             monsterData.skills.push($(row).text().replace(/\s+/g, ' ').trim());
          }
        }
      });
    }

    if (text.includes('特殊効果')) {
      $(table).find('tr').each((j, row) => {
        const cols = $(row).find('td');
        if (cols.length >= 2) {
          monsterData.traits.push($(row).text().replace(/\s+/g, ' ').trim());
        }
      });
    }
  });

  console.log(JSON.stringify(monsterData, null, 2));
}

test().catch(console.error);
