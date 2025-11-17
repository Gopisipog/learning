const fetch = require('node-fetch');
const fs = require('fs');

const API_URL = 'https://api.creatomate.com/v2/renders';
const API_KEY = '1d208624de2d4a95bd714e18781a23de6e21924e4275bed791b67f65396ba1cbc37ac6ba0267545dcb349cb7ef07771a';
const TEMPLATE_ID = '2e8f41dd-8125-4046-b326-8e5df550830a';

// Data for 25 shorts
const shortsData = [
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k",
    background1: "https://www.zedge.net/wallpapers/2800500f-bd31-4381-bd04-285364680b2f",
    text1: "முருகன் தமிழர்களுக்காக நல்ல வழிகாட்டி.",
    background2: "https://www.freepik.com/free-vector/hand-drawn-thaipusam-festival_11105481.htm",
    text2: "Index,Teaching (Tamil)",
    background3: "https://unsplash.com/photos/a-large-statue-of-a-man-holding-a-staff-gcQkighWofc",
    text3: "Index,பளமொழி (தமிழில்),English Meaning",
    background4: "https://www.pexels.com/photo/gold-statue-near-green-trees-3731615/",
    text4: "முருகா அருள்புரிவாய்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=293",
    background1: "https://www.zedge.net/wallpapers/544cb03c-8ea6-4c26-806f-aa8a68685051",
    text1: "அறுமுகன் என்று அழைக்கப்படுகிறார்.",
    background2: "https://www.freepik.com/free-vector/lord-krishna-janmashtami-religious-holiday-card-background_52770259.htm",
    text2: "அன்பும் அருளும் பெற வழிகாட்டி முருகன் வாழ்க.",
    background3: "https://unsplash.com/photos/a-close-up-of-a-peacock-feather-on-a-stick-0uM_JT2JviY",
    text3: "வேல் மணி ஒலி போல் புகழ் கூறு - Spread fame like the ringing of the Vel (Murugan's spear).",
    background4: "https://www.pexels.com/photo/gold-statue-near-green-trees-3731615/",
    text4: "வேல் முருகன் வழிப்போ!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=468",
    background1: "https://www.zedge.net/wallpapers/fb96a203-d475-4331-b111-cb6c3f1c26b6",
    text1: "வேல் அணியும் வீர தேவன்.",
    background2: "https://www.freepik.com/free-photo/golden-statue-batu-caves-kuala-lumpur_10998016.htm",
    text2: "சூரியன் போல ஒளியும் சக்தியும் தரும் முருகன்.",
    background3: "https://unsplash.com/photos/a-large-statue-of-a-man-holding-a-spear-in-front-of-a-crowd-of-people-uRyQsEV5FdI",
    text3: "மயிலுற்ற நாணல் போல மென்மை - Gentle as the Mayil (peacock) feather.",
    background4: "https://www.pexels.com/photo/batu-caves-with-murugan-statue-and-tourists-walking-on-square-4456089/",
    text4: "ஓம் சரவணபவா!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=660",
    background1: "https://www.zedge.net/wallpapers/63a3f244-fbd9-4921-a654-b510fd778578",
    text1: "தேவசேனா, வல்லி என்பவர்களின் கணவர்.",
    background2: "https://www.freepik.com/free-photo/architecture-color-holy-beautiful-detail_1090369.htm",
    text2: "அறிவுக்கும் வலி கொடுக்கும் அறுமுகன் அருளே.",
    background3: "https://unsplash.com/photos/a-close-up-of-a-green-and-yellow-background-4vwv2cfpTg8",
    text3: "வெற்றி கொடிழைக்கும் முருகன் அருள் - Murugan's grace grants victory.",
    background4: "https://www.pexels.com/photo/golden-statue-at-batu-caves-in-kuala-lumpur-19912837/",
    text4: "கந்தா சக்தி படையா!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=842",
    background1: "https://www.zedge.net/wallpapers/04a71d8a-94ff-4f37-ba21-30fe12c04bc7",
    text1: "சிவபெருமானின் இரண்டாவது மகன்.",
    background2: "https://www.freepik.com/free-photo/building-with-statues-everywhere_1014119.htm",
    text2: "எல்லா தோல்விகளும் வெற்றியாகும் முருக பக்தியில்.",
    background3: "https://unsplash.com/photos/a-group-of-people-standing-around-a-pile-of-coconuts-ODdMflkCtaQ",
    text3: "முழு சந்திரனை போன்ற முகம் - Face as bright as the full moon.",
    background4: "https://www.pexels.com/photo/majestic-murugan-statue-at-batu-caves-28777658/",
    text4: "அறுமுகன் அருள்தருவாய்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=1132",
    background1: "https://www.zedge.net/wallpapers/99eb7fc8-4466-48cc-9f4d-5f6755ef1947",
    text1: "அன்பு, சக்தி, அறிவு தருபவர்.",
    background2: "https://www.freepik.com/free-photo/statue-woman-blue_1014082.htm",
    text2: "முருகனிடம் பூஜை செய்தால் பயம் அகலும்.",
    background3: "https://unsplash.com/photos/a-statue-of-a-person-with-batu-caves-in-the-background-8hUCS0j5mIA",
    text3: "வானில் வண்ண மயில் போல வாழ்க்கை - Life colorful as the peacock in the sky.",
    background4: "https://www.pexels.com/photo/lord-murugan-statue-by-batu-caves-in-malaysia-19219498/",
    text4: "முருகனின் வீர வாக்கு!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=1335",
    background1: "https://www.zedge.net/wallpapers/161ad23f-3f25-4cd3-90a6-a2544c4325a2",
    text1: "சரவண பவனாக பிறந்தவர்.",
    background2: "https://www.freepik.com/free-vector/happy-hanuman-jayanti-indian-festival-religious-greeting-card_416919673.htm",
    text2: "கடினமான பாதைக்கு திசைகாட்டும் முருகன்.",
    background3: "https://unsplash.com/photos/shallow-focus-photo-of-hindu-god-statue-9OKjbCqn0io",
    text3: "சிவ சிவ எனும் சிறகுடன் மயில் - Peacock with wings that chant 'Siva Siva.'",
    background4: "https://www.pexels.com/photo/colorful-street-art-in-varanasi-alleyway-31445045/",
    text4: "முருகா காப்பாய்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=1511",
    background1: "https://www.zedge.net/wallpapers/c171cfbb-aa2a-41b1-9759-b36176c76d64",
    text1: "தகப்பனார் சிவன், தாயார் பார்வதி.",
    background2: "https://www.freepik.com/free-vector/hand-painted-watercolor-onam-illustration_15592825.htm",
    text2: "ஒன்று பாடும் மனதில் ஒளிரும் முருகன் கருணை.",
    background3: "https://unsplash.com/photos/background-pattern-dre6pxfkvW8",
    text3: "வேல் கொடு வெற்றி பெறும் - One wins with the spear (Murugan's blessing).",
    background4: "https://www.pexels.com/photo/gold-buddha-statue-near-green-mountain-3758430/",
    text4: "திருச்செந்தூர் சுவாமியே புகழோம்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=1696",
    background1: "https://www.zedge.net/wallpapers/f61caa22-20d5-404e-bff4-dbbdfc6d333d",
    text1: "பழனி, திருச்செந்தூர், சுவாமிமலை, திருத்தணி, கிழ்கிறி, திருப்பருங்குன்றம் என ஆறு படைவீடுகள் கலந்தவர்.",
    background2: "https://www.freepik.com/free-vector/happy-janmashtami-festival-peacock-feather-banner-design_9504839.htm",
    text2: "பின்னால் வென்றோர் முன்னால் முருக பக்தர்.",
    background3: "https://unsplash.com/photos/person-walking-on-brown-staircase-P1RU7VKcfxA",
    text3: "சரவணபவனின் கருணை வடி - Murugan's compassion is a staff of support.",
    background4: "https://www.pexels.com/photo/gold-statue-of-a-man-6026884/",
    text4: "மலைவாசன் வாழ்க!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=2030",
    background1: "https://www.zedge.net/wallpapers/2a6242d3-17f0-49e7-9112-d20e96009273",
    text1: "பகை விரோதங்களை நீக்கும் தேவன்.",
    background2: "https://www.freepik.com/free-vector/hnad-draw-indian-festival-janmashtami-celebration-card-artistic-background_30137805.htm",
    text2: "தாய், தந்தை இருவரின் அருள் போல முருகன்.",
    background3: "https://unsplash.com/photos/buddha-statue-beside-trees-at-daytime-1oRvra6SUtU",
    text3: "பால் தேன் சொம்பு குறைவு அற - Like an undiminished pot of milk and honey.",
    background4: "https://www.pexels.com/photo/statue-at-batu-caves-in-gombak-26967351/",
    text4: "முருகட்சி மகிழ்ச்சி!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=2130",
    background1: "https://www.zedge.net/wallpapers/86c018dc-32df-48b3-bae1-ab8b32c83bb6",
    text1: "முருக பக்தர்களுக்கு ஆசைகள் வழங்குபவர்.",
    background2: "https://www.freepik.com/free-vector/happy-janmashtami-peacock-feather-beautiful-background_5251563.htm",
    text2: "வாழ்க்கை நோக்கில் வழிகாட்டும் முருகன் வாக்கு.",
    background3: "https://unsplash.com/photos/buddha-figurine-tGmHDoAwbis",
    text3: "முருகன் புண்ணியத்தில் பகை இல்லை - No enmity where Murugan's blessings are present.",
    background4: "https://www.pexels.com/photo/golden-statue-at-batu-caves-malaysia-31403934/",
    text4: "வேல் முருகனே வாழ்க!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=2315",
    background1: "https://www.zedge.net/wallpapers/b350d35c-e1d2-46df-a00d-3d71957c1310",
    text1: "வேல் முனை தீஞ்சொல் காத்தப் பொருள்.",
    background2: "https://www.freepik.com/free-vector/indian-hindu-festival-janmashtami-celebration-card-background_30137779.htm",
    text2: "நீதியும், நலமும் தரும் செவ்வாய் முருகன்.",
    background3: "https://unsplash.com/photos/a-large-golden-statue-of-a-man-holding-a-staff-JoaitWLMuPU",
    text3: "அருணகிரியின் அருள் பார்வை - The gracious look of Arunagiri.",
    background4: "https://www.pexels.com/photo/golden-statue-in-batu-caves-malaysia-9908248/",
    text4: "திருப்பரங்குன்றம் தேவே!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=2539",
    background1: "https://www.zedge.net/wallpapers/5f3a66a7-eb2c-47d4-b82d-6829b28395cc",
    text1: "கந்த சஷ்டி கவசம் அவருக்கு அர்ப்பணம்.",
    background2: "https://www.freepik.com/free-vector/happy-janmashtami-indian-festival-celebration-background_57152082.htm",
    text2: "ஈருள் அகற்றும் ஒளிமயமான முருகன் உருவம்.",
    background3: "https://unsplash.com/photos/a-statue-of-a-hindu-god-surrounded-by-flowers-3CHAdVgIjaw",
    text3: "மயில் வாகன மைந்தன் மகிழ்ச்சி - Joy from the son on the peacock mount.",
    background4: "https://www.pexels.com/photo/lord-murugan-sculpture-by-a-rocky-mountain-and-climbing-tourists-19442942/",
    text4: "அறுமுகனை புகழ்வோம்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=2737",
    background1: "https://www.zedge.net/wallpapers/bd5ff6ee-11b9-4fbd-90ef-358abf654cab",
    text1: "சிகப்பு மலர்கள் உகந்த பூ.",
    background2: "https://www.freepik.com/free-vector/colorful-religious-krishna-janmashtami-card_9558831.htm",
    text2: "எமைகளையும் நடாத்தும் இந்திரன் மேல் வைத்தான் முருகன்.",
    background3: "https://unsplash.com/photos/statue-near-mountain-JCsmBJPHW-s",
    text3: "முத்தமிழின் முதல்வன் பெருமை - Greatness of the Lord of Tamil.",
    background4: "https://www.pexels.com/photo/majestic-batu-caves-and-lord-murugan-statue-34252690/",
    text4: "முருகனின் பக்தி வாழ்க!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=2942",
    background1: "https://www.zedge.net/wallpapers/08007725-b617-4ac7-9068-37212c0c4b58",
    text1: "மயில் வாகனமாக வளரும் தேவன்.",
    background2: "https://www.freepik.com/free-vector/hand-draw-happy-onam-festival-south-india-card-holiday-sketch-design_30759005.htm",
    text2: "மன அமைதிக்கு மருந்து வள்ளி தேவசேனா பெண் முருகன்.",
    background3: "https://unsplash.com/photos/a-very-tall-colorful-building-with-a-clock-on-its-side-eRf9aFAdIhs",
    text3: "பழனி மலை மீது நம்பிக்கை - Faith on the hill of Palani.",
    background4: "https://www.pexels.com/photo/aerial-shot-of-batu-caves-3733562/",
    text4: "முருகனே வழிகாட்டும்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=3224",
    background1: "https://www.zedge.net/wallpapers/10",
    text1: "வெற்றிக்குறியாகவே வாழ்ந்து வரும் முருகன்.",
    background2: "https://www.freepik.com/free-vector/hindu-festival-govardhan-puja-celebration-background-with-krishna-line-style-vector_71570019.htm",
    text2: "நம்பிக்கை கொண்டவர் நய்யாண்டான் முருக பக்தன்.",
    background3: "https://unsplash.com/photos/a-view-of-a-mountain-with-a-kite-flying-in-the-sky-RYY7HwFubcc",
    text3: "வேல் போல நேர்மை - Straight as the Vel (spear-like honesty).",
    background4: "https://www.pexels.com/photo/golden-arulmigu-murugan-statue-in-kuala-lumpur-8630745/",
    text4: "முருகன் துணை!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=3491",
    background1: "https://www.zedge.net/wallpapers/200",
    text1: "வசிவின் உருவாக சுவாமிமலை.",
    background2: "https://www.freepik.com/free-vector/govardhan-puja-hindu-festival-greeting-card-celebration-white-background_33099613.htm",
    text2: "அழைக்கும் பேரில் ஆதரவு தரும் அழகன் முருகன்.",
    background3: "https://unsplash.com/photos/gold-statue-of-man-near-body-of-water-during-daytime-IkUnBu-Ewvk",
    text3: "அஞ்சாமல் ஆனந்தம் கொண்டவன் - He who takes joy without fear.",
    background4: "https://www.pexels.com/photo/religious-figure-at-batu-caves-in-gombak-26967360/",
    text4: "சரவணபவா மீண்டும் வருக!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=3694",
    background1: "https://www.zedge.net/wallpapers/201",
    text1: "சிறுவனாகவே பெரும் ஜெயம் பெற்றவர்.",
    background2: "https://www.freepik.com/free-vector/govardhan-puja-hindu-festival-greeting-card-celebration-white-background_33099617.htm",
    text2: "கீதையின் கருத்து முருக வழிபாடு.",
    background3: "https://unsplash.com/photos/a-statue-of-a-person-holding-a-staff-FMCGu8uCXlQ",
    text3: "சித்தியின் சூழ்ச்சி முருகன் அருள் - Achievement through Murugan's grace.",
    background4: "https://www.pexels.com/photo/golden-buddha-statue-in-a-mountain-valley-18669596/",
    text4: "வேல் உழுக்கம்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=3891",
    background1: "https://www.zedge.net/wallpapers/202",
    text1: "குட்டான கந்தர் அற்புதம் செய்வார்.",
    background2: "https://www.freepik.com/free-vector/govardhan-puja-as-it-is-hindu-festival-celebration-card-background_33099625.htm",
    text2: "நியாயமான ஆசைகளை நிறைவேற்றும் முருகன்.",
    background3: "https://unsplash.com/photos/a-blue-object-sitting-on-top-of-a-pile-of-rocks-p92Sircj4f8",
    text3: "ஐயப்பன் உறவு முருகன் அன்பு - Aiyappan's kinship, Murugan's love.",
    background4: "https://www.pexels.com/photo/grand-ganesha-statue-during-ganesh-chaturthi-32690608/",
    text4: "முருகா என்றால் பலம்!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=5367",
    background1: "https://www.zedge.net/wallpapers/203",
    text1: "சங்கஇலக்கியங்களில் குறிப்பிடப்பட்டவர்.",
    background2: "https://www.freepik.com/free-vector/hand-drawn-govardhan-pooja-background-with-lord-krishna-lifting-hill-design-vector_81091998.htm",
    text2: "ஆன்மிக வாழ்விற்கு ஆதாரம் முருகன் வரம்.",
    background3: "https://unsplash.com/photos/a-very-tall-building-with-a-lot-of-statues-on-top-of-it-Km8uESUubuI",
    text3: "பசுமை கொண்டு பரவி வாழ் - Spread life with greenery.",
    background4: "https://www.pexels.com/photo/birds-perched-near-the-concrete-statue-5623660/",
    text4: "குகனே காப்பாயாக!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=5565",
    background1: "https://www.zedge.net/wallpapers/204",
    text1: "அறிவுக் கடவுள் என போற்றப்படுபவர்.",
    background2: "https://www.freepik.com/free-vector/happy-janmashtami-indian-cultural-festival-background-design_30473912.htm",
    text2: "அன்பை வளர்க்கும் ஆரோக்கிய வாழ்வில் முருகன் துணை.",
    background3: "https://unsplash.com/photos/a-large-statue-of-a-man-holding-a-vel-E7DThLaO8hU",
    text3: "கந்தன் கையில் கொண்டு செற்றி மாற்று - Muruga in hand, banish obstacles.",
    background4: "https://www.pexels.com/photo/arulmigu-murugan-statue-in-batu-caves-in-malaysia-19348543/",
    text4: "முருகா அருள் வாக்கு!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=5834",
    background1: "https://www.zedge.net/wallpapers/205",
    text1: "அவன் அருள் பெற வழிபடும் சமூகங்கள் அதிகம்.",
    background2: "https://www.freepik.com/free-vector/govardhan-puja-with-lord-krishna-greeting-card-design_82666642.htm",
    text2: "வாழ்க்கை போராட்டத்தில் வெற்றி பெற முருக வழி.",
    background3: "https://unsplash.com/photos/tamil-god-JKQSc5kqjmo",
    text3: "பாலும் தேனும் போல கூட்டமை - United as milk and honey.",
    background4: "https://www.pexels.com/photo/stairs-leading-to-batu-caves-in-gombak-malaysia-19442964/",
    text4: "வேல் வெற்றி முருகனுக்கு!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=6016",
    background1: "https://www.zedge.net/wallpapers/206",
    text1: "பெரும்பாலான தமிழர்கள் முருகனுக்கு விருப்பமானவர்கள்.",
    background2: "https://www.freepik.com/free-vector/lord-krishna-janmashtami-festival-background_419915801.htm",
    text2: "கேள்விக்கு விடை தரும் முருக குரல்.",
    background3: "https://unsplash.com/photos/temple-entrance-0u8MsHrdtjc",
    text3: "சொல்லபோக முருகன் பெருமை - The greatness of Murugan is beyond words.",
    background4: "https://www.pexels.com/photo/batu-caves-murugan-statue-19734394/",
    text4: "திருத்தணி முருகா பார்வை!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=6220",
    background1: "https://www.zedge.net/wallpapers/207",
    text1: "முருகன் துதிகளுக்கு தனியிடம் உண்டு.",
    background2: "https://www.freepik.com/free-psd/janmashtami-template-design_57349664.htm",
    text2: "அனுபவத்திலும் அனுபூதியிலும் முருகன் அற்புதம்.",
    background3: "https://unsplash.com/photos/colorful-idol-oSxnQvLhkrA",
    text3: "தொண்டையில் தரிசனம் சுவையே - Divine taste in chanting his name.",
    background4: "https://www.pexels.com/photo/a-statue-of-a-hindu-god-holding-a-sword-27809173/",
    text4: "முருகா உளரென்று ஓங்கு!"
  },
  {
    music: "https://www.youtube.com/watch?v=25y6hBUpE1k&t=6416",
    background1: "https://www.zedge.net/wallpapers/208",
    text1: "கவசங்களை கூறி பாராட்டு பெறுபவர்.",
    background2: "https://www.freepik.com/free-vector/gradient-ram-navami-greeting-card-template_24488071.htm",
    text2: "அறத்தை வளர்க்கும் அறுமுகன் போதனை.",
    background3: "https://unsplash.com/photos/festival-crowd-Tt7lQmdCPQU",
    text3: "மூன்றுமுக சாவடி முதல்வன் - Lord of the three frontiers.",
    background4: "https://www.pexels.com/photo/the-thiruchendur-murugan-temple-in-tamil-nadu-india-14353572/",
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
    console.log(`Short ${index + 1} response:`, JSON.stringify(result, null, 2));
    return { index: index + 1, success: true, data: result };
  } catch (error) {
    console.error(`Error creating short ${index + 1}:`, error);
    return { index: index + 1, success: false, error: error.message };
  }
}

// Main function to create all shorts
async function createAllShorts() {
  console.log('Starting to create 25 Murugan shorts...\n');
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
  const filename = `results-${timestamp}.json`;
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  
  console.log(`\n✅ All shorts created! Results saved to ${filename}`);
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`\nSummary: ${successful} successful, ${failed} failed`);
}

// Run the script
createAllShorts();

