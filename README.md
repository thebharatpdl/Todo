# Task Manager App
A beautiful and functional task management application built with Expo and React Native. Manage your projects and tasks with an intuitive interface.

## Features

- Create and manage projects
- Add, edit, and delete tasks
- Mark tasks as complete
- Beautiful UI with smooth animations
- Responsive design for all screen sizes
- Offline data persistence

## Technologies Used

- Expo
- React Native
- TypeScript
- AsyncStorage (for local data persistence)
- React Navigation
- Ionicons (for icons)

## Installation

### Prerequisites

- Node.js (v16 or later)
- Expo CLI (`npm install -g expo-cli`)
-  npm

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-manager-app.git
   cd task-manager-app
    expo start


### Running
iOS: expo run:ios

Android: expo run:android

Web: expo start --web






# Development Journey

## Challenges Faced

### State Management
Initially used prop drilling which became messy. Switched to Context API which helped, but in hindsight Zustand would've been better.

### Cross-Platform Quirks
- Keyboard behavior differences between iOS/Android
- Scroll performance on long lists
- Status bar padding inconsistencies

## Key Decisions

1. **Chose Expo Router** for file-based navigation
2. **Used FlatList optimizations** for performance
3. **Implemented swipe gestures** for quick actions
4. **Added undo functionality** after user feedback

## Lessons Learned

✔ Test on multiple devices EARLY  
✔ Animation planning saves time later  
✔ Error handling isn't optional  
✔ Users love small UX touches (like haptic feedback)

## Future Improvements

```mermaid
graph TD
    A[Next Version] --> B[Cloud Sync]
    A --> C[Dark Mode]
    A --> D[Natural Language Input]
    B --> E[Firebase Integration]
    C --> F[System Theme Detection]






