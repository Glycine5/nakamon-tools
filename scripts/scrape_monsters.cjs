const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

async function run() {
  console.log('Loading 3431.json mapping...');
  const data = fs.readFileSync('3431.json', 'utf8');
  const start = data.indexOf('{');
  const end = data.lastIndexOf('}');
  const dqData = JSON.parse(data.substring(start, end + 1));
  const nakama = dqData.nakama;
  
  const nameToId = {};
  for (const id in nakama) {
    nameToId[nakama[id].name] = id;
  }
  
  const monstersFile = fs.readFileSync(path.join(__dirname, '../src/data/monsters.ts'), 'utf8');
  const nameMatches = monstersFile.match(/["']([^"']*?[ぁ-んァ-ヶ一-龠ー][^"']*?)["']/g);
  let appNames = nameMatches ? nameMatches.map(m => m.replace(/["']/g, '')) : [];
  appNames = [...new Set(appNames.map(n => n.replace(/\d+$/, '')))];
  
  console.log(`Found ${appNames.length} unique names in app.`);
  
  const results = {};
  const queue = [];
  
  for (let i = 0; i < appNames.length; i++) {
    const name = appNames[i];
    const id = nameToId[name];
    if (id) queue.push({ name, id });
  }
  
  const CONCURRENCY = 10;
  let completed = 0;
  
  async function worker(items) {
    for (const { name, id } of items) {
      try {
        const { data: html } = await axios.get(`https://9db.jp/dqwalk/data/${id}`);
        const $ = cheerio.load(html);
        
        const traits = [];
        const skills = [];
        const slots = [];
        
        $('h2, h3').each((j, el) => {
          const title = $(el).text();
          if (title.includes('特殊効果') || title.includes('特性')) {
            const table = $(el).nextAll('table').first();
            table.find('tr').each((k, tr) => {
              const text = $(tr).text().replace(/\s+/g, ' ').trim();
              if (text && !text.includes('名前')) traits.push(text);
            });
          }
          if (title.includes('習得スキル')) {
            const table = $(el).nextAll('table').first();
            table.find('tr').each((k, tr) => {
              const text = $(tr).text().replace(/\s+/g, ' ').trim();
              if (text && !text.includes('スキル名')) skills.push(text);
            });
          }
          if (title.includes('継承玉スロット')) {
            const table = $(el).nextAll('table').first();
            table.find('td, th').each((k, td) => {
               const style = $(td).attr('style') || '';
               let color = '不明';
               if (style.includes('#c00') || style.includes('red') || style.includes('img15609')) color = '赤';
               else if (style.includes('#0cc') || style.includes('cyan') || style.includes('img15610')) color = '水';
               else if (style.includes('#da0') || style.includes('orange') || style.includes('img15611')) color = '黄';
               else if (style.includes('#a3d') || style.includes('purple') || style.includes('img15612')) color = '紫';
               else if (style.includes('#0d0') || style.includes('green') || style.includes('img15613')) color = '緑';
               
               const text = $(td).text().trim();
               if (text && (text === '赤' || text === '水' || text === '黄' || text === '紫' || text === '緑')) {
                   color = text;
               }
               if (color !== '不明') slots.push(color);
            });
          }
        });
        
        if (traits.length === 0) {
           $('table').first().find('tr').each((j, tr) => {
              const text = $(tr).text().replace(/\s+/g, ' ').trim();
              if (text.includes('特性')) {
                 traits.push(text.replace('特性', '').trim());
              }
           });
        }
        
        results[name] = { skills, traits, slots };
      } catch (e) {
        console.log(`Error fetching ${name}: ${e.message}`);
      }
      completed++;
      console.log(`[${completed}/${queue.length}] Fetched ${name}`);
    }
  }
  
  const workers = [];
  const chunkSize = Math.ceil(queue.length / CONCURRENCY);
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker(queue.slice(i * chunkSize, (i + 1) * chunkSize)));
  }
  
  await Promise.all(workers);
  
  fs.writeFileSync(path.join(__dirname, '../src/data/monster_traits.json'), JSON.stringify(results, null, 2));
  
  let csv = '名前,習得スキル,特殊効果,継承玉スロット\n';
  for (const name in results) {
    const d = results[name];
    csv += `"${name}","${d.skills.join(' / ')}","${d.traits.join(' / ')}","${d.slots.join(', ')}"\n`;
  }
  fs.writeFileSync(path.join(__dirname, '../monster_traits.csv'), csv);
  
  console.log('Done! Wrote monster_traits.json and monster_traits.csv');
}

run().catch(console.error);
