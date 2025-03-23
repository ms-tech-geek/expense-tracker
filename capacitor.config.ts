import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mstechgeek.expensetracker', // Replace with your unique app ID
  appName: 'Expense Tracker',           // Replace with your app name
  webDir: 'dist',                          // The directory where your built web app is

  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      iosSplashResourceName: "splash"
    }
  }
};

export default config;
