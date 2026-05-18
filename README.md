<p align="center">
  <img src="https://github.com/IhorFlowZenith/ContactList/blob/master/src/assets/screenshots/img.png" width="100%" alt="ContactList Screenshot" />
</p>

<div align="center">

# 📇 ContactList

**Modern Contacts Manager** — *Add, edit, organize, and sync your contacts with style.*

[![React Native](https://img.shields.io/badge/React_Native-0.82-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Kotlin](https://img.shields.io/badge/Kotlin-2.1-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)](https://kotlinlang.org)
[![Jest](https://img.shields.io/badge/Jest-29-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br />

[Features](#features) •
[Tech Stack](#-tech-stack) •
[Architecture](#-project-architecture) •
[Getting Started](#-getting-started) •
[Build](#-build) •
[Tests](#-tests) •
[Technical Deep Dive](#-technical-deep-dive)

</div>

---

## 📖 About

**ContactList** is a cross-platform mobile application built with **React Native** that provides a full-featured contacts manager — far beyond a basic CRUD app. It features smooth animations, dark/light theming with 30+ accent colors, bilingual support (Ukrainian/English), import/export in multiple formats, and seamless integration with the Android native contacts system.

```
┌─────────────────────────────────────────┐
│  Alphabetical grouping · Smart sorting  │
│   Dual storage · Composite-key favorites│
└─────────────────────────────────────────┘
```

The app includes a rich contact form (name, multiple phones, email, birthday, addresses, website, job title, notes, avatar), swipe-to-delete, multi-select mode, real-time search, and a complete settings panel with theme customization, language switching, data import/export, and built-in help/FAQ.

---

## ✨ Features

| # | Feature | Details |
|:--:|---------|---------|
| 📇 | **Rich Contact Form** | Name (first/last/middle/nickname), multiple phones with labels, email, birthday, addresses, website, job title, notes, avatar |
| 🔍 | **Live Search** | Filter contacts by name or phone number in real-time |
| ⭐ | **Favorites** | Star any contact, dedicated Favorites tab with persistent composite-key storage |
| ✨ | **Multi-Select** | Long press to enter selection mode, select all, bulk delete with animated checkboxes |
| 🗑️ | **Swipe-to-Delete** | Gesture-handler swipeable cards with animated delete button |
| 📲 | **Device Sync** | Read/write directly to Android native phonebook contacts |
| 📤 | **Import / Export** | JSON, CSV, and vCard 3.0 formats with auto-detection |
| 🌗 | **Dark / Light / Auto** | Dynamic theming following system or manual override |
| 🎨 | **30+ Accent Colors** | Full color picker with separate dark/light variants per color |
| 🌐 | **Bilingual** | Ukrainian 🇺🇦 and English 🇬🇧 with reactive translation |
| 💀 | **Skeleton Loader** | Shimmer animation while contacts load |
| 🔐 | **Permissions Screen** | Real-time status for Contacts, Camera, Gallery access |
| 📋 | **QR Code** | Generate vCard QR code from any contact for easy sharing |
| 📝 | **Settings & Help** | Theme, language, name format, FAQ accordion, feedback form, legal screens |

---

## 🛠 Tech Stack

### Frontend & Core

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | React Native (CLI) | `0.82.1` | Cross-platform mobile framework |
| **Language** | TypeScript | `5.8.3` | Static typing & developer experience |
| **UI Library** | React | `19.1.1` | Component-based UI architecture |
| **Navigation** | @react-navigation/native | `7.1.20` | Screen routing & lifecycle |
| **Stack Nav** | @react-navigation/native-stack | `7.6.3` | Native stack-based screen transitions |
| **Bottom Tabs** | @react-navigation/bottom-tabs | `7.8.5` | Tab-based navigation |
| **Gestures** | react-native-gesture-handler | `2.29.1` | Native gesture handling (swipe, long press) |
| **Safe Area** | react-native-safe-area-context | `5.5.2` | Notch/island-safe rendering |
| **Screen Mgmt** | react-native-screens | `4.18.0` | Native screen containers |
| **SVG** | react-native-svg | `15.15.0` | Vector graphics (QR codes) |

### Data & Services

| Library | Version | Purpose |
|---------|---------|---------|
| react-native-contacts | `8.0.7` | Android native contacts API |
| @react-native-async-storage/async-storage | `2.2.0` | Persistent local storage |
| react-native-image-picker | `8.2.1` | Camera & gallery image capture |
| react-native-permissions | `5.4.4` | Runtime permission management |
| react-native-fs | `2.20.0` | File system read/write |
| react-native-blob-util | `0.23.2` | Blob utility for file export |
| @react-native-documents/picker | `11.0.0` | Document picker for import |
| react-native-vector-icons | `10.3.0` | Icon library (Ionicons) |
| react-native-qrcode-svg | `6.3.20` | QR code generation |
| react-native-view-shot | `4.0.3` | View screenshot capture |

### Tooling & Quality

| Tool | Version | Purpose |
|------|---------|---------|
| **Bundler** | Metro (`0.82.1`) | JavaScript bundle & asset pipeline |
| **Testing** | Jest `29.6.3` + react-test-renderer | Component & snapshot testing |
| **Linting** | ESLint 8 (`@react-native/eslint-config`) | Code quality & consistency |
| **Formatting** | Prettier `2.8.8` | Opinionated code formatting |
| **Babel** | `@react-native/babel-preset` `0.82.1` | JSX & modern JS transpilation |

### Android Build

| Component | Version |
|-----------|---------|
| **Language** | Kotlin `2.1.20` |
| **Build Tool** | Gradle via wrapper |
| **SDK** | compileSdk 36, minSdk 24, targetSdk 36 |
| **Build Tools** | `36.0.0` |
| **NDK** | `27.1.12297006` |
| **JS Engine** | Hermes (enabled) |
| **App ID** | `com.contactlist` |

---

## 📂 Project Architecture

```
ContactList/
│
├── __tests__/
│   └── App.test.tsx                  # Render test
│
├── android/                          # Native Android project (Kotlin + Gradle)
│   ├── app/
│   │   ├── build.gradle              # App-level config (SDK, signing, Hermes)
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── java/com/contactlist/
│   │           ├── MainActivity.kt
│   │           └── MainApplication.kt
│   ├── build.gradle                  # Root Gradle config
│   └── gradle.properties             # Hermes, SDK, architecture flags
│
├── src/
│   ├── assets/
│   │   └── screenshots/              # App preview images
│   │
│   ├── components/
│   │   ├── Avatar.tsx                # 👤 Initials or photo avatar
│   │   ├── ColorPicker.tsx           # 🎨 30-color modal picker
│   │   ├── ContactCard.tsx           # 📇 Animated card with selection mode
│   │   ├── CustomActionSheet.tsx     # 📋 Bottom sheet action picker
│   │   ├── CustomAlert.tsx           # ⚠️ Themed modal alert
│   │   ├── CustomPrompt.tsx          # ✏️ Text input modal
│   │   ├── SearchBar.tsx             # 🔍 Search input with clear button
│   │   ├── SkeletonLoader.tsx        # 💀 Shimmer loading placeholder
│   │   └── SwipeableContactCard.tsx  # 👆 Gesture-handler swipe wrapper
│   │
│   ├── contexts/
│   │   ├── ContactsContext.tsx        # 📇 Contacts state + CRUD operations
│   │   ├── SettingsContext.tsx        # ⚙️ User preferences + persistence
│   │   └── ThemeContext.tsx           # 🎨 Dynamic theming with accent color
│   │
│   ├── hooks/
│   │   └── useTranslation.ts         # 🌐 Reactive translation hook
│   │
│   ├── i18n/
│   │   ├── index.ts                  # t() function + language switching
│   │   └── translations.ts           # 🇺🇦 UK / 🇬🇧 EN string keys
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx          # 🚀 Native stack navigator
│   │
│   ├── screens/
│   │   ├── MainContactsScreen.tsx    # 🏠 Main contacts list + tabs + search
│   │   ├── ContactDetailsScreen.tsx  # 📇 Contact detail with actions
│   │   ├── EditContactScreen.tsx     # ✏️ Add / edit contact form
│   │   ├── SettingsScreen.tsx        # ⚙️ Full settings panel
│   │   ├── PermissionsScreen.tsx     # 🔐 Permission status viewer
│   │   ├── HelpCenterScreen.tsx      # ❓ FAQ accordion
│   │   ├── FeedbackScreen.tsx        # 💬 In-app feedback form
│   │   ├── PrivacyPolicyScreen.tsx   # 📄 Privacy policy
│   │   └── TermsOfUseScreen.tsx      # ⚖️ Terms of use
│   │
│   ├── services/
│   │   ├── contactsService.ts        # 📲 Android native contacts read/write
│   │   ├── imageService.ts           # 📷 Camera & gallery with permissions
│   │   ├── importExport.ts           # 📤 JSON / CSV / VCF import & export
│   │   └── storage.ts                # 💾 AsyncStorage abstraction layer
│   │
│   ├── theme/
│   │   └── colors.ts                 # 🎨 Light/dark theme factory functions
│   │
│   ├── types/
│   │   └── index.ts                  # 📦 Contact, Settings, PhoneNumber types
│   │
│   └── utils/
│       └── formatName.ts             # 🔤 First/last name formatting
│
├── App.tsx                           # 🚀 Root component (providers + navigation)
├── index.js                          # Entry point (AppRegistry)
│
├── package.json
├── tsconfig.json
├── metro.config.js
├── babel.config.js
├── jest.config.js
├── .eslintrc.js
├── .prettierrc.js
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Check |
|-------------|---------|-------|
| **Node.js** | `>= 20` | `node --version` |
| **npm** | (bundled) | `npm --version` |
| **Java** (Android) | `>= 17` | `java --version` |
| **Android SDK** | `API 36` | `sdkmanager --list` |

> 💡 New to React Native? Follow the [official environment setup guide](https://reactnative.dev/docs/environment-setup).

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/IhorFlowZenith/ContactList.git
cd ContactList

# 2. Install JS dependencies
npm install
```

### Running the App

```bash
# Start Metro bundler (keep this running)
npm start

# In a separate terminal:
npm run android     # Run on Android emulator / device
```

### Required Permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.WRITE_CONTACTS" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
```

---

## 📋 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm start` | `react-native start` | Start Metro development server |
| `npm run android` | `react-native run-android` | Build & launch on Android |
| `npm test` | `jest` | Run the test suite |
| `npm run lint` | `eslint .` | Lint all source files |

---

## 🧪 Tests

```bash
npm test

# Watch mode (for development)
npm test -- --watch
```

The test suite renders the full component tree with `react-test-renderer` under `ReactTestRenderer.act()`, verifying the application mounts without errors.

```
 PASS  __tests__/App.test.tsx
  ✓ renders correctly (42 ms)

Tests:    1 passed, 1 total
Snapshots: 0 total
Time:     1.234 s
```

---

## 🔧 Build

### Android — Release APK

```bash
cd android

# Debug APK (quick test)
./gradlew assembleDebug

# Release APK (signed)
./gradlew assembleRelease

# Android App Bundle (for Google Play)
./gradlew bundleRelease
```

Artifacts are output to:

```
android/app/build/outputs/apk/debug/app-debug.apk
android/app/build/outputs/apk/release/app-release.apk
android/app/build/outputs/bundle/release/app-release.aab
```

> ⚠️ Before building a release APK, configure your keystore in `android/gradle.properties`:
> ```
> MYAPP_UPLOAD_STORE_FILE=my-release-key.keystore
> MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
> MYAPP_UPLOAD_STORE_PASSWORD=***
> MYAPP_UPLOAD_KEY_PASSWORD=***
> ```

---

## 🔬 Technical Deep Dive

### Navigation Architecture

```
AppNavigator (Native Stack)
├── MainContacts (headerShown: false)
│     (in-app tab bar: All | Favorites)
├── ContactDetails
│     └── EditContact
├── Settings
│     ├── Permissions
│     ├── HelpCenter
│     └── Feedback
├── PrivacyPolicy
└── TermsOfUse
```

### Data Flow

```
┌──────────────┐   search/filter   ┌──────────────┐
│ MainContacts │ ───────────────> │ ContactsCtx  │
│ (SectionList)│ <─────────────── │ (global      │
│              │                  │  state)      │
└──────────────┘                  └──────┬───────┘
     │   add/edit/delete                  │
     ▼                                    ▼
┌──────────────┐                  ┌──────────────┐
│ EditContact  │ ──> CRUD ──>    │ contactsSvc  │
│ DetailScreen │                  │ (native API) │
└──────────────┘                  └──────┬───────┘
     │                                    │
     ▼                                    ▼
┌──────────────┐                  ┌──────────────┐
│  SettingsCtx │                  │  AsyncStor.  │
│ (persistent) │                  │  (fallback)  │
└──────────────┘                  └──────────────┘
     │
     ▼
┌──────────────┐
│  ThemeCtx    │  ← settings.theme + settings.accentColor
└──────────────┘
```

### State Management

| Context | State | Methods | Consumers |
|---------|-------|---------|-----------|
| **SettingsContext** | `theme`, `language`, `nameFormat`, `accentColor` | `updateSettings()` | `ThemeContext`, `useTranslation`, `formatName` |
| **ThemeContext** | `theme: Theme` (computed from settings + system) | — (derived) | All screens via `useTheme()` |
| **ContactsContext** | `contacts[]`, `localContacts[]`, `favoriteIds[]`, `loading` | `addContact()`, `updateContact()`, `deleteContact()`, `toggleFavorite()`, `loadContactsFromDevice()`, `importContactsData()` | `MainContactsScreen`, `ContactDetailsScreen`, `EditContactScreen` |

### Dual Storage Strategy

```
┌─────────────────────────────────────────────────────┐
│                  User Action                        │
│                         │                           │
│          ┌──────────────┴──────────────┐            │
│          ▼                             ▼            │
│   Native Contacts API           AsyncStorage       │
│   (react-native-contacts)     (local_ prefixed)    │
│          │                             │            │
│          └──────────────┬──────────────┘            │
│                         ▼                           │
│              Merged in ContactsContext              │
│              (transparent to UI)                    │
└─────────────────────────────────────────────────────┘
```

When device contact permission is granted, contacts are read from the Android native phonebook. When permission is denied or writing fails, contacts fall back to local AsyncStorage with `local_` prefixed IDs. Both sources are merged transparently in the UI.

### Smart Favorites System

Favorites are persisted using a **composite key** (`firstName_lastName_phone`) rather than a contact ID. This design ensures favorites survive:
- Re-imports from native contacts
- Device contact sync restarts
- Database resets

### Custom UI Components

All interaction modals are custom-built for consistent theming:

| Component | Purpose | Animations |
|-----------|---------|------------|
| `CustomAlert` | Modal alert dialog | Overlay fade, spring scale |
| `CustomActionSheet` | Bottom sheet with options | Slide-up animation |
| `CustomPrompt` | Text input dialog | Fade + spring |
| `ColorPicker` | 30-color grid picker | Scrollable modal |
| `SkeletonLoader` | Loading shimmer | Looping opacity fade (0.3↔0.7) |
| `ContactCard` | Animated contact card | Spring checkboxes, scale on press |
| `SwipeableContactCard` | Swipe-to-delete | Gesture-handler swipe, scale delete button |

### Design Tokens

```typescript
// Light Theme (default accent #007AFF)
background:           '#F2F2F7'    // Main background
backgroundSecondary:  '#FFFFFF'    // Card / surface
backgroundTertiary:   '#E5E5EA'    // Muted surfaces
text:                 '#000000'    // Primary text
textSecondary:        '#8E8E93'    // Secondary text
textTertiary:         '#C7C7CC'    // Tertiary text
primary:              '#007AFF'    // Brand accent
destructive:          '#FF3B30'    // Delete / danger
separator:            '#C6C6C8'    // Dividers
card:                 '#FFFFFF'    // Card background

// Dark Theme (default accent #0A84FF)
background:           '#000000'    // Main background
backgroundSecondary:  '#1C1C1E'    // Card / surface
backgroundTertiary:   '#2C2C2E'    // Elevated surfaces
text:                 '#FFFFFF'    // Primary text
textSecondary:        '#8E8E93'    // Secondary text
textTertiary:         '#48484A'    // Tertiary text
primary:              '#0A84FF'    // Brand accent
destructive:          '#FF453A'    // Delete / danger
separator:            '#38383A'    // Dividers
card:                 '#1C1C1E'    // Card background
```

### Key Patterns

| Pattern | Implementation | Benefit |
|---------|---------------|---------|
| **Context-based state management** | Three layered providers (Settings → Theme → Contacts) | No external state library, reactive updates |
| **Dual storage strategy** | Native contacts API + AsyncStorage fallback | Works with or without permissions |
| **Composite-key favorites** | `firstName_lastName_phone` composite key | Survives re-imports and device resets |
| **Service layer separation** | Business logic in `services/` not in components | Clean architecture, testable |
| **Custom modal components** | `CustomAlert`, `CustomActionSheet`, `CustomPrompt` | Consistent theming across all dialogs |
| **Delta translations** | `t()` function with fallback to `uk` key | No missing translations, graceful degradation |
| **Animated UX** | `Animated.spring`, `Animated.loop`, gesture handler | Smooth, native-feeling interactions |
| **Smart SectionList sorting** | Ukrainian → English → Numbers | Locale-aware alphabetical grouping |

### Import / Export Pipeline

```
┌──────────┐    Format Auto-Detect    ┌──────────┐
│  Export  │ ──────────────────────>  │  File    │
│ JSON/CSV │                          │  System  │
│ /VCF     │ ──> RNFS + BlobUtil ──> │ (action  │
│          │                          │ ViewIntent)
└──────────┘                          └──────────┘

┌──────────┐    Extension/Content     ┌──────────┐
│  Import  │ <────────────────────── │  Doc.    │
│          │    Auto-Detect Format   │  Picker  │
│ JSON/CSV │                          │          │
│ /VCF     │ ──> Parse & Normalize ─> │ Contacts │
└──────────┘                          └──────────┘
```

- **Export**: Serializes contacts to file, writes to device filesystem, opens via Android's `actionViewIntent`
- **Import**: Auto-detects format by file extension or content inspection (`{`/`[` → JSON, `BEGIN:VCARD` → VCF, else CSV)
- **CSV**: Handles quoted fields properly
- **VCF**: Parses N, FN, TEL (with CELL/WORK/HOME labels), EMAIL, BDAY, ADR, URL, NOTE, TITLE, NICKNAME

---

## 🏗 Android Build Details

| Property | Value |
|----------|-------|
| **namespace / applicationId** | `com.contactlist` |
| **compileSdk** | `36` (Android 16) |
| **minSdk** | `24` (Android 7.0) |
| **targetSdk** | `36` |
| **versionCode** | `1` |
| **versionName** | `1.0` |
| **NDK Version** | `27.1.12297006` |
| **Build Tools** | `36.0.0` |
| **Kotlin** | `2.1.20` |
| **New Architecture** | ❌ Disabled |
| **Hermes** | ✅ Enabled |
| **ProGuard** | ❌ Disabled |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💻 Make your changes
4. ✅ Run tests (`npm test`) and lint (`npm run lint`)
5. 📝 Commit (`git commit -m 'feat: add amazing feature'`)
6. 🚀 Push (`git push origin feature/amazing-feature`)
7. 🔄 Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

```
MIT License

Copyright (c) 2026 IhorFlowZenith

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

<p align="center">
  <sub>Built with ❤️ using React Native · TypeScript · Kotlin</sub>
  <br />
  <sub>© 2026 IhorFlowZenith</sub>
</p>
