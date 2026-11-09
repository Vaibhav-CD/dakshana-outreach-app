-- ==============================================================================
-- DAKSHANA OUTREACH INTERNSHIP - COMPLETE PRODUCTION SCHEMA (SUPABASE POSTGRESQL)
-- ==============================================================================

-- 1. Create Enums if they don't already exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('management', 'senior_sec', 'junior_sec', 'intern');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('draft', 'submitted', 'reviewed', 'revision_requested');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE reimbursement_status AS ENUM ('pending', 'approved', 'rejected', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audience_target AS ENUM ('all', 'junior_secs', 'batch_1', 'batch_2', 'all_interns', 'management');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table (Scholars, Secretaries, Management)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'intern',
    batch TEXT DEFAULT 'Batch 1' CHECK (batch IN ('Batch 1', 'Batch 2')),
    phone TEXT,
    photo_url TEXT,
    bio TEXT,
    department TEXT,
    assigned_to UUID,
    password_hash TEXT,
    target_visits INTEGER DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migrations for existing setups
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_visits INTEGER DEFAULT 15;

-- 3. Monthly Progress Reports Table
CREATE TABLE IF NOT EXISTS public.monthly_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intern_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    intern_name TEXT NOT NULL,
    batch TEXT NOT NULL DEFAULT 'Batch 1',
    junior_sec_id UUID,
    month_year TEXT NOT NULL,
    tasks_completed TEXT NOT NULL,
    hours_contributed INTEGER DEFAULT 0,
    challenges_faced TEXT,
    next_month_goals TEXT,
    status report_status NOT NULL DEFAULT 'submitted',
    reviewer_feedback TEXT,
    reviewed_by TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Student / Intern Sessions Tracker
CREATE TABLE IF NOT EXISTS public.session_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intern_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    intern_name TEXT NOT NULL,
    batch TEXT NOT NULL DEFAULT 'Batch 1',
    wing TEXT NOT NULL,
    topic TEXT NOT NULL,
    sessions_count INTEGER NOT NULL DEFAULT 1,
    students_reached INTEGER NOT NULL DEFAULT 0,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Reimbursement Cycles & Claims
CREATE TABLE IF NOT EXISTS public.reimbursement_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month_year TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    activated_by TEXT NOT NULL DEFAULT 'Senior Secretary',
    deadline DATE,
    stipend_standard NUMERIC(10, 2) NOT NULL DEFAULT 3000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reimbursement_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intern_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    intern_name TEXT NOT NULL,
    batch TEXT NOT NULL DEFAULT 'Batch 1',
    month_year TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    upi_or_bank TEXT NOT NULL,
    purpose TEXT NOT NULL,
    status reimbursement_status NOT NULL DEFAULT 'pending',
    approved_by TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Resource Materials Hub
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    category TEXT NOT NULL,
    target_space TEXT NOT NULL CHECK (target_space IN ('staff', 'interns')),
    added_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Broadcast Circulars & Notifications
CREATE TABLE IF NOT EXISTS public.broadcast_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    audience audience_target NOT NULL DEFAULT 'all',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reimbursement_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reimbursement_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_messages ENABLE ROW LEVEL SECURITY;

-- Transparent Access Policies (Allow reading and writes from the client app)
DO $$ BEGIN
    CREATE POLICY "Allow public select on profiles" ON public.profiles FOR SELECT USING (true);
    CREATE POLICY "Allow public insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public update on profiles" ON public.profiles FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public select on monthly_reports" ON public.monthly_reports FOR SELECT USING (true);
    CREATE POLICY "Allow public insert on monthly_reports" ON public.monthly_reports FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public update on monthly_reports" ON public.monthly_reports FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public select on session_logs" ON public.session_logs FOR SELECT USING (true);
    CREATE POLICY "Allow public insert on session_logs" ON public.session_logs FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public select on reimbursement_cycles" ON public.reimbursement_cycles FOR SELECT USING (true);
    CREATE POLICY "Allow public insert on reimbursement_cycles" ON public.reimbursement_cycles FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public update on reimbursement_cycles" ON public.reimbursement_cycles FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public select on reimbursement_claims" ON public.reimbursement_claims FOR SELECT USING (true);
    CREATE POLICY "Allow public insert on reimbursement_claims" ON public.reimbursement_claims FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public update on reimbursement_claims" ON public.reimbursement_claims FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public select on resources" ON public.resources FOR SELECT USING (true);
    CREATE POLICY "Allow public insert on resources" ON public.resources FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public select on broadcast_messages" ON public.broadcast_messages FOR SELECT USING (true);
    CREATE POLICY "Allow public insert on broadcast_messages" ON public.broadcast_messages FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 8. Community Outreach Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_photo TEXT,
    batch TEXT NOT NULL DEFAULT 'Batch 1',
    wing TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    photo_url TEXT,
    school_name TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    visits_logged INTEGER NOT NULL DEFAULT 0,
    students_reached INTEGER NOT NULL DEFAULT 0,
    cheers_count INTEGER NOT NULL DEFAULT 0,
    comments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Allow public select on posts" ON public.posts FOR SELECT USING (true);
    CREATE POLICY "Allow public insert on posts" ON public.posts FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public update on posts" ON public.posts FOR UPDATE USING (true);
    CREATE POLICY "Allow public delete on posts" ON public.posts FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 9. Queries & Doubts Discussion Hub
CREATE TABLE IF NOT EXISTS public.queries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL DEFAULT 'intern',
    batch TEXT NOT NULL DEFAULT 'All Batches',
    title TEXT NOT NULL,
    question TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    status TEXT NOT NULL DEFAULT 'open',
    answers JSONB DEFAULT '[]'::jsonb,
    upvotes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Allow public select on queries" ON public.queries FOR SELECT USING (true);
    CREATE POLICY "Allow public insert on queries" ON public.queries FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public update on queries" ON public.queries FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 10. Suggestions & Bug Feedback Desk
CREATE TABLE IF NOT EXISTS public.feedback (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL DEFAULT 'intern',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'bug',
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Allow public select on feedback" ON public.feedback FOR SELECT USING (true);
    CREATE POLICY "Allow public insert on feedback" ON public.feedback FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public update on feedback" ON public.feedback FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==============================================================================
-- PRODUCTION HARDENED ROW-LEVEL SECURITY (RLS) POLICIES
-- NOTE: In production environments with Supabase Auth enabled, revoke open anon
-- wildcard policies above and apply these authenticated role-bound policies:
-- ==============================================================================
/*
-- 1. Profiles: Users can only update their own profile; only senior_sec/management can update roles
DROP POLICY IF EXISTS "Allow public update on profiles" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = auth_user_id)
    WITH CHECK (auth.uid() = auth_user_id);

-- 2. Claims: Scholars can only submit claims for themselves; status forced to 'pending'
DROP POLICY IF EXISTS "Allow public insert on reimbursement_claims" ON public.reimbursement_claims;
CREATE POLICY "Scholars can insert own pending claims" ON public.reimbursement_claims
    FOR INSERT TO authenticated
    WITH CHECK (status = 'pending' AND intern_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Allow public update on reimbursement_claims" ON public.reimbursement_claims;
CREATE POLICY "Only secretariat/management can approve claims" ON public.reimbursement_claims
    FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE auth_user_id = auth.uid() AND role IN ('senior_sec', 'management')
    ));

-- 3. Reports: Scholars cannot pre-review reports upon creation
DROP POLICY IF EXISTS "Allow public insert on monthly_reports" ON public.monthly_reports;
CREATE POLICY "Scholars can insert own submitted reports" ON public.monthly_reports
    FOR INSERT TO authenticated
    WITH CHECK (status = 'submitted' AND intern_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Allow public update on monthly_reports" ON public.monthly_reports;
CREATE POLICY "Only supervisors can review monthly reports" ON public.monthly_reports
    FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE auth_user_id = auth.uid() AND role IN ('senior_sec', 'junior_sec', 'management')
    ));

-- 4. Circulars: Only leadership can transmit broadcasts
DROP POLICY IF EXISTS "Allow public insert on broadcast_messages" ON public.broadcast_messages;
CREATE POLICY "Only leadership can post broadcasts" ON public.broadcast_messages
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE auth_user_id = auth.uid() AND role IN ('senior_sec', 'junior_sec', 'management')
    ));
*/
