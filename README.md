GovFinAI - Financial Inclusion for All 🇮🇳
GovFinAI is a cutting-edge, AI-powered platform designed to bridge the digital and financial divide for Indian citizens. By leveraging Google's Gemini models via Firebase Genkit, GovFinAI simplifies the discovery of government welfare schemes and provides personalized financial guidance in multiple regional languages.

🚀 Key Features
AI-Powered Scheme Discovery: Instantly match with over 1,200+ central and state government schemes (like PM Kisan, Ayushman Bharat, Mudra Loans) based on your unique profile (age, income, location, occupation).
Multilingual AI Assistant: Chat with "GovFinAI Assistant" in 7+ regional languages (Hindi, Marathi, Tamil, Telugu, etc.) to get answers about policies, application processes, and personal finance.
Smart Expense Tracker: Automated categorization of transactions using AI to help users understand their spending habits and find opportunities for savings.
Policy Explainer: Complex government policy documents are simplified into easy-to-understand summaries, highlighting key benefits and "How to Apply" steps.
AI Financial Coach: Proactive nudges and insights tailored to the Indian context, helping users reach their savings goals faster.
Secure & Private: Built with Firebase's robust security model, ensuring that sensitive financial and personal data remains protected.
Modern UI/UX: A responsive, accessible, and fast interface built with Next.js 15, Shadcn UI, and Tailwind CSS, featuring full Dark Mode support and smooth transitions.
🛠️ Technology Stack
Framework: Next.js 15 (App Router)
Styling: Tailwind CSS & Shadcn UI
Backend & Auth: Firebase (Firestore, Authentication)
Generative AI: Firebase Genkit with Google Gemini
Language: TypeScript
Animations: Lucide React & Tailwind Animate
🚦 Getting Started
Prerequisites
Node.js 20 or later
A Firebase Project with Firestore and Authentication (Email/Google) enabled.
A Google AI API Key (for Genkit/Gemini features).
Installation
Clone the repository.
Install dependencies:
npm install
Set up your environment variables in .env.local:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
GOOGLE_GENAI_API_KEY=your_gemini_api_key
Run the development server:
npm run dev
Demo Mode
For rapid prototyping and presentations, the app includes a Demo Mode. You can bypass the actual Firebase Auth by clicking the "Try Demo Login" button on the login page, which uses local storage to simulate an active session.

📄 License
This project is licensed under the MIT License.
