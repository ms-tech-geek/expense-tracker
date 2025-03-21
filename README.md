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