# Inspire NGO - Intern Tracking & Coordination Portal

A serverless, low-cost (free tier) web application built for NGOs to manage, track, and coordinate intern monthly progress reports with strict power-sharing hierarchy.

---

## 👥 The 4-Tier Role Hierarchy

1. **Management (Board / Director):** High-level institutional auditing, total volunteer hours clocked, and CSV export.
2. **Senior Secretary (You):** Central coordination authority. Oversees the 3 Junior Secretaries, tracks all ~70 interns, and reassigns interns between Junior Secretaries.
3. **Junior Secretaries (3 Team Leads):** Field supervision. Direct access **only** to their assigned interns; reviews monthly submissions and provides feedback.
4. **Interns:** Submit monthly milestones (tasks accomplished, hours, challenges, next month goals) and review feedback from their supervisor.

---

## 🚀 How to Run Locally

1. Open your terminal in this directory:
   ```powershell
   npm run dev
   ```
2. Open the URL shown (typically `http://localhost:5173`) in your web browser.
3. Use the **"Viewing as"** selector in the top bar to switch between Senior Secretary, Junior Secretaries, and Interns to test all permissions live!

---

## 🗄️ Supabase Setup (Database & Power Sharing)

The app includes `supabase_schema.sql` which enforces database-level **Row-Level Security (RLS)**:

1. Create a free account at [supabase.com](https://supabase.com).
2. Create a new free project.
3. Go to the **SQL Editor** tab in the Supabase dashboard.
4. Copy the entire contents of `supabase_schema.sql` and click **Run**.
5. Go to **Project Settings** -> **API** and copy:
   * Project URL
   * `anon` / Public Key
6. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## 🌐 Free Deployment via Vercel

1. Push this folder to a free GitHub repository.
2. Sign in to [Vercel](https://vercel.com) using your GitHub account.
3. Click **"Add New Project"** and select your GitHub repository.
4. (Optional) Add your Supabase environment variables in the Vercel dashboard.
5. Click **Deploy**. Your app will be live on an HTTPS link in under 1 minute.
