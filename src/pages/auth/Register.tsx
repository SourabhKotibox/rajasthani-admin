import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { register } from '@/store';
import {
  Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2,
  Film, Star, Camera, Mic2, Loader2, UploadCloud, Phone,
  MapPin, CreditCard, Briefcase, GraduationCap
} from 'lucide-react';
import { api } from '@/api/client';

const STEPS = [
  { num: 1, icon: User, title: 'Build Your Profile', desc: 'Showcase your skills, experience and credentials.' },
  { num: 2, icon: CheckCircle2, title: 'Admin Verification', desc: 'Our team reviews and approves your profile.' },
  { num: 3, icon: Star, title: 'Get Discovered', desc: 'Studios and directors reach out directly to you.' },
];

const FLOATING_TAGS = [
  { label: 'Actor', icon: Film, top: '12%', left: '10%', delay: '0s' },
  { label: 'Director', icon: Camera, top: '28%', right: '8%', delay: '0.6s' },
  { label: 'Singer', icon: Mic2, top: '58%', left: '6%', delay: '1.1s' },
  { label: 'Producer', icon: Star, bottom: '22%', right: '12%', delay: '0.3s' },
];

const labelStyle = {
  display: 'block', fontSize: '0.78rem', fontWeight: 700,
  color: 'var(--color-foreground)', marginBottom: '0.4rem',
  textTransform: 'uppercase' as const, letterSpacing: '0.05em'
};

const fieldStyle = {
  height: '44px', fontSize: '0.92rem', borderRadius: '10px',
  transition: 'border-color 0.2s, box-shadow 0.2s'
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const focusStyle = (key: string) =>
    focused === key ? { borderColor: 'var(--color-primary)', boxShadow: '0 0 0 3px var(--color-primary-subtle)' } : {};

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    // Create a local object URL for preview
    setPhotoUrl(URL.createObjectURL(file));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    if (photoFile) {
      fd.append('file', photoFile);
    }

    void (async () => {
      try {
        const { user, token, membership } = await api.register(fd) as any;
        dispatch(register({ user, token } as never));

        if (membership && membership.id) {
          const order = await api.createOrder({
            amount: 1000,
            currency: 'INR',
            membershipId: membership.id,
            applicantEmail: String(fd.get('email'))
          }) as any;

          const options = {
            key: order.keyId || 'dummy_key',
            amount: order.amount,
            currency: order.currency,
            name: 'Rajasthan Cine Association',
            description: 'Registration & Membership Fee',
            order_id: order.id,
            handler: async (response: any) => {
              try {
                if (!order.mock) {
                  await api.verifyPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    membershipId: membership.id
                  });
                }
                navigate('/dashboard', { replace: true });
              } catch (err: any) {
                setError(err.message || 'Payment verification failed');
                setLoading(false);
              }
            },
            prefill: {
              name: String(fd.get('fullName')),
              email: String(fd.get('email')),
              contact: String(fd.get('contact') || '')
            },
            theme: { color: '#F5C842' },
            modal: {
              ondismiss: () => {
                navigate('/dashboard', { replace: true });
              }
            }
          };

          if (order.mock) {
            setTimeout(() => options.handler({}), 1500);
          } else {
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', (r: any) => setError(r.error.description));
            rzp.open();
          }
        } else {
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed.');
        setLoading(false);
      }
    })();
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ═══════════════ LEFT PANEL ═══════════════ */}
      <div
        style={{
          position: 'sticky', top: 0, height: '100vh',
          background: 'linear-gradient(155deg, #1C1917 0%, #2c1f08 55%, #3b2a0a 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '4rem 3.5rem', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(250,147,26,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(250,147,26,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {FLOATING_TAGS.map(({ label, icon: Icon, delay, ...pos }) => (
          <div key={label} style={{ position: 'absolute', ...pos, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '99px', padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 600, animation: `floatBob 4s ease-in-out ${delay} infinite alternate` }}>
            <Icon size={13} style={{ color: '#F5C842' }} />
            {label}
          </div>
        ))}

        <Link to="/" className="font-serif" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#F5C842', textDecoration: 'none', letterSpacing: '-0.02em', marginBottom: '3rem', display: 'inline-block' }}>
          Rajasthan Cine Association
        </Link>

        <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Where talent meets<br />
          <span style={{ color: '#F5C842' }}>opportunity.</span>
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', marginBottom: '3rem', lineHeight: 1.7, maxWidth: '380px' }}>
          Join the region's most trusted platform for film, music, and performance talent. Thousands of creators already on board.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {STEPS.map(({ num, icon: Icon, title, desc }) => (
            <div key={num} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: '12px', flexShrink: 0, background: 'rgba(245,200,66,0.12)', border: '1px solid rgba(245,200,66,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} style={{ color: '#F5C842' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
                  <span style={{ color: 'rgba(245,200,66,0.6)', marginRight: '0.5rem', fontSize: '0.75rem' }}>0{num}</span>{title}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '2.5rem' }}>
          {[['2,400+', 'Active Talents'], ['140+', 'Studios'], ['98%', 'Match Rate']].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F5C842', fontFamily: 'serif', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ RIGHT PANEL ═══════════════ */}
      <div style={{ background: 'var(--color-background)', overflowY: 'auto', padding: '4rem 3.5rem' }}>
        <div style={{ maxWidth: '500px', width: '100%', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--color-primary-subtle)', color: 'var(--color-primary)', padding: '0.3rem 0.85rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <Star size={12} /> Registration Fee: ₹1000
            </div>
            <h2 className="font-serif" style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-foreground)', lineHeight: 1.1, marginBottom: '0.5rem' }}>
              Create your Rajasthan Cine Association ID
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-muted-foreground)', lineHeight: 1.6 }}>
              Already a member?{' '}
              <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>Sign in here →</Link>
            </p>
          </div>

          {error && (
            <div style={{ background: 'var(--color-danger-bg)', border: '1px solid #fca5a5', color: 'var(--color-danger)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* ── Photo ── */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 110, height: 130, border: '2px dashed var(--color-border)', borderRadius: '8px', background: 'var(--color-surface)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--color-muted-foreground)', cursor: 'pointer', position: 'relative' }}>
                  {photoUrl ? (
                    <img src={photoUrl} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <UploadCloud size={22} />
                      <span style={{ fontSize: '0.72rem', textAlign: 'center', lineHeight: 1.3 }}>Passport<br />Photo</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-muted-foreground)', textAlign: 'center', marginTop: '0.35rem' }}>PHOTO</div>
              </div>
            </div>

            {/* ── Section: Personal Info ── */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted-foreground)', marginBottom: '1rem' }}>Personal Information</p>

              {/* Full Name */}
              <div style={{ marginBottom: '1rem' }}>
                <Field label="Name / नाम">
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: focused === 'name' ? 'var(--color-primary)' : 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
                    <input name="fullName" required placeholder="Your full or stage name" className="field" onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} style={{ ...fieldStyle, paddingLeft: '2.5rem', ...focusStyle('name') }} />
                  </div>
                </Field>
              </div>

              {/* Father/Husband Name */}
              <div style={{ marginBottom: '1rem' }}>
                <Field label="Father / Husband's Name — पिता / पति का नाम">
                  <input name="fatherName" placeholder="Father or Husband's name" className="field" onFocus={() => setFocused('father')} onBlur={() => setFocused(null)} style={{ ...fieldStyle, ...focusStyle('father') }} />
                </Field>
              </div>

              {/* Age + Gender + DOB */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <Field label="Age / उम्र">
                  <input name="age" type="number" min={1} max={120} placeholder="Age" className="field" onFocus={() => setFocused('age')} onBlur={() => setFocused(null)} style={{ ...fieldStyle, ...focusStyle('age') }} />
                </Field>
                <Field label="Gender / लिंग">
                  <select name="gender" className="field" defaultValue="Male" onFocus={() => setFocused('gender')} onBlur={() => setFocused(null)} style={{ ...fieldStyle, ...focusStyle('gender') }}>
                    <option value="Male">Male / पुरुष</option>
                    <option value="Female">Female / महिला</option>
                    <option value="Other">Other / अन्य</option>
                  </select>
                </Field>
                <Field label="DOB / जन्म तिथि">
                  <input name="dob" type="date" className="field" onFocus={() => setFocused('dob')} onBlur={() => setFocused(null)} style={{ ...fieldStyle, ...focusStyle('dob') }} />
                </Field>
              </div>

              {/* Qualification */}
              <div style={{ marginBottom: '1rem' }}>
                <Field label="Qualification / शिक्षा">
                  <div style={{ position: 'relative' }}>
                    <GraduationCap size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
                    <input name="qualification" placeholder="e.g. Graduate, Post-Graduate" className="field" onFocus={() => setFocused('qual')} onBlur={() => setFocused(null)} style={{ ...fieldStyle, paddingLeft: '2.5rem', ...focusStyle('qual') }} />
                  </div>
                </Field>
              </div>

              {/* Present Status */}
              <div style={{ marginBottom: '1rem' }}>
                <Field label="At present I am / वर्तमान में मैं">
                  <input name="presentStatus" placeholder="e.g. Actor, Student, Freelancer" className="field" onFocus={() => setFocused('status')} onBlur={() => setFocused(null)} style={{ ...fieldStyle, ...focusStyle('status') }} />
                </Field>
              </div>

              {/* Occupation */}
              <div style={{ marginBottom: '1rem' }}>
                <Field label="Occupation / व्यवसाय">
                  <div style={{ position: 'relative' }}>
                    <Briefcase size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
                    <input name="occupation" placeholder="Your occupation (if any)" className="field" onFocus={() => setFocused('occ')} onBlur={() => setFocused(null)} style={{ ...fieldStyle, paddingLeft: '2.5rem', ...focusStyle('occ') }} />
                  </div>
                </Field>
              </div>
            </div>

            {/* ── Section: Contact & Address ── */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted-foreground)', marginBottom: '1rem' }}>Contact & Address</p>

              {/* Address */}
              <div style={{ marginBottom: '1rem' }}>
                <Field label="Address / पता">
                  <div style={{ position: 'relative' }}>
                    <MapPin size={14} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
                    <textarea name="address" rows={2} placeholder="Full residential address" className="field" onFocus={() => setFocused('addr')} onBlur={() => setFocused(null)} style={{ paddingLeft: '2.5rem', fontSize: '0.92rem', borderRadius: '10px', resize: 'vertical', ...focusStyle('addr') }} />
                  </div>
                </Field>
              </div>

              {/* Pincode + Contact */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <Field label="Pincode / पिनकोड">
                  <input name="pincode" type="text" maxLength={6} placeholder="Pincode" className="field" onFocus={() => setFocused('pin')} onBlur={() => setFocused(null)} style={{ ...fieldStyle, ...focusStyle('pin') }} />
                </Field>
                <Field label="Contact No. / संपर्क">
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
                    <input name="contact" type="tel" placeholder="Mobile number" className="field" onFocus={() => setFocused('contact')} onBlur={() => setFocused(null)} style={{ ...fieldStyle, paddingLeft: '2.5rem', ...focusStyle('contact') }} />
                  </div>
                </Field>
              </div>

              {/* Email + Aadhar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <Field label="Email / ई-मेल">
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: focused === 'email' ? 'var(--color-primary)' : 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
                    <input name="email" type="email" required placeholder="you@example.com" className="field" onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} style={{ ...fieldStyle, paddingLeft: '2.5rem', ...focusStyle('email') }} />
                  </div>
                </Field>
                <Field label="Aadhar No. / आधार नंबर">
                  <div style={{ position: 'relative' }}>
                    <CreditCard size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
                    <input name="aadharNo" type="text" maxLength={12} placeholder="12-digit Aadhar" className="field" onFocus={() => setFocused('aadhar')} onBlur={() => setFocused(null)} style={{ ...fieldStyle, paddingLeft: '2.5rem', ...focusStyle('aadhar') }} />
                  </div>
                </Field>
              </div>
            </div>

            {/* ── Section: Account ── */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted-foreground)', marginBottom: '1rem' }}>Account Credentials</p>

              {/* Password */}
              <Field label="Create Password">
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: focused === 'pass' ? 'var(--color-primary)' : 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
                  <input name="password" type={showPass ? 'text' : 'password'} required minLength={8} placeholder="At least 8 characters" className="field" onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)} style={{ ...fieldStyle, paddingLeft: '2.5rem', paddingRight: '2.5rem', ...focusStyle('pass') }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)', display: 'flex' }}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </Field>
            </div>

            {/* ── Section: Proposed & Seconded ── */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted-foreground)', marginBottom: '0.4rem' }}>Proposed & Seconded By</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', fontStyle: 'italic', marginBottom: '1rem' }}>
                Note: Proposed &amp; Seconded by our life time &amp; Regular member only.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Field label="Proposed By (Name)">
                  <input name="proposedBy" placeholder="Name" className="field" style={{ ...fieldStyle }} />
                </Field>
                <Field label="Membership No.">
                  <input name="proposedByMembershipNo" placeholder="Membership No." className="field" style={{ ...fieldStyle }} />
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <Field label="Seconded By (Name)">
                  <input name="secondedBy" placeholder="Name" className="field" style={{ ...fieldStyle }} />
                </Field>
                <Field label="Membership No.">
                  <input name="secondedByMembershipNo" placeholder="Membership No." className="field" style={{ ...fieldStyle }} />
                </Field>
              </div>

              {/* Place */}
              <Field label="Place / स्थान">
                <input name="place" placeholder="City / Town" className="field" style={{ ...fieldStyle }} />
              </Field>
            </div>

            {/* Terms */}
            <p style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', lineHeight: 1.6 }}>
              मैं सत्यापित करता/करती हूँ — I solemnly declare that the above particulars are true and correct, and I agree to abide by the existing rules and regulations of the constitution.{' '}
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Terms of Service</span> &amp;{' '}
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Privacy Policy</span>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '0.95rem', borderRadius: '14px', fontWeight: 700, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {loading ? 'Creating your ID…' : <><span>Create My Rajasthan Cine Association ID</span> <ArrowRight size={17} /></>}
            </button>
          </form>

          <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'flex-start', gap: '0.65rem', marginBottom: '3rem' }}>
            <CheckCircle2 size={16} style={{ color: '#2D5016', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', lineHeight: 1.5 }}>
              Your profile will be reviewed within <strong style={{ color: 'var(--color-foreground)' }}>24–48 hours</strong> before going live. We'll email you once approved.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatBob {
          from { transform: translateY(0px); }
          to   { transform: translateY(-8px); }
        }
        @media (max-width: 768px) {
          .register-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
