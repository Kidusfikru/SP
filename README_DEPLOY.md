# Deployment Guide: Speaker Portal on Vercel 🚀

This guide explains how to deploy the **Speaker Portal** to Vercel while keeping your custom real-time **Firebase Firestore** database connected and fully functional.

---

## 📋 Prerequisites

1. A **Vercel Account** ([sign up here](https://vercel.com/)).
2. **Git installed** locally, or your repository pushed to GitHub/GitLab/Bitbucket.
3. Your Firebase credentials.

---

## 🎛️ Step 1: Export Your Code from AI Studio

In Google AI Studio Build:
1. Open the top-right **Settings Menu** (gear icon).
2. Click **Export to GitHub** or **Export to ZIP**.
3. If exporting via ZIP, extract the contents and open them in your preferred code editor (such as VS Code).

---

## ⚙️ Step 2: Configure Environment Variables

The application can read Firebase credentials from standard Vite client-side environment variables. Go to your Vercel Dashboard, select your project, choose **Settings** > **Environment Variables**, and add the following keys with values copied from your local `/firebase-applet-config.json`:

| Variable Name | Description | Value Example |
| :--- | :--- | :--- |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase project id | `gen-lang-client-xxxx` |
| `VITE_FIREBASE_APP_ID` | Your Firebase application id | `1:xxxx:web:xxxx` |
| `VITE_FIREBASE_API_KEY` | Public Firebase browser API Key | `AIzaSyAABfRxxxxxxxx` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase web authentication domain | `gen-lang-client-xxxx.firebaseapp.com` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Reference storage bucket name | `gen-lang-client-xxxx.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Push notification messaging id | `864916821781` |

---

## 🚀 Step 3: Deployment Options

### Option A: The Vercel CLI (Fastest)

If you have the Vercel CLI installed, run these simple terminal commands inside the project's root folder:

```bash
# 1. Install Vercel CLI globally if you haven't already
npm install -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Trigger the deployment
vercel
```

Follow the prompts (Vercel will detect **Vite** automatically, use standard defaults, and build the distribution folder `dist` securely).

### Option B: Vercel Dashboard (No-Code Git Sync)

1. Push your exported project code to a **GitHub repository**.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your new GitHub repository.
4. Expand the **Environment Variables** accordion and add the variables listed in Step 2.
5. Click **Deploy**!

---

## ⚡ Real-Time Connection Verification

* **Auto-Seeding**: Once deployed, the application will automatically scan your Firestore database. If it is empty, it will seed it with ready-to-use prototype events, attendees, and chat rooms so you can see live features immediately!
* **Collaborative Sync**: Since we use **Firestore snap-listener streams**, opening the deployed app in two side-by-side tabs will synchronize chat messages, RSVP button changes, and registry additions instantly!
