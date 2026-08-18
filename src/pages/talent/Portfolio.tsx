import { useState, useRef, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addPortfolio, removePortfolio } from '@/store';
import { api } from '@/api/client';
import { CreditCard as CreditCardUi } from '@/components/Cards';
import { Plus, X, Trash2, Film, Tv, Music, Drama, Briefcase, Video, Upload } from 'lucide-react';
import type { ProjectType } from '@/data/mock';

export default function Portfolio() {
  const user = useAppSelector((s) => s.auth.user)!;
  const profile = useAppSelector((s) => s.data.profiles.find((p) => p.userId === user.id || p.userId === Number(user.id)));
  const entries = useAppSelector((s) => s.data.portfolio.filter((e) => profile && e.profileId === profile.id));
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const { url } = await api.upload(fd);
        setCoverImage(url);
      } catch (err) {
        alert('Failed to upload image');
      }
    }
  };

  if (!profile) {
    return (
      <div style={{ background: 'var(--color-surface)', padding: '3rem 1.25rem', textAlign: 'center', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
        <Briefcase size={40} style={{ color: 'var(--color-muted-foreground)', opacity: 0.5, margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Profile Required</h2>
        <p style={{ color: 'var(--color-muted-foreground)', fontSize: '0.9rem' }}>
          You must set up your professional profile before adding portfolio credits.
        </p>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      profileId: profile.id,
      projectTitle: String(fd.get('title')),
      projectType: String(fd.get('type')) as ProjectType,
      role: String(fd.get('role')),
      productionHouse: String(fd.get('production') || ''),
      releaseYear: Number(fd.get('year') || new Date().getFullYear()),
      description: String(fd.get('desc') || ''),
      platform: String(fd.get('platform') || ''),
      imageUrl: String(fd.get('imageUrl') || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop'),
    };
    try {
      const created = await api.createPortfolio(body as never);
      dispatch(addPortfolio(created as never));
    } catch {
      dispatch(addPortfolio(body));
    }
    setOpen(false);
    setCoverImage('');
  };

  const handleDelete = async (id: number) => {
    if (confirm('Remove this portfolio entry?')) {
      try {
        await api.deletePortfolio(id);
        dispatch(removePortfolio(id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Portfolio Credits</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem' }}>Build your verified body of work</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary btn-sm">
          <Plus size={14} /> Add Credit
        </button>
      </div>

      {entries.length === 0 ? (
        <div style={{ background: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: '14px', padding: '4rem 1.25rem', textAlign: 'center' }}>
          <Video size={40} style={{ margin: '0 auto 1rem', opacity: 0.35, color: 'var(--color-muted-foreground)' }} />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>No portfolio entries yet</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginBottom: '1.5rem', maxWidth: '360px', margin: '0 auto 1.5rem' }}>
            Add your previous work in movies, TV series, music videos, and short dramas to showcase your experience to casting directors.
          </p>
          <button onClick={() => setOpen(true)} className="btn-outline btn-sm">
            <Plus size={14} /> Add First Credit
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {entries.map((e, i) => (
            <div key={e.id} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`} style={{ position: 'relative' }}>
              <CreditCardUi entry={e} />
              <button
                onClick={() => handleDelete(e.id)}
                className="btn-danger"
                style={{ position: 'absolute', top: '12px', right: '12px', padding: '0.35rem', borderRadius: '8px', zIndex: 10, background: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-danger)' }}
                title="Remove credit"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="modal-box" style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add Portfolio Credit</h3>
              <button onClick={() => setOpen(false)} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
            </div>

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="field-label">Project Title</label>
                <input name="title" required placeholder="e.g. Jaipur Half Life" className="field" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Format / Type</label>
                  <select name="type" className="field" required>
                    <option value="movies">Movie</option>
                    <option value="tv-series">TV Series</option>
                    <option value="music-videos">Music Video</option>
                    <option value="short-dramas">Short Drama</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Your Role</label>
                  <input name="role" required placeholder="e.g. Lead Actor, Director" className="field" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Release Year</label>
                  <input name="year" type="number" defaultValue={new Date().getFullYear()} className="field" />
                </div>
                <div>
                  <label className="field-label">Production House</label>
                  <input name="production" placeholder="Optional" className="field" />
                </div>
              </div>
              <div>
                <label className="field-label">Streaming Platform / Network</label>
                <input name="platform" placeholder="e.g. Netflix, Showmax, YouTube" className="field" />
              </div>
              <div>
                <label className="field-label">Cover Image URL</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input name="imageUrl" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Poster or still image URL" className="field" style={{ flex: 1 }} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline btn-sm" style={{ flexShrink: 0 }}>
                    <Upload size={14} /> Upload
                  </button>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                </div>
              </div>
              <div>
                <label className="field-label">Brief Description</label>
                <textarea name="desc" rows={3} placeholder="Describe the project and your involvement…" className="field" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setOpen(false)} className="btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm">Add Credit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
