<div align="center">

<br/>

```
 ██████╗ ██████╗ ███╗   ██╗████████╗ █████╗  ██████╗████████╗    ██╗     ██╗███████╗████████╗
██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝    ██║     ██║██╔════╝╚══██╔══╝
██║     ██║   ██║██╔██╗ ██║   ██║   ███████║██║        ██║       ██║     ██║███████╗   ██║   
██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██║██║        ██║       ██║     ██║╚════██║   ██║   
╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╗   ██║       ███████╗██║███████║   ██║   
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝       ╚══════╝╚═╝╚══════╝   ╚═╝   
```

**A modern, feature-rich contacts manager for Android**  
*Built with React Native + TypeScript*

<br/>

[![React Native](https://img.shields.io/badge/React%20Native-0.73-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?style=flat-square&logo=android&logoColor=white)](https://www.android.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br/>

<img src="screenshot.png" alt="ContactList App Screenshots" width="100%"/>

<br/>

</div>

---

## ✨ Overview

**ContactList** is a fully-featured mobile contacts manager built from scratch as a college internship project. It goes far beyond a basic CRUD app — featuring smooth animations, dark/light theming, accent color customization, bilingual support, import/export in multiple formats, and seamless integration with the Android native contacts system.

---

## 📱 Features

### Core Functionality
- **View, add, edit and delete contacts** with a clean, intuitive interface
- **Alphabetical grouping** with smart sorting: Ukrainian → English → Numbers
- **Swipe-to-delete** on contact cards with animated gesture support
- **Multi-select mode** — long press to enter, select all, bulk delete
- **Favorites** — star any contact and switch to a dedicated Favorites tab
- **Search** — real-time filtering across name and phone number

### Contact Details
Each contact supports a rich set of fields:
| Field | Details |
|---|---|
| Name | First, Last, Middle name + Nickname |
| Phones | Multiple numbers with labels: Mobile, Work, Home, Main, Other |
| Email | Single email address |
| Birthday | Date picker with DD.MM.YYYY format |
| Addresses | Multiple addresses with Home / Work / Other labels |
| Website | URL field |
| Job Title | Occupation / position |
| Notes | Free-text multiline notes |
| Avatar | Photo from camera or gallery (stored as Base64) |

### Visual & UX
- 🌗 **Dark / Light / Auto theme** — follows system or manual override
- 🎨 **30+ accent colors** — full color picker with dark/light variants per color
- 💀 **Skeleton loader** — shimmer animation while contacts are loading
- ✅ **Animated checkboxes** — spring-animated selection mode with scale effects
- ⭐ **Favorite toggle animation** — smooth opacity/scale transition
- 🔄 **Swipeable cards** — native gesture handler with animated delete button

### Data & Storage
- 📲 **Device contacts sync** — reads and writes to Android native phonebook
- 💾 **Local contacts** — fallback storage for contacts without device permission
- 🖼️ **Separate avatar storage** — avatars stored independently in AsyncStorage
- 📤 **Export** — JSON, CSV, VCF (vCard 3.0)
- 📥 **Import** — JSON, CSV, VCF with smart format auto-detection

### Settings
- 🌐 **Language** — Ukrainian 🇺🇦 / English 🇬🇧
- 🔤 **Name format** — First Last or Last First
- 🔐 **Permissions screen** — real-time status for Camera, Gallery, Contacts
- ℹ️ **Help Center** — built-in FAQ
- 📝 **Feedback form** — in-app feedback screen
- 📄 **Privacy Policy & Terms of Use** — full legal screens

---

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components
│   ├── Avatar.tsx           — initials or photo avatar
│   ├── ContactCard.tsx      — animated card with selection mode
│   ├── SwipeableContactCard.tsx — gesture-handler swipe wrapper
│   ├── SkeletonLoader.tsx   — shimmer loading placeholder
│   ├── SearchBar.tsx        — search input with clear button
│   ├── ColorPicker.tsx      — 30-color modal picker
│   ├── CustomAlert.tsx      — themed alert modal
│   ├── CustomActionSheet.tsx — bottom sheet with options
│   └── CustomPrompt.tsx     — input dialog modal
│
├── screens/             # Full screen views
│   ├── MainContactsScreen.tsx
│   ├── ContactDetailsScreen.tsx
│   ├── EditContactScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── PermissionsScreen.tsx
│   ├── HelpCenterScreen.tsx
│   ├── FeedbackScreen.tsx
│   ├── PrivacyPolicyScreen.tsx
│   └── TermsOfUseScreen.tsx
│
├── contexts/            # React Context providers
│   ├── ContactsContext.tsx  — contacts state + CRUD operations
│   ├── SettingsContext.tsx  — user preferences + persistence
│   └── ThemeContext.tsx     — dynamic theming with accent color
│
├── services/            # Business logic & external APIs
│   ├── contactsService.ts   — Android native contacts read/write
│   ├── imageService.ts      — camera & gallery with permissions
│   ├── importExport.ts      — JSON / CSV / VCF import & export
│   └── storage.ts           — AsyncStorage abstraction layer
│
├── i18n/                # Internationalization
│   ├── index.ts             — t() function + language switching
│   └── translations.ts      — UK / EN string keys
│
├── hooks/
│   └── useTranslation.ts    — reactive translation hook
│
├── theme/
│   └── colors.ts            — light/dark theme factory functions
│
├── types/
│   └── index.ts             — Contact, Settings, PhoneNumber types
│
├── utils/
│   └── formatName.ts        — first/last name formatting
│
└── navigation/
    └── AppNavigator.tsx     — stack navigator with themed headers
```

---

## 🛠️ Tech Stack

| Category | Library |
|---|---|
| Framework | React Native 0.73 |
| Language | TypeScript |
| Navigation | React Navigation (Native Stack) |
| Gestures | React Native Gesture Handler |
| Contacts API | react-native-contacts |
| Image Picker | react-native-image-picker |
| Permissions | react-native-permissions |
| File System | react-native-fs |
| Blob Utility | react-native-blob-util |
| Document Picker | @react-native-documents/picker |
| Storage | @react-native-async-storage/async-storage |
| Icons | react-native-vector-icons (Ionicons) |
| Safe Area | react-native-safe-area-context |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- JDK 17
- Android Studio + Android SDK
- React Native CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/IhorFlowZenith/ContactList.git
cd ContactList

# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android
```

### Required Permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.WRITE_CONTACTS" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

---

## 🔑 Key Implementation Highlights

### Smart Favorites System
Favorites are persisted using a composite key (`firstName_lastName_phone`) rather than ID — this ensures favorites survive re-imports and device contact sync restarts.

### Dual Storage Strategy
Contacts are loaded from the Android native phonebook when permission is granted. When permission is denied or writing fails, contacts fall back to local AsyncStorage with `local_` prefixed IDs. Both storages are merged transparently in the UI.

### Dynamic Theming
`ThemeContext` computes the current theme from three inputs: user preference (`auto`/`light`/`dark`), system color scheme, and a custom accent color. The `ColorPicker` provides 30 colors, each with separate dark and light variants for optimal contrast in both modes.

### Import/Export Pipeline
The export service serializes contacts to JSON, CSV, or vCard 3.0 format, writes to the device filesystem, and opens it via Android's `actionViewIntent`. Import auto-detects format by file extension or content inspection, then maps external data back to the internal `Contact` type with label normalization.

---

## 👨‍💻 Author

**Ihor Pelykh**

[![GitHub](https://img.shields.io/badge/GitHub-IhorFlowZenith-181717?style=flat-square&logo=github)](https://github.com/IhorFlowZenith)