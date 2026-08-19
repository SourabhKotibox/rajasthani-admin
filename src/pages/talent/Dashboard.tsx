import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { plans } from '@/data/mock';
import { MembershipCard } from '@/components/MembershipCard';
import {
  User, Briefcase, Star, Clapperboard, ArrowRight,
  CheckCircle2, Clock, AlertCircle, TrendingUp,
  Sparkles, Bell, ChevronRight, Inbox,
} from 'lucide-react';

const STATUS_CONFIG = {
  approved: { label: 'Approved', color: '#2D5016', bg: '#EEF5E8', border: '#c5e6b0', icon: <CheckCircle2 size={12} /> },
  pending:  { label: 'Pending Review', color: '#7a5200', bg: '#FDF4DC', border: '#f5c842aa', icon: <Clock size={12} /> },
  rejected: { label: 'Rejected', color: '#8B1A1A', bg: '#FAEAEA', border: '#fca5a5', icon: <AlertCircle size={12} /> },
};

const CARD_META = [
  { key: 'profile',  gradient: 'linear-gradient(135deg,#FA931A,#FDD9AB)', shadow: 'rgba(250,147,26,0.25)' },
  { key: 'portfolio',gradient: 'linear-gradient(135deg,#1a4a7a,#2563aa)', shadow: 'rgba(26,74,122,0.22)' },
  { key: 'plan',     gradient: 'linear-gradient(135deg,#5a3e9a,#7c5dc0)', shadow: 'rgba(90,62,154,0.22)' },
  { key: 'apps',     gradient: 'linear-gradient(135deg,#2D5016,#3d6b1f)', shadow: 'rgba(45,80,22,0.22)' },
];

export default function TalentDashboard() {
  const user     = useAppSelector((s) => s.auth.user);
  const profile  = useAppSelector((s) =>
    s.data.profiles.find((p) => p.userId === user?.id || p.userId === Number(user?.id)),
  );
  const portfolio = useAppSelector((s) =>
    s.data.portfolio.filter((e) => profile && e.profileId === profile.id),
  );
  const apps = useAppSelector((s) =>
    s.data.applications.filter((a) => a.userId === user?.id || a.userId === String(user?.id)),
  );

  const plansState = useAppSelector((s) => s.plans.items) || [];
  const activePlan = plansState.find(p => p.id === user?.planId) || plansState[0] || plans[0];
  const firstName  = user?.fullName?.split(' ')[0] ?? 'there';
  const hour       = new Date().getHours();
  const greeting   = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const [membership, setMembership] = useState<any>(null);
  const branding = useAppSelector((s) => s.branding);

  useEffect(() => {
    import('@/api/client').then(({ api }) => {
      api.getMyMembership().then((data) => setMembership(data)).catch(() => {});
    });
  }, []);

  const profileStatus = profile?.status ?? null;
  const statusCfg     = profileStatus ? STATUS_CONFIG[profileStatus] : null;

  const cards = [
    {
      key: 'profile',
      title: 'Profile',
      value: statusCfg?.label ?? 'Not set up',
      sub: profile ? (profile.categories || []).slice(0, 2).join(' · ') : 'Set up your profile',
      to: '/dashboard/profile',
      icon: <User size={22} />,
      badge: statusCfg ? { label: statusCfg.label, color: statusCfg.color, bg: statusCfg.bg, border: statusCfg.border } : null,
    },
    {
      key: 'portfolio',
      title: 'Portfolio',
      value: `${portfolio.length}`,
      valueSub: 'entries',
      sub: portfolio.length > 0
        ? `Across ${[...new Set(portfolio.map((e) => e.projectType))].length} project type(s)`
        : 'Add your first credit',
      to: '/dashboard/portfolio',
      icon: <Briefcase size={22} />,
    },
    {
      key: 'plan',
      title: 'Subscription',
      value: activePlan.name,
      valueSub: 'plan',
      sub: `₹ ${activePlan.priceMonthly.toLocaleString()}/mo · Active`,
      to: '/dashboard/subscription',
      icon: <Star size={22} />,
    },
    {
      key: 'apps',
      title: 'Applications',
      value: `${apps.length}`,
      valueSub: 'submitted',
      sub: apps.length > 0
        ? `${apps.filter((a) => a.status === 'shortlisted').length} shortlisted`
        : 'Browse casting calls',
      to: '/dashboard/casting',
      icon: <Clapperboard size={22} />,
    },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>

      {/* ══════════════════════════════════════
          HERO GREETING BANNER
      ══════════════════════════════════════ */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(145deg,#1C1917 0%,#2c1f08 60%,#3b2a0a 100%)',
        borderRadius: '24px',
        padding: '2.5rem 2.5rem',
        marginBottom: '2rem',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        {/* Ambient glows */}
        <div style={{ position:'absolute', top:-60, right:-60, width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,200,66,0.18) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,200,66,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1 }}>
          {/* Eyebrow */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(245,200,66,0.12)', border:'1px solid rgba(245,200,66,0.25)', borderRadius:'99px', padding:'0.25rem 0.8rem', marginBottom:'0.9rem' }}>
            <Sparkles size={11} style={{ color:'#F5C842' }} />
            <span style={{ fontSize:'0.7rem', fontWeight:700, color:'#F5C842', letterSpacing:'0.08em', textTransform:'uppercase' }}>
              {greeting}
            </span>
          </div>

          <h1 className="font-serif" style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:800, color:'#fff', lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:'0.5rem' }}>
            {firstName},<br />
            <span style={{ color:'#F5C842' }}>your stage awaits.</span>
          </h1>
          <p style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.5)', maxWidth:380, lineHeight:1.65 }}>
            Manage your Rajasthan Cine Association profile, showcase your credits, and apply to the latest casting calls — all in one place.
          </p>
        </div>

        {/* Quick action buttons */}
        <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', gap:'0.65rem', flexShrink:0 }}>
          <Link to="/dashboard/portfolio" style={{
            display:'flex', alignItems:'center', gap:'0.5rem',
            padding:'0.65rem 1.25rem', borderRadius:'12px',
            background:'#F5C842', color:'#1C1917',
            fontWeight:700, fontSize:'0.85rem', textDecoration:'none',
            transition:'all 0.2s', whiteSpace:'nowrap',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity='0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity='1')}
          >
            <Briefcase size={15} /> Add Portfolio Entry
          </Link>
          <Link to="/casting" style={{
            display:'flex', alignItems:'center', gap:'0.5rem',
            padding:'0.65rem 1.25rem', borderRadius:'12px',
            background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.85)',
            border:'1px solid rgba(255,255,255,0.15)',
            fontWeight:600, fontSize:'0.85rem', textDecoration:'none',
            transition:'all 0.2s', whiteSpace:'nowrap',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background='rgba(255,255,255,0.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.background='rgba(255,255,255,0.08)')}
          >
            <Clapperboard size={15} /> Browse Casting
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════
          STAT CARDS
      ══════════════════════════════════════ */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:'1.1rem', marginBottom:'2rem' }}>
        {cards.map((c, i) => {
          const meta = CARD_META[i];
          return (
            <Link
              key={c.key}
              to={c.to}
              className={`animate-slide-up stagger-${i + 1}`}
              style={{
                display:'block', textDecoration:'none',
                background:'var(--color-card)',
                border:'1px solid var(--color-border)',
                borderRadius:'18px',
                padding:'1.4rem 1.4rem 1.2rem',
                boxShadow:'0 2px 10px rgba(0,0,0,0.04)',
                transition:'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                position:'relative', overflow:'hidden',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px ${meta.shadow}`;
                (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
              }}
            >
              {/* Subtle corner gradient */}
              <div style={{ position:'absolute', top:0, right:0, width:80, height:80, background:`radial-gradient(circle at 100% 0%,${meta.shadow} 0%,transparent 70%)`, pointerEvents:'none' }} />

              {/* Icon */}
              <div style={{
                width:44, height:44, borderRadius:'13px',
                background: meta.gradient,
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#fff', marginBottom:'1.1rem',
                boxShadow:`0 4px 12px ${meta.shadow}`,
              }}>
                {c.icon}
              </div>

              {/* Value */}
              <div style={{ display:'flex', alignItems:'baseline', gap:'0.3rem', marginBottom:'0.2rem' }}>
                <span className="font-serif" style={{ fontSize:'1.85rem', fontWeight:900, color:'var(--color-foreground)', lineHeight:1 }}>
                  {c.value}
                </span>
                {c.valueSub && (
                  <span style={{ fontSize:'0.8rem', color:'var(--color-muted-foreground)', fontWeight:600 }}>{c.valueSub}</span>
                )}
              </div>

              {/* Label */}
              <div style={{ fontSize:'0.72rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--color-muted-foreground)', marginBottom:'0.4rem' }}>
                {c.title}
              </div>

              {/* Sub */}
              <p style={{ fontSize:'0.8rem', color:'var(--color-muted-foreground)', lineHeight:1.45, marginBottom:'1rem' }}>
                {c.sub}
              </p>

              {/* Badge + arrow */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                {c.badge ? (
                  <span style={{
                    display:'inline-flex', alignItems:'center', gap:'0.3rem',
                    fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em',
                    padding:'0.2rem 0.55rem', borderRadius:'99px',
                    background: c.badge.bg, color: c.badge.color,
                    border:`1px solid ${c.badge.border}`,
                  }}>
                    {c.badge.label}
                  </span>
                ) : <span />}
                <div style={{ display:'flex', alignItems:'center', gap:'0.2rem', fontSize:'0.78rem', fontWeight:700, color:'var(--color-primary)' }}>
                  Manage <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ══════════════════════════════════════
          BOTTOM ROW: Quick Actions + Membership + Profile alert
      ══════════════════════════════════════ */}
      <div style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap:'1.25rem' }}>
        
        {/* Membership Card */}
        {membership && (membership.status === 'paid' || membership.status === 'approved') && (
          <div style={{ background:'var(--color-card)', border:'1px solid var(--color-border)', borderRadius:'18px', padding:'1.5rem', boxShadow:'0 2px 10px rgba(0,0,0,0.04)', display:'flex', flexDirection:'column', alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', width: '100%' }}>
              <h2 className="font-serif" style={{ fontSize:'1.1rem', fontWeight:800 }}>Your Official RCA ID</h2>
              {membership.status === 'approved' ? (
                <span style={{ fontSize:'0.7rem', fontWeight:700, padding:'0.2rem 0.6rem', background:'var(--color-success-bg)', color:'var(--color-success)', borderRadius:'99px' }}>APPROVED</span>
              ) : (
                <span style={{ fontSize:'0.7rem', fontWeight:700, padding:'0.2rem 0.6rem', background:'var(--color-warning-bg)', color:'var(--color-warning)', borderRadius:'99px' }}>PENDING APPROVAL</span>
              )}
            </div>
            
            <div id="membership-card-export" style={{ width: '100%' }}>
              <MembershipCard membership={membership} branding={branding} />
            </div>

            <button 
              className="btn-outline" 
              style={{ marginTop: '1.5rem', width: '100%' }}
              onClick={async () => {
                const html2canvas = (await import('html2canvas')).default;
                const el = document.getElementById('membership-card-export');
                if (!el) return;
                const canvas = await html2canvas(el, { backgroundColor: null });
                const link = document.createElement('a');
                link.download = `RCA_ID_${membership.membershipNo || 'Card'}.png`;
                link.href = canvas.toDataURL();
                link.click();
              }}
            >
              Download Card
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ background:'var(--color-card)', border:'1px solid var(--color-border)', borderRadius:'18px', padding:'1.5rem', boxShadow:'0 2px 10px rgba(0,0,0,0.04)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
            <h2 className="font-serif" style={{ fontSize:'1.1rem', fontWeight:800 }}>Quick Actions</h2>
            <TrendingUp size={16} style={{ color:'var(--color-muted-foreground)' }} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            {[
              { to:'/dashboard/portfolio', icon:<Briefcase size={15}/>, label:'Add Portfolio Credit', sub:'Showcase a new project credit' },
              { to:'/casting', icon:<Clapperboard size={15}/>, label:'Browse Casting Calls', sub:'Find open opportunities' },
              { to:'/dashboard/profile', icon:<User size={15}/>, label:'Edit My Profile', sub:'Update your information' },
              { to:'/dashboard/inbox', icon:<Inbox size={15}/>, label:'Check Inbox', sub:'Messages from the platform' },
            ].map(({ to, icon, label, sub }) => (
              <Link key={to} to={to} style={{
                display:'flex', alignItems:'center', gap:'0.9rem',
                padding:'0.75rem 1rem', borderRadius:'12px',
                textDecoration:'none', transition:'all 0.15s',
                border:'1px solid var(--color-border)',
                background:'var(--color-surface)',
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor='var(--color-primary)'; (e.currentTarget as HTMLElement).style.background='var(--color-primary-subtle)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor='var(--color-border)'; (e.currentTarget as HTMLElement).style.background='var(--color-surface)'; }}
              >
                <div style={{ width:34, height:34, borderRadius:'10px', background:'var(--color-card)', border:'1px solid var(--color-border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--color-primary)', flexShrink:0 }}>
                  {icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'0.87rem', fontWeight:700, color:'var(--color-foreground)' }}>{label}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--color-muted-foreground)' }}>{sub}</div>
                </div>
                <ChevronRight size={15} style={{ color:'var(--color-muted-foreground)', flexShrink:0 }} />
              </Link>
            ))}
          </div>
        </div>

        {/* No-profile alert panel */}
        {!profile && (
          <div style={{
            background:'linear-gradient(145deg,#fdf8e8,#fef3d0)',
            border:'1.5px solid var(--color-primary-tint)',
            borderRadius:'18px', padding:'2rem',
            display:'flex', flexDirection:'column', justifyContent:'center', gap:'1.25rem',
          }}>
            <div style={{ width:52, height:52, borderRadius:'16px', background:'var(--color-primary-subtle)', border:'2px solid var(--color-primary-tint)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Bell size={24} style={{ color:'var(--color-primary)' }} />
            </div>
            <div>
              <h3 style={{ fontSize:'1.05rem', fontWeight:800, color:'var(--color-primary)', marginBottom:'0.4rem' }}>
                Complete your profile
              </h3>
              <p style={{ fontSize:'0.84rem', color:'var(--color-foreground)', opacity:0.75, lineHeight:1.6 }}>
                Before you can add portfolio entries or apply for casting calls, you need to set up your Rajasthan Cine Association professional profile.
              </p>
            </div>
            <Link to="/dashboard/profile" className="btn-primary" style={{ alignSelf:'flex-start', padding:'0.7rem 1.4rem', borderRadius:'12px', fontSize:'0.88rem' }}>
              Set Up My Profile <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
