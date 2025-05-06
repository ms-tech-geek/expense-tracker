# Expense Tracker

A comprehensive expense tracking application built with React, TypeScript, and Supabase.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [Account Management](#account-management)
- [Data Privacy](#data-privacy)
- [Android App Build Instructions](#android-app-build-instructions)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ms-tech-geek/expense-tracker.git
   cd expense-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Setup

1. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Replace the environment variables with your Supabase project credentials

## Database Setup

1. Create a new Supabase project

2. Enable Email Authentication:
   - Go to Authentication > Providers
   - Enable Email provider
   - Disable "Confirm email" if not required

3. Run the migrations:
   - Navigate to SQL Editor
   - Run all migration files from `supabase/migrations` in order

## Usage

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Build for production:
   ```bash
   npm run build
   ```

3. Preview production build:
   ```bash
   npm run preview
   ```

## Account Management

Users can manage their accounts in two ways:

1. Through the application:
   - Navigate to Settings
   - Use the "Delete Account" button

2. Via email request:
   - Contact support at mayanksethi.apps@gmail.com
   - Include registered email address

## Data Privacy

1. Data Deletion Options:
   - Delete specific expenses
   - Delete expenses by date range
   - Delete expenses by category
   - Request complete account deletion

2. Privacy Policy:
   - Available at `/privacy`
   - Details data collection and usage
   - Explains user rights and options

For more information about data privacy and deletion requests, visit the Privacy Policy page in the app.

## Android App Build Instructions

### Prerequisites for Android Development

- Android Studio
- JDK 17 or higher
- Android SDK
- Gradle

### Building the Android App

1. Install Capacitor dependencies (if not already installed):
   ```bash
   npm install @capacitor/core @capacitor/android
   ```

2. Build the web application:
   ```bash
   npm run build
   ```

3. Initialize Capacitor (if not already done):
   ```bash
   npx cap init
   ```

4. Add Android platform:
   ```bash
   npx cap add android
   ```

5. Sync the web build with Android:
   ```bash
   npx cap sync android
   ```

6. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```

### Building APK/AAB in Android Studio

1. In Android Studio, go to Build > Generate Signed Bundle/APK
2. Choose Android App Bundle (AAB) for Play Store or APK for direct distribution
3. Create or select a keystore file
4. Fill in the keystore information
5. Select release build variant
6. Click 'Create' or 'Next' to generate the bundle/APK

The generated files will be located in:
- APK: `android/app/build/outputs/apk/release/`
- AAB: `android/app/build/outputs/bundle/release/`

### Testing on Device

1. Enable USB debugging on your Android device
2. Connect your device via USB
3. Run the app directly from Android Studio by clicking the 'Run' button
4. Select your connected device from the list

### Updating the Android App

When you make changes to the web application:

1. Rebuild the web app:
   ```bash
   npm run build
   ```

2. Sync the changes with Android:
   ```bash
   npx cap sync android
   ```

3. Open in Android Studio to build and test:
   ```bash
   npx cap open android
   ```

For more information about Capacitor configuration and advanced options, visit the [Capacitor documentation](https://capacitorjs.com/docs).