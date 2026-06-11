const axios = require('axios');
const cheerio = require('cheerio');

async function search(name) {
  const url = 'https://9db.jp/dqwalk/cdata/113?q=' + encodeURIComponent(name);
  console.log(`Searching: ${url}`);
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const items = [];
  $('.wiki_list_item').each((i, el) => {
    const a = $(el).find('a');
    items.push({ text: a.text().trim(), href: a.attr('href') });
  });
  console.log('Results:', items.slice(0, 5));
}

search('キラーマシン');
