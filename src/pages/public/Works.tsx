import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { WORK_TYPES, type ProjectType } from '@/data/mock';
import { CreditCard } from '@/components/Cards';
import { useMemo } from 'react';
import { Film, Tv, Music, Drama } from 'lucide-react';

const ICONS: Record<string, React.ReactNode> = {
  movies: <Film size={20} />,
  'tv-series': <Tv size={20} />,
  'music-videos': <Music size={20} />,
  'short-dramas': <Drama size={20} />,
};

export default function Works() {
  const { type } = useParams<{ type: string }>();
  const workType = WORK_TYPES.find((w) => w.slug === type);
  const worksData = useAppSelector((s) => s.pages?.home?.works || {});

  const apiType = workType?.apiType as ProjectType | undefined;

  const isHidden = useMemo(() => {
    if (!workType) return false;
    if (workType.slug === 'movies') return worksData.moviesVisible === false || String(worksData.moviesVisible) === 'false';
    if (workType.slug === 'tv-series') return worksData.tvVisible === false || String(worksData.tvVisible) === 'false';
    if (workType.slug === 'music-videos') return worksData.musicVisible === false || String(worksData.musicVisible) === 'false';
    if (workType.slug === 'short-dramas') return worksData.dramaVisible === false || String(worksData.dramaVisible) === 'false';
    return false;
  }, [workType, worksData]);

  const portfolio = useAppSelector((s) => s.data.portfolio);
  const profiles = useAppSelector((s) => s.data.profiles.filter((p) => p.isFeatured && p.status === 'approved'));

  const credits = useMemo(() => {
    return profiles
      .flatMap((p) =>
        portfolio
          .filter((e) => e.profileId === p.id && e.projectType === apiType && e.visible !== false)
          .map((e) => ({ ...e, talentName: p.displayName, talentId: p.id, talentPhoto: p.photoUrl })),
      )
      .sort((a, b) => (b.releaseYear ?? 0) - (a.releaseYear ?? 0));
  }, [portfolio, profiles, apiType]);

  const hasAnyVisible = useMemo(() => {
    return credits.length > 0;
  }, [credits]);

  if (!workType) {
    return (
      <div style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <p>Work type not found.</p>
      </div>
    );
  }

  if (isHidden || !hasAnyVisible) {
    return (
      <div style={{ padding: '6rem 1.25rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
        <h2 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          This section is not available
        </h2>
        <p style={{ color: 'var(--color-muted-foreground)', marginBottom: '1.5rem' }}>
          The {workType.label} section is currently hidden or has no content.
        </p>
        <Link to="/" className="btn-primary btn-sm">← Back to Home</Link>
      </div>
    );
  }

  const bgGradients: Record<string, string> = {
    movies: 'linear-gradient(135deg, #1A2A4A 0%, #0D1B30 100%)',
    'tv-series': 'linear-gradient(135deg, #1A3A2A 0%, #0E2018 100%)',
    'music-videos': 'linear-gradient(135deg, #3A1A2A 0%, #200D18 100%)',
    'short-dramas': 'linear-gradient(135deg, #2A2A1A 0%, #181808 100%)',
  };

  return (
    <div className="animate-fade-in">

      {/* Hero header */}
      <div style={{ position: 'relative', background: bgGradients[type ?? 'movies'], overflow: 'hidden', padding: '4rem 1.25rem' }}>
        {/* Background image subtle overlay */}
        <img
          src={workType.img}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />

        <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#fff' }}>
            <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {ICONS[type ?? 'movies']}
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5C842' }}>
              {workType.label}
            </span>
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
            {workType.label}
          </h1>
          <p style={{ marginTop: '0.75rem', fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }}>
            Completed {workType.label.toLowerCase()} from featured talent portfolios.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F5C842' }}>{credits.length}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Credits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Type switcher */}
      <div style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-card)', overflowX: 'auto' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem', display: 'flex', gap: '0' }}>
          {WORK_TYPES.map((w) => (
            <a
              key={w.slug}
              href={`/works/${w.slug}`}
              style={{
                padding: '0.9rem 1.25rem',
                borderBottom: w.slug === type ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                fontSize: '0.875rem',
                fontWeight: w.slug === type ? 700 : 500,
                color: w.slug === type ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {ICONS[w.slug]} {w.label}
            </a>
          ))}
        </div>
      </div>

      {/* Credits section */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.25rem' }}>
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <span className="section-eyebrow" style={{ marginBottom: 0 }}>Portfolio credits</span>
          </div>
          {credits.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {credits.map((entry, i) => (
                <CreditCard key={entry.id} entry={entry} talentName={entry.talentName} talentId={entry.talentId} talentPhoto={entry.talentPhoto} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', color: 'var(--color-muted-foreground)' }}>
              No {workType.label.toLowerCase()} credits in featured portfolios yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
