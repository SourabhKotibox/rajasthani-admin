import { useEffect, useState } from 'react';
import { api } from '@/api/client';
import {
  useAppDispatch,
  useAppSelector,
  hydrateData,
  hydrateNotifications,
  hydrateMessages,
  hydrateBranding,
  hydratePlans,
  hydrateBanners,
  hydrateSettings,
  hydratePages,
  hydrateSubcategories,
  login as loginAction,
  logout,
  updateSmtpSettings,
  type Inquiry,
  type Application,
  type RcaNotification,
  type RcaMessage,
  type Branding,
  type SubscriptionPlan,
  type Banner,
  type RazorpaySettings,
  type SmtpSettings,
  type CmsPages,
  type SubcategoryEntry,
} from '@/store';
import type { User, TalentProfile, PortfolioEntry, CastingCall, EventItem } from '@/data/mock';

type BootstrapPayload = {
  users?: User[];
  profiles: TalentProfile[];
  portfolio: PortfolioEntry[];
  casting: CastingCall[];
  events?: EventItem[];
  inquiries?: Inquiry[];
  applications?: Application[];
  plans: SubscriptionPlan[];
  notifications: RcaNotification[];
  messages: RcaMessage[];
  branding: Branding;
  banners: { homepageHero: Banner };
  pages?: CmsPages;
  settings?: { razorpay: RazorpaySettings; smtp?: SmtpSettings };
  smtp?: SmtpSettings;
  testimonials?: { id: number | string; quote: string; authorName: string; authorRole: string; authorPhoto: string; visible: boolean; order: number }[];
  subcategories?: SubcategoryEntry[];
};

export function useApiBootstrap() {
  const dispatch = useAppDispatch();
  const authToken = useAppSelector((s) => s.auth.token);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Step 1: If we have a token stored but no user in Redux (page refresh),
        // restore the session by calling /auth/me first.
        const storedToken = typeof window !== 'undefined' ? window.localStorage.getItem('auth_token') : null;
        const storedUserRaw = typeof window !== 'undefined' ? window.localStorage.getItem('auth_user') : null;

        if (storedToken && !storedUserRaw) {
          // Token exists but user is not in localStorage — try to restore from API
          try {
            const { user } = await api.me();
            if (!cancelled) {
              dispatch(loginAction({ user, token: storedToken } as never));
            }
          } catch {
            // Token expired or invalid — clear it
            if (!cancelled) dispatch(logout());
          }
        } else if (storedToken && storedUserRaw) {
          // Both exist — validate token is still good in the background
          api.me().catch(() => {
            if (!cancelled) dispatch(logout());
          });
        }

        // Step 2: Bootstrap the app data
        const data = await api.bootstrap() as BootstrapPayload;
        if (cancelled) return;

        dispatch(
          hydrateData({
            ...(data.users ? { users: data.users } : {}),
            profiles: data.profiles,
            portfolio: data.portfolio,
            casting: data.casting,
            ...(data.events ? { events: data.events } : {}),
            ...(data.inquiries ? { inquiries: data.inquiries } : {}),
            ...(data.applications ? { applications: data.applications } : {}),
          }),
        );
        dispatch(hydrateNotifications(data.notifications));
        dispatch(hydrateMessages(data.messages));
        dispatch(hydrateBranding(data.branding));
        dispatch(hydratePlans(data.plans));
        dispatch(hydrateBanners(data.banners));
        if (data.settings) {
          dispatch(hydrateSettings(data.settings));
        }
        if (data.smtp) {
          dispatch(updateSmtpSettings(data.smtp));
        }
        if (data.pages) dispatch(hydratePages(data.pages));
        if (data.subcategories) dispatch(hydrateSubcategories(data.subcategories));
        setReady(true);
      } catch (e) {
        if (cancelled) return;
        console.warn('API bootstrap failed, using local mock data', e);
        setError(e instanceof Error ? e.message : 'API unavailable');
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  // Re-run bootstrap when the user logs in (token changes) to get user-specific data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, authToken]);

  return { ready, error };
}
