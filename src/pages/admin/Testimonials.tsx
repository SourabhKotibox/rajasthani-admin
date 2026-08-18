import { useState, useRef, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { api } from '@/api/client';
import { Search, Trash2, Edit2, X, Upload, Plus, Star } from 'lucide-react';

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop';

export default function AdminTestimonials() {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [editItem, setEditItem] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const data = await api.getTestimonials();
      setItems(data as any[]);
    } catch (err) {
      console.error(err);
    }
  };

  useState(() => { load(); });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const { url } = await api.upload(fd);
        setPhotoUrl(url);
      } catch (err) {
        alert('Failed to upload image');
      }
    }
  };

  const filtered = items.filter(t =>
    t.authorName?.toLowerCase().includes(q.toLowerCase()) ||
    t.quote?.toLowerCase().includes(q.toLowerCase())
  );

  const handleDelete = async (id: number | string) => {
    if (confirm('Delete this testimonial?')) {
      try {
        await api.deleteTestimonial(id);
        setItems(items.filter(t => t.id !== id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete');
      }
    }
  };

  const onEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;
    const fd = new FormData(e.currentTarget);
    const updated = {
      ...editItem,
      quote: String(fd.get('quote')),
      authorName: String(fd.get('authorName')),
      authorRole: String(fd.get('authorRole')),
      authorPhoto: String(fd.get('photo')) || photoUrl || editItem.authorPhoto,
      visible: editItem.visible !== false,
      order: Number(fd.get('order') || 0),
    };
    try {
      const saved = await api.updateTestimonial(updated.id, updated as never) as any;
      setItems(items.map(t => t.id === updated.id ? saved : t));
      setEditItem(null);
      setPhotoUrl('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  const onAddSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      quote: String(fd.get('quote')),
      authorName: String(fd.get('authorName')),
      authorRole: String(fd.get('authorRole')),
      authorPhoto: String(fd.get('photo')) || photoUrl || DEFAULT_IMG,
      visible: true,
      order: Number(fd.get('order') || 0),
    };
    try {
      const saved = await api.createTestimonial(payload as never) as any;
      setItems([saved, ...items]);
      setShowAdd(false);
      setPhotoUrl('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Testimonials</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem' }}>Manage home page testimonials</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--color-surface)' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)' }} />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search by author or quote..."
              className="field"
              style={{ paddingLeft: '2.25rem', height: '36px', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="rca-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Author</th>
                <th>Quote</th>
                <th>Role</th>
                <th>Order</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} className={`animate-slide-up stagger-${Math.min(i + 1, 10)}`}>
                  <td>
                    <img src={t.authorPhoto || DEFAULT_IMG} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', background: 'var(--color-muted)' }} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{t.authorName}</div>
                  </td>
                  <td>
                    <div style={{ maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem', color: 'var(--color-muted-foreground)' }}>
                      "{t.quote}"
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-muted-foreground)' }}>{t.authorRole}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-muted-foreground)' }}>{t.order}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => { setEditItem(t); setPhotoUrl(t.authorPhoto || ''); }} className="btn-outline btn-sm" title="Edit">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="btn-outline btn-sm" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-muted-foreground)' }}>
                    No testimonials found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) { setEditItem(null); setPhotoUrl(''); } }}>
          <div className="modal-box" style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Edit Testimonial</h3>
              <button onClick={() => { setEditItem(null); setPhotoUrl(''); }} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
            </div>

            <form onSubmit={onEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
              <div>
                <label className="field-label">Quote</label>
                <textarea name="quote" rows={3} defaultValue={editItem.quote} required className="field" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Author Name</label>
                  <input name="authorName" defaultValue={editItem.authorName} required className="field" />
                </div>
                <div>
                  <label className="field-label">Author Role</label>
                  <input name="authorRole" defaultValue={editItem.authorRole} required className="field" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Order</label>
                  <input name="order" type="number" defaultValue={editItem.order} className="field" />
                </div>
                <div>
                  <label className="field-label">Photo URL</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input name="photo" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="field" style={{ flex: 1 }} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline btn-sm" style={{ flexShrink: 0 }}>
                      <Upload size={14} /> Upload
                    </button>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => { setEditItem(null); setPhotoUrl(''); }} className="btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) { setShowAdd(false); setPhotoUrl(''); } }}>
          <div className="modal-box" style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add Testimonial</h3>
              <button onClick={() => { setShowAdd(false); setPhotoUrl(''); }} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
            </div>

            <form onSubmit={onAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
              <div>
                <label className="field-label">Quote</label>
                <textarea name="quote" rows={3} required className="field" placeholder="What they said about Rajasthani Cinema Association..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Author Name</label>
                  <input name="authorName" required className="field" placeholder="Full name" />
                </div>
                <div>
                  <label className="field-label">Author Role</label>
                  <input name="authorRole" required className="field" placeholder="e.g. Actor, Model" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Order</label>
                  <input name="order" type="number" className="field" placeholder="0" />
                </div>
                <div>
                  <label className="field-label">Photo URL</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input name="photo" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="field" style={{ flex: 1 }} placeholder="https://..." />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline btn-sm" style={{ flexShrink: 0 }}>
                      <Upload size={14} /> Upload
                    </button>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => { setShowAdd(false); setPhotoUrl(''); }} className="btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm">Add Testimonial</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
