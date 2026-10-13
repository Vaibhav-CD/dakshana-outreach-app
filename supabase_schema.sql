-- ==============================================================================
-- DAKSHANA OUTREACH INTERNSHIP - DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ==============================================================================

-- 1. Roles & Status Enums
CREATE TYPE user_role AS ENUM ('management', 'senior_sec', 'junior_sec', 'intern');
CREATE TYPE report_status AS ENUM ('draft', 'submitted', 'reviewed', 'revision_requested');
CREATE TYPE reimbursement_status AS ENUM ('pending', 'approved', 'rejected', 'paid');
CREATE TYPE audience_target AS ENUM ('all', 'junior_secs', 'batch_1', 'batch_2', 'all_interns', 'management');

-- 2. User Profiles Table (Batch 1 & Batch 2 Support)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'intern',
    batch TEXT DEFAULT 'Batch 1' CHECK (batch IN ('Batch 1', 'Batch 2')),
    phone TEXT,
    photo_url TEXT,
    bio TEXT,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Intern Supervision Mapping (Senior Sec allocates to Junior Secs)
CREATE TABLE public.intern_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intern_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    junior_sec_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_intern_assignment UNIQUE (intern_id)
);

-- 4. Monthly Progress Reports
CREATE TABLE public.monthly_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intern_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL,
    tasks_completed TEXT NOT NULL,
    hours_contributed INTEGER DEFAULT 0,
    challenges_faced TEXT,
    next_month_goals TEXT,
    status report_status NOT NULL DEFAULT 'submitted',
    reviewer_feedback TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_intern_monthly_report UNIQUE (intern_id, month_year)
);

-- 5. Student / Intern Sessions Tracker (Visual Session Data with Batch)
CREATE TABLE public.session_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intern_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    batch TEXT NOT NULL DEFAULT 'Batch 1',
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    sessions_conducted INTEGER NOT NULL DEFAULT 1,
    students_attended INTEGER NOT NULL DEFAULT 0,
    topic TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Reimbursement Cycles & Claims (Controlled by Senior Secretary)
CREATE TABLE public.reimbursement_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month_year TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT false,
    activated_by UUID REFERENCES public.profiles(id),
    deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.reimbursement_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id UUID NOT NULL REFERENCES public.reimbursement_cycles(id) ON DELETE CASCADE,
    intern_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    upi_or_bank TEXT NOT NULL,
    purpose TEXT NOT NULL,
    status reimbursement_status NOT NULL DEFAULT 'pending',
    approved_by UUID REFERENCES public.profiles(id),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Resource Spaces (Staff Vault vs Scholars Hub)
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    category TEXT NOT NULL,
    target_space TEXT NOT NULL CHECK (target_space IN ('staff', 'interns')),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Broadcast Notification Center (Batch-Targeted)
CREATE TABLE public.broadcast_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_audience audience_target NOT NULL DEFAULT 'all',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intern_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reimbursement_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reimbursement_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_messages ENABLE ROW LEVEL SECURITY;
