import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { useMemo, useState } from 'react';
import { CastingCard } from '@/components/Cards';
import { Clapperboard, Film, Tv, Music, Drama } from 'lucide-react';

const FILTERS = [
  { value: 'all', label: 'All', icon: <Clapperboard size={13} /> },
  { value: 'Movie', label: 'Movies', icon: <Film size={13} /> },
  { value: 'TVSeries', label: 'TV Series', icon: <Tv size={13} /> },
  { value: 'MusicVideo', label: 'Music Videos', icon: <Music size={13} /> },
  { value: 'ShortDrama', label: 'Short Dramas', icon: <Drama size={13} /> },
];

export default function CastingDir() {
  const casting = useAppSelector((s) => s.data.casting.filter((c) => c.status === 'open'));
  const [type, setType] = useState('all');

  const filtered = useMemo(
    () => (type === 'all' ? casting : casting.filter((c) => c.projectType === type)),
    [casting, type],
  );

  return (
    <div className="animate-fade-in">

      {/* Page header */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '3rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
          <div className="section-eyebrow">Open Opportunities</div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '0.75rem' }}>
            Casting Board
          </h1>
          <p style={{ color: 'var(--color-muted-foreground)', marginBottom: '2rem', maxWidth: '560px', fontSize: '0.95rem' }}>
            Open roles for movies, TV series, music videos, and short dramas. Apply with your Rajasthani Cinema Association portfolio.
          </p>

          {/* Type filter pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setType(f.value)}
                className={`pill-filter ${type === f.value ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginBottom: '1.5rem', fontWeight: 500 }}>
          {filtered.length} open casting call{filtered.length !== 1 ? 's' : ''}
        </p>

        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {filtered.map((c, i) => (
              <div key={String(c.id)} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                <CastingCard call={c} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--color-muted-foreground)' }}>
            <Clapperboard size={40} style={{ margin: '0 auto 1rem', opacity: 0.35 }} />
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No casting calls in this category</p>
            <button className="btn-outline btn-sm" style={{ marginTop: '1rem' }} onClick={() => setType('all')}>
              View all
            </button>
          </div>
        )}

        <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginBottom: '0.75rem' }}>
            Looking for credits by format?
          </p>
          <Link to="/works/movies" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Browse by format →
          </Link>
        </div>
      </div>
    </div>
  );
}
