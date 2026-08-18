import { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function GalleryAlbum() {
  const { eventName } = useParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getGallery()
      .then(data => {
        const decodedName = decodeURIComponent(eventName || '');
        setItems(data.filter((d: any) => d.event === decodedName));
      })
      .finally(() => setLoading(false));
  }, [eventName]);

  const decodedName = decodeURIComponent(eventName || '');
  const year = items.length > 0 ? items[0].year : '';

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft' && lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1);
      if (e.key === 'ArrowRight' && lightboxIndex < items.length - 1) setLightboxIndex(lightboxIndex + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, items.length]);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '6rem 1.25rem 3rem', maxWidth: '800px', margin: '0 auto' }}>
        <Link
          to="/gallery"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '0.5rem 1rem', borderRadius: '999px',
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            color: 'var(--color-muted-foreground)', fontSize: '0.85rem', fontWeight: 600,
            textDecoration: 'none', marginBottom: '2rem', transition: 'all 0.2s',
          }}
          className="rca-card"
        >
          <ChevronLeft size={16} /> Back to Gallery
        </Link>
        <div className="section-eyebrow" style={{ textAlign: 'center' }}>{year} &bull; Event Gallery</div>
        <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem' }}>
          {decodedName}
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-muted-foreground)', lineHeight: 1.6 }}>
          {items.length} {items.length === 1 ? 'Photo' : 'Photos'} from this event
        </p>
      </section>

      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem 5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--color-muted-foreground)' }}>Loading photos...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--color-muted-foreground)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
            No photos found for this album.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }} className="album-grid">
            {items.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="rca-card"
                style={{
                  position: 'relative',
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                }}
              >
                <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    className="album-img"
                  />
                </div>
                <div style={{ padding: '1rem 1.25rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '0.25rem' }}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxIndex(null)}
            style={{
              position: 'absolute', top: '1.5rem', right: '1.5rem',
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer', padding: '8px', zIndex: 10,
            }}
          >
            <X size={28} />
          </button>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
              style={{
                position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%', width: '48px', height: '48px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', cursor: 'pointer', zIndex: 10,
              }}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Image */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <img
              src={items[lightboxIndex].imageUrl}
              alt={items[lightboxIndex].title}
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }}
            />
            <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#fff', maxWidth: '600px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{items[lightboxIndex].title}</h3>
              {items[lightboxIndex].description && (
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{items[lightboxIndex].description}</p>
              )}
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>
                {lightboxIndex + 1} / {items.length}
              </p>
            </div>
          </div>

          {/* Next */}
          {lightboxIndex < items.length - 1 && (
            <button
              onClick={e => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
              style={{
                position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%', width: '48px', height: '48px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', cursor: 'pointer', zIndex: 10,
              }}
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}

      <style>{`
        .album-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 1024px) {
          .album-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .album-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .album-grid > div:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.08);
        }
        .album-grid > div:hover .album-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
