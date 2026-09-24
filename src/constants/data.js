import { COLORS } from './theme';

export const QUICK_ACTIONS = [
  { id: 'link', label: 'Check link', icon: 'link-outline', bg: '#FFF0D6', action: 'check_link' },
  { id: 'report', label: 'Report fraud', icon: 'warning-outline', bg: '#FFE3E3', action: 'report_fraud' },
  { id: 'helpline', label: 'Helpline 1930', icon: 'call-outline', bg: '#DFF5EC', action: 'call_helpline' },
];

export const HELPLINE = {
  number: '1930',
  portal: 'https://cybercrime.gov.in',
};

export const SEVERITY = {
  Critical: { fg: COLORS.red, bg: COLORS.redSoft },
  High: { fg: COLORS.orange, bg: COLORS.orangeSoft },
  Medium: { fg: COLORS.brand, bg: COLORS.brandSoft },
};

export const FRAUD_GROUPS = [
  { id: 'banking', label: 'Banking & payments' },
  { id: 'impersonation', label: 'Impersonation' },
  { id: 'money', label: 'Jobs & investment' },
  { id: 'social', label: 'Personal & social' },
  { id: 'shopping', label: 'Shopping & delivery' },
];

/**
 * One entry per fraud type.
 * severity: 'Critical' | 'High' | 'Medium'
 * group:    must match an id in FRAUD_GROUPS
 */
export const FRAUD_CATEGORIES = [
  {
    id: 'phishing',
    title: 'Phishing & smishing',
    group: 'banking',
    severity: 'High',
    summary:
      'Fake emails, SMS and websites that imitate banks or government bodies to steal your login details.',
    overview:
      'Phishing tricks you into entering credentials or card details on a page controlled by the attacker. Smishing is the same attack delivered by SMS or WhatsApp. KYC updates, blocked accounts and tax refunds are the most common themes.',
    howItWorks: [
      'You receive a message that appears to come from your bank, a courier or a government office.',
      'It creates urgency: your account will be blocked or a refund will expire.',
      'The link opens a look-alike website that records your password, card number and OTP.',
      'The attacker signs in to your real account within minutes using the OTP you just typed.',
    ],
    redFlags: [
      'Threats of account closure or penalties within hours',
      'Shortened links or domains that are not the bank’s own',
      'Requests for OTP, PIN, CVV or full card details',
      'Generic greetings and a mobile number instead of a registered sender ID',
    ],
    protect: [
      'Open your bank’s app or type the website address yourself instead of tapping links',
      'Read the full domain name before entering any detail',
      'Use app-based two-factor authentication where available',
      'Save your bank’s customer care number from its official website or card',
    ],
    ifVictim: [
      'Call your bank at once and block cards and net banking',
      'Change the password of the affected account and any account that shares it',
      'Call 1930 and report at cybercrime.gov.in',
    ],
    example:
      'Dear customer, your account will be blocked today. Update your PAN at bit.ly/kyc-verify to avoid a penalty.',
  },
  {
    id: 'upi',
    title: 'UPI & QR code fraud',
    group: 'banking',
    severity: 'Critical',
    summary:
      'Tricks that make you approve a payment or scan a code while believing you are receiving money.',
    overview:
      'Your UPI PIN is needed only to send money. Any request to enter it, scan a QR code or approve a collect request in order to receive money is a fraud.',
    howItWorks: [
      'A buyer, seller or “refund agent” says they will pay you and asks for a QR scan or UPI ID.',
      'They send a collect request or QR code framed as a refund, cashback or advance.',
      'When you enter your PIN, money leaves your account instead of arriving.',
      'The attacker asks again, claiming the first payment “failed”.',
    ],
    redFlags: [
      'Anyone asking you to enter a PIN to receive money',
      'Collect requests you did not start',
      'Buyers who insist on QR codes or advance payments',
      'Pressure to act quickly before a payment “expires”',
    ],
    protect: [
      'Never enter your UPI PIN to receive money',
      'Decline collect requests from people you do not know',
      'Confirm receipt in your bank passbook, not in a screenshot',
      'Set a daily UPI transaction limit in your bank app',
    ],
    ifVictim: [
      'Call your bank, block UPI and ask them to flag the transaction',
      'Call 1930 within the first few hours so a freeze request can be raised',
      'Note the transaction ID and the receiver’s UPI ID',
    ],
    example:
      'Scan this QR code and enter your PIN to receive your Rs 5,000 cashback.',
  },
  {
    id: 'sim_swap',
    title: 'SIM swap & SIM-block calls',
    group: 'banking',
    severity: 'Critical',
    summary:
      'Attackers take over your mobile number to intercept OTPs and reset your banking access.',
    overview:
      'By collecting personal details or tricking you into sharing SIM information, a fraudster obtains a duplicate SIM. Your phone loses service and your OTPs go to the attacker.',
    howItWorks: [
      'You get a call or message saying your SIM will be blocked or needs an upgrade.',
      'You are asked to press a key or share your SIM serial number or an OTP.',
      'The attacker uses this to request a duplicate SIM in your name.',
      'Your phone loses signal while passwords are reset and money is moved.',
    ],
    redFlags: [
      'Sudden loss of network with no explanation',
      'Calls asking you to press a key or read out your SIM number',
      'Alerts about password resets you did not request',
      'Requests to install a “network” or “KYC” app',
    ],
    protect: [
      'Never share your SIM number, OTP or Aadhaar details on a call',
      'Contact your operator at once if your phone shows “No service” unexpectedly',
      'Check the connections registered in your name on the Sanchar Saathi portal',
      'Report suspicious calls and messages through the Chakshu option on Sanchar Saathi',
    ],
    ifVictim: [
      'Call your operator and block the duplicate SIM',
      'Alert your bank and freeze cards and accounts',
      'Call 1930 and file a report',
    ],
    example:
      'Your SIM will be disconnected in 2 hours due to incomplete KYC. Press 9 to speak to an executive.',
  },
  {
    id: 'remote_access',
    title: 'Fake customer care & remote access',
    group: 'banking',
    severity: 'Critical',
    summary:
      'Fraudsters posing as support staff persuade you to install screen-sharing apps.',
    overview:
      'Fake helpline numbers appear in search results and on social media. The “agent” asks you to install a remote-access tool, which lets them see your screen, your OTPs and your banking apps.',
    howItWorks: [
      'You search for a customer care number and call a fake listing.',
      'The agent asks you to install AnyDesk, TeamViewer or a similar app.',
      'They ask for the connection code and watch you open your bank app.',
      'Money is moved out while you believe they are fixing your problem.',
    ],
    redFlags: [
      'Support numbers found only through search or social media',
      'Requests for a screen-sharing code',
      'Agents who ask you to open banking apps during the call',
      'Refunds that require you to “enter” an amount',
    ],
    protect: [
      'Take support numbers from the company’s official website or your card',
      'Never install screen-sharing apps at the request of a caller',
      'Close banking apps whenever someone else can see your screen',
    ],
    ifVictim: [
      'Disconnect from the internet and uninstall the tool',
      'Call your bank to block cards and net banking',
      'Change all passwords and call 1930',
    ],
    example:
      'To process your refund, please install AnyDesk and tell me the 9-digit code.',
  },
  {
    id: 'digital_arrest',
    title: 'Digital arrest scam',
    group: 'impersonation',
    severity: 'Critical',
    summary:
      'Fraudsters pose as police, CBI, customs or courts on a video call and claim you are under arrest.',
    overview:
      'No Indian agency arrests anyone, holds a hearing or collects “verification deposits” over a phone or video call. The scam relies on fear, isolation and secrecy.',
    howItWorks: [
      'A call claims a parcel or SIM linked to your Aadhaar was used in a crime.',
      'You are transferred to an “officer” on a video call in a staged office or uniform.',
      'You are told not to disconnect or speak to family while the “case” is investigated.',
      'You are asked to move your savings to a “safe” or “RBI verification” account.',
    ],
    redFlags: [
      'Any demand to stay on a video call for hours',
      'Instructions to keep the matter secret',
      'Requests to transfer money for verification or bail',
      'Forged notices and warrants sent over WhatsApp',
    ],
    protect: [
      'Hang up. Real agencies serve notices in person or through official channels',
      'Never transfer money to prove your innocence',
      'Talk to family or a friend before acting on any threat',
      'Verify by calling your local police station on a number you look up yourself',
    ],
    ifVictim: [
      'Call 1930 immediately and give the recipient account details',
      'Ask your bank to hold the beneficiary account',
      'Report at cybercrime.gov.in and keep call logs and screenshots',
    ],
    example:
      'This is an officer from the Narcotics Bureau. A parcel in your name contains illegal items. You are under digital arrest. Do not disconnect.',
  },
  {
    id: 'deepfake',
    title: 'Deepfake & voice-clone scams',
    group: 'impersonation',
    severity: 'High',
    summary:
      'AI-generated voices and videos imitate relatives, colleagues or officials to demand urgent money.',
    overview:
      'A few seconds of audio from social media can be enough to clone a voice. Attackers call in a panic as a family member or a manager and ask for money immediately.',
    howItWorks: [
      'Audio or video of the target is collected from public posts.',
      'A cloned voice or fake video call is used to imitate them.',
      'The story is an emergency: an accident, an arrest, a hospital bill.',
      'You are asked to send money quickly and to tell no one.',
    ],
    redFlags: [
      'Emergency requests from a new or unknown number',
      'Pressure to act at once and not tell others',
      'Payments to unfamiliar accounts',
      'Video that glitches or avoids natural movement',
    ],
    protect: [
      'Agree on a family safe word for emergencies',
      'Hang up and call the person back on their usual number',
      'Limit public voice and video posts',
      'Confirm any money request through a second channel',
    ],
    ifVictim: [
      'Call your bank to try to stop the transfer',
      'Call 1930 as quickly as possible',
      'Warn family members about the number that was used',
    ],
    example:
      'Papa, I had an accident and my phone is broken. Please send Rs 25,000 to this number right now.',
  },
  {
    id: 'investment',
    title: 'Investment & trading scams',
    group: 'money',
    severity: 'Critical',
    summary:
      'Fake stock, IPO and crypto platforms that show made-up profits until you deposit large sums.',
    overview:
      'Victims are added to WhatsApp or Telegram groups with “experts” and screenshots of gains. A convincing app shows growing balances, but withdrawals are blocked and extra “tax” or “fee” payments are demanded.',
    howItWorks: [
      'You are added to a group where fake members share profits.',
      'A “mentor” guides you to a trading app or website that is not a registered broker.',
      'Small early withdrawals work to build trust.',
      'When you deposit more, withdrawal is blocked behind fees, taxes or a minimum balance.',
    ],
    redFlags: [
      'Guaranteed or unusually high returns',
      'Advice from unknown people on messaging apps',
      'Apps installed from a link instead of an official store',
      'Payments to personal accounts or many different accounts',
    ],
    protect: [
      'Invest only through SEBI-registered brokers and advisers and verify them on the SEBI website',
      'Never install trading apps from links shared in chats',
      'Ignore stock tips in unsolicited groups',
      'Treat any guaranteed return as a fraud',
    ],
    ifVictim: [
      'Stop sending money, even to “release” your funds',
      'Call 1930 and report at cybercrime.gov.in with all payment details',
      'Save chats, app details and account numbers as evidence',
    ],
    example:
      'Join our VIP group for IPO allotment. Members made 40% last week. Limited seats.',
  },
  {
    id: 'jobs',
    title: 'Fake job & task scams',
    group: 'money',
    severity: 'High',
    summary:
      'Part-time offers that pay small amounts at first, then demand deposits to continue.',
    overview:
      'Task scams begin with an unsolicited message offering easy income for liking videos or rating products. After a few small payouts you are pushed to “prepay” for higher-paying tasks, and the money cannot be withdrawn.',
    howItWorks: [
      'You get a WhatsApp or Telegram message about a flexible part-time job.',
      'You complete simple tasks and receive a small payment.',
      'You are added to a group and asked to deposit for premium tasks.',
      'Every deposit is followed by a new fee until you stop.',
    ],
    redFlags: [
      'Job offers from unknown numbers',
      'High pay for very little work',
      'Any registration, training or equipment fee',
      'Recruiters who only use messaging apps',
    ],
    protect: [
      'Genuine employers do not charge candidates',
      'Verify the company on its official website and careers page',
      'Do not join task or investment groups',
      'Report and block the sender',
    ],
    ifVictim: [
      'Stop paying and ignore withdrawal demands',
      'Call 1930 and report the accounts you paid',
      'Keep chat history and payment receipts',
    ],
    example:
      'Earn Rs 3,000 to 8,000 a day by rating hotels. No experience needed. Contact our coordinator on Telegram.',
  },
  {
    id: 'loan_apps',
    title: 'Instant loan app harassment',
    group: 'money',
    severity: 'High',
    summary:
      'Unregulated lending apps that access your contacts and threaten you to force repayment.',
    overview:
      'These apps promise fast loans and ask for access to your contacts and photos. Borrowers receive less than promised, face very high charges and are harassed, sometimes with morphed images sent to relatives.',
    howItWorks: [
      'An app offers instant approval with almost no paperwork.',
      'It requests access to contacts, gallery and SMS.',
      'A smaller amount than approved reaches you after heavy fees.',
      'Threats and abusive messages follow, sometimes to your contacts.',
    ],
    redFlags: [
      'Loan apps installed from links or outside the official store',
      'Permission requests for contacts and photos',
      'Very short repayment periods and hidden fees',
      'Threatening calls before the due date',
    ],
    protect: [
      'Borrow only from RBI-regulated banks and NBFCs or their partner apps',
      'Deny contact and gallery permissions',
      'Read the fees and interest before accepting',
      'Never pay through links sent by recovery agents',
    ],
    ifVictim: [
      'Do not pay extra “settlement” amounts under threat',
      'Screenshot messages and call logs',
      'Report at cybercrime.gov.in',
    ],
    example:
      'Pay Rs 8,000 today or we will send your photos to everyone in your contact list.',
  },
  {
    id: 'sextortion',
    title: 'Sextortion & blackmail',
    group: 'social',
    severity: 'Critical',
    summary:
      'Fraudsters use intimate or morphed content to threaten you into paying.',
    overview:
      'Contact starts on social media or a video chat. The attacker records or fabricates compromising content and threatens to share it. Paying rarely ends the demands.',
    howItWorks: [
      'A friendly stranger builds rapport and moves the chat to video.',
      'Compromising content is recorded or created with editing tools.',
      'You receive threats to send it to family, friends or your employer.',
      'Payment demands increase after every transfer.',
    ],
    redFlags: [
      'Unknown people who quickly move the chat to video',
      'Requests for intimate photos or calls',
      'Threats with a deadline and a payment demand',
      'Fake “police” contacts who add more pressure',
    ],
    protect: [
      'Do not accept video calls from strangers',
      'Keep social media privacy settings restricted',
      'Never share intimate images',
      'Remember that you are the victim, not the offender',
    ],
    ifVictim: [
      'Do not pay, and stop replying',
      'Preserve chats, numbers and account links',
      'Report at cybercrime.gov.in or call 1930, and talk to someone you trust',
    ],
    example:
      'We have your video. Send Rs 20,000 within the hour or it goes to all your contacts.',
  },
  {
    id: 'account_takeover',
    title: 'WhatsApp & social account takeover',
    group: 'social',
    severity: 'High',
    summary:
      'Attackers hijack your account with a verification code, then ask your contacts for money.',
    overview:
      'A message or call convinces you to share a 6-digit verification code. With it, the attacker registers your number on their phone and messages your contacts pretending to be you.',
    howItWorks: [
      'You get a message asking you to “return” a code sent by mistake.',
      'The code is your account’s verification code.',
      'The attacker signs in as you and locks you out.',
      'Your contacts receive urgent requests for money.',
    ],
    redFlags: [
      'Anyone asking for a code you just received',
      'Messages from friends asking for urgent money or gift cards',
      'Being logged out of your account without warning',
      'Links that ask you to “verify” your account',
    ],
    protect: [
      'Never share verification codes with anyone',
      'Turn on two-step verification in WhatsApp and other apps',
      'Call a friend before sending money on a chat request',
      'Review linked devices regularly',
    ],
    ifVictim: [
      'Re-register your number to regain control and log out other devices',
      'Warn your contacts that messages from your account are fake',
      'Report on 1930 if anyone paid money',
    ],
    example:
      'Hi, I sent my code to your number by mistake. Can you please send it back?',
  },
  {
    id: 'shopping',
    title: 'Online shopping & marketplace fraud',
    group: 'shopping',
    severity: 'Medium',
    summary:
      'Fake stores, and fake buyers or sellers on classifieds who take your money and disappear.',
    overview:
      'Fake websites and social media stores advertise deep discounts. On classified platforms, sellers ask for advance payment, while fake buyers use refund tricks to pull money from your account.',
    howItWorks: [
      'An advert shows a popular item at a very low price.',
      'You pay online or send an advance to “reserve” the product.',
      'The seller stops responding, or sends a poor or empty package.',
      'On classifieds, a “buyer” sends a QR code or collect request to pay you.',
    ],
    redFlags: [
      'Prices far below the market rate',
      'Websites with no address, reviews or return policy',
      'Payment only by UPI transfer to a personal account',
      'Buyers who send QR codes or “advance” links',
    ],
    protect: [
      'Prefer cash on delivery or well-known platforms with buyer protection',
      'Check the website address and read independent reviews',
      'Meet in person and inspect before paying on classifieds',
      'Never scan a QR code to receive money',
    ],
    ifVictim: [
      'Save the advert, chats and payment proof',
      'Raise a dispute with your bank or card issuer',
      'Report at cybercrime.gov.in',
    ],
    example:
      'Brand-new phone, sealed box, only Rs 9,999 today. Pay Rs 2,000 advance to book.',
  },
  {
    id: 'courier',
    title: 'Courier & parcel scams',
    group: 'shopping',
    severity: 'High',
    summary:
      'Fake delivery notices that push you to pay a small fee or install a malicious app.',
    overview:
      'A message claims a parcel is held because of an address or customs issue. The link asks for card details or installs an APK file that can read your SMS and OTPs.',
    howItWorks: [
      'You receive a delivery-failure SMS from a personal number with a link.',
      'The page asks for a small redelivery fee or offers a “tracking app”.',
      'Card details are captured or the app is installed.',
      'With access to your SMS, the attacker approves payments using your OTPs.',
    ],
    redFlags: [
      'Delivery messages for parcels you are not expecting',
      'Files ending in .apk sent by SMS or WhatsApp',
      'Small fee requests on unfamiliar pages',
      'A sender that is a mobile number and not a registered sender ID',
    ],
    protect: [
      'Track parcels only on the courier’s official website or app',
      'Install apps only from the Play Store or App Store',
      'Turn off “install unknown apps” for your browser and messaging apps',
    ],
    ifVictim: [
      'Switch on airplane mode and uninstall the unknown app',
      'Block your cards and change banking passwords from another device',
      'Call 1930 if any money has left your account',
    ],
    example:
      'India Post: your parcel is held due to an incorrect address. Update within 24 hours: postal-track.apk',
  },
];

export const getFraudById = (id) =>
  FRAUD_CATEGORIES.find((f) => f.id === id) || FRAUD_CATEGORIES[0];

export const getGroupLabel = (groupId) =>
  (FRAUD_GROUPS.find((g) => g.id === groupId) || {}).label || '';

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
