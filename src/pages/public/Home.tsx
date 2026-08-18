import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { api } from '@/api/client';
import { WORK_TYPES, type ProjectType, type CastingCall } from '@/data/mock';
import {
  ChevronRight, ChevronLeft, Film, Tv, Music, Drama,
  ArrowRight, CheckCircle2, Star, Quote,
  Calendar, Send, MapPin,
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { TalentCard, CreditCard } from '@/components/Cards';
import HeroEventSlider from '@/components/HeroEventSlider';
import CastingApplyFlow from '@/components/CastingApplyFlow';

/* ===================================================================
   CUSTOM BANNER — admin-managed banner with "Apply from here" button
=================================================================== */
function CustomBanner({ banner, castingCall, onApply, index }: { banner: any; castingCall: CastingCall | undefined; onApply: (c: CastingCall) => void; index: number }) {
  const [hovered, setHovered] = useState(false);

  const handleApplyClick = () => {
    if (castingCall) {
      onApply(castingCall);
    }
  };

  return (
    <div
      className={`animate-slide-up stagger-${Math.min(index + 1, 3)}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        height: '280px',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.35)' : '0 4px 20px rgba(0,0,0,0.15)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      {/* Background image */}
      <img
        src={banner.imageUrl}
        alt={banner.title}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s ease',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
        }}
      />
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,8,6,0.95) 0%, rgba(10,8,6,0.5) 50%, rgba(10,8,6,0.15) 100%)',
      }} />

      {/* Featured badge */}
      <div style={{
        position: 'absolute', top: '16px', left: '16px',
        background: 'var(--color-primary)',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff', fontSize: '0.67rem', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        padding: '3px 10px', borderRadius: '99px',
      }}>
        Featured
      </div>

      {/* Content (bottom) */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem' }}>
        <h3 className="font-serif" style={{
          fontSize: '1.15rem',
          fontWeight: 800, color: '#fff', lineHeight: 1.1,
          marginBottom: '0.5rem',
        }}>
          {banner.title}
        </h3>

        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {banner.subtitle}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          {castingCall && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
              <Calendar size={11} /> Deadline: {castingCall.deadline}
            </span>
          )}
          <button
            onClick={handleApplyClick}
            disabled={!castingCall}
            style={{
              background: hovered ? '#fff' : 'rgba(255,255,255,0.92)',
              color: 'var(--color-primary)',
              border: 'none', cursor: castingCall ? 'pointer' : 'not-allowed',
              padding: '0.45rem 1rem',
              borderRadius: '8px', fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              transition: 'all 0.2s',
              flexShrink: 0,
              opacity: castingCall ? 1 : 0.5,
            }}
          >
            <Send size={13} /> Apply from here
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   CASTING SPOTLIGHT BANNER — single large banner card
=================================================================== */
const TYPE_BADGE_COLOR: Record<string, string> = {
  Movie: '#1A2A4A',
  TVSeries: '#1A3A2A',
  MusicVideo: '#3A1A2A',
  ShortDrama: '#2A2A1A',
};
const TYPE_LABEL_MAP: Record<string, string> = {
  Movie: 'Movie', TVSeries: 'TV Series', MusicVideo: 'Music Video', ShortDrama: 'Short Drama',
};

function CastingBanner({ call, onApply, index }: { call: CastingCall; onApply: (c: CastingCall) => void; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`animate-slide-up stagger-${Math.min(index + 1, 3)}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        height: '280px',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.35)' : '0 4px 20px rgba(0,0,0,0.15)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      {/* Background image */}
      <img
        src={call.imageUrl}
        alt={call.projectTitle}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s ease',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
        }}
      />
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,8,6,0.95) 0%, rgba(10,8,6,0.5) 50%, rgba(10,8,6,0.15) 100%)',
      }} />

      {/* Type badge (top-left) */}
      <div style={{
        position: 'absolute', top: '16px', left: '16px',
        background: TYPE_BADGE_COLOR[call.projectType] || '#1A2A4A',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff', fontSize: '0.67rem', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        padding: '3px 10px', borderRadius: '99px',
      }}>
        {TYPE_LABEL_MAP[call.projectType] || call.projectType}
      </div>

      {/* Fee badge (top-right) */}
      <div style={{
        position: 'absolute', top: '16px', right: '16px',
        background: call.applicationFee > 0 ? 'var(--color-primary)' : '#16a34a',
        color: '#fff', fontSize: '0.7rem', fontWeight: 700,
        padding: '3px 10px', borderRadius: '99px',
      }}>
        {call.applicationFee > 0 ? `₹ ${call.applicationFee.toLocaleString()}` : 'Free'}
      </div>

      {/* Content (bottom) */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem' }}>
        <h3 className="font-serif" style={{
          fontSize: '1.15rem',
          fontWeight: 800, color: '#fff', lineHeight: 1.1,
          marginBottom: '0.5rem',
        }}>
          {call.projectTitle}
        </h3>

        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {call.rolesDescription}
        </p>

        {/* Roles chips */}
        {call.roles && call.roles.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
            {call.roles.slice(0, 3).map((r) => (
              <span key={r} style={{
                fontSize: '0.7rem', fontWeight: 500,
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
                color: 'rgba(255,255,255,0.9)', padding: '2px 8px', borderRadius: '6px',
              }}>
                {r}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
            <Calendar size={11} /> Deadline: {call.deadline}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onApply(call); }}
            style={{
              background: hovered ? '#fff' : 'rgba(255,255,255,0.92)',
              color: 'var(--color-primary)',
              border: 'none', cursor: 'pointer',
              padding: '0.45rem 1rem',
              borderRadius: '8px', fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            <Send size={13} /> Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   CASTING SPOTLIGHT SECTION - Horizontal Scrolling with Banners
=================================================================== */
function CastingSpotlight({ castingSectionData }: { castingSectionData: Record<string, unknown> }) {
  const casting = useAppSelector((s) => s.data.casting.filter((c) => c.status === 'open').slice(0, 10));
  const castingBanners = useAppSelector((s) => s.banners.castingBanners || []);
  const [activeCasting, setActiveCasting] = useState<CastingCall | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 400 : -400, behavior: 'smooth' });
  };

  // Combine custom banners with casting calls
  const allBanners = [
    ...castingBanners.filter(b => b.visible !== false).map(b => ({ ...b, isCustomBanner: true })),
    ...casting.map(c => ({ ...c, isCustomBanner: false }))
  ];

  if (allBanners.length === 0) return null;

  return (
    <>
      {activeCasting && (
        <CastingApplyFlow call={activeCasting} onClose={() => setActiveCasting(null)} />
      )}
      <section style={{ padding: '4rem 0', background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-eyebrow">{String(castingSectionData.eyebrow || 'Now Casting')}</div>
              <h2 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--color-foreground)' }}>
                {String(castingSectionData.title || 'Open Casting Calls')}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/casting" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', marginRight: '0.5rem' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}
              >
                View all <ArrowRight size={14} />
              </Link>
              <button className="scroll-btn" onClick={() => scroll('left')} aria-label="Scroll left">
                <ChevronLeft size={16} />
              </button>
              <button className="scroll-btn" onClick={() => scroll('right')} aria-label="Scroll right">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Horizontal scroller with casting banners */}
          <div ref={scrollRef} className="rca-scroller" style={{ paddingBottom: '0.5rem' }}>
            {allBanners.map((item, i) => {
              if (item.isCustomBanner) {
                // Custom banner with "Apply from here" button
                const banner = item as any;
                const castingCall = casting.find(c => c.id === banner.castingCallId);
                return (
                  <div key={banner.id} style={{ width: '380px', flexShrink: 0 }}>
                    <CustomBanner banner={banner} castingCall={castingCall} onApply={setActiveCasting} index={i} />
                  </div>
                );
              } else {
                // Regular casting banner
                return (
                  <div key={String(item.id)} style={{ width: '380px', flexShrink: 0 }}>
                    <CastingBanner call={item as CastingCall} onApply={setActiveCasting} index={i} />
                  </div>
                );
              }
            })}
          </div>

          {/* Bottom hint */}
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-muted-foreground)', marginTop: '1.25rem' }}>
            Anyone can apply · Pay before creating account · Secure Razorpay payments
          </p>
        </div>
      </section>
    </>
  );
}

/* ===================================================================
   HORIZONTAL SCROLLER with Arrow Buttons
=================================================================== */
function ScrollerSection({
  title,
  children,
  cardWidth = '280px',
  viewAllLink,
  viewAllLabel,
  eyebrow,
}: {
  title: string;
  children: React.ReactNode;
  cardWidth?: string;
  viewAllLink?: string;
  viewAllLabel?: string;
  eyebrow?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 340 : -340, behavior: 'smooth' });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div>
          {eyebrow && <div className="section-eyebrow">{eyebrow}</div>}
          <h3 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-foreground)' }}>{title}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {viewAllLink && (
            <Link to={viewAllLink} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', marginRight: '0.5rem' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}
            >
              {viewAllLabel ?? 'View all'} <ArrowRight size={14} />
            </Link>
          )}
          <button className="scroll-btn" onClick={() => scroll('left')} aria-label="Scroll left">
            <ChevronLeft size={16} />
          </button>
          <button className="scroll-btn" onClick={() => scroll('right')} aria-label="Scroll right">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="rca-scroller">
        {children}
      </div>
    </div>
  );
}

/* ===================================================================
   WORK SECTION PER TYPE
=================================================================== */
const TYPE_ICONS: Record<string, React.ReactNode> = {
  movies: <Film size={18} />,
  'tv-series': <Tv size={18} />,
  'music-videos': <Music size={18} />,
  'short-dramas': <Drama size={18} />,
};

const TYPE_BG: Record<string, string> = {
  movies: 'linear-gradient(135deg, #1A2A4A 0%, #0D1B30 100%)',
  'tv-series': 'linear-gradient(135deg, #1A3A2A 0%, #0E2018 100%)',
  'music-videos': 'linear-gradient(135deg, #3A1A2A 0%, #200D18 100%)',
  'short-dramas': 'linear-gradient(135deg, #2A2A1A 0%, #181808 100%)',
};

function WorkSection({ slug, label, apiType, worksEyebrow }: { slug: string; label: string; apiType: ProjectType; worksEyebrow?: string }) {
  const portfolio = useAppSelector((s) => s.data.portfolio);
  const profiles = useAppSelector((s) => s.data.profiles.filter((p) => p.isFeatured && p.status === 'approved'));

  const credits = profiles
    .flatMap((p) =>
      portfolio
        .filter((e) => e.profileId === p.id && e.projectType === apiType && e.visible !== false)
        .map((e) => ({ ...e, talentName: p.displayName, talentId: p.id, talentPhoto: p.photoUrl })),
    )
    .slice(0, 8);

  return (
    <section style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--color-border)', background: 'var(--color-card)' }}>
      {/* Section Header */}
      <div style={{ background: TYPE_BG[slug], padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff' }}>
          <div style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {TYPE_ICONS[slug]}
          </div>
          <div>
            <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>{label}</h2>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', marginTop: '1px' }}>Portfolio credits</p>
          </div>
        </div>
        <Link to={`/works/${slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)', padding: '0.4rem 0.9rem', borderRadius: '99px', transition: 'all 0.2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          View all <ChevronRight size={13} />
        </Link>
      </div>

      <div style={{ padding: '1.75rem' }}>
        {credits.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {credits.map((e) => (
              <div key={e.id} style={{ width: '100%' }}>
                <CreditCard entry={e} talentName={e.talentName} talentId={e.talentId} talentPhoto={e.talentPhoto} />
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', textAlign: 'center', padding: '2rem' }}>
            No {label.toLowerCase()} credits yet.
          </p>
        )}
      </div>
    </section>
  );
}

/* ===================================================================
   STATS TICKER
=================================================================== */
function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '1.25rem 2rem', borderRight: '1px solid rgba(255,255,255,0.15)' }}>
      <div className="font-serif" style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.72rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '6px' }}>{label}</div>
    </div>
  );
}

function StatsBar({ statsData }: { statsData: Record<string, unknown> }) {
  const stats = [
    { value: String(statsData.stat1Value || '500+'), label: String(statsData.stat1Label || 'Verified Talents') },
    { value: String(statsData.stat2Value || '120+'), label: String(statsData.stat2Label || 'Active Casting Calls') },
    { value: String(statsData.stat3Value || '50+'), label: String(statsData.stat3Label || 'Productions Served') },
    { value: String(statsData.stat4Value || ''), label: String(statsData.stat4Label || '') },
  ].filter(s => s.value || s.label);

  if (stats.length === 0) return null;

  return (
    <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '2.5rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ flex: '1 1 200px', minWidth: '180px', textAlign: 'center', padding: '1rem', borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
              <div className="font-serif" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   HOW IT WORKS STEP
=================================================================== */
function HowItWorksStep({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: 'var(--color-primary-subtle)',
        border: '2px solid var(--color-primary-tint)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-serif)',
        fontSize: '1.2rem',
        fontWeight: 800,
        color: 'var(--color-primary)',
      }}>
        {step}
      </div>
      <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-foreground)' }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

function EventsSection({ eventsSectionData }: { eventsSectionData: Record<string, unknown> }) {
  const events = useAppSelector((s) => s.data.events.filter((e) => e.status === 'active' && e.visible !== false).slice(0, 8));
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 340 : -340, behavior: 'smooth' });
  };

  if (events.length === 0) return null;

  return (
    <section style={{ padding: '4rem 0', background: 'var(--color-background)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="section-eyebrow">{String(eventsSectionData.eyebrow || 'Coming Up')}</div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--color-foreground)' }}>
              {String(eventsSectionData.title || 'Events & Shows')}
            </h2>
            {Boolean(eventsSectionData.subtitle) && (
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)', marginTop: '0.4rem' }}>{String(eventsSectionData.subtitle)}</p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to={String(eventsSectionData.viewAllLink || '/event/all')} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', marginRight: '0.5rem' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}
            >
              {String(eventsSectionData.viewAllText || 'View all events')} <ArrowRight size={14} />
            </Link>
            <button className="scroll-btn" onClick={() => scroll('left')} aria-label="Scroll left">
              <ChevronLeft size={16} />
            </button>
            <button className="scroll-btn" onClick={() => scroll('right')} aria-label="Scroll right">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="rca-scroller" style={{ paddingBottom: '0.5rem' }}>
          {events.map((ev, i) => (
            <div key={ev.id} style={{ width: '320px', flexShrink: 0 }} className={`animate-slide-up stagger-${Math.min(i + 1, 3)}`}>
              <Link to={`/event/${ev.id}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }} className="rca-card">
                <div style={{ position: 'relative', aspectRatio: '16/10', background: 'var(--color-muted)', overflow: 'hidden' }}>
                  <img
                    src={ev.imageUrl}
                    alt={ev.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'}
                    onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
                  />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--color-primary)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {ev.eventType}
                  </span>
                </div>
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <h3 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-foreground)', lineHeight: 1.2 }}>
                    {ev.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={12} /> {ev.eventDate || 'TBA'}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={12} /> {ev.location}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedTalentScroller({ profiles }: { profiles: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button className="scroll-btn" onClick={() => scroll('left')}><ChevronLeft size={16} /></button>
        <button className="scroll-btn" onClick={() => scroll('right')}><ChevronRight size={16} /></button>
      </div>
      <div ref={scrollRef} className="rca-scroller">
        {profiles.map((p: any, i: number) => (
          <div key={p.id} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`} style={{ width: '260px' }}>
            <TalentCard profile={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================================================================
   HOME PAGE
=================================================================== */
export default function Home() {
  const allProfilesCount = useAppSelector((s) => s.data.profiles.length);
  const allCastingCount = useAppSelector((s) => s.data.casting.length);
  const profiles = useAppSelector((s) =>
    s.data.profiles.filter((p) => p.isFeatured && p.status === 'approved'),
  );
  
  const homePagesData = useAppSelector((s) => s.pages.home || {});
  const heroData = homePagesData.hero || { visible: true };
  const statsData = homePagesData.stats || { visible: true };
  const featuredData = homePagesData.featured || { visible: true };
  const castingData = homePagesData.casting || { visible: true };
  const worksData = homePagesData.works || { visible: true };
  const ctaData = homePagesData.cta || { visible: true };
  const howItWorksData = homePagesData.howItWorks || { visible: true };
  const testimonialsData = homePagesData.testimonials || { visible: true };
  const eventsSectionData = homePagesData.events || { visible: true };

  const portfolio = useAppSelector((s) => s.data.portfolio);

  const hasVisibleWork = (apiType: ProjectType) => {
    return profiles.some(p =>
      portfolio.some(e => e.profileId === p.id && e.projectType === apiType && e.visible !== false)
    );
  };

  useSEO({
    title: homePagesData.seo?.title as string || 'Rajasthani Cinema Association — India\'s Premier Cinema Association',
    description: homePagesData.seo?.description as string || 'Discover and connect with top film, TV, and commercial talent across Rajasthan and India.',
    keywords: homePagesData.seo?.keywords as string || 'talent, casting, actors, models, Rajasthan, India, film, television',
    ogImage: homePagesData.seo?.ogImage as string || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop',
    canonicalUrl: homePagesData.seo?.canonicalUrl as string || typeof window !== 'undefined' ? window.location.href : undefined,
  });

  return (
    <div className="animate-fade-in">

      {/* ── HERO EVENT SLIDER ── */}
      {heroData.visible !== false && (
        <HeroEventSlider heroData={heroData as Record<string, unknown>} />
      )}

      {/* ── STATS BAR ── */}
      {statsData.visible !== false && <StatsBar statsData={statsData as Record<string, unknown>} />}

      {/* ── FEATURED TALENT HORIZONTAL SCROLLER ── */}
      {featuredData.visible !== false && (
        <section style={{ padding: '4rem 0', background: 'var(--color-background)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
            <div className="animate-slide-up" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div className="section-eyebrow">{featuredData.eyebrow || 'Curated by Rajasthani Cinema Association'}</div>
                <h2 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--color-foreground)' }}>
                  {featuredData.title || 'Featured Talent'}
                </h2>
              </div>
              <Link to="/talent" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                {featuredData.viewAllText || 'View all talent'} <ArrowRight size={15} />
              </Link>
            </div>

            <FeaturedTalentScroller profiles={profiles} />
          </div>
        </section>
      )}

      {/* ── UPCOMING EVENTS ── */}
      {eventsSectionData.visible !== false && (
        <EventsSection eventsSectionData={eventsSectionData as Record<string, unknown>} />
      )}

      {/* ── CASTING SPOTLIGHT BANNERS ── */}
      {castingData.visible !== false && (
        <CastingSpotlight castingSectionData={castingData as Record<string, unknown>} />
      )}

      {/* ── HOW IT WORKS ── */}
      {howItWorksData.visible !== false && (
      <section style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '4.5rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-eyebrow" style={{ textAlign: 'center' }}>{howItWorksData.eyebrow || 'Simple process'}</div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--color-foreground)' }}>{howItWorksData.title || 'How Rajasthani Cinema Association Works'}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
            <div className="animate-slide-up stagger-1">
              <HowItWorksStep step="01" title={howItWorksData.step1Title || "Register & Build Your ID"} desc={howItWorksData.step1Desc || "Sign up as a talent professional, fill out your profile, and build your structured portfolio of credits."} />
            </div>
            <div className="animate-slide-up stagger-2">
              <HowItWorksStep step="02" title={howItWorksData.step2Title || "Subscribe to Go Live"} desc={howItWorksData.step2Desc || "Choose a plan that fits your career stage. Once active, Rajasthani Cinema Association's team reviews and can feature your profile."} />
            </div>
            <div className="animate-slide-up stagger-3">
              <HowItWorksStep step="03" title={howItWorksData.step3Title || "Get Discovered"} desc={howItWorksData.step3Desc || "Industry professionals browse featured talent and submit inquiries through Rajasthani Cinema Association — who mediates every introduction."} />
            </div>
            <div className="animate-slide-up stagger-4">
              <HowItWorksStep step="04" title={howItWorksData.step4Title || "Apply to Casting"} desc={howItWorksData.step4Desc || "Browse open casting calls and apply with your portfolio auto-attached. Only a small fee per application."} />
            </div>
          </div>

          {/* Trust points */}
          <div style={{ marginTop: '3rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            {[
              howItWorksData.trustPoint1 || 'Admin-mediated introductions',
              howItWorksData.trustPoint2 || 'No video upload required',
              howItWorksData.trustPoint3 || 'Structured credit portfolios',
              howItWorksData.trustPoint4 || 'Rajasthan focused'
            ].filter(Boolean).map((t) => (
              <div key={String(t)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-muted-foreground)', fontWeight: 500 }}>
                <CheckCircle2 size={14} style={{ color: 'var(--color-primary)' }} /> {String(t)}
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── WORK SECTIONS (Movies, TV, Music, Drama) ── */}
      {worksData.visible !== false && (
        <section style={{ padding: '4rem 0', background: 'var(--color-background)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {WORK_TYPES.map((w) => {
              let isVisible = true;
              if (w.slug === 'movies') isVisible = worksData.moviesVisible !== false && String(worksData.moviesVisible) !== 'false' && hasVisibleWork(w.apiType);
              if (w.slug === 'tv-series') isVisible = worksData.tvVisible !== false && String(worksData.tvVisible) !== 'false' && hasVisibleWork(w.apiType);
              if (w.slug === 'music-videos') isVisible = worksData.musicVisible !== false && String(worksData.musicVisible) !== 'false' && hasVisibleWork(w.apiType);
              if (w.slug === 'short-dramas') isVisible = worksData.dramaVisible !== false && String(worksData.dramaVisible) !== 'false' && hasVisibleWork(w.apiType);

              if (!isVisible) return null;
              
              return (
                <WorkSection key={w.slug} slug={w.slug} label={w.label} apiType={w.apiType} worksEyebrow={worksData.eyebrow as string} />
              );
            })}
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {testimonialsData.visible !== false && <TestimonialsSection />}

      {/* ── CTA BANNER ── */}
      {ctaData.visible !== false && (
        <section style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          padding: '5rem 1.25rem',
          overflow: 'hidden',
        }}>
          {/* Background pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            backgroundImage: 'radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(245, 200, 66, 0.15)',
              border: '1px solid rgba(245, 200, 66, 0.3)',
              borderRadius: '99px',
              padding: '0.4rem 1rem',
              marginBottom: '1.5rem',
            }}>
              <Star size={14} style={{ color: '#F5C842' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5C842' }}>
                Join Rajasthani Cinema Association
              </span>
            </div>

            <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '1.25rem' }}>
              {ctaData.title || 'Ready to Build Your Rajasthani Cinema Association ID?'}
            </h2>

            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 2rem', whiteSpace: 'pre-wrap' }}>
              {ctaData.subtitle || "Join Rajasthan's most curated entertainment talent platform. Build your credit portfolio and get discovered by industry decision-makers."}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to={ctaData.ctaLink || '/register'} style={{
                padding: '0.9rem 2.25rem',
                background: '#F5C842',
                color: '#1a1a2e',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                {ctaData.ctaText || 'Get Started Free'} <ArrowRight size={18} />
              </Link>
              <Link to="/talent" style={{
                padding: '0.9rem 2.25rem',
                background: 'transparent',
                color: '#fff',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}>
                {ctaData.secondaryCtaText || 'Browse Talent'}
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function TestimonialsSection() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAutoScrolling = useRef(false);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 400;
    el.scrollBy({ left: dir === 'right' ? cardWidth : -cardWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getTestimonials();
        const visible = (data as any[]).filter(t => t.visible !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setItems(visible);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (!isAutoScrolling.current) return;
      const cardWidth = 400;
      const maxScroll = el.scrollWidth / 2;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'auto' });
      }
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = 400;
    const interval = setInterval(() => {
      isAutoScrolling.current = true;
      const maxScroll = el.scrollWidth / 2;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'auto' });
        setTimeout(() => {
          el.scrollBy({ left: cardWidth, behavior: 'smooth' });
          isAutoScrolling.current = false;
        }, 50);
      } else {
        el.scrollBy({ left: cardWidth, behavior: 'smooth' });
        setTimeout(() => {
          isAutoScrolling.current = false;
        }, 600);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [items.length]);

  const testimonialsData = useAppSelector((s) => s.pages?.home?.testimonials || {});

  if (testimonialsData.visible === false || items.length === 0) return null;

  const displayItems = items.length > 1 ? [...items, ...items] : items;

  return (
    <section style={{ padding: '5rem 0', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-eyebrow" style={{ textAlign: 'center' }}>{testimonialsData.eyebrow || 'Testimonials'}</div>
          <h2 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--color-foreground)' }}>
            {testimonialsData.title || 'What our talent says'}
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-muted-foreground)' }}>Loading testimonials...</div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button className="scroll-btn" onClick={() => scroll('left')}><ChevronLeft size={16} /></button>
              <button className="scroll-btn" onClick={() => scroll('right')}><ChevronRight size={16} /></button>
            </div>
            <div ref={scrollRef} className="rca-scroller" style={{ paddingBottom: '0.5rem', scrollBehavior: 'smooth' }}>
              {displayItems.map((t, i) => (
                <div key={i} style={{ width: '380px', flexShrink: 0, paddingRight: '0.75rem' }}>
                  <div style={{
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                  >
                    <Quote size={28} style={{ color: 'var(--color-primary)', opacity: 0.35 }} />
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--color-foreground)', fontStyle: 'italic', flex: 1 }}>
                      "{t.quote}"
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <img
                        src={t.authorPhoto || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop'}
                        alt={t.authorName}
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', background: 'var(--color-muted)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.authorName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)' }}>{t.authorRole}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
