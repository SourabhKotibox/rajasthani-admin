const BASE = '/api';

type Json = Record<string, unknown> | unknown[] | null;

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('auth_token') : null;
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string, details?: string };
  if (!res.ok) {
    const msg = data.error ? (data.details ? `${data.error}: ${data.details}` : data.error) : `[${options.method || 'GET'} ${path}] failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  bootstrap: () => request('/bootstrap'),
  health: () => request('/health'),

  login: (body: Json) =>
    request<{ user: Record<string, unknown>; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body: Json | FormData) =>
    request<{ user: Record<string, unknown>; token: string, membership?: any }>('/auth/register', {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  me: () => request<{ user: Record<string, unknown> }>('/auth/me'),

  upload: (formData: FormData) => request<{ url: string }>('/upload', { method: 'POST', body: formData }),
  uploadPublic: (formData: FormData) => request<{ url: string }>('/upload-public', { method: 'POST', body: formData }),

  getProfiles: (qs = '') => request(`/profiles${qs}`),
  getProfile: (id: number | string) => request(`/profiles/${id}`),
  upsertProfile: (body: { id?: number } & Record<string, unknown>) =>
    body.id
      ? request(`/profiles/${body.id}`, { method: 'PUT', body: JSON.stringify(body) })
      : request('/profiles', { method: 'POST', body: JSON.stringify(body) }),
  setProfileStatus: (id: number | string, body: Json) =>
    request(`/profiles/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteProfile: (id: number | string) => request(`/profiles/${id}`, { method: 'DELETE' }),

  getPortfolio: (qs = '') => request(`/portfolio${qs}`),
  createPortfolio: (body: Json) => request('/portfolio', { method: 'POST', body: JSON.stringify(body) }),
  updatePortfolio: (id: number | string, body: Json) =>
    request(`/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePortfolio: (id: number | string) => request(`/portfolio/${id}`, { method: 'DELETE' }),

  getCasting: (qs = '') => request(`/casting${qs}`),
  getCastingById: (id: number | string) => request(`/casting/${id}`),
  createCasting: (body: Json) => request('/casting', { method: 'POST', body: JSON.stringify(body) }),
  updateCasting: (id: number | string, body: Json) =>
    request(`/casting/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCasting: (id: number | string) => request(`/casting/${id}`, { method: 'DELETE' }),

  getEvents: (qs = '') => request(`/events${qs}`),
  getEventById: (id: number | string) => request(`/events/${id}`),
  createEvent: (body: Json) => request('/events', { method: 'POST', body: JSON.stringify(body) }),
  updateEvent: (id: number | string, body: Json) =>
    request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteEvent: (id: number | string) => request(`/events/${id}`, { method: 'DELETE' }),

  getApplications: (qs = '') => request(`/applications${qs}`),
  applyCasting: (body: Json) => request('/applications', { method: 'POST', body: JSON.stringify(body) }),
  updateApplication: (id: number | string, body: Json) =>
    request(`/applications/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteApplication: (id: number | string) => request(`/applications/${id}`, { method: 'DELETE' }),

  getInquiries: () => request('/inquiries'),
  createInquiry: (body: Json) => request('/inquiries', { method: 'POST', body: JSON.stringify(body) }),
  actionInquiry: (id: number | string) => request(`/inquiries/${id}/action`, { method: 'PATCH' }),
  deleteInquiry: (id: number | string) => request(`/inquiries/${id}`, { method: 'DELETE' }),

  getPublicMemberships: () => request('/memberships/public'),
  getMemberships: () => request('/memberships'),
  createMembership: (body: Json) => request('/memberships', { method: 'POST', body: JSON.stringify(body) }),
  getMembershipById: (id: string | number) => request(`/memberships/${id}`),
  getMyMembership: () => request('/memberships/me'),
  updateMembership: (id: string | number, body: Json) => request(`/memberships/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  getUsers: () => request('/users'),
  updateUserRole: (id: number | string, role: string) =>
    request(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  deleteUser: (id: number | string) => request(`/users/${id}`, { method: 'DELETE' }),

  getPlans: () => request('/plans'),
  createPlan: (body: Json) => request('/plans', { method: 'POST', body: JSON.stringify(body) }),
  updatePlan: (id: number | string, body: Json) =>
    request(`/plans/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePlan: (id: number | string) => request(`/plans/${id}`, { method: 'DELETE' }),
  subscribeToPlan: (planId: number | string) =>
    request('/subscription/subscribe', { method: 'POST', body: JSON.stringify({ planId }) }),

  getNotifications: () => request('/notifications'),
  createNotification: (body: Json) =>
    request('/notifications', { method: 'POST', body: JSON.stringify(body) }),
  markNotificationRead: (id: number | string, userId: number) =>
    request(`/notifications/${id}/read`, { method: 'PATCH', body: JSON.stringify({ userId }) }),
  deleteNotification: (id: number | string) => request(`/notifications/${id}`, { method: 'DELETE' }),

  getMessages: () => request('/messages'),
  createMessage: (body: Json) => request('/messages', { method: 'POST', body: JSON.stringify(body) }),
  markMessageRead: (id: number | string, userId: number) =>
    request(`/messages/${id}/read`, { method: 'PATCH', body: JSON.stringify({ userId }) }),
  deleteMessage: (id: number | string) => request(`/messages/${id}`, { method: 'DELETE' }),

  getBranding: () => request('/branding'),
  updateBranding: (body: Json) => request('/branding', { method: 'PUT', body: JSON.stringify(body) }),

  getBanners: () => request('/banners'),
  updateHomepageHero: (body: Json) =>
    request('/banners/homepage-hero', { method: 'PUT', body: JSON.stringify(body) }),
  addCastingBanner: (body: Json) =>
    request('/banners/casting', { method: 'POST', body: JSON.stringify(body) }),
  updateCastingBanner: (id: string, body: Json) =>
    request(`/banners/casting/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCastingBanner: (id: string) =>
    request(`/banners/casting/${id}`, { method: 'DELETE' }),

  getSettings: () => request('/settings'),
  updateSettings: (body: Json) => request('/settings', { method: 'PUT', body: JSON.stringify(body) }),
  updateAdminCredentials: (body: Json) => request('/admin/credentials', { method: 'PUT', body: JSON.stringify(body) }),

  getSmtpSettings: () => request('/settings/smtp'),
  updateSmtpSettings: (body: Json) => request('/settings/smtp', { method: 'PUT', body: JSON.stringify(body) }),
  testSmtpEmail: (body: Json) => request('/settings/smtp/test', { method: 'POST', body: JSON.stringify(body) }),

  getPages: () => request('/pages'),
  updatePageSection: (page: string, section: string, body: Json) =>
    request(`/pages/${page}/${section}`, { method: 'PUT', body: JSON.stringify(body) }),
  togglePageSection: (page: string, section: string) =>
    request(`/pages/${page}/${section}/visibility`, { method: 'PATCH' }),

  adminStats: () => request<{
    users: number;
    featured: number;
    pending: number;
    openCasting: number;
    applications: number;
    newInquiries: number;
  }>('/admin/stats'),

  getGallery: () => request<any[]>('/gallery'),
  createGalleryItem: (body: Json) => request('/gallery', { method: 'POST', body: JSON.stringify(body) }),
  updateGalleryItem: (id: string, body: Json) => request(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteGalleryItem: (id: string) => request(`/gallery/${id}`, { method: 'DELETE' }),

  getTestimonials: () => request<any[]>('/testimonials'),
  createTestimonial: (body: Json) => request('/testimonials', { method: 'POST', body: JSON.stringify(body) }),
  updateTestimonial: (id: number | string, body: Json) =>
    request(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteTestimonial: (id: number | string) =>
    request(`/testimonials/${id}`, { method: 'DELETE' }),

  createOrder: (body: Json) => request('/payments/create-order', { method: 'POST', body: JSON.stringify(body) }),
  verifyPayment: (body: Json) => request('/payments/verify', { method: 'POST', body: JSON.stringify(body) }),

  getSubcategories: () => request<{ category: string; subs: string[] }[]>('/subcategories'),
  updateSubcategories: (subcategories: { category: string; subs: string[] }[]) =>
    request('/subcategories', { method: 'PUT', body: JSON.stringify({ subcategories }) }),
};
