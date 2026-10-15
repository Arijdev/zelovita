# 🌿 ZeloVita — Dr. Arif Chowdhury's Clinical Health Ecosystem

A modern, high-performance, full-stack digital health platform and e-commerce clinical library developed for **Dr. Arif Chowdhury**. Built with **Next.js 16 (Turbopack)**, **React 19**, **Tailwind CSS v4**, and **Supabase**.

---

## ✨ Key Features

### 📚 Clinical Resource Library & E-Commerce
- **Digital Guides & Protocols**: Evidence-based metabolic, longevity, and clinical PDFs.
- **Dynamic PDF Generator & Secure Delivery**: Server-side PDF rendering using `pdfkit` and dynamic watermarking/download streaming via `/api/download`.
- **In-Browser PDF Viewer**: Built-in interactive document preview with zoom, rotation, page jumping, and pagination using `pdfjs-dist`.
- **Cart & PayPal Checkout**: Persistent cart context, promo codes, server-verified PayPal sandbox payments, and purchase history.

### 🩺 Interactive Clinical Health Tools
- **Health Calculators**:
  - BMI & Healthy Weight Range
  - Basal Metabolic Rate (BMR) & Daily Caloric Needs (TDEE)
  - Body Fat Percentage Calculator
  - Water Intake & Hydration Recommendations
- **60-Second Health Assessment Quiz**: Step-by-step diagnostic questionnaire providing customized health scorecards and recommended protocols.
- **Consultation Booking Engine**: Authenticated 15/30/60-minute booking, duration-matched IST slots, PayPal payment, and account history.

### 🔐 Authentication & Patient Portal
- **Supabase Auth**: Email/Password, Magic Link OTP verification, and Google OAuth support.
- **Customer Dashboard ("My Library")**: Instant access to purchased/unlocked guides with 1-click re-download and interactive in-browser reader.
- **Doctor / Admin Portal**: Secure portal to upload new health guides (stored in Supabase Storage buckets), update pricing, manage resources, and track platform metrics.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router & Turbopack) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with Vanilla CSS variables |
| **Database & Auth** | [Supabase](https://supabase.com/) (`@supabase/supabase-js`, `@supabase/ssr`) |
| **Icons & UI** | [Lucide React](https://lucide.dev/) & Canvas Confetti |
| **Document Processing**| `pdfkit`, `pdfjs-dist`, `canvas` |
| **Language & Tooling** | TypeScript 5, ESLint 9 |

---

## 📁 Project Architecture

```
health/
├── public/                     # Static assets and icons
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── about/              # About Dr. Arif Chowdhury page
│   │   ├── api/                # API routes (auth, download, resources, upload)
│   │   ├── articles/           # Evidence-based medical articles
│   │   ├── auth/callback/      # OAuth redirect handler
│   │   ├── calculators/        # Clinical health calculators
│   │   ├── consultation/       # Private consultation booking
│   │   ├── guides/             # Health guides catalog
│   │   ├── quiz/               # 60-Second Health Assessment
│   │   ├── globals.css         # Theme tokens, dark mode, utilities
│   │   ├── layout.tsx          # Root layout & context providers
│   │   └── page.tsx            # Main landing page
│   ├── components/             # Reusable UI & modal components
│   │   ├── AuthModal.tsx       # Login, Signup, OTP modal
│   │   ├── CartDrawer.tsx      # Slide-out shopping cart
│   │   ├── CheckoutModal.tsx   # Checkout & payment processing
│   │   ├── ConsultationBooking.tsx
│   │   ├── CustomerDashboardModal.tsx
│   │   ├── DoctorPortalModal.tsx
│   │   ├── Header.tsx & Footer.tsx
│   │   ├── HealthCalculators.tsx
│   │   ├── HealthQuiz.tsx
│   │   ├── InteractiveReaderModal.tsx
│   │   ├── PdfPreviewModal.tsx
│   │   ├── ResourceLibrary.tsx
│   │   └── SearchModal.tsx
│   ├── context/                # React Contexts (AuthContext, CartContext)
│   └── lib/                    # Supabase clients & utility helpers
├── SUPABASE_SETUP.sql          # Database schema, tables, and storage policies
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or higher recommended
- **npm**, **pnpm**, or **yarn**
- A [Supabase](https://supabase.com) project (for DB, Auth, and Storage)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/zelovita.git
cd health
npm install
```

### 3. Environment Variables Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
```

Keep `PAYPAL_CLIENT_SECRET` server-only. Create a sandbox REST app and test buyer in the PayPal Developer Dashboard. PayPal order amounts are charged in USD; local currency is a display estimate.

### 4. Database Setup

For a new project, execute [`SUPABASE_SETUP.sql`](./SUPABASE_SETUP.sql) inside the Supabase SQL Editor. For an existing project, run the additive [`PAYPAL_SETUP.sql`](./PAYPAL_SETUP.sql) migration instead. The setup provisions:
- `resources` table (Health guides, pricing, ratings, download links)
- `purchases`, `payment_orders`, and user profiles
- Storage buckets (`guides-pdf`) with appropriate RLS policies

The script also adds the `payment_orders` table and paid-consultation ownership columns used by PayPal. Existing projects must rerun the script after deploying this payment flow.

### 5. Running the Application

Start the local development server:

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the Next.js app in development mode with Turbopack |
| `npm run build` | Compiles and validates the production build |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint validation across all TypeScript and React files |

---

## 🔒 Security & Medical Disclaimer

- **Medical Disclaimer**: The resources, calculators, and protocols provided on this site are for educational and clinical guidance under the instruction of Dr. Arif Chowdhury and do not replace individualized hospital care.
- **File Security**: Digital guide downloads are signed and verified to prevent unauthorized sharing.

---

## 📄 License

Private & Proprietary © 2026 Dr. Arif Chowdhury / ZeloVita. All Rights Reserved.
