export const INITIAL_USERS = [
  {
    id: 'user-senior-sec',
    name: 'Senior Secretary',
    title: 'Senior Secretary',
    email: 'senior.sec@dakshana.org',
    phone: '+91 98765 43210',
    role: 'senior_sec',
    password: 'dakshana2026',
    department: 'Central Coordination',
    photo: null,
    bio: 'Highest operational authority: coordinates Batch 1 & Batch 2 allocations, supervises the 3 Junior Secretaries, controls financial reimbursement cycles, and dispatches circulars.'
  },
  {
    id: 'user-mgmt',
    name: 'Dr. Rajiv Menon',
    title: 'Executive Director & Trustee',
    email: 'trustee@dakshana.org',
    role: 'management',
    password: 'dakshana2026',
    department: 'Governing Board',
    photo: null,
    bio: 'Board-level governance, institutional audit oversight, and long-term strategy.'
  },
  {
    id: 'user-mgmt-2',
    name: 'Col. Ram Sharma',
    title: 'Trustee & Senior Advisor',
    email: 'ram.sharma@dakshana.org',
    role: 'management',
    password: 'dakshana2026',
    department: 'Governing Board',
    photo: null,
    bio: 'Institutional governance, nationwide outreach expansion, and operational audit oversight.'
  },
  {
    id: 'user-mgmt-3',
    name: 'Dr. Sunita Deshmukh',
    title: 'Trustee & Academic Director',
    email: 'sunita.deshmukh@dakshana.org',
    role: 'management',
    password: 'dakshana2026',
    department: 'Governing Board',
    photo: null,
    bio: 'Academic excellence, curriculum pedagogical standards, and scholarship policy governance.'
  },
  {
    id: 'user-jsec-1',
    name: 'Priya Sharma',
    title: 'Junior Secretary',
    email: 'priya.jsec@dakshana.org',
    phone: '+91 98765 43211',
    role: 'junior_sec',
    password: 'dakshana2026',
    department: '',
    photo: null,
    bio: 'Supervises, mentors, and reviews monthly progress reports for assigned outreach scholars.'
  },
  {
    id: 'user-jsec-2',
    name: 'Rohan Verma',
    title: 'Junior Secretary',
    email: 'rohan.jsec@dakshana.org',
    phone: '+91 98765 43212',
    role: 'junior_sec',
    password: 'dakshana2026',
    department: '',
    photo: null,
    bio: 'Supervises, mentors, and reviews progress reports for assigned outreach scholars.'
  },
  {
    id: 'user-jsec-3',
    name: 'Sneha Kulkarni',
    title: 'Junior Secretary',
    email: 'sneha.jsec@dakshana.org',
    phone: '+91 98765 43213',
    role: 'junior_sec',
    password: 'dakshana2026',
    department: '',
    photo: null,
    bio: 'Supervises, mentors, and reviews fieldwork documentation for assigned outreach scholars.'
  },
  // Outreach Scholars (Strictly one internship role across Batch 1 & Batch 2 with individual target visits and JEE/NEET stream)
  {
    id: 'user-intern-1',
    name: 'Aarav Gupta',
    title: 'Outreach Scholar',
    email: 'aarav.scholar@dakshana.org',
    role: 'intern',
    batch: 'Batch 1',
    stream: 'JEE',
    password: 'dakshana123',
    targetVisits: 16,
    assignedTo: 'user-jsec-1',
    department: 'Outreach Fieldwork',
    photo: null,
    bio: 'Batch 1 Outreach Scholar (JEE Engineering) • Conducting school visits and foundational student sessions.'
  },
  {
    id: 'user-intern-2',
    name: 'Meera Iyer',
    title: 'Outreach Scholar',
    email: 'meera.scholar@dakshana.org',
    role: 'intern',
    batch: 'Batch 1',
    stream: 'NEET',
    password: 'dakshana123',
    targetVisits: 14,
    assignedTo: 'user-jsec-1',
    department: 'Outreach Fieldwork',
    photo: null,
    bio: 'Batch 1 Outreach Scholar (NEET Medical) • Conducting school visits and community learning drives.'
  },
  {
    id: 'user-intern-3',
    name: 'Kabir Das',
    title: 'Outreach Scholar',
    email: 'kabir.scholar@dakshana.org',
    role: 'intern',
    batch: 'Batch 2',
    stream: 'JEE',
    password: 'dakshana123',
    targetVisits: 18,
    assignedTo: 'user-jsec-2',
    department: 'Outreach Fieldwork',
    photo: null,
    bio: 'Batch 2 Outreach Scholar (JEE Engineering) • Conducting hands-on school visits and student demonstrations.'
  },
  {
    id: 'user-intern-4',
    name: 'Ananya Rao',
    title: 'Outreach Scholar',
    email: 'ananya.scholar@dakshana.org',
    role: 'intern',
    batch: 'Batch 2',
    stream: 'NEET',
    password: 'dakshana123',
    targetVisits: 15,
    assignedTo: 'user-jsec-2',
    department: 'Outreach Fieldwork',
    photo: null,
    bio: 'Batch 2 Outreach Scholar (NEET Medical) • Conducting classroom outreach sessions and student mentoring.'
  },
  {
    id: 'user-intern-5',
    name: 'Vikram Joshi',
    title: 'Outreach Scholar',
    email: 'vikram.scholar@dakshana.org',
    role: 'intern',
    batch: 'Batch 2',
    stream: 'JEE',
    password: 'dakshana123',
    targetVisits: 12,
    assignedTo: 'user-jsec-3',
    department: 'Outreach Fieldwork',
    photo: null,
    bio: 'Batch 2 Outreach Scholar (JEE Engineering) • Conducting field visits and school documentation.'
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
    senderRole: 'senior_sec',
    senderTitle: 'Senior Secretary',
    title: 'Secretariat Notice: Evaluation Deadline for Junior Secretaries',
    message: 'All 3 Junior Secretaries are requested to complete pending reviews for both Batch 1 and Batch 2 by Friday 5 PM so that monthly expense claims can be verified and disbursed.',
    audience: 'junior_secs',
    date: 'Today, 2:30 PM',
    isNew: true
  },
  {
    id: 'bc-2',
    sender: 'Senior Secretary',
    senderRole: 'senior_sec',
    senderTitle: 'Senior Secretary',
    title: 'Batch 1 Scholars: Mid-Tenure Reflection Call',
    message: 'All Batch 1 scholars are invited to the mid-tenure reflection check-in this Saturday at 4:00 PM on Google Meet.',
    audience: 'batch_1',
    date: 'Today, 11:00 AM',
    isNew: true
  },
  {
    id: 'bc-3',
    sender: 'Senior Secretary',
    senderRole: 'senior_sec',
    senderTitle: 'Senior Secretary',
    title: 'Batch 2 Scholars: Classroom Kit Distribution Reminder',
    message: 'Scholars enrolled in Batch 2 can collect their updated teaching kits and math workbooks from their respective wing leads.',
    audience: 'batch_2',
    date: 'Yesterday, 3:15 PM',
    isNew: false
  },
  {
    id: 'bc-4',
    sender: 'Senior Secretary',
    senderRole: 'senior_sec',
    senderTitle: 'Senior Secretary',
    title: 'Reimbursement Portal Window Activated for All Scholars',
    message: 'The reimbursement window for October is now active. Please submit your claims and download the mandatory templates in the Reimbursements tab.',
    audience: 'all_interns',
    date: '2 days ago',
    isNew: false
  }
]

// Community Posts Feed Data with Photos, Notes, and "Mark as Done" Tracking
export const INITIAL_POSTS = [
  {
    id: 'post-1',
    authorId: 'user-intern-3',
    authorName: 'Kabir Das',
    authorPhoto: null,
    batch: 'Batch 2',
    stream: 'JEE',
    wing: 'Wing 2 (Rohan)',
    createdAt: '2 hours ago',
    title: 'Hands-on Robotics & Science Circuits at JNV Pune',
    content: 'Conducted an interactive science session with 28 grade-7 students today! We built simple LED circuit breadboards. The curiosity and excitement in their eyes was truly inspiring.',
    photoUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80',
    schoolName: 'JNV Pune - Rural Science Hub',
    isCompleted: true,
    visitsLogged: 1,
    studentsReached: 28,
    cheersCount: 14,
    comments: [
      { id: 'c1', authorName: 'Rohan Verma', role: 'junior_sec', text: 'Terrific work Kabir! The circuit kits look very well utilized.', time: '1 hour ago' },
      { id: 'c2', authorName: 'Aarav Gupta', role: 'intern', text: 'Incredible setup! Can you share the circuit worksheet?', time: '30 mins ago' }
    ]
  },
  {
    id: 'post-2',
    authorId: 'user-intern-1',
    authorName: 'Aarav Gupta',
    authorPhoto: null,
    batch: 'Batch 1',
    stream: 'JEE',
    wing: 'Wing 1 (Priya)',
    createdAt: 'Yesterday at 4:30 PM',
    title: 'Foundational Math Speed Drills with Grade 5 Scholars',
    content: 'Completed school visit #16 at Zilla Parishad Primary School. Introduced Vedic multiplication techniques and division flashcards. 22 students participated actively.',
    photoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    schoolName: 'ZP Primary School - Cluster 3',
    isCompleted: true,
    visitsLogged: 1,
    studentsReached: 22,
    cheersCount: 18,
    comments: [
      { id: 'c3', authorName: 'Priya Sharma', role: 'junior_sec', text: 'Great progress Aarav. Keep this consistency for Batch 1.', time: 'Yesterday' }
    ]
  },
  {
    id: 'post-3',
    authorId: 'user-intern-2',
    authorName: 'Meera Iyer',
    authorPhoto: null,
    batch: 'Batch 1',
    stream: 'NEET',
    wing: 'Wing 1 (Priya)',
    createdAt: '2 days ago',
    title: 'Health, Hygiene & Nutrition Awareness Drive',
    content: 'Distributed hygiene cards and demonstrated proper hand-washing steps to over 40 primary students. Their teachers were very supportive.',
    photoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    schoolName: 'Govt Model Girls School',
    isCompleted: true,
    visitsLogged: 1,
    studentsReached: 40,
    cheersCount: 11,
    comments: []
  },
  {
    id: 'post-4',
    authorId: 'user-intern-4',
    authorName: 'Ananya Rao',
    authorPhoto: null,
    batch: 'Batch 2',
    stream: 'NEET',
    wing: 'Wing 2 (Rohan)',
    createdAt: '3 days ago',
    title: 'English Literacy & Reading Circles in Cluster 2',
    content: 'Completed visit #14. Held guided reading sessions with 18 beginner learners. The phonics flashcards helped immensely with word pronunciation.',
    photoUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    schoolName: 'Adarsh Vidya Mandir',
    isCompleted: true,
    visitsLogged: 1,
    studentsReached: 18,
    cheersCount: 9,
    comments: []
  }
]

// Common Outreach Queries & Doubts (Accessible by scholars from every batch)
export const INITIAL_QUERIES = [
  {
    id: 'query-1',
    authorId: 'user-intern-1',
    authorName: 'Aarav Gupta',
    authorRole: 'intern',
    batch: 'Batch 1',
    category: 'School Permissions',
    title: 'What should we do if the Headmaster asks for an official authorization letter before entry?',
    content: 'Today at a ZP High School, the headmaster requested a signed physical permission or authorization letter from Dakshana before permitting the outreach classroom visit. What is the standard protocol for this?',
    status: 'resolved',
    createdAt: 'Yesterday',
    upvotes: 16,
    answers: [
      {
        id: 'ans-1',
        authorName: 'Priya Sharma',
        authorRole: 'junior_sec',
        text: 'Carry a printed copy of the official Dakshana Outreach Program Intimation Circular from the Materials Hub. If the school requires a school-specific letter, message your assigned Junior Secretary on WhatsApp with the school name and Principal name, and we will dispatch a digital signed PDF within 30 minutes.',
        isOfficial: true,
        createdAt: 'Yesterday at 3:15 PM'
      },
      {
        id: 'ans-2',
        authorName: 'Senior Secretary',
        authorRole: 'senior_sec',
        text: 'All scholars should always carry their college ID card along with the Dakshana Introduction PDF. This immediately establishes credibility with school administrators.',
        isOfficial: true,
        createdAt: 'Yesterday at 4:00 PM'
      }
    ]
  },
  {
    id: 'query-2',
    authorId: 'user-intern-3',
    authorName: 'Kabir Das',
    authorRole: 'intern',
    batch: 'Batch 2',
    category: 'Expense & Reimbursements',
    title: 'How to claim auto / shared e-rickshaw conveyance when no physical receipt is given?',
    content: 'Most rural autos and e-rickshaws do not provide printed bus tickets or receipts. Can we claim these travel expenses, and what documentation is required?',
    status: 'resolved',
    createdAt: '2 days ago',
    upvotes: 21,
    answers: [
      {
        id: 'ans-3',
        authorName: 'Rohan Verma',
        authorRole: 'junior_sec',
        text: 'Yes! Download the official Cash Voucher PDF from the Materials Hub. Fill in the travel details (from/to, purpose, amount up to ₹250 per voucher). If paid via UPI, attach the UPI transaction screenshot as supporting proof in your bills PDF.',
        isOfficial: true,
        createdAt: '2 days ago'
      }
    ]
  },
  {
    id: 'query-3',
    authorId: 'user-intern-4',
    authorName: 'Ananya Rao',
    authorRole: 'intern',
    batch: 'Batch 2',
    category: 'School Visits & Scheduling',
    title: 'Are we permitted to conduct outreach sessions on Saturdays, or only weekdays?',
    content: 'Some government schools have shorter half-day schedules on Saturdays. Is it permissible to conduct our foundational sessions on Saturday mornings?',
    status: 'resolved',
    createdAt: '3 days ago',
    upvotes: 12,
    answers: [
      {
        id: 'ans-4',
        authorName: 'Sneha Kulkarni',
        authorRole: 'junior_sec',
        text: 'Yes, Saturday morning half-days are fully permitted and count toward your verified school visits, as long as school attendance is normal and the session is completed.',
        isOfficial: true,
        createdAt: '3 days ago'
      }
    ]
  },
  {
    id: 'query-4',
    authorId: 'user-intern-2',
    authorName: 'Meera Iyer',
    authorRole: 'intern',
    batch: 'Batch 1',
    category: 'Classroom & Teaching Materials',
    title: 'Can two outreach scholars visit the same school if student strength is large (>70 students)?',
    content: 'We have a high school with two sections of grade 8. Can two interns visit jointly and split the classrooms?',
    status: 'open',
    createdAt: '5 hours ago',
    upvotes: 8,
    answers: [
      {
        id: 'ans-5',
        authorName: 'Priya Sharma',
        authorRole: 'junior_sec',
        text: 'Yes, joint visits are allowed for larger schools (>60 students). Both interns must independently log their visit in the Activity Feed and detail the separate classroom sections they conducted.',
        isOfficial: true,
        createdAt: '3 hours ago'
      }
    ]
  }
]

// Assigned Tasks with "Done or Not" toggle tracking
// Junior Secretaries receive work from Senior Secretary / Management
// Senior Secretary receives executive directives from Management
export const INITIAL_ASSIGNED_TASKS = [
  // --- Tasks for Junior Secretaries (From Senior Secretary & Management) ---
  {
    id: 'task-jsec-1',
    title: 'Verify October School Visit Logs for assigned Outreach Scholars',
    description: 'Check conducted school visit submissions against session attendance forms before the 20th of this month.',
    assignedToId: 'user-jsec-1',
    assignedToName: 'Priya Sharma',
    assignedToRole: 'junior_sec',
    assignedBy: 'Senior Secretary',
    priority: 'high',
    isCompleted: false,
    completedAt: null,
    createdAt: '2026-10-15'
  },
  {
    id: 'task-jsec-2',
    title: 'Distribute updated 2026–27 teaching kits and math modules',
    description: 'Ensure all assigned Batch 1 scholars have received physical workbooks and flashcards for rural visits.',
    assignedToId: 'user-jsec-1',
    assignedToName: 'Priya Sharma',
    assignedToRole: 'junior_sec',
    assignedBy: 'Senior Secretary',
    priority: 'medium',
    isCompleted: true,
    completedAt: '2026-10-16',
    createdAt: '2026-10-14'
  },
  {
    id: 'task-jsec-3',
    title: 'Conduct mid-semester check-in call with scholars having <8 visits',
    description: 'Reach out to scholars behind on their semester milestone to identify transportation or school permission hurdles.',
    assignedToId: 'user-jsec-2',
    assignedToName: 'Rohan Verma',
    assignedToRole: 'junior_sec',
    assignedBy: 'Senior Secretary',
    priority: 'high',
    isCompleted: false,
    completedAt: null,
    createdAt: '2026-10-15'
  },
  {
    id: 'task-jsec-4',
    title: 'Review travel ticket PDFs before submitting claims to Senior Sec',
    description: 'Audit bus tickets and cash voucher receipts submitted by assigned scholars to ensure seamless approvals.',
    assignedToId: 'user-jsec-2',
    assignedToName: 'Rohan Verma',
    assignedToRole: 'junior_sec',
    assignedBy: 'Senior Secretary',
    priority: 'medium',
    isCompleted: true,
    completedAt: '2026-10-16',
    createdAt: '2026-10-13'
  },
  {
    id: 'task-jsec-5',
    title: 'Coordinate Batch 2 school outreach scheduling for rural talukas',
    description: 'Align high school permission letters for scheduled visits in upcoming cluster sessions.',
    assignedToId: 'user-jsec-3',
    assignedToName: 'Sneha Kulkarni',
    assignedToRole: 'junior_sec',
    assignedBy: 'Senior Secretary',
    priority: 'high',
    isCompleted: false,
    completedAt: null,
    createdAt: '2026-10-15'
  },
  {
    id: 'task-jsec-6',
    title: 'Compile regional grassroots feedback summary for Governing Board',
    description: 'Consolidate classroom feedback and student response notes for presentation to Trustees.',
    assignedToId: 'user-jsec-3',
    assignedToName: 'Sneha Kulkarni',
    assignedToRole: 'junior_sec',
    assignedBy: 'Dr. Rajiv Menon (Management)',
    priority: 'medium',
    isCompleted: false,
    completedAt: null,
    createdAt: '2026-10-14'
  },

  // --- Tasks for Senior Secretary (From Management) ---
  {
    id: 'task-ssec-1',
    title: 'Activate October Reimbursement Window and issue official guidelines',
    description: 'Configure active claim cycle and ensure official Google Form URL and guidelines are accessible to all scholars.',
    assignedToId: 'user-senior-sec',
    assignedToName: 'Senior Secretary',
    assignedToRole: 'senior_sec',
    assignedBy: 'Dr. Rajiv Menon (Management)',
    priority: 'high',
    isCompleted: true,
    completedAt: '2026-10-14',
    createdAt: '2026-10-12'
  },
  {
    id: 'task-ssec-2',
    title: 'Audit Batch 1 vs Batch 2 scholar allocation balance and mentor workload',
    description: 'Review assigned scholar distribution across the 3 Junior Secretaries to ensure balanced oversight.',
    assignedToId: 'user-senior-sec',
    assignedToName: 'Senior Secretary',
    assignedToRole: 'senior_sec',
    assignedBy: 'Col. Ram Sharma (Management)',
    priority: 'high',
    isCompleted: false,
    completedAt: null,
    createdAt: '2026-10-15'
  },
  {
    id: 'task-ssec-3',
    title: 'Review academic curriculum alignment and toolkit downloads',
    description: 'Confirm that all intern teaching modules match 2026–27 pedagogical standards.',
    assignedToId: 'user-senior-sec',
    assignedToName: 'Senior Secretary',
    assignedToRole: 'senior_sec',
    assignedBy: 'Dr. Sunita Deshmukh (Management)',
    priority: 'medium',
    isCompleted: false,
    completedAt: null,
    createdAt: '2026-10-14'
  },
  {
    id: 'task-ssec-4',
    title: 'Conduct monthly operations review meeting with all 3 Junior Secretaries',
    description: 'Review pending reports, delegation privileges, and school visit milestone pacing.',
    assignedToId: 'user-senior-sec',
    assignedToName: 'Senior Secretary',
    assignedToRole: 'senior_sec',
    assignedBy: 'Dr. Rajiv Menon (Management)',
    priority: 'high',
    isCompleted: false,
    completedAt: null,
    createdAt: '2026-10-15'
  }
]

// Improvement & Maintenance Issues Tracker (Exclusively for Senior Secretary)
// Once Senior Secretary rectifies an issue, it leaves the "Pending Issues" view
export const INITIAL_SUGGESTIONS = [
  {
    id: 'sug-1',
    title: 'Downloadable 1-Page Offline School Visit Log Sheet',
    description: 'Schools in deep rural areas often have poor 4G connectivity. Providing a 1-page printable blank attendance sheet in Materials Hub would help interns record attendance on paper and upload later.',
    submittedBy: 'Kabir Das (Outreach Scholar, Batch 2)',
    submittedRole: 'intern',
    category: 'Materials Hub',
    status: 'pending', // 'pending' | 'rectified'
    priority: 'high',
    createdAt: '2026-10-15',
    rectifiedAt: null,
    rectifiedNote: null
  },
  {
    id: 'sug-2',
    title: 'Clarify Reimbursement Voucher limit for Auto Rickshaw sharing',
    description: 'Multiple interns from Pune cluster requested written clarification on whether two scholars taking the same auto can each claim ₹250 or only one claim per trip.',
    submittedBy: 'Priya Sharma (Junior Secretary)',
    submittedRole: 'junior_sec',
    category: 'Reimbursements',
    status: 'pending',
    priority: 'medium',
    createdAt: '2026-10-14',
    rectifiedAt: null,
    rectifiedNote: null
  },
  {
    id: 'sug-3',
    title: 'Add cluster filter in Materials Hub for regional language kits',
    description: 'Interns conducting sessions in rural Marathi-medium schools requested quick filtering for regional language PDFs.',
    submittedBy: 'Ananya Rao (Outreach Scholar, Batch 2)',
    submittedRole: 'intern',
    category: 'Curriculum',
    status: 'pending',
    priority: 'low',
    createdAt: '2026-10-13',
    rectifiedAt: null,
    rectifiedNote: null
  },
  {
    id: 'sug-4',
    title: 'Direct WhatsApp intimation template for urgent schedule adjustments',
    description: 'Junior secretaries need a standardized notice format when schools shift timing unexpectedly.',
    submittedBy: 'Rohan Verma (Junior Secretary)',
    submittedRole: 'junior_sec',
    category: 'Operations',
    status: 'rectified',
    priority: 'medium',
    createdAt: '2026-10-12',
    rectifiedAt: '2026-10-14',
    rectifiedNote: 'Added direct WhatsApp group links in circular attachments.'
  }
]


