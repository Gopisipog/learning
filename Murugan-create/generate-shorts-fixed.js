const fetch = require('node-fetch');
const fs = require('fs');

const API_URL = 'https://api.creatomate.com/v2/renders';
const API_KEY = '1d208624de2d4a95bd714e18781a23de6e21924e4275bed791b67f65396ba1cbc37ac6ba0267545dcb349cb7ef07771a';
const TEMPLATE_ID = '2e8f41dd-8125-4046-b326-8e5df550830a';

// Fixed data with working Unsplash direct image URLs
// Using Unsplash Source API which provides random images based on keywords
const shortsData = [
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k",
    background1: "https://source.unsplash.com/1080x1920/?hindu,temple,statue,1",
    text1: "முருகன் தமிழர்களுக்காக நல்ல வழிகாட்டி.",
    background2: "https://source.unsplash.com/1080x1920/?indian,festival,colorful,1",
    text2: "Index,Teaching (Tamil)",
    background3: "https://source.unsplash.com/1080x1920/?peacock,feather,colorful,1",
    text3: "Index,பளமொழி (தமிழில்),English Meaning",
    background4: "https://source.unsplash.com/1080x1920/?temple,golden,architecture,1",
    text4: "முருகா அருள்புரிவாய்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=293",
    background1: "https://source.unsplash.com/1080x1920/?hindu,deity,colorful,2",
    text1: "அறுமுகன் என்று அழைக்கப்படுகிறார்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,culture,festival,2",
    text2: "அன்பும் அருளும் பெற வழிகாட்டி முருகன் வாழ்க.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,bird,beautiful,2",
    text3: "வேல் மணி ஒலி போல் புகழ் கூறு - Spread fame like the ringing of the Vel (Murugan's spear).",
    background4: "https://source.unsplash.com/1080x1920/?temple,statue,golden,2",
    text4: "வேல் முருகன் வழிப்போ!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=468",
    background1: "https://source.unsplash.com/1080x1920/?hindu,temple,architecture,3",
    text1: "வேல் அணியும் வீர தேவன்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,temple,colorful,3",
    text2: "சூரியன் போல ஒளியும் சக்தியும் தரும் முருகன்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,feather,green,3",
    text3: "மயிலுற்ற நாணல் போல மென்மை - Gentle as the Mayil (peacock) feather.",
    background4: "https://source.unsplash.com/1080x1920/?temple,cave,statue,3",
    text4: "ஓம் சரவணபவா!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=660",
    background1: "https://source.unsplash.com/1080x1920/?hindu,deity,statue,4",
    text1: "தேவசேனா, வல்லி என்பவர்களின் கணவர்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,architecture,temple,4",
    text2: "அறிவுக்கும் வலி கொடுக்கும் அறுமுகன் அருளே.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,colorful,pattern,4",
    text3: "வெற்றி கொடிழைக்கும் முருகன் அருள் - Murugan's grace grants victory.",
    background4: "https://source.unsplash.com/1080x1920/?temple,golden,statue,4",
    text4: "கந்தா சக்தி படையா!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=842",
    background1: "https://source.unsplash.com/1080x1920/?hindu,temple,colorful,5",
    text1: "சிவபெருமானின் இரண்டாவது மகன்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,festival,celebration,5",
    text2: "எல்லா தோல்விகளும் வெற்றியாகும் முருக பக்தியில்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,feather,blue,5",
    text3: "முழு சந்திரனை போன்ற முகம் - Face as bright as the full moon.",
    background4: "https://source.unsplash.com/1080x1920/?temple,architecture,golden,5",
    text4: "அறுமுகன் அருள்தருவாய்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=1132",
    background1: "https://source.unsplash.com/1080x1920/?hindu,deity,colorful,6",
    text1: "அன்பு, சக்தி, அறிவு தருபவர்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,temple,statue,6",
    text2: "முருகனிடம் பூஜை செய்தால் பயம் அகலும்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,bird,colorful,6",
    text3: "வானில் வண்ண மயில் போல வாழ்க்கை - Life colorful as the peacock in the sky.",
    background4: "https://source.unsplash.com/1080x1920/?temple,cave,architecture,6",
    text4: "முருகனின் வீர வாக்கு!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=1335",
    background1: "https://source.unsplash.com/1080x1920/?hindu,temple,architecture,7",
    text1: "சரவண பவனாக பிறந்தவர்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,culture,colorful,7",
    text2: "கடினமான பாதைக்கு திசைகாட்டும் முருகன்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,feather,pattern,7",
    text3: "சிவ சிவ எனும் சிறகுடன் மயில் - Peacock with wings that chant 'Siva Siva.'",
    background4: "https://source.unsplash.com/1080x1920/?temple,golden,statue,7",
    text4: "முருகா காப்பாய்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=1511",
    background1: "https://source.unsplash.com/1080x1920/?hindu,deity,statue,8",
    text1: "தகப்பனார் சிவன், தாயார் பார்வதி.",
    background2: "https://source.unsplash.com/1080x1920/?indian,festival,temple,8",
    text2: "ஒன்று பாடும் மனதில் ஒளிரும் முருகன் கருணை.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,colorful,beautiful,8",
    text3: "வேல் கொடு வெற்றி பெறும் - One wins with the spear (Murugan's blessing).",
    background4: "https://source.unsplash.com/1080x1920/?temple,architecture,golden,8",
    text4: "திருச்செந்தூர் சுவாமியே புகழோம்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=1696",
    background1: "https://source.unsplash.com/1080x1920/?hindu,temple,colorful,9",
    text1: "பழனி, திருச்செந்தூர், சுவாமிமலை, திருத்தணி, கிழ்கிறி, திருப்பருங்குன்றம் என ஆறு படைவீடுகள் கலந்தவர்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,culture,festival,9",
    text2: "பின்னால் வென்றோர் முன்னால் முருக பக்தர்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,feather,green,9",
    text3: "சரவணபவனின் கருணை வடி - Murugan's compassion is a staff of support.",
    background4: "https://source.unsplash.com/1080x1920/?temple,statue,golden,9",
    text4: "மலைவாசன் வாழ்க!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=2030",
    background1: "https://source.unsplash.com/1080x1920/?hindu,deity,colorful,10",
    text1: "பகை விரோதங்களை நீக்கும் தேவன்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,temple,architecture,10",
    text2: "தாய், தந்தை இருவரின் அருள் போல முருகன்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,bird,beautiful,10",
    text3: "பால் தேன் சொம்பு குறைவு அற - Like an undiminished pot of milk and honey.",
    background4: "https://source.unsplash.com/1080x1920/?temple,cave,statue,10",
    text4: "முருகட்சி மகிழ்ச்சி!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=2130",
    background1: "https://source.unsplash.com/1080x1920/?hindu,temple,statue,11",
    text1: "முருக பக்தர்களுக்கு ஆசைகள் வழங்குபவர்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,festival,colorful,11",
    text2: "வாழ்க்கை நோக்கில் வழிகாட்டும் முருகன் வாக்கு.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,feather,colorful,11",
    text3: "முருகன் புண்ணியத்தில் பகை இல்லை - No enmity where Murugan's blessings are present.",
    background4: "https://source.unsplash.com/1080x1920/?temple,golden,architecture,11",
    text4: "வேல் முருகனே வாழ்க!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=2315",
    background1: "https://source.unsplash.com/1080x1920/?hindu,deity,colorful,12",
    text1: "வேல் முனை தீஞ்சொல் காத்தப் பொருள்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,temple,statue,12",
    text2: "நீதியும், நலமும் தரும் செவ்வாய் முருகன்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,bird,colorful,12",
    text3: "அருணகிரியின் அருள் பார்வை - The gracious look of Arunagiri.",
    background4: "https://source.unsplash.com/1080x1920/?temple,cave,golden,12",
    text4: "திருப்பரங்குன்றம் தேவே!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=2539",
    background1: "https://source.unsplash.com/1080x1920/?hindu,temple,architecture,13",
    text1: "கந்த சஷ்டி கவசம் அவருக்கு அர்ப்பணம்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,festival,colorful,13",
    text2: "ஈருள் அகற்றும் ஒளிமயமான முருகன் உருவம்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,feather,pattern,13",
    text3: "மயில் வாகன மைந்தன் மகிழ்ச்சி - Joy from the son on the peacock mount.",
    background4: "https://source.unsplash.com/1080x1920/?temple,statue,golden,13",
    text4: "அறுமுகனை புகழ்வோம்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=2737",
    background1: "https://source.unsplash.com/1080x1920/?hindu,deity,statue,14",
    text1: "சிகப்பு மலர்கள் உகந்த பூ.",
    background2: "https://source.unsplash.com/1080x1920/?indian,temple,colorful,14",
    text2: "எமைகளையும் நடாத்தும் இந்திரன் மேல் வைத்தான் முருகன்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,colorful,beautiful,14",
    text3: "முத்தமிழின் முதல்வன் பெருமை - Greatness of the Lord of Tamil.",
    background4: "https://source.unsplash.com/1080x1920/?temple,architecture,golden,14",
    text4: "முருகனின் பக்தி வாழ்க!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=2942",
    background1: "https://source.unsplash.com/1080x1920/?hindu,temple,colorful,15",
    text1: "மயில் வாகனமாக வளரும் தேவன்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,culture,festival,15",
    text2: "மன அமைதிக்கு மருந்து வள்ளி தேவசேனா பெண் முருகன்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,feather,green,15",
    text3: "பழனி மலை மீது நம்பிக்கை - Faith on the hill of Palani.",
    background4: "https://source.unsplash.com/1080x1920/?temple,cave,statue,15",
    text4: "முருகனே வழிகாட்டும்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=3224",
    background1: "https://source.unsplash.com/1080x1920/?hindu,deity,colorful,16",
    text1: "வெற்றிக்குறியாகவே வாழ்ந்து வரும் முருகன்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,temple,statue,16",
    text2: "நம்பிக்கை கொண்டவர் நய்யாண்டான் முருக பக்தன்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,bird,colorful,16",
    text3: "வேல் போல நேர்மை - Straight as the Vel (spear-like honesty).",
    background4: "https://source.unsplash.com/1080x1920/?temple,golden,architecture,16",
    text4: "முருகன் துணை!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=3491",
    background1: "https://source.unsplash.com/1080x1920/?hindu,temple,architecture,17",
    text1: "வசிவின் உருவாக சுவாமிமலை.",
    background2: "https://source.unsplash.com/1080x1920/?indian,festival,colorful,17",
    text2: "அழைக்கும் பேரில் ஆதரவு தரும் அழகன் முருகன்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,feather,pattern,17",
    text3: "அஞ்சாமல் ஆனந்தம் கொண்டவன் - He who takes joy without fear.",
    background4: "https://source.unsplash.com/1080x1920/?temple,statue,golden,17",
    text4: "சரவணபவா மீண்டும் வருக!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=3694",
    background1: "https://source.unsplash.com/1080x1920/?hindu,deity,statue,18",
    text1: "சிறுவனாகவே பெரும் ஜெயம் பெற்றவர்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,temple,colorful,18",
    text2: "கீதையின் கருத்து முருக வழிபாடு.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,colorful,beautiful,18",
    text3: "சித்தியின் சூழ்ச்சி முருகன் அருள் - Achievement through Murugan's grace.",
    background4: "https://source.unsplash.com/1080x1920/?temple,cave,golden,18",
    text4: "வேல் உழுக்கம்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=3891",
    background1: "https://source.unsplash.com/1080x1920/?hindu,temple,colorful,19",
    text1: "குட்டான கந்தர் அற்புதம் செய்வார்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,culture,festival,19",
    text2: "நியாயமான ஆசைகளை நிறைவேற்றும் முருகன்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,feather,blue,19",
    text3: "ஐயப்பன் உறவு முருகன் அன்பு - Aiyappan's kinship, Murugan's love.",
    background4: "https://source.unsplash.com/1080x1920/?temple,architecture,golden,19",
    text4: "முருகா என்றால் பலம்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=5367",
    background1: "https://source.unsplash.com/1080x1920/?hindu,deity,colorful,20",
    text1: "சங்கஇலக்கியங்களில் குறிப்பிடப்பட்டவர்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,temple,statue,20",
    text2: "ஆன்மிக வாழ்விற்கு ஆதாரம் முருகன் வரம்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,bird,colorful,20",
    text3: "பசுமை கொண்டு பரவி வாழ் - Spread life with greenery.",
    background4: "https://source.unsplash.com/1080x1920/?temple,golden,statue,20",
    text4: "குகனே காப்பாயாக!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=5565",
    background1: "https://source.unsplash.com/1080x1920/?hindu,temple,architecture,21",
    text1: "அறிவுக் கடவுள் என போற்றப்படுபவர்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,festival,colorful,21",
    text2: "அன்பை வளர்க்கும் ஆரோக்கிய வாழ்வில் முருகன் துணை.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,feather,pattern,21",
    text3: "கந்தன் கையில் கொண்டு செற்றி மாற்று - Muruga in hand, banish obstacles.",
    background4: "https://source.unsplash.com/1080x1920/?temple,cave,golden,21",
    text4: "முருகா அருள் வாக்கு!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=5834",
    background1: "https://source.unsplash.com/1080x1920/?hindu,deity,statue,22",
    text1: "அவன் அருள் பெற வழிபடும் சமூகங்கள் அதிகம்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,temple,colorful,22",
    text2: "வாழ்க்கை போராட்டத்தில் வெற்றி பெற முருக வழி.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,colorful,beautiful,22",
    text3: "பாலும் தேனும் போல கூட்டமை - United as milk and honey.",
    background4: "https://source.unsplash.com/1080x1920/?temple,architecture,golden,22",
    text4: "வேல் வெற்றி முருகனுக்கு!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=6016",
    background1: "https://source.unsplash.com/1080x1920/?hindu,temple,colorful,23",
    text1: "பெரும்பாலான தமிழர்கள் முருகனுக்கு விருப்பமானவர்கள்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,culture,festival,23",
    text2: "கேள்விக்கு விடை தரும் முருக குரல்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,feather,green,23",
    text3: "சொல்லபோக முருகன் பெருமை - The greatness of Murugan is beyond words.",
    background4: "https://source.unsplash.com/1080x1920/?temple,statue,golden,23",
    text4: "திருத்தணி முருகா பார்வை!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=6220",
    background1: "https://source.unsplash.com/1080x1920/?hindu,deity,colorful,24",
    text1: "முருகன் துதிகளுக்கு தனியிடம் உண்டு.",
    background2: "https://source.unsplash.com/1080x1920/?indian,temple,statue,24",
    text2: "அனுபவத்திலும் அனுபூதியிலும் முருகன் அற்புதம்.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,bird,colorful,24",
    text3: "தொண்டையில் தரிசனம் சுவையே - Divine taste in chanting his name.",
    background4: "https://source.unsplash.com/1080x1920/?temple,cave,golden,24",
    text4: "முருகா உளரென்று ஓங்கு!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=6416",
    background1: "https://source.unsplash.com/1080x1920/?hindu,temple,architecture,25",
    text1: "கவசங்களை கூறி பாராட்டு பெறுபவர்.",
    background2: "https://source.unsplash.com/1080x1920/?indian,festival,colorful,25",
    text2: "அறத்தை வளர்க்கும் அறுமுகன் போதனை.",
    background3: "https://source.unsplash.com/1080x1920/?peacock,feather,pattern,25",
    text3: "மூன்றுமுக சாவடி முதல்வன் - Lord of the three frontiers.",
    background4: "https://source.unsplash.com/1080x1920/?temple,golden,statue,25",
    text4: "பழநி அண்டவர் வாழ்க!"
  }
];

// Function to create a single render
async function createRender(shortData, index) {
  const data = {
    template_id: TEMPLATE_ID,
    modifications: {
      "Music.source": shortData.music,
      "Background-1.source": shortData.background1,
      "Text-1.text": shortData.text1,
      "Background-2.source": shortData.background2,
      "Text-2.text": shortData.text2,
      "Background-3.source": shortData.background3,
      "Text-3.text": shortData.text3,
      "Background-4.source": shortData.background4,
      "Text-4.text": shortData.text4
    }
  };

  try {
    console.log(`Creating short ${index + 1}/25...`);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (result.error || result.code) {
      console.error(`❌ Short ${index + 1} failed:`, result.message || result.error);
      return { index: index + 1, success: false, error: result.message || result.error };
    }
    
    console.log(`✅ Short ${index + 1} created successfully!`);
    return { index: index + 1, success: true, data: result };
  } catch (error) {
    console.error(`❌ Error creating short ${index + 1}:`, error.message);
    return { index: index + 1, success: false, error: error.message };
  }
}

// Main function to create all shorts
async function createAllShorts() {
  console.log('🎬 Starting to create 25 Murugan shorts with FIXED image URLs...\n');
  console.log('📸 Using Unsplash Source for direct image URLs\n');
  const results = [];

  // Create shorts sequentially to avoid rate limiting
  for (let i = 0; i < shortsData.length; i++) {
    const result = await createRender(shortsData[i], i);
    results.push(result);
    
    // Add a small delay between requests to avoid rate limiting
    if (i < shortsData.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    }
  }

  // Save results to file
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `results-fixed-${timestamp}.json`;
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  
  console.log(`\n✅ All shorts processed! Results saved to ${filename}`);
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`\n📊 Summary: ${successful} successful, ${failed} failed`);
  
  if (successful > 0) {
    console.log('\n🎉 Success! Your videos are being rendered.');
    console.log('⏳ Wait 5-10 minutes, then check the video URLs in the results file.');
  }
  
  if (failed > 0) {
    console.log(`\n⚠️  ${failed} shorts failed. Check the results file for details.`);
  }
}

// Run the script
createAllShorts();

