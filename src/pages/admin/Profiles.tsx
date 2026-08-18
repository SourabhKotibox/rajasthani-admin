import { useState, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setProfileStatus, deleteProfile, adminUpdateProfile } from '@/store';
import { api } from '@/api/client';
import { Search, CheckCircle2, AlertCircle, XCircle, User, Star, Trash2, Edit2, X, Eye, Bell, Mail, Phone, Globe, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { TalentProfile } from '@/data/mock';

export default function AdminProfiles() {
  const profiles = useAppSelector((s) => s.data.profiles);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [filter, setFilter] = useState<'all' | 'pending'>('pending');
  const [search, setSearch] = useState('');
  
  const [editProfile, setEditProfile] = useState<TalentProfile | null>(null);
  const [viewProfile, setViewProfile] = useState<TalentProfile | null>(null);

  const filtered = profiles.filter(p => {
    if (filter === 'pending' && p.status !== 'pending') return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.displayName.toLowerCase().includes(q) ||
        p.categories.some(c => c.toLowerCase().includes(q)) ||
        p.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const setStatus = async (id: number, status: 'approved' | 'rejected', isFeatured: boolean) => {
    try {
      await api.setProfileStatus(id, { status, isFeatured });
      dispatch(setProfileStatus({ id, status, isFeatured }));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Delete profile for ${name}?`)) {
      try {
        await api.deleteProfile(id);
        dispatch(deleteProfile(id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete profile');
      }
    }
  };

  const handleNotify = (_profileId: number) => {
    navigate('/admin/mail');
  };

  const onEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editProfile) return;
    const fd = new FormData(e.currentTarget);
    const updated = {
      ...editProfile,
      displayName: String(fd.get('displayName')),
      bio: String(fd.get('bio')),
      location: String(fd.get('location')),
      yearsOfExperience: Number(fd.get('experience')),
      photoUrl: String(fd.get('photoUrl')),
    };
    try {
      await api.upsertProfile(updated as never);
      dispatch(adminUpdateProfile(updated));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update profile');
    }
    setEditProfile(null);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Talent Profiles</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem' }}>Manage and review public talent profiles</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)' }} />
            <input 
              className="field" 
              placeholder="Search name, category, location..." 
              style={{ paddingLeft: '2.2rem', minWidth: '240px', background: 'var(--color-surface)' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.25rem' }}>
            <button 
              className={`btn-ghost ${filter === 'pending' ? 'active' : ''}`} 
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', background: filter === 'pending' ? 'var(--color-card)' : 'transparent', boxShadow: filter === 'pending' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
              onClick={() => setFilter('pending')}
            >
              Pending ({profiles.filter(p => p.status === 'pending').length})
            </button>
            <button 
              className={`btn-ghost ${filter === 'all' ? 'active' : ''}`} 
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', background: filter === 'all' ? 'var(--color-card)' : 'transparent', boxShadow: filter === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
              onClick={() => setFilter('all')}
            >
              All Profiles
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.length === 0 ? (
          <div style={{ background: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: '14px', padding: '4rem 1.25rem', textAlign: 'center' }}>
            <User size={40} style={{ margin: '0 auto 1rem', opacity: 0.35, color: search ? 'var(--color-muted-foreground)' : 'var(--color-success)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{search ? 'No matches found' : 'All caught up!'}</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.5rem' }}>
              {search ? 'Try adjusting your search terms.' : 'No pending profiles to review.'}
            </p>
          </div>
        ) : (
          filtered.map((p, i) => (
            <div key={p.id} className={`rca-card animate-slide-up stagger-${Math.min(i + 1, 10)}`} style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
              
              {/* Avatar */}
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-muted)', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--color-border)' }}>
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted-foreground)' }}><User size={24} /></div>
                )}
              </div>
              
              {/* Info */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <h3 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{p.displayName}</h3>
                  {p.isFeatured && <span className="badge badge-primary"><Star size={10} style={{ marginRight: '2px' }}/> Featured</span>}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>{(p.categories || []).join(' · ')}</p>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted-foreground)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span>📍 {p.location}</span>
                  {p.phone && <span>📞 {p.phone}</span>}
                  {p.gender && <span>👤 {p.gender}</span>}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Status</div>
                  <span className={`badge ${p.status === 'approved' ? 'badge-success' : p.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                    {p.status}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => setViewProfile(p)} className="btn-outline btn-sm" title="View Full Details">
                      <Eye size={13} />
                    </button>
                    <button onClick={() => setEditProfile(p)} className="btn-outline btn-sm" title="Quick Edit">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleNotify(p.id)} className="btn-outline btn-sm" title="Message User">
                      <Mail size={13} />
                    </button>
                    <button onClick={() => handleDelete(p.id, p.displayName)} className="btn-outline btn-sm" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  
                  {p.status !== 'approved' && (
                    <button onClick={() => setStatus(p.id, 'approved', false)} className="btn-outline btn-sm" style={{ color: 'var(--color-success)', borderColor: 'var(--color-success)' }}>
                      <CheckCircle2 size={13} /> Approve
                    </button>
                  )}
                  {p.status !== 'rejected' && (
                    <button onClick={() => setStatus(p.id, 'rejected', false)} className="btn-outline btn-sm" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
                      <XCircle size={13} /> Reject
                    </button>
                  )}
                  {p.status === 'approved' && !p.isFeatured && (
                    <button onClick={() => setStatus(p.id, 'approved', true)} className="btn-primary btn-sm">
                      <Star size={13} /> Feature
                    </button>
                  )}
                  {p.isFeatured && (
                    <button onClick={() => setStatus(p.id, 'approved', false)} className="btn-outline btn-sm">
                      Unfeature
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Full Profile Modal */}
      {viewProfile && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setViewProfile(null); }}>
          <div className="modal-box" style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}>
            <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img src={viewProfile.photoUrl} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }} />
                <div>
                  <h3 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.1 }}>{viewProfile.displayName}</h3>
                  <div style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.2rem' }}>{(viewProfile.categories || []).join(' · ')}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span className={`badge ${viewProfile.status === 'approved' ? 'badge-success' : viewProfile.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>{viewProfile.status.toUpperCase()}</span>
                    {viewProfile.isFeatured && <span className="badge badge-primary"><Star size={10} style={{ marginRight: '2px' }}/> FEATURED</span>}
                  </div>
                </div>
              </div>
              <button onClick={() => setViewProfile(null)} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
            </div>
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted-foreground)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Contact & Web</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} style={{ color: 'var(--color-muted-foreground)' }} /> {viewProfile.phone || 'N/A'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={14} style={{ color: 'var(--color-muted-foreground)' }} /> {viewProfile.website ? <a href={viewProfile.website} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>{viewProfile.website}</a> : 'N/A'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>IMDb: {viewProfile.imdbUrl ? <a href={viewProfile.imdbUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>Link</a> : 'N/A'}</div>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted-foreground)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Casting Attributes</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <div><strong>Gender:</strong> {viewProfile.gender || 'Not specified'}</div>
                    <div><strong>Age:</strong> {viewProfile.age || 'Not specified'}</div>
                    <div><strong>Height:</strong> {viewProfile.height ? `${viewProfile.height} cm` : 'Not specified'}</div>
                    <div><strong>Location:</strong> {viewProfile.location}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted-foreground)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Bio & Experience</h4>
                <div style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--color-foreground)' }}>
                  {viewProfile.bio}
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                  <strong>Experience:</strong> {viewProfile.yearsOfExperience} years
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted-foreground)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Skills & Languages</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {viewProfile.skills.map(s => <span key={s} className="badge badge-info">{s}</span>)}
                  {viewProfile.languages.map(l => <span key={l} className="badge" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>🗣️ {l}</span>)}
                </div>
              </div>

            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => navigate(`/talent/${viewProfile.id}`)} className="btn-ghost" style={{ fontSize: '0.8rem' }}>
                View Public Page <ArrowRight size={14} />
              </button>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => { setEditProfile(viewProfile); setViewProfile(null); }} className="btn-outline btn-sm">Edit</button>
                <button onClick={() => { setViewProfile(null); handleNotify(viewProfile.id); }} className="btn-primary btn-sm"><Mail size={14}/> Message</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Edit Modal */}
      {editProfile && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setEditProfile(null); }}>
          <div className="modal-box" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Quick Edit Profile</h3>
              <button onClick={() => setEditProfile(null)} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
            </div>
            <form onSubmit={onEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="field-label">Display Name</label>
                <input name="displayName" defaultValue={editProfile.displayName} required className="field" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Location</label>
                  <input name="location" defaultValue={editProfile.location} required className="field" />
                </div>
                <div>
                  <label className="field-label">Experience (Yrs)</label>
                  <input name="experience" type="number" defaultValue={editProfile.yearsOfExperience} required className="field" />
                </div>
              </div>
              <div>
                <label className="field-label">Photo URL</label>
                <input name="photoUrl" defaultValue={editProfile.photoUrl} className="field" />
              </div>
              <div>
                <label className="field-label">Bio</label>
                <textarea name="bio" rows={4} defaultValue={editProfile.bio} className="field" required />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setEditProfile(null)} className="btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
