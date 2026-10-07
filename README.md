# CyberAkshak 🛡️

**CyberAkshak** is a mobile cyber-fraud awareness, real-time threat intelligence, and safety application designed to protect citizens across India from digital scams, financial fraud, phishing, and online security threats.

---

## 🌟 Key Features

- **Cyber Fraud Education & Guides**: Comprehensive guides explaining common Indian scams (UPI/QR fraud, digital arrest, phishing, part-time job task scams, loan apps, sextortion).
- **Real-Time Cyber News & Alerts**: Live news feed fetching verified cybersecurity alerts, advisories, and threat updates.
- **AI Safety Assistant (Chatbot)**: Intelligent assistant powered by a dedicated FastAPI backend to analyze suspicious calls, SMS, links, and messages.
- **Helpline 1930 Integration**: Quick action triggers for instant reporting to the National Cyber Crime Helpline (1930) and portal (`cybercrime.gov.in`).
- **Community Events & Webinars**: Up-to-date schedule of cyber safety workshops, webinars, and training sessions.
- **User Profile & Preferences**: Profile management and customizable application settings.

---

## 🏗️ Tech Stack

- **Framework**: React Native `0.87.1` (Plain JavaScript, no TypeScript)
- **Target Platform**: Android (primary launch target)
- **Navigation**: React Navigation 6 (`@react-navigation/native-stack` + `@react-navigation/bottom-tabs`)
- **Backend & Auth**: Supabase (PostgreSQL, Row Level Security, Supabase Auth with email/password and email OTP verification)
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Icons & UI**: `react-native-vector-icons` (Ionicons), custom design system (`src/constants/theme.js`)
- **Chatbot API**: External FastAPI backend (`chatService.js`) with local fallback detection (`analyzeUserQuery`).

---

## 📁 Repository Directory Structure

```
Cyberakshak/
├── App.js                       # Main application entry point & root providers
├── index.js                     # React Native app registration
├── firebase.js                  # Legacy Firebase Web SDK initialization
├── package.json                 # Project dependencies & scripts
├── android/                     # Android native project files
├── ios/                         # iOS native project files
├── docs/                        # Project architecture, database, & decisions documentation
│   ├── ARCHITECTURE.md          # Navigation tree, data flow & mermaid diagrams
│   ├── DECISIONS.md             # Backend tech stack choices & free-tier analysis
│   ├── DATABASE.md              # Database schema & RLS policy documentation
│   └── ADMIN_WEB_CONTRACT.md    # API contract for future admin dashboard
├── supabase/                    # Supabase SQL migrations and seed data
│   ├── migrations/              # Database migration SQL files
│   └── seed.sql                 # Sample initial database data
└── src/
    ├── Navigation/
    │   ├── HomeBottomNav.js     # Bottom tab navigation (Home, News, Events, Profile)
    │   └── Stacknavigation.js   # Root native stack navigator
    ├── Screens/
    │   ├── HomeScreen.js        # Main dashboard, quick actions, & threat scanner hero
    │   ├── NewsScreen.js        # Real-time cybersecurity news list & modal reader
    │   ├── EventsScreen.js      # Cyber safety events & workshops
    │   ├── FraudEducationScreen.js # In-depth fraud education guides & red flags
    │   ├── ChatbotScreen.js     # AI Chatbot conversational interface
    │   └── ProfileScreen.js     # User profile, preferences, & account actions
    ├── components/
    │   ├── fraud/               # Cards, pills, headers, & details for fraud guides
    │   └── profile/             # Profile header, edit sheet, & setting rows
    ├── config/
    │   ├── secrets.js           # API keys & endpoints (git-ignored)
    │   └── secrets.example.js   # Template for required environment secrets
    ├── constants/
    │   ├── theme.js             # Color palette, spacing, & font constants
    │   └── data.js              # Static datasets, guides, & fallback query responder
    └── services/
        ├── chatService.js       # External FastAPI Chatbot client
        ├── newsApi.js           # External News API client
        └── eventsService.js     # Events data service
```

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (`>= 22.11.0`)
- Android Studio with Android SDK (API 34+) and configured Android Emulator or physical device.
- Java Development Kit (JDK 17)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kanishkaangira/Cyberakshak.git
   cd Cyberakshak
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Secrets:**
   Copy `src/config/secrets.example.js` to `src/config/secrets.js`:
   ```bash
   cp src/config/secrets.example.js src/config/secrets.js
   ```
   Fill in your actual API keys and backend endpoints inside `src/config/secrets.js`.

---

## 🚀 Running the App

### Start Metro Bundler
```bash
npm start
```

### Run on Android Emulator / Device
```bash
npm run android
```

---

## 📦 Building a Release APK

To generate a standalone release APK for testing or deployment:

1. Navigate to the `android` directory and run Gradle assemble release:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
2. The generated APK will be available at:
   `android/app/build/outputs/apk/release/app-release.apk`

---

## 🔒 Secrets & Environment Setup

- **Secrets File**: `src/config/secrets.js` is ignored by Git and must **never** be committed.
- **Example File**: `src/config/secrets.example.js` is committed to version control to show required keys.
- **Service Keys**: Service-role keys or admin master credentials must never be included in the client app repository.
