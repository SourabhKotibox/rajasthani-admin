import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TalentProfile, PortfolioEntry, CastingCall, User, EventItem } from '@/data/mock';

export type SubscriptionPlan = {
  id: number;
  name: string;
  priceMonthly: number;
  maxEntries: number;
  features: string[];
};

export type RazorpaySettings = {
  enabled: boolean;
  keyId: string;
  keySecret: string;
};

export type SmtpSettings = {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromEmail: string;
  fromName: string;
};

type AuthUser = Omit<User, 'password'>;

export type Inquiry = {
  id: number;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  profileId?: number;
  status: 'new' | 'actioned';
};

export type Application = {
  id: number | string;
  castingCallId: number | string;
  userId: number | string;
  roleAppliedFor: string;
  availability: string;
  coverNote?: string;
  accountPaymentId?: string;
  applicationPaymentId?: string;
  paymentId?: string;
  status: 'submitted' | 'shortlisted' | 'rejected';
  createdAt?: string;
};

export type RcaNotification = {
  id: number | string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'casting' | 'update';
  priority: 'normal' | 'urgent';
  targetRole: 'all' | 'talent' | 'admin';
  createdAt: string;
  createdBy: string;
  readBy: (number | string)[]; // user IDs who have read it
};

export type RcaMessage = {
  id: number | string;
  subject: string;
  body: string;
  senderName: string;
  senderEmail: string;
  toUserId: number | string | 'all' | 'talent' | 'admin'; // specific user id or role broadcast
  createdAt: string;
  readBy: (number | string)[];
};

export type Branding = {
  platformName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  accentColor: string;
  logoShape: 'circle' | 'rounded' | 'square';
};

export type Banner = {
  id: string;
  type: 'homepage_hero' | 'talent_dashboard' | 'casting_banner';
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink?: string;
  castingCallId?: string;
  order?: number;
  visible?: boolean;
};

// CMS types
export type CmsSection = Record<string, unknown> & { visible?: boolean };
export type CmsPages = {
  home?: {
    hero?: CmsSection & { title?: string; subtitle?: string; imageUrl?: string; ctaText?: string; ctaLink?: string; eyebrow?: string; secondaryCtaText?: string };
    stats?: CmsSection & { stat1Value?: string; stat1Label?: string; stat2Value?: string; stat2Label?: string; stat3Value?: string; stat3Label?: string; stat4Value?: string; stat4Label?: string };
    featured?: CmsSection & { eyebrow?: string; title?: string; viewAllText?: string };
    casting?: CmsSection & { eyebrow?: string; title?: string };
    events?: CmsSection & { eyebrow?: string; title?: string; viewAllText?: string };
    works?: CmsSection & { eyebrow?: string; title?: string; moviesVisible?: boolean; tvVisible?: boolean; musicVisible?: boolean; dramaVisible?: boolean };
    cta?: CmsSection & { title?: string; subtitle?: string; ctaText?: string; ctaLink?: string; secondaryCtaText?: string };
    howItWorks?: CmsSection & {
      eyebrow?: string; title?: string;
      step1Title?: string; step1Desc?: string;
      step2Title?: string; step2Desc?: string;
      step3Title?: string; step3Desc?: string;
      step4Title?: string; step4Desc?: string;
      trustPoint1?: string; trustPoint2?: string; trustPoint3?: string; trustPoint4?: string;
    };
    testimonials?: CmsSection & { eyebrow?: string; title?: string };
    seo?: CmsSection & { title?: string; description?: string; keywords?: string; ogImage?: string; canonicalUrl?: string };
  };
  about?: {
    hero?: CmsSection & { title?: string; subtitle?: string; eyebrow?: string; primaryCtaText?: string; secondaryCtaText?: string };
    mission?: CmsSection & { title?: string; body?: string };
    workTypes?: CmsSection & { eyebrow?: string; title?: string };
    team?: CmsSection & { eyebrow?: string; title?: string; members?: { name: string; role: string; photoUrl: string; order: number }[] };
    values?: CmsSection & {
      eyebrow?: string; title?: string;
      val1Title?: string; val1Desc?: string;
      val2Title?: string; val2Desc?: string;
      val3Title?: string; val3Desc?: string;
      val4Title?: string; val4Desc?: string;
    };
  };
  contact?: {
    hero?: CmsSection & { title?: string; subtitle?: string; eyebrow?: string };
    info?: CmsSection & { emailLabel?: string; email?: string; locationLabel?: string; address?: string; phoneLabel?: string; phone?: string; noteText?: string };
    form?: CmsSection & { nameField?: string; emailField?: string; companyField?: string; subjectField?: string; messageField?: string; submitButton?: string; disclaimerText?: string };
  };
  navbar?: {
    links?: CmsSection & { homeLabel?: string; talentLabel?: string; worksLabel?: string; castingLabel?: string; aboutLabel?: string; contactLabel?: string };
    auth?: CmsSection & { loginLabel?: string; joinLabel?: string };
  };
  footer?: {
    ticker?: CmsSection & { text?: string };
    brand?: CmsSection & { subtitle?: string };
    columns?: CmsSection & { col1Title?: string; col2Title?: string; col3Title?: string };
  };
};

/* ======================================================
   AUTH SLICE
====================================================== */
function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

const persistedToken = typeof window !== 'undefined' ? window.localStorage.getItem('auth_token') : null;
const persistedUser = readJson<AuthUser>('auth_user');

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: persistedUser, token: persistedToken as string | null },
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      const { password: _, ...user } = action.payload.user;
      state.user = user;
      state.token = action.payload.token;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('auth_token', action.payload.token);
        window.localStorage.setItem('auth_user', JSON.stringify(user));
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('auth_token');
        window.localStorage.removeItem('auth_user');
      }
    },
    register(state, action: PayloadAction<{ user: User; token: string }>) {
      const { password: _, ...safe } = action.payload.user;
      state.user = safe;
      state.token = action.payload.token;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('auth_token', action.payload.token);
        window.localStorage.setItem('auth_user', JSON.stringify(safe));
      }
    },
    updateAuthUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('auth_user', JSON.stringify(state.user));
        }
      }
    },
  },
});

/* ======================================================
   DATA SLICE
====================================================== */
const dataSlice = createSlice({
  name: 'data',
  initialState: {
    users: [] as User[],
    profiles: [] as TalentProfile[],
    portfolio: [] as PortfolioEntry[],
    casting: [] as CastingCall[],
    events: [] as EventItem[],
    inquiries: [] as Inquiry[],
    applications: [] as Application[],
    myProfileDraft: null as TalentProfile | null,
  },
  reducers: {
    hydrateData(
      state,
      action: PayloadAction<{
        users?: User[];
        profiles?: TalentProfile[];
        portfolio?: PortfolioEntry[];
        casting?: CastingCall[];
        events?: EventItem[];
        inquiries?: Inquiry[];
        applications?: Application[];
      }>,
    ) {
      const p = action.payload;
      if (p.users) state.users = p.users as User[];
      if (p.profiles) state.profiles = p.profiles;
      if (p.portfolio) state.portfolio = p.portfolio;
      if (p.casting) state.casting = p.casting;
      if (p.events) state.events = p.events;
      if (p.inquiries) state.inquiries = p.inquiries;
      if (p.applications) state.applications = p.applications;
    },
    /* --- USERS --- */
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },
    updateUserRole(state, action: PayloadAction<{ id: number | string; role: 'admin' | 'talent' }>) {
      const u = state.users.find(x => x.id === action.payload.id);
      if (u) u.role = action.payload.role;
    },
    deleteUser(state, action: PayloadAction<number | string>) {
      state.users = state.users.filter(u => u.id !== action.payload);
      state.profiles = state.profiles.filter(p => p.id !== action.payload);
      state.portfolio = state.portfolio.filter(p => p.profileId !== action.payload);
      state.applications = state.applications.filter(a => a.userId !== action.payload);
    },

    /* --- PROFILES --- */
    upsertMyProfile(state, action: PayloadAction<TalentProfile>) {
      const idx = state.profiles.findIndex((p) => p.id === action.payload.id);
      if (idx >= 0) state.profiles[idx] = action.payload;
      else state.profiles.push(action.payload);
      state.myProfileDraft = action.payload;
    },
    setProfileStatus(state, action: PayloadAction<{ id: number; status?: TalentProfile['status']; isFeatured?: boolean }>) {
      const p = state.profiles.find((x) => x.id === action.payload.id);
      if (!p) return;
      if (action.payload.status) p.status = action.payload.status;
      if (typeof action.payload.isFeatured === 'boolean') p.isFeatured = action.payload.isFeatured;
    },
    adminUpdateProfile(state, action: PayloadAction<TalentProfile>) {
      const idx = state.profiles.findIndex((p) => p.id === action.payload.id);
      if (idx >= 0) state.profiles[idx] = action.payload;
    },
    deleteProfile(state, action: PayloadAction<number>) {
      state.profiles = state.profiles.filter(p => p.id !== action.payload);
      state.portfolio = state.portfolio.filter(p => p.profileId !== action.payload);
    },

    /* --- PORTFOLIO --- */
    addPortfolio(state, action: PayloadAction<Omit<PortfolioEntry, 'id'>>) {
      state.portfolio.unshift({
        ...action.payload,
        id: Date.now(),
        imageUrl: action.payload.imageUrl || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&auto=format&fit=crop',
      });
    },
    adminUpdatePortfolio(state, action: PayloadAction<PortfolioEntry>) {
      const idx = state.portfolio.findIndex((p) => p.id === action.payload.id);
      if (idx >= 0) state.portfolio[idx] = action.payload;
    },
    removePortfolio(state, action: PayloadAction<number>) {
      state.portfolio = state.portfolio.filter((p) => p.id !== action.payload);
    },

    /* --- CASTING --- */
    addCasting(state, action: PayloadAction<Omit<CastingCall, 'id'>>) {
      state.casting.unshift({
        ...action.payload,
        id: Date.now(),
        imageUrl: action.payload.imageUrl || 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop',
      });
    },
    updateCastingStatus(state, action: PayloadAction<{ id: number; status: 'open' | 'closed' }>) {
      const c = state.casting.find((x) => x.id === action.payload.id);
      if (c) c.status = action.payload.status;
    },
    adminUpdateCasting(state, action: PayloadAction<CastingCall>) {
      const idx = state.casting.findIndex((c) => c.id === action.payload.id);
      if (idx >= 0) state.casting[idx] = action.payload;
    },
    deleteCasting(state, action: PayloadAction<number>) {
      state.casting = state.casting.filter(c => c.id !== action.payload);
      state.applications = state.applications.filter(a => a.castingCallId !== action.payload);
    },

    /* --- EVENTS --- */
    addEvent(state, action: PayloadAction<Omit<EventItem, 'id'>>) {
      state.events.unshift({
        ...action.payload,
        id: Date.now(),
        imageUrl: action.payload.imageUrl || 'https://images.unsplash.com/photo-1511765224389-37f0e75cf1eb?auto=format&fit=crop&q=80&w=1200',
      });
    },
    adminUpdateEvent(state, action: PayloadAction<EventItem>) {
      const idx = state.events.findIndex((e) => String(e.id) === String(action.payload.id));
      if (idx >= 0) state.events[idx] = action.payload;
    },
    deleteEvent(state, action: PayloadAction<number | string>) {
      state.events = state.events.filter(e => String(e.id) !== String(action.payload));
    },

    /* --- INQUIRIES --- */
    addInquiry(state, action: PayloadAction<Omit<Inquiry, 'id' | 'status'>>) {
      state.inquiries.unshift({ ...action.payload, id: Date.now(), status: 'new' });
    },
    actionInquiry(state, action: PayloadAction<number | string>) {
      const row = state.inquiries.find((i) => i.id === action.payload);
      if (row) row.status = 'actioned';
    },
    deleteInquiry(state, action: PayloadAction<number | string>) {
      state.inquiries = state.inquiries.filter(i => i.id !== action.payload);
    },

    /* --- APPLICATIONS --- */
    applyCasting(state, action: PayloadAction<Omit<Application, 'id' | 'status'>>) {
      state.applications.unshift({ ...action.payload, id: Date.now(), status: 'submitted' });
    },
    updateApplicationStatus(state, action: PayloadAction<{ id: number | string; status: Application['status'] }>) {
      const a = state.applications.find(x => x.id === action.payload.id);
      if (a) a.status = action.payload.status;
    },
    deleteApplication(state, action: PayloadAction<number | string>) {
      state.applications = state.applications.filter(a => a.id !== action.payload);
    },
  },
});

/* ======================================================
   NOTIFICATIONS SLICE
====================================================== */
const seedNotifications: RcaNotification[] = [
  {
    id: 1,
    title: 'Welcome to Rajasthan Cine Association Platform!',
    message: 'We\'re excited to have you on board. Complete your profile to get discovered by top productions.',
    type: 'success',
    priority: 'normal',
    targetRole: 'talent',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdBy: 'RCA Admin',
    readBy: [],
  },
  {
    id: 2,
    title: 'New Casting Calls Available',
    message: '6 new casting opportunities have been posted this week. Check the Casting Board to apply.',
    type: 'casting',
    priority: 'normal',
    targetRole: 'talent',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdBy: 'RCA Admin',
    readBy: [],
  },
  {
    id: 3,
    title: 'Platform Update — Enhanced Profiles',
    message: 'You can now add more details to your profile including phone, website, and casting-specific info.',
    type: 'update',
    priority: 'normal',
    targetRole: 'all',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    createdBy: 'RCA Admin',
    readBy: [],
  },
];

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: seedNotifications as RcaNotification[],
  },
  reducers: {
    hydrateNotifications(state, action: PayloadAction<RcaNotification[]>) {
      state.items = action.payload;
    },
    sendNotification(state, action: PayloadAction<Omit<RcaNotification, 'id' | 'createdAt' | 'readBy'>>) {
      state.items.unshift({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        readBy: [],
      });
    },
    markNotificationRead(state, action: PayloadAction<{ notificationId: number | string; userId: number | string }>) {
      const n = state.items.find(x => x.id === action.payload.notificationId);
      if (n && !n.readBy.includes(action.payload.userId)) {
        n.readBy.push(action.payload.userId);
      }
    },
    markAllRead(state, action: PayloadAction<{ userId: number | string; role: 'talent' | 'admin' }>) {
      state.items
        .filter(n => n.targetRole === 'all' || n.targetRole === action.payload.role)
        .forEach(n => {
          if (!n.readBy.includes(action.payload.userId)) {
            n.readBy.push(action.payload.userId);
          }
        });
    },
    deleteNotification(state, action: PayloadAction<number | string>) {
      state.items = state.items.filter(n => n.id !== action.payload);
    },
  },
});

/* ======================================================
   MESSAGES SLICE
====================================================== */
const seedMessages: RcaMessage[] = [
  {
    id: 1,
    subject: 'Welcome to Rajasthan Cine Association — Get Started Guide',
    body: `Dear Talent,\n\nWelcome to Rajasthan Cine Association — India's premier home for film, TV, music, and drama professionals.\n\nHere's how to get started:\n1. Complete your talent profile with a professional photo and bio\n2. Add your portfolio entries (past projects)\n3. Browse and apply to casting calls\n4. Subscribe to a plan to unlock featured listing\n\nWe're excited to help you connect with top productions across the region.\n\nBest regards,\nThe Rajasthan Cine Association Team`,
    senderName: 'Rajasthan Cine Association Admin',
    senderEmail: 'admin@rajasthaniacinema.org',
    toUserId: 'talent',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    readBy: [],
  },
];

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    items: seedMessages as RcaMessage[],
  },
  reducers: {
    hydrateMessages(state, action: PayloadAction<RcaMessage[]>) {
      state.items = action.payload;
    },
    sendMessage(state, action: PayloadAction<Omit<RcaMessage, 'id' | 'createdAt' | 'readBy'>>) {
      state.items.unshift({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        readBy: [],
      });
    },
    markMessageRead(state, action: PayloadAction<{ messageId: number | string; userId: number | string }>) {
      const m = state.items.find(x => x.id === action.payload.messageId);
      if (m && !m.readBy.includes(action.payload.userId)) {
        m.readBy.push(action.payload.userId);
      }
    },
    markAllMessagesRead(state, action: PayloadAction<{ userId: number | string; role: 'talent' | 'admin' }>) {
      state.items
        .filter(m => m.toUserId === 'all' || m.toUserId === action.payload.role || m.toUserId === action.payload.userId)
        .forEach(m => {
          if (!m.readBy.includes(action.payload.userId)) {
            m.readBy.push(action.payload.userId);
          }
        });
    },
    deleteMessage(state, action: PayloadAction<number | string>) {
      state.items = state.items.filter(m => m.id !== action.payload);
    },
  },
});

/* ======================================================
   BRANDING SLICE
====================================================== */
const brandingSlice = createSlice({
  name: 'branding',
  initialState: {
    platformName: 'Rajasthan Cine Association',
    tagline: 'Cinema Association',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#FA931A',
    accentColor: '#FDD9AB',
    logoShape: 'rounded',
  } as Branding,
  reducers: {
    hydrateBranding(_state, action: PayloadAction<Branding>) {
      return action.payload;
    },
    updateBranding(state, action: PayloadAction<Partial<Branding>>) {
      return { ...state, ...action.payload };
    },
    resetBranding() {
      return {
        platformName: 'Rajasthan Cine Association',
        tagline: 'Cinema Association',
        logoUrl: '',
        faviconUrl: '',
        primaryColor: '#FA931A',
        accentColor: '#FDD9AB',
        logoShape: 'rounded',
      };
    },
  },
});

/* ======================================================
   PLANS SLICE
====================================================== */
const plansSlice = createSlice({
  name: 'plans',
  initialState: {
    items: [] as SubscriptionPlan[],
  },
  reducers: {
    hydratePlans(state, action: PayloadAction<SubscriptionPlan[]>) {
      state.items = action.payload;
    },
    addPlan(state, action: PayloadAction<Omit<SubscriptionPlan, 'id'>>) {
      state.items.push({ ...action.payload, id: Date.now() });
    },
    updatePlan(state, action: PayloadAction<SubscriptionPlan>) {
      const idx = state.items.findIndex(p => p.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
    },
    deletePlan(state, action: PayloadAction<number>) {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
  },
});

/* ======================================================
   PAGES (CMS) SLICE
====================================================== */
const pagesSlice = createSlice({
  name: 'pages',
  initialState: {} as CmsPages,
  reducers: {
    hydratePages(_state, action: PayloadAction<CmsPages>) {
      return action.payload;
    },
    updateCmsSection(state, action: PayloadAction<{ page: keyof CmsPages; section: string; data: CmsSection }>) {
      const { page, section, data } = action.payload;
      if (!state[page]) (state as Record<string, unknown>)[page] = {};
      const pageObj = state[page] as Record<string, unknown>;
      pageObj[section] = { ...(pageObj[section] as object || {}), ...data };
    },
    toggleCmsSection(state, action: PayloadAction<{ page: keyof CmsPages; section: string; visible: boolean }>) {
      const { page, section, visible } = action.payload;
      const pageObj = state[page] as Record<string, unknown> | undefined;
      if (pageObj && pageObj[section]) {
        (pageObj[section] as CmsSection).visible = visible;
      }
    },
  },
});

/* ======================================================
   SUBCATEGORIES SLICE
====================================================== */
export type SubcategoryEntry = { category: string; subs: string[] };

const subcategoriesSlice = createSlice({
  name: 'subcategories',
  initialState: [] as SubcategoryEntry[],
  reducers: {
    hydrateSubcategories(_state, action: PayloadAction<SubcategoryEntry[]>) {
      return action.payload;
    },
    updateSubcategoriesState(_state, action: PayloadAction<SubcategoryEntry[]>) {
      return action.payload;
    },
  },
});

/* ======================================================
   BANNERS SLICE
====================================================== */
const bannersSlice = createSlice({
  name: 'banners',
  initialState: {
    homepageHero: {
      id: 'home_1',
      type: 'homepage_hero',
      title: 'Elevate Your Creative Career.',
      subtitle: 'Join Africa\'s most exclusive network of actors, models, and industry professionals. Showcase your talent to the world.',
      imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2000',
      ctaText: 'Join the Network',
      ctaLink: '/register',
    } as Banner,
    castingBanners: [] as Banner[],
  },
  reducers: {
    hydrateBanners(state, action: PayloadAction<{ homepageHero: Banner; castingBanners?: Banner[] }>) {
      state.homepageHero = action.payload.homepageHero;
      if (action.payload.castingBanners) {
        state.castingBanners = action.payload.castingBanners;
      }
    },
    updateHomepageHero(state, action: PayloadAction<Partial<Banner>>) {
      state.homepageHero = { ...state.homepageHero, ...action.payload };
    },
    addCastingBanner(state, action: PayloadAction<Banner>) {
      state.castingBanners.push(action.payload);
    },
    updateCastingBanner(state, action: PayloadAction<{ id: string; data: Partial<Banner> }>) {
      const idx = state.castingBanners.findIndex(b => b.id === action.payload.id);
      if (idx >= 0) {
        state.castingBanners[idx] = { ...state.castingBanners[idx], ...action.payload.data };
      }
    },
    deleteCastingBanner(state, action: PayloadAction<string>) {
      state.castingBanners = state.castingBanners.filter(b => b.id !== action.payload);
    },
  },
});

/* ======================================================
   SETTINGS SLICE
====================================================== */
const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    razorpay: {
      enabled: false,
      keyId: '',
      keySecret: '',
    } as RazorpaySettings,
    smtp: {
      enabled: false,
      host: '',
      port: 587,
      secure: false,
      user: '',
      password: '',
      fromEmail: '',
      fromName: '',
    } as SmtpSettings,
  },
  reducers: {
    hydrateSettings(state, action: PayloadAction<{ razorpay: RazorpaySettings; smtp?: SmtpSettings }>) {
      state.razorpay = action.payload.razorpay;
      if (action.payload.smtp) state.smtp = action.payload.smtp;
    },
    updateRazorpaySettings(state, action: PayloadAction<Partial<RazorpaySettings>>) {
      state.razorpay = { ...state.razorpay, ...action.payload };
    },
    updateSmtpSettings(state, action: PayloadAction<Partial<SmtpSettings>>) {
      state.smtp = { ...state.smtp, ...action.payload };
    },
  },
});

/* ======================================================
   EXPORTS
====================================================== */
export const { login, logout, register, updateAuthUser } = authSlice.actions;
export const {
  hydrateData,
  addUser, updateUserRole, deleteUser,
  upsertMyProfile, setProfileStatus, adminUpdateProfile, deleteProfile,
  addPortfolio, adminUpdatePortfolio, removePortfolio,
   addCasting, updateCastingStatus, adminUpdateCasting, deleteCasting,
   addEvent, adminUpdateEvent, deleteEvent,
  addInquiry, actionInquiry, deleteInquiry,
  applyCasting, updateApplicationStatus, deleteApplication,
} = dataSlice.actions;

export const { hydrateNotifications, sendNotification, markNotificationRead, markAllRead, deleteNotification } = notificationsSlice.actions;
export const { hydrateMessages, sendMessage, markMessageRead, markAllMessagesRead, deleteMessage } = messagesSlice.actions;
export const { hydrateBranding, updateBranding, resetBranding } = brandingSlice.actions;
export const { hydratePlans, addPlan, updatePlan, deletePlan } = plansSlice.actions;
export const { hydrateSettings, updateRazorpaySettings, updateSmtpSettings } = settingsSlice.actions;
export const { hydrateBanners, updateHomepageHero, addCastingBanner, updateCastingBanner, deleteCastingBanner } = bannersSlice.actions;
export const { hydratePages, updateCmsSection, toggleCmsSection } = pagesSlice.actions;
export const { hydrateSubcategories, updateSubcategoriesState } = subcategoriesSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    data: dataSlice.reducer,
    notifications: notificationsSlice.reducer,
    messages: messagesSlice.reducer,
    branding: brandingSlice.reducer,
    plans: plansSlice.reducer,
    settings: settingsSlice.reducer,
    banners: bannersSlice.reducer,
    pages: pagesSlice.reducer,
    subcategories: subcategoriesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
