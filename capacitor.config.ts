import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zaxo.admin',
  appName: 'Zaxo Admin',
  webDir: 'out',
  server: {
    // When deployed, the app loads from the live server URL
    // Comment out 'url' to use local static files instead
    url: 'https://zaxo.eu.cc',
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#0d9488',
      showSpinner: true,
      spinnerColor: '#ffffff',
    },
  },
};

export default config;
