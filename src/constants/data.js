export const QUICK_ACTIONS = [
  { id: 'link', label: 'Check link', icon: '🔗', bg: '#FFF0D6', action: 'check_link' },
  { id: 'report', label: 'Report fraud', icon: '🚨', bg: '#FFE3E3', action: 'report_fraud' },
  { id: 'helpline', label: 'Helpline 1930', icon: '📞', bg: '#DFF5EC', action: 'call_helpline' },
];

export const FRAUD_CATEGORIES = [
  {
    id: 'phishing',
    title: 'Phishing',
    icon: '🎣',
    lessons: '5 lessons',
    bg: '#ECEDFC',
    severity: 'High',
    desc: 'Fraudulent emails, texts, or fake websites designed to steal passwords, credentials, or bank details.',
    howItWorks: 'Scammers send messages impersonating trusted brands (banks, courier services, Netflix, income tax) with urgency, prompting you to click a link.',
    redFlags: [
      'Urgent threats like "Account suspended within 24 hours"',
      'Mismatched domain URLs (e.g. sbi-secure-update.xyz instead of sbi.co.in)',
      'Requests for passwords, OTPs, or PINs',
      'Spelling mistakes and generic greetings ("Dear Customer")',
    ],
    prevention: [
      'Never tap unverified links received via SMS or WhatsApp.',
      'Check the true domain name before entering credentials.',
      'Use 2-Factor Authentication (2FA) with authenticator apps instead of plain SMS OTP.',
    ],
    example: '“Dear customer, your bank account is blocked. Update PAN immediately at bit.ly/bank-kyc-verify to avoid penalties.”',
  },
  {
    id: 'payment',
    title: 'Payment fraud',
    icon: '💳',
    lessons: '4 lessons',
    bg: '#FFF0D6',
    severity: 'Critical',
    desc: 'UPI frauds, fake QR codes, and fraudulent refund requests aimed at draining accounts.',
    howItWorks: 'Scammers ask you to scan a QR code or enter your UPI PIN to "receive money" or claim a cashback/refund.',
    redFlags: [
      'Entering a UPI PIN is NEVER required to receive money.',
      'Scammer sends money request on PhonePe/GPay disguised as "Refund Voucher".',
      'Buyer on OLX insists on sending money via QR code.',
    ],
    prevention: [
      'Remember the golden rule: UPI PIN is ONLY entered to deduct money, NEVER to receive it.',
      'Do not scan any QR code sent to your WhatsApp.',
      'Verify payments directly in your bank app passbook, not screenshot proofs.',
    ],
    example: '“Please scan this QR code and type your 4-digit PIN to receive Rs. 5,000 lottery cashback.”',
  },
  {
    id: 'jobs',
    title: 'Fake jobs',
    icon: '💼',
    lessons: '3 lessons',
    bg: '#DFF5EC',
    severity: 'High',
    desc: 'Work-from-home tasks like Telegram video liking or review rating scams demanding deposit fees.',
    howItWorks: 'Victims are offered high daily earnings for rating hotels or liking YouTube videos, then asked to deposit crypto or money for "VIP prepaid tasks".',
    redFlags: [
      'Unsolicited job offers via WhatsApp or Telegram from international numbers.',
      'Easy money promises (e.g., Rs. 5000/day for 30 minutes of work).',
      'Asking for an upfront "registration fee" or deposit.',
    ],
    prevention: [
      'Legitimate employers never demand payment for hiring or equipment kits.',
      'Avoid joining unofficial Telegram investment/task groups.',
      'Report and block recruitment numbers immediately.',
    ],
    example: '“Earn ₹3,000-₹8,000 daily part-time by liking YouTube clips. Join our Telegram coordinator now.”',
  },
  {
    id: 'sim_swap',
    title: 'SIM swap',
    icon: '📱',
    lessons: '3 lessons',
    bg: '#FDE4EC',
    severity: 'Critical',
    desc: 'Attackers trick telecom providers into reissuing your phone number to intercept your OTPs.',
    howItWorks: 'Scammers collect your identity data, report a lost SIM, and redirect your number to their device to empty bank accounts.',
    redFlags: [
      'Unexpected loss of cell service and signal bars in populated areas.',
      'Calls demanding you press 9 or share a 20-digit SIM number to "upgrade to 5G".',
      'Notification emails about password resets you didn’t initiate.',
    ],
    prevention: [
      'If your mobile phone suddenly shows "No Service", contact your carrier immediately.',
      'Never share the 20-digit SIM number printed on your SIM card.',
      'Do not press keys prompted by automated robot verification calls.',
    ],
    example: '“Your SIM will be disconnected in 2 hours for KYC verification. Press 9 now to speak to an executive.”',
  },
  {
    id: 'digital_arrest',
    title: 'Digital arrest',
    icon: '👮',
    lessons: '4 lessons',
    bg: '#E0F2FE',
    severity: 'Critical',
    desc: 'Impersonating police, CBI, ED, or customs on Skype/video calls claiming illegal parcels were seized in your name.',
    howItWorks: 'Scammers wear fake uniforms or show forged court arrest warrants, confining victims on video calls and coercing them to transfer funds into "clearing accounts".',
    redFlags: [
      'Police or law enforcement NEVER conduct arrests, trials, or clearances via Skype or WhatsApp video.',
      'Requests to transfer your savings into a "Reserve Bank of India verification account".',
      'Threatening absolute secrecy from family members.',
    ],
    prevention: [
      'Law enforcement agencies never arrest citizens virtually or demand financial deposits.',
      'Disconnect such video calls immediately.',
      'Report the incident promptly on the National Cyber Crime Portal (1930).',
    ],
    example: '“This is CBI officer Sharma. A DHL courier containing illegal narcotics with your Aadhaar ID was confiscated at Mumbai Airport. You are under digital arrest.”',
  },
  {
    id: 'courier_scam',
    title: 'Courier APK scam',
    icon: '📦',
    lessons: '3 lessons',
    bg: '#FEF3C7',
    severity: 'High',
    desc: 'Fake delivery alerts urging you to download an APK file or pay ₹5 for address updates.',
    howItWorks: 'An SMS claims your India Post or courier parcel is held up. Clicking the link downloads spyware or prompts credit card entry.',
    redFlags: [
      'SMS with short links from personal mobile numbers instead of registered sender IDs (like IP-INDIA).',
      'Requests to download an `.apk` file onto Android phones.',
      'Asking for a nominal ₹5 or ₹10 redelivery fee to capture payment card details.',
    ],
    prevention: [
      'Track parcels only via the official tracking portals (e.g. indiapost.gov.in, bluedart.com).',
      'Never install `.apk` files from browser links.',
    ],
    example: '“India Post Alert: Your package is detained due to invalid address. Please update within 24h at indiapost-track.apk”',
  },
];

export const NEWS_ARTICLES = [
  {
    id: '1',
    category: 'Alert',
    tagClass: 'orange',
    title: 'Fake courier texts are spreading again with malicious APK links',
    time: '2 hours ago',
    icon: '📰',
    summary: 'Cyber police have issued an urgent advisory warning citizens against SMS messages claiming parcel delivery delays that ask users to install APKs.',
    readTime: '3 min read',
    content: 'Attackers are sending spoofed SMS messages impersonating India Post and major delivery couriers. The message urges receivers to pay a nominal ₹5 fee or download an update APK file to correct their address. The installed APK acts as remote spyware, intercepting incoming OTPs and banking credentials.\n\nKey Takeaways:\n• Never download files ending in .apk from SMS or WhatsApp.\n• Delivery companies do not request payments to release held parcels via personal SMS.\n• Track parcels exclusively on verified vendor websites.',
  },
  {
    id: '2',
    category: 'Scam',
    tagClass: 'brand',
    title: 'Job offer scams target fresh graduates with high daily payout claims',
    time: '5 hours ago',
    icon: '💼',
    summary: 'Telegram task schemes promising ₹3,000 a day for rating Google Maps locations have victimized over 2,000 individuals this month.',
    readTime: '4 min read',
    content: 'Criminal syndicates reach out through WhatsApp offering flexible part-time positions. After paying small introductory incentives of ₹150 to gain trust, victims are invited into private Telegram groups where they are coerced into investing larger sums for "prepaid tasks".\n\nKey Takeaways:\n• Legitimate companies never charge fees for onboarding.\n• Freelance task groups on Telegram are predominantly fraudulent.\n• Cease communication immediately if asked to deposit funds.',
  },
  {
    id: '3',
    category: 'Tip',
    tagClass: 'green',
    title: 'Five essential settings to lock your UPI and banking apps today',
    time: 'Yesterday',
    icon: '🔐',
    summary: 'A simple checklist to safeguard your digital wallets, restrict international transactions, and prevent screen-sharing exploits.',
    readTime: '2 min read',
    content: '1. Set up App Lock using Biometrics (Fingerprint/FaceID) separate from your device lock screen.\n2. Disable "Allow Display over other apps" for remote tools like AnyDesk and TeamViewer.\n3. Turn off NFC and International Transaction limits on debit cards if not actively in use.\n4. Enable SMS alerts for transactions of any amount.\n5. Never allow screen sharing when accessing payment apps.',
  },
  {
    id: '4',
    category: 'Breach',
    tagClass: 'red',
    title: 'What to do immediately if your email or passwords leak online',
    time: 'Yesterday',
    icon: '📧',
    summary: 'Step-by-step checklist on checking breach status, rotating compromised passwords, and invalidating active session tokens.',
    readTime: '3 min read',
    content: 'When credential stuffing databases appear on dark web forums, cybercriminals attempt automated logins across popular social and banking services.\n\nActions:\n• Check your email on HaveIBeenPwned.\n• Change passwords immediately to long, unique passphrases.\n• Turn on Multi-Factor Authentication (MFA).\n• Revoke authorized third-party app permissions in account settings.',
  },
  {
    id: '5',
    category: 'Alert',
    tagClass: 'orange',
    title: 'Digital arrest scam warning: How scammers pose as CBI and ED officers',
    time: '2 days ago',
    icon: '🚨',
    summary: 'Supreme Court and Indian Cyber Crime Coordination Centre (I4C) warn against fake video trials claiming illegal parcel shipments.',
    readTime: '5 min read',
    content: 'Scammers establish simulated police headquarters backgrounds on video calls, displaying bogus FIR documents and arrest warrants. Victims are intimidated into staying on call under "digital house arrest" until all savings are wired to escrow accounts.\n\nKey Takeaways:\n• Indian law does not permit any arrest or trial via video call.\n• The CBI or Police never request money transfer for verification.\n• Call 1930 immediately if targeted.',
  },
];

export const UPCOMING_EVENTS = [
  {
    id: '1',
    day: '27',
    month: 'Sep',
    title: 'Deepfake voice scams & AI audio defense',
    type: 'Webinar',
    time: '6:00 PM IST',
    mode: 'Online (Zoom)',
    tag: 'Free',
    speaker: 'Dr. R. Verma (Cyber Security Expert)',
    description: 'Learn how cybercriminals clone human voices using 3-second audio clips and discover practical verification techniques to protect family finances.',
    registered: false,
  },
  {
    id: '2',
    day: '04',
    month: 'Oct',
    title: 'Cyber safety & digital hygiene for students',
    type: 'Seminar',
    time: '10:30 AM IST',
    mode: 'Campus Auditorium & Live Stream',
    tag: 'Free',
    speaker: 'Cyberakshak Awareness Wing',
    description: 'Hands-on session on identifying fake job recruitment, student loan app harassment, account safety, and safe social media privacy practices.',
    registered: true,
  },
  {
    id: '3',
    day: '12',
    month: 'Oct',
    title: 'Secure your UPI, Net Banking & Wallets',
    type: 'Workshop',
    time: '11:00 AM IST',
    mode: 'Interactive Workshop',
    tag: 'Free',
    speaker: 'National Payments Security Guild',
    description: 'Live walkthrough of setting transaction limits, avoiding malicious QR codes, reporting accidental transfers, and emergency chargebacks.',
    registered: false,
  },
  {
    id: '4',
    day: '19',
    month: 'Oct',
    title: 'Spotting Phishing, Smishing & Fake Courier Alerts',
    type: 'Webinar',
    time: '5:00 PM IST',
    mode: 'Online',
    tag: 'Free',
    speaker: 'Amitabh S. (Incident Responder)',
    description: 'Break down deceptive SMS text patterns, domain manipulation tricks, and malicious APK payloads in this beginner-friendly security masterclass.',
    registered: false,
  },
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'm1',
    sender: 'bot',
    text: 'Hi! Paste a message or tell me what happened. I will help you check if it is a scam.',
  },
  {
    id: 'm2',
    sender: 'user',
    text: 'A caller says my SIM will be blocked unless I press 9.',
  },
  {
    id: 'm3',
    sender: 'bot',
    badge: 'Likely a scam',
    badgeType: 'orange',
    text: 'Telecom companies never ask this. Do this now:',
    steps: [
      'Hang up the call immediately',
      'Do not share any OTP or SIM details',
      'Report suspicious numbers at helpline 1930',
    ],
  },
];

export const SUGGESTIONS = [
  'Is this link safe?',
  'I lost money in a scam',
  'Check a suspicious call',
  'Got a job offer on Telegram',
  'Fake courier text with APK',
];

/**
 * Intelligent scam detection response generator for Cyberakshak
 */
export function analyzeUserQuery(query) {
  const q = query.toLowerCase();

  if (q.includes('sim') || q.includes('press 9') || q.includes('block') || q.includes('telecom') || q.includes('trai')) {
    return {
      badge: 'Likely a scam',
      badgeType: 'orange',
      text: 'Telecom service providers (Airtel, Jio, Vi) and TRAI never make automated calls threatening SIM deactivation or asking you to press 9. This is an active SIM deactivation scam.',
      steps: [
        'Disconnect the call immediately.',
        'Never press any requested keypad digits.',
        'Never disclose your SIM number or Aadhaar details.',
        'Report the calling number on the Chakshu portal or call 1930.',
      ],
      helpline: '1930',
    };
  }

  if (q.includes('courier') || q.includes('apk') || q.includes('india post') || q.includes('parcel') || q.includes('delivery') || q.includes('address')) {
    return {
      badge: 'High Risk Scam',
      badgeType: 'red',
      text: 'This is a rampant Courier Delivery Phishing scam. Couriers never distribute `.apk` files or demand ₹5–₹10 fee payments through random SMS links to fix delivery addresses.',
      steps: [
        'Do NOT tap the link or install any downloaded APK file.',
        'If you installed an APK, turn on Airplane mode immediately and uninstall the unknown app.',
        'Verify legitimate parcels only on the official courier website.',
        'Block the sender’s number.',
      ],
      helpline: '1930',
    };
  }

  if (q.includes('qr') || q.includes('pin') || q.includes('receive money') || q.includes('refund') || q.includes('cashback') || q.includes('olx')) {
    return {
      badge: 'Critical Payment Scam',
      badgeType: 'red',
      text: 'CRITICAL WARNING: Entering your UPI PIN or scanning a QR code is ONLY used to DEDUCT money from your bank account, NEVER to receive funds!',
      steps: [
        'Do NOT scan the QR code or enter your UPI PIN.',
        'Do not approve any "Collect Request" inside PhonePe, GPay, or Paytm.',
        'Disconnect contact with the seller or buyer immediately.',
      ],
      helpline: '1930',
    };
  }

  if (q.includes('job') || q.includes('telegram') || q.includes('youtube') || q.includes('like') || q.includes('part-time') || q.includes('part time') || q.includes('work from home')) {
    return {
      badge: 'High Risk Task Scam',
      badgeType: 'red',
      text: 'This is a notorious Work-from-Home Task Fraud. Scammers pay tiny amounts initially for rating or liking clips, then demand large deposit fees for "prepaid VIP tasks" that you cannot withdraw.',
      steps: [
        'Do not send any money or registration fee.',
        'Exit the Telegram or WhatsApp group.',
        'Legitimate firms never solicit hiring through unsolicited WhatsApp messages.',
      ],
      helpline: '1930',
    };
  }

  if (q.includes('lost money') || q.includes('fraud') || q.includes('stolen') || q.includes('scammed') || q.includes('debited') || q.includes('unauthorized')) {
    return {
      badge: 'Emergency Action Required',
      badgeType: 'red',
      text: 'Time is critical! If unauthorized transactions occurred within the last 2 to 24 hours, funds can often be frozen before cashout.',
      steps: [
        'Call the National Cyber Crime Helpline at 1930 immediately.',
        'Contact your bank helpline to block your debit/credit card and freeze UPI access.',
        'Gather transaction IDs, recipient UPI IDs, and screenshot evidence.',
        'File an official incident report on cybercrime.gov.in.',
      ],
      helpline: '1930',
    };
  }

  if (q.includes('cbi') || q.includes('police') || q.includes('arrest') || q.includes('skype') || q.includes('customs') || q.includes('drugs') || q.includes('parcel with aadhaar')) {
    return {
      badge: 'Digital Arrest Scam',
      badgeType: 'red',
      text: 'This is a fake "Digital Arrest" scheme. Law enforcement, CBI, Customs, and Police never hold trials, interrogations, or arrests via Skype or WhatsApp video.',
      steps: [
        'Disconnect the video call right away.',
        'Do NOT transfer any money to so-called "RBI verification accounts".',
        'Inform a family member or trusted friend immediately.',
        'Report this to local police or dial 1930.',
      ],
      helpline: '1930',
    };
  }

  if (q.includes('link') || q.includes('http') || q.includes('www') || q.includes('.com') || q.includes('check link')) {
    return {
      badge: 'Link Analysis Guide',
      badgeType: 'orange',
      text: 'To determine if a link is safe, inspect the domain carefully:',
      steps: [
        'Look at the true domain before the slash (e.g. sbi.co.in vs sbi-security.biz).',
        'Avoid short URLs like bit.ly, tinyurl, or is.gd from unknown senders.',
        'Never enter passwords or OTPs on pages opened from SMS.',
        'You can paste the suspicious link directly here to evaluate its risk pattern.',
      ],
    };
  }

  // Default intelligent assistant response
  return {
    badge: 'Cyberakshak Analysis',
    badgeType: 'brand',
    text: `I analyzed your query: "${query.slice(0, 70)}...". When encountering unexpected communications, follow these cyber hygiene rules:`,
    steps: [
      'Verify the sender identity through official channels, not numbers in the message.',
      'Never disclose banking credentials, OTPs, or passwords to anyone.',
      'If someone pressures you with extreme urgency, pause and double-check.',
      'Report suspicious incidents to the National Cyber Crime Helpline at 1930.',
    ],
    helpline: '1930',
  };
}
