export const INITIAL_USERS = [
  {
    id: 'user-senior-sec',
    name: 'Senior Secretary',
    title: 'Senior Secretary & Central Operations Lead',
    email: 'senior.sec@inspire-ngo.org',
    role: 'senior_sec',
    department: 'Central Coordination',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Oversees overall workflow, intern allocations, policy execution, and monthly disbursement cycles across all wings.'
  },
  {
    id: 'user-mgmt',
    name: 'Dr. Rajiv Menon',
    title: 'Executive Director & Trustee',
    email: 'management@inspire-ngo.org',
    role: 'management',
    department: 'Governing Board',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'Guides long-term institutional vision, budget governance, and organizational impact strategies.'
  },
  {
    id: 'user-jsec-1',
    name: 'Priya Sharma',
    title: 'Junior Secretary - Wing 1',
    email: 'priya.jsec@inspire-ngo.org',
    role: 'junior_sec',
    department: 'Community Outreach & Fieldwork',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'Directly mentors field interns, validates grassroots session reports, and handles local community logistics.'
  },
  {
    id: 'user-jsec-2',
    name: 'Rohan Verma',
    title: 'Junior Secretary - Wing 2',
    email: 'rohan.jsec@inspire-ngo.org',
    role: 'junior_sec',
    department: 'Education & Curriculum Support',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bio: 'Coordinates teaching scholars, reviews student progress metrics, and standardizes educational curriculum.'
  },
  {
    id: 'user-jsec-3',
    name: 'Sneha Kulkarni',
    title: 'Junior Secretary - Wing 3',
    email: 'sneha.jsec@inspire-ngo.org',
    role: 'junior_sec',
    department: 'Digital Media & Communications',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    bio: 'Leads digital storytelling, newsletters, student impact broadcasts, and media interns.'
  },
  // Sample Interns
  {
    id: 'user-intern-1',
    name: 'Aarav Gupta',
    title: 'Teaching Fellow / Scholar',
    email: 'aarav.intern@inspire-ngo.org',
    role: 'intern',
    assignedTo: 'user-jsec-1',
    department: 'Community Outreach',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    bio: 'Conducting weekend foundational learning sessions in Cluster B.'
  },
  {
    id: 'user-intern-2',
    name: 'Meera Iyer',
    title: 'Community Field Scholar',
    email: 'meera.intern@inspire-ngo.org',
    role: 'intern',
    assignedTo: 'user-jsec-1',
    department: 'Community Outreach',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    bio: 'Focusing on maternal health and nutrition survey implementation.'
  },
  {
    id: 'user-intern-3',
    name: 'Kabir Das',
    title: 'STEM Curriculum Intern',
    email: 'kabir.intern@inspire-ngo.org',
    role: 'intern',
    assignedTo: 'user-jsec-2',
    department: 'Education',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    bio: 'Conducting STEM lab modules for middle school students.'
  },
  {
    id: 'user-intern-4',
    name: 'Ananya Rao',
    title: 'Literacy Mentor',
    email: 'ananya.intern@inspire-ngo.org',
    role: 'intern',
    assignedTo: 'user-jsec-2',
    department: 'Education',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    bio: 'Teaching foundational reading and spoken English classes.'
  },
  {
    id: 'user-intern-5',
    name: 'Vikram Joshi',
    title: 'Media & Documentation Intern',
    email: 'vikram.intern@inspire-ngo.org',
    role: 'intern',
    assignedTo: 'user-jsec-3',
    department: 'Digital Media',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    bio: 'Recording field documentaries and drafting monthly impact summaries.'
  }
]

export const INITIAL_REPORTS = [
  {
    id: 'rep-1',
    internId: 'user-intern-1',
    internName: 'Aarav Gupta',
    juniorSecId: 'user-jsec-1',
    monthYear: 'October 2026',
    tasksCompleted: 'Conducted 16 learning sessions across 2 community hubs. Mentored 42 individual scholars.',
    hoursContributed: 38,
    challengesFaced: 'Classroom lighting issues in center #2; requested portable whiteboard kits.',
    nextMonthGoals: 'Launch intermediate math workshop module.',
    status: 'reviewed',
    reviewerFeedback: 'Outstanding diligence Aarav. Whiteboard kits approved by Senior Secretary.',
    reviewedBy: 'Priya Sharma',
    updatedAt: '2026-10-10'
  },
  {
    id: 'rep-2',
    internId: 'user-intern-2',
    internName: 'Meera Iyer',
    juniorSecId: 'user-jsec-1',
    monthYear: 'October 2026',
    tasksCompleted: 'Conducted 12 health education sessions for 85 village residents.',
    hoursContributed: 30,
    challengesFaced: 'Heavy monsoon rains caused attendance dip on week 2.',
    nextMonthGoals: 'Complete nutrition tracking cards for 50 families.',
    status: 'submitted',
    reviewerFeedback: '',
    reviewedBy: null,
    updatedAt: '2026-10-12'
  },
  {
    id: 'rep-3',
    internId: 'user-intern-3',
    internName: 'Kabir Das',
    juniorSecId: 'user-jsec-2',
    monthYear: 'October 2026',
    tasksCompleted: 'Held 18 robotics & science hands-on workshop periods with grade 7 scholars.',
    hoursContributed: 44,
    challengesFaced: 'Component shortage for circuit breadboards.',
    nextMonthGoals: 'Science demonstration day for parents.',
    status: 'reviewed',
    reviewerFeedback: 'Great practical engagement! Please coordinate with Rohan on inventory.',
    reviewedBy: 'Rohan Verma',
    updatedAt: '2026-10-11'
  },
  {
    id: 'rep-4',
    internId: 'user-intern-4',
    internName: 'Ananya Rao',
    juniorSecId: 'user-jsec-2',
    monthYear: 'October 2026',
    tasksCompleted: '14 English reading circles completed; 30 beginner readers tested.',
    hoursContributed: 32,
    challengesFaced: 'Needs graded storybooks for level 1 readers.',
    nextMonthGoals: 'Add phonics flashcards to weekly routine.',
    status: 'submitted',
    reviewerFeedback: '',
    reviewedBy: null,
    updatedAt: '2026-10-13'
  }
]

// Visual Session Tracking Data (Sessions done by scholars)
export const INITIAL_SESSIONS = [
  { internId: 'user-intern-1', internName: 'Aarav Gupta', sessionsCount: 16, studentsReached: 48, wing: 'Wing 1 (Priya)', topic: 'Foundational Numeracy' },
  { internId: 'user-intern-2', internName: 'Meera Iyer', sessionsCount: 12, studentsReached: 65, wing: 'Wing 1 (Priya)', topic: 'Health & Hygiene' },
  { internId: 'user-intern-3', internName: 'Kabir Das', sessionsCount: 18, studentsReached: 54, wing: 'Wing 2 (Rohan)', topic: 'Robotics & Science' },
  { internId: 'user-intern-4', internName: 'Ananya Rao', sessionsCount: 14, studentsReached: 38, wing: 'Wing 2 (Rohan)', topic: 'Literacy & Phonics' },
  { internId: 'user-intern-5', internName: 'Vikram Joshi', sessionsCount: 8, studentsReached: 120, wing: 'Wing 3 (Sneha)', topic: 'Media Storytelling' },
]

// Reimbursement Cycle Data
export const INITIAL_REIMBURSEMENT_CYCLE = {
  monthYear: 'October 2026',
  isActive: true, // Activated by Senior Sec / Management
  activatedBy: 'Senior Secretary',
  deadline: '2026-10-25',
  stipendStandard: 3000
}

export const INITIAL_REIMBURSEMENT_CLAIMS = [
  {
    id: 'clm-1',
    internId: 'user-intern-1',
    internName: 'Aarav Gupta',
    monthYear: 'October 2026',
    amount: 3250,
    upiOrBank: 'aarav@okaxis',
    purpose: 'Monthly stipend (₹3,000) + Bus travel tickets to cluster B (₹250)',
    status: 'approved',
    approvedBy: 'Senior Secretary',
    paidAt: null
  },
  {
    id: 'clm-2',
    internId: 'user-intern-2',
    internName: 'Meera Iyer',
    monthYear: 'October 2026',
    amount: 3000,
    upiOrBank: 'meera.iyer@okhdfcbank',
    purpose: 'Standard monthly scholar stipend',
    status: 'pending',
    approvedBy: null,
    paidAt: null
  },
  {
    id: 'clm-3',
    internId: 'user-intern-3',
    internName: 'Kabir Das',
    monthYear: 'October 2026',
    amount: 3400,
    upiOrBank: 'kabir.das@sbi',
    purpose: 'Monthly stipend (₹3,000) + Science kit materials photocopy (₹400)',
    status: 'approved',
    approvedBy: 'Senior Secretary',
    paidAt: '2026-10-12'
  }
]

// Resources Hub: 2 distinct spaces (Staff vs Interns)
export const INITIAL_RESOURCES = [
  // Space 1: Staff / Leadership Only
  {
    id: 'res-staff-1',
    targetSpace: 'staff',
    title: 'Secretarial Standard Operating Procedures (SOP 2026)',
    category: 'Governance & SOP',
    url: 'https://docs.google.com/document/d/sample-sop',
    description: 'Detailed rubric for Junior Secretaries on grading monthly reports, escalation chains, and dispute resolution.',
    addedBy: 'Senior Secretary'
  },
  {
    id: 'res-staff-2',
    targetSpace: 'staff',
    title: 'Trustee & Board Audit Dashboard Sheet',
    category: 'Finance & Audits',
    url: 'https://docs.google.com/spreadsheets/d/sample-audit',
    description: 'Monthly disbursement ledger, 80G tax compliance records, and annual budget projections.',
    addedBy: 'Dr. Rajiv Menon'
  },
  {
    id: 'res-staff-3',
    targetSpace: 'staff',
    title: 'Intern Reallocation & Track Transfer Form',
    category: 'HR & Workflows',
    url: 'https://forms.google.com/sample-reallocation',
    description: 'Official form for Junior Secretaries to request transferring an intern between wings.',
    addedBy: 'Senior Secretary'
  },

  // Space 2: Interns / Scholars Materials
  {
    id: 'res-intern-1',
    targetSpace: 'interns',
    title: 'Monthly Progress Report Template & Guidelines',
    category: 'Reporting Guide',
    url: 'https://docs.google.com/document/d/sample-template',
    description: 'Official template for structuring your monthly progress report before submitting.',
    addedBy: 'Senior Secretary'
  },
  {
    id: 'res-intern-2',
    targetSpace: 'interns',
    title: 'Teaching Scholars Curriculum Drive (Grade 1-8)',
    category: 'Study Materials',
    url: 'https://drive.google.com/drive/folders/sample-curriculum',
    description: 'Approved worksheets, session lesson plans, and audio-visual aids for grassroots classes.',
    addedBy: 'Rohan Verma (Junior Sec)'
  },
  {
    id: 'res-intern-3',
    targetSpace: 'interns',
    title: 'Reimbursement Claim & Receipt Submission Rules',
    category: 'Finance FAQ',
    url: 'https://docs.google.com/document/d/sample-reimbursement-rules',
    description: 'Instructions on submitting UPI details, allowable travel expenses, and monthly payout deadlines.',
    addedBy: 'Senior Secretary'
  }
]

// Broadcast Notifications
export const INITIAL_BROADCASTS = [
  {
    id: 'bc-1',
    sender: 'Senior Secretary',
    title: 'Urgent: Monthly Report Review Deadline for Junior Secretaries',
    message: 'All 3 Junior Secretaries are requested to complete pending intern reviews by Friday 5 PM so that monthly stipends can be processed without delay.',
    audience: 'junior_secs',
    date: 'Today, 2:30 PM',
    isNew: true
  },
  {
    id: 'bc-2',
    sender: 'Senior Secretary & Management',
    title: 'October Reimbursement Portal is Now Active!',
    message: 'Scholars can now submit their October stipend and conveyance reimbursement claim in the Reimbursement section.',
    audience: 'interns',
    date: 'Yesterday, 10:00 AM',
    isNew: false
  },
  {
    id: 'bc-3',
    sender: 'Dr. Rajiv Menon (Management)',
    title: 'Quarterly Townhall Meeting Link',
    message: 'Join us for our whole-team celebration and quarterly review on Saturday at 11:00 AM IST.',
    audience: 'all',
    date: '3 days ago',
    isNew: false
  }
]
