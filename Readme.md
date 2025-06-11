# Weather App - React Native Expo

A modern weather application built with React Native, Expo, and Tailwind CSS. Get real-time weather information and 7-day forecasts.

## Features

- Real-time weather data (temperature, humidity, wind speed, visibility)
- 7-day weather forecast
- Location search functionality
- Modern UI with glassmorphism effects
- Dynamic weather icons

## Tech Stack

- React Native 0.79.3
- Expo ^53.0.11
- NativeWind ^4.1.23 (Tailwind CSS)
- React Navigation ^6.1.9
- Weather API from [WeatherAPI.com](https://www.weatherapi.com)

## Getting Started

### Prerequisites
- Node.js (v16+)
- Expo CLI: `npm install -g expo-cli`

### Installation

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd weather-app-react-native-expo
   npm install
   ```

2. **Setup environment**
   - Create `.env` file in root directory
   - Get API key from [WeatherAPI.com](https://www.weatherapi.com)
   - Add to `.env`:
   ```env
   WEATHER_API_KEY=your_api_key_here
   ```

3. **Run the app**
   ```bash
   expo start
   ```
   - Scan QR code with Expo Go app
   - Or use `npm run ios` / `npm run android`

## Project Structure

```
src/
├── api/weather.jsx          # API calls
├── assets/images/           # Weather icons
├── constants/index.jsx      # Image mappings
├── navigation/              # Navigation setup
├── screens/HomeScreen.jsx   # Main screen
└── theme/index.jsx          # Theme config
```

## Configuration

**Important**: All UI files must be in `/src` folder for Tailwind classes to work.

TailwindCSS version: 3.4.17

## License

MIT License

---

Made with ❤️ using React Native and Expo
