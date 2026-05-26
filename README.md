# HELIX MERIDIAN — Part 1: Foundation + Auth

## What's in this part
- Landing page (marketing)
- Company registration (multi-step)
- Admin login
- Admin dashboard
- Plan/Pricing management
- HR account management
- Admin settings
- Full auth system via Supabase
- All shared UI components

---

## Setup in 5 steps

### 1. Install dependencies
```bash
npm install
```

### 2. Create Supabase project
Go to https://supabase.com → New Project → copy URL + anon key

### 3. Set up environment
```bash
cp .env.example .env
# Fill in your Supabase URL and anon key
```

### 4. Run DB schema
In Supabase → SQL Editor → paste the schema from:
`src/lib/supabase.js` (the big comment block at the top)

### 5. Run dev server
```bash
npm run dev
```
Open http://localhost:5173

---

## Deploy to Vercel
```bash
npm run build
# Push to GitHub → connect repo on vercel.com
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY as env vars
```

---

## Folder structure
```
src/
├── components/
│   ├── auth/       AuthLayout, Guards
│   ├── admin/      AdminLayout (sidebar)
│   └── ui/         All shared components
├── lib/
│   ├── supabase.js DB client + schema
│   └── auth.jsx    Auth context
├── pages/
│   ├── Landing.jsx
│   ├── auth/       Login, Register
│   └── admin/      Dashboard, Pricing, HRManagement, Settings
└── styles/
    └── globals.css
```

---

## Next: Part 2 — HR Dashboard
(Excel upload, candidate ingestion, email invites, meeting scheduling)
