import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { store } from './store';
import { PublicLayout, AuthLayout, TalentLayout, AdminLayout } from './components/layout/Layouts';
import { useApiBootstrap } from './hooks/use-api-bootstrap';

import Home from './pages/public/Home';
import TalentDir from './pages/public/TalentDir';
import TalentProfile from './pages/public/TalentProfile';
import Works from './pages/public/Works';
import CastingDir from './pages/public/CastingDir';
import CastingDetail from './pages/public/CastingDetail';
import EventDetail from './pages/public/EventDetail';
import EventsList from './pages/public/EventsList';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Membership from './pages/public/Membership';
import Gallery from './pages/public/Gallery';
import GalleryAlbum from './pages/public/GalleryAlbum';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminGallery from './pages/admin/Gallery';
import AdminUsers from './pages/admin/Users';
import AdminProfiles from './pages/admin/Profiles';
import AdminCasting from './pages/admin/Casting';
import AdminInquiries from './pages/admin/Inquiries';
import AdminPortfolio from './pages/admin/Portfolio';
import AdminApplications from './pages/admin/Applications';
import TalentDashboard from './pages/talent/Dashboard';
import TalentProfileEdit from './pages/talent/Profile';
import TalentPortfolio from './pages/talent/Portfolio';
import TalentSubscription from './pages/talent/Subscription';
import TalentApplications from './pages/talent/Applications';
import AdminMail from './pages/admin/Mail';
import AdminNotifications from './pages/admin/Notifications';
import AdminSettings from './pages/admin/Settings';
import AdminPlans from './pages/admin/Plans';
import AdminCMS from './pages/admin/CMS';
import AdminCastingBanners from './pages/admin/CastingBanners';
import AdminEvents from './pages/admin/Events';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminCategories from './pages/admin/Categories';
import AdminMemberships from './pages/admin/Memberships';
import TalentInbox from './pages/talent/Inbox';
import ScrollToTop from './components/ScrollToTop';
import GlobalBrandEffect from './components/GlobalBrandEffect';

function AppRoutes() {
  const { ready, error } = useApiBootstrap();

  if (!ready) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background text-foreground">
        <p className="text-muted-foreground">Loading Rajasthani Cinema Association…</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="bg-primary/10 text-primary text-xs text-center py-1.5 px-3">
          Backend offline — using local data. Start API: <code>cd backend && npm run dev</code>
        </div>
      )}
      <GlobalBrandEffect />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/talent" element={<TalentDir />} />
            <Route path="/talent/:id" element={<TalentProfile />} />
            <Route path="/works/:type" element={<Works />} />
            <Route path="/casting" element={<CastingDir />} />
            <Route path="/casting/:id" element={<CastingDetail />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/event/all" element={<EventsList />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:eventName" element={<GalleryAlbum />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/dashboard" element={<TalentLayout />}>
            <Route index element={<TalentDashboard />} />
            <Route path="profile" element={<TalentProfileEdit />} />
            <Route path="portfolio" element={<TalentPortfolio />} />
            <Route path="subscription" element={<TalentSubscription />} />
            <Route path="casting" element={<TalentApplications />} />
            <Route path="inbox" element={<TalentInbox />} />
          </Route>

          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="profiles" element={<AdminProfiles />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="memberships" element={<AdminMemberships />} />
            <Route path="casting" element={<AdminCasting />} />
            <Route path="casting-banners" element={<AdminCastingBanners />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="mail" element={<AdminMail />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="cms" element={<AdminCMS />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="categories" element={<AdminCategories />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}
