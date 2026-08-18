import { Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout, markAllRead } from '@/store';
import {
  Menu, X, LogOut, User, ChevronDown, Film, Tv, Music, Drama,
  LayoutDashboard, Settings, Briefcase, Star, BarChart3, MessageSquare,
  Users, Clapperboard, Bell, Search, ChevronRight, TrendingUp,
  Shield, Zap, Home, Sparkles, PanelLeftClose, PanelLeftOpen, Mail, Check, LayoutTemplate, LayoutPanelLeft, Tag, UserCheck
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { WORK_TYPES } from '@/data/mock';

/* ===================================================================
   LAYOUTS
=================================================================== */
export function PublicLayout() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function AuthLayout() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Outlet />
    </div>
  );
}

/* ===================================================================
   TALENT LAYOUT — polished side nav
=================================================================== */
export function TalentLayout() {
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();
  
  // Unread messages
  const allMessages = useAppSelector(s => s.messages.items);
  const unreadMessages = useMemo(() => {
    if (!user) return 0;
    return allMessages.filter(m => 
      (m.toUserId === 'all' || m.toUserId === user.role || m.toUserId === user.id) &&
      !m.readBy.includes(user.id)
    ).length;
  }, [allMessages, user]);

  if (!user || user.role !== 'talent') return <Navigate to="/login" replace />;

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { name: 'My Profile', path: '/dashboard/profile', icon: <User size={16} /> },
    { name: 'Portfolio', path: '/dashboard/portfolio', icon: <Briefcase size={16} /> },
    { name: 'Subscription', path: '/dashboard/subscription', icon: <Star size={16} /> },
    { name: 'Applications', path: '/dashboard/casting', icon: <Clapperboard size={16} /> },
    { name: 'Inbox', path: '/dashboard/inbox', icon: <Mail size={16} />, badge: unreadMessages },
  ];

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--color-background)' }}>
      <Navbar />
      <div style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '2rem 1.25rem', display: 'flex', gap: '2rem' }}>
        {/* Sidebar */}
        <aside className="talent-sidebar">
          <div className="talent-sidebar-user">
            <div className="talent-sidebar-avatar">{user.fullName.charAt(0)}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.fullName}</div>
              <span className="badge badge-success" style={{ marginTop: '0.25rem' }}>Active</span>
            </div>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className={`sidenav-link ${active ? 'active' : ''}`}>
                  <span style={{ flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <span style={{ background: 'var(--color-danger)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: 99 }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   ADMIN LAYOUT — premium collapsible sidebar
=================================================================== */
export function AdminLayout() {
  const user = useAppSelector((s) => s.auth.user);
  const branding = useAppSelector((s) => s.branding);
  const notifications = useAppSelector((s) => s.notifications.items);
  const dispatch = useAppDispatch();
  const location = useLocation();
  
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const unreadNotifs = notifications.filter(n => (n.targetRole === 'all' || n.targetRole === 'admin') && !n.readBy.includes(user.id));

  const navGroups = [
    {
      label: 'Overview',
      items: [
        { name: 'Dashboard', path: '/admin', icon: <BarChart3 size={18} /> },
      ],
    },
    {
      label: 'Platform Data',
      items: [
        { name: 'Users', path: '/admin/users', icon: <Users size={18} /> },
        { name: 'Profiles', path: '/admin/profiles', icon: <User size={18} /> },
        { name: 'Memberships', path: '/admin/memberships', icon: <UserCheck size={18} /> },
        { name: 'Portfolios', path: '/admin/portfolio', icon: <Briefcase size={18} /> },
      ],
    },
    {
      label: 'Casting',
      items: [
        { name: 'Casting Calls', path: '/admin/casting', icon: <Clapperboard size={18} /> },
        { name: 'Events & Sliders', path: '/admin/events', icon: <LayoutPanelLeft size={18} /> },
        { name: 'Applications', path: '/admin/applications', icon: <Star size={18} /> },
      ],
    },
    {
      label: 'Communications',
      items: [
        { name: 'Inquiries', path: '/admin/inquiries', icon: <MessageSquare size={18} /> },
        { name: 'Mail Center', path: '/admin/mail', icon: <Mail size={18} /> },
        { name: 'Notifications', path: '/admin/notifications', icon: <Bell size={18} /> },
      ],
    },
    {
      label: 'System',
      items: [
        { name: 'CMS / Pages', path: '/admin/cms', icon: <LayoutTemplate size={18} /> },
        { name: 'Testimonials', path: '/admin/testimonials', icon: <Users size={18} /> },
        { name: 'Categories', path: '/admin/categories', icon: <Tag size={18} /> },
        { name: 'Subscriptions', path: '/admin/plans', icon: <Star size={18} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
      ],
    },
  ];

  const allItems = navGroups.flatMap(g => g.items);
  const currentPage = allItems.find(i => location.pathname === i.path);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`admin-layout ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="admin-mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-visible' : ''}`}>
        {/* Brand */}
        <div className="admin-sidebar-brand">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', overflow: 'hidden' }}>
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="" className="admin-brand-icon" style={{ padding: 0, width: 'auto', maxWidth: 100, height: 32, objectFit: 'contain' }} />
            ) : (
              <div className="admin-brand-icon">{branding.platformName.charAt(0)}</div>
            )}
          </Link>
          <button
            className="admin-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="admin-sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.label} className="admin-nav-group">
              {!collapsed && (
                <div className="admin-nav-group-label">{group.label}</div>
              )}
              {group.items.map(item => (
                <div key={item.path} className="admin-nav-item-wrapper" title={collapsed ? item.name : undefined}>
                  <Link
                    to={item.path}
                    className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="admin-nav-icon">{item.icon}</span>
                    {!collapsed && <span className="admin-nav-label">{item.name}</span>}
                    {!collapsed && isActive(item.path) && (
                      <span className="admin-nav-active-dot" />
                    )}
                  </Link>
                  {collapsed && (
                    <div className="admin-nav-tooltip">{item.name}</div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="admin-sidebar-footer">
          {!collapsed && (
            <div className="admin-sidebar-user-card">
              <div className="admin-user-avatar">{user.fullName.charAt(0)}</div>
              <div className="admin-user-info">
                <div className="admin-user-name">{user.fullName}</div>
                <div className="admin-user-role">Administrator</div>
              </div>
            </div>
          )}
          <button
            onClick={() => dispatch(logout())}
            className="admin-logout-btn"
            title="Sign out"
          >
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          {/* Left: hamburger (mobile) + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="admin-hamburger" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="admin-breadcrumb">
              <span className="admin-breadcrumb-root">
                <Shield size={14} /> Admin
              </span>
              <ChevronRight size={13} className="admin-breadcrumb-sep" />
              <span className="admin-breadcrumb-current">
                {currentPage?.name || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right: search + bell + user */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Search */}
            <div className={`admin-search-wrap ${searchOpen ? 'open' : ''}`}>
              {searchOpen && (
                <input
                  autoFocus
                  className="admin-search-input"
                  placeholder="Search pages, users..."
                  onBlur={() => setSearchOpen(false)}
                />
              )}
              <button
                className="admin-topbar-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                title="Search"
              >
                <Search size={17} />
              </button>
            </div>

            {/* Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                className={`admin-topbar-btn ${bellOpen ? 'active' : ''}`} 
                onClick={() => setBellOpen(!bellOpen)}
                title="Notifications"
              >
                <Bell size={17} />
                {unreadNotifs.length > 0 && <span className="admin-notification-dot" />}
              </button>

              {bellOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setBellOpen(false)} />
                  <div className="animate-slide-down" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '320px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden' }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-card)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</div>
                      {unreadNotifs.length > 0 && (
                        <button onClick={() => dispatch(markAllRead({ userId: user.id, role: 'admin' }))} style={{ fontSize: '0.75rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Check size={12} /> Mark all read
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                      {unreadNotifs.length === 0 ? (
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-muted-foreground)', fontSize: '0.85rem' }}>No new notifications</div>
                      ) : (
                        unreadNotifs.slice(0, 5).map(n => (
                          <div key={n.id} style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', marginTop: '0.35rem', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>{n.title}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.message}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <Link to="/admin/notifications" onClick={() => setBellOpen(false)} style={{ display: 'block', padding: '0.75rem', textAlign: 'center', background: 'var(--color-card)', borderTop: '1px solid var(--color-border)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', textDecoration: 'none' }}>
                      View all notifications
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div className="admin-topbar-divider" />

            {/* User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.2 }}>{user.fullName}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-muted-foreground)' }}>Administrator</div>
              </div>
              <div className="admin-topbar-avatar">{user.fullName.charAt(0)}</div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

/* ===================================================================
   NAVBAR — glassmorphism premium redesign
=================================================================== */
const WORK_ICONS: Record<string, React.ReactNode> = {
  movies: <Film size={14} />,
  'tv-series': <Tv size={14} />,
  'music-videos': <Music size={14} />,
  'short-dramas': <Drama size={14} />,
};

function Navbar() {
  const { user } = useAppSelector((s) => s.auth);
  const branding = useAppSelector((s) => s.branding);
  const notifications = useAppSelector((s) => s.notifications.items);
  const navbar = useAppSelector((s) => s.pages?.navbar);
  const worksData = useAppSelector((s) => s.pages?.home?.works || {});
  const dispatch = useAppDispatch();
  const location = useLocation();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [worksOpen, setWorksOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const worksRef = useRef<HTMLDivElement>(null);
  
  const portfolio = useAppSelector((s) => s.data.portfolio);
  const profiles = useAppSelector((s) => s.data.profiles.filter((p) => p.isFeatured && p.status === 'approved'));

  const visibleWorkTypes = useMemo(() => {
    return WORK_TYPES.filter((w) => {
      if (w.slug === 'movies') return worksData.moviesVisible !== false && String(worksData.moviesVisible) !== 'false' && profiles.some(p => portfolio.some(e => e.profileId === p.id && e.projectType === w.apiType && e.visible !== false));
      if (w.slug === 'tv-series') return worksData.tvVisible !== false && String(worksData.tvVisible) !== 'false' && profiles.some(p => portfolio.some(e => e.profileId === p.id && e.projectType === w.apiType && e.visible !== false));
      if (w.slug === 'music-videos') return worksData.musicVisible !== false && String(worksData.musicVisible) !== 'false' && profiles.some(p => portfolio.some(e => e.profileId === p.id && e.projectType === w.apiType && e.visible !== false));
      if (w.slug === 'short-dramas') return worksData.dramaVisible !== false && String(worksData.dramaVisible) !== 'false' && profiles.some(p => portfolio.some(e => e.profileId === p.id && e.projectType === w.apiType && e.visible !== false));
      return true;
    });
  }, [worksData, portfolio, profiles]);

  const unreadNotifs = user ? notifications.filter(n => (n.targetRole === 'all' || n.targetRole === user.role) && !n.readBy.includes(user.id)) : [];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setWorksOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (worksRef.current && !worksRef.current.contains(e.target as Node)) {
        setWorksOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isWorksActive = location.pathname.startsWith('/works');

  const navLinksVisible = navbar?.links?.visible !== false;
  const authBtnsVisible = navbar?.auth?.visible !== false;

  return (
    <header className={`rca-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="rca-navbar-inner">
        {/* Logo */}
        <Link to="/" className="rca-navbar-logo">
          {branding.logoUrl ? (
            <img src={branding.logoUrl} alt="" style={{ height: 32, width: 'auto', maxWidth: 100, objectFit: 'contain' }} />
          ) : (
            <div className="rca-logo-mark">{branding.platformName.charAt(0)}</div>
          )}
        </Link>

        {/* Desktop Nav */}
        {navLinksVisible && (
          <nav className="rca-navbar-links">
            <NavLink to="/" label={navbar?.links?.homeLabel || 'Home'} icon={<Home size={13} />} active={location.pathname === '/'} />
            <NavLink to="/talent" label={navbar?.links?.talentLabel && navbar.links.talentLabel !== 'Talent' ? navbar.links.talentLabel : 'Talent/Members'} icon={<Sparkles size={13} />} active={location.pathname.startsWith('/talent')} />

          {/* Works Dropdown */}
          {visibleWorkTypes.length > 0 && (
          <div ref={worksRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setWorksOpen(!worksOpen)}
              className={`rca-nav-btn ${isWorksActive ? 'active' : ''}`}
            >
              <Film size={13} />
              {navbar?.links?.worksLabel || 'Works'}
              <ChevronDown size={12} className={`rca-chevron ${worksOpen ? 'open' : ''}`} />
            </button>
            {worksOpen && (
              <div className="rca-works-dropdown animate-slide-down">
                <div className="rca-works-dropdown-header">Browse {navbar?.links?.worksLabel || 'Works'}</div>
                <div className="rca-works-grid">
                  {visibleWorkTypes.map((w) => (
                    <Link
                      key={w.slug}
                      to={`/works/${w.slug}`}
                      className={`rca-works-item ${location.pathname === `/works/${w.slug}` ? 'active' : ''}`}
                    >
                      <span className="rca-works-icon">{WORK_ICONS[w.slug]}</span>
                      <span>{w.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          )}

           <NavLink to="/casting" label={navbar?.links?.castingLabel || 'Casting'} icon={<Clapperboard size={13} />} active={location.pathname.startsWith('/casting')} />
           <NavLink to="/event/all" label="Events" icon={<Sparkles size={13} />} active={location.pathname.startsWith('/event')} />
           <NavLink to="/about" label={navbar?.links?.aboutLabel || 'About'} active={location.pathname === '/about'} />
          <NavLink to="/contact" label={navbar?.links?.contactLabel || 'Contact'} active={location.pathname === '/contact'} />
        </nav>
        )}

        {/* Desktop Auth */}
        {authBtnsVisible && (
        <div className="rca-navbar-auth">
          {user ? (
            <>
              {/* User Bell */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setBellOpen(!bellOpen)} className="rca-nav-btn" style={{ padding: '0.4rem', border: '1px solid transparent' }} title="Notifications">
                  <Bell size={16} />
                  {unreadNotifs.length > 0 && <span className="admin-notification-dot" style={{ top: 4, right: 4 }} />}
                </button>
                {bellOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setBellOpen(false)} />
                    <div className="animate-slide-down" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '300px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden' }}>
                      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-card)' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Notifications</div>
                        {unreadNotifs.length > 0 && (
                          <button onClick={() => dispatch(markAllRead({ userId: user.id, role: user.role }))} style={{ fontSize: '0.7rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Check size={12} /> Mark all read
                          </button>
                        )}
                      </div>
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {unreadNotifs.length === 0 ? (
                          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-muted-foreground)', fontSize: '0.8rem' }}>No new notifications</div>
                        ) : (
                          unreadNotifs.map(n => (
                            <div key={n.id} style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', marginTop: '0.3rem', flexShrink: 0 }} />
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.15rem' }}>{n.title}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>{n.message}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="rca-auth-dashboard-btn"
              >
                {user.role === 'admin' ? <Shield size={14} /> : <LayoutDashboard size={14} />}
                {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
              </Link>
              <button onClick={() => dispatch(logout())} className="rca-auth-logout-btn">
                <LogOut size={14} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rca-auth-login-btn">{navbar?.auth?.loginLabel || 'Log in'}</Link>
              <Link to="/register" className="btn-primary btn-sm">
                <Zap size={13} />
                {navbar?.auth?.joinLabel || 'Join Rajasthani Cinema Association'}
              </Link>
            </>
          )}
        </div>
        )}

        {/* Mobile hamburger */}
        <button
          className="rca-hamburger md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="rca-mobile-drawer animate-slide-down md:hidden">
          {navLinksVisible && (
          <div className="rca-mobile-links">
            <MobileNavLink to="/" label={navbar?.links?.homeLabel || 'Home'} icon={<Home size={16} />} />
            <MobileNavLink to="/talent" label={navbar?.links?.talentLabel && navbar.links.talentLabel !== 'Talent' ? navbar.links.talentLabel : 'Talent/Members'} icon={<Sparkles size={16} />} />
            {visibleWorkTypes.length > 0 && (
              <>
                <div className="rca-mobile-section-label">{navbar?.links?.worksLabel || 'Works'}</div>
                {visibleWorkTypes.map((w) => (
                  <MobileNavLink key={w.slug} to={`/works/${w.slug}`} label={w.label} icon={WORK_ICONS[w.slug]} indent />
                ))}
              </>
            )}
            <MobileNavLink to="/casting" label={navbar?.links?.castingLabel || 'Casting'} icon={<Clapperboard size={16} />} />
            <MobileNavLink to="/event/all" label="Events" icon={<Sparkles size={16} />} />
            <MobileNavLink to="/about" label={navbar?.links?.aboutLabel || 'About'} />
            <MobileNavLink to="/contact" label={navbar?.links?.contactLabel || 'Contact'} />
          </div>
          )}
          {authBtnsVisible && (
          <div className="rca-mobile-auth">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-outline" style={{ justifyContent: 'center' }}>
                  {user.role === 'admin' ? <Shield size={14} /> : <LayoutDashboard size={14} />}
                  {user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                </Link>
                <button onClick={() => dispatch(logout())} className="btn-ghost" style={{ justifyContent: 'center', color: '#c0392b' }}>
                  <LogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline" style={{ justifyContent: 'center' }}>{navbar?.auth?.loginLabel || 'Log in'}</Link>
                <Link to="/register" className="btn-primary" style={{ justifyContent: 'center' }}>
                  <Zap size={13} /> {navbar?.auth?.joinLabel || 'Join Rajasthani Cinema Association'}
                </Link>
              </>
            )}
          </div>
          )}
        </div>
      )}
    </header>
  );
}

function NavLink({ to, label, icon, active }: { to: string; label: string; icon?: React.ReactNode; active: boolean }) {
  return (
    <Link to={to} className={`rca-nav-link ${active ? 'active' : ''}`}>
      {icon && <span className="rca-nav-link-icon">{icon}</span>}
      {label}
    </Link>
  );
}

function MobileNavLink({ to, label, icon, indent }: { to: string; label: string; icon?: React.ReactNode; indent?: boolean }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`rca-mobile-link ${active ? 'active' : ''} ${indent ? 'indent' : ''}`}
    >
      {icon && <span style={{ opacity: 0.7 }}>{icon}</span>}
      {label}
    </Link>
  );
}

/* ===================================================================
   FOOTER
=================================================================== */
function Footer() {
  const footer = useAppSelector((s) => s.pages?.footer);

  const tickerArray = footer?.ticker?.text ? footer.ticker.text.split(',').map((s: string) => s.trim()) : ['Movies', 'TV Series', 'Music Videos', 'Short Dramas', 'Actors', 'Directors', 'Cinematographers', 'Editors', 'Writers', 'Producers', 'Indian Talent', 'Casting Calls', 'Rajasthani Cinema Association Platform'];
  const brandSub = footer?.brand?.subtitle || 'Professional home for Indian entertainment talent — movies, TV, music videos, and short dramas.';
  const col1 = footer?.columns?.col1Title || 'Talent';
  const col2 = footer?.columns?.col2Title || 'Works';
  const col3 = footer?.columns?.col3Title || 'Company';

  return (
    <footer style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
      {/* Ticker marquee */}
      {footer?.ticker?.visible !== false && (
      <div style={{ borderBottom: '1px solid var(--color-border)', overflow: 'hidden', padding: '0.6rem 0' }}>
        <div className="marquee-track" style={{ color: 'var(--color-muted-foreground)', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
          {tickerArray.map((t: string, i: number) => (
            <span key={`a-${i}`} style={{ padding: '0 2rem' }}>✦ {t}</span>
          ))}
          {tickerArray.map((t: string, i: number) => (
            <span key={`b-${i}`} style={{ padding: '0 2rem' }}>✦ {t}</span>
          ))}
        </div>
      </div>
      )}

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.25rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem' }}>
        {/* Brand */}
        {footer?.brand?.visible !== false && (
        <div>
          <div className="font-serif" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Rajasthani Cinema Association</div>
          <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--color-muted-foreground)', lineHeight: 1.65, maxWidth: '240px' }}>
            {brandSub}
          </p>
          <div style={{ marginTop: '1.2rem', fontSize: '0.78rem', color: 'var(--color-muted-foreground)' }}>
            © {new Date().getFullYear()} Rajasthani Cinema Association. All rights reserved.
          </div>
        </div>
        )}

        {/* Talent */}
        {footer?.columns?.visible !== false && (
          <>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted-foreground)', marginBottom: '1rem' }}>{col1}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <FooterLink to="/talent" label="Talent/Members Directory" />
                <FooterLink to="/membership" label="Join as Member" />
                <FooterLink to="/register" label="Join as Talent" />
                <FooterLink to="/dashboard" label="My Dashboard" />
                <FooterLink to="/casting" label="Casting Board" />
              </div>
            </div>

            {/* Works */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted-foreground)', marginBottom: '1rem' }}>{col2}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <FooterLink to="/works/movies" label="Movies" />
                <FooterLink to="/works/tv-series" label="TV Series" />
                <FooterLink to="/works/music-videos" label="Music Videos" />
                <FooterLink to="/works/short-dramas" label="Short Dramas" />
              </div>
            </div>

            {/* Company */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted-foreground)', marginBottom: '1rem' }}>{col3}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <FooterLink to="/about" label="About Rajasthani Cinema Association" />
                <FooterLink to="/contact" label="Contact Us" />
                <FooterLink to="/casting" label="Open Casting" />
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', textDecoration: 'none', transition: 'color 0.2s' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-muted-foreground)'}
    >
      {label}
    </Link>
  );
}
