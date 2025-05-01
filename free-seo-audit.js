import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { url } = JSON.parse(req.body);

  const psiRes = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`);
  const psiData = await psiRes.json();
  const speedScore = psiData.lighthouseResult?.categories?.performance?.score * 100 || 0;

  const htmlRes = await fetch(url);
  const html = await htmlRes.text();
  const $ = cheerio.load(html);

  const hasTitle = !!$('title').text();
  const hasDescription = !!$('meta[name="description"]').attr('content');
  const mobileFriendly = !!$('meta[name="viewport"]').length;

  res.status(200).json({ speedScore, hasTitle, hasDescription, mobileFriendly });
}
