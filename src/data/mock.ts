export type ProjectType = 'Movie' | 'TVSeries' | 'MusicVideo' | 'ShortDrama';

export type TalentProfile = {
  id: number;
  userId?: string | number;
  displayName: string;
  stageName?: string;
  photoUrl: string;
  categories: string[];
  yearsOfExperience: number;
  location: string;
  bio: string;
  skills: string[];
  languages: string[];
  instagramUrl?: string;
  youtubeUrl?: string;
  imdbUrl?: string;
  phone?: string;
  website?: string;
  gender?: 'Male' | 'Female' | 'Non-Binary' | 'Prefer Not to Say';
  height?: number; // cm
  age?: number;
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
};

export type PortfolioEntry = {
  id: number;
  profileId: number;
  projectTitle: string;
  projectType: ProjectType;
  role: string;
  productionHouse?: string;
  releaseYear?: number;
  platform?: string;
  description?: string;
  imageUrl: string;
  visible?: boolean;
};

export type CastingCall = {
  id: number;
  projectTitle: string;
  projectType: ProjectType;
  roles: string[];
  rolesDescription: string;
  eligibilityCriteria: string;
  deadline: string;
  productionHouse: string;
  applicationFee: number;
  status: 'open' | 'closed';
  imageUrl: string;
};

export type Application = {
  id: number | string;
  castingCallId: number | string;
  userId: number | string;
  roleAppliedFor: string;
  availability: string;
  coverNote: string;
  accountPaymentId?: string;
  applicationPaymentId?: string;
  paymentId?: string;
  status: 'submitted' | 'shortlisted' | 'rejected';
  createdAt?: string;
};

export type User = {
  id: number | string;
  email: string;
  fullName: string;
  role: 'talent' | 'admin';
  password?: string;
  planId?: string | number;
};

export const users: User[] = [
  { id: 1, email: 'admin@rajasthaniacinema.org', fullName: 'RCA Admin', role: 'admin', password: 'password123' },
  { id: 2, email: 'amara@example.com', fullName: 'Amara Okello', role: 'talent', password: 'password123' },
  { id: 3, email: 'james@example.com', fullName: 'James Mwangi', role: 'talent', password: 'password123' },
  { id: 4, email: 'zuri@example.com', fullName: 'Zuri Achieng', role: 'talent', password: 'password123' },
  { id: 5, email: 'david@example.com', fullName: 'David Kamau', role: 'talent', password: 'password123' },
];

export const profiles: TalentProfile[] = [
  {
    id: 1,
    displayName: 'Amara Okello',
    stageName: 'Amara O.',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop',
    categories: ['Actor', 'Writer'],
    yearsOfExperience: 8,
    location: 'Jaipur, Rajasthan',
    bio: 'Award-winning actor and screenwriter known for lead roles in Indian cinema and streaming dramas.',
    skills: ['Drama', 'Comedy', 'Improvisation'],
    languages: ['English', 'Swahili'],
    instagramUrl: 'https://instagram.com',
    youtubeUrl: 'https://youtube.com',
    imdbUrl: 'https://imdb.com',
    status: 'approved',
    isFeatured: true,
  },
  {
    id: 2,
    displayName: 'James Mwangi',
    stageName: 'J. Mwangi',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop',
    categories: ['Director', 'Producer'],
    yearsOfExperience: 12,
    location: 'Udaipur, Rajasthan',
    bio: 'Director and producer focused on socially driven feature films and music video storytelling.',
    skills: ['Feature Film', 'Music Videos', 'Documentary'],
    languages: ['English', 'Luganda'],
    status: 'approved',
    isFeatured: true,
  },
  {
    id: 3,
    displayName: 'Zuri Achieng',
    stageName: 'Zuri',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c17226555e?w=800&auto=format&fit=crop',
    categories: ['Cinematographer', 'Editor'],
    yearsOfExperience: 6,
    location: 'Jodhpur, Rajasthan',
    bio: 'Cinematographer and editor crafting visual language for commercials, shorts, and OTT series.',
    skills: ['Handheld', 'Color Grading', 'Narrative'],
    languages: ['English', 'Swahili'],
    status: 'approved',
    isFeatured: true,
  },
  {
    id: 4,
    displayName: 'David Kamau',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
    categories: ['Music Video Artist', 'Editor'],
    yearsOfExperience: 4,
    location: 'Jaisalmer, Rajasthan',
    bio: 'Music video artist blending folk aesthetics with sharp editorial pacing.',
    skills: ['Music Videos', 'Motion Graphics'],
    languages: ['English', 'Swahili'],
    status: 'approved',
    isFeatured: true,
  },
];

export const portfolio: PortfolioEntry[] = [
  { id: 1, profileId: 1, projectTitle: 'Nairobi Nights', projectType: 'Movie', role: 'Lead Actor', productionHouse: 'Savannah Films', releaseYear: 2023, platform: 'Theatrical', description: 'Lead performance in a neo-noir crime drama.', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&auto=format&fit=crop' },
  { id: 2, profileId: 1, projectTitle: 'Safari Stories', projectType: 'TVSeries', role: 'Supporting Actor', productionHouse: 'EastStream', releaseYear: 2022, platform: 'OTT', description: 'Recurring role across season 2.', imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=900&auto=format&fit=crop' },
  { id: 3, profileId: 2, projectTitle: 'Dust & Glory', projectType: 'Movie', role: 'Director', productionHouse: 'Horizon Pictures', releaseYear: 2024, platform: 'Theatrical', description: 'Directed a festival-circuit drama.', imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=900&auto=format&fit=crop' },
  { id: 4, profileId: 2, projectTitle: 'AfroBeats Live', projectType: 'MusicVideo', role: 'Director', productionHouse: 'Pulse Label', releaseYear: 2023, platform: 'YouTube', description: 'Directed chart-topping music video.', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&auto=format&fit=crop' },
  { id: 5, profileId: 3, projectTitle: 'Harbour Lights', projectType: 'ShortDrama', role: 'Director of Photography', productionHouse: 'Indie Collective', releaseYear: 2024, platform: 'Festival', description: 'Shot award-winning short drama.', imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=900&auto=format&fit=crop' },
  { id: 6, profileId: 3, projectTitle: 'City Pulse', projectType: 'TVSeries', role: 'Editor', productionHouse: 'Coastal Media', releaseYear: 2023, platform: 'TV', description: 'Lead editor for 8-episode season.', imageUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=900&auto=format&fit=crop' },
  { id: 7, profileId: 4, projectTitle: 'Golden Hour', projectType: 'MusicVideo', role: 'Director', productionHouse: 'Wave Records', releaseYear: 2024, platform: 'YouTube', description: 'Directed visual album single.', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop' },
  { id: 8, profileId: 1, projectTitle: 'River Song', projectType: 'ShortDrama', role: 'Lead Actor', productionHouse: 'Indie Collective', releaseYear: 2021, platform: 'Festival', description: 'Intimate riverside short.', imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=900&auto=format&fit=crop' },
  { id: 9, profileId: 4, projectTitle: 'Night Market', projectType: 'Movie', role: 'Editor', productionHouse: 'Coastal Media', releaseYear: 2023, platform: 'OTT', description: 'Edited urban thriller feature.', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&auto=format&fit=crop' },
  { id: 10, profileId: 2, projectTitle: 'Kinship S1', projectType: 'TVSeries', role: 'Producer', productionHouse: 'EastStream', releaseYear: 2024, platform: 'OTT', description: 'Produced family drama pilot season.', imageUrl: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=900&auto=format&fit=crop' },
];

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const castingCalls: CastingCall[] = [
  {
    id: 1,
    projectTitle: 'Lake Victoria',
    projectType: 'Movie',
    roles: ['Lead Actress', 'Supporting Actor'],
    rolesDescription: 'Seeking lead and supporting roles for a contemporary drama set around Lake Victoria.',
    eligibilityCriteria: 'Age 22-35, Rajasthan based, previous screen credit preferred.',
    deadline: daysFromNow(30),
    productionHouse: 'Blue Horizon Studios',
    applicationFee: 500,
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    projectTitle: 'Rhythm City Remix',
    projectType: 'MusicVideo',
    roles: ['Dancer', 'Featured Extra'],
    rolesDescription: 'High-energy music video needing dancers and featured extras.',
    eligibilityCriteria: 'Age 18-30, dance experience required for dancer role.',
    deadline: daysFromNow(14),
    productionHouse: 'Pulse Label',
    applicationFee: 0,
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop',
  },
  {
    id: 3,
    projectTitle: 'Series Pilot: Kinship',
    projectType: 'TVSeries',
    roles: ['Series Regular', 'Guest Star'],
    rolesDescription: 'Pilot for a multi-generational family drama.',
    eligibilityCriteria: 'Age 25-50, fluent English and Swahili a plus.',
    deadline: daysFromNow(45),
    productionHouse: 'EastStream Originals',
    applicationFee: 750,
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&auto=format&fit=crop',
  },
  {
    id: 4,
    projectTitle: 'Whispers at Dawn',
    projectType: 'ShortDrama',
    roles: ['Lead', 'Supporting'],
    rolesDescription: 'Festival short drama seeking intimate performances.',
    eligibilityCriteria: 'Age 20-40, theatre or short-film experience.',
    deadline: daysFromNow(21),
    productionHouse: 'Indie Collective',
    applicationFee: 200,
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop',
  },
  {
    id: 5,
    projectTitle: 'Savannah Echoes',
    projectType: 'Movie',
    roles: ['Supporting Actress', 'Child Actor'],
    rolesDescription: 'Period drama set across the savannah plains.',
    eligibilityCriteria: 'Age 8-40, strong dramatic range.',
    deadline: daysFromNow(40),
    productionHouse: 'Horizon Pictures',
    applicationFee: 400,
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&auto=format&fit=crop',
  },
  {
    id: 6,
    projectTitle: 'Pulse Drop',
    projectType: 'MusicVideo',
    roles: ['Lead Performer'],
    rolesDescription: 'Afrobeats visual needing a charismatic lead performer.',
    eligibilityCriteria: 'Age 18-28, camera presence required.',
    deadline: daysFromNow(10),
    productionHouse: 'Wave Records',
    applicationFee: 300,
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&auto=format&fit=crop',
  },
];

export const plans = [
  { id: 1, name: 'Starter', priceMonthly: 1500, maxEntries: 10, features: ['Up to 10 portfolio entries', 'Public profile', 'Casting applications'] },
  { id: 2, name: 'Pro', priceMonthly: 3500, maxEntries: 50, features: ['Up to 50 entries', 'Featured eligibility', 'Priority casting'] },
  { id: 3, name: 'Elite', priceMonthly: 7000, maxEntries: 200, features: ['Unlimited entries', 'Priority featuring', 'Dedicated support'] },
];

export const WORK_TYPES: { slug: string; label: string; apiType: ProjectType; img: string }[] = [
  { slug: 'movies', label: 'Movies', apiType: 'Movie', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop' },
  { slug: 'tv-series', label: 'TV Series', apiType: 'TVSeries', img: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop' },
  { slug: 'music-videos', label: 'Music Videos', apiType: 'MusicVideo', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop' },
  { slug: 'short-dramas', label: 'Short Dramas', apiType: 'ShortDrama', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop' },
];

/* ===================================================================
   EVENTS (Fashion Shows / Talent Shows) — shown in home page sliders
   ================================================================== */
export type EventItem = {
  id: number | string;
  title: string;
  eventType: string;
  projectType: ProjectType;
  productionHouse: string;
  roles: string[];
  rolesDescription: string;
  description: string;
  eligibilityCriteria: string;
  applicationFee: number;
  deadline: string;
  eventDate: string;
  location: string;
  imageUrl: string;
  status: 'active' | 'inactive';
  visible: boolean;
  order?: number;
};

export const EVENT_TYPES = ['Fashion Show', 'Talent Show'] as const;

export const events: EventItem[] = [
  {
    id: 1,
    title: 'Jaipur Fashion Week',
    eventType: 'Fashion Show',
    projectType: 'MusicVideo',
    productionHouse: 'Rajasthani Studios',
    roles: ['Runway Model', 'Backstage Assistant', 'Production Assistant'],
    rolesDescription: 'Join us for Jaipur Fashion Week — models and crew needed across runway shows and backstage production.',
    description: 'Rajasthan\'s premier fashion showcase featuring top designers and 200+ models across 3 days.',
    eligibilityCriteria: 'Age 18-35, 5\'5"+ preferred for runway. Portfolio of previous work encouraged.',
    applicationFee: 500,
    deadline: '2026-10-20',
    eventDate: '2026-11-15',
    location: 'Jaipur, Rajasthan',
    imageUrl: 'https://images.unsplash.com/photo-1511765224389-37f0e75cf1eb?auto=format&fit=crop&q=80&w=1200',
    status: 'active',
    visible: true,
    order: 0,
  },
  {
    id: 2,
    title: 'Jaipur Style Fashion Showcase',
    eventType: 'Fashion Show',
    projectType: 'MusicVideo',
    productionHouse: 'Rajasthani Entertainment',
    roles: ['Lead Model', 'Extra', 'Stylist Assistant'],
    rolesDescription: 'A vibrant showcase of Rajasthani fashion and culture on the runway.',
    description: 'A star-studded fashion showcase celebrating Rajasthani design and talent.',
    eligibilityCriteria: 'Age 18-30, confident presence on camera.',
    applicationFee: 300,
    deadline: '2026-11-01',
    eventDate: '2026-12-05',
    location: 'Jaipur, Rajasthan',
    imageUrl: 'https://images.unsplash.com/photo-1539139394092-9583bb5d0369?auto=format&fit=crop&q=80&w=1200',
    status: 'active',
    visible: true,
    order: 1,
  },
  {
    id: 3,
    eventType: 'Fashion Show',
    title: 'Dakar Couture Week',
    projectType: 'Movie',
    productionHouse: 'West African Productions',
    roles: ['Fashion Model', 'Host', 'Crew Member'],
    rolesDescription: 'Regional fashion week seeking models and production crew for televised coverage.',
    description: 'Three days of haute couture and emerging West African designers.',
    eligibilityCriteria: 'Must be available for full coverage week. Age 18-40.',
    applicationFee: 750,
    deadline: '2026-11-15',
    eventDate: '2026-12-20',
    location: 'Dakar, Senegal',
    imageUrl: 'https://images.unsplash.com/photo-1562157874507-a5f3b3a9de7c?auto=format&fit=crop&q=80&w=1200',
    status: 'active',
    visible: true,
    order: 2,
  },
  {
    id: 4,
    title: 'Rajasthan Talent Show',
    eventType: 'Talent Show',
    projectType: 'TVSeries',
    productionHouse: 'RajasthaniStream Originals',
    roles: ['Contestant Performer', 'Stage Assistant', 'Audience Member'],
    rolesDescription: 'Live televised talent competition. Performers, stage crew and audience members wanted.',
    description: 'A televised talent competition searching for the next big star across Rajasthan.',
    eligibilityCriteria: 'Age 16+, any discipline. Performance reel recommended.',
    applicationFee: 0,
    deadline: '2026-12-30',
    eventDate: '2027-01-15',
    location: 'Jaipur, Rajasthan',
    imageUrl: 'https://images.unsplash.com/photo-1519452635957-f6f5b9c6f9d4?auto=format&fit=crop&q=80&w=1200',
    status: 'active',
    visible: true,
    order: 0,
  },
];
