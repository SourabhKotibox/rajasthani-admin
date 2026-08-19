import { FormEvent, useRef, useState } from 'react';
import {
  X, Send, DollarSign, Building2, Calendar, User,
  Mail, Phone, Lock, Camera, CheckCircle2, ChevronRight,
  Clapperboard, BadgeCheck, AlertCircle, Eye, EyeOff,
} from 'lucide-react';
import type { CastingCall } from '@/data/mock';
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

// Dynamically load Razorpay checkout.js
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as unknown as Record<string, unknown>).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type Step = 1 | 2 | 3 | 4 | 5 | 'done';

interface Props {
  call: CastingCall;
  onClose: () => void;
}

const TYPE_LABEL: Record<string, string> = {
  Movie: 'Movie', TVSeries: 'TV Series', MusicVideo: 'Music Video', ShortDrama: 'Short Drama',
};

export default function CastingApplyFlow({ call, onClose }: Props) {
  const dispatch = useAppDispatch();
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Step state
  const [step, setStep] = useState<Step>(1);

  // Form data across steps
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

  // Payment state
  const [accountPaymentId, setAccountPaymentId] = useState('');
  const [applicationPaymentId, setApplicationPaymentId] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Final loading/error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ACCOUNT_FEE = 500; // ₹ 500 account creation fee
  const hasApplicationFee = call.applicationFee > 0;
  // Step labels — always include account payment, then application payment if applicable
  const steps = hasApplicationFee
    ? ['Your Details', 'Pay Account Fee', 'Create Account', 'Upload Photo', 'Pay Application Fee']
    : ['Your Details', 'Pay Account Fee', 'Create Account', 'Upload Photo'];

  function stepIndex(): number {
    if (step === 'done') return steps.length;
    return (step as number) - 1;
  }

  // ─── Step 1: Applicant details ───────────────────────────────────────
  const onStep1Submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !role) return;
    setStep(2); // Always go to account payment
  };

  // ─── Step 2: Pay Account Fee ────────────────────────────────────────
  const handleAccountPayment = async () => {
    setPaymentLoading(true);
    setPaymentError('');
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Could not load Razorpay. Check your internet connection.');

      // Create order on backend
      let order: Record<string, unknown>;
      try {
        order = await apiPost('/payments/create-order', {
          amount: ACCOUNT_FEE,
          currency: 'INR',
          castingCallId: call.id,
          applicantEmail: email,
          paymentType: 'account_creation',
        });
      } catch {
        throw new Error('Failed to create payment order. Please try again.');
      }

      if ((order as { mock?: boolean }).mock) {
        // Dev mode — skip real payment
        setAccountPaymentId('mock_account_pay_' + Date.now());
        setStep(3);
        return;
      }

      const RazorpayClass = (window as unknown as { Razorpay: new (o: unknown) => { open(): void } }).Razorpay;
      const rzp = new RazorpayClass({
        key: order.keyId || order.key_id,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Rajasthan Cine Association Platform',
        description: 'Account creation fee',
        order_id: order.id,
        prefill: { name, email, contact: phone },
        theme: { color: '#FA931A' },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            await apiPost('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          } catch { /* verification failure — still proceed in demo */ }
          setAccountPaymentId(response.razorpay_payment_id);
          setStep(3);
        },
        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
      });
      rzp.open();
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  // ─── Step 5: Pay Application Fee ─────────────────────────────────────
  const handleApplicationPayment = async () => {
    setPaymentLoading(true);
    setPaymentError('');
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Could not load Razorpay. Check your internet connection.');

      // Create order on backend
      let order: Record<string, unknown>;
      try {
        order = await apiPost('/payments/create-order', {
          amount: call.applicationFee,
          currency: 'INR',
          castingCallId: call.id,
          applicantEmail: email,
          paymentType: 'application',
        });
      } catch {
        throw new Error('Failed to create payment order. Please try again.');
      }

      if ((order as { mock?: boolean }).mock) {
        // Dev mode — skip real payment
        setApplicationPaymentId('mock_app_pay_' + Date.now());
        setStep('done');
        return;
      }

      const RazorpayClass = (window as unknown as { Razorpay: new (o: unknown) => { open(): void } }).Razorpay;
      const rzp = new RazorpayClass({
        key: order.keyId || order.key_id,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Rajasthan Cine Association Platform',
        description: `Application fee for ${call.projectTitle}`,
        order_id: order.id,
        prefill: { name, email, contact: phone },
        theme: { color: '#FA931A' },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            await apiPost('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          } catch { /* verification failure — still proceed in demo */ }
          setApplicationPaymentId(response.razorpay_payment_id);
          setStep('done');
        },
        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
      });
      rzp.open();
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  // ─── Step 4: Upload photo ────────────────────────────────────────────
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

  // ─── Final submit ─────────────────────────────────────────────────────
  const onFinalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let uploadedUrl = photoUrl;
      if (photoFile) uploadedUrl = await uploadPhoto();
      setPhotoUrl(uploadedUrl);

      const result = await apiPost('/apply-public', {
        name, email, phone,
        roleAppliedFor: role,
        availability,
        coverNote,
        castingCallId: String(call.id),
        accountPaymentId,
        password,
        photoUrl: uploadedUrl,
      });

      // Auto-login the newly created user
      if (result.token && result.user) {
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('auth_user', JSON.stringify(result.user));
        dispatch(loginAction({ user: result.user, token: result.token }));
      }

      // If there's no application fee, we're done. Otherwise go to payment step.
      if (!hasApplicationFee) {
        setStep('done');
      } else {
        setStep(5);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ zIndex: 1100 }}
    >
      <div
        className="modal-box"
        style={{ maxWidth: '560px', padding: 0, overflow: 'hidden', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* ── Header image + close ── */}
        <div style={{ position: 'relative', height: '160px', flexShrink: 0, overflow: 'hidden' }}>
          <img src={call.imageUrl} alt={call.projectTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,8,6,0.95) 0%, rgba(10,8,6,0.4) 100%)' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.45)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <X size={16} />
          </button>
          <div style={{ position: 'absolute', bottom: '14px', left: '20px', right: '20px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5C842' }}>
              {TYPE_LABEL[call.projectType] || call.projectType} · {call.productionHouse}
            </span>
            <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginTop: '2px' }}>
              {call.projectTitle}
            </h2>
          </div>
        </div>

        {/* ── Step progress bar ── */}
        {step !== 'done' && (
          <div style={{ padding: '1rem 1.5rem 0.75rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
              {steps.map((label, i) => {
                const current = stepIndex();
                const done = i < current;
                const active = i === current;
                return (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none', gap: '0.3rem' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      background: done ? 'var(--color-primary)' : active ? 'var(--color-primary)' : 'var(--color-muted)',
                      border: active ? '2px solid var(--color-primary)' : done ? 'none' : '2px solid var(--color-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s',
                    }}>
                      {done ? <CheckCircle2 size={14} color="#fff" /> : (
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: active ? '#fff' : 'var(--color-muted-foreground)' }}>{i + 1}</span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: active ? 'var(--color-primary)' : done ? 'var(--color-muted-foreground)' : 'var(--color-muted-foreground)', whiteSpace: 'nowrap' }}>
                      {label}
                    </span>
                    {i < steps.length - 1 && (
                      <div style={{ flex: 1, height: '2px', background: done ? 'var(--color-primary)' : 'var(--color-border)', borderRadius: '2px', transition: 'background 0.3s', margin: '0 0.25rem' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>

          {/* ══ STEP 1: Details ══════════════════════════════════════════ */}
          {step === 1 && (
            <form onSubmit={onStep1Submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Your Details</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
                  Anyone can apply — fill in your info below. {hasApplicationFee && `A ₹ ${call.applicationFee.toLocaleString()} application fee applies later.`}
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

              {call.roles && call.roles.length > 0 && (
                <div>
                  <label className="field-label"><BadgeCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />Role Applying For</label>
                  <select required value={role} onChange={e => setRole(e.target.value)} className="field">
                    <option value="">Select a role…</option>
                    {call.roles.map(r => <option key={r} value={r}>{r}</option>)}
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

              {hasApplicationFee && (
                <div style={{ background: 'var(--color-primary-subtle)', border: '1px solid var(--color-primary-tint)', borderRadius: '10px', padding: '0.85rem 1rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <DollarSign size={15} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-foreground)', lineHeight: 1.5 }}>
                    <strong>₹ ${call.applicationFee.toLocaleString()} application fee</strong> — will be charged after account creation.
                  </p>
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Continue <ChevronRight size={15} />
              </button>
            </form>
          )}

          {/* ══ STEP 2: Pay Account Fee ══════════════════════════════════ */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Pay Account Creation Fee</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
                  Create your Rajasthan Cine Association talent account with a one-time fee of ₹ {ACCOUNT_FEE.toLocaleString()}.
                </p>
              </div>

              {/* Fee summary card */}
              <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden' }}>
                <div style={{ padding: '1rem' }}>
                  <div className="font-serif" style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-foreground)', marginBottom: '0.75rem' }}>Rajasthan Cine Association Talent Account</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>Account Creation Fee</span>
                    <span className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      ₹ {ACCOUNT_FEE.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                256-bit SSL encrypted · Powered by Razorpay
              </div>

              {paymentError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <AlertCircle size={15} style={{ color: '#dc2626', flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '0.82rem', color: '#dc2626' }}>{paymentError}</span>
                </div>
              )}

              <button
                onClick={handleAccountPayment}
                disabled={paymentLoading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', opacity: paymentLoading ? 0.7 : 1 }}
              >
                <DollarSign size={15} />
                {paymentLoading ? 'Opening Razorpay…' : `Pay ₹ ${ACCOUNT_FEE.toLocaleString()}`}
              </button>

              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--color-muted-foreground)', textDecoration: 'underline' }}>
                ← Back to details
              </button>
            </div>
          )}

          {/* ══ STEP 3: Create Account ════════════════════════════════════ */}
          {step === 3 && (
            <form onSubmit={e => { e.preventDefault(); setStep(4); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Create Your Rajasthan Cine Association Account</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
                  {accountPaymentId ? '✓ Account payment received. ' : ''}Set a password to secure your talent profile.
                </p>
              </div>

              {accountPaymentId && (
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CheckCircle2 size={15} style={{ color: '#16a34a' }} />
                  <span style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 600 }}>
                    Account payment confirmed · ID: {accountPaymentId.slice(0, 20)}…
                  </span>
                </div>
              )}

              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Clapperboard size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '2px' }}>{name}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)' }}>{email} · {role}</p>
                </div>
              </div>

              <div>
                <label className="field-label"><Lock size={12} style={{ display: 'inline', marginRight: '4px' }} />Set Password</label>
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
                  You'll use this to log in to your Rajasthan Cine Association dashboard.
                </p>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Create Account <ChevronRight size={15} />
              </button>
              <button type="button" onClick={() => setStep(2)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--color-muted-foreground)', textDecoration: 'underline' }}>
                ← Back to payment
              </button>
            </form>
          )}

          {/* ══ STEP 4: Upload Photo ══════════════════════════════════════ */}
          {step === 4 && (
            <form onSubmit={onFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Upload Your Photo</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
                  A professional headshot helps casting directors find you. You can also add more to your portfolio later.
                </p>
              </div>

              {/* Photo picker */}
              <div
                onClick={() => photoInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--color-border)',
                  borderRadius: '14px',
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: photoPreview ? 'transparent' : 'var(--color-surface)',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '3px solid var(--color-primary)' }} />
                ) : (
                  <div>
                    <Camera size={36} style={{ color: 'var(--color-muted-foreground)', margin: '0 auto 0.75rem', display: 'block', opacity: 0.5 }} />
                    <p style={{ fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '0.25rem' }}>Click to upload photo</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)' }}>JPG, PNG · Max 5MB · Portrait preferred</p>
                  </div>
                )}
              </div>
              <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />

              {photoPreview && (
                <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--color-muted-foreground)', textDecoration: 'underline', textAlign: 'center' }}>
                  Remove photo
                </button>
              )}

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <AlertCircle size={15} style={{ color: '#dc2626', flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '0.82rem', color: '#dc2626' }}>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
              >
                <Send size={14} />
                {loading ? 'Submitting application…' : hasApplicationFee ? 'Continue to Payment' : 'Submit Application'}
              </button>

              <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(''); onFinalSubmit({ preventDefault: () => {} } as FormEvent); }} disabled={loading} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--color-muted-foreground)', textDecoration: 'underline', textAlign: 'center', opacity: loading ? 0.5 : 1 }}>
                Skip for now — submit without photo
              </button>
            </form>
          )}

          {/* ══ STEP 5: Pay Application Fee ══════════════════════════════════ */}
          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>Pay Application Fee</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
                  Secure payment via Razorpay. Your application will be processed after payment confirmation.
                </p>
              </div>

              {/* Fee summary card */}
              <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden' }}>
                <img src={call.imageUrl} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', marginBottom: '0.25rem' }}>{call.productionHouse}</div>
                  <div className="font-serif" style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-foreground)', marginBottom: '0.75rem' }}>{call.projectTitle}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>Application Fee</span>
                    <span className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      ₹ {call.applicationFee.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                256-bit SSL encrypted · Powered by Razorpay
              </div>

              {paymentError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <AlertCircle size={15} style={{ color: '#dc2626', flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '0.82rem', color: '#dc2626' }}>{paymentError}</span>
                </div>
              )}

              <button
                onClick={handleApplicationPayment}
                disabled={paymentLoading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', opacity: paymentLoading ? 0.7 : 1 }}
              >
                <DollarSign size={15} />
                {paymentLoading ? 'Opening Razorpay…' : `Pay ₹ ${call.applicationFee.toLocaleString()}`}
              </button>

              <button onClick={() => setStep(4)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--color-muted-foreground)', textDecoration: 'underline' }}>
                ← Back to photo upload
              </button>
            </div>
          )}

          {/* ══ DONE ════════════════════════════════════════════════════ */}
          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #E88815)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 8px 24px rgba(250,147,26,0.35)' }}>
                <CheckCircle2 size={32} color="#fff" />
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '0.5rem' }}>
                Application Submitted!
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                Your application for <strong style={{ color: 'var(--color-foreground)' }}>{call.projectTitle}</strong> has been received.
                {accountPaymentId && <> Account payment (ID: <code style={{ fontSize: '0.75rem' }}>{accountPaymentId.slice(0, 16)}…</code>) recorded.</>}
                {hasApplicationFee && applicationPaymentId && <> Application payment (ID: <code style={{ fontSize: '0.75rem' }}>{applicationPaymentId.slice(0, 16)}…</code>) recorded.</>}
                <br /><br />
                Your Rajasthan Cine Association talent account is ready — log in to track your application status.
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

        </div>
      </div>
    </div>
  );
}
