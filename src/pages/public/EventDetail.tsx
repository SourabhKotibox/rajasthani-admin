import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import type { EventItem } from '@/data/mock';
import { api } from '@/api/client';
import EventApplyFlow from '@/components/EventApplyFlow';
import {
  Calendar, Clock, MapPin, Building2, BadgeCheck, Users, Send,
  Clapperboard, Dot, Globe,
} from 'lucide-react';

const TYPE_LABEL: Record<string, string> = {
  Movie: 'Movie', TVSeries: 'TV Series', MusicVideo: 'Music Video', ShortDrama: 'Short Drama',
};

export default function EventDetail() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const stored = useAppSelector((s) =>
    s.data.events.find((e) => String(e.id) === String(id)),
  );

  useEffect(() => {
    if (stored) {
      setEvent(stored);
      return;
    }
    if (!id || id === 'all') return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.getEventById(id);
        if (!cancelled) setEvent(res as EventItem);
      } catch {
        if (!cancelled) setEvent(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, stored]);

  if (!id || id === 'all') {
    return (
      <div style={{ padding: '6rem 1.25rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✦</div>
        <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Browse Events
        </h2>
        <p style={{ color: 'var(--color-muted-foreground)', marginBottom: '1.5rem' }}>
          See all open events and casting opportunities on the Casting Board.
        </p>
        <Link to="/casting" className="btn-primary btn-sm">Go to Casting Board</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '6rem 1.25rem', textAlign: 'center', color: 'var(--color-muted-foreground)' }}>
        Loading event…
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ padding: '6rem 1.25rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Event not found</p>
        <Link to="/" className="btn-primary btn-sm">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {showForm && (
        <EventApplyFlow event={event} onClose={() => setShowForm(false)} />
      )}

      {/* Hero */}
      <div style={{ position: 'relative', height: 'clamp(260px, 40vw, 420px)', overflow: 'hidden' }}>
        <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,25,23,0.92) 0%, rgba(28,25,23,0.45) 55%, rgba(28,25,23,0.1) 100%)' }} />

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem 2.5rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '1rem' }}>
            ← Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5C842' }}>
              {event.eventType}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ fontSize: '0.72rem', color: event.status === 'active' ? '#6fcf97' : 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
              {event.status === 'active' ? '● Accepting Participants' : '○ Not accepting'}
            </span>
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(1.9rem, 5vw, 3.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.05 }}>
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.25rem' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: '2.5rem', flexWrap: 'wrap' as const,
        }}>

          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
                style={{ fontSize: '0.95rem', padding: '0.8rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Send size={16} /> Participate
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-muted-foreground)' }}>
                Free to participate
              </span>
            </div>

            <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-foreground)' }}>
              {event.rolesDescription || event.description}
            </p>

            {/* What to expect */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.4rem' }}>
              <h2 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={16} style={{ color: 'var(--color-primary)' }} /> About This Event
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)', lineHeight: 1.7 }}>
                {event.description}
              </p>
            </div>

            {/* Roles */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.4rem' }}>
              <h2 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={16} style={{ color: 'var(--color-primary)' }} /> Open Roles
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(event.roles || []).map((r) => (
                  <span key={r} style={{
                    padding: '0.45rem 1rem', border: '1.5px solid var(--color-border)',
                    borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500,
                    color: 'var(--color-foreground)', background: 'var(--color-card)',
                  }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.4rem' }}>
              <h2 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BadgeCheck size={16} style={{ color: 'var(--color-primary)' }} /> Eligibility
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)', lineHeight: 1.7 }}>
                {event.eligibilityCriteria}
              </p>
            </div>

            {/* Apply CTA */}
            <div style={{ background: 'var(--color-primary-subtle)', border: '1px solid var(--color-primary-tint)', borderRadius: '12px', padding: '1.5rem' }}>
              <p style={{ color: 'var(--color-foreground)', marginBottom: '1rem', fontWeight: 500 }}>
                Ready to join <strong>{event.title}</strong>? Submit your application below.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Clapperboard size={15} /> Open Application Form
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content', position: 'sticky', top: '90px' }}>
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={event.imageUrl} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>
                  <Building2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span>{event.productionHouse}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>
                  <MapPin size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span>{event.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>
                  <Calendar size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span>Event: <strong style={{ color: 'var(--color-foreground)' }}>{event.eventDate || 'TBA'}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>
                  <Clock size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span>Apply by: <strong style={{ color: 'var(--color-foreground)' }}>{event.deadline}</strong></span>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.85rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', marginBottom: '0.25rem' }}>Application Fee</div>
                  <div className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-success)' }}>
                    Free
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>
                  Status: <span style={{ fontWeight: 700, color: event.status === 'active' ? 'var(--color-success)' : 'var(--color-danger)' }}>{event.status}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--color-muted-foreground)' }}>
                  <Dot size={14} /> <span>Project: {TYPE_LABEL[event.projectType] || event.projectType}</span>
                </div>
              </div>
            </div>

            <Link
              to="/casting"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                fontSize: '0.875rem', color: 'var(--color-muted-foreground)',
                textDecoration: 'none', padding: '0.75rem',
                border: '1px solid var(--color-border)', borderRadius: '10px',
                background: 'var(--color-surface)', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--color-muted-foreground)'}
            >
              More events &amp; casting
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
