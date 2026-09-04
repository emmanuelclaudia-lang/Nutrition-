# Nutrition+

Nutrition+ is an AI-powered food scanner app built with Expo and React Native. Users can take a photo of your meal and get an instant macro breakdown of calories, protein, carbs, and fat. This app is powered by Google's Gemini vision model.

Built with Expo (React Native) + Expo Router API routes.

<img width="213" height="436" alt="Home-Tab" src="https://github.com/user-attachments/assets/4da98143-b0be-47f0-b8ee-f1947f3e3ad4" />

<img width="215" height="437" alt="Home-Tab-2" src="https://github.com/user-attachments/assets/2af9062f-508c-4f21-8750-09a861602224" />

<img width="216" height="439" alt="Scan-Tab" src="https://github.com/user-attachments/assets/e47649d9-801f-4696-adb5-9b48c099079b" />

<img width="217" height="442" alt="Diary-Tab" src="https://github.com/user-attachments/assets/9810a15a-f579-4279-9a19-eedb65bc9075" />

## Features

- 📸 **Scan a meal** — snap a photo, AI identifies the food and estimates macros
- ✍️ **Describe a meal** — type what you ate instead, for meals that aren't easy to photograph
- ✏️ **Edit & recalculate** — correct a wrong item name or portion size, and the AI re-estimates
- 📊 **Daily dashboard** — track calories and macros against a personal goal
- 📓 **Meal diary** — see everything logged by breakfast/lunch/dinner/snack

## Tech stack

- [Expo](https://expo.dev) / React Native
- [Expo Router](https://docs.expo.dev/router/introduction/) (including API routes for the backend)
- [Google Gemini API](https://ai.google.dev/) for food recognition and macro estimation
- AsyncStorage for local persistence
- Deployed on [Vercel](https://vercel.com)

## Getting started

### Prerequisites

- Node.js 18+
- [Expo Go](https://expo.dev/go) app on your phone, or an iOS/Android simulator
- A free [Gemini API key](https://aistudio.google.com/) (Google AI Studio)

### Setup

1. Clone the repo:

```bash
   git clone https://github.com/YOUR_USERNAME/nutrition-plus.git
   cd nutrition-plus
```

2. Install dependencies:

```bash
   npm install
```

3. Copy the example env file and add your own Gemini key:

```bash
   cp .env.example .env
```

Then edit `.env`:
`GEMINI_API_KEY=your_gemini_api_key_here`
`EXPO_PUBLIC_API_BASE=http://localhost:8081` your local ip address

4. Start the dev server:

```bash
   npx expo start
```

5. Scan the QR code with Expo Go (iOS/Android), or press `w` for web.

## Project structure

app/
(tabs)/
index.tsx # Home dashboard
diary.tsx # Meal history
scan.tsx # Camera capture screen
api/
scan-food+api.ts # Photo → AI macro estimate
analyze-text+api.ts # Text description → AI macro estimate
recalculate-item+api.ts # Re-estimate a single corrected item
scan-result.tsx # Shared results/edit screen for both scan and manual entry
manual-entry.tsx # Text-based meal entry
settings.tsx # Calorie goal
utils/
mealStorage.ts # AsyncStorage read/write for saved meals
settingsStorage.ts # AsyncStorage read/write for user goals

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup details and how to submit a PR. Check the [Issues](../../issues) tab for open tasks, including some tagged `good first issue`.

## License

MIT
