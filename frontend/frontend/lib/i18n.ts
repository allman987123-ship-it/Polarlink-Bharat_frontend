// GIGW 3.0 & DBIM Compliant Multilingual Dictionaries (English & Hindi)
export type SupportedLanguage = "en" | "hi" | "mr" | "ta" | "bn" | "gu";

export interface Translations {
  // Official Headers
  govIndia: string;
  moes: string;
  ncpor: string;
  digitalTwinTitle: string;
  maitriSubtitle: string;
  bharatiSubtitle: string;
  systemOnline: string;
  clearSky: string;

  // Navigation
  navOverview: string;
  navFacilityView: string;
  navEnvironment: string;
  navEnergy: string;
  navInfrastructure: string;
  navCctv: string;
  navLogistics: string;
  navWeather: string;
  navData: string;
  navReports: string;

  // Accessibility & Tools
  skipToContent: string;
  screenReader: string;
  highContrast: string;
  textSize: string;
  feedback: string;
  share: string;
  voiceCommand: string;
  myGov: string;
  nationalPortal: string;
  lockTerminal: string;

  // Station Stats & Digital Twin
  coordinates: string;
  location: string;
  elevation: string;
  winterCrew: string;
  operational: string;
  stationDossier: string;
  miniMap: string;
  layers: string;
  cameraPresets: string;
  groundTruthPhotos: string;
  twinViews: string;
  overview: string;
  facade: string;
  power: string;
  fuel: string;
  tower: string;
  lake: string;
  aerial: string;

  // Security & Portal
  commanderId: string;
  passcode: string;
  authenticate: string;
  restrictedClearance: string;
  ssoLogin: string;
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    govIndia: "GOVERNMENT OF INDIA",
    moes: "MINISTRY OF EARTH SCIENCES",
    ncpor: "NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH",
    digitalTwinTitle: "INDIAN ANTARCTIC DIGITAL TWIN",
    maitriSubtitle: "MAITRI STATION – SCHIRMACHER OASIS, ANTARCTICA",
    bharatiSubtitle: "BHARATI STATION – LARSEMANN HILLS",
    systemOnline: "SYSTEM ONLINE",
    clearSky: "Clear Sky",

    navOverview: "OVERVIEW",
    navFacilityView: "FACILITY VIEW",
    navEnvironment: "ENVIRONMENT",
    navEnergy: "ENERGY",
    navInfrastructure: "INFRASTRUCTURE",
    navCctv: "CCTV",
    navLogistics: "LOGISTICS",
    navWeather: "WEATHER",
    navData: "DATA",
    navReports: "REPORTS",

    skipToContent: "Skip to Main Content",
    screenReader: "Screen Reader Access",
    highContrast: "High Contrast",
    textSize: "Text Size",
    feedback: "Feedback & Inquiries",
    share: "Share",
    voiceCommand: "Voice Command",
    myGov: "MyGov India",
    nationalPortal: "National Portal of India",
    lockTerminal: "Lock",

    coordinates: "Coordinates",
    location: "Location",
    elevation: "Elevation",
    winterCrew: "Winter Crew",
    operational: "Operational • SCADA Nominal",
    stationDossier: "Full Station Telemetry Dossier →",
    miniMap: "Mini Map",
    layers: "3D Layers Filter",
    cameraPresets: "Camera Presets",
    groundTruthPhotos: "Ground-Truth Photos",
    twinViews: "Twin Views",
    overview: "Overview",
    facade: "Main Facade",
    power: "Powerhouse",
    fuel: "Fuel Depot",
    tower: "Comms Tower",
    lake: "Glacier Lake",
    aerial: "Aerial Nadir",

    commanderId: "Station Commander ID",
    passcode: "Security Passcode",
    authenticate: "AUTHENTICATE TERMINAL ACCESS",
    restrictedClearance: "LEVEL-4 RESTRICTED CLEARANCE REQUIRED",
    ssoLogin: "Sign In with MeriPehchaan (National SSO)",
  },
  hi: {
    govIndia: "भारत सरकार",
    moes: "पृथ्वी विज्ञान मंत्रालय",
    ncpor: "राष्ट्रीय ध्रुवीय एवं महासागर अनुसंधान केंद्र (एनसीपीओआर)",
    digitalTwinTitle: "भारतीय अंटार्कटिक डिजिटल ट्विन",
    maitriSubtitle: "मैत्री स्टेशन – शिर्माकर ओएसिस, अंटार्कटिका",
    bharatiSubtitle: "भारती स्टेशन – लार्समैन हिल्स, अंटार्कटिका",
    systemOnline: "प्रणाली ऑनलाइन",
    clearSky: "साफ आसमान",

    navOverview: "अवलोकन",
    navFacilityView: "सुविधा दृश्य (3D)",
    navEnvironment: "पर्यावरण",
    navEnergy: "ऊर्जा",
    navInfrastructure: "बुनियादी ढांचा",
    navCctv: "सीसीटीवी",
    navLogistics: "रसद एवं आपूर्ति",
    navWeather: "मौसम पूर्वानुमान",
    navData: "डेटा स्रोत",
    navReports: "रिपोर्ट्स",

    skipToContent: "मुख्य सामग्री पर जाएं",
    screenReader: "स्क्रीन रीडर एक्सेस",
    highContrast: "उच्च कंट्रास्ट",
    textSize: "टेक्स्ट का आकार",
    feedback: "प्रतिक्रिया एवं पूछताछ",
    share: "साझा करें",
    voiceCommand: "वॉयस कमांड",
    myGov: "मेरी सरकार (MyGov)",
    nationalPortal: "भारत का राष्ट्रीय पोर्टल",
    lockTerminal: "लॉक करें",

    coordinates: "निर्देशांक",
    location: "स्थान",
    elevation: "ऊंचाई",
    winterCrew: "शीतकालीन दल",
    operational: "सक्रिय • स्काडा सामान्य",
    stationDossier: "पूर्ण स्टेशन टेलीमेट्री विवरण →",
    miniMap: "मिनी मैप",
    layers: "3D परतें फ़िल्टर",
    cameraPresets: "कैमरा प्रीसेट",
    groundTruthPhotos: "वास्तविक तस्वीरें",
    twinViews: "ट्विन दृश्य",
    overview: "संपूर्ण दृश्य",
    facade: "मुख्य अग्रभाग",
    power: "पावर हाउस",
    fuel: "ईंधन डिपो",
    tower: "संचार टॉवर",
    lake: "ग्लेशियर झील",
    aerial: "हवाई दृश्य",

    commanderId: "स्टेशन कमांडर आईडी",
    passcode: "सुरक्षा पासकोड",
    authenticate: "टर्मिनल एक्सेस प्रमाणित करें",
    restrictedClearance: "स्तर-4 प्रतिबंधित मंजूरी आवश्यक",
    ssoLogin: "मेरी पहचान (राष्ट्रीय एसएसओ) से साइन इन करें",
  },
  mr: {
    govIndia: "भारत सरकार",
    moes: "पृथ्वी विज्ञान मंत्रालय",
    ncpor: "राष्ट्रीय ध्रुवीय आणि महासागर संशोधन केंद्र",
    digitalTwinTitle: "भारतीय अंटार्क्टिक डिजिटल ट्विन",
    maitriSubtitle: "मैत्री स्टेशन – शिर्माकर ओएसिस",
    bharatiSubtitle: "भारती स्टेशन – लार्समन हिल्स",
    systemOnline: "प्रणाली ऑनलाइन",
    clearSky: "स्वच्छ आकाश",

    navOverview: "आढावा",
    navFacilityView: "3D सुविधा दृश्य",
    navEnvironment: "पर्यावरण",
    navEnergy: "ऊर्जा",
    navInfrastructure: "पायाभूत सुविधा",
    navCctv: "सीसीटीव्ही",
    navLogistics: "लॉजिस्टिक",
    navWeather: "हवामान",
    navData: "डेटा",
    navReports: "अहवाल",

    skipToContent: "मुख्य मजकुरावर जा",
    screenReader: "स्क्रीन रीडर ॲक्सेस",
    highContrast: "उच्च कॉन्ट्रास्ट",
    textSize: "मजकूर आकार",
    feedback: "अभिप्राय आणि चौकशी",
    share: "शेअर करा",
    voiceCommand: "व्हॉइस कमांड",
    myGov: "माझी सरकार (MyGov)",
    nationalPortal: "भारताचे राष्ट्रीय पोर्टल",
    lockTerminal: "लॉक",

    coordinates: "स्थान निर्देशक",
    location: "स्थान",
    elevation: "उंची",
    winterCrew: "हिवाळी शास्त्रज्ञ",
    operational: "सक्रिय • सामान्य",
    stationDossier: "संपूर्ण माहिती →",
    miniMap: "मिनी नकाशा",
    layers: "3D स्तर",
    cameraPresets: "कॅमेरा दृश्ये",
    groundTruthPhotos: "वास्तविक छायाचित्रे",
    twinViews: "ट्विन दृश्ये",
    overview: "एकूण दृश्य",
    facade: "मुख्य इमारत",
    power: "विद्युत केंद्र",
    fuel: "इंधन डेपो",
    tower: "संभाषण टॉवर",
    lake: "सरोवर",
    aerial: "हवाई दृश्य",

    commanderId: "कमांडर आयडी",
    passcode: "सुरक्षा पासकोड",
    authenticate: "प्रमाणित करा",
    restrictedClearance: "स्तर-4 सुरक्षा आवश्यक",
    ssoLogin: "मेरी पहचान (SSO) द्वारे लॉगिन",
  },
  ta: {
    govIndia: "இந்திய அரசு",
    moes: "புவி அறிவியல் அமைச்சகம்",
    ncpor: "தேசிய துருவ மற்றும் பெருங்கடல் ஆராய்ச்சி மையம்",
    digitalTwinTitle: "இந்திய அண்டார்டிக் டிஜிட்டல் இரட்டை",
    maitriSubtitle: "மைத்ரி நிலையம் – ஷிர்மச்சர் பாலைவனம்",
    bharatiSubtitle: "பாரதி நிலையம் – லார்ஸ்மேன் ஹில்ஸ்",
    systemOnline: "அமைப்பு ஆன்லைன்",
    clearSky: "தெளிவான வானம்",

    navOverview: "கண்ணோட்டம்",
    navFacilityView: "3D வசதி காட்சி",
    navEnvironment: "சுற்றுச்சூழல்",
    navEnergy: "ஆற்றல்",
    navInfrastructure: "உள்கட்டமைப்பு",
    navCctv: "சிசிடிவி",
    navLogistics: "தளவாடங்கள்",
    navWeather: "வானிலை",
    navData: "தரவு",
    navReports: "அறிக்கைகள்",

    skipToContent: "முக்கிய உள்ளடக்கத்திற்கு செல்க",
    screenReader: "திரை வாசிப்பான் அணுகல்",
    highContrast: "உயர் மாறுபாடு",
    textSize: "உரை அளவு",
    feedback: "கருத்து மற்றும் விசாரணைகள்",
    share: "பகிரவும்",
    voiceCommand: "குரல் கட்டளை",
    myGov: "மை கவ் (MyGov)",
    nationalPortal: "இந்தியாவின் தேசிய போர்டல்",
    lockTerminal: "பூட்டு",

    coordinates: "ஆயத்தொலைவுகள்",
    location: "இடம்",
    elevation: "உயரம்",
    winterCrew: "குளிர்கால குழு",
    operational: "செயல்பாட்டில் உள்ளது",
    stationDossier: "முழு விவரங்கள் →",
    miniMap: "சிறிய வரைபடம்",
    layers: "3D அடுக்குகள்",
    cameraPresets: "கேமரா கோணங்கள்",
    groundTruthPhotos: "உண்மை புகைப்படங்கள்",
    twinViews: "இரட்டை காட்சிகள்",
    overview: "முழு காட்சி",
    facade: "முன் முகப்பு",
    power: "மின் நிலையம்",
    fuel: "எரிபொருள் கிடங்கு",
    tower: "தகவல்தொடர்பு கோபுரம்",
    lake: "பனி ஏரி",
    aerial: "வான்வழி காட்சி",

    commanderId: "தளபதி ஐடி",
    passcode: "பாதுகாப்பு கடவுச்சொல்",
    authenticate: "அங்கீகரிக்கவும்",
    restrictedClearance: "நிலை-4 அனுமதி தேவை",
    ssoLogin: "மேரி பெஹ்சான் (SSO) மூலம் உள்நுழைக",
  },
  bn: {
    govIndia: "ভারত সরকার",
    moes: "ভূ-বিজ্ঞান মন্ত্রক",
    ncpor: "জাতীয় মেরু ও মহাসাগর গবেষণা কেন্দ্র",
    digitalTwinTitle: "ভারতীয় অ্যান্টার্কটিকা ডিজিটাল টুইন",
    maitriSubtitle: "মৈত্রী স্টেশন – শিরমাখার মরূদ্যান",
    bharatiSubtitle: "ভারতী স্টেশন – লার্সেমান হিলস",
    systemOnline: "সিস্টেম অনলাইন",
    clearSky: "পরিষ্কার আকাশ",

    navOverview: "সংক্ষিপ্ত বিবরণ",
    navFacilityView: "3D সুবিধা ভিউ",
    navEnvironment: "পরিবেশ",
    navEnergy: "শক্তি",
    navInfrastructure: "অবকাঠামো",
    navCctv: "সিসিটিভি",
    navLogistics: "রসদ",
    navWeather: "আবহাওয়া",
    navData: "তথ্য",
    navReports: "প্রতিবেদন",

    skipToContent: "প্রধান বিষয়বস্তুতে যান",
    screenReader: "স্ক্রিন রিডার অ্যাক্সেস",
    highContrast: "উচ্চ বৈসাদৃশ্য",
    textSize: "পাঠ্য আকার",
    feedback: "মতামত ও অনুসন্ধান",
    share: "শেয়ার করুন",
    voiceCommand: "ভয়েস কমান্ড",
    myGov: "মাইগভ ভারত",
    nationalPortal: "ভারতের জাতীয় পোর্টাল",
    lockTerminal: "লক",

    coordinates: "স্থানাঙ্ক",
    location: "অবস্থান",
    elevation: "উচ্চতা",
    winterCrew: "শীতকালীন দল",
    operational: "সক্রিয় • স্বাভাবিক",
    stationDossier: "সম্পূর্ণ তথ্য →",
    miniMap: "মিনি ম্যাপ",
    layers: "3D স্তর",
    cameraPresets: "ক্যামেরা প্রিসেট",
    groundTruthPhotos: "প্রকৃত ছবি",
    twinViews: "টুইন ভিউ",
    overview: "সার্বিক ভিউ",
    facade: "মূল ভবন",
    power: "বিদ্যুৎ কেন্দ্র",
    fuel: "জ্বালানি ডিপো",
    tower: "যোগাযোগ টাওয়ার",
    lake: "হ্রদ",
    aerial: "আকাশ দৃশ্য",

    commanderId: "কমান্ডার আইডি",
    passcode: "নিরাপত্তা পাসকোড",
    authenticate: "প্রমাণীকরণ করুন",
    restrictedClearance: "স্তর-৪ ছাড়পত্র প্রয়োজন",
    ssoLogin: "মেরি পহচান (SSO) দিয়ে সাইন ইন",
  },
  gu: {
    govIndia: "ભારત સરકાર",
    moes: "પૃથ્વી વિજ્ઞાન મંત્રાલય",
    ncpor: "રાષ્ટ્રીય ધ્રુવીય અને મહાસાગર સંશોધન કેન્દ્ર",
    digitalTwinTitle: "ભારતીય એન્ટાર્કટિક ડિજિટલ ટ્વિન",
    maitriSubtitle: "મૈત્રી સ્ટેશન – શિર્માકર ઓએસિસ",
    bharatiSubtitle: "ભારતી સ્ટેશન – લાર્સમેન હિલ્સ",
    systemOnline: "સિસ્ટમ ઓનલાઈન",
    clearSky: "સ્વચ્છ આકાશ",

    navOverview: "ઝાંખી",
    navFacilityView: "3D સુવિધા દૃશ્ય",
    navEnvironment: "પર્યાવરણ",
    navEnergy: "ઊર્જા",
    navInfrastructure: "ઈન્ફ્રાસ્ટ્રક્ચર",
    navCctv: "સીસીટીવી",
    navLogistics: "લોજિસ્ટિક્સ",
    navWeather: "હવામાન",
    navData: "ડેટા",
    navReports: "અહેવાલો",

    skipToContent: "મુખ્ય સામગ્રી પર જાઓ",
    screenReader: "સ્ક્રીન રીડર ઍક્સેસ",
    highContrast: "હાઇ કોન્ટ્રાસ્ટ",
    textSize: "ટેક્સ્ટનું કદ",
    feedback: "પ્રતિસાદ અને પૂછપરછ",
    share: "શેર કરો",
    voiceCommand: "વોઇસ કમાન્ડ",
    myGov: "માયગવ ઇન્ડિયા",
    nationalPortal: "ભારતનું રાષ્ટ્રીય પોર્ટલ",
    lockTerminal: "લૉક",

    coordinates: "કોઓર્ડિનેટ્સ",
    location: "સ્થાન",
    elevation: "ઊંચાઈ",
    winterCrew: "શિયાળુ ક્રૂ",
    operational: "કાર્યરત • સામાન્ય",
    stationDossier: "સંપૂર્ણ ટેલિમેટ્રી →",
    miniMap: "મિની નકશો",
    layers: "3D સ્તરો",
    cameraPresets: "કૅમેરા પ્રીસેટ્સ",
    groundTruthPhotos: "વાસ્તવિક ફોટા",
    twinViews: "ટ્વિન દૃશ્યો",
    overview: "સંપૂર્ણ દૃશ્ય",
    facade: "મુખ્ય આગળનો ભાગ",
    power: "પાવર હાઉસ",
    fuel: "ઇંધણ ડેપો",
    tower: "સંચાર ટાવર",
    lake: "ગ્લેશિયર તળાવ",
    aerial: "હવાઈ દૃશ્ય",

    commanderId: "કમાન્ડર આઈડી",
    passcode: "સુરક્ષા પાસકોડ",
    authenticate: "પ્રમાણિત કરો",
    restrictedClearance: "લેવલ-4 પરવાનગી જરૂરી",
    ssoLogin: "મેરી પહેચાન (SSO) થી સાઇન ઇન કરો",
  },
};
