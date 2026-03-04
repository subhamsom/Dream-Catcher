# Dream Catcher

## Project Description
A webapp that tracks your dreams and gives insights using Al. We'll use Gemini Al to give insights. The app should be stylized and somewhat dreamy.

There should be a landing page describing the product along with a text box for users to submit their first dream. This will sign the user up and submit their dream. The user will have a dashboard page that displays all of their recordings. If they click on a recording, they should be taken to another page that contains their recording and meta information as well as the Al insight/significance.

For the free tier they will be able to record as many dreams as they wish, but they'll only get 5 free Al insights. There
will just be one subscription that allows them unlimited AI insights for Rs 499/month.

## Product Requirements Document
PRODUCT REQUIREMENTS DOCUMENT (PRD): DREAM CATCHER

Version: 1.0
Date: October 26, 2023
Author: [Your Name/Team]

1. INTRODUCTION

1.1 GOALS AND VISION
The primary goal of Dream Catcher is to provide users with a beautiful, intuitive, and insightful platform for tracking their nocturnal experiences. By leveraging advanced AI (Gemini), the application aims to move beyond simple journaling, offering users meaningful interpretation and pattern recognition across their dream life. The ultimate vision is to create a trusted companion for introspection, habit tracking, and potentially aiding in lucid dreaming exploration.

1.2 TARGET AUDIENCE
The target audience consists of individuals who enjoy journaling, habit tracking, and self-reflection. They are digitally proficient, heavy mobile users (social media, general browsing), and are interested in self-improvement, mindfulness, or the specific desire to achieve lucidity in their dreams. They prioritize privacy given the sensitive nature of dream content.

1.3 SUCCESS METRICS
*   Monthly Active Users (MAU).
*   Conversion rate from Free Tier to Subscription Tier.
*   Average number of dreams recorded per active user per week.
*   User satisfaction (measured qualitatively via feedback or app store reviews regarding AI insights).

2. PRODUCT OVERVIEW

Dream Catcher is a web application designed with a stylized, dark, and ethereal aesthetic. It facilitates the recording of dreams, enriches the data with metadata, and provides AI-driven analysis via Gemini.

2.1 KEY FEATURES
1.  Secure User Onboarding (First Dream Submission).
2.  Dream Recording and Detailed Entry Management.
3.  Personalized AI Insight Generation (Gemini integration).
4.  User Dashboard with Dream History and Analytics.
5.  Freemium Monetization Model (Limited Free Insights, Subscription for Unlimited).

3. USER STORIES AND REQUIREMENTS

3.1. CORE FLOW: ONBOARDING AND FIRST DREAM
As a new user, I want a stunning landing page that clearly explains the value proposition of AI-driven dream tracking, followed immediately by a simple entry point so I can record my first dream without friction, which simultaneously creates my account.

*   **REQ-3.1.1 (Landing Page):** The landing page must feature the dreamy aesthetic (dark navy/indigo, ethereal purple/blue gradients) and clearly communicate the core features (tracking, AI insights, privacy).
*   **REQ-3.1.2 (Sign-up/Entry):** The landing page must feature a prominent text area for dream submission. Submitting this first dream successfully creates the user account (inferred login/identity) and saves the entry.
*   **REQ-3.1.3 (Post-Submission):** Upon successful submission of the first dream, the user is automatically redirected to their Dashboard.

3.2. DREAM RECORDING AND METADATA
As a user, I need a dedicated interface to enter detailed dream information, including mandatory text and specific metadata fields for better tracking and analysis.

*   **REQ-3.2.1 (Dream Content):** Must support rich text input for the main dream narrative.
*   **REQ-3.2.2 (Metadata Collection):** Every dream entry must capture:
    *   Date of occurrence/recording (Default: current date/time).
    *   Optional Dream Title.
    *   Mood Upon Waking (Selection: 'Happy', 'Anxious', 'Calm', 'Neutral', 'Excited').
    *   Lucid Dream status (Boolean checkbox).
    *   Free-form Tags/Keywords input (for custom categorization, e.g., 'flying', 'water').

3.3. USER DASHBOARD
As a user, I want a central hub to view my history, quickly navigate to specific dreams, and see high-level statistics about my dream patterns.

*   **REQ-3.3.1 (History View):** The Dashboard displays a chronological list or card view of all recorded dreams.
*   **REQ-3.3.2 (Navigation):** Clicking on any dream card navigates the user to the detailed Dream View page (Section 3.4).
*   **REQ-3.3.3 (Search):** Must include a search bar to query dream titles, content, or tags/keywords.
*   **REQ-3.3.4 (Filtering):** Must allow filtering the displayed list by Date Range, and by Mood Upon Waking.
*   **REQ-3.3.5 (Statistics Display):** The Dashboard must prominently feature summary statistics, including: Dream Frequency trends, distribution of recorded Moods, and percentage of Lucid Dreams.

3.4. DREAM DETAIL AND AI INSIGHTS PAGE
As a user, I want to see my full dream entry alongside its rich metadata and the personalized AI analysis provided by Gemini.

*   **REQ-3.4.1 (Display):** Page must display the full Dream Narrative, Title, Date, Mood, Lucid Status, and Tags.
*   **REQ-3.4.2 (Metadata Display):** Metadata fields must be clearly separated or highlighted, using the application's accent colors (e.g., ethereal blue/purple for the Lucid tag).
*   **REQ-3.4.3 (AI Insight Section):** A dedicated section for the Gemini analysis must be present.
*   **REQ-3.4.4 (Gemini Prompting):** The system will send the Dream Narrative and collected metadata (Mood, Tags) to Gemini. Insights must focus on: recurring themes, symbolic meanings, emotional correlation, and potential connection to waking life events.
*   **REQ-3.4.5 (Insight Availability Check):** Before displaying an insight, the system must check the user's remaining free insight count (see Section 4.2).

4. MONETIZATION AND SUBSCRIPTION

4.1. PRICING STRUCTURE
*   **Free Tier:** Unlimited dream recordings; maximum of 5 AI insights.
*   **Premium Tier (Subscription):** Unlimited AI insights.
*   **Cost:** ₹499 per month.

4.2. AI INSIGHT USAGE TRACKING (FREE TIER)
*   **REQ-4.2.1 (Counter Implementation):** A backend counter (`free_insights_used`) must track insight generation per user, defaulting to 0.
*   **REQ-4.2.2 (Generation Logic):** When a free user requests an insight:
    1. Check if `free_insights_used < 5`.
    2. If true, generate insight, increment counter server-side, and proceed.
    3. If false, DO NOT generate insight. Display the soft paywall upsell prompt (REQ-4.2.3).
*   **REQ-4.2.3 (Soft Paywall):** If insight quota is met, display a clear UI prompt inviting the user to subscribe for ₹499/month to unlock unlimited analysis.

4.3. SUBSCRIPTION MANAGEMENT
*   **REQ-4.3.1 (Payment Flow):** Integration with a standard payment gateway (to be specified later, but architected to handle recurring billing).
*   **REQ-4.3.2 (Verification):** The system must verify active subscription status (via receipt validation or webhooks) to grant unlimited insight access, bypassing the counter check (REQ-4.2.2).
*   **REQ-4.3.3 (Reset Logic):** The `free_insights_used` counter for free users should reset monthly (e.g., on the 1st day of the calendar month) to encourage long-term tracking and eventual subscription.

5. TECHNICAL & DESIGN SPECIFICATIONS

5.1. STYLISTIC AND DESIGN DIRECTION (AESTHETICS)
The application must adhere strictly to a surreal, dark, and ethereal visual theme suitable for use in low-light conditions (early morning).

*   **Background:** Default to very dark navy/deep indigo-purple (#0A0E1F to #120A1F).
*   **Accent Colors:** Soft, ethereal gradients fading into purples (#6A5ACD, #9F7AEA, #C9A0FF) and gentle blues (#60A5FA) for interactive elements, cards, and highlights.
*   **Contrast:** Avoid harsh, high-contrast elements; aim for a velvety, floating feel.
*   **Typography:** Use clean, slightly rounded modern sans-serifs (e.g., Inter or Manrope).
*   **Mystical Effects:** Headings and key titles should feature subtle glow or neon effects.

5.2. SECURITY AND PRIVACY (CRITICAL)
Given the sensitive nature of diary content, security and privacy must be paramount, utilizing free and open-source methods only.

*   **REQ-5.2.1 (Local-First Storage):** All dream entries must be stored exclusively on the user's device by default. No backend cloud exposure unless explicitly opted-in later.
*   **REQ-5.2.2 (Client-Side Encryption):** Data at rest must be encrypted using AES-256 (GCM preferred). Encryption keys must be derived from a user-set passcode/biometrics, secured via native platform storage (Keychain/Keystore).
*   **REQ-5.2.3 (Access Control):** Mandatory application-level PIN/passcode or biometric authentication upon app launch or return from background.
*   **REQ-5.2.4 (DPDP Compliance Basics):** A clear, accessible Privacy Notice must be present stating the local storage priority and transparency regarding data handling. Consent must be obtained for any non-essential processes (like insight generation). Easy data export/deletion mechanisms must be available.

6. FUTURE CONSIDERATIONS (OUT OF SCOPE FOR V1.0)
*   Optional Cloud Sync feature.
*   Gamification elements (e.g., streaks for daily recording).
*   Integration with wearable devices for sleep stage correlation.

## Technology Stack
Dream Catcher Technology Stack (techStack)
Date: October 26, 2023
Version: 1.0

1. Introduction
This document outlines the recommended technology stack for the "Dream Catcher" web application. The stack is chosen to support a highly stylized, dark-themed UI, robust data handling, seamless integration with the Gemini AI API for personalized dream insights, and adherence to strict privacy constraints (prioritizing local-first storage).

2. Frontend Technologies (User Interface & Experience)

Technology/Framework: React (or Next.js for potential server-side rendering benefits and structure)
Justification: Industry standard for building dynamic, component-based web applications. Its large ecosystem supports the complex state management required for dashboards and detailed views. Next.js is preferred for streamlined routing and potential performance gains.

Styling & Theming: CSS-in-JS (e.g., Styled Components or Emotion) with Custom CSS Variables
Justification: Essential for implementing the required ethereal, dark, velvety aesthetic (#0A0E1F to #120A1F backgrounds with soft indigo/purple gradients like #6A5ACD). CSS-in-JS allows for component-scoped styling and easy dynamic theme adjustments (e.g., applying subtle glow effects).

UI/UX Components: Custom Components built on a minimal CSS framework or utility classes (e.g., Tailwind CSS, carefully customized)
Justification: While Tailwind offers rapid development, the highly specific, non-standard dreamy aesthetic requires heavy customization to avoid generic component styling. A custom, utility-first approach, heavily guided by the desired color palette, will ensure the surreal look is achieved precisely.

Typography: Manrope or Inter
Justification: Clean, modern, and highly readable sans-serif fonts suitable for both small diary entries and dashboard readability, fitting the subtle, rounded aesthetic requirement.

3. Backend & API Services

AI Integration Engine: Gemini API (via Google AI SDK)
Justification: This is the core requirement for providing AI insights, emotional correlation, and recurring theme analysis based on the user's dream narratives.

Backend Service (API Gateway/Serverless Functions): Node.js with Express or Serverless Functions (AWS Lambda/Vercel Functions)
Justification: Node.js is ideal for high-concurrency, I/O-bound tasks like handling user requests, managing subscription checks, and proxying requests to the Gemini API. Serverless functions minimize infrastructure overhead, aligning with cost-efficiency goals.

Authentication & User Management: Firebase Authentication or Supabase Auth
Justification: Provides secure, managed user sign-up (handling the initial dream submission flow) and standard session management without requiring custom implementation of complex security protocols.

4. Database & Data Storage

Primary Database (Metadata & User Profiles): PostgreSQL (via Supabase/Managed Service)
Justification: A robust relational database is necessary for storing user profiles, subscription status, and the critical per-user counter for tracking the 5 free AI insights (e.g., `free_insights_used` field). It ensures transactional integrity for subscription verification.

Local/Offline Data Storage (Dream Entries): Encrypted Local Storage (e.g., IndexedDB, or specific libraries like WatermelonDB if using React Native)
Justification: This is crucial to meet the security constraints. Dream entries must be stored locally first, encrypted using AES-256 (GCM mode) derived from a user-set passcode/biometrics. This minimizes cloud exposure, fulfilling the "Local-first/offline storage as default" requirement.

5. DevOps, Tooling, and Security

Version Control: Git / GitHub
Justification: Standard for collaboration, history tracking, and implementing CI/CD pipelines.

Deployment Platform: Vercel or Netlify (Frontend/Serverless Functions)
Justification: Excellent developer experience, easy integration with Git, and support for global distribution and serverless functions needed for the backend API layer, often available with generous free tiers.

Encryption Libraries: Crypto libraries native to the platform (e.g., Node's built-in crypto module, or specialized client-side libraries)
Justification: Necessary for implementing client-side AES-256 encryption of dream content before it is saved locally or, eventually, synced.

Payment Gateway Integration: Stripe (for subscription management)
Justification: Industry standard for handling recurring billing (₹499/month subscription) and providing webhooks for reliable subscription status verification on the backend to manage the unlimited insight unlock.

Security Practices Adherence: Implementation of TLS 1.3 (automatic via modern HTTP clients like Axios/Fetch) and adherence to DPDP Act 2023 basics via manual documentation and consent flows.

6. Data Structure & Metadata Handling

Dashboard Features: Handled via database queries (SQL) leveraging PostgreSQL capabilities for efficient searching and filtering by date range and mood tags. Statistics generation will rely on basic aggregation queries.

Dream Entry Fields Stored (Locally Encrypted):
*   Date Recorded
*   Dream Title (Optional)
*   Dream Narrative (Full Text)
*   Mood Upon Waking (Selection: Happy, Anxious, Calm, Neutral, Excited)
*   Lucid Dream (Boolean Checkbox)
*   Tags/Keywords (Array of strings)
*   AI Insight Status (Generated/Pending/Not Requested)

AI Insight Metadata Stored (If generated):
*   Gemini Prompt Sent
*   Raw Response Received
*   Processed Insight Summary
*   Insight Generation Timestamp

## Project Structure
PROJECTSTRUCTURE: Dream Catcher Webapp

1. Root Directory (/dreamcatcher)
    A. /docs
        1. /projectStructure.txt (This document)
        2. /architectureDiagram.md (High-level system architecture)
        3. /requirements.md (Functional and non-functional requirements)
    B. /frontend (Client-side application, likely React/Next.js)
        1. /public
            a. /images (Logos, icons, placeholder assets)
            b. favicon.ico
            c. index.html (Base HTML template)
        2. /src
            a. /api (Client-side API service calls - e.g., for backend communication, Gemini API proxy)
                i. dreamService.js
                ii. authService.js
                iii. subscriptionService.js
            b. /components (Reusable UI components)
                i. /layout (Global structure components)
                    - Header.jsx
                    - Footer.jsx
                    - Navigation.jsx
                ii. /ui (Atomic/primitive components)
                    - Button.jsx
                    - InputField.jsx
                    - Modal.jsx
                    - DreamCard.jsx (For dashboard listings)
                    - TagPill.jsx
                iii. /forms (Specific form components)
                    - DreamEntryForm.jsx
                    - SubscriptionForm.jsx
            c. /pages (Route-specific components)
                i. index.js (Landing Page)
                    - Includes DreamSubmissionWidget (initial signup/dream entry)
                ii. /dashboard.js (User Dashboard - Dream List)
                iii. /dream/[id].js (Dream Detail Page)
                iv. /settings.js (User/Subscription settings)
                v. /login.js (If separate authentication flow is needed)
            d. /styles (Styling assets, embracing the dark/dreamy aesthetic)
                i. globals.css (Global resets, dark mode base variables)
                ii. theme.css (Custom variables for indigo/purple gradients)
            e. /context (State management context providers)
                i. AuthContext.js
                ii. DreamContext.js
            f. App.jsx (Root component)
            g. main.js (Entry point)
    C. /backend (Server-side API and business logic - Node.js/Express or similar)
        1. /config
            a. database.js (Connection setup for DB)
            b. environment.js (Handling API keys, JWT secrets)
        2. /controllers
            a. authController.js (Registration, login, token handling)
            b. dreamController.js (CRUD operations for dreams)
            c. insightController.js (Handles calls to Gemini API, insight rate limiting)
            d. subscriptionController.js (Handles payment status verification/webhooks)
        3. /models (Database schema definitions)
            a. User.js (Schema including free_insights_used counter)
            b. Dream.js (Schema: date, title, mood, isLucid, tags, content, userId)
            c. Subscription.js
        4. /services
            a. geminiService.js (Wrapper for communicating with Gemini API)
            b. insightService.js (Logic for prompt construction and interpreting AI response)
            c. subscriptionService.js (Logic for managing subscription tiers)
        5. /routes
            a. api.js (Main API routing file)
        6. server.js (Main server entry point)
    D. /tests
        1. /frontend (Unit/Integration tests for client components)
        2. /backend (Unit/Integration tests for controllers/services)
    E. .env (Environment variables for secrets/configuration)
    F. package.json (Project dependencies and scripts)
    G. README.md (Project overview and setup instructions)

2. Key File/Directory Explanations:

    * /frontend/src/pages/index.js: The landing page. Must contain the initial sign-up/dream submission form, driving first-time user conversion.
    * /frontend/src/pages/dashboard.js: Central hub. Must handle search, date/mood filtering, and display dream frequency statistics.
    * /frontend/src/pages/dream/[id].js: Detail view. Displays dream content, metadata (Date, Title, Mood, Lucid status, Tags), and the AI Insight block.
    * /frontend/src/components/ui/DreamCard.jsx: Used in the dashboard. Should visually align with the dreamy aesthetic (soft gradients, dark background).
    * /backend/models/User.js: Crucial for subscription logic. Must define the field `free_insights_used` (integer, default 0) to track the 5 free AI generations.
    * /backend/services/insightService.js: This service will be responsible for checking the `free_insights_used` count against the limit (5) before calling the Gemini API. If the limit is exceeded, it triggers the paywall prompt logic.
    * /frontend/src/styles/theme.css: Contains CSS variables defining the deep indigo background (#0A0E1F to #120A1F) and the soft ethereal purple/blue accents (#6A5ACD, #9F7AEA, #C9A0FF, #60A5FA).
    * /backend/services/geminiService.js: Handles secure communication with the Gemini API endpoint. Prompt construction here must incorporate requirements for recurring themes, symbolic meanings, and emotional correlation based on the dream input.

## Database Schema Design
# SCHEMADESIGN: Dream Catcher Application

## 1. Overview & Design Philosophy

The database schema is designed to be lightweight, scalable for initial user growth, and optimized for fast retrieval of dream journal entries. Given the sensitive nature of the data and the security requirements (local-first focus, encryption), the schema design focuses on essential user metadata and the core content, assuming primary storage enforcement (encryption, access control) will happen at the application layer (as per security constraints).

**Assumed Backend/Database Platform:** Flexible (e.g., PostgreSQL, Firestore/NoSQL structure adaptable). Relationships are described logically.

## 2. Data Models (Entities)

### 2.1. User

Stores user authentication and subscription status.

| Field Name | Data Type | Constraints / Notes | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | UUID/Integer | Primary Key, Not Null | Unique identifier for the user. |
| `email` | String | Unique (if auth used), Nullable | User email for account management/login. |
| `hashed_password` | String | Nullable (If password auth used) | Stores secure hash if not using third-party auth. |
| `created_at` | Timestamp | Not Null, Default NOW() | When the user account was created. |
| `is_active` | Boolean | Default TRUE | Account status. |
| `free_insights_used` | Integer | Default 0, Max 5 | Counter for free AI insights consumed. |
| `subscription_status` | Enum/String | Values: FREE, ACTIVE, TRIAL, EXPIRED | Current subscription tier. |
| `subscription_end_date`| Timestamp | Nullable | Date paid subscription expires. |

### 2.2. DreamEntry

The core table storing individual dream records.

| Field Name | Data Type | Constraints / Notes | Description |
| :--- | :--- | :--- | :--- |
| `dream_id` | UUID/Integer | Primary Key, Not Null | Unique identifier for the dream entry. |
| `user_id` | UUID/Integer | Foreign Key (User.user_id), Not Null | Links the dream to the owning user. |
| `record_date` | Date/Timestamp | Not Null | The date the dream occurred or was recorded. |
| `title` | String (Max 100) | Nullable | User-provided short title for the dream. |
| `dream_content_encrypted`| Text/Blob | Not Null | The actual, encrypted dream narrative. |
| `mood_upon_waking` | Enum/String | Values: Happy, Anxious, Calm, Neutral, Excited | User-selected mood upon waking. |
| `is_lucid` | Boolean | Default FALSE | Checkbox status for lucid dreaming. |
| `recorded_at` | Timestamp | Not Null, Default NOW() | Timestamp when the entry was created in the DB. |

### 2.3. DreamTag (Junction Table for Many-to-Many)

Used to link multiple user-defined tags to a single dream entry.

| Field Name | Data Type | Constraints / Notes | Description |
| :--- | :--- | :--- | :--- |
| `dream_tag_id` | Integer | Primary Key | Unique ID for the linking record. |
| `dream_id` | UUID/Integer | Foreign Key (DreamEntry.dream_id), Not Null | The dream being tagged. |
| `tag_text` | String (Max 50) | Not Null | The actual keyword/tag entered by the user (e.g., 'flying', 'anxiety'). |

*Note: Since tags are free-form for the user, the complexity of pre-defining a `Tag` table is avoided initially. Tags are stored directly in this junction table, facilitating easy searching/filtering based on the `tag_text`.*

### 2.4. GeminiInsight

Stores the generated AI analysis for each dream, preventing reprocessing costs and allowing fast dashboard loading.

| Field Name | Data Type | Constraints / Notes | Description |
| :--- | :--- | :--- | :--- |
| `insight_id` | UUID/Integer | Primary Key, Not Null | Unique identifier for the insight record. |
| `dream_id` | UUID/Integer | Foreign Key (DreamEntry.dream_id), Unique, Not Null | Links one insight per dream. |
| `insight_content` | Text | Not Null | The full analysis text generated by Gemini. |
| `insight_generated_at`| Timestamp | Not Null, Default NOW() | When the insight was successfully generated. |
| `analysis_type` | String | E.g., 'Thematic', 'Symbolic' | Tracks what kind of analysis was performed. |

## 3. Relationships

1.  **User to DreamEntry (1:M):** One User can have many Dream Entries. (Enforced via `DreamEntry.user_id`).
2.  **DreamEntry to GeminiInsight (1:1):** Each Dream Entry can have at most one generated AI Insight. (Enforced via `GeminiInsight.dream_id` being unique).
3.  **DreamEntry to DreamTag (M:M):** A single Dream Entry can have many Tags, and a single Tag can be applied to many Dreams (via the junction table `DreamTag`).

## 4. Data Flow & Indexing Strategy

### 4.1. Indexing for Performance

To support required dashboard features:

*   **User Table:** Index on `email` (for lookup).
*   **DreamEntry Table:**
    *   Composite Index on (`user_id`, `record_date`) - Essential for fetching user history ordered chronologically and filtering by date range.
    *   Index on `user_id` (for general access).
*   **DreamTag Table:**
    *   Composite Index on (`dream_id`, `tag_text`) - For fetching all tags for a dream.
    *   Index on `tag_text` - Crucial for efficient searching/filtering across all dreams by keyword.

### 4.2. Subscription Logic Mapping

*   **Free Tier:** `subscription_status` = 'FREE'. Application logic checks `free_insights_used` <= 5 before allowing API calls to Gemini.
*   **Paid Tier:** `subscription_status` = 'ACTIVE'. Application logic bypasses insight limit checks.

### 4.3. Data Handling Note (Security Constraint Adherence)

The field `DreamEntry.dream_content_encrypted` is critical. The raw text input from the user is never stored in plaintext in this database layer. Encryption keys, derived from user passcodes, reside only within the client application storage (Keychain/Keystore, or encrypted local storage like Hive). This schema assumes the data stored here is already encrypted ciphertext.

## User Flow
USERFLOW DOCUMENTATION: DREAM CATCHER

1. OVERVIEW AND STYLISTIC GUIDELINES
-------------------------------------
Project Goal: A web application for tracking dreams, featuring AI-driven insights powered by Gemini, stylized with a dark, ethereal, dreamy aesthetic.

Stylistic Mandate: Default interface employs a deep dark mode (navy/indigo-purple backgrounds, e.g., #0A0E1F to #120A1F). Accents use soft, low-contrast ethereal gradients: purples (#6A5ACD, #9F7AEA, #C9A0FF) and gentle blues (#60A5FA). Typography utilizes clean, rounded sans-serifs (Inter/Manrope), with subtle glow effects on key elements like dream titles to enhance the mystical, night-sky introspection feel.

Security & Privacy Foundation: All data is prioritized for local-first storage with client-side AES-256 encryption (GCM mode preferred). Access control requires a user-defined PIN/biometrics. Strict adherence to DPDP Act 2023 basics via transparency, consent, and user control over data erasure/export.

2. CORE USER JOURNEYS (USER FLOWS)

FLOW 1: First-Time User Onboarding & First Dream Submission (Unauthenticated/New User)
----------------------------------------------------------------------------------
Step 1.1: Landing Page Arrival (Landing Page Wireframe Description)
    -- Entry Point: User arrives at the application URL.
    -- Content: Prominent, stylized headline describing the dream tracking value proposition ("Capture Your Nightly Journeys"). Brief text explaining the AI insights and the dreamy aesthetic.
    -- Call to Action (CTA): A central, inviting text area labeled, "Begin Your Journey: Describe your first dream..." (accompanied by subscription tier information summary: "Free tier includes 5 AI Insights.").
    -- Interaction: User clicks or taps the text area.

Step 1.2: Initial Dream Input & Implicit Signup
    -- System Action: Clicking the CTA opens a modal or transitions to an input screen. The system initiates a session/local storage ID creation in the background, implicitly signing the user up (no formal email/password required initially).
    -- Input Form Fields (Simplified for first entry):
        1. Dream Narrative (Large Text Area - Required)
        2. Date of Recording (Defaults to Today, Editable)
    -- CTA: "Save Dream & Enter App"

Step 1.3: Post-Submission & Dashboard Entry
    -- System Action: Dream is saved locally and encrypted.
    -- Transition: User is immediately routed to the Dashboard (Flow 2). The system may prompt for a security passcode setup immediately upon dashboard entry, citing privacy standards.

FLOW 2: Registered User Dashboard Navigation & Dream Recording
------------------------------------------------------------
Step 2.1: Access & Authentication (If enabled)
    -- Entry Point: User opens the app.
    -- Interaction: If security is enabled, the user is presented with a dark-themed PIN pad or Biometric prompt.
    -- Success: User accesses the Dashboard.

Step 2.2: Dashboard View (Dashboard Wireframe Description)
    -- Structure: Dark background with ethereal card elements for each dream entry. Top bar features the App Logo/Title and navigation icons (e.g., Settings, New Dream, Subscription/Insights Counter).
    -- Core Elements:
        A. Dream List (Scrollable Area): Displays summarized cards (Title, Date, Mood Icon).
        B. Search Bar: Allows keyword search across dream narratives and tags.
        C. Filtering Mechanism: Dropdown/Toggles for filtering by Date Range (Calendar Picker) and Mood upon Waking (e.g., icons for Happy, Anxious, Calm).
        D. Statistics Widget: Small panel showing high-level stats (Total Dreams, Lucid Rate, Frequency Graph snapshot).
        E. AI Insight Counter Display: Clearly shows usage (e.g., "3/5 Free Insights Remaining" or "Unlimited Access").

Step 2.3: Adding a New Dream Entry (Detailed Input Flow)
    -- CTA: Prominent "+" button or "Record New Dream" button on the Dashboard.
    -- Input Form Fields (Detailed Tracking):
        1. Date Recorded (Date Picker)
        2. Dream Title (Text Input, Optional)
        3. Dream Narrative (Large Text Area - Required)
        4. Mood Upon Waking (Radio Buttons/Select: Happy, Anxious, Calm, Neutral, Excited)
        5. Lucid Dream? (Checkbox)
        6. Tags/Keywords (Free-form text input, comma-separated recommended)
    -- CTA: "Save Dream"

Step 2.4: Triggering AI Insight Request (If needed)
    -- Prerequisite: User saves a dream that has not yet received an insight OR user navigates to an existing dream detail page without an insight.
    -- Interaction: On the Detail Page (Flow 3), a button labeled "Analyze Dream with AI" is present.
    -- System Check (Subscription Logic):
        A. Check `free_insights_used` counter against the limit (5).
        B. If Used < 5 (Free User): Increment counter on the backend, display loading/processing animation (ethereal swirling animation), call Gemini API.
        C. If Used >= 5 (Free User): Display soft Paywall Modal ("You have used all 5 free insights. Unlock unlimited analysis for ₹499/month."). CTA directs to Subscription Flow (Flow 4).
        D. If Paid User: Bypass check, call Gemini API, display result.

FLOW 3: Dream Detail Viewing and Insight Analysis
-------------------------------------------------
Step 3.1: Navigation to Detail Page
    -- Entry Point: User clicks on a specific dream card from the Dashboard list.

Step 3.2: Dream Detail View (Detail Page Wireframe Description)
    -- Structure: Minimalist layout emphasizing the text content, framed by the dark, atmospheric theme.
    -- Metadata Section (Top/Side Panel):
        -- Date Recorded: [Date]
        -- Dream Title: [Title]
        -- Mood Upon Waking: [Mood Icon/Label]
        -- Lucid Dream?: [Yes/No]
        -- Tags/Keywords: [List of Tags]
    -- Main Content Area:
        -- Full Dream Narrative (Large, readable text).
        -- AI Insight Section (Conditionally Displayed): If insight exists, it's displayed prominently below the narrative, stylized with a soft border or gradient background.
            * Heading: "Gemini Insight & Significance"
            * Content: Analysis covering recurring themes, symbolic meanings, emotional correlation, and connection to waking life examples.

Step 3.3: Interaction Options
    -- Edit Button: Allows the user to return to the detailed input form (Flow 2.3) to modify any field, including the narrative. (Note: Editing narrative invalidates the existing AI insight, requiring a new generation if requested).
    -- Request New Insight Button: (Only visible if current insight is missing OR user edits narrative) Triggers Flow 2.4.
    -- Delete Entry: Triggers a confirmation modal ("Are you sure you want to erase this memory?").

FLOW 4: Subscription Management (Monetization Path)
----------------------------------------------------
Step 4.1: Accessing Upsell/Subscription Page
    -- Entry Point: Triggered from Flow 2.4 (hard limit reached) or via a dedicated "Upgrade" link on the Dashboard/Settings.

Step 4.2: Subscription Landing Page
    -- Content: Clear comparison between the Free Tier (limited insights) and the Premium Tier (Unlimited Insights for ₹499/month). Focus on value delivered (deeper analysis, consistency).
    -- CTA: "Unlock Now - ₹499/Month" (Initiates payment gateway simulation/integration).

Step 4.3: Purchase Confirmation & Status Update
    -- System Action: Upon successful (simulated) payment, update the user profile backend flag for subscription status (e.g., `is_premium = true`).
    -- System Action: Resetting the counter is implicit as premium users bypass the counter check (Flow 2.4.C).
    -- Transition: Return user to the Dashboard, where the Insight Counter now displays "Unlimited Access."

## Styling Guidelines
# Dream Catcher: Styling Guidelines Document

## 1. Design Philosophy and Vision

Dream Catcher aims to be a sanctuary for personal reflection, utilizing AI to unlock the subconscious. The styling must evoke a sense of calm, introspection, and the surreal nature of dreams. The aesthetic prioritizes a dark, enveloping environment suitable for early morning or late-night use, contrasted with ethereal, soft highlights. The overall feeling should be 'velvety,' 'floating,' and 'cosmic,' avoiding harshness.

## 2. Color Palette

The palette is built around deep, nocturnal base colors and soft, glowing accents inspired by nebulae and twilight skies.

| Color Name | Hex Code | Usage Context |
| :--- | :--- | :--- |
| **Primary Background (Deep Night)** | `#0A0E1F` | Main background color for all screens. Provides maximum contrast for text and highlights. |
| **Secondary Background (Deep Indigo)** | `#120A1F` | Used for subtle card backgrounds, side navigation, or elevated elements to create depth. |
| **Primary Accent (Ethereal Violet)** | `#9F7AEA` | Primary CTA buttons, active states, main highlight color, and the core of the dream haze effect. |
| **Secondary Accent (Soft Blue)** | `#60A5FA` | Secondary highlights, border glows, unselected states, and date/time metadata. |
| **Tertiary Accent (Lucid Glow)** | `#C9A0FF` | Reserved for 'Lucid Dream' indicators, premium feature callouts, and specific mystical elements. |
| **Text - Primary (Soft White)** | `#F5F5F5` | Main body text, titles, and primary labels. Needs high readability against dark backgrounds. |
| **Text - Secondary (Muted Gray)** | `#B0B0C0` | Subtitles, metadata (date, tags), helper text, and disabled elements. |
| **Alert/Error (Subtle Magenta)** | `#FF6B81` | Used sparingly for error states or security warnings; must remain muted to fit the dream aesthetic. |

**Gradient Notes:**
Soft, vertical or radial gradients using combinations of `Primary Accent` and `Secondary Accent` should be used sparingly on the Landing Page hero section and dashboard card accents to simulate a 'haze' or 'glow.' Avoid sharp transitions.

## 3. Typography

Typography must balance readability (essential for journaling) with a modern, slightly futuristic or mystical feel. We will utilize clean, modern sans-serif fonts.

**Recommended Font Families:** Inter or Manrope (or closest available system equivalents).

| Element | Font Family | Weight | Size (Desktop/Mobile) | Styling Notes |
| :--- | :--- | :--- | :--- | :--- |
| **H1 (Page Titles)** | Selected Sans-Serif | Bold (700) | 2.5rem / 2.0rem | Should feature a subtle, soft outer glow effect (e.g., `text-shadow: 0 0 8px rgba(159, 170, 234, 0.6);`) to give a mystical, neon quality. |
| **H2 (Section Headers)** | Selected Sans-Serif | SemiBold (600) | 1.75rem / 1.5rem | Use `Primary Accent` color for key headers on the Dashboard. |
| **Body Text** | Selected Sans-Serif | Regular (400) | 1rem / 0.95rem | High contrast, clean reading experience. |
| **Metadata/Labels** | Selected Sans-Serif | Regular (400) | 0.85rem / 0.8rem | Use `Text - Secondary` color. |
| **UI Elements (Buttons/Input)** | Selected Sans-Serif | Medium (500) | 1rem / 0.9rem | Clean and crisp for interaction feedback. |

## 4. Imagery and Iconography

Imagery should be minimal, abstract, and focus on cosmic, ethereal, or subconscious themes (e.g., stars, soft nebulas, abstract light forms).

*   **Icons:** Use clean, line-based, slightly rounded icons (e.g., Feather or Material Icons library). Active states should utilize the `Primary Accent` color.
*   **Illustrations (Landing Page):** If used, illustrations must adhere strictly to the dark mode theme, featuring soft gradients, depth, and a sense of floating or cosmic depth. Avoid flat, brightly colored graphics.

## 5. UI/UX Principles

The interaction design must support the user's morning ritual: quick input, secure viewing, and gentle feedback.

### 5.1. Layout and Structure

*   **Dark Mode First:** The design is optimized exclusively for the provided dark color palette. Light mode is strictly out of scope.
*   **Card Design:** Use rounded corners (e.g., 12px radius) for all cards (dream summaries, input fields). Cards should subtly float using a very light inner shadow or a slight border glow using `Secondary Accent` to separate them from the deep background without high contrast.
*   **Spacing:** Generous vertical padding to enhance the 'floating' and uncrowded feel.

### 5.2. Interaction and Feedback

*   **Hover/Focus States:** Interactions (buttons, links) should react with a subtle "bloom" or soft glow of the `Primary Accent` color rather than abrupt color changes.
*   **Input Fields:** Text inputs should have a slightly darker background than the main screen (`Secondary Background`) with a border that glows softly (`Primary Accent`) upon focus.
*   **Lucidity Tagging:** The 'Lucid Dream' checkbox or tag must use the vibrant `Tertiary Accent` color (`#C9A0FF`) to stand out as a significant marker.

### 5.3. Dashboard and Data Visualization

*   **Statistics:** Data visualizations (e.g., dream frequency charts) must use soft, gradient fills derived from the primary palette. Avoid sharp bar charts; consider smooth line graphs or radial charts.
*   **Search/Filter:** Filters should be collapsible and use muted input styles. Active filters should clearly illuminate using the `Primary Accent`.

### 5.4. Dream Detail Page

This page is the core interaction space between the user's memory and the AI insight.

*   **Dream Content:** Displayed prominently in clean `Text - Primary`.
*   **Metadata Section:** Placed clearly but secondary, using smaller font size and `Text - Secondary` color (Date, Mood, Tags). Moods should be represented by subtle color-coded tags (e.g., Happy = soft yellow glow, Anxious = muted magenta glow).
*   **AI Insight Block:** This section should be visually distinct, perhaps enclosed in a softly glowing panel or bordered by the `Primary Accent`. The AI text itself should feel authoritative yet gentle.

### 5.5. Subscription & Paywall

The paywall must be elegant and non-aggressive, fitting the serene environment.

*   **Upsell Messaging:** Language should focus on unlocking potential ("Unlock Deeper Insights," "Full Dream Potential") rather than limitations.
*   **Visual Treatment:** The subscription prompt should use the `Tertiary Accent` for the main "Upgrade Now" button, framed within a slightly more elevated or vibrant card to draw attention without jarring the user.
