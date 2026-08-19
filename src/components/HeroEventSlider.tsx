import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { type EventItem } from '@/data/mock';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users, Send, Sparkles } from 'lucide-react';

export default function HeroEventSlider({ heroData }: { heroData?: Record<string, unknown> }) {
  const events = useAppSelector((s) => s.data.events);
  const navigate = useNavigate();

  const active = [...events]
    .filter((e) => e.status === 'active' && e.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const [index, setIndex] = useState(0);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + active.length) % active.length);
  }, [active.length]);

  useEffect(() => {
    if (active.length <= 1) return;
    const id = setInterval(() => go(1), 5000);
    return () => clearInterval(id);
  }, [active.length, go]);

  if (active.length === 0) {
    return (
      <section style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)' }}>
        <div style={{ textAlign: 'center', color: 'var(--color-muted-foreground)' }}>
          <Sparkles size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{String(heroData?.title || 'No events yet')}</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>{String(heroData?.subtitle || 'Check back soon for upcoming shows and casting calls.')}</p>
        </div>
      </section>
    );
  }

  const event = active[index];

  return (
    <section style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
      {/* Background image */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={event.imageUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'opacity 0.6s ease' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,25,23,0.95) 0%, rgba(28,25,23,0.6) 50%, rgba(28,25,23,0.25) 100%)' }} />
      </div>

      {/* Navigation arrows */}
      {active.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            style={{
              position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)',
              zIndex: 10, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '44px', height: '44px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.25)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
            aria-label="Previous event"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => go(1)}
            style={{
              position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)',
              zIndex: 10, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '44px', height: '44px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.25)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
            aria-label="Next event"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {active.length > 1 && (
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
          {active.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? '24px' : '8px', height: '8px', borderRadius: '99px',
                border: 'none', background: i === index ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer', transition: 'all 0.3s', padding: 0,
              }}
              aria-label={`Go to event ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '6rem 1.25rem 4rem', width: '100%' }}>
        <div className="animate-slide-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(250,147,26,0.3)', border: '1px solid rgba(250,147,26,0.7)', borderRadius: '99px', padding: '0.6rem 1.5rem', marginBottom: '1.75rem' }}>
          <Sparkles size={20} style={{ color: '#F5C842' }} />
          <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F5C842' }}>
            {String(heroData?.eyebrow || event.eventType)}
          </span>
        </div>

        <h1 className="font-serif animate-slide-up stagger-1" style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: '800px', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}>
          {event.title}
        </h1>

        <p className="animate-slide-up stagger-2" style={{ marginTop: '1.25rem', fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.75)', maxWidth: '600px', lineHeight: 1.65 }}>
          {event.rolesDescription}
        </p>

        <div className="animate-slide-up stagger-3" style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={15} style={{ color: 'var(--color-primary)' }} /> {event.productionHouse}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={15} style={{ color: 'var(--color-primary)' }} /> {event.eventDate || 'TBA'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={15} style={{ color: 'var(--color-primary)' }} /> {event.location}
          </span>
        </div>

        <div className="animate-slide-up stagger-4" style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            onClick={() => navigate(`/event/${event.id}`)}
            style={{
              background: 'var(--color-primary)', color: '#fff', border: 'none',
              padding: '0.75rem 1.75rem', borderRadius: '8px', fontWeight: 700,
              fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-hover)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-primary)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <Send size={16} /> {String(heroData?.ctaText || 'Participate')}
          </button>
          <Link
            to={String(heroData?.ctaLink || '/event/all')}
            style={{
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.35)', padding: '0.75rem 1.75rem',
              borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem',
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.6)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'; }}
          >
            {String(heroData?.secondaryCtaText || 'View all events')} <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
