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
