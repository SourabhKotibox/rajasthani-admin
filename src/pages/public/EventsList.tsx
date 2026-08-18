import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { Calendar, MapPin, Users, ChevronRight, Sparkles } from 'lucide-react';

export default function EventsList() {
  const events = useAppSelector((s) => s.data.events);

  const active = useMemo(() => {
    return [...events]
      .filter((e) => e.status === 'active' && e.visible !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [events]);

  return (
    <div className="animate-fade-in" style={{ minHeight: '100dvh', background: 'var(--color-background)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.25rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="section-eyebrow" style={{ marginBottom: '0.75rem' }}>Events & Shows</div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--color-foreground)', lineHeight: 1.1 }}>
            Upcoming Events
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-muted-foreground)', marginTop: '0.75rem', maxWidth: '560px', lineHeight: 1.6 }}>
            Browse fashion shows, talent shows, and casting opportunities. Participate directly from the event page.
          </p>
        </div>

        {active.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.25rem', background: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: '16px' }}>
            <Sparkles size={40} style={{ marginBottom: '1rem', opacity: 0.4, color: 'var(--color-muted-foreground)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No events yet</h2>
            <p style={{ color: 'var(--color-muted-foreground)', fontSize: '0.9rem' }}>Check back soon for upcoming shows and casting calls.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {active.map((event, i) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}
                style={{
                  display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden',
                  border: '1px solid var(--color-border)', background: 'var(--color-card)',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-strong)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                }}
              >
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img
                    src={event.imageUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"}
                    alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,25,23,0.7) 0%, transparent 55%)' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--color-primary)', color: '#fff', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '99px' }}>
                    {event.eventType}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                  <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.25 }}>{event.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-foreground)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {event.rolesDescription || event.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} style={{ color: 'var(--color-primary)' }} /> {event.eventDate || 'TBA'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} style={{ color: 'var(--color-primary)' }} /> {event.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Users size={13} style={{ color: 'var(--color-primary)' }} /> {(event.roles || []).length} roles
                    </span>
                  </div>
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                    View details <ChevronRight size={15} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
