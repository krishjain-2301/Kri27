import fs from 'fs';
import path from 'path';

const harPath = path.join(__dirname, '../../app.hackthebox.com.har');
const fixturesDir = path.join(__dirname, '../tests/fixtures');

if (!fs.existsSync(fixturesDir)) {
  fs.mkdirSync(fixturesDir, { recursive: true });
}

console.log(`Reading HAR from ${harPath}...`);
const harData = JSON.parse(fs.readFileSync(harPath, 'utf8'));

console.log(`Found ${harData.log.entries.length} entries. Searching for HTB API responses...`);

const targets = [
  { name: 'user-info', urlMatch: '/api/v4/user/info' },
  { name: 'machines', urlMatch: '/api/v4/user/profile/machine/owns' }, // guessing the pattern, will also log all /api/v4/user/profile
  { name: 'challenges', urlMatch: '/api/v4/user/profile/challenge/owns' },
  // Let's also just look for ANY URL containing 'owns' or 'machine' to find the real endpoints
];

const found = new Set();

for (const entry of harData.log.entries) {
  const url = entry.request.url;
  
  // Save matching endpoints explicitly
  for (const target of targets) {
    if (url.includes(target.urlMatch) && entry.response.content.text) {
      const outPath = path.join(fixturesDir, `${target.name}.json`);
      fs.writeFileSync(outPath, entry.response.content.text);
      console.log(`[SAVED] ${target.name} from ${url}`);
      found.add(target.name);
    }
  }

  // Broad search for anything else useful if the exact matches fail
  if (url.includes('/api/v4/user/profile') || url.includes('/machine/') || url.includes('/challenge/') || url.includes('owns')) {
      console.log(`[DISCOVERED] URL: ${url} (Status: ${entry.response.status})`);
      if (entry.response.content && entry.response.content.text && !url.includes('.js') && !url.includes('.css')) {
          const safeName = url.split('/api/v4/')[1]?.replace(/\//g, '_').split('?')[0];
          if (safeName) {
            const outPath = path.join(fixturesDir, `discovered_${safeName}.json`);
            if (!fs.existsSync(outPath)) { // don't overwrite if multiple
                fs.writeFileSync(outPath, entry.response.content.text);
            }
          }
      }
  }
}

console.log("Done extracting HAR.");
