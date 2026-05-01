# Metronome

A small cross-platform metronome for iOS and Android built with Expo, React Native, and TypeScript.

## Features

- Adjustable BPM from 30 to 240
- BPM can be changed while running
- Start and stop playback
- Audible metronome clicks with accented downbeats
- Visual beat pulse that continues while muted
- Supported time signatures: 2/4, 3/4, 4/4, and 6/8
- Time signature changes are applied immediately during playback
- Sound is enabled by default
- Mute stops audio only; visual pulse keeps running
- Stops when the app moves to the background
- Keeps the screen awake only while running
- Dark purple single-screen UI

## Tech Stack

- Expo
- React Native
- TypeScript
- expo-audio
- expo-keep-awake
- react-native-reanimated
- React Native Paper
- @react-native-community/slider

## Run Locally

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Then:

- scan the QR code with **Expo Go** on iOS or Android, or
- press **a** to open an Android emulator

## Development

Run lint:

```bash
npm run lint
```

Run type checks:

```bash
npm run typecheck
```

## Design / Technical Decisions

### Focused single-screen UI

I focused on the core metronome experience: selecting a tempo, choosing a time signature, and starting playback with clear audio and visual beat feedback.

### Visual beat feedback

Instead of displaying changing beat counters or dense beat indicators, the app uses a pulse and ripple animation. This keeps the UI clean and scales well across different time signatures.

### Audio

The app uses `expo-audio` with short local WAV click samples for simple playback.

A stronger click is used for accented beats, while weaker clicks are used for regular beats.

### Wake lock / app lifecycle

The screen stays awake only while the metronome is running. Playback stops when the app moves to the background.

## Known Limitations / Tradeoffs

- Beat scheduling is implemented in JavaScript, so timing may not be perfectly precise under heavy device load.
- For a production-grade musical metronome, a native audio scheduler or pre-scheduled audio buffer would provide tighter timing.
- Time signatures are limited to common presets: 2/4, 3/4, 4/4, and 6/8.
- Only one click sound style is currently supported.

## Improvements With More Time

- Tap tempo
- Custom time signatures
- Multiple sound profiles
- Haptic feedback
- Saved tempo presets
- Subdivision and accent customization
- Improved timing precision using a native scheduling approach
