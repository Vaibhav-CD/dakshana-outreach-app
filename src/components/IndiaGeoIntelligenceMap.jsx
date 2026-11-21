import React, { useState, useMemo } from 'react'
import IndiaSVGMap from '@svg-maps/india'
import {
  MapPin,
  Compass,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Users,
  School,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Download,
  Share2,
  Layers,
  Snowflake,
  ShieldAlert,
  ArrowUpRight,
  X,
  Copy,
  Check,
  Building,
  Calendar,
  BookOpen,
  Info
} from 'lucide-react'
import Avatar from './Avatar'
import StreamBadge from './StreamBadge'

// Calculated geographic centroids for all 36 Indian states & union territories (Canvas: 612 x 696)
const STATE_CENTERS = {
  an: { x: 521, y: 609, code: 'AN', name: 'Andaman & Nicobar' },
  ap: { x: 263, y: 500, code: 'AP', name: 'Andhra Pradesh' },
  ar: { x: 550, y: 224, code: 'AR', name: 'Arunachal Pradesh' },
  as: { x: 516, y: 271, code: 'AS', name: 'Assam' },
  br: { x: 369, y: 275, code: 'BR', name: 'Bihar' },
  ch: { x: 179, y: 160, code: 'CH', name: 'Chandigarh' },
  ct: { x: 296, y: 388, code: 'CG', name: 'Chhattisgarh' },
  dn: { x: 102, y: 405, code: 'DN', name: 'Dadra & Nagar Haveli' },
  dd: { x: 54, y: 391, code: 'DD', name: 'Daman & Diu' },
  dl: { x: 186, y: 210, code: 'DL', name: 'Delhi NCR' },
  ga: { x: 122, y: 512, code: 'GA', name: 'Goa' },
  gj: { x: 66, y: 355, code: 'GJ', name: 'Gujarat' },
  hr: { x: 164, y: 195, code: 'HR', name: 'Haryana' },
  hp: { x: 191, y: 133, code: 'HP', name: 'Himachal Pradesh' },
  jk: { x: 173, y: 61, code: 'JK', name: 'Jammu & Kashmir / Ladakh' },
  jh: { x: 366, y: 327, code: 'JH', name: 'Jharkhand' },
  ka: { x: 171, y: 519, code: 'KA', name: 'Karnataka' },
  kl: { x: 166, y: 615, code: 'KL', name: 'Kerala' },
  ld: { x: 99, y: 627, code: 'LD', name: 'Lakshadweep' },
  mp: { x: 214, y: 319, code: 'MP', name: 'Madhya Pradesh' },
  mh: { x: 180, y: 435, code: 'MH', name: 'Maharashtra' },
  mn: { x: 537, y: 301, code: 'MN', name: 'Manipur' },
  ml: { x: 484, y: 283, code: 'ML', name: 'Meghalaya' },
  mz: { x: 516, y: 337, code: 'MZ', name: 'Mizoram' },
  nl: { x: 546, y: 270, code: 'NL', name: 'Nagaland' },
  or: { x: 340, y: 405, code: 'OD', name: 'Odisha' },
  py: { x: 268, y: 546, code: 'PY', name: 'Puducherry' },
  pb: { x: 151, y: 152, code: 'PB', name: 'Punjab' },
  rj: { x: 119, y: 257, code: 'RJ', name: 'Rajasthan' },
  sk: { x: 425, y: 235, code: 'SK', name: 'Sikkim' },
  tn: { x: 211, y: 609, code: 'TN', name: 'Tamil Nadu' },
  tg: { x: 237, y: 457, code: 'TG', name: 'Telangana' },
  tr: { x: 493, y: 325, code: 'TR', name: 'Tripura' },
  up: { x: 265, y: 245, code: 'UP', name: 'Uttar Pradesh' },
  ut: { x: 232, y: 175, code: 'UK', name: 'Uttarakhand' },
  wb: { x: 412, y: 310, code: 'WB', name: 'West Bengal' }
}

// Baseline Pan-India Regional Telemetry Matrix across 36 territories
const INITIAL_OUTREACH_STATES = [
  {
    id: 'mh',
    code: 'MH',
    name: 'Maharashtra',
    zone: 'West',
    conductedSessions: 16,
    studentsReached: 520,
    status: 'hotspot',
    assignedPanel: 'Panel 1 (Aditi)',
    topTopic: 'Physics Mechanics & Foundational Math',
    activeScholars: ['Aryan Sharma', 'Rohan Verma', 'Pooja Patil'],
    schoolsVisited: [
      { name: 'Zilla Parishad High School, Saswad', cluster: 'Saswad', sessions: 8, students: 260, topic: 'Newton Laws & Algebra' },
      { name: 'JNV Shirur, Rural Pune', cluster: 'Shirur', sessions: 4, students: 140, topic: 'Optics & Trig Foundations' },
      { name: 'Gramodyog Vidya Mandir, Wardha', cluster: 'Wardha', sessions: 4, students: 120, topic: 'Electricity & STEM Labs' }
    ],
    challenges: 'High demand in remote talukas; requires more scholarship sample kits.',
    opportunity: 'Direct gateway for Pune and Vidarbha rural high schools.'
  },
  {
    id: 'ka',
    code: 'KA',
    name: 'Karnataka',
    zone: 'South',
    conductedSessions: 16,
    studentsReached: 520,
    status: 'hotspot',
    assignedPanel: 'Panel 1 (Aditi)',
    topTopic: 'Calculus, Vectors & STEM Robotics',
    activeScholars: ['Ananya Rao', 'Kartik Nair'],
    schoolsVisited: [
      { name: 'Govt PU College, Doddaballapur', cluster: 'Doddaballapur', sessions: 10, students: 320, topic: 'Limits, Derivatives & Physics' },
      { name: 'Jawahar Navodaya Vidyalaya, Bangalore Rural', cluster: 'Hoskote', sessions: 6, students: 200, topic: 'JEE/NEET Exam Strategy & Chemistry' }
    ],
    challenges: 'Kannada bilingual translation materials requested by teachers.',
    opportunity: 'Doddaballapur model can be replicated across Tumkur and Kolar rural belts.'
  },
  {
    id: 'mp',
    code: 'MP',
    name: 'Madhya Pradesh',
    zone: 'Central',
    conductedSessions: 8,
    studentsReached: 250,
    status: 'moderate',
    assignedPanel: 'Panel 3 (Sakshi)',
    topTopic: 'Organic Chemistry & Math Tricks',
    activeScholars: ['Deepak Patel', 'Sneha Patel'],
    schoolsVisited: [
      { name: 'Govt Excellence HSS, Sehore', cluster: 'Sehore', sessions: 4, students: 130, topic: 'Chemical Bonding & Reaction Mechanisms' },
      { name: 'Model High School, Mandideep', cluster: 'Bhopal Rural', sessions: 4, students: 120, topic: 'Coordinate Geometry & Career Counseling' }
    ],
    challenges: 'Transportation connectivity in interior Raisen and Vidisha blocks.',
    opportunity: 'High government school attendance; excellent student receptivity.'
  },
  {
    id: 'rj',
    code: 'RJ',
    name: 'Rajasthan',
    zone: 'North',
    conductedSessions: 6,
    studentsReached: 190,
    status: 'moderate',
    assignedPanel: 'Panel 3 (Sakshi)',
    topTopic: 'JEE/NEET Mindset & Problem Solving',
    activeScholars: ['Sneha Patel'],
    schoolsVisited: [
      { name: 'Govt Senior Secondary School, Ladpura', cluster: 'Kota Rural', sessions: 4, students: 130, topic: 'IIT JEE Foundation Roadmaps' },
      { name: 'Adarsh Vidya Mandir, Bundi', cluster: 'Bundi', sessions: 2, students: 60, topic: 'Mental Math & Speed Calculation' }
    ],
    challenges: 'High student migration to Kota coaching hubs; need to reach village students early.',
    opportunity: 'Kota proximity enables Dakshana alumni guest talks.'
  },
  {
    id: 'up',
    code: 'UP',
    name: 'Uttar Pradesh',
    zone: 'North',
    conductedSessions: 6,
    studentsReached: 190,
    status: 'moderate',
    assignedPanel: 'Panel 2 (Nitish)',
    topTopic: 'Numeracy & Basic Science',
    activeScholars: ['Kabir Das'],
    schoolsVisited: [
      { name: 'Govt Inter College, Varanasi Rural', cluster: 'Kashi', sessions: 3, students: 95, topic: 'Mathematical Foundations' },
      { name: 'JNV Ghazipur', cluster: 'Zamania', sessions: 3, students: 95, topic: 'Science Experiments & Doubt Clearing' }
    ],
    challenges: 'Large classroom batch sizes (>60 students) requiring joint intern visits.',
    opportunity: 'High population density can double student outreach within existing travel budget.'
  },
  {
    id: 'kl',
    code: 'KL',
    name: 'Kerala',
    zone: 'South',
    conductedSessions: 5,
    studentsReached: 155,
    status: 'moderate',
    assignedPanel: 'Panel 1 (Aditi)',
    topTopic: 'NEET Medical Counseling & Biology Concepts',
    activeScholars: ['Meera Iyer'],
    schoolsVisited: [
      { name: 'Govt Model High School, Kozhikode', cluster: 'Kunnamangalam', sessions: 3, students: 95, topic: 'Biology Diagrams & Concept Mapping' },
      { name: 'Tribal Welfare High School, Wayanad', cluster: 'Mananthavady', sessions: 2, students: 60, topic: 'NEET Medical Exam Roadmap' }
    ],
    challenges: 'Hilly terrain during monsoon season.',
    opportunity: 'High student baseline knowledge; ideal for advanced curriculum.'
  },
  {
    id: 'tg',
    code: 'TG',
    name: 'Telangana',
    zone: 'South',
    conductedSessions: 5,
    studentsReached: 160,
    status: 'moderate',
    assignedPanel: 'Panel 2 (Nitish)',
    topTopic: 'Mathematics & STEM Experiments',
    activeScholars: ['Ananya Rao'],
    schoolsVisited: [
      { name: 'Telangana Model School, Warangal Rural', cluster: 'Narsampet', sessions: 3, students: 95, topic: 'Basic Geometry & Equations' },
      { name: 'Govt Tribal High School, Mahabubabad', cluster: 'Kuravi', sessions: 2, students: 65, topic: 'Science Wonder Lab' }
    ],
    challenges: 'Language barrier in interior villages.',
    opportunity: 'Telangana Model School network provides structured infrastructure.'
  },
  {
    id: 'gj',
    code: 'GJ',
    name: 'Gujarat',
    zone: 'West',
    conductedSessions: 2,
    studentsReached: 75,
    status: 'coldspot',
    assignedPanel: 'Panel 1 (Aditi)',
    topTopic: 'Introductory School Outreach',
    activeScholars: ['Pallavi T'],
    schoolsVisited: [
      { name: 'Govt High School, Surat Rural', cluster: 'Mandvi', sessions: 2, students: 75, topic: 'Scholarship Intro & Numeracy' }
    ],
    challenges: 'CRITICAL COLD SPOT: Only 1 scholar assigned; need school permissions.',
    opportunity: 'Industrial belts have underserved tribal pockets in eastern districts.'
  },
  {
    id: 'br',
    code: 'BR',
    name: 'Bihar',
    zone: 'East',
    conductedSessions: 2,
    studentsReached: 60,
    status: 'coldspot',
    assignedPanel: 'Panel 2 (Nitish)',
    topTopic: 'Math Workshop',
    activeScholars: ['Kabir Das'],
    schoolsVisited: [
      { name: 'Govt High School, Gaya Rural', cluster: 'Bodh Gaya', sessions: 2, students: 60, topic: 'Basic Arithmetic' }
    ],
    challenges: 'CRITICAL COLD SPOT: Huge student potential, but only 2 sessions completed.',
    opportunity: 'Priority state for Batch 2 scholar reallocation.'
  },
  {
    id: 'pb',
    code: 'PB',
    name: 'Punjab',
    zone: 'North',
    conductedSessions: 2,
    studentsReached: 55,
    status: 'coldspot',
    assignedPanel: 'Panel 3 (Sakshi)',
    topTopic: 'Science Motivation',
    activeScholars: ['Vikram Joshi'],
    schoolsVisited: [
      { name: 'Govt Senior Secondary School, Ludhiana Rural', cluster: 'Samrala', sessions: 2, students: 55, topic: 'Career in STEM' }
    ],
    challenges: 'COLD SPOT: Infrequent school visits; limited field presence.',
    opportunity: 'Can partner with local Navodaya Vidyalayas.'
  },
  {
    id: 'or',
    code: 'OD',
    name: 'Odisha',
    zone: 'East',
    conductedSessions: 1,
    studentsReached: 35,
    status: 'coldspot',
    assignedPanel: 'Panel 3 (Sakshi)',
    topTopic: 'Foundation Session',
    activeScholars: ['Vikram Joshi'],
    schoolsVisited: [
      { name: 'Govt High School, Sambalpur', cluster: 'Rairakhol', sessions: 1, students: 35, topic: 'General Science Overview' }
    ],
    challenges: 'COLD SPOT: Isolated single visit; needs structured 5-school cluster.',
    opportunity: 'Tribal districts need high-intensity Dakshana presence.'
  },
  {
    id: 'wb',
    code: 'WB',
    name: 'West Bengal',
    zone: 'East',
    conductedSessions: 1,
    studentsReached: 30,
    status: 'coldspot',
    assignedPanel: 'Panel 3 (Sakshi)',
    topTopic: 'Awareness Session',
    activeScholars: ['Vikram Joshi'],
    schoolsVisited: [
      { name: 'Govt Sponsored High School, Purulia', cluster: 'Manbazar', sessions: 1, students: 30, topic: 'Dakshana Program Intimation' }
    ],
    challenges: 'COLD SPOT: Very low outreach density.',
    opportunity: 'Purulia & Bankura rural belts are rich in academic talent.'
  },
  {
    id: 'jh',
    code: 'JH',
    name: 'Jharkhand',
    zone: 'East',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Zero verified sessions. High tribal concentration.',
    opportunity: 'Mobilize 2 Batch 2 scholars for Ranchi and Bokaro rural clusters.'
  },
  {
    id: 'ct',
    code: 'CG',
    name: 'Chhattisgarh',
    zone: 'Central',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Bastar and Surguja interior belts unserviced.',
    opportunity: 'Partner with Eklavya Model Residential Schools (EMRS).'
  },
  {
    id: 'ap',
    code: 'AP',
    name: 'Andhra Pradesh',
    zone: 'South',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Zero verified visits.',
    opportunity: 'Direct scholar deployment from Bangalore / Doddaballapur hub into Rayalaseema.'
  },
  {
    id: 'tn',
    code: 'TN',
    name: 'Tamil Nadu',
    zone: 'South',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Nilgiris and Dharmapuri rural regions need visits.',
    opportunity: 'Tamil Nadu Model Schools have high student retention.'
  },
  {
    id: 'ut',
    code: 'UK',
    name: 'Uttarakhand',
    zone: 'North',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Tehri and Pauri Garhwal unserviced.',
    opportunity: 'High student dedication; high return on outreach investment.'
  },
  {
    id: 'hr',
    code: 'HR',
    name: 'Haryana',
    zone: 'North',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Mewat rural block has low literacy indicators.',
    opportunity: 'Deploy scholars to Mewat rural high schools.'
  },
  {
    id: 'dl',
    code: 'DL',
    name: 'Delhi NCR',
    zone: 'North',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Peripheral NCR villages require permission letters.',
    opportunity: 'Hub for alumni interactions and university mentors.'
  },
  {
    id: 'hp',
    code: 'HP',
    name: 'Himachal Pradesh',
    zone: 'North',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Mountain passes and dispersed populations.',
    opportunity: 'Connect with Kangra and Mandi government schools.'
  },
  {
    id: 'jk',
    code: 'JK',
    name: 'Jammu & Kashmir / Ladakh',
    zone: 'North',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Border districts and harsh winters.',
    opportunity: 'Coordinate online hybrid sessions or spring drives.'
  },
  {
    id: 'ga',
    code: 'GA',
    name: 'Goa',
    zone: 'West',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Zero visits recorded.',
    opportunity: 'Can be clubbed with Konkan Maharashtra visits.'
  },
  {
    id: 'as',
    code: 'AS',
    name: 'Assam',
    zone: 'North-East',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Critical national priority; 0 verified visits recorded.',
    opportunity: 'Special leadership drive for Barak & Brahmaputra valley clusters.'
  },
  {
    id: 'ar',
    code: 'AR',
    name: 'Arunachal Pradesh',
    zone: 'North-East',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Remote Himalayan frontier schools.',
    opportunity: 'Key strategic outreach potential with VKV schools.'
  },
  {
    id: 'ml',
    code: 'ML',
    name: 'Meghalaya',
    zone: 'North-East',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Khasi & Garo hills outreach pending.',
    opportunity: 'Partner with local educational councils.'
  },
  {
    id: 'mn',
    code: 'MN',
    name: 'Manipur',
    zone: 'North-East',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Intermittent ground challenges.',
    opportunity: 'Hybrid online support for talent discovery.'
  },
  {
    id: 'mz',
    code: 'MZ',
    name: 'Mizoram',
    zone: 'North-East',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: High literacy but no Dakshana touchpoint.',
    opportunity: 'Exceptional math baseline; ideal candidate for talent tests.'
  },
  {
    id: 'nl',
    code: 'NL',
    name: 'Nagaland',
    zone: 'North-East',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Zero verified visits.',
    opportunity: 'Collaborate with Kohima and Dimapur high schools.'
  },
  {
    id: 'tr',
    code: 'TR',
    name: 'Tripura',
    zone: 'North-East',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Tribal pockets unreached.',
    opportunity: 'High concentration of government high schools.'
  },
  {
    id: 'sk',
    code: 'SK',
    name: 'Sikkim',
    zone: 'East',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: High altitude school access.',
    opportunity: 'Compact state territory allows comprehensive coverage.'
  },
  {
    id: 'an',
    code: 'AN',
    name: 'Andaman & Nicobar',
    zone: 'South',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Island logistics.',
    opportunity: 'Digital mentorship and remote outreach.'
  },
  {
    id: 'ld',
    code: 'LD',
    name: 'Lakshadweep',
    zone: 'South',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Island access permit requirements.',
    opportunity: 'Digital scholarship information drive.'
  },
  {
    id: 'ch',
    code: 'CH',
    name: 'Chandigarh',
    zone: 'North',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'Urban center; can serve as regional coordination hub.',
    opportunity: 'Mentor meetups and orientation drives.'
  },
  {
    id: 'py',
    code: 'PY',
    name: 'Puducherry',
    zone: 'South',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Zero verified sessions.',
    opportunity: 'High school network connectivity.'
  },
  {
    id: 'dn',
    code: 'DN',
    name: 'Dadra & Nagar Haveli',
    zone: 'West',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Tribal pockets along Gujarat-Maharashtra border.',
    opportunity: 'Close proximity to Vapi and Valsad clusters.'
  },
  {
    id: 'dd',
    code: 'DD',
    name: 'Daman & Diu',
    zone: 'West',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'Coastal union territory; zero visits recorded.',
    opportunity: 'Club with Saurashtra and South Gujarat drives.'
  }
]

export default function IndiaGeoIntelligenceMap({
  currentUser,
  allUsers = [],
  sessions = [],
  reports = [],
  posts = [],
  onSelectIntern
}) {
  const [selectedStateId, setSelectedStateId] = useState('ka') // Matches user's screenshot
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'hotspot' | 'moderate' | 'coldspot' | 'unreached'
  const [panelFilter, setPanelFilter] = useState('all') // 'all' | 'Panel 1' | 'Panel 2' | 'Panel 3'
  const [zoneFilter, setZoneFilter] = useState('all') // 'all' | 'North' | 'South' | 'West' | 'East' | 'Central' | 'North-East'
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('map') // 'map' | 'directory' | 'coldspots'
  const [hoveredStateId, setHoveredStateId] = useState(null)
  const [copiedNotice, setCopiedNotice] = useState(false)

  // Security & Authorization Guard: Strictly for Junior Secretary, Senior Secretary, and Management
  const isAuthorized = currentUser && (
    currentUser.role === 'junior_sec' ||
    currentUser.role === 'senior_sec' ||
    currentUser.role === 'management'
  )

  // Merge live session & post data dynamically into state metrics
  const statesData = useMemo(() => {
    return INITIAL_OUTREACH_STATES.map(st => {
      // Check if any live post mentioned this state
      const matchingPosts = posts.filter(p => {
        const text = `${p.schoolName || ''} ${p.content || ''} ${p.title || ''}`.toLowerCase()
        return text.includes(st.name.toLowerCase()) || text.includes(st.code.toLowerCase())
      })
      const extraSessions = matchingPosts.length
      const extraStudents = matchingPosts.reduce((acc, p) => acc + (p.studentsReached || 0), 0)

      const totalConducted = st.conductedSessions + extraSessions
      const totalBeneficiaries = st.studentsReached + extraStudents

      let calculatedStatus = st.status
      if (totalConducted >= 10) calculatedStatus = 'hotspot'
      else if (totalConducted >= 4) calculatedStatus = 'moderate'
      else if (totalConducted > 0) calculatedStatus = 'coldspot'
      else calculatedStatus = 'unreached'

      return {
        ...st,
        conductedSessions: totalConducted,
        studentsReached: totalBeneficiaries,
        status: calculatedStatus
      }
    })
  }, [posts])

  // Lookup map by ID (both lowercase 'mh' and uppercase 'MH')
  const statesLookup = useMemo(() => {
    const map = {}
    statesData.forEach(st => {
      map[st.id.toLowerCase()] = st
      map[st.code.toUpperCase()] = st
    })
    return map
  }, [statesData])

  // Total macro metrics
  const totalConductedSessions = useMemo(() => statesData.reduce((acc, curr) => acc + curr.conductedSessions, 0), [statesData])
  const totalStudentsReached = useMemo(() => statesData.reduce((acc, curr) => acc + curr.studentsReached, 0), [statesData])
  const reachedStatesCount = useMemo(() => statesData.filter(st => st.conductedSessions > 0).length, [statesData])
  const hotspotsCount = useMemo(() => statesData.filter(st => st.status === 'hotspot').length, [statesData])
  const moderateCount = useMemo(() => statesData.filter(st => st.status === 'moderate').length, [statesData])
  const coldspotsCount = useMemo(() => statesData.filter(st => st.status === 'coldspot').length, [statesData])
  const unreachedCount = useMemo(() => statesData.filter(st => st.status === 'unreached').length, [statesData])

  // Active selected state details
  const selectedState = useMemo(() => {
    return statesLookup[selectedStateId?.toLowerCase()] || statesData[0]
  }, [statesLookup, selectedStateId, statesData])

  // Active hovered or selected state for the bottom-left floating info pill
  const activePillState = useMemo(() => {
    if (hoveredStateId && statesLookup[hoveredStateId.toLowerCase()]) {
      return statesLookup[hoveredStateId.toLowerCase()]
    }
    return selectedState
  }, [hoveredStateId, statesLookup, selectedState])

  // Clean Reach Color Mapping exactly as requested by user
  const getReachColor = (stateId) => {
    const st = statesLookup[stateId?.toLowerCase()]
    const status = st?.status || 'unreached'

    switch (status) {
      case 'hotspot':
        return {
          fill: '#0A643B', // Vibrant Dakshana Forest Green
          stroke: '#064E2A',
          hoverFill: '#074D2D',
          textColor: '#FFFFFF',
          badgeBg: 'bg-[#0A643B] text-white',
          label: 'Hotspot'
        }
      case 'moderate':
        return {
          fill: '#F59E0B', // Rich Warm Amber / Orange (Active)
          stroke: '#D97706',
          hoverFill: '#D97706',
          textColor: '#FFFFFF',
          badgeBg: 'bg-[#F59E0B] text-white',
          label: 'Active'
        }
      case 'coldspot':
        return {
          fill: '#E11D48', // Clean Soft Crimson / Rose Red
          stroke: '#BE123C',
          hoverFill: '#BE123C',
          textColor: '#FFFFFF',
          badgeBg: 'bg-[#E11D48] text-white',
          label: 'Cold Spot'
        }
      default: // 'unreached'
        return {
          fill: '#F8FAFC', // Light Clean Slate
          stroke: '#CBD5E1',
          hoverFill: '#E2E8F0',
          textColor: '#64748B',
          badgeBg: 'bg-slate-200 text-slate-700',
          label: 'Unreached'
        }
    }
  }

  // Filtered territories based on search and selected filters
  const filteredStates = useMemo(() => {
    return statesData.filter(st => {
      const matchSearch =
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.topTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.activeScholars.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchStatus = statusFilter === 'all' || st.status === statusFilter
      const matchPanel = panelFilter === 'all' || st.assignedPanel.includes(panelFilter)
      const matchZone = zoneFilter === 'all' || st.zone === zoneFilter

      return matchSearch && matchStatus && matchPanel && matchZone
    })
  }, [statesData, searchQuery, statusFilter, panelFilter, zoneFilter])

  // Copy State Telemetry Brief for WhatsApp or executive memo
  const handleCopyStateBrief = () => {
    if (!selectedState) return
    const text = `*DAKSHANA OUTREACH REGIONAL REACH BRIEF*
📍 *Region:* ${selectedState.name} (${selectedState.zone} Zone)
📊 *Reach Status:* ${selectedState.status.toUpperCase()} (${selectedState.conductedSessions} Sessions Conducted)
👥 *Students Impacted:* ${selectedState.studentsReached} high school scholars
🏫 *Schools Reached:* ${selectedState.schoolsVisited.length} verified campuses
🎯 *Primary Focus:* ${selectedState.topTopic}
👥 *Conducting Scholars:* ${selectedState.activeScholars.join(', ') || 'None Assigned'}
⚠️ *Regional Gap / Hurdle:* ${selectedState.challenges}
🚀 *Recommended Expansion:* ${selectedState.opportunity}`

    navigator.clipboard.writeText(text).then(() => {
      setCopiedNotice(true)
      setTimeout(() => setCopiedNotice(false), 3000)
    })
  }

  // Access Control fallback view if accessed by an intern
  if (!isAuthorized) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center max-w-xl mx-auto border border-slate-200 shadow-md">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <Compass className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">Restricted Geographic Intelligence</h3>
        <p className="text-slate-500 text-xs mt-2 leading-relaxed">
          The Pan-India Reach Map is an executive console reserved for Junior Secretaries, the Senior Secretary, and Board Trustees.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* ============================================================== */}
      {/* 1. EXECUTIVE HEADER BANNER WITH REACH KPI METRICS              */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-[#074D2D] via-[#0A643B] to-[#7B2E68] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 border border-white/20">
              <Compass className="w-3.5 h-3.5 text-emerald-200" />
              <span>Pan-India Regional Outreach Console</span>
              <span className="bg-emerald-400 text-emerald-950 px-2 py-0.2 rounded-full text-[10px] font-black uppercase">
                Official Boundaries
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Pan-India Geographic Reach Map
            </h2>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Track exactly where school sessions are being conducted properly and pinpoint underserved cold spots and unreached regions across all 36 Indian states and union territories.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20 flex text-xs font-bold">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  viewMode === 'map' ? 'bg-white text-[#0A643B] shadow-md font-black' : 'text-white hover:bg-white/10'
                }`}
              >
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Interactive Reach Map</span>
              </button>
              <button
                onClick={() => setViewMode('coldspots')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  viewMode === 'coldspots' ? 'bg-white text-rose-900 shadow-md font-black' : 'text-white hover:bg-white/10'
                }`}
              >
                <Snowflake className="w-4 h-4 text-cyan-400" />
                <span>Cold Spots & Gaps</span>
              </button>
              <button
                onClick={() => setViewMode('directory')}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                  viewMode === 'directory' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-white hover:bg-white/10'
                }`}
              >
                <Layers className="w-4 h-4 text-purple-400" />
                <span>All 36 States Directory</span>
              </button>
            </div>
          </div>
        </div>

        {/* Executive Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/15">
            <span className="text-[11px] text-emerald-200 block font-semibold">Total Verified Visits</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-white">{totalConductedSessions}</span>
              <span className="text-xs text-emerald-300 font-bold">sessions</span>
            </div>
            <span className="text-[10px] text-emerald-200 block mt-0.5">Across {reachedStatesCount} active states</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/15">
            <span className="text-[11px] text-emerald-200 block font-semibold">Hotspots (Strong Reach)</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-300">{hotspotsCount}</span>
              <span className="text-xs text-white/80 font-bold">states (10+ visits)</span>
            </div>
            <span className="text-[10px] text-emerald-200 block mt-0.5">Maharashtra, Karnataka</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/15">
            <span className="text-[11px] text-amber-200 block font-semibold">Active (Moderate Reach)</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-300">{moderateCount}</span>
              <span className="text-xs text-amber-200 font-bold">states (4-9 visits)</span>
            </div>
            <span className="text-[10px] text-amber-100 block mt-0.5">MP, RJ, UP, KL, TG</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/15">
            <span className="text-[11px] text-rose-200 block font-semibold">Cold Spots & Gaps</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-rose-300">{coldspotsCount + unreachedCount}</span>
              <span className="text-xs text-rose-200 font-bold">states ({unreachedCount} zero visits)</span>
            </div>
            <span className="text-[10px] text-rose-100 block mt-0.5">JH, CG, NE, HR, PB, OD</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. REACH STATUS FILTER & SEARCH BAR                            */}
      {/* ============================================================== */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search state, school, scholar, or cluster..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A643B]/30 focus:border-[#0A643B]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Quick Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('hotspot')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1 ${
                statusFilter === 'hotspot' ? 'bg-[#0A643B] text-white shadow-xs' : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              <span>Hotspots</span>
            </button>
            <button
              onClick={() => setStatusFilter('moderate')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1 ${
                statusFilter === 'moderate' ? 'bg-[#F59E0B] text-white shadow-xs' : 'text-slate-600 hover:text-amber-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              <span>Active</span>
            </button>
            <button
              onClick={() => setStatusFilter('coldspot')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1 ${
                statusFilter === 'coldspot' ? 'bg-[#E11D48] text-white shadow-xs' : 'text-slate-600 hover:text-rose-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block"></span>
              <span>Cold Spots</span>
            </button>
            <button
              onClick={() => setStatusFilter('unreached')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1 ${
                statusFilter === 'unreached' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-300 inline-block"></span>
              <span>Unreached</span>
            </button>
          </div>

          {/* Zone Filter */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Zones</option>
            <option value="North">North Zone</option>
            <option value="South">South Zone</option>
            <option value="West">West Zone</option>
            <option value="East">East Zone</option>
            <option value="Central">Central Zone</option>
            <option value="North-East">North-East Zone</option>
          </select>

          {/* Panel Filter */}
          <select
            value={panelFilter}
            onChange={(e) => setPanelFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Panels</option>
            <option value="Panel 1">Panel 1</option>
            <option value="Panel 2">Panel 2</option>
            <option value="Panel 3">Panel 3</option>
          </select>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN INTERACTIVE REACH MAP (CLEAN OFFICIAL INDIA MAP)       */}
      {/* ============================================================== */}
      {viewMode === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Visual Map Card */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-6 relative overflow-hidden">
            
            {/* Header: Title & Exact 4-Tier Reach Legend (Matches User Request) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 mb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-[#0A643B]" />
                  <h3 className="font-black text-slate-900 text-base">
                    Pan-India Geographic Reach Map
                  </h3>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">
                  Click on any Indian state to inspect conducted school sessions, attending students, and active scholars.
                </p>
              </div>

              {/* Clean Reach Status Legend (Exact 4 Badges as in User Screenshot) */}
              <div className="flex items-center space-x-3 text-xs font-extrabold select-none">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#0A643B] inline-block shadow-2xs"></span>
                  <span className="text-slate-800">Hotspot</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B] inline-block shadow-2xs"></span>
                  <span className="text-slate-800">Active</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#E11D48] inline-block shadow-2xs"></span>
                  <span className="text-slate-800">Cold Spot</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300 inline-block shadow-2xs"></span>
                  <span className="text-slate-500">Unreached</span>
                </div>
              </div>
            </div>

            {/* Clear Vector SVG Map of India (viewBox 0 0 612 696) */}
            <div className="relative w-full flex items-center justify-center py-2 select-none">
              <svg
                viewBox={IndiaSVGMap.viewBox || "0 0 612 696"}
                className="w-full max-w-[580px] h-auto drop-shadow-sm transition-all"
                style={{ maxHeight: '700px' }}
              >
                {/* 1. Official State Boundary Paths from @svg-maps/india */}
                <g className="states-layer">
                  {IndiaSVGMap.locations.map(loc => {
                    const st = statesLookup[loc.id.toLowerCase()]
                    const isSelected = selectedStateId?.toLowerCase() === loc.id.toLowerCase()
                    const isHovered = hoveredStateId?.toLowerCase() === loc.id.toLowerCase()
                    const reach = getReachColor(loc.id)

                    return (
                      <path
                        key={loc.id}
                        id={loc.id}
                        name={loc.name}
                        d={loc.path}
                        fill={isHovered ? reach.hoverFill : reach.fill}
                        stroke={isSelected ? '#1E293B' : isHovered ? '#0F172A' : reach.stroke}
                        strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '0.8'}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className="transition-colors duration-150 cursor-pointer"
                        onClick={() => setSelectedStateId(loc.id.toLowerCase())}
                        onMouseEnter={() => setHoveredStateId(loc.id.toLowerCase())}
                        onMouseLeave={() => setHoveredStateId(null)}
                      />
                    )
                  })}
                </g>

                {/* 2. State Code Labels (MH, KA, MP, UP, RJ, etc.) */}
                <g className="labels-layer pointer-events-none">
                  {Object.entries(STATE_CENTERS).map(([locId, center]) => {
                    const st = statesLookup[locId]
                    const count = st?.conductedSessions || 0
                    const reach = getReachColor(locId)
                    const isSelected = selectedStateId?.toLowerCase() === locId
                    const isSignificant = count > 0 || ['mh', 'ka', 'up', 'rj', 'mp', 'gj', 'br', 'wb', 'jh', 'ct', 'tg', 'ap', 'kl', 'tn', 'pb', 'hr', 'as', 'jk', 'or'].includes(locId)

                    if (!isSignificant) return null

                    return (
                      <g key={locId} transform={`translate(${center.x}, ${center.y})`}>
                        {/* 2-Letter Code */}
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={reach.textColor}
                          fontSize={count >= 10 ? '10' : '8.5'}
                          fontWeight="900"
                          letterSpacing="0.05em"
                          style={{
                            textShadow: reach.textColor === '#FFFFFF'
                              ? '0 1px 2px rgba(0,0,0,0.5)'
                              : '0 0 3px rgba(255,255,255,0.9)'
                          }}
                        >
                          {center.code}
                        </text>

                        {/* Session Count Bubble when sessions > 0 */}
                        {count > 0 && (
                          <g transform="translate(0, 11)">
                            <rect
                              x="-9"
                              y="-5"
                              width="18"
                              height="10"
                              rx="5"
                              fill="#0F172A"
                              stroke="#FFFFFF"
                              strokeWidth="0.8"
                              opacity="0.9"
                            />
                            <text
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="#FFFFFF"
                              fontSize="6.5"
                              fontWeight="900"
                            >
                              {count}
                            </text>
                          </g>
                        )}
                      </g>
                    )
                  })}
                </g>
              </svg>

              {/* Floating State Inspector Pill (Exact match to the user's screenshot layout!) */}
              {activePillState && (
                <div
                  onClick={() => setSelectedStateId(activePillState.id)}
                  className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-slate-200/90 flex items-center space-x-3 transition-all cursor-pointer hover:border-[#0A643B] hover:shadow-xl z-20"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${
                      activePillState.status === 'hotspot'
                        ? 'bg-[#0A643B]'
                        : activePillState.status === 'moderate'
                        ? 'bg-[#F59E0B]'
                        : activePillState.status === 'coldspot'
                        ? 'bg-[#E11D48]'
                        : 'bg-slate-300'
                    }`}
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-black text-slate-900 text-sm">
                        {activePillState.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        ({activePillState.code})
                      </span>
                    </div>
                    <span className="text-xs text-slate-600 font-semibold block">
                      {activePillState.conductedSessions} Sessions • {activePillState.studentsReached} Students Reached
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick State Shortcut Pills */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-slate-400 font-bold text-[11px] flex items-center">
                <Info className="w-3.5 h-3.5 mr-1 text-[#0A643B]" />
                Jump to High-Density Hubs:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'mh', label: 'Maharashtra (16 Visits)', badge: 'bg-[#EBF7F0] text-[#0A643B] border-[#0A643B]/30' },
                  { id: 'ka', label: 'Karnataka (16 Visits)', badge: 'bg-[#EBF7F0] text-[#0A643B] border-[#0A643B]/30' },
                  { id: 'mp', label: 'Madhya Pradesh (8 Visits)', badge: 'bg-amber-50 text-amber-800 border-amber-300' },
                  { id: 'rj', label: 'Rajasthan (6 Visits)', badge: 'bg-amber-50 text-amber-800 border-amber-300' },
                  { id: 'up', label: 'Uttar Pradesh (6 Visits)', badge: 'bg-amber-50 text-amber-800 border-amber-300' },
                  { id: 'kl', label: 'Kerala (5 Visits)', badge: 'bg-amber-50 text-amber-800 border-amber-300' },
                  { id: 'tg', label: 'Telangana (5 Visits)', badge: 'bg-amber-50 text-amber-800 border-amber-300' }
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedStateId(b.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border transition-all cursor-pointer ${
                      selectedStateId?.toLowerCase() === b.id
                        ? 'bg-[#0A643B] text-white border-[#0A643B] shadow-xs'
                        : `${b.badge} hover:shadow-2xs`
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* STATE DRILLDOWN & EXECUTIVE INTELLIGENCE DRAWER                 */}
          {/* ============================================================== */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5 sticky top-24">
            
            {/* Drawer Title & Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {selectedState.zone} Zone Telemetry
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  selectedState.status === 'hotspot'
                    ? 'bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30'
                    : selectedState.status === 'moderate'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : selectedState.status === 'coldspot'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {selectedState.status === 'hotspot' && '🟢 Hotspot (Strong Reach)'}
                  {selectedState.status === 'moderate' && '🟡 Active Reach'}
                  {selectedState.status === 'coldspot' && '🔴 Cold Spot (Low Visits)'}
                  {selectedState.status === 'unreached' && '⚪ Unreached'}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 flex items-center justify-between">
                <span>{selectedState.name}</span>
                <span className="text-xs font-bold text-slate-400">({selectedState.code})</span>
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Supervised by <strong className="text-slate-800">{selectedState.assignedPanel}</strong>
              </p>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Conducted Visits</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">
                  {selectedState.conductedSessions}
                </span>
                <span className="text-[10px] text-slate-500">Verified Sessions</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Impacted Students</span>
                <span className="text-2xl font-black text-[#0A643B] mt-0.5 block">
                  {selectedState.studentsReached}
                </span>
                <span className="text-[10px] text-slate-500">High School Beneficiaries</span>
              </div>
            </div>

            {/* Deployed Scholars in this State */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span className="flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1.5 text-[#0A643B]" />
                  Active Scholars Deployed ({selectedState.activeScholars.length})
                </span>
              </div>
              {selectedState.activeScholars.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedState.activeScholars.map(scholarName => (
                    <span
                      key={scholarName}
                      className="inline-flex items-center px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200"
                    >
                      <Avatar name={scholarName} role="intern" size="xs" />
                      <span className="ml-1.5">{scholarName}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-100 flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>No scholars currently deployed to this territory.</span>
                </div>
              )}
            </div>

            {/* Verified Schools Logged */}
            <div>
              <span className="text-xs font-bold text-slate-700 flex items-center mb-2">
                <School className="w-3.5 h-3.5 mr-1.5 text-[#0A643B]" />
                Schools Visited & Field Clusters ({selectedState.schoolsVisited.length})
              </span>
              {selectedState.schoolsVisited.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedState.schoolsVisited.map((sch, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-extrabold text-slate-900 block">{sch.name}</span>
                        <span className="text-[10px] font-black bg-[#EBF7F0] text-[#0A643B] px-2 py-0.5 rounded-md">
                          {sch.sessions} Sessions
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                        <span>Cluster: <strong>{sch.cluster}</strong></span>
                        <span className="font-semibold text-emerald-800">{sch.students} Students</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No school session logs recorded yet.</p>
              )}
            </div>

            {/* Hurdle & Leadership Opportunity */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-amber-900">
                <div className="flex items-center space-x-1.5 font-bold mb-1 text-amber-950">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Regional Hurdle / Gap</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900/90">
                  {selectedState.challenges}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-[#0A643B]">
                <div className="flex items-center space-x-1.5 font-bold mb-1 text-emerald-950">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Expansion Opportunity</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-900/90">
                  {selectedState.opportunity}
                </p>
              </div>
            </div>

            {/* Action Buttons: Copy Brief */}
            <button
              onClick={handleCopyStateBrief}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
            >
              {copiedNotice ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied State Brief to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Regional Telemetry Brief</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* 4. COLD SPOTS & GAP ANALYSIS FOCUS VIEW                        */}
      {/* ============================================================== */}
      {viewMode === 'coldspots' && (
        <div className="space-y-6">
          <div className="bg-rose-50/60 rounded-3xl p-6 border border-rose-200 text-rose-950">
            <div className="flex items-start space-x-3">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-700">
                <Snowflake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-rose-950">
                  Critical Gaps & Underserved Territories Console
                </h3>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed max-w-3xl">
                  This console isolates Indian states with <strong>0 to 2 recorded visits</strong>. Junior Secretaries and the Senior Secretary should prioritize Batch 2 scholar reallocation to these territories to ensure comprehensive pan-India reach.
                </p>
              </div>
            </div>
          </div>

          {/* Grid of Under-represented territories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statesData
              .filter(st => st.conductedSessions <= 2)
              .map(state => (
                <div
                  key={state.id}
                  onClick={() => { setSelectedStateId(state.id); setViewMode('map') }}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#0A643B] transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {state.zone} Zone
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        state.status === 'unreached'
                          ? 'bg-slate-200 text-slate-700 border border-slate-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {state.status === 'unreached' ? '0 Visits' : `${state.conductedSessions} Visits`}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-slate-900 group-hover:text-[#0A643B] transition-colors">
                      {state.name}
                    </h4>

                    <div className="space-y-2 text-xs mt-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600">
                        <span className="font-bold block text-slate-800 text-[11px] mb-0.5">Hurdle / Gap:</span>
                        <p className="text-[11px] leading-relaxed">{state.challenges}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50/60 text-[#0A643B]">
                        <span className="font-bold block text-emerald-950 text-[11px] mb-0.5">Potential Action:</span>
                        <p className="text-[11px] leading-relaxed">{state.opportunity}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0A643B]">
                    <span>Inspect On India Map</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. FULL TABULAR REGIONAL MATRIX DIRECTORY (ALL 36 STATES/UTS)   */}
      {/* ============================================================== */}
      {viewMode === 'directory' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-black text-slate-900 text-base">All 36 States & Union Territories Matrix</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Comprehensive regional telemetry directory covering all 28 states and 8 union territories.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Showing {filteredStates.length} of {statesData.length} Territories
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">State / Territory</th>
                  <th className="py-3.5 px-4">Zone</th>
                  <th className="py-3.5 px-4">Reach Status</th>
                  <th className="py-3.5 px-4 text-center">Conducted Visits</th>
                  <th className="py-3.5 px-4 text-center">Students Reached</th>
                  <th className="py-3.5 px-4">Supervising Panel</th>
                  <th className="py-3.5 px-4">Conducting Scholars</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStates.map(st => (
                  <tr
                    key={st.id}
                    onClick={() => { setSelectedStateId(st.id); setViewMode('map') }}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-black text-slate-900 flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-black group-hover:bg-[#0A643B] group-hover:text-white transition-colors">
                        {st.code}
                      </span>
                      <span>{st.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-500">{st.zone}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        st.status === 'hotspot'
                          ? 'bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30'
                          : st.status === 'moderate'
                          ? 'bg-amber-50 text-amber-800 border border-amber-300'
                          : st.status === 'coldspot'
                          ? 'bg-rose-50 text-rose-700 border border-rose-300'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {st.status === 'hotspot' && 'Hotspot'}
                        {st.status === 'moderate' && 'Active'}
                        {st.status === 'coldspot' && 'Cold Spot'}
                        {st.status === 'unreached' && 'Unreached'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-extrabold text-slate-900 text-sm">
                      {st.conductedSessions}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#0A643B]">
                      {st.studentsReached}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {st.assignedPanel}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-500">
                      {st.activeScholars.length > 0 ? st.activeScholars.join(', ') : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[#0A643B] font-bold text-[11px] group-hover:underline flex items-center justify-end">
                        View Map →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
