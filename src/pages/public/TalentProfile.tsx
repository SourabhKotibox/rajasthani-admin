import { FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { addInquiry } from '@/store';
import { MapPin, Instagram, Youtube, ExternalLink, Briefcase, X, CheckCircle, Send } from 'lucide-react';
import { CreditCard } from '@/components/Cards';

export default function TalentProfile() {
  const { id } = useParams();
  const profileId = Number(id);
  const profile = useAppSelector((s) => s.data.profiles.find((p) => p.id === profileId && p.isFeatured));
  const entries = useAppSelector((s) => s.data.portfolio.filter((e) => e.profileId === profileId));
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'about'>('portfolio');

  if (!profile) {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '6rem 1.25rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭</div>
        <h1 className="font-serif" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Profile not found</h1>
        <p style={{ color: 'var(--color-muted-foreground)', marginBottom: '1.5rem' }}>This profile may not be publicly featured yet.</p>
        <Link to="/talent" className="btn-primary">← Back to directory</Link>
      </div>
    );
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    dispatch(addInquiry({
      name: String(fd.get('name')),
      email: String(fd.get('email')),
      company: String(fd.get('company') || ''),
      subject: String(fd.get('subject')),
      message: String(fd.get('message')),
      profileId: profile.id,
    }));
    setSent(true);
    setOpen(false);
  };

  return (
    <div className="animate-fade-in">

      {/* Profile hero header */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '3rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
          <Link to="/talent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-muted-foreground)', textDecoration: 'none', marginBottom: '1.5rem' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-muted-foreground)'}
          >
            ← Talent Directory
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', alignItems: 'start', flexWrap: 'wrap' }}>
            {/* Photo */}
            <div style={{ width: '180px', flexShrink: 0 }}>
              <div style={{ aspectRatio: '3/4', background: 'var(--color-muted)', borderRadius: '14px', overflow: 'hidden', border: '3px solid var(--color-card)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                {profile.photoUrl
                  ? <img src={profile.photoUrl} alt={profile.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted-foreground)', fontSize: '3rem' }}>🎭</div>
                }
              </div>
            </div>

            {/* Info */}
            <div className="animate-slide-up">
              {profile.isFeatured && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary">⭐ Featured Talent</span>
                </div>
              )}
              <h1 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--color-foreground)', lineHeight: 1.1 }}>
                {profile.displayName}
              </h1>
              {profile.stageName && (
                <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem' }}>aka {profile.stageName}</p>
              )}
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.75rem' }}>
                <MapPin size={13} /> {profile.location} · {profile.yearsOfExperience} yrs experience
              </p>

              {/* Categories */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem' }}>
                {profile.categories.map((c) => (
                  <span key={c} className="badge badge-primary">{c}</span>
                ))}
              </div>

              {/* Bio */}
              <p style={{ marginTop: '1.25rem', color: 'var(--color-foreground)', lineHeight: 1.7, fontSize: '0.95rem', maxWidth: '600px' }}>
                {profile.bio}
              </p>

              {/* Social links */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                {profile.instagramUrl && (
                  <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Instagram size={13} /> Instagram
                  </a>
                )}
                {profile.youtubeUrl && (
                  <a href={profile.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Youtube size={13} /> YouTube
                  </a>
                )}
                {profile.imdbUrl && (
                  <a href={profile.imdbUrl} target="_blank" rel="noopener noreferrer" className="btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ExternalLink size={13} /> IMDb
                  </a>
                )}
              </div>

              {/* CTA */}
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={() => setOpen(true)} className="btn-primary">
                  <Send size={14} /> Contact / Inquire
                </button>
                {sent && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600 }}>
                    <CheckCircle size={14} /> Inquiry sent to Rajasthani Cinema Association admin
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-card)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem', display: 'flex', gap: '0' }}>
          {(['portfolio', 'about'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '1rem 1.5rem',
                border: 'none',
                borderBottom: activeTab === tab ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
                background: 'transparent',
                fontSize: '0.875rem',
                fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {tab === 'portfolio' ? <Briefcase size={14} /> : <ExternalLink size={14} />}
              {tab === 'portfolio' ? `Portfolio (${entries.length})` : 'About'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
        {activeTab === 'portfolio' && (
          <>
            {entries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-muted-foreground)' }}>
                <Briefcase size={36} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <p>No portfolio credits added yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {entries.map((e, i) => (
                  <div key={e.id} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                    <CreditCard entry={e} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'about' && (
          <div style={{ maxWidth: '640px' }} className="animate-slide-up">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {profile.skills.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted-foreground)', marginBottom: '0.75rem' }}>Skills</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {profile.skills.map((s) => (
                      <span key={s} className="badge badge-muted" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {profile.languages.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted-foreground)', marginBottom: '0.75rem' }}>Languages</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {profile.languages.map((l) => (
                      <span key={l} className="badge badge-muted" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>{l}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {open && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.3rem', fontWeight: 700 }}>Inquire About</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.2rem' }}>{profile.displayName}</p>
              </div>
              <button onClick={() => setOpen(false)} className="btn-ghost" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label className="field-label">Your Name</label>
                <input name="name" required placeholder="Full name" className="field" />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input name="email" type="email" required placeholder="you@company.com" className="field" />
              </div>
              <div>
                <label className="field-label">Company / Production House</label>
                <input name="company" placeholder="Optional" className="field" />
              </div>
              <div>
                <label className="field-label">Subject / Project</label>
                <input name="subject" required placeholder="e.g. Feature film — Lead role casting" className="field" />
              </div>
              <div>
                <label className="field-label">Message</label>
                <textarea name="message" required rows={4} placeholder="Tell us about the opportunity…" className="field" />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button type="button" onClick={() => setOpen(false)} className="btn-outline btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm">
                  <Send size={13} /> Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
