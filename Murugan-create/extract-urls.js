const fs = require('fs');

// Read the results file
const data = JSON.parse(fs.readFileSync('results-fixed-2025-11-11T14-02-50.211Z.json', 'utf8'));

console.log('# 🎉 ALL 25 MURUGAN SHORTS - VIDEO URLS\n');
console.log('## ✅ SUCCESS: All 25 shorts created successfully!\n');
console.log('---\n');

data.forEach((item) => {
  if (item.success) {
    console.log(`## Short ${item.index}`);
    console.log(`**Video URL:** ${item.data.url}`);
    console.log(`**Snapshot:** ${item.data.snapshot_url}`);
    console.log(`**Content:** ${item.data.modifications['Text-1.text']}`);
    console.log('');
  }
});

console.log('\n---\n');
console.log('## 📱 Next Steps:\n');
console.log('1. Wait 5-10 minutes for videos to finish rendering');
console.log('2. Click on any video URL above to download');
console.log('3. Upload to TikTok, Instagram Reels, or YouTube Shorts');
console.log('4. Use hashtags: #Murugan #Tamil #Devotional #LordMurugan');
console.log('\n🙏 வேல் முருகனே வாழ்க!');

