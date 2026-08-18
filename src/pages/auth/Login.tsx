import { FormEvent, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { login } from '@/store';
import {
  LogIn, Mail, Lock, User, ShieldCheck, Eye, EyeOff,
  Star, Film, Mic2, Camera, ArrowRight, Loader2,
} from 'lucide-react';
import { api } from '@/api/client';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const [roleMode, setRoleMode] = useState<'talent' | 'admin'>('talent');
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already authenticated — redirect immediately
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email'));
    const password = String(fd.get('password'));
    void (async () => {
      try {
        const { user, token } = await api.login({ email, password, role: roleMode });
        dispatch(login({ user, token } as never));
        // Navigate immediately after dispatch — don't wait for React to re-render
        navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : `Invalid ${roleMode} credentials. Please check your email and password.`,
        );
        setLoading(false);
      }
    })();
  };

  const isAdmin = roleMode === 'admin';

  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: '100dvh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ═══════════════ LEFT — dark brand panel ═══════════════ */}
      <div style={{
        position: 'relative',
        background: isAdmin
          ? 'linear-gradient(155deg,#0d1b2a 0%,#162032 55%,#1a2a40 100%)'
          : 'linear-gradient(155deg,#1C1917 0%,#2c1f08 55%,#3b2a0a 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem 3.5rem',
        overflow: 'hidden',
        transition: 'background 0.5s',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px', width: 320, height: 320,
          borderRadius: '50%',
          background: isAdmin
            ? 'radial-gradient(circle,rgba(79,156,249,0.2) 0%,transparent 70%)'
            : 'radial-gradient(circle,rgba(250,147,26,0.25) 0%,transparent 70%)',
          pointerEvents: 'none', transition: 'background 0.5s',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px', width: 240, height: 240,
          borderRadius: '50%',
          background: isAdmin
            ? 'radial-gradient(circle,rgba(79,156,249,0.12) 0%,transparent 70%)'
            : 'radial-gradient(circle,rgba(250,147,26,0.15) 0%,transparent 70%)',
          pointerEvents: 'none', transition: 'background 0.5s',
        }} />

        {/* Floating talent tags (talent mode only) */}
        {!isAdmin && (
          <>
            {[
              { label: 'Actor', icon: Film, style: { top: '14%', left: '8%' }, delay: '0s' },
              { label: 'Director', icon: Camera, style: { top: '30%', right: '6%' }, delay: '0.7s' },
              { label: 'Singer', icon: Mic2, style: { top: '60%', left: '5%' }, delay: '1.2s' },
              { label: 'Producer', icon: Star, style: { bottom: '20%', right: '10%' }, delay: '0.4s' },
            ].map(({ label, icon: Icon, style: pos, delay }) => (
              <div key={label} style={{
                position: 'absolute', ...pos,
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '99px',
                padding: '0.4rem 0.95rem',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.78rem', fontWeight: 600,
                animation: `floatBob 4s ease-in-out ${delay} infinite alternate`,
              }}>
                <Icon size={13} style={{ color: '#F5C842' }} /> {label}
              </div>
            ))}
          </>
        )}

        {/* Logo */}
        <Link to="/" className="font-serif" style={{
          fontSize: '2.4rem', fontWeight: 800,
          color: isAdmin ? '#4f9cf9' : '#F5C842',
          textDecoration: 'none', letterSpacing: '-0.02em',
          marginBottom: '3rem', display: 'inline-block',
          transition: 'color 0.3s',
        }}>
          Rajasthani Cinema Association
        </Link>

        {/* Headline */}
        <h1 className="font-serif" style={{
          fontSize: 'clamp(1.8rem,3.5vw,2.6rem)',
          fontWeight: 800, color: '#fff',
          lineHeight: 1.15, marginBottom: '1rem',
          letterSpacing: '-0.02em',
        }}>
          {isAdmin
            ? <>Secure <span style={{ color: '#4f9cf9' }}>admin</span><br />access.</>
            : <>Welcome<br />back to <span style={{ color: '#F5C842' }}>Rajasthani Cinema Association.</span></>
          }
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '340px', marginBottom: '3rem' }}>
          {isAdmin
            ? 'Manage talent profiles, review applications and configure the platform from one secure console.'
            : 'Sign in to update your portfolio, apply to open casting calls and manage your Rajasthani Cinema Association professional identity.'}
        </p>

        {/* Stats / trust badges */}
        <div style={{
          display: 'flex', gap: '0', flexWrap: 'wrap',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px', overflow: 'hidden', maxWidth: '380px',
        }}>
          {(isAdmin
            ? [['12', 'Admin tools'], ['200+', 'Profiles'], ['50+', 'Casting']]
            : [['2,400+', 'Talents'], ['140+', 'Studios'], ['98%', 'Matched']]
          ).map(([val, lbl], i, arr) => (
            <div key={lbl} style={{
              flex: 1, padding: '1rem', textAlign: 'center',
              borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: isAdmin ? '#4f9cf9' : '#F5C842', lineHeight: 1, fontFamily: 'serif' }}>{val}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{lbl}</div>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes floatBob {
            from { transform: translateY(0); }
            to   { transform: translateY(-8px); }
          }
        `}</style>
      </div>

      {/* ═══════════════ RIGHT — form panel ═══════════════ */}
      <div style={{
        background: 'var(--color-background)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '3rem 3.5rem',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Role switcher */}
          <div style={{
            display: 'flex',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px', padding: '0.3rem',
            marginBottom: '2rem', gap: '0.25rem',
          }}>
            {([['talent', <User size={14} />, 'Talent Login'], ['admin', <ShieldCheck size={14} />, 'Admin Login']] as const).map(([mode, icon, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => { setRoleMode(mode); setError(''); }}
                style={{
                  flex: 1, padding: '0.6rem 1rem',
                  borderRadius: '9px', fontSize: '0.82rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: roleMode === mode ? 'var(--color-card)' : 'transparent',
                  color: roleMode === mode ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
                  boxShadow: roleMode === mode ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 className="font-serif" style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-foreground)', lineHeight: 1.1, marginBottom: '0.5rem' }}>
              {isAdmin ? 'Admin Console' : 'Sign in'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>
              {isAdmin ? 'Restricted access — authorised personnel only.' : (
                <>
                  New to Rajasthani Cinema Association?{' '}
                  <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
                    Create your free ID →
                  </Link>
                </>
              )}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'var(--color-danger-bg)', border: '1px solid #fca5a5',
              color: 'var(--color-danger)', borderRadius: '10px',
              padding: '0.75rem 1rem', fontSize: '0.84rem', fontWeight: 600,
              marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'email' ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                  pointerEvents: 'none', transition: 'color 0.2s',
                }} />
                <input
                  name="email" type="email" required
                  placeholder={isAdmin ? 'admin@rajasthaniacinema.org' : 'you@example.com'}
                  className="field"
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  style={{
                    paddingLeft: '2.75rem', height: '48px', fontSize: '0.95rem', borderRadius: '12px',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    ...(focused === 'email' ? { borderColor: 'var(--color-primary)', boxShadow: '0 0 0 3px var(--color-primary-subtle)' } : {}),
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'pass' ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                  pointerEvents: 'none', transition: 'color 0.2s',
                }} />
                <input
                  name="password" type={showPass ? 'text' : 'password'} required
                  placeholder="Your password"
                  className="field"
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused(null)}
                  style={{
                    paddingLeft: '2.75rem', paddingRight: '2.75rem', height: '48px', fontSize: '0.95rem', borderRadius: '12px',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    ...(focused === 'pass' ? { borderColor: 'var(--color-primary)', boxShadow: '0 0 0 3px var(--color-primary-subtle)' } : {}),
                  }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)', padding: '4px', display: 'flex' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%', justifyContent: 'center',
                padding: '0.9rem', fontSize: '0.95rem',
                borderRadius: '14px', marginTop: '0.25rem',
                fontWeight: 700, letterSpacing: '0.01em',
                background: isAdmin ? '#1a4a7a' : undefined,
                borderColor: isAdmin ? '#1a4a7a' : undefined,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <LogIn size={16} />}
              {loading ? 'Signing in…' : isAdmin ? 'Access Admin Console' : 'Sign In to Rajasthani Cinema Association'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{
            marginTop: '1.75rem',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px', padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
              Demo credentials
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-foreground)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {isAdmin ? (
                <div>Email: <code style={{ fontFamily: 'monospace', background: 'var(--color-muted)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.8rem' }}>admin@rajasthaniacinema.org</code> &nbsp; Pass: <code style={{ fontFamily: 'monospace', background: 'var(--color-muted)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.8rem' }}>password123</code></div>
              ) : (
                <div>Email: <code style={{ fontFamily: 'monospace', background: 'var(--color-muted)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.8rem' }}>amara@example.com</code> &nbsp; Pass: <code style={{ fontFamily: 'monospace', background: 'var(--color-muted)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.8rem' }}>password123</code></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
