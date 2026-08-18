import { FormEvent, useState, useRef, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { upsertMyProfile } from '@/store';
import { api } from '@/api/client';
import { Save, CheckCircle, User, Upload, Image as ImageIcon } from 'lucide-react';
import type { TalentProfile } from '@/data/mock';

const CATS = ['Actor', 'Director', 'Music Video Artist', 'Editor', 'Cinematographer', 'Writer', 'Producer', 'Choreographer', 'Technician'];

export default function TalentProfileEdit() {
  const user = useAppSelector((s) => s.auth.user)!;
  const existing = useAppSelector((s) => s.data.profiles.find((p) => p.userId === user.id || p.userId === Number(user.id)));
  const dispatch = useAppDispatch();
  
  const [cats, setCats] = useState<string[]>(existing?.categories ?? []);
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(existing?.photoUrl ?? '');
  const [bio, setBio] = useState(existing?.bio ?? '');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggle = (c: string) => setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const { url } = await api.upload(fd);
        setPhotoPreview(url);
      } catch (err) {
        alert('Failed to upload image');
      }
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const profileData = {
      id: existing?.id ?? user.id,
      displayName: String(fd.get('displayName')),
      stageName: String(fd.get('stageName') || ''),
      photoUrl: photoPreview,
      categories: cats,
      yearsOfExperience: Number(fd.get('years') || 0),
      location: String(fd.get('location') || ''),
      bio: bio,
      skills: String(fd.get('skills') || '').split(',').map((s) => s.trim()).filter(Boolean),
      languages: String(fd.get('languages') || '').split(',').map((s) => s.trim()).filter(Boolean),
      instagramUrl: String(fd.get('instagram') || ''),
      youtubeUrl: String(fd.get('youtube') || ''),
      imdbUrl: String(fd.get('imdb') || ''),
      phone: String(fd.get('phone') || ''),
      website: String(fd.get('website') || ''),
      gender: (fd.get('gender') as TalentProfile['gender']) || undefined,
      height: Number(fd.get('height')) || undefined,
      age: Number(fd.get('age')) || undefined,
      status: existing?.status ?? 'pending',
      isFeatured: existing?.isFeatured ?? false,
    };

    try {
      const saved = await api.upsertProfile(profileData as never) as TalentProfile;
      dispatch(upsertMyProfile(saved));
    } catch {
      // Fallback: still update Redux state even if API fails
      dispatch(upsertMyProfile(profileData as TalentProfile));
    }

    const isSubmit = (e.nativeEvent as SubmitEvent).submitter?.getAttribute('data-action') === 'submit';
    if (isSubmit) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    let score = 0;
    const totalFields = 12; // key fields to be considered 'complete'
    if (photoPreview) score++;
    if (existing?.displayName) score++;
    if (cats.length > 0) score++;
    if (existing?.yearsOfExperience) score++;
    if (existing?.location) score++;
    if (bio.length > 10) score++;
    if (existing?.skills?.length) score++;
    if (existing?.languages?.length) score++;
    if (existing?.phone) score++;
    if (existing?.gender) score++;
    if (existing?.height) score++;
    if (existing?.age) score++;
    
    return Math.round((score / totalFields) * 100);
  }, [existing, cats, photoPreview, bio]);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Profile</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem' }}>Your public Rajasthani Cinema Association professional identity</p>
        </div>
        
        {/* Completion Bar */}
        <div style={{ background: 'var(--color-surface)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid var(--color-border)', minWidth: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>Profile Completion</span>
            <span style={{ color: completionPercentage === 100 ? 'var(--color-success)' : 'var(--color-primary)' }}>{completionPercentage}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: completionPercentage === 100 ? 'var(--color-success)' : 'var(--color-primary)', width: `${completionPercentage}%`, transition: 'width 0.5s ease' }} />
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '680px' }}>

        {/* Photo section */}
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={15} style={{ color: 'var(--color-primary)' }} /> Photo & Identity
          </h2>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Photo upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--color-muted)', overflow: 'hidden', border: '3px solid var(--color-border)', flexShrink: 0, position: 'relative', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
                {photoPreview
                  ? <img src={photoPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setPhotoPreview('')} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted-foreground)' }}><User size={36} /></div>
                }
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                  <Upload color="white" size={24} />
                </div>
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline btn-sm" style={{ fontSize: '0.7rem' }}>
                <ImageIcon size={12} /> Upload Photo
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '250px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Display Name *</label>
                  <input name="displayName" required defaultValue={existing?.displayName || user.fullName} placeholder="Display name" className="field" />
                </div>
                <div>
                  <label className="field-label">Stage Name</label>
                  <input name="stageName" defaultValue={existing?.stageName} placeholder="Stage / professional name" className="field" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Phone Number</label>
                  <input name="phone" type="tel" defaultValue={existing?.phone} placeholder="+254 700 000000" className="field" />
                </div>
                <div>
                  <label className="field-label">Website / Portfolio</label>
                  <input name="website" type="url" defaultValue={existing?.website} placeholder="https://yourwebsite.com" className="field" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Professional Categories</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggle(c)}
                className={`pill-filter ${cats.includes(c) ? 'active' : ''}`}
              >
                {cats.includes(c) && '✓ '}{c}
              </button>
            ))}
          </div>
          {cats.length === 0 && (
            <p style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', marginTop: '0.5rem' }}>Select at least one category</p>
          )}
        </div>

        {/* Casting Details */}
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.1rem' }}>Casting Attributes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="field-label">Gender</label>
              <select name="gender" defaultValue={existing?.gender} className="field">
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer Not to Say">Prefer Not to Say</option>
              </select>
            </div>
            <div>
              <label className="field-label">Age</label>
              <input name="age" type="number" min="0" max="100" defaultValue={existing?.age} placeholder="e.g. 28" className="field" />
            </div>
            <div>
              <label className="field-label">Height (cm)</label>
              <input name="height" type="number" min="0" max="300" defaultValue={existing?.height} placeholder="e.g. 175" className="field" />
            </div>
          </div>
        </div>

        {/* About */}
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.1rem' }}>About You</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="field-label">Years of Experience</label>
                <input name="years" type="number" min="0" max="60" defaultValue={existing?.yearsOfExperience} placeholder="e.g. 5" className="field" />
              </div>
              <div>
                <label className="field-label">Location / City</label>
                <input name="location" defaultValue={existing?.location} placeholder="e.g. Jaipur, Rajasthan" className="field" />
              </div>
            </div>
            <div>
              <label className="field-label">Bio</label>
              <textarea 
                name="bio" 
                rows={4} 
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Write a compelling professional bio…" 
                className="field" 
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem', textAlign: 'right' }}>
                {bio.length} chars
              </div>
            </div>
            <div>
              <label className="field-label">Skills (comma-separated)</label>
              <input name="skills" defaultValue={(existing?.skills || []).join(', ')} placeholder="Drama, Comedy, Handheld, Color Grading…" className="field" />
            </div>
            <div>
              <label className="field-label">Languages Spoken (comma-separated)</label>
              <input name="languages" defaultValue={(existing?.languages || []).join(', ')} placeholder="English, Swahili, Luganda…" className="field" />
            </div>
          </div>
        </div>

        {/* Social links */}
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1.1rem' }}>Social Links</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label className="field-label">Instagram URL</label>
              <input name="instagram" defaultValue={existing?.instagramUrl} placeholder="https://instagram.com/yourhandle" className="field" />
            </div>
            <div>
              <label className="field-label">YouTube URL</label>
              <input name="youtube" defaultValue={existing?.youtubeUrl} placeholder="https://youtube.com/@yourchannel" className="field" />
            </div>
            <div>
              <label className="field-label">IMDb URL</label>
              <input name="imdb" defaultValue={existing?.imdbUrl} placeholder="https://imdb.com/name/nm…" className="field" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '2rem', flexWrap: 'wrap' }}>
          <button type="submit" data-action="save" className="btn-outline" style={{ padding: '0.75rem 2rem' }}>
            <Save size={16} /> Save Draft
          </button>
          
          <button type="submit" data-action="submit" className="btn-primary" style={{ padding: '0.75rem 2rem' }} disabled={completionPercentage < 50}>
            <CheckCircle size={16} /> Submit to Admin for Review
          </button>
          
          {existing?.status === 'pending' && (
            <span className="badge badge-warning" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>Status: Under Review</span>
          )}
          {existing?.status === 'approved' && (
            <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>Status: Approved & Public</span>
          )}
          
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 600, fontSize: '0.875rem' }} className="animate-slide-up">
              <CheckCircle size={16} /> Draft saved!
            </div>
          )}
          {submitted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }} className="animate-slide-up">
              <CheckCircle size={16} /> Submitted! Admin will review your profile.
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
