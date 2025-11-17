const fetch = require('node-fetch');

const API_URL = 'https://api.creatomate.com/v2/renders';
const API_KEY = '1d208624de2d4a95bd714e18781a23de6e21924e4275bed791b67f65396ba1cbc37ac6ba0267545dcb349cb7ef07771a';
const TEMPLATE_ID = '2e8f41dd-8125-4046-b326-8e5df550830a';

// Data for short #4 that failed
const short4Data = {
  music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=660",
  background1: "https://www.zedge.net/wallpapers/63a3f244-fbd9-4921-a654-b510fd778578",
  text1: "தேவசேனா, வல்லி என்பவர்களின் கணவர்.",
  background2: "https://www.freepik.com/free-photo/architecture-color-holy-beautiful-detail_1090369.htm",
  text2: "அறிவுக்கும் வலி கொடுக்கும் அறுமுகன் அருளே.",
  background3: "https://unsplash.com/photos/a-close-up-of-a-green-and-yellow-background-4vwv2cfpTg8",
  text3: "வெற்றி கொடிழைக்கும் முருகன் அருள் - Murugan's grace grants victory.",
  background4: "https://www.pexels.com/photo/golden-statue-at-batu-caves-in-kuala-lumpur-19912837/",
  text4: "கந்தா சக்தி படையா!"
};

const data = {
  template_id: TEMPLATE_ID,
  modifications: {
    "Music.source": short4Data.music,
    "Background-1.source": short4Data.background1,
    "Text-1.text": short4Data.text1,
    "Background-2.source": short4Data.background2,
    "Text-2.text": short4Data.text2,
    "Background-3.source": short4Data.background3,
    "Text-3.text": short4Data.text3,
    "Background-4.source": short4Data.background4,
    "Text-4.text": short4Data.text4
  }
};

console.log('Retrying Short #4...\n');

fetch(API_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(data => {
    console.log('✅ Short #4 created successfully!\n');
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('\n📹 Video URL:', data.url);
    console.log('📸 Snapshot URL:', data.snapshot_url);
  })
  .catch(error => {
    console.error('❌ Error creating short #4:', error);
  });

