# Cake Bae — Firebase Setup & Project Update Guide

This guide provides step-by-step instructions on setting up your live Firebase backend database and updating/deploying the Cake Bae e-commerce store code.

---

## 1. Firebase Portal Setup

### Step A: Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/) and log in with your Google account.
2. Click **Add project** (or **Create a project**).
3. Name your project (e.g., `cake-bae-db`) and click **Continue**.
4. You can enable or disable Google Analytics for this project, then click **Create project**. Wait for initialization and click **Continue**.

### Step B: Create a Cloud Firestore Database
1. In the Firebase left sidebar, click on **Build** and select **Firestore Database**.
2. Click **Create database**.
3. Select your Database Location (prefer locations close to your users, e.g., `asia-south1` for Sri Lanka, or default US locations).
4. Set security rules in **Start in test mode** for initial testing (we will apply production security rules shortly), then click **Create**.
5. Once your Firestore is initialized, it is ready to receive data. The Cake Bae app has **Auto-Seeding** built-in: the moment the app connects for the first time, it will automatically populate your Firestore with the default products, roles, and staff users!

### Step C: Enable Firebase Authentication
1. In the left sidebar, click **Build** and select **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, select **Email/Password**.
4. Toggle **Enable** and click **Save**. (This enables secure admin logins for the staff portal).

### Step D: Register your Web App & Get Configurations
1. Go to the Firebase Project Overview page (click the gear icon ⚙️ next to *Project Overview* > *Project settings*).
2. Under the **General** tab, scroll down to *Your apps* and click the **Web icon** (`</>`).
3. Register your app with a nickname (e.g., `cake-bae-web`) and click **Register app**.
4. You will see a `firebaseConfig` object containing:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
5. Keep these credentials open; you will paste them into your project settings file.

---

## 2. Environment Variables Configuration

To connect the Next.js project to your newly created Firebase:
1. In the project root directory, locate the file called `.env.local.example`.
2. Rename or duplicate this file to `.env.local`.
3. Open `.env.local` and replace the placeholder keys with the exact values you copied from the Firebase Project settings page:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA1...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cake-bae-db.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=cake-bae-db
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cake-bae-db.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=9876543210
   NEXT_PUBLIC_FIREBASE_APP_ID=1:9876543210:web:abcdef...
   ```
4. Restart your local Next.js server. The console terminal will output:
   `🔥 Live Firebase & Firestore initialized successfully.`

---

## 3. Database Security Rules

We have created a `firestore.rules` file in the project root containing production security settings. To apply these rules:
1. In your Firebase Console, click on **Firestore Database** > **Rules** tab.
2. Replace the rules text editor content with the exact code from the [firestore.rules](file:///c:/Users/DELL/Desktop/cake-bae%20new/firestore.rules) file in your project.
3. Click **Publish**. This secures your database, allowing public users to write orders (checkout) and browse cakes, while restricting modifications to authenticated staff.

---

## 4. How to Update & Run the Project

### Running Locally for Development
1. Open a terminal inside the project directory: `C:\Users\DELL\Desktop\cake-bae new`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the storefront at [http://localhost:3000](http://localhost:3000). Any changes you make in the code (e.g., modifying headers or landing copy) will refresh in real time in the browser.

### Syncing Updates to GitHub & Vercel
We have configured your project with git pointing to your repository `https://github.com/NivandanaDikeshi/cake-bae.git`.

Whenever you write updates or add features:
1. Open your terminal and verify changes:
   ```bash
   git status
   ```
2. Stage and commit your modifications:
   ```bash
   git add .
   git commit -m "Update details: [brief description of changes made]"
   ```
3. Push the commits to your GitHub repository:
   ```bash
   git push origin master
   ```

### Automatically updating Vercel
1. Log in to your [Vercel account](https://vercel.com).
2. Click **Add New** > **Project** and import your `cake-bae` repository.
3. In Vercel's environment variables settings panel, add all the environment keys listed in `.env.local` (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`, etc.) so Vercel can connect to Firebase during builds.
4. Click **Deploy**.
5. Once configured, Vercel will hook into your repository. Every time you run `git push origin master`, Vercel will automatically fetch the new code, rebuild, and update your live website instantly!
