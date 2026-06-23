const dictionary = {
  en: {
    // Table Headers
    title: 'Title',
    category: 'Category',
    priority: 'Priority',
    supervisor: 'Supervisor',
    status: 'Status',
    dueDate: 'Due Date',
    actions: 'Actions',

    // Priorities
    low: 'Low',
    medium: 'Medium',
    high: 'High',

    // Statuses
    ASSIGNED: 'Assigned',
    IN_PROGRESS: 'In Progress',
    SUBMITTED_FOR_REVIEW: 'Submitted for Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    REWORK_REQUIRED: 'Rework Required',

    // Categories
    CLASSROOM_CLEANING: 'Classroom Cleaning',
    LABORATORY_CLEANING: 'Laboratory Cleaning',
    RESTROOM_CLEANING: 'Restroom Cleaning',
    WASTE_COLLECTION: 'Waste Collection',
    GARDEN_MAINTENANCE: 'Garden Maintenance',
    ELECTRICAL_MAINTENANCE: 'Electrical Maintenance',
    PLUMBING_MAINTENANCE: 'Plumbing Maintenance',
    WATER_TANK_INSPECTION: 'Water Tank Inspection',
    OTHER: 'Other',

    // Buttons & Actions
    startWork: 'Start Work',
    resumeWork: 'Resume Work',
    uploadSubmit: 'Upload & Submit',
    viewHistory: 'View History',
    uploadSelected: 'Upload Selected Files',
    submitReview: 'Submit for Review',
    submitting: 'Submitting...',
    uploadProof: 'Upload Proof',
    alreadyUploaded: 'Already uploaded',
    addPhotosVideo: 'Add photos / video',
    remarks: 'Remarks',
    describeDone: 'Describe what you did...',
    noTasks: 'No tasks found.',
    languageLabel: 'Language:',
    selectPhotoError: 'Select at least one photo (or a video) to upload.',
    uploadFailed: 'Upload failed.',
    submitError: 'Could not submit for review.',

    // Dashboard
    myDashboard: 'My Dashboard',
    taskProgress: 'Task Completion Progress',
    taskSummary: 'Task Completion Summary',
    tasksApproved: 'Tasks Approved',
    goMyTasks: 'Go to My Tasks to start a task, upload photo/video proof, add remarks, and submit for review.',
    assignedCount: 'Assigned',
    inProgressCount: 'In Progress',
    submittedCount: 'Submitted',
    approvedCount: 'Approved',
    loading: 'Loading...',

    // TTS & Voice Fallback warnings
    ttsTitle: 'Read aloud in selected language',
    voiceMissing: 'Audio voice for this language is not installed on your device. Displaying text translation below.',
    voiceTip: 'Tip: To enable speech, go to Windows Settings > Time & Language > Speech and add the language voice pack.'
  },
  ta: {
    // Table Headers
    title: 'தலைப்பு',
    category: 'வகை',
    priority: 'முன்னுரிமை',
    supervisor: 'மேற்பார்வையாளர்',
    status: 'நிலை',
    dueDate: 'முடிவுத் தேதி',
    actions: 'செயல்கள்',

    // Priorities
    low: 'குறைந்த',
    medium: 'நடுத்தர',
    high: 'உயர்',

    // Statuses
    ASSIGNED: 'ஒதுக்கப்பட்டது',
    IN_PROGRESS: 'செயல்பாட்டில்',
    SUBMITTED_FOR_REVIEW: 'மதிப்பாய்வுக்கு சமர்ப்பிக்கப்பட்டது',
    APPROVED: 'அங்கீகரிக்கப்பட்டது',
    REJECTED: 'நிராகரிக்கப்பட்டது',
    REWORK_REQUIRED: 'மறுவேலை தேவை',

    // Categories
    CLASSROOM_CLEANING: 'வகுப்பறை சுத்தம் செய்தல்',
    LABORATORY_CLEANING: 'ஆய்வகம் சுத்தம் செய்தல்',
    RESTROOM_CLEANING: 'கழிப்பறை சுத்தம் செய்தல்',
    WASTE_COLLECTION: 'கழிவு சேகரிப்பு',
    GARDEN_MAINTENANCE: 'தோட்ட பராமரிப்பு',
    ELECTRICAL_MAINTENANCE: 'மின்சார பராமரிப்பு',
    PLUMBING_MAINTENANCE: 'குழாய் பராமரிப்பு',
    WATER_TANK_INSPECTION: 'தண்ணீர் தொட்டி ஆய்வு',
    OTHER: 'மற்றவை',

    // Buttons & Actions
    startWork: 'வேலையைத் தொடங்கு',
    resumeWork: 'வேலையை மீண்டும் தொடங்கு',
    uploadSubmit: 'பதிவேற்றி சமர்ப்பி',
    viewHistory: 'வரலாற்றைக் காண்க',
    uploadSelected: 'தேர்ந்தெடுக்கப்பட்ட கோப்புகளைப் பதிவேற்று',
    submitReview: 'மதிப்பாய்வுக்குச் சமர்ப்பி',
    submitting: 'சமர்ப்பிக்கப்படுகிறது...',
    uploadProof: 'ஆதாரத்தைப் பதிவேற்று',
    alreadyUploaded: 'ஏற்கனவே பதிவேற்றப்பட்டவை',
    addPhotosVideo: 'புகைப்படங்கள் / வீடியோவைச் சேர்',
    remarks: 'கருத்துகள்',
    describeDone: 'நீங்கள் செய்ததை விவரிக்கவும்...',
    noTasks: 'பணிகள் எதுவும் இல்லை.',
    languageLabel: 'மொழி:',
    selectPhotoError: 'பதிவேற்ற குறைந்தபட்சம் ஒரு புகைப்படம் (அல்லது வீடியோ) தேர்ந்தெடுக்கவும்.',
    uploadFailed: 'பதிவேற்றம் தோல்வியடைந்தது.',
    submitError: 'மதிப்பாய்வுக்கு சமர்ப்பிக்க முடியவில்லை.',

    // Dashboard
    myDashboard: 'என் டாஷ்போர்டு',
    taskProgress: 'பணி முடிக்கும் முன்னேற்றம்',
    taskSummary: 'பணி முடித்த விவரம்',
    tasksApproved: 'பணிகள் அங்கீகரிக்கப்பட்டன',
    goMyTasks: 'பணியைத் தொடங்க, புகைப்பட/வீடியோ ஆதாரத்தைப் பதிவேற்ற, கருத்துகளைச் சேர்க்க மற்றும் மதிப்பாய்வுக்குச் சமர்ப்பிக்க \'என் பணிகள்\' பக்கத்திற்குச் செல்லவும்.',
    assignedCount: 'ஒதுக்கப்பட்டவை',
    inProgressCount: 'செயல்பாட்டில் உள்ளவை',
    submittedCount: 'சமர்ப்பிக்கப்பட்டவை',
    approvedCount: 'அங்கீகரிக்கப்பட்டவை',
    loading: 'ஏற்றப்படுகிறது...',

    // TTS & Voice Fallback warnings
    ttsTitle: 'தேர்ந்தெடுக்கப்பட்ட மொழியில் சத்தமாக வாசிக்கவும்',
    voiceMissing: 'இந்த மொழிக்கான ஆடியோ குரல் உங்கள் சாதனத்தில் நிறுவப்படவில்லை. கீழே தமிழ் உரை காட்டப்படுகிறது.',
    voiceTip: 'குறிப்பு: பேச்சை இயக்க, விண்டோஸ் அமைப்புகள் (Settings) > நேரம் & மொழி (Time & Language) > பேச்சு (Speech) பகுதிக்குச் சென்று மொழி குரல் தொகுப்பைச் சேர்க்கவும்.'
  },
  hi: {
    // Table Headers
    title: 'शीर्षक',
    category: 'श्रेणी',
    priority: 'प्राथमिकता',
    supervisor: 'पर्यवेक्षक',
    status: 'स्थिति',
    dueDate: 'नियत तारीख',
    actions: 'कार्रवाई',

    // Priorities
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',

    // Statuses
    ASSIGNED: 'आवंटित',
    IN_PROGRESS: 'प्रगति पर',
    SUBMITTED_FOR_REVIEW: 'समीक्षा के लिए भेजा गया',
    APPROVED: 'स्वीकृत',
    REJECTED: 'अस्वीकृत',
    REWORK_REQUIRED: 'पुनर्कार्य आवश्यक',

    // Categories
    CLASSROOM_CLEANING: 'कक्षा की सफाई',
    LABORATORY_CLEANING: 'प्रयोगशाला की सफाई',
    RESTROOM_CLEANING: 'शौचालय की सफाई',
    WASTE_COLLECTION: 'कचरा संग्रहण',
    GARDEN_MAINTENANCE: 'बगीचे का रखरखाव',
    ELECTRICAL_MAINTENANCE: 'बिजली का रखरखाव',
    PLUMBING_MAINTENANCE: 'नलसाजी का रखरखाव',
    WATER_TANK_INSPECTION: 'पानी की टंकी का निरीक्षण',
    OTHER: 'अन्य',

    // Buttons & Actions
    startWork: 'काम शुरू करें',
    resumeWork: 'काम फिर से शुरू करें',
    uploadSubmit: 'अपलोड और सबमिट करें',
    viewHistory: 'इतिहास देखें',
    uploadSelected: 'चयनित फाइलें अपलोड करें',
    submitReview: 'समीक्षा के लिए भेजें',
    submitting: 'भेजा जा रहा है...',
    uploadProof: 'प्रमाण अपलोड करें',
    alreadyUploaded: 'पहले से अपलोड किया गया',
    addPhotosVideo: 'फोटो / वीडियो जोड़ें',
    remarks: 'टिप्पणी',
    describeDone: 'बताएं कि आपने क्या किया...',
    noTasks: 'कोई कार्य नहीं मिला।',
    languageLabel: 'भाषा:',
    selectPhotoError: 'अपलोड करने के लिए कम से कम एक फ़ोटो (या वीडियो) चुनें।',
    uploadFailed: 'अपलोड विफल रहा।',
    submitError: 'समीक्षा के लिए सबमिट नहीं किया जा सका।',

    // Dashboard
    myDashboard: 'मेरा डैशबोर्ड',
    taskProgress: 'कार्य पूर्णता प्रगति',
    taskSummary: 'कार्य पूर्णता सारांश',
    tasksApproved: 'कार्य स्वीकृत',
    goMyTasks: 'कार्य शुरू करने, फोटो/वीडियो प्रमाण अपलोड करने, टिप्पणी जोड़ने और समीक्षा के लिए जमा करने के लिए \'मेरे कार्य\' पर जाएं।',
    assignedCount: 'आवंटित',
    inProgressCount: 'प्रगति पर',
    submittedCount: 'जमा किए गए',
    approvedCount: 'स्वीकृत',
    loading: 'लोड हो रहा है...',

    // TTS & Voice Fallback warnings
    ttsTitle: 'चुनी हुई भाषा में ज़ोर से पढ़ें',
    voiceMissing: 'इस भाषा के लिए आवाज आपके डिवाइस पर इंस्टॉल नहीं है। नीचे अनुवादित पाठ दिखाया गया है।',
    voiceTip: 'सुझाव: आवाज सक्षम करने के लिए, Windows Settings > Time & Language > Speech में जाएं और भाषा का वॉइस पैक जोड़ें।'
  },
  te: {
    // Table Headers
    title: 'శీర్షిక',
    category: 'వర్గం',
    priority: 'ప్రాధాన్యత',
    supervisor: 'పర్యవేక్షకుడు',
    status: 'స్థితి',
    dueDate: 'గడువు తేదీ',
    actions: 'చర్యలు',

    // Priorities
    low: 'తక్కువ',
    medium: 'మధ్యస్థం',
    high: 'ఎక్కువ',

    // Statuses
    ASSIGNED: 'కేటాయించబడింది',
    IN_PROGRESS: 'పురోగతిలో ఉంది',
    SUBMITTED_FOR_REVIEW: 'సమీక్ష కోసం సమర్పించబడింది',
    APPROVED: 'ఆమోదించబడింది',
    REJECTED: 'తిరస్కరించబడింది',
    REWORK_REQUIRED: 'మళ్లీ పని చేయాలి',

    // Categories
    CLASSROOM_CLEANING: 'తరగతి గది శుభ్రపరచడం',
    LABORATORY_CLEANING: 'ప్రయోగశాల శుభ్రపరచడం',
    RESTROOM_CLEANING: 'శౌచాలయం శుభ్రపరచడం',
    WASTE_COLLECTION: 'వ్యర్థాల సేకరణ',
    GARDEN_MAINTENANCE: 'తోట నిర్వహణ',
    ELECTRICAL_MAINTENANCE: 'విద్యుత్ నిర్వహణ',
    PLUMBING_MAINTENANCE: 'ప్లంబింగ్ నిర్వహణ',
    WATER_TANK_INSPECTION: 'నీటి ట్యాంక్ తనిఖీ',
    OTHER: 'ఇతర',

    // Buttons & Actions
    startWork: 'పని ప్రారంభించు',
    resumeWork: 'పనిని తిరిగి ప్రారంభించు',
    uploadSubmit: 'అప్‌లోడ్ & సమర్పించు',
    viewHistory: 'చరిత్రను చూడండి',
    uploadSelected: 'ఎంచుకున్న ఫైల్‌లను అప్‌లోడ్ చేయండి',
    submitReview: 'సమీక్ష కోసం సమర్పించండి',
    submitting: 'సమర్పిస్తున్నాము...',
    uploadProof: 'రుజువును అప్‌లోడ్ చేయండి',
    alreadyUploaded: 'ఇప్పటికే అప్‌లోడ్ చేయబడినవి',
    addPhotosVideo: 'ఫోటోలు / వీడియోను జోడించండి',
    remarks: 'వ్యాఖ్యలు',
    describeDone: 'మీరు ఏమి చేసారో వివరించండి...',
    noTasks: 'ఎటువంటి టాస్క్‌లు కనుగొనబడలేదు.',
    languageLabel: 'భాష:',
    selectPhotoError: 'అప్‌లోడ్ చేయడానికి కనీసం ఒక ఫోటో (లేదా వీడియో) ఎంచుకోండి.',
    uploadFailed: 'అప్‌లోడ్ విఫలమైంది.',
    submitError: 'సమీక్ష కోసం సమర్పించలేకపోయాము.',

    // Dashboard
    myDashboard: 'నా డాష్‌బోర్డ్',
    taskProgress: 'టాస్క్ పూర్తి పురోగతి',
    taskSummary: 'టాస్క్ పూర్తి సారాంశం',
    tasksApproved: 'టాస్క్‌లు ఆమోదించబడ్డాయి',
    goMyTasks: 'పనిని ప్రారంభించడానికి, ఫోటో/విడియో రుజువును అప్‌లోడ్ చేయడానికి, వ్యాఖ్యలను జోడించడానికి మరియు సమీక్ష కోసం సమర్పించడానికి \'నా టాస్క్‌లు\' కి వెళ్లండి.',
    assignedCount: 'కేటాయించినవి',
    inProgressCount: 'పురోగతిలో ఉన్నవి',
    submittedCount: 'సమర్పించినవి',
    approvedCount: 'ఆమోదించబడినవి',
    loading: 'లోడ్ అవుతోంది...',

    // TTS & Voice Fallback warnings
    ttsTitle: 'ఎంచుకున్న భాషలో బిగ్గరగా చదవండి',
    voiceMissing: 'ఈ భాష కోసం ఆడియో వాయిస్ మీ పరికరంలో ఇన్‌స్టాల్ చేయబడలేదు. క్రింద తెలుగు వచనం చూపబడుతోంది.',
    voiceTip: 'చిట్కా: ప్రసంగాన్ని ప్రారంభించడానికి, విండోస్ సెట్టింగులు > సమయం & భాష > ప్రసంగం కి వెళ్లి భాషా వాయిస్ ప్యాక్‌ని జోడించండి.'
  },
  kn: {
    // Table Headers
    title: 'ಶೀರ್ಷಿಕೆ',
    category: 'ವರ್ಗ',
    priority: 'ಆದ್ಯತೆ',
    supervisor: 'ಮೇಲ್ವಿಚಾರಕ',
    status: 'ಸ್ಥಿತಿ',
    dueDate: 'ಅಂತಿಮ ದಿನಾಂಕ',
    actions: 'ಕ್ರಮಗಳು',

    // Priorities
    low: 'ಕಡಿಮೆ',
    medium: 'ಮಧ್ಯಮ',
    high: 'ಹೆಚ್ಚು',

    // Statuses
    ASSIGNED: 'ನಿಯೋಜಿಸಲಾಗಿದೆ',
    IN_PROGRESS: 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    SUBMITTED_FOR_REVIEW: 'ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಲಾಗಿದೆ',
    APPROVED: 'ಅನುಮೋದಿಸಲಾಗಿದೆ',
    REJECTED: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
    REWORK_REQUIRED: 'ಮರುಕೆಲಸ ಅಗತ್ಯವಿದೆ',

    // Categories
    CLASSROOM_CLEANING: 'ತರಗತಿ ಕೊಠಡಿ ಸ್ವಚ್ಛಗೊಳಿಸುವಿಕೆ',
    LABORATORY_CLEANING: 'ಪ್ರಯೋಗಾಲಯ ಸ್ವಚ್ಛಗೊಳಿಸುವಿಕೆ',
    RESTROOM_CLEANING: 'ಶೌಚಾಲಯ ಸ್ವಚ್ಛಗೊಳಿಸುವಿಕೆ',
    WASTE_COLLECTION: 'ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಣೆ',
    GARDEN_MAINTENANCE: 'ತೋಟದ ನಿರ್ವಹಣೆ',
    ELECTRICAL_MAINTENANCE: 'ವಿದ್ಯುತ್ ನಿರ್ವಹಣೆ',
    PLUMBING_MAINTENANCE: 'ಪ್ಲಂಬಿಂಗ್ ನಿರ್ವಹಣೆ',
    WATER_TANK_INSPECTION: 'ನೀರಿನ ತೊಟ್ಟಿ ಪರಿಶೀಲನೆ',
    OTHER: 'ಇತರ',

    // Buttons & Actions
    startWork: 'ಕೆಲಸ ಪ್ರಾರಂಭಿಸಿ',
    resumeWork: 'ಕೆಲಸ ಪುನರಾರಂಭಿಸಿ',
    uploadSubmit: 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಸಲ್ಲಿಸಿ',
    viewHistory: 'ಇತಿಹಾಸ ವೀಕ್ಷಿಸಿ',
    uploadSelected: 'ಆಯ್ಕೆಮಾಡಿದ ಫೈಲ್‌ಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    submitReview: 'ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಿ',
    submitting: 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...',
    uploadProof: 'ಪುರಾವೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    alreadyUploaded: 'ಈಗಾಗಲೇ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ',
    addPhotosVideo: 'ಫೋಟೋಗಳು / ವಿಡಿಯೋ ಸೇರಿಸಿ',
    remarks: 'ಟಿಪ್ಪಣಿಗಳು',
    describeDone: 'ನೀವು ಮಾಡಿದ್ದನ್ನು ವಿವರಿಸಿ...',
    noTasks: 'ಯಾವುದೇ ಕೆಲಸಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
    languageLabel: 'ಭಾಷೆ:',
    selectPhotoError: 'ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಕನಿಷ್ಠ ಒಂದು ಫೋಟೋ (ಅಥವಾ ವಿಡಿಯೋ) ಆಯ್ಕೆಮಾಡಿ.',
    uploadFailed: 'ಅಪ್‌ಲೋಡ್ ವಿಫಲವಾಗಿದೆ.',
    submitError: 'ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',

    // Dashboard
    myDashboard: 'ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    taskProgress: 'ಕೆಲಸ ಪೂರ್ಣಗೊಳಿಸುವಿಕೆಯ ಪ್ರಗತಿ',
    taskSummary: 'ಕೆಲಸ ಪೂರ್ಣಗೊಳಿಸುವಿಕೆಯ ಸಾರಾಂಶ',
    tasksApproved: 'ಕೆಲಸಗಳು ಅನುಮೋದಿಸಲಾಗಿದೆ',
    goMyTasks: 'ಕೆಲಸವನ್ನು ಪ್ರಾರಂಭಿಸಲು, ಫೋಟೋ/ವಿಡಿಯೋ ಪುರಾವೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲು, ಟಿಪ್ಪಣಿಗಳನ್ನು ಸೇರಿಸಲು ಮತ್ತು ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಲು \'ನನ್ನ ಕೆಲಸಗಳು\' ಗೆ ಹೋಗಿ.',
    assignedCount: 'ನಿಯೋಜಿಸಲಾಗಿದೆ',
    inProgressCount: 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    submittedCount: 'ಸಲ್ಲಿಸಲಾಗಿದೆ',
    approvedCount: 'ಅನುಮೋದಿಸಲಾಗಿದೆ',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',

    // TTS & Voice Fallback warnings
    ttsTitle: 'ಆಯ್ದ ಭಾಷೆಯಲ್ಲಿ ಗಟ್ಟಿಯಾಗಿ ಓದಿ',
    voiceMissing: 'ಈ ಭಾಷೆಯ ಆಡಿಯೋ ಧ್ವನಿ ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಸ್ಥಾಪನೆಯಾಗಿಲ್ಲ. ಕೆಳಗೆ ಕನ್ನಡ ಪಠ್ಯವನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ.',
    voiceTip: 'ಸಲಹೆ: ಭಾಷಣವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು, ವಿಂಡೋಸ್ ಸೆಟ್ಟಿಂಗ್ಸ್ > ಸಮಯ ಮತ್ತು ಭಾಷೆ > ಭಾಷಣ ಗೆ ಹೋಗಿ ಧ್ವನಿ ಪ್ಯಾಕ್ ಸೇರಿಸಿ.'
  },
  ml: {
    // Table Headers
    title: 'തലക്കെട്ട്',
    category: 'വിഭാഗം',
    priority: 'മുൻഗണന',
    supervisor: 'സൂപ്പർവൈസർ',
    status: 'നില',
    dueDate: 'അവസാന തീയതി',
    actions: 'നടപടികൾ',

    // Priorities
    low: 'കുറഞ്ഞ',
    medium: 'മധ്യം',
    high: 'ഉയർന്ന',

    // Statuses
    ASSIGNED: 'അനുവദിച്ചു',
    IN_PROGRESS: 'പുരോഗതിയിൽ',
    SUBMITTED_FOR_REVIEW: 'അവലോകനത്തിനായി സമർപ്പിച്ചു',
    APPROVED: 'അംഗീകരിച്ചു',
    REJECTED: 'നിരസിച്ചു',
    REWORK_REQUIRED: 'വീണ്ടും ചെയ്യേണ്ടതുണ്ട്',

    // Categories
    CLASSROOM_CLEANING: 'ക്ലാസ് റൂം വൃത്തിയാക്കൽ',
    LABORATORY_CLEANING: 'ലബോറട്ടറി വൃത്തിയാക്കൽ',
    RESTROOM_CLEANING: 'ശൗചാലയം വൃത്തിയാക്കൽ',
    WASTE_COLLECTION: 'മാലിന്യ ശേഖരണം',
    GARDEN_MAINTENANCE: 'തോട്ടം പരിപാലനം',
    ELECTRICAL_MAINTENANCE: 'വൈദ്യുത പരിപാലനം',
    PLUMBING_MAINTENANCE: 'പ്ലംബിംഗ് പരിപാലനം',
    WATER_TANK_INSPECTION: 'ജലസംഭരണി പരിശോധന',
    OTHER: 'മറ്റുള്ളവ',

    // Buttons & Actions
    startWork: 'ജോലി ആരംഭിക്കുക',
    resumeWork: 'ജോലി പുനരാരംഭിക്കുക',
    uploadSubmit: 'അപ്‌ലോഡ് ചെയ്ത് സമർപ്പിക്കുക',
    viewHistory: 'ചരിത്രം കാണുക',
    uploadSelected: 'തിരഞ്ഞെടുത്ത ഫയലുകൾ അപ്‌ലോഡ് ചെയ്യുക',
    submitReview: 'അവലോകനത്തിനായി സമർപ്പിക്കുക',
    submitting: 'സമർപ്പിക്കുന്നു...',
    uploadProof: 'തെളിവ് അപ്‌ലോഡ് ചെയ്യുക',
    alreadyUploaded: 'ഇതിനകം അപ്‌ലോഡ് ചെയ്തവ',
    addPhotosVideo: 'ഫോട്ടോകൾ / വീഡിയോ ചേർക്കുക',
    remarks: 'റിമാർക്കുകൾ',
    describeDone: 'നിങ്ങൾ ചെയ്ത ജോലി വിവരിക്കുക...',
    noTasks: 'ടാസ്കുകൾ ഒന്നും കണ്ടെത്തിയില്ല.',
    languageLabel: 'ഭാഷ:',
    selectPhotoError: 'അപ്‌ലോഡ് ചെയ്യാൻ കുറഞ്ഞത് ഒരു ഫോട്ടോ (അല്ലെങ്കിൽ വീഡിയോ) തിരഞ്ഞെടുക്കുക.',
    uploadFailed: 'അപ്‌ലോഡ് പരാജയപ്പെട്ടു.',
    submitError: 'അവലോകനത്തിനായി സമർപ്പിക്കാൻ കഴിഞ്ഞില്ല.',

    // Dashboard
    myDashboard: 'എന്റെ ഡാഷ്‌ബോർഡ്',
    taskProgress: 'ടാസ്ക് പൂർത്തീകരണ പുരോഗതി',
    taskSummary: 'ടാസ്ക് പൂർത്തീകരണ സംഗ്രഹം',
    tasksApproved: 'ടാസ്കുകൾ അംഗീകരിച്ചു',
    goMyTasks: 'ഒരു ടാസ്ക് ആരംഭിക്കുന്നതിനും ഫോട്ടോ/വീഡിയോ തെളിവുകൾ അപ്‌ലോഡ് ചെയ്യുന്നതിനും റിമാർക്കുകൾ ചേർക്കുന്നതിനും അവലോകനത്തിനായി സമർപ്പിക്കുന്നതിനും \'എന്റെ ടാസ്‌ക്കുകൾ\' എന്നതിലേക്ക് പോകുക.',
    assignedCount: 'അനുവദിച്ചവ',
    inProgressCount: 'പുരോഗതിയിലുള്ളവ',
    submittedCount: 'സമർപ്പിച്ചവ',
    approvedCount: 'അംഗീകരിച്ചവ',
    loading: 'ലോഡ് ചെയ്യുന്നു...',

    // TTS & Voice Fallback warnings
    ttsTitle: 'തിരഞ്ഞെടുത്ത ഭാഷയിൽ ഉറക്കെ വായിക്കുക',
    voiceMissing: 'ഈ ഭാഷയ്ക്കുള്ള ഓഡിയോ വോയ്‌സ് നിങ്ങളുടെ ഉപകരണത്തിൽ ഇൻസ്റ്റാൾ ചെയ്തിട്ടില്ല. മലയാളം ടെക്സ്റ്റ് താഴെ കാണിക്കുന്നു.',
    voiceTip: 'ടിപ്പ്: സംഭാഷണം പ്രവർത്തനക്ഷമമാക്കാൻ, വിൻഡോസ് ക്രമീകരണങ്ങൾ > സമയവും ഭാഷയും > സംഭാഷണം എന്നതിൽ പോയി ഭാഷാ വോയ്‌സ് പാക്ക് ചേർക്കുക.'
  }
};

export function translate(key, lang = 'en') {
  const currentLang = dictionary[lang] || dictionary['en'];
  return currentLang[key] || dictionary['en'][key] || key;
}

export default dictionary;
