import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { api } from '@/api/client';
import {
  Users, User, Clapperboard, MessageSquare, ArrowRight,
  TrendingUp, TrendingDown, Activity, Star, Briefcase,
  CheckCircle, Clock, AlertCircle, ChevronRight, Zap,
} from 'lucide-react';

type AdminStats = {
  users: number;
  featured: number;
  pending: number;
  openCasting: number;
  applications: number;
  newInquiries: number;
};

export default function AdminDashboard() {
  const profiles = useAppSelector((s) => s.data.profiles);
  const casting = useAppSelector((s) => s.data.casting);
  const inquiries = useAppSelector((s) => s.data.inquiries);
  const applications = useAppSelector((s) => s.data.applications);
  const storeUsers = useAppSelector((s) => s.data.users);

  const [liveStats, setLiveStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    api.adminStats()
      .then(setLiveStats)
      .catch(() => { /* fallback to computed stats below */ });
  }, []);

  // Use live API stats when available, fall back to computed Redux state
  const totalUsers = liveStats?.users ?? storeUsers.length;
  const pendingProfiles = liveStats?.pending ?? profiles.filter(p => p.status === 'pending').length;
  const approvedProfiles = profiles.filter(p => p.status === 'approved').length;
  const newInquiries = liveStats?.newInquiries ?? inquiries.filter(i => i.status === 'new').length;
  const openCasting = liveStats?.openCasting ?? casting.filter(c => c.status === 'open').length;
  const featuredProfiles = liveStats?.featured ?? profiles.filter(p => p.isFeatured).length;
  const totalApplications = liveStats?.applications ?? applications?.length ?? 0;
  const totalPortfolio = useAppSelector((s) => s.data.portfolio).length;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      sub: `${totalUsers} registered accounts`,
      to: '/admin/users',
      icon: <Users size={22} />,
      trend: '+12%',
      up: true,
      accent: '#6366f1',
      accentBg: '#eef2ff',
    },
    {
      title: 'Talent Profiles',
      value: profiles.length,
      sub: `${featuredProfiles} featured · ${approvedProfiles} approved`,
      to: '/admin/profiles',
      icon: <User size={22} />,
      alert: pendingProfiles,
      trend: '+5%',
      up: true,
      accent: 'var(--color-primary)',
      accentBg: 'var(--color-primary-subtle)',
    },
    {
      title: 'Casting Calls',
      value: casting.length,
      sub: `${openCasting} open calls`,
      to: '/admin/casting',
      icon: <Clapperboard size={22} />,
      trend: '+3',
      up: true,
      accent: '#0891b2',
      accentBg: '#e0f7fa',
    },
    {
      title: 'Applications',
      value: totalApplications,
      sub: 'Total submissions',
      to: '/admin/applications',
      icon: <Star size={22} />,
      trend: '+8%',
      up: true,
      accent: '#d97706',
      accentBg: '#fef3c7',
    },
    {
      title: 'Portfolios',
      value: totalPortfolio,
      sub: 'Uploaded works',
      to: '/admin/portfolio',
      icon: <Briefcase size={22} />,
      trend: 'new',
      up: true,
      accent: '#059669',
      accentBg: '#ecfdf5',
    },
    {
      title: 'Inquiries',
      value: inquiries.length,
      sub: 'Industry messages',
      to: '/admin/inquiries',
      icon: <MessageSquare size={22} />,
      alert: newInquiries,
      trend: `${newInquiries} new`,
      up: false,
      accent: '#dc2626',
      accentBg: '#fef2f2',
    },
  ];

  const quickActions = [
    {
      label: 'Review pending profiles',
      desc: 'Approve or reject talent',
      to: '/admin/profiles',
      count: pendingProfiles,
      urgent: pendingProfiles > 0,
      icon: <User size={16} />,
    },
    {
      label: 'Process new inquiries',
      desc: 'Respond to industry messages',
      to: '/admin/inquiries',
      count: newInquiries,
      urgent: newInquiries > 0,
      icon: <MessageSquare size={16} />,
    },
    {
      label: 'Manage casting calls',
      desc: 'Post or edit open calls',
      to: '/admin/casting',
      count: 0,
      urgent: false,
      icon: <Clapperboard size={16} />,
    },
    {
      label: 'View all users',
      desc: 'Manage roles & accounts',
      to: '/admin/users',
      count: 0,
      urgent: false,
      icon: <Users size={16} />,
    },
  ];

  const recentActivity = [
    { action: 'New talent profile submitted', time: '2 min ago', type: 'profile', status: 'pending' },
    { action: 'Casting call "Lead Actor – Drama Series" posted', time: '18 min ago', type: 'casting', status: 'open' },
    { action: 'Industry inquiry from ABC Productions', time: '45 min ago', type: 'inquiry', status: 'new' },
    { action: 'Profile approved: "Amara Osei"', time: '1 hr ago', type: 'profile', status: 'approved' },
    { action: 'New user registered', time: '2 hrs ago', type: 'user', status: 'active' },
    { action: 'Portfolio submission reviewed', time: '3 hrs ago', type: 'portfolio', status: 'done' },
  ];

  const statusIcon = (status: string) => {
    if (status === 'pending' || status === 'new') return <Clock size={14} style={{ color: '#d97706' }} />;
    if (status === 'approved' || status === 'done' || status === 'active') return <CheckCircle size={14} style={{ color: '#059669' }} />;
    if (status === 'open') return <Activity size={14} style={{ color: '#6366f1' }} />;
    return <AlertCircle size={14} style={{ color: '#dc2626' }} />;
  };

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: '9px',
              background: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
            }}>
              <Activity size={16} />
            </div>
            <h1 className="font-serif" style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
              Admin Dashboard
            </h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>
            Platform overview · all data at a glance
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/casting" className="btn-outline btn-sm" style={{ gap: '0.4rem' }}>
            <Zap size={13} /> Post Casting Call
          </Link>
          <Link to="/admin/profiles" className="btn-primary btn-sm" style={{ gap: '0.4rem' }}>
            Review Profiles
            {pendingProfiles > 0 && (
              <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '99px', padding: '0.05rem 0.45rem', fontSize: '0.72rem' }}>
                {pendingProfiles}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Stat cards grid */}
      <div className="admin-stat-grid">
        {stats.map((c, i) => (
          <Link
            key={c.title}
            to={c.to}
            className={`admin-stat-card animate-slide-up stagger-${i + 1}`}
            style={{
              display: 'block',
              textDecoration: 'none',
              '--card-accent': c.accent,
            } as React.CSSProperties}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{
                width: '44px', height: '44px',
                background: c.accentBg,
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: c.accent,
              }}>
                {c.icon}
              </div>
              {c.alert != null && c.alert > 0 ? (
                <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>
                  {c.alert} pending
                </span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.74rem', fontWeight: 600, color: c.up ? '#059669' : '#dc2626' }}>
                  {c.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {c.trend}
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.3rem' }}>
              {c.title}
            </div>
            <div className="font-serif" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-foreground)', lineHeight: 1.1, marginBottom: '0.3rem' }}>
              {c.value}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{c.sub}</p>
            <div style={{ marginTop: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: c.accent, fontWeight: 600 }}>
              View all <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom row: Quick Actions + Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Quick Actions */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'var(--color-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <TrendingUp size={15} />
            </div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Quick Actions</h2>
          </div>
          <div style={{ padding: '1rem' }}>
            {quickActions.map((action, i) => (
              <Link
                key={i}
                to={action.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 0.75rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                  borderBottom: i < quickActions.length - 1 ? '1px solid #f1f5f9' : 'none',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f8fafc'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <div style={{
                  width: 34, height: 34,
                  borderRadius: '9px',
                  background: action.urgent ? 'var(--color-danger-bg)' : 'var(--color-surface)',
                  color: action.urgent ? 'var(--color-danger)' : 'var(--color-muted-foreground)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flex: 'shrink 0',
                  flexShrink: 0,
                }}>
                  {action.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-foreground)' }}>{action.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', marginTop: '1px' }}>{action.desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {action.count > 0 && (
                    <span className="badge badge-danger">{action.count}</span>
                  )}
                  <ChevronRight size={15} style={{ color: '#cbd5e1' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: '8px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
              <Activity size={15} />
            </div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Recent Activity</h2>
            <span className="badge badge-muted" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>Live</span>
          </div>
          <div style={{ padding: '0.5rem 1rem 1rem' }}>
            {recentActivity.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.75rem 0',
                  borderBottom: i < recentActivity.length - 1 ? '1px solid #f1f5f9' : 'none',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  {statusIcon(item.status)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-foreground)', lineHeight: 1.4 }}>{item.action}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', marginTop: '2px' }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation cards — all pages at a glance */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted-foreground)', marginBottom: '1rem' }}>
          All Admin Pages
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: 'Users', path: '/admin/users', icon: <Users size={18} />, color: '#6366f1', bg: '#eef2ff' },
            { label: 'Profiles', path: '/admin/profiles', icon: <User size={18} />, color: 'var(--color-primary)', bg: 'var(--color-primary-subtle)' },
            { label: 'Portfolios', path: '/admin/portfolio', icon: <Briefcase size={18} />, color: '#059669', bg: '#ecfdf5' },
            { label: 'Casting Calls', path: '/admin/casting', icon: <Clapperboard size={18} />, color: '#0891b2', bg: '#e0f7fa' },
            { label: 'Applications', path: '/admin/applications', icon: <Star size={18} />, color: '#d97706', bg: '#fef3c7' },
            { label: 'Inquiries', path: '/admin/inquiries', icon: <MessageSquare size={18} />, color: '#dc2626', bg: '#fef2f2' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '1.1rem 1rem',
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = item.color;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
                (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{
                width: 36, height: 36,
                borderRadius: '9px',
                background: item.bg,
                color: item.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-foreground)' }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
