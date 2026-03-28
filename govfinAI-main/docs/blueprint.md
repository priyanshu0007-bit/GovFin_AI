# **App Name**: GovFinAI

## Core Features:

- AI Scheme Discovery & Eligibility: Leverages Genkit with Gemini 1.5 Pro to analyze user profiles against a database of government schemes, identifying eligible programs and providing match scores and reasons.
- AI Financial Insights & Anomaly Detection: Utilizes Genkit with Gemini 1.5 Pro/Flash to analyze spending patterns from transactions, provide personalized financial insights, and detect unusual spending anomalies.
- Multilingual AI Assistant: Offers a stateful, conversational AI chatbot powered by Genkit and Gemini 1.5 Pro, supporting multiple Indian languages and providing contextual assistance based on user data.
- AI Policy Document Explainer: Simplifies complex government policy texts into easy-to-understand summaries, key benefits, and application steps using Genkit and Gemini 1.5 Pro, accessible on demand.
- Secure User Authentication & Profile: Manages user registration, login (Email/Password, Google OAuth), and personal profile details (age, income, state, etc.) using Firebase Auth and Firestore for personalization.
- Personalized Dashboard Overview: Presents a tailored overview including eligible schemes, financial summaries, recent activity, and AI-generated daily tips, serving as the user's central hub.
- Comprehensive Transaction Management: Allows users to record, categorize (with AI-suggested categories), and track all income and expenses, providing the essential data for financial analysis.

## Style Guidelines:

- Primary color: Indigo (#4F46E5) for professionalism and trustworthiness.
- Background color: A very subtle cool gray (#F0F1F5) with a hint of primary hue, for a clean, accessible, light theme.
- Accent color: Emerald (#10B981) for highlights and calls to action, symbolizing growth and success.
- Warning color: Amber (#F59E0B) for alerts and important notices.
- Body and headline font: 'Inter' (sans-serif) for its modern, clear, and highly legible appearance across all content types. Note: currently only Google Fonts are supported.
- Utilize Lucide-react icons for clear, modern visual cues throughout the application, especially in navigation menus, consistent with shadcn/ui aesthetic.
- Implement a sidebar navigation (collapsible on mobile) with icons and labels, a top header bar with app logo, language selector, notifications, and user avatar, and a main content area with breadcrumbs. The layout is mobile-first, ensuring responsiveness across all screen sizes (320px-1440px).
- Subtle Framer Motion animations for page transitions, sidebar interactions, and card hovers. Incorporate skeleton loaders during data fetching, loading spinners with encouraging messages for AI interactions, and visually distinct toast notifications (Sonner) for user feedback. Animated circular progress rings for scheme match percentages.
- Cards use a border radius of 12px, and inputs use a border radius of 8px, maintaining a soft, approachable feel. Subtle shadow-sm is applied to cards and shadow-md to modals for depth and hierarchy, enhancing the professional look.