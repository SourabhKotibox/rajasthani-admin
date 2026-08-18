import { FormEvent, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addCasting, updateCastingStatus, deleteCasting, adminUpdateCasting } from '@/store';
import { api } from '@/api/client';
import { Plus, X, Clapperboard, Calendar, DollarSign, Activity, Trash2, Edit2, Upload } from 'lucide-react';
import type { ProjectType, CastingCall } from '@/data/mock';

export default function AdminCasting() {
  const casting = useAppSelector((s) => s.data.casting);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [editCasting, setEditCasting] = useState<CastingCall | null>(null);
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      projectTitle: String(fd.get('title')),
      projectType: String(fd.get('type')) as ProjectType,
      productionHouse: String(fd.get('house')),
      rolesDescription: String(fd.get('desc')),
      roles: String(fd.get('roles')).split(',').map(s => s.trim()),
      eligibilityCriteria: String(fd.get('eligibility')),
      deadline: String(fd.get('deadline')),
      applicationFee: Number(fd.get('fee') || 0),
      status: 'open' as const,
      imageUrl: String(fd.get('imageUrl') || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800'),
    };
    try {
      const created = await api.createCasting(body as never) as CastingCall;
      dispatch(addCasting(created as never));
    } catch {
      dispatch(addCasting(body));
    }
    setOpen(false);
    setCoverImage('');
  };

  const onEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editCasting) return;
    const fd = new FormData(e.currentTarget);
    const updated = {
      ...editCasting,
      projectTitle: String(fd.get('title')),
      projectType: String(fd.get('type')) as ProjectType,
      productionHouse: String(fd.get('house')),
      rolesDescription: String(fd.get('desc')),
      roles: String(fd.get('roles')).split(',').map(s => s.trim()),
      eligibilityCriteria: String(fd.get('eligibility')),
      deadline: String(fd.get('deadline')),
      applicationFee: Number(fd.get('fee') || 0),
      imageUrl: String(fd.get('imageUrl')) || editCasting.imageUrl,
    };
    try {
      await api.updateCasting(updated.id, updated as never);
      dispatch(adminUpdateCasting(updated));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update casting call');
    }
    setEditCasting(null);
    setCoverImage('');
  };

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Delete casting call for ${title}? This will also delete all applications for it.`)) {
      try {
        await api.deleteCasting(id);
        dispatch(deleteCasting(id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete casting call');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Casting Calls</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem' }}>Manage platform casting opportunities</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary btn-sm">
          <Plus size={14} /> New Casting Call
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {casting.length === 0 ? (
          <div style={{ background: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: '14px', padding: '4rem 1.25rem', textAlign: 'center' }}>
            <Activity size={40} style={{ margin: '0 auto 1rem', opacity: 0.35, color: 'var(--color-muted-foreground)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>No casting calls</h2>
            <button onClick={() => setOpen(true)} className="btn-outline btn-sm" style={{ marginTop: '1rem' }}>
              Create the first one
            </button>
          </div>
        ) : (
          casting.map((c, i) => (
            <div key={c.id} className={`rca-card animate-slide-up stagger-${Math.min(i + 1, 10)}`} style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '120px', height: '80px', borderRadius: '8px', background: 'var(--color-muted)', overflow: 'hidden', flexShrink: 0 }}>
                <img src={c.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700 }}>{c.projectTitle}</h3>
                  <span className="badge badge-muted">{c.projectType}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-foreground)', marginBottom: '0.5rem' }}>{c.productionHouse}</p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-foreground)', opacity: 0.8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={13} /> {c.deadline}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><DollarSign size={13} /> ₹ {c.applicationFee} fee</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Status</div>
                  <span className={`badge ${c.status === 'open' ? 'badge-success' : 'badge-danger'}`}>
                    {c.status}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => { setEditCasting(c); setCoverImage(c.imageUrl); }} className="btn-outline btn-sm" title="Edit">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(c.id, c.projectTitle)} className="btn-outline btn-sm" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <select
                    className="field"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', height: 'auto', width: 'auto' }}
                    value={c.status}
                    onChange={(e) => dispatch(updateCastingStatus({ id: c.id, status: e.target.value as 'open' | 'closed' }))}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {open && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setCoverImage(''); } }}>
          <div className="modal-box" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Post Casting Call</h3>
              <button onClick={() => { setOpen(false); setCoverImage(''); }} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
            </div>

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Project Title</label>
                  <input name="title" required placeholder="e.g. Untitled Thriller" className="field" />
                </div>
                <div>
                  <label className="field-label">Format / Type</label>
                  <select name="type" className="field" required>
                    <option value="Movie">Movie</option>
                    <option value="TVSeries">TV Series</option>
                    <option value="MusicVideo">Music Video</option>
                    <option value="ShortDrama">Short Drama</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Production House</label>
                  <input name="house" required placeholder="Company name" className="field" />
                </div>
                <div>
                  <label className="field-label">Image URL</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input name="imageUrl" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="Optional" className="field" style={{ flex: 1 }} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline btn-sm" style={{ flexShrink: 0 }}>
                      <Upload size={14} /> Upload
                    </button>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                  </div>
                </div>
              </div>

              <div>
                <label className="field-label">Roles Needed (comma-separated)</label>
                <input name="roles" required placeholder="Lead Actor, Extra, Stunt Double" className="field" />
              </div>
              
              <div>
                <label className="field-label">Description / Synopsis</label>
                <textarea name="desc" required rows={3} placeholder="Brief summary of the project and roles..." className="field" />
              </div>

              <div>
                <label className="field-label">Eligibility Criteria</label>
                <input name="eligibility" required placeholder="e.g. 18-25 yrs, Jaipur based" className="field" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Deadline</label>
                  <input name="deadline" type="date" required className="field" />
                </div>
                <div>
                  <label className="field-label">Application Fee (₹)</label>
                  <input name="fee" type="number" min="0" defaultValue={0} className="field" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setOpen(false)} className="btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm"><Clapperboard size={14} /> Post Call</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editCasting && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) { setEditCasting(null); setCoverImage(''); } }}>
          <div className="modal-box" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Edit Casting Call</h3>
              <button onClick={() => { setEditCasting(null); setCoverImage(''); }} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
            </div>

            <form onSubmit={onEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Project Title</label>
                  <input name="title" defaultValue={editCasting.projectTitle} required className="field" />
                </div>
                <div>
                  <label className="field-label">Format / Type</label>
                  <select name="type" defaultValue={editCasting.projectType} className="field" required>
                    <option value="Movie">Movie</option>
                    <option value="TVSeries">TV Series</option>
                    <option value="MusicVideo">Music Video</option>
                    <option value="ShortDrama">Short Drama</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Production House</label>
                  <input name="house" defaultValue={editCasting.productionHouse} required className="field" />
                </div>
                <div>
                  <label className="field-label">Image URL</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input name="imageUrl" value={coverImage} onChange={e => setCoverImage(e.target.value)} className="field" style={{ flex: 1 }} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline btn-sm" style={{ flexShrink: 0 }}>
                      <Upload size={14} /> Upload
                    </button>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                  </div>
                </div>
              </div>

              <div>
                <label className="field-label">Roles Needed (comma-separated)</label>
                <input name="roles" defaultValue={(editCasting.roles || []).join(', ')} required className="field" />
              </div>
              
              <div>
                <label className="field-label">Description / Synopsis</label>
                <textarea name="desc" defaultValue={editCasting.rolesDescription} required rows={3} className="field" />
              </div>

              <div>
                <label className="field-label">Eligibility Criteria</label>
                <input name="eligibility" defaultValue={editCasting.eligibilityCriteria} required className="field" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Deadline</label>
                  <input name="deadline" type="date" defaultValue={editCasting.deadline} required className="field" />
                </div>
                <div>
                  <label className="field-label">Application Fee (₹)</label>
                  <input name="fee" type="number" min="0" defaultValue={editCasting.applicationFee} className="field" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => { setEditCasting(null); setCoverImage(''); }} className="btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm"><Clapperboard size={14} /> Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
