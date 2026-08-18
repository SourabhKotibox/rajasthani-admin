import { useState, useRef, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { adminUpdatePortfolio, removePortfolio, addPortfolio } from '@/store';
import { api } from '@/api/client';
import { Search, Briefcase, Trash2, Edit2, X, Filter, Upload, Eye, EyeOff, Plus, Film, Tv, Music, Drama } from 'lucide-react';
import type { PortfolioEntry, ProjectType } from '@/data/mock';

const TABS = [
  { key: 'all', label: 'All', icon: null },
  { key: 'Movie', label: 'Movies', icon: <Film size={14} /> },
  { key: 'TVSeries', label: 'TV Series', icon: <Tv size={14} /> },
  { key: 'MusicVideo', label: 'Music Videos', icon: <Music size={14} /> },
  { key: 'ShortDrama', label: 'Short Dramas', icon: <Drama size={14} /> },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function AdminPortfolio() {
  const portfolio = useAppSelector((s) => s.data.portfolio);
  const profiles = useAppSelector((s) => s.data.profiles);
  const dispatch = useAppDispatch();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<TabKey>('all');
  const [editEntry, setEditEntry] = useState<PortfolioEntry | null>(null);
  const [showAdd, setShowAdd] = useState(false);
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

  const filtered = portfolio.filter(p => {
    const matchesSearch = p.projectTitle.toLowerCase().includes(q.toLowerCase()) || 
      p.productionHouse?.toLowerCase().includes(q.toLowerCase());
    const matchesTab = tab === 'all' || p.projectType === tab;
    return matchesSearch && matchesTab;
  });

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Delete portfolio entry "${title}"?`)) {
      try {
        await api.deletePortfolio(id);
        dispatch(removePortfolio(id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete portfolio entry');
      }
    }
  };

  const toggleVisibility = async (entry: PortfolioEntry) => {
    const next = { ...entry, visible: entry.visible === false ? true : false };
    try {
      await api.updatePortfolio(next.id, next as never);
      dispatch(adminUpdatePortfolio(next));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update visibility');
    }
  };

  const onEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editEntry) return;
    const fd = new FormData(e.currentTarget);
    const updated = {
      ...editEntry,
      projectTitle: String(fd.get('title')),
      projectType: String(fd.get('type')) as ProjectType,
      role: String(fd.get('role')),
      productionHouse: String(fd.get('production') || ''),
      releaseYear: Number(fd.get('year') || new Date().getFullYear()),
      description: String(fd.get('desc') || ''),
      platform: String(fd.get('platform') || ''),
      imageUrl: String(fd.get('imageUrl')) || editEntry.imageUrl,
    };
    try {
      await api.updatePortfolio(updated.id, updated as never);
      dispatch(adminUpdatePortfolio(updated));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update portfolio entry');
    }
    setEditEntry(null);
    setCoverImage('');
  };

  const onAddSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      projectTitle: String(fd.get('title')),
      projectType: String(fd.get('type')) as ProjectType,
      role: String(fd.get('role')),
      productionHouse: String(fd.get('production') || ''),
      releaseYear: Number(fd.get('year') || new Date().getFullYear()),
      description: String(fd.get('desc') || ''),
      platform: String(fd.get('platform') || ''),
      imageUrl: String(fd.get('imageUrl')) || coverImage || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&auto=format&fit=crop',
      profileId: Number(fd.get('profileId') || 0),
    };
    try {
      const created = await api.createPortfolio(payload as never) as PortfolioEntry;
      dispatch(addPortfolio(created));
      setShowAdd(false);
      setCoverImage('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create portfolio entry');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Platform Portfolios</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem' }}>Moderate all talent portfolio entries</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Portfolio
        </button>
      </div>

      <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--color-surface)', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)' }} />
            <input 
              value={q} 
              onChange={e => setQ(e.target.value)} 
              placeholder="Search by title or production house..." 
              className="field" 
              style={{ paddingLeft: '2.25rem', height: '36px', fontSize: '0.875rem' }} 
            />
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--color-background)', padding: '0.25rem', borderRadius: '8px' }}>
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`btn-ghost ${tab === t.key ? 'active' : ''}`}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', background: tab === t.key ? 'var(--color-card)' : 'transparent', boxShadow: tab === t.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="rca-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Type & Role</th>
                <th>Owner Profile</th>
                <th>Year</th>
                <th>Visibility</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => {
                const owner = profiles.find(p => p.id === entry.profileId);
                return (
                  <tr key={entry.id} className={`animate-slide-up stagger-${Math.min(i + 1, 10)}`}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img src={entry.imageUrl} alt="" style={{ width: 36, height: 36, borderRadius: '8px', objectFit: 'cover', background: 'var(--color-muted)' }} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{entry.projectTitle}</div>
                          {entry.productionHouse && <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>{entry.productionHouse}</div>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-muted" style={{ marginBottom: '0.25rem', display: 'inline-block' }}>{entry.projectType}</span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>{entry.role}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{owner ? owner.displayName : 'Unknown'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>ID: {entry.profileId}</div>
                    </td>
                    <td style={{ color: 'var(--color-muted-foreground)' }}>{entry.releaseYear}</td>
                    <td>
                      <button 
                        onClick={() => toggleVisibility(entry)}
                        className={`btn-ghost ${entry.visible !== false ? 'active' : ''}`}
                        style={{ padding: '0.35rem', color: entry.visible !== false ? 'var(--color-success)' : 'var(--color-muted-foreground)' }}
                        title={entry.visible !== false ? 'Visible on frontend' : 'Hidden from frontend'}
                      >
                        {entry.visible !== false ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => { setEditEntry(entry); setCoverImage(entry.imageUrl); }} className="btn-outline btn-sm" title="Edit Entry">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(entry.id, entry.projectTitle)} className="btn-outline btn-sm" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} title="Delete Entry">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-muted-foreground)' }}>
                    No portfolio entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editEntry && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) { setEditEntry(null); setCoverImage(''); } }}>
          <div className="modal-box" style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Edit Portfolio Entry</h3>
              <button onClick={() => { setEditEntry(null); setCoverImage(''); }} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
            </div>

            <form onSubmit={onEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
              <div>
                <label className="field-label">Project Title</label>
                <input name="title" defaultValue={editEntry.projectTitle} required className="field" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Format / Type</label>
                  <select name="type" defaultValue={editEntry.projectType} className="field" required>
                    <option value="movies">Movie</option>
                    <option value="tv-series">TV Series</option>
                    <option value="music-videos">Music Video</option>
                    <option value="short-dramas">Short Drama</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Role</label>
                  <input name="role" defaultValue={editEntry.role} required className="field" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Release Year</label>
                  <input name="year" type="number" defaultValue={editEntry.releaseYear} className="field" />
                </div>
                <div>
                  <label className="field-label">Production House</label>
                  <input name="production" defaultValue={editEntry.productionHouse} className="field" />
                </div>
              </div>
              <div>
                <label className="field-label">Streaming Platform / Network</label>
                <input name="platform" defaultValue={editEntry.platform} className="field" />
              </div>
              <div>
                <label className="field-label">Cover Image URL</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input name="imageUrl" value={coverImage} onChange={e => setCoverImage(e.target.value)} className="field" style={{ flex: 1 }} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline btn-sm" style={{ flexShrink: 0 }}>
                    <Upload size={14} /> Upload
                  </button>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                </div>
              </div>
              <div>
                <label className="field-label">Brief Description</label>
                <textarea name="desc" rows={3} defaultValue={editEntry.description} className="field" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => { setEditEntry(null); setCoverImage(''); }} className="btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) { setShowAdd(false); setCoverImage(''); } }}>
          <div className="modal-box" style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add Portfolio Entry</h3>
              <button onClick={() => { setShowAdd(false); setCoverImage(''); }} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
            </div>

            <form onSubmit={onAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
              <div>
                <label className="field-label">Project Title</label>
                <input name="title" required className="field" placeholder="e.g. Jaipur Nights" />
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
                  <label className="field-label">Role</label>
                  <input name="role" required className="field" placeholder="e.g. Lead Actor" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Release Year</label>
                  <input name="year" type="number" className="field" placeholder="2025" />
                </div>
                <div>
                  <label className="field-label">Production House</label>
                  <input name="production" className="field" placeholder="Studio name" />
                </div>
              </div>
              <div>
                <label className="field-label">Owner Profile ID</label>
                <input name="profileId" type="number" className="field" placeholder="Profile ID this entry belongs to" />
              </div>
              <div>
                <label className="field-label">Streaming Platform / Network</label>
                <input name="platform" className="field" placeholder="Netflix, YouTube, etc." />
              </div>
              <div>
                <label className="field-label">Cover Image URL</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input name="imageUrl" value={coverImage} onChange={e => setCoverImage(e.target.value)} className="field" style={{ flex: 1 }} placeholder="https://..." />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline btn-sm" style={{ flexShrink: 0 }}>
                    <Upload size={14} /> Upload
                  </button>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                </div>
              </div>
              <div>
                <label className="field-label">Brief Description</label>
                <textarea name="desc" rows={3} className="field" placeholder="Short description of the project..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => { setShowAdd(false); setCoverImage(''); }} className="btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm">Add Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
