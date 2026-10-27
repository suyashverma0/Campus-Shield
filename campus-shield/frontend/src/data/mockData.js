/**
 * Comprehensive Mock Data for Campus Shield
 */

export const mockUsers = [
  {
    id: "usr-01",
    name: "Aarav Sharma",
    email: "aarav.sharma@campus.edu",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    role: "Student",
    department: "Computer Science & Engineering",
    studentId: "CS2023-8841",
    phone: "+91 98765 43210",
    karmaPoints: 420,
    verified: true,
    joinedDate: "2024-08-15"
  },
  {
    id: "usr-02",
    name: "Ananya Iyer",
    email: "ananya.iyer@campus.edu",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    role: "Student",
    department: "Biotechnology & Life Sciences",
    studentId: "BT2022-4102",
    phone: "+91 98111 22334",
    karmaPoints: 680,
    verified: true,
    joinedDate: "2023-09-01"
  },
  {
    id: "usr-03",
    name: "Rohan Varma",
    email: "rohan.varma@campus.edu",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    role: "Student Council Rep",
    department: "Mechanical Engineering",
    studentId: "ME2022-1099",
    phone: "+91 99000 88776",
    karmaPoints: 950,
    verified: true,
    joinedDate: "2023-07-20"
  },
  {
    id: "usr-04",
    name: "Dr. K. Nambiar",
    email: "k.nambiar@campus.edu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Faculty Proctor",
    department: "Physics Department",
    studentId: "FAC-8812",
    phone: "+91 94444 33221",
    karmaPoints: 1240,
    verified: true,
    joinedDate: "2022-01-10"
  }
];

export const mockItems = [
  {
    id: "LOST-101",
    type: "lost",
    title: "Space Grey MacBook Air M2 in Navy Sleeve",
    category: "Electronics & Gadgets",
    status: "active",
    location: "Central Library - 2nd Floor Reading Hall",
    date: "2026-10-25",
    time: "16:45",
    description: "Left on cubicle desk #14 right beside the south windows. Has a GitHub Octocat sticker and a yellow React sticker on top cover. Stored in a navy blue felt zipper pouch.",
    brand: "Apple",
    color: "Space Grey",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    userId: "usr-01",
    userName: "Aarav Sharma",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    userDepartment: "Computer Science & Engineering",
    reward: "₹1,500 + Cafeteria Treat",
    securityQuestion: "What wallpaper is set on the lock screen and what is written on the underside sticker?",
    verifiedClaimant: false,
    matchedItemId: "FND-201",
    createdAt: "2026-10-25T17:10:00Z"
  },
  {
    id: "FND-201",
    type: "found",
    title: "MacBook Laptop in Felt Sleeve Found on 2nd Floor Desk",
    category: "Electronics & Gadgets",
    status: "matched",
    location: "Central Library - 2nd Floor Reading Hall",
    date: "2026-10-25",
    time: "18:00",
    description: "Found an Apple MacBook in a dark blue protective sleeve on desk #14 after closing hours. Handed to librarian counter for safekeeping.",
    brand: "Apple",
    color: "Space Grey / Dark Blue sleeve",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80",
    userId: "usr-02",
    userName: "Ananya Iyer",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    userDepartment: "Biotechnology & Life Sciences",
    custodyLocation: "Main Library Lost & Found Locker Box #3",
    matchedItemId: "LOST-101",
    matchScore: 94,
    createdAt: "2026-10-25T18:15:00Z"
  },
  {
    id: "LOST-102",
    type: "lost",
    title: "Leather Fossil Wallet with University RFID Card",
    category: "Student IDs & Wallets",
    status: "active",
    location: "Campus Dining Hall & Canteen",
    date: "2026-10-26",
    time: "13:30",
    description: "Dark brown bi-fold wallet dropped near the beverage counter. Contains my college ID card (CS2023-8841), metro card, and about ₹800 cash.",
    brand: "Fossil",
    color: "Dark Brown",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    userId: "usr-01",
    userName: "Aarav Sharma",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    userDepartment: "Computer Science & Engineering",
    reward: "Gratitude & ₹500",
    securityQuestion: "What bank card name is inside the hidden slot?",
    createdAt: "2026-10-26T14:00:00Z"
  },
  {
    id: "FND-202",
    type: "found",
    title: "Brown Leather Bi-fold Wallet Found at Beverage Corner",
    category: "Student IDs & Wallets",
    status: "active",
    location: "Campus Dining Hall & Canteen",
    date: "2026-10-26",
    time: "14:15",
    description: "Picked up a gents brown wallet from the corner booth beside the juice stall. Contains student cards and travel pass. Available for immediate claim with proof of identity.",
    brand: "Fossil",
    color: "Brown",
    image: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=800&auto=format&fit=crop&q=80",
    userId: "usr-03",
    userName: "Rohan Varma",
    userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    userDepartment: "Mechanical Engineering",
    custodyLocation: "Student Council Helpdesk Room 102",
    createdAt: "2026-10-26T14:30:00Z"
  },
  {
    id: "LOST-103",
    type: "lost",
    title: "Matte Black Beats Studio Pro Wireless Headphones",
    category: "Audio & Headphones",
    status: "active",
    location: "Student Recreation & Sports Center",
    date: "2026-10-24",
    time: "19:15",
    description: "Left inside gym locker room on the wooden bench next to locker 48. In its black hard-shell zipper case with USB-C cable.",
    brand: "Beats by Dre",
    color: "Matte Black",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    userId: "usr-03",
    userName: "Rohan Varma",
    userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    userDepartment: "Mechanical Engineering",
    reward: "₹1,000",
    securityQuestion: "What color is the carabiner attached to the zipper?",
    createdAt: "2026-10-24T20:00:00Z"
  },
  {
    id: "FND-203",
    type: "found",
    title: "Black Over-Ear Wireless Headphones in Hard Case",
    category: "Audio & Headphones",
    status: "active",
    location: "Student Recreation & Sports Center",
    date: "2026-10-24",
    time: "20:30",
    description: "Found on the bench in Men's Locker Room. Turned in to the Gymnasium supervisor desk.",
    brand: "Beats",
    color: "Black",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    userId: "usr-04",
    userName: "Dr. K. Nambiar",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    userDepartment: "Faculty Proctor",
    custodyLocation: "Gymnasium Reception Lost & Found Desk",
    createdAt: "2026-10-24T21:00:00Z"
  },
  {
    id: "LOST-104",
    type: "lost",
    title: "Casio FX-991EX Scientific Calculator & Parker Pen",
    category: "Books & Study Materials",
    status: "resolved",
    location: "Science Laboratory 4 (Physics Wing)",
    date: "2026-10-22",
    time: "11:20",
    description: "Left on workstation #7 during Optics Lab. Name written on back cover with silver marker.",
    brand: "Casio",
    color: "Black & White",
    image: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80",
    userId: "usr-02",
    userName: "Ananya Iyer",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    userDepartment: "Biotechnology & Life Sciences",
    createdAt: "2026-10-22T12:00:00Z"
  },
  {
    id: "FND-204",
    type: "found",
    title: "Honda Two-Wheeler Key Ring with Demon Slayer Lanyard",
    category: "Keys & Access Cards",
    status: "active",
    location: "Parking Lot B (Bicycle & Scooter bay)",
    date: "2026-10-27",
    time: "08:30",
    description: "Found hanging from bike stand #12 in front of the engineering block. Has 2 keys, a brass lock key, and a Tanjiro Kamado checkerboard lanyard.",
    brand: "Honda",
    color: "Black & Green Lanyard",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80",
    userId: "usr-01",
    userName: "Aarav Sharma",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    userDepartment: "Computer Science & Engineering",
    custodyLocation: "Security Gatehouse Guard Post #2",
    createdAt: "2026-10-27T08:45:00Z"
  },
  {
    id: "LOST-105",
    type: "lost",
    title: "Sage Green Hydro Flask Water Bottle (950ml)",
    category: "Water Bottles & Flasks",
    status: "active",
    location: "North Campus Quad & Lawn",
    date: "2026-10-26",
    time: "17:15",
    description: "Left under the central oak tree during the evening debate club meetup. Has a dent near the bottom rim and National Park stickers.",
    brand: "Hydro Flask",
    color: "Sage Green",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    userId: "usr-03",
    userName: "Rohan Varma",
    userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    userDepartment: "Mechanical Engineering",
    createdAt: "2026-10-26T18:00:00Z"
  },
  {
    id: "FND-205",
    type: "found",
    title: "Ray-Ban Clubmaster Sunglasses in Brown Leather Case",
    category: "Eyewear & Glasses",
    status: "active",
    location: "Auditorium & Arts Pavilion",
    date: "2026-10-26",
    time: "16:00",
    description: "Found on row G seat 14 following the orientation seminar. Black and gold frame, polarized lenses.",
    brand: "Ray-Ban",
    color: "Black / Gold",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
    userId: "usr-02",
    userName: "Ananya Iyer",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    userDepartment: "Biotechnology & Life Sciences",
    custodyLocation: "Arts Pavilion Admin Office Desk #1",
    createdAt: "2026-10-26T16:30:00Z"
  }
];

export const mockMatches = [
  {
    id: "MATCH-001",
    score: 95,
    status: "suggested",
    lostItem: mockItems[0], // LOST-101 MacBook
    foundItem: mockItems[1], // FND-201 MacBook
    matchDate: "2026-10-25T18:20:00Z",
    factors: [
      { label: "Exact Category: Electronics & Gadgets", score: "+35%" },
      { label: "Exact Location: Central Library 2nd Floor", score: "+25%" },
      { label: "Timeframe: Within 75 Minutes of loss", score: "+20%" },
      { label: "Matched Brand & Keywords (Apple, Sleeve, Desk 14)", score: "+15%" }
    ],
    verified: false,
    mutualApproved: false
  },
  {
    id: "MATCH-002",
    score: 88,
    status: "verified",
    lostItem: mockItems[2], // LOST-102 Wallet
    foundItem: mockItems[3], // FND-202 Wallet
    matchDate: "2026-10-26T14:45:00Z",
    factors: [
      { label: "Category: Student IDs & Wallets", score: "+35%" },
      { label: "Exact Location: Campus Dining Hall Canteen", score: "+25%" },
      { label: "Reported within 45 minutes", score: "+18%" },
      { label: "Brand Match: Fossil Leather", score: "+10%" }
    ],
    verified: true,
    mutualApproved: true
  },
  {
    id: "MATCH-003",
    score: 91,
    status: "suggested",
    lostItem: mockItems[4], // LOST-103 Headphones
    foundItem: mockItems[5], // FND-203 Headphones
    matchDate: "2026-10-24T21:15:00Z",
    factors: [
      { label: "Category: Audio & Headphones", score: "+35%" },
      { label: "Exact Location: Sports Center Gym Locker", score: "+25%" },
      { label: "Within 1 Hour", score: "+18%" },
      { label: "Brand Match: Beats Studio Pro", score: "+13%" }
    ],
    verified: false,
    mutualApproved: false
  }
];

export const mockMessages = [
  {
    id: "msg-thread-01",
    participantId: "usr-02",
    participantName: "Ananya Iyer",
    participantAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    participantRole: "Student (Biotech)",
    relatedItemId: "LOST-101",
    relatedItemTitle: "Space Grey MacBook Air M2",
    unreadCount: 1,
    lastActivity: "2026-10-26T11:20:00Z",
    messages: [
      {
        id: "m-1",
        senderId: "usr-02",
        text: "Hi Aarav! I saw your Lost report for the MacBook Air on the 2nd floor library reading desk. I turned it into Mrs. D'souza at the central issue desk!",
        timestamp: "2026-10-25T19:00:00Z"
      },
      {
        id: "m-2",
        senderId: "usr-01",
        text: "Oh wow, thank you so much Ananya! That laptop has my entire semester capstone code. You are an absolute lifesaver!",
        timestamp: "2026-10-25T19:05:00Z"
      },
      {
        id: "m-3",
        senderId: "usr-02",
        text: "You're welcome! Just bring your student ID and verify your login password to unlock it when you pick it up.",
        timestamp: "2026-10-25T19:08:00Z"
      },
      {
        id: "m-4",
        senderId: "usr-02",
        text: "Did you manage to collect it from the counter today?",
        timestamp: "2026-10-26T11:20:00Z"
      }
    ]
  },
  {
    id: "msg-thread-02",
    participantId: "usr-03",
    participantName: "Rohan Varma",
    participantAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    participantRole: "Student Council Rep",
    relatedItemId: "FND-202",
    relatedItemTitle: "Fossil Leather Bi-fold Wallet",
    unreadCount: 0,
    lastActivity: "2026-10-26T16:00:00Z",
    messages: [
      {
        id: "m-201",
        senderId: "usr-03",
        text: "Hey Aarav, I matched your lost wallet report with the one I picked up at the canteen juice bar. I have it safe at Room 102.",
        timestamp: "2026-10-26T15:10:00Z"
      },
      {
        id: "m-202",
        senderId: "usr-01",
        text: "That's mine! It has my library barcode on the back of the student card. When can I drop by?",
        timestamp: "2026-10-26T15:20:00Z"
      },
      {
        id: "m-203",
        senderId: "usr-03",
        text: "I am here until 5:30 PM today, or tomorrow morning between 9 AM and 11 AM.",
        timestamp: "2026-10-26T16:00:00Z"
      }
    ]
  }
];

export const mockStats = {
  totalReported: 1482,
  reunitedItems: 1146,
  activeLost: 184,
  activeFound: 152,
  reunionRate: "86.4%",
  averageRecoveryHours: 4.8,
  activeCampuses: 6
};

export const mockTestimonials = [
  {
    quote: "Got my iPad Pro and Apple Pencil back within 2 hours of leaving it in the Audi during convocation rehearsal. The AI match notification was instant!",
    author: "Tanvi Deshmukh",
    dept: "Architecture '25",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    quote: "As a hostel warden, Campus Shield removed all the chaotic WhatsApp group spam. We log found IDs and students collect them securely.",
    author: "Prof. S. Ranganathan",
    dept: "Campus Safety & Hostels",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    quote: "The security question feature is brilliant. You don't have to worry about false claims on expensive engineering gear.",
    author: "Karthik Pillai",
    dept: "Robotics & AI '26",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
  }
];
