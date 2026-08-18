import { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { Link } from 'react-router-dom';
import { ChevronRight, Camera } from 'lucide-react';

export default function Gallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getGallery()
      .then(data => {
        setItems(data);
        const years = Array.from(new Set(data.map((d: any) => d.year).filter(Boolean))).sort().reverse() as string[];
        if (years.length > 0) setSelectedYear(years[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const years = Array.from(new Set(items.map(d => d.year).filter(Boolean))).sort().reverse() as string[];
  const filteredItems = selectedYear ? items.filter(d => d.year === selectedYear) : items;

  // Group by event to form Albums
  const eventsMap = new Map<string, { year: string; items: any[] }>();
  filteredItems.forEach(item => {
    const ev = item.event || 'Other';
    if (!eventsMap.has(ev)) eventsMap.set(ev, { year: item.year, items: [] });
    eventsMap.get(ev)!.items.push(item);
  });
  const albums = Array.from(eventsMap.entries()).map(([name, data]) => ({
    name,
    year: data.year,
    coverPhoto: data.items[0]?.imageUrl,
    photos: data.items,
    photoCount: data.items.length,
  }));

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '6rem 1.25rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="section-eyebrow" style={{ textAlign: 'center' }}>Event Albums</div>
        <h1 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
          Our Gallery
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-muted-foreground)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          Browse through albums of our glorious moments and past events.
        </p>
      </section>

      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem 5rem' }}>
        {/* Year Filter */}
        {years.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <button
              onClick={() => setSelectedYear(null)}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: '999px',
                fontSize: '0.875rem',
                fontWeight: 700,
                border: !selectedYear ? 'none' : '1px solid var(--color-border)',
                background: !selectedYear ? 'var(--color-primary)' : 'var(--color-surface)',
                color: !selectedYear ? '#fff' : 'var(--color-muted-foreground)',
                cursor: 'pointer',
                transition: 'all 0.25s',
              }}
            >
              All Years
            </button>
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: selectedYear === year ? 'none' : '1px solid var(--color-border)',
                  background: selectedYear === year ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: selectedYear === year ? '#fff' : 'var(--color-muted-foreground)',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                }}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {/* Albums Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--color-muted-foreground)' }}>Loading albums...</div>
        ) : albums.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--color-muted-foreground)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
            No albums found for this year.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="gallery-grid">
            {albums.map((album, idx) => (
              <Link
                key={idx}
                to={`/gallery/${encodeURIComponent(album.name)}`}
                className="rca-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                }}
              >
                {/* Cover Image */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--color-surface)' }}>
                  {album.coverPhoto ? (
                    <img
                      src={album.coverPhoto}
                      alt={album.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted-foreground)' }}>
                      <Camera size={48} />
                    </div>
                  )}
                  {/* Photo count badge */}
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                    color: '#fff', padding: '4px 12px', borderRadius: '999px',
                    fontSize: '0.75rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <Camera size={12} /> {album.photoCount}
                  </div>
                  {/* Thumbnail strip */}
                  {album.photos.length > 1 && (
                    <div style={{
                      position: 'absolute', bottom: '0', left: '0', right: '0',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      padding: '2rem 12px 12px',
                      display: 'flex', gap: '6px', justifyContent: 'flex-end',
                    }}>
                      {album.photos.slice(1, 4).map((p: any, i: number) => (
                        <div key={i} style={{
                          width: '40px', height: '40px', borderRadius: '6px',
                          overflow: 'hidden', border: '2px solid rgba(255,255,255,0.5)',
                          flexShrink: 0,
                        }}>
                          <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                      {album.photos.length > 4 && (
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '6px',
                          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                          border: '2px solid rgba(255,255,255,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: '0.7rem', fontWeight: 800,
                        }}>
                          +{album.photos.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.25rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const,
                    letterSpacing: '0.08em', color: 'var(--color-primary)', marginBottom: '0.5rem',
                  }}>
                    {album.year} &bull; Event
                  </div>
                  <h3 className="font-serif" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-foreground)', lineHeight: 1.3, marginBottom: '0.75rem' }}>
                    {album.name}
                  </h3>
                  <div style={{
                    marginTop: 'auto', display: 'flex', alignItems: 'center',
                    fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)',
                  }}>
                    View Album <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .gallery-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .gallery-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
        }
        .gallery-grid a:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
        }
        .gallery-grid a:hover img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
