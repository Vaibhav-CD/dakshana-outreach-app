export const INITIAL_USERS = [
  {
    id: 'user-senior-sec',
    name: 'Senior Secretary',
    title: 'Senior Secretary & Central Operations Lead',
    email: 'senior.sec@dakshana.org',
    role: 'senior_sec',
    department: 'Central Coordination',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Highest operational authority: coordinates Batch 1 & Batch 2 allocations, supervises the 3 Junior Secretaries, controls financial reimbursement cycles, and dispatches circulars.'
  },
  {
    id: 'user-mgmt',
    name: 'Dr. Rajiv Menon',
    title: 'Executive Director & Trustee',
    email: 'trustee@dakshana.org',
    role: 'management',
    department: 'Governing Board',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'Board-level governance, institutional audit oversight, and long-term strategy.'
  },
  {
    id: 'user-jsec-1',
    name: 'Priya Sharma',
    title: 'Junior Secretary - Wing 1',
    email: 'priya.jsec@dakshana.org',
    role: 'junior_sec',
    department: 'Community Outreach & Fieldwork',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'Limited supervisory scope: mentors and reviews monthly reports strictly for her assigned wing scholars.'
  },
  {
    id: 'user-jsec-2',
    name: 'Rohan Verma',
    title: 'Junior Secretary - Wing 2',
    email: 'rohan.jsec@dakshana.org',
    role: 'junior_sec',
    department: 'Education & Curriculum Support',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bio: 'Limited supervisory scope: reviews STEM & educational progress reports strictly for his assigned wing scholars.'
  },
  {
    id: 'user-jsec-3',
    name: 'Sneha Kulkarni',
    title: 'Junior Secretary - Wing 3',
    email: 'sneha.jsec@dakshana.org',
    role: 'junior_sec',
    department: 'Digital Media & Communications',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    bio: 'Limited supervisory scope: evaluates storytelling, media outputs, and digital documentation for her assigned scholars.'
  },
  // Sample Scholars with Batch 1 and Batch 2 assignments
  {
    id: 'user-intern-1',
    name: 'Aarav Gupta',
    title: 'Outreach Scholar',
    email: 'aarav.scholar@dakshana.org',
    role: 'intern',
    batch: 'Batch 1',
    assignedTo: 'user-jsec-1',
    department: 'Community Outreach',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    bio: 'Batch 1 Scholar • Conducting weekend foundational numeracy sessions.'
  },
  {
    id: 'user-intern-2',
    name: 'Meera Iyer',
    title: 'Outreach Scholar',
    email: 'meera.scholar@dakshana.org',
    role: 'intern',
    batch: 'Batch 1',
    assignedTo: 'user-jsec-1',
    department: 'Community Outreach',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    bio: 'Batch 1 Scholar • Focus on rural health survey implementation.'
  },
  {
    id: 'user-intern-3',
    name: 'Kabir Das',
    title: 'Outreach Scholar',
    email: 'kabir.scholar@dakshana.org',
    role: 'intern',
    batch: 'Batch 2',
    assignedTo: 'user-jsec-2',
    department: 'Education',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    bio: 'Batch 2 Scholar • Conducting robotics & science lab modules.'
  },
  {
    id: 'user-intern-4',
    name: 'Ananya Rao',
    title: 'Outreach Scholar',
    email: 'ananya.scholar@dakshana.org',
    role: 'intern',
    batch: 'Batch 2',
    assignedTo: 'user-jsec-2',
    department: 'Education',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    bio: 'Batch 2 Scholar • Teaching foundational reading circles.'
  },
  {
    id: 'user-intern-5',
    name: 'Vikram Joshi',
    title: 'Outreach Scholar',
    email: 'vikram.scholar@dakshana.org',
    role: 'intern',
    batch: 'Batch 2',
    assignedTo: 'user-jsec-3',
    department: 'Digital Media',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    bio: 'Batch 2 Scholar • Documentation & field impact filmmaking.'
  }
]

export const INITIAL_REPORTS = [
  {
    id: 'rep-1',
    internId: 'user-intern-1',
    internName: 'Aarav Gupta',
    batch: 'Batch 1',
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
    batch: 'Batch 1',
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
    batch: 'Batch 2',
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
    batch: 'Batch 2',
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

// Visual Session Tracking Data with Batch breakdown
export const INITIAL_SESSIONS = [
  { internId: 'user-intern-1', internName: 'Aarav Gupta', batch: 'Batch 1', sessionsCount: 16, studentsReached: 48, wing: 'Wing 1 (Priya)', topic: 'Foundational Numeracy' },
  { internId: 'user-intern-2', internName: 'Meera Iyer', batch: 'Batch 1', sessionsCount: 12, studentsReached: 65, wing: 'Wing 1 (Priya)', topic: 'Health & Hygiene' },
  { internId: 'user-intern-3', internName: 'Kabir Das', batch: 'Batch 2', sessionsCount: 18, studentsReached: 54, wing: 'Wing 2 (Rohan)', topic: 'Robotics & Science' },
  { internId: 'user-intern-4', internName: 'Ananya Rao', batch: 'Batch 2', sessionsCount: 14, studentsReached: 38, wing: 'Wing 2 (Rohan)', topic: 'Literacy & Phonics' },
  { internId: 'user-intern-5', internName: 'Vikram Joshi', batch: 'Batch 2', sessionsCount: 8, studentsReached: 120, wing: 'Wing 3 (Sneha)', topic: 'Media Storytelling' },
]

// Reimbursement Cycle Data
export const INITIAL_REIMBURSEMENT_CYCLE = {
  monthYear: 'July - August 2026',
  isActive: true,
  activatedBy: 'Senior Secretary',
  deadline: '5th August (Expenses up to 31st July)',
  formUrl: 'https://bit.ly/Reimbursement_OutreachInternship',
  announcementTitle: '📢 Outreach Internship Reimbursement Announcement',
  messageText: `📢 *Dear Interns* ,

Thank you for your valuable contribution in visiting schools and conducting outreach sessions for the Dakshana Foundation. Your efforts are helping deserving students learn about the Dakshana Scholarship Program.

To claim your reimbursement, please fill out the Outreach Internship Reimbursement Form 2026–27.

🔗 Reimbursement Form:
https://bit.ly/Reimbursement_OutreachInternship

📌 Important Instructions

1. Submit this form *only once per month* , after completing all your school visits for that month.

2. Include all approved school visit expenses incurred during the month in a single submission.

3. Download the Expense Report Excel sheet, fill in all visit and expense details accurately, and upload the completed Excel sheet in the form.

4. In the Expense Report Excel sheet, select the correct Expense Type for each expense:

* Billed – Expenses for which you have a bill/invoice.
* Unbilled – Expenses paid through UPI or other digital payments where no bill is available.
* Cash Voucher – Expenses paid in cash where no bill is available.

5. Combine all your bills into a single PDF, including:

* Travel bills (Bus/Train/Taxi/Other)
* Cash Voucher(s), if applicable

6. For Cash Voucher expenses:

* Download the Cash Voucher PDF provided.
* Take a printout, fill it and either take a clear photo/scan or fill it digitally.
* Include all completed Cash Vouchers in the same bills PDF.
* Each Cash Voucher can be claimed for a maximum of ₹ 250. If your cash expense exceeds ₹ 250, use multiple Cash Vouchers and include all of them in the bills PDF.

7. Enter your Internship Batch, Panel Number, and bank account details carefully. Reimbursement will be processed based on the details provided in the form.

⏰ Deadline: Please submit the reimbursement form on or before *5th August* including *expenses up to 31st July*, so that we can verify your submissions and process your reimbursements at the earliest.

If you have any questions or face any issues while filling out the form, please contact us.

Thank you once again for your dedication and support! 🌟`,
  expensePolicy: 'Single monthly submission for all verified school visits'
}

export const INITIAL_REIMBURSEMENT_CLAIMS = [
  {
    id: 'clm-1',
    internId: 'user-intern-1',
    internName: 'Aarav Gupta',
    batch: 'Batch 1',
    monthYear: 'October 2026',
    amount: 3250,
    upiOrBank: 'aarav@okaxis',
    purpose: 'Outreach travel expense claim & school visit bus passes (₹3,250)',
    status: 'approved',
    approvedBy: 'Senior Secretary',
    paidAt: null
  },
  {
    id: 'clm-2',
    internId: 'user-intern-2',
    internName: 'Meera Iyer',
    batch: 'Batch 1',
    monthYear: 'October 2026',
    amount: 3000,
    upiOrBank: 'meera.iyer@okhdfcbank',
    purpose: 'School outreach travel tickets & verified cash vouchers',
    status: 'pending',
    approvedBy: null,
    paidAt: null
  },
  {
    id: 'clm-3',
    internId: 'user-intern-3',
    internName: 'Kabir Das',
    batch: 'Batch 2',
    monthYear: 'October 2026',
    amount: 3400,
    upiOrBank: 'kabir.das@sbi',
    purpose: 'Outreach travel & science kit materials photocopy (₹3,400)',
    status: 'approved',
    approvedBy: 'Senior Secretary',
    paidAt: '2026-10-12'
  }
]

// Materials Hub - Strictly only the two official Dakshana links provided
export const INITIAL_RESOURCES = [
  {
    id: 'res-outreach-session-form',
    title: 'Dakshana outreach session form',
    category: 'Mandatory Form',
    url: 'https://tinyurl.com/Outreach-session-form',
    description: 'Official session logging form to record all school visits, student attendance, and outreach classroom topics.',
    isPinned: true
  },
  {
    id: 'res-intern-toolkit',
    title: 'Dakshana intern toolkit',
    category: 'Official Toolkit',
    url: 'https://tinyurl.com/interntoolkit26-27',
    description: 'Comprehensive 2026–27 teaching resources, presentation decks, curriculum modules, and intern guidelines.',
    isPinned: true
  }
]

// Broadcast Notifications with Batch Targeting
export const INITIAL_BROADCASTS = [
  {
    id: 'bc-1',
    sender: 'Senior Secretary',
    title: 'Secretariat Notice: Evaluation Deadline for Junior Secretaries',
    message: 'All 3 Junior Secretaries are requested to complete pending reviews for both Batch 1 and Batch 2 by Friday 5 PM so that monthly expense claims can be verified and disbursed.',
    audience: 'junior_secs',
    date: 'Today, 2:30 PM',
    isNew: true
  },
  {
    id: 'bc-2',
    sender: 'Senior Secretary',
    title: 'Batch 1 Scholars: Mid-Tenure Reflection Call',
    message: 'All Batch 1 scholars are invited to the mid-tenure reflection check-in this Saturday at 4:00 PM on Google Meet.',
    audience: 'batch_1',
    date: 'Today, 11:00 AM',
    isNew: true
  },
  {
    id: 'bc-3',
    sender: 'Senior Secretary',
    title: 'Batch 2 Scholars: Classroom Kit Distribution Reminder',
    message: 'Scholars enrolled in Batch 2 can collect their updated teaching kits and math workbooks from their respective wing leads.',
    audience: 'batch_2',
    date: 'Yesterday, 3:15 PM',
    isNew: false
  },
  {
    id: 'bc-4',
    sender: 'Senior Secretary',
    title: 'Reimbursement Portal Window Activated for All Scholars',
    message: 'The reimbursement window for October is now active. Please submit your claims and download the mandatory templates in the Reimbursements tab.',
    audience: 'all_interns',
    date: '2 days ago',
    isNew: false
  }
]
