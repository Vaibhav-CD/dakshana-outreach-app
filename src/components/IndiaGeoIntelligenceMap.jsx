import React, { useState, useMemo } from 'react'
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
  Flame,
  Snowflake,
  ShieldAlert,
  ArrowUpRight,
  X,
  Copy,
  Check,
  Building,
  Calendar,
  BookOpen
} from 'lucide-react'
import Avatar from './Avatar'
import StreamBadge from './StreamBadge'

// Coordinates and simplified high-fidelity SVG paths for Indian states (viewBox 0 0 650 720)
// Designed for responsive vector visualization with crisp state hover and click boundaries
const INDIA_STATE_GEOMETRY = [
  {
    id: 'JK',
    name: 'Jammu & Kashmir / Ladakh',
    zone: 'North',
    labelX: 250,
    labelY: 90,
    path: 'M 210 40 L 290 35 L 340 70 L 330 140 L 280 145 L 245 135 L 210 110 L 190 70 Z'
  },
  {
    id: 'HP',
    name: 'Himachal Pradesh',
    zone: 'North',
    labelX: 255,
    labelY: 160,
    path: 'M 245 135 L 280 145 L 295 170 L 265 185 L 235 165 Z'
  },
  {
    id: 'PB',
    name: 'Punjab',
    zone: 'North',
    labelX: 215,
    labelY: 180,
    path: 'M 195 155 L 235 165 L 230 205 L 195 195 Z'
  },
  {
    id: 'UK',
    name: 'Uttarakhand',
    zone: 'North',
    labelX: 295,
    labelY: 195,
    path: 'M 265 185 L 295 170 L 330 200 L 285 220 Z'
  },
  {
    id: 'HR',
    name: 'Haryana & Delhi',
    zone: 'North',
    labelX: 235,
    labelY: 220,
    path: 'M 230 205 L 265 185 L 275 220 L 245 240 L 220 220 Z'
  },
  {
    id: 'RJ',
    name: 'Rajasthan',
    zone: 'North',
    labelX: 170,
    labelY: 275,
    path: 'M 195 195 L 220 220 L 245 240 L 230 300 L 180 340 L 120 310 L 125 245 L 170 210 Z'
  },
  {
    id: 'UP',
    name: 'Uttar Pradesh',
    zone: 'North',
    labelX: 305,
    labelY: 270,
    path: 'M 275 220 L 330 200 L 380 240 L 385 285 L 340 315 L 275 280 L 245 240 Z'
  },
  {
    id: 'BR',
    name: 'Bihar',
    zone: 'East',
    labelX: 405,
    labelY: 290,
    path: 'M 380 240 L 440 255 L 445 305 L 385 285 Z'
  },
  {
    id: 'SK',
    name: 'Sikkim',
    zone: 'North-East',
    labelX: 440,
    labelY: 235,
    path: 'M 435 225 L 455 225 L 450 245 L 435 240 Z'
  },
  {
    id: 'NE',
    name: 'Assam & North-East',
    zone: 'North-East',
    labelX: 535,
    labelY: 290,
    path: 'M 470 240 L 530 220 L 585 245 L 590 320 L 540 360 L 510 350 L 490 310 L 460 300 Z'
  },
  {
    id: 'WB',
    name: 'West Bengal',
    zone: 'East',
    labelX: 445,
    labelY: 350,
    path: 'M 445 305 L 465 295 L 460 380 L 430 385 L 420 345 Z'
  },
  {
    id: 'JH',
    name: 'Jharkhand',
    zone: 'East',
    labelX: 395,
    labelY: 345,
    path: 'M 385 285 L 445 305 L 420 345 L 390 375 L 360 345 Z'
  },
  {
    id: 'OD',
    name: 'Odisha',
    zone: 'East',
    labelX: 400,
    labelY: 420,
    path: 'M 390 375 L 430 385 L 440 440 L 375 465 L 365 410 Z'
  },
  {
    id: 'MP',
    name: 'Madhya Pradesh',
    zone: 'Central',
    labelX: 275,
    labelY: 350,
    path: 'M 230 300 L 275 280 L 340 315 L 360 345 L 335 410 L 230 405 L 205 350 Z'
  },
  {
    id: 'CG',
    name: 'Chhattisgarh',
    zone: 'Central',
    labelX: 345,
    labelY: 390,
    path: 'M 340 315 L 360 345 L 365 410 L 375 465 L 335 455 L 335 410 Z'
  },
  {
    id: 'GJ',
    name: 'Gujarat',
    zone: 'West',
    labelX: 135,
    labelY: 365,
    path: 'M 120 310 L 180 340 L 205 350 L 185 415 L 145 425 L 95 385 L 85 340 Z'
  },
  {
    id: 'MH',
    name: 'Maharashtra',
    zone: 'West',
    labelX: 220,
    labelY: 450,
    path: 'M 185 415 L 230 405 L 335 410 L 335 455 L 290 500 L 195 505 L 170 445 Z'
  },
  {
    id: 'GA',
    name: 'Goa',
    zone: 'West',
    labelX: 185,
    labelY: 535,
    path: 'M 180 525 L 195 525 L 190 545 L 178 540 Z'
  },
  {
    id: 'TG',
    name: 'Telangana',
    zone: 'South',
    labelX: 285,
    labelY: 485,
    path: 'M 255 455 L 320 450 L 330 505 L 270 530 L 245 490 Z'
  },
  {
    id: 'AP',
    name: 'Andhra Pradesh',
    zone: 'South',
    labelX: 300,
    labelY: 550,
    path: 'M 320 450 L 375 465 L 330 575 L 285 580 L 270 530 L 330 505 Z'
  },
  {
    id: 'KA',
    name: 'Karnataka',
    zone: 'South',
    labelX: 215,
    labelY: 555,
    path: 'M 195 505 L 255 455 L 270 530 L 265 605 L 205 600 L 185 540 Z'
  },
  {
    id: 'KL',
    name: 'Kerala',
    zone: 'South',
    labelX: 220,
    labelY: 645,
    path: 'M 205 600 L 230 600 L 245 660 L 225 685 L 210 650 Z'
  },
  {
    id: 'TN',
    name: 'Tamil Nadu',
    zone: 'South',
    labelX: 265,
    labelY: 635,
    path: 'M 265 605 L 285 580 L 295 640 L 265 685 L 235 680 L 230 600 Z'
  }
]

// State-level telemetry database mapped to Dakshana's Pan-India outreach network
const INITIAL_OUTREACH_STATES = [
  {
    id: 'MH',
    name: 'Maharashtra',
    zone: 'West',
    conductedSessions: 28,
    studentsReached: 840,
    status: 'hotspot',
    assignedPanel: 'Panel 1 (Aditi)',
    topTopic: 'Foundational Numeracy & JEE Intro',
    activeScholars: ['Aarav Gupta', 'Meera Iyer', 'Pallavi T', 'Karan Verma'],
    schoolsVisited: [
      { name: 'JNV Pune (Rural Science Hub)', cluster: 'Baramati Taluka', sessions: 8, students: 240, topic: 'Foundational Math & Physics Lab' },
      { name: 'Zilla Parishad High School, Saswad', cluster: 'Purandar Taluka', sessions: 6, students: 180, topic: 'Speed Math & Mental Arithmetic' },
      { name: 'Govt Model Ashram School, Wardha', cluster: 'Wardha Rural', sessions: 7, students: 210, topic: 'Science Concept Clarification' },
      { name: 'Adarsh Vidya Mandir, Kolhapur', cluster: 'Karveer Taluka', sessions: 7, students: 210, topic: 'Career Guidance & JEE/NEET Path' }
    ],
    challenges: 'High demand for regional Marathi workbooks in interior talukas.',
    opportunity: 'Model outreach hub; ready to scale to 45 sessions next semester.'
  },
  {
    id: 'KA',
    name: 'Karnataka',
    zone: 'South',
    conductedSessions: 16,
    studentsReached: 520,
    status: 'hotspot',
    assignedPanel: 'Panel 2 (Nitish)',
    topTopic: 'Robotics, Science Labs & Kannada Literacy',
    activeScholars: ['Kabir Das', 'Ananya Rao'],
    schoolsVisited: [
      { name: 'JNV Bangalore Rural', cluster: 'Doddaballapur', sessions: 6, students: 195, topic: 'Hands-on Breadboard Circuits' },
      { name: 'Govt PU College High School Wing, Dharwad', cluster: 'Hubli-Dharwad', sessions: 5, students: 165, topic: 'Physics Demonstration Drive' },
      { name: 'Morarji Desai Residential School, Belgaum', cluster: 'Chikkodi', sessions: 5, students: 160, topic: 'Scholarship Awareness & Guidance' }
    ],
    challenges: 'Transportation gaps between bus stops and interior rural schools.',
    opportunity: 'Strong school leadership interest; potential to add 12 government schools.'
  },
  {
    id: 'MP',
    name: 'Madhya Pradesh',
    zone: 'Central',
    conductedSessions: 8,
    studentsReached: 260,
    status: 'moderate',
    assignedPanel: 'Panel 3 (Sakshi)',
    topTopic: 'Visual Science Demos & Mathematics',
    activeScholars: ['Vikram Joshi'],
    schoolsVisited: [
      { name: 'Govt Excellence Boys School, Bhopal', cluster: 'Bhopal Rural', sessions: 4, students: 130, topic: 'Vedic Math & Basic Algebra' },
      { name: 'JNV Sehore Cluster', cluster: 'Ichhawar', sessions: 4, students: 130, topic: 'Science Experiment Kits' }
    ],
    challenges: 'Low frequency of visits; requires dedicated Batch 2 scholar allocation.',
    opportunity: 'Central tribal belt has enormous high-potential students.'
  },
  {
    id: 'RJ',
    name: 'Rajasthan',
    zone: 'North',
    conductedSessions: 7,
    studentsReached: 210,
    status: 'moderate',
    assignedPanel: 'Panel 1 (Aditi)',
    topTopic: 'JEE Engineering Mentorship',
    activeScholars: ['Aarav Gupta'],
    schoolsVisited: [
      { name: 'Govt Senior Secondary School, Kota Rural', cluster: 'Sangod', sessions: 4, students: 120, topic: 'Algebraic Foundations' },
      { name: 'JNV Bundi', cluster: 'Talera', sessions: 3, students: 90, topic: 'Dakshana Scholarship Guidance' }
    ],
    challenges: 'Extreme weather and scattered rural hamlets.',
    opportunity: 'Proximity to Kota educational hub allows peer volunteer mobilization.'
  },
  {
    id: 'UP',
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
    id: 'KL',
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
    id: 'TG',
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
    id: 'GJ',
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
    id: 'BR',
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
    id: 'PB',
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
    id: 'OD',
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
    id: 'WB',
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
  // Unreached States (Zero Outreach Recorded - Highlights where leadership needs to mobilize)
  {
    id: 'JH',
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
    id: 'CG',
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
    opportunity: 'Connect with JNV Raipur for cluster coordination.'
  },
  {
    id: 'AP',
    name: 'Andhra Pradesh',
    zone: 'South',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Zero verified school visits recorded.',
    opportunity: 'Rayalaseema and coastal rural high schools need outreach.'
  },
  {
    id: 'TN',
    name: 'Tamil Nadu',
    zone: 'South',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Government schools currently have no outreach presence.',
    opportunity: 'Identify Tamil-speaking scholars in Batch 1 & 2.'
  },
  {
    id: 'HP',
    name: 'Himachal Pradesh',
    zone: 'North',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Remote hilly schools in Mandi/Kangra.',
    opportunity: 'Summer session campaign can cover 10 cluster schools.'
  },
  {
    id: 'UK',
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
    id: 'HR',
    name: 'Haryana & Delhi',
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
    id: 'JK',
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
    id: 'GA',
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
    id: 'NE',
    name: 'Assam & North-East',
    zone: 'North-East',
    conductedSessions: 0,
    studentsReached: 0,
    status: 'unreached',
    assignedPanel: 'Unassigned',
    topTopic: 'No Sessions Recorded',
    activeScholars: [],
    schoolsVisited: [],
    challenges: 'UNREACHED TERRITORY: Critical national priority; 0 verified visits recorded.',
    opportunity: 'Leadership priority: Special initiative for Assam rural & Northeast clusters.'
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
  const [selectedStateId, setSelectedStateId] = useState('MH') // Default to highest active hub
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'hotspot' | 'moderate' | 'coldspot' | 'unreached'
  const [panelFilter, setPanelFilter] = useState('all') // 'all' | 'Panel 1' | 'Panel 2' | 'Panel 3'
  const [zoneFilter, setZoneFilter] = useState('all') // 'all' | 'North' | 'South' | 'West' | 'East' | 'Central' | 'North-East'
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('map') // 'map' | 'directory' | 'coldspots'
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
        return text.includes(st.name.toLowerCase()) || text.includes(st.id.toLowerCase())
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

  // Filtered states list
  const filteredStates = useMemo(() => {
    return statesData.filter(st => {
      const matchesStatus = statusFilter === 'all' || st.status === statusFilter
      const matchesPanel = panelFilter === 'all' || st.assignedPanel.includes(panelFilter)
      const matchesZone = zoneFilter === 'all' || st.zone === zoneFilter
      const q = searchQuery.toLowerCase().trim()
      const matchesQuery = !q ||
        st.name.toLowerCase().includes(q) ||
        st.id.toLowerCase().includes(q) ||
        st.topTopic.toLowerCase().includes(q) ||
        st.activeScholars.some(sch => sch.toLowerCase().includes(q)) ||
        st.schoolsVisited.some(sc => sc.name.toLowerCase().includes(q) || sc.cluster.toLowerCase().includes(q))

      return matchesStatus && matchesPanel && matchesZone && matchesQuery
    })
  }, [statesData, statusFilter, panelFilter, zoneFilter, searchQuery])

  // Aggregate KPI Totals
  const totalSessionsAll = useMemo(() => statesData.reduce((acc, st) => acc + st.conductedSessions, 0), [statesData])
  const totalStudentsAll = useMemo(() => statesData.reduce((acc, st) => acc + st.studentsReached, 0), [statesData])
  const hotspotsCount = useMemo(() => statesData.filter(st => st.status === 'hotspot').length, [statesData])
  const moderateCount = useMemo(() => statesData.filter(st => st.status === 'moderate').length, [statesData])
  const coldspotsCount = useMemo(() => statesData.filter(st => st.status === 'coldspot').length, [statesData])
  const unreachedCount = useMemo(() => statesData.filter(st => st.status === 'unreached').length, [statesData])

  const selectedState = useMemo(() => {
    return statesData.find(st => st.id === selectedStateId) || statesData[0]
  }, [statesData, selectedStateId])

  const handleCopyStateBrief = () => {
    if (!selectedState) return
    const text = `*DAKSHANA OUTREACH REGIONAL TELEMETRY*
📍 *Region:* ${selectedState.name} (${selectedState.zone} Zone)
📊 *Status:* ${selectedState.status.toUpperCase()} (${selectedState.conductedSessions} Sessions Conducted)
👥 *Students Impacted:* ${selectedState.studentsReached} high school scholars
🏫 *Schools Reached:* ${selectedState.schoolsVisited.length} verified campuses
🎯 *Primary Focus:* ${selectedState.topTopic}
👥 *Conducting Scholars:* ${selectedState.activeScholars.join(', ') || 'None Assigned'}
⚠️ *Action Requirement:* ${selectedState.challenges}
🚀 *Strategic Target:* ${selectedState.opportunity}`

    navigator.clipboard.writeText(text).then(() => {
      setCopiedNotice(true)
      setTimeout(() => setCopiedNotice(false), 3000)
    })
  }

  // Access Control fallback view if accessed by a student
  if (!isAuthorized) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center max-w-xl mx-auto border border-slate-200 shadow-md">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <Compass className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">Restricted Geographic Intelligence</h3>
        <p className="text-slate-500 text-xs mt-2 leading-relaxed">
          The Pan-India Regional Heatmap & Cold Spot Telemetry is an executive command console reserved for Junior Secretaries, the Senior Secretary, and Board Trustees.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* ============================================================== */}
      {/* 1. EXECUTIVE BANNER WITH DAKSHANA GRADIENT & KPI STRIP         */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-[#074D2D] via-[#0A643B] to-[#7B2E68] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <Compass className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-bold mb-3 shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span>Pan-India Grassroots Telemetry Console</span>
              <span className="bg-emerald-400 text-emerald-950 text-[10px] px-1.5 py-0.2 rounded-full font-black uppercase">Live</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Pan-India Outreach Reach & Hotspots Map
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Real-time regional telemetry of high school sessions across India. Identify active hotspots, monitor cluster momentum, and pinpoint underserved cold spots where Dakshana outreach needs immediate mobilization.
            </p>
          </div>

          {/* View Mode Switcher Pills */}
          <div className="bg-white/15 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex items-center space-x-1 self-stretch sm:self-auto justify-center">
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-[#0A643B] shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Interactive Map</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('coldspots')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'coldspots'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5" />
              <span>Cold Spots & Gaps ({coldspotsCount + unreachedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('directory')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'directory'
                  ? 'bg-white text-[#0A643B] shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>State Matrix ({statesData.length})</span>
            </button>
          </div>
        </div>

        {/* Executive KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/15 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-all">
            <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">Sessions Delivered</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-white">{totalSessionsAll}</span>
              <span className="text-xs text-emerald-300 font-semibold">school visits</span>
            </div>
            <span className="text-[10px] text-emerald-200/80 mt-1 block">Across Batch 1 & 2</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-all">
            <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">Beneficiary Students</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-300">{totalStudentsAll.toLocaleString()}</span>
              <span className="text-xs text-emerald-200 font-semibold">taught</span>
            </div>
            <span className="text-[10px] text-emerald-200/80 mt-1 block">Foundational sessions</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-all">
            <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider block">Active Hotspots</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-300">{hotspotsCount + moderateCount}</span>
              <span className="text-xs text-amber-200 font-semibold">States</span>
            </div>
            <span className="text-[10px] text-emerald-200/80 mt-1 block">Maharashtra, Karnataka, MP...</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-all">
            <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wider block">Underserved & Unreached</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-rose-300">{coldspotsCount + unreachedCount}</span>
              <span className="text-xs text-rose-200 font-semibold">States</span>
            </div>
            <span className="text-[10px] text-rose-200/80 mt-1 block">{unreachedCount} States with 0 presence</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. DYNAMIC FILTERS & CLUSTER SEARCH BAR                        */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Status Pill Selectors */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs">
          <span className="text-slate-500 font-bold mr-1 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1 text-[#0A643B]" />
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All States ({statesData.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('hotspot')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1 ${
              statusFilter === 'hotspot'
                ? 'bg-[#0A643B] text-white shadow-xs'
                : 'bg-emerald-50 text-[#0A643B] hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Hotspots (≥10 visits) • {hotspotsCount}</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('moderate')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1 ${
              statusFilter === 'moderate'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Active (4–9 visits) • {moderateCount}</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('coldspot')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1 ${
              statusFilter === 'coldspot'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <Snowflake className="w-3 h-3 text-rose-500" />
            <span>Cold Spots (1–3 visits) • {coldspotsCount}</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('unreached')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1 ${
              statusFilter === 'unreached'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Unreached (0 visits) • {unreachedCount}</span>
          </button>
        </div>

        {/* Panel, Zone and Search Input */}
        <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto">
          {/* Panel Filter */}
          <select
            value={panelFilter}
            onChange={(e) => setPanelFilter(e.target.value)}
            className="text-xs font-bold rounded-xl border border-slate-200 p-2 bg-slate-50 text-slate-700 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Panels</option>
            <option value="Panel 1">Panel 1 (Aditi)</option>
            <option value="Panel 2">Panel 2 (Nitish)</option>
            <option value="Panel 3">Panel 3 (Sakshi)</option>
          </select>

          {/* Zone Filter */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="text-xs font-bold rounded-xl border border-slate-200 p-2 bg-slate-50 text-slate-700 focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Geographical Zones</option>
            <option value="North">North India</option>
            <option value="West">West India</option>
            <option value="South">South India</option>
            <option value="Central">Central India</option>
            <option value="East">East India</option>
            <option value="North-East">North-East India</option>
          </select>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search State, School, Scholar..."
              className="w-full text-xs rounded-xl border border-slate-200 pl-8 pr-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0A643B] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN INTERACTIVE MAP & REGIONAL INTELLIGENCE VIEW           */}
      {/* ============================================================== */}
      {viewMode === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Visual India Vector Map (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs relative">
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#0A643B]" />
                  <span>Pan-India Geographic Density Heatmap</span>
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Click on any Indian state to inspect conducted school sessions, attending students, and active scholars.
                </p>
              </div>

              {/* Legend Indicator */}
              <div className="hidden sm:flex items-center space-x-3 text-[11px] font-bold text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-md bg-[#0A643B] shadow-2xs"></span> Hotspot
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-md bg-amber-500"></span> Active
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-md bg-rose-500"></span> Cold Spot
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-md bg-slate-200 border border-slate-300"></span> Unreached
                </span>
              </div>
            </div>

            {/* SVG Interactive India Map */}
            <div className="relative w-full aspect-[650/720] max-h-[640px] flex items-center justify-center p-2 bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
              <svg
                viewBox="0 0 650 720"
                className="w-full h-full max-h-[620px] filter drop-shadow-sm transition-all"
                style={{ touchAction: 'manipulation' }}
              >
                {/* SVG Definitions for Gradients & Glows */}
                <defs>
                  <filter id="glow-hotspot" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0A643B" floodOpacity="0.4" />
                  </filter>
                  <filter id="glow-coldspot" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#E11D48" floodOpacity="0.3" />
                  </filter>
                  <pattern id="diagonal-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#CBD5E1" strokeWidth="1.5" />
                  </pattern>
                </defs>

                {/* Render Each State Path */}
                {INDIA_STATE_GEOMETRY.map((geo) => {
                  const data = statesData.find(s => s.id === geo.id) || {
                    id: geo.id,
                    name: geo.name,
                    conductedSessions: 0,
                    studentsReached: 0,
                    status: 'unreached'
                  }

                  const isSelected = selectedStateId === geo.id

                  // Dynamic color styles based on outreach density
                  let fillColor = '#F1F5F9' // slate-100 (unreached)
                  let strokeColor = '#94A3B8'
                  let strokeWidth = 1.2
                  let filterEffect = 'none'

                  if (data.status === 'hotspot') {
                    fillColor = isSelected ? '#064E3B' : '#0A643B'
                    strokeColor = '#047857'
                    strokeWidth = isSelected ? 2.5 : 1.5
                    filterEffect = 'url(#glow-hotspot)'
                  } else if (data.status === 'moderate') {
                    fillColor = isSelected ? '#D97706' : '#F59E0B'
                    strokeColor = '#B45309'
                    strokeWidth = isSelected ? 2.5 : 1.5
                  } else if (data.status === 'coldspot') {
                    fillColor = isSelected ? '#BE123C' : '#F43F5E'
                    strokeColor = '#9F1239'
                    strokeWidth = isSelected ? 2.5 : 1.5
                    filterEffect = 'url(#glow-coldspot)'
                  } else {
                    // Unreached territory
                    fillColor = isSelected ? '#CBD5E1' : '#F8FAFC'
                    strokeColor = '#94A3B8'
                    strokeWidth = isSelected ? 2 : 1
                  }

                  return (
                    <g
                      key={geo.id}
                      onClick={() => setSelectedStateId(geo.id)}
                      className="cursor-pointer group transition-all duration-200"
                    >
                      <path
                        d={geo.path}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeLinejoin="round"
                        filter={filterEffect}
                        className={`transition-colors duration-200 ${
                          isSelected ? 'brightness-110 ring-2 ring-offset-2 ring-[#0A643B]' : 'hover:brightness-95 hover:stroke-slate-900'
                        }`}
                      />

                      {/* State Abbreviation Marker */}
                      <text
                        x={geo.labelX}
                        y={geo.labelY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`text-[10px] font-black pointer-events-none select-none transition-all ${
                          data.status === 'hotspot' || data.status === 'coldspot'
                            ? 'fill-white'
                            : data.status === 'moderate'
                            ? 'fill-slate-900 font-extrabold'
                            : 'fill-slate-400 font-medium'
                        }`}
                      >
                        {geo.id}
                      </text>

                      {/* Animated Pulse Pin for Top Hotspots */}
                      {data.status === 'hotspot' && (
                        <circle
                          cx={geo.labelX}
                          cy={geo.labelY - 14}
                          r="4.5"
                          fill="#34D399"
                          className="animate-ping opacity-75 pointer-events-none"
                        />
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* Hover / Selection State Quick Floater */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-md text-xs flex items-center space-x-2.5">
                <div className={`w-3 h-3 rounded-full ${
                  selectedState.status === 'hotspot' ? 'bg-[#0A643B]' :
                  selectedState.status === 'moderate' ? 'bg-amber-500' :
                  selectedState.status === 'coldspot' ? 'bg-rose-500' : 'bg-slate-400'
                }`} />
                <div>
                  <span className="font-extrabold text-slate-900 block">{selectedState.name}</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {selectedState.conductedSessions} Sessions • {selectedState.studentsReached} Students
                  </span>
                </div>
              </div>
            </div>

            {/* Quick State Navigation Strip */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 overflow-x-auto gap-2">
              <span className="font-bold flex-shrink-0">Jump To Cluster:</span>
              <div className="flex items-center space-x-1.5 flex-nowrap">
                {['MH', 'KA', 'MP', 'RJ', 'UP', 'KL', 'GJ', 'BR', 'NE'].map(code => {
                  const st = statesData.find(s => s.id === code)
                  if (!st) return null
                  return (
                    <button
                      key={code}
                      onClick={() => setSelectedStateId(code)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                        selectedStateId === code
                          ? 'bg-[#0A643B] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {st.name.split(' ')[0]} ({st.conductedSessions})
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed State Drilldown & Leadership Intelligence (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Selected State Detail Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#0A643B]/30 shadow-md relative overflow-hidden">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {selectedState.id} • {selectedState.zone} Zone
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      selectedState.status === 'hotspot'
                        ? 'bg-[#EBF7F0] text-[#0A643B] border border-[#0A643B]/30'
                        : selectedState.status === 'moderate'
                        ? 'bg-amber-50 text-amber-800 border border-amber-300'
                        : selectedState.status === 'coldspot'
                        ? 'bg-rose-50 text-rose-700 border border-rose-300 font-black'
                        : 'bg-slate-100 text-slate-600 border border-slate-300'
                    }`}>
                      {selectedState.status === 'hotspot' && <Flame className="w-3.5 h-3.5 text-[#0A643B]" />}
                      {selectedState.status === 'coldspot' && <Snowflake className="w-3.5 h-3.5 text-rose-600" />}
                      <span className="capitalize">{selectedState.status} Region</span>
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">{selectedState.name}</h2>
                </div>

                <button
                  type="button"
                  onClick={handleCopyStateBrief}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-[#0A643B] hover:text-white text-slate-600 transition-colors shadow-2xs cursor-pointer"
                  title="Copy formatted WhatsApp/Circular brief for this State"
                >
                  {copiedNotice ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* State Performance Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 my-4">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Conducted Sessions</span>
                  <span className="text-xl font-black text-slate-900 mt-0.5 block">{selectedState.conductedSessions}</span>
                  <span className="text-[11px] text-slate-500 font-medium">Verified classroom visits</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Beneficiary Scholars</span>
                  <span className="text-xl font-black text-[#0A643B] mt-0.5 block">{selectedState.studentsReached}</span>
                  <span className="text-[11px] text-slate-500 font-medium">Attending students</span>
                </div>
              </div>

              {/* Supervisory Panel & Active Scholars */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">Supervising Panel:</span>
                  <span className="font-black text-[#0A643B] px-2.5 py-0.5 bg-[#EBF7F0] rounded-lg">
                    {selectedState.assignedPanel}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1.5">Deploying Outreach Scholars:</span>
                  {selectedState.activeScholars.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedState.activeScholars.map(scholarName => {
                        const userObj = allUsers.find(u => u.name.toLowerCase() === scholarName.toLowerCase())
                        return (
                          <button
                            key={scholarName}
                            type="button"
                            onClick={() => userObj && onSelectIntern && onSelectIntern(userObj)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-[#0A643B] hover:text-white text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Users className="w-3 h-3" />
                            <span>{scholarName}</span>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 block">
                      ⚠ No scholars currently allocated to this State
                    </span>
                  )}
                </div>

                {/* Challenges & Field Opportunities */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>Ground Intelligence & Obstacles:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800 pl-5">
                    {selectedState.challenges}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-[#0A643B]">
                    <Sparkles className="w-3.5 h-3.5 text-[#0A643B] flex-shrink-0" />
                    <span>Expansion Potential:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-800 pl-5">
                    {selectedState.opportunity}
                  </p>
                </div>
              </div>

              {/* Schools Visited List */}
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Schools Visited in {selectedState.name} ({selectedState.schoolsVisited.length})</span>
                  <span className="text-[10px] text-slate-400 font-normal">Attendance Verified</span>
                </h4>

                {selectedState.schoolsVisited.length > 0 ? (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {selectedState.schoolsVisited.map((school, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#0A643B] transition-all flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-white text-[#0A643B] flex items-center justify-center font-bold border border-slate-200 flex-shrink-0 mt-0.5">
                            <School className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block leading-tight">{school.name}</span>
                            <span className="text-[11px] text-slate-500 block mt-0.5">{school.cluster}</span>
                            <span className="text-[10px] font-bold text-[#0A643B] bg-emerald-100/60 px-1.5 py-0.2 rounded-md inline-block mt-1">
                              Topic: {school.topic}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="font-black text-slate-900 block">{school.sessions} Visits</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{school.students} Students</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
                    <School className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                    <p className="font-bold text-slate-700">No schools visited yet</p>
                    <p className="text-[11px] mt-0.5">Prioritize this territory in the upcoming monthly cycle.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. COLD SPOTS & UNREACHED GAP ANALYSIS VIEW                     */}
      {/* ============================================================== */}
      {viewMode === 'coldspots' && (
        <div className="space-y-6">
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-rose-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-200/80 text-rose-900 text-xs font-black uppercase tracking-wider mb-2">
                <Snowflake className="w-3.5 h-3.5" />
                <span>Dakshana Territory Gap Analysis</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-rose-950">
                Critical Cold Spots & Underserved Regions ({coldspotsCount + unreachedCount} States)
              </h2>
              <p className="text-xs text-rose-800 mt-1 max-w-3xl leading-relaxed">
                These regions currently have minimal or zero outreach presence. Junior Secretaries and the Senior Secretary should use this dashboard to assign Batch 1 & Batch 2 scholars during monthly cluster allocation.
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs font-bold">
              <div className="bg-white px-4 py-2 rounded-2xl border border-rose-200 shadow-2xs text-center">
                <span className="text-xl font-black text-rose-600 block">{unreachedCount}</span>
                <span className="text-[10px] text-slate-500 uppercase">Zero Visits</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-2xl border border-rose-200 shadow-2xs text-center">
                <span className="text-xl font-black text-amber-600 block">{coldspotsCount}</span>
                <span className="text-[10px] text-slate-500 uppercase">Low Density (≤3)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {statesData
              .filter(s => s.status === 'coldspot' || s.status === 'unreached')
              .map(state => (
                <div
                  key={state.id}
                  onClick={() => { setSelectedStateId(state.id); setViewMode('map') }}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-rose-500 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {state.zone} Zone • {state.id}
                        </span>
                        <h4 className="text-lg font-black text-slate-900 mt-1 group-hover:text-rose-600 transition-colors">
                          {state.name}
                        </h4>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                        state.status === 'unreached'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {state.status === 'unreached' ? '0 Visits' : `${state.conductedSessions} Visits`}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs mb-4">
                      <div className="p-3 rounded-xl bg-slate-50 text-slate-600">
                        <span className="font-bold block text-slate-800 text-[11px] mb-0.5">Hurdle / Gap:</span>
                        <p className="text-[11px] leading-relaxed">{state.challenges}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50/60 text-[#0A643B]">
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
      {/* 5. FULL TABULAR REGIONAL MATRIX DIRECTORY                      */}
      {/* ============================================================== */}
      {viewMode === 'directory' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-black text-slate-900 text-base">Pan-India State Outreach Directory</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Comprehensive summary table across all 28 states & union territories.
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
                  <th className="py-3.5 px-4">Density Status</th>
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
                        {st.id}
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
                        {st.status}
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
