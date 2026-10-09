# AGENTS.md — AI Engineering Guidelines for CyberAkshak

This document defines hard architectural boundaries, stack constraints, and coding rules for AI coding assistants working in the **CyberAkshak** repository.

---

## 🛠️ Tech Stack Constraints

1. **React Native**: Version `0.87.1` plain JavaScript (No TypeScript convert/rewrite of existing components).
2. **Launch Target**: Android is the primary launch target.
3. **Styling System**:
   - Use Vanilla React Native `StyleSheet` objects.
   - Always reuse design tokens from `src/constants/theme.js` (`COLORS`, `SIZES`).
   - Do **NOT** introduce TailwindCSS or third-party styling frameworks.
4. **Navigation**: React Navigation 6 (`@react-navigation/native-stack` + `@react-navigation/bottom-tabs`).

---

## 🚨 HARD NEVER-TOUCH RULES

1. **Chatbot Isolation**:
   - `src/Screens/ChatbotScreen.js` and `src/services/chatService.js` may be edited ONLY for: bug fixes, lint/type/warning fixes, and crash fixes.
   - The request/response format of the chatbot API (URL, payload fields, response fields) must NOT change. If a fix needs that, stop and ask the owner.
   - Any change to these two files must be listed separately in the final report.
   - **NEVER** transmit personally identifiable data (name, email, phone number, user ID) to the chatbot server.
2. **Secrets & Security**:
   - **NEVER** commit secret keys, passwords, or service-role keys into Git.
   - Real secrets stay in `src/config/secrets.js` (git-ignored).
   - Public templates must be maintained in `src/config/secrets.example.js`.
3. **Dependency Lock**:
   - Do **NOT** upgrade React Native or major dependencies.
   - Any new package added must be explicitly documented and justified in `docs/DECISIONS.md`.
4. **UI Design Consistency**:
   - Do **NOT** alter existing visual layouts, color palettes, fonts, screen headers, or UI styling without explicit task instruction.
   - New screens (e.g. Auth flow) must match existing screen aesthetics.

---

## 📁 Folder Structure Map

```
src/
├── Navigation/          # Navigation stack & tab configurations
├── Screens/             # Top-level screen components
├── components/          # Reusable UI sub-components (fraud, profile)
├── config/              # Secret keys & configuration constants
├── constants/           # Global themes, static datasets, & fallback rules
└── services/            # API clients, auth services, & data access layer
```

---

## 💻 Key Terminal Commands

- **Run Android**: `npx react-native run-android`
- **Start Metro**: `npx react-native start`
- **Lint Check**: `npm run lint`
- **Test**: `npm test`
- **Build Release APK**: `cd android && ./gradlew assembleRelease`

---

## 🔄 Git & Commit Workflow

- All changes must be made on feature branches (e.g., `feature/auth-db`).
- Perform incremental work: one commit per discrete task.
- Ensure the app builds and runs cleanly after every commit.
