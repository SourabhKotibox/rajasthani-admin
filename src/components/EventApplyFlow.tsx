import { FormEvent, useRef, useState } from 'react';
import { X, Send, User, Mail, Phone, BadgeCheck, Clapperboard, CheckCircle2, ChevronRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { EventItem } from '@/data/mock';
import { useAppDispatch, login as loginAction } from '@/store';

const BASE = '/api';

async function apiPost(path: string, body: Record<string, unknown> | FormData, isForm = false) {
  const opts: RequestInit = { method: 'POST' };
  if (isForm) {
    opts.body = body as FormData;
  } else {
    opts.headers = { 'Content-Type': 'application/json' };
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

type Step = 1 | 2 | 'done';

interface Props {
  event: EventItem;
  onClose: () => void;
}

export default function EventApplyFlow({ event, onClose }: Props) {
  const dispatch = useAppDispatch();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [availability, setAvailability] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onStep1Submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !role) return;
    setStep(2);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const uploadPhoto = async (): Promise<string> => {
    if (!photoFile) return '';
    const fd = new FormData();
    fd.append('file', photoFile);
    const result = await apiPost('/upload-public', fd as unknown as Record<string, unknown>, true);
    return result.url || '';
  };

  const onFinalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let uploadedUrl = photoUrl;
      if (photoFile) uploadedUrl = await uploadPhoto();
      setPhotoUrl(uploadedUrl);

      const result = await apiPost('/apply-public', {
        name,
        email,
        phone,
        roleAppliedFor: role,
        availability,
        coverNote,
        castingCallId: String(event.id),
        password,
        photoUrl: uploadedUrl,
      });

      if (result.token && result.user) {
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('auth_user', JSON.stringify(result.user));
        dispatch(loginAction({ user: result.user, token: result.token }));
      }

      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ zIndex: 40 }}>
      <div className="modal-box" style={{ maxWidth: '560px', padding: 0, overflow: 'hidden', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ position: 'relative', height: '160px', flexShrink: 0, overflow: 'hidden' }}>
          <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,8,6,0.95) 0%, rgba(10,8,6,0.4) 100%)' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.45)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <X size={16} />
          </button>
          <div style={{ position: 'absolute', bottom: '14px', left: '20px', right: '20px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5C842' }}>
              {event.eventType}
            </span>
            <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginTop: '2px' }}>
              {event.title}
            </h2>
          </div>
        </div>

        {/* Step progress */}
        {step !== 'done' && (
          <div style={{ padding: '1rem 1.5rem 0.75rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
              {[1, 2].map((i) => {
                const current = typeof step === 'number' ? step : 2;
                const done = i < current;
                const active = i === current;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none', gap: '0.3rem' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      background: done ? 'var(--color-primary)' : active ? 'var(--color-primary)' : 'var(--color-muted)',
                      border: active ? '2px solid var(--color-primary)' : done ? 'none' : '2px solid var(--color-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {done ? <CheckCircle2 size={14} color="#fff" /> : (
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: active ? '#fff' : 'var(--color-muted-foreground)' }}>{i}</span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: active ? 'var(--color-primary)' : 'var(--color-muted-foreground)', whiteSpace: 'nowrap' }}>
                      {i === 1 ? 'Your Details' : 'Create Account'}
                    </span>
                    {i < 2 && (
                      <div style={{ flex: 1, height: '2px', background: done ? 'var(--color-primary)' : 'var(--color-border)', borderRadius: '2px', margin: '0 0.25rem' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={onStep1Submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Your Details</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
                  Apply to {event.title} — free to participate.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="field-label"><User size={12} style={{ display: 'inline', marginRight: '4px' }} />Full Name</label>
                  <input required value={name} onChange={e => setName(e.target.value)} placeholder="Amara Okello" className="field" />
                </div>
                <div>
                  <label className="field-label"><Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />Phone</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 700 000 000" className="field" />
                </div>
              </div>

              <div>
                <label className="field-label"><Mail size={12} style={{ display: 'inline', marginRight: '4px' }} />Email Address</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className="field" />
              </div>

              {(event.roles || []).length > 0 && (
                <div>
                  <label className="field-label"><BadgeCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />Role Applying For</label>
                  <select required value={role} onChange={e => setRole(e.target.value)} className="field">
                    <option value="">Select a role…</option>
                    {event.roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="field-label">Availability</label>
                <input required value={availability} onChange={e => setAvailability(e.target.value)} placeholder="e.g. Available full-time from 1 September" className="field" />
              </div>

              <div>
                <label className="field-label">Cover Note <span style={{ fontWeight: 400, color: 'var(--color-muted-foreground)' }}>(optional)</span></label>
                <textarea rows={3} value={coverNote} onChange={e => setCoverNote(e.target.value)} placeholder="Why are you the right fit for this role?" className="field" />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Continue <ChevronRight size={15} />
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={e => { e.preventDefault(); setStep('done'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Create Your Rajasthani Cinema Association Account</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
                  Set a password to secure your talent profile and track your application.
                </p>
              </div>

              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Clapperboard size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '2px' }}>{name}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)' }}>{email} · {role}</p>
                </div>
              </div>

              <div>
                <label className="field-label"><EyeOff size={12} style={{ display: 'inline', marginRight: '4px' }} />Set Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    required
                    type={showPwd ? 'text' : 'password'}
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="field"
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)' }}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-muted-foreground)', marginTop: '0.35rem' }}>
                  You'll use this to log in to your Rajasthani Cinema Association dashboard.
                </p>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Submit Application <ChevronRight size={15} />
              </button>
              <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--color-muted-foreground)', textDecoration: 'underline' }}>
                ← Back to details
              </button>
            </form>
          )}

          {/* DONE */}
          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #E88815)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 8px 24px rgba(250,147,26,0.35)' }}>
                <CheckCircle2 size={32} color="#fff" />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '0.5rem' }}>
                Application Submitted!
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                Your application for <strong style={{ color: 'var(--color-foreground)' }}>{event.title}</strong> has been received.
                <br /><br />
                Your Rajasthani Cinema Association talent account is ready — log in to track your application status.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => { window.location.href = '/dashboard'; }} className="btn-primary btn-sm">
                  Go to Dashboard
                </button>
                <button onClick={onClose} className="btn-outline btn-sm">
                  Close
                </button>
              </div>
            </div>
          )}

          {error && step !== 'done' && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
              <AlertCircle size={15} style={{ color: '#dc2626', flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '0.82rem', color: '#dc2626' }}>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
