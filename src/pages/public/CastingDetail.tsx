import { FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { applyCasting } from '@/store';
import { api } from '@/api/client';
import { Calendar, Building2, CheckCircle, ArrowLeft, Users, BadgeCheck, Send } from 'lucide-react';

export default function CastingDetail() {
  const { id } = useParams();
  // MongoDB returns string ObjectIDs — compare as strings
  const call = useAppSelector((s) => s.data.casting.find((c) => String(c.id) === String(id)));
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const [role, setRole] = useState('');
  const [done, setDone] = useState(false);

  if (!call) {
    return (
      <div style={{ padding: '6rem 1.25rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Casting call not found</p>
        <Link to="/casting" className="btn-primary btn-sm">← Back to Casting Board</Link>
      </div>
    );
  }

  const onApply = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const body = {
      castingCallId: call.id,
      userId: user.id,
      roleAppliedFor: role,
      availability: String(fd.get('availability')),
      coverNote: String(fd.get('coverNote') || ''),
    };
    try {
      const created = await api.applyCasting(body as never);
      dispatch(applyCasting(created as never));
    } catch {
      dispatch(applyCasting(body));
    }
    setDone(true);
  };

  const typeLabel: Record<string, string> = {
    Movie: 'Movie', TVSeries: 'TV Series', MusicVideo: 'Music Video', ShortDrama: 'Short Drama',
  };

  return (
    <div className="animate-fade-in">

      {/* Hero image */}
      <div style={{ position: 'relative', height: 'clamp(280px, 45vw, 480px)', overflow: 'hidden' }}>
        <img src={call.imageUrl} alt={call.projectTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,25,23,0.92) 0%, rgba(28,25,23,0.45) 50%, rgba(28,25,23,0.1) 100%)' }} />

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem 2.5rem' }}>
          <Link to="/casting" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '1rem' }}>
            <ArrowLeft size={13} /> Casting Board
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5C842' }}>{typeLabel[call.projectType]}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ fontSize: '0.72rem', color: call.status === 'open' ? '#6fcf97' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
              {call.status === 'open' ? '● Open' : '○ Closed'}
            </span>
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.05 }}>
            {call.projectTitle}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: '2.5rem', flexWrap: 'wrap' as any }}>

          {/* Main content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-foreground)' }}>
              {call.rolesDescription}
            </p>

            {/* Roles */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.4rem' }}>
              <h2 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={16} style={{ color: 'var(--color-primary)' }} /> Open Roles
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {call.roles.map((r) => (
                  <span key={r} style={{ padding: '0.45rem 1rem', border: '1.5px solid var(--color-border)', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground)', background: 'var(--color-card)' }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.4rem' }}>
              <h2 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BadgeCheck size={16} style={{ color: 'var(--color-primary)' }} /> Eligibility
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)', lineHeight: 1.7 }}>
                {call.eligibilityCriteria}
              </p>
            </div>

            {/* Apply form or auth gate */}
            {!user ? (
              <div style={{ background: 'var(--color-primary-subtle)', border: '1.5px solid var(--color-primary-tint)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-foreground)', marginBottom: '1rem', fontWeight: 500 }}>
                  Please <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>log in</Link> as a talent member to apply.
                </p>
                <Link to="/login" className="btn-primary btn-sm">Log in to Apply</Link>
              </div>
            ) : user.role !== 'talent' ? (
              <div style={{ background: 'var(--color-muted)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-muted-foreground)', fontSize: '0.9rem' }}>Only talent accounts can apply for casting calls.</p>
              </div>
            ) : done ? (
              <div style={{ background: 'var(--color-success-bg)', border: '1.5px solid #6fcf97', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={22} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--color-success)', marginBottom: '0.2rem' }}>Application submitted!</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-success)' }}>UI demo — no payment gateway connected. Rajasthan Cine Association admin will review your application.</p>
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--color-card)', border: '1.5px solid var(--color-border)', borderRadius: '12px', padding: '1.5rem' }}>
                <h2 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                  Submit Application
                </h2>
                <form onSubmit={onApply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label className="field-label">Role Applying For</label>
                    <select required value={role} onChange={(e) => setRole(e.target.value)} className="field">
                      <option value="">Select a role…</option>
                      {call.roles.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Availability</label>
                    <input name="availability" required placeholder="e.g. Available from 15 Aug" className="field" />
                  </div>
                  <div>
                    <label className="field-label">Cover Note (optional)</label>
                    <textarea name="coverNote" rows={3} placeholder="A brief note about why you're right for this role…" className="field" />
                  </div>
                  <div style={{ paddingTop: '0.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      <Send size={14} /> Submit Application
                      {call.applicationFee > 0 && <span style={{ marginLeft: '0.25rem', opacity: 0.85 }}>— ₹ {call.applicationFee.toLocaleString()}</span>}
                    </button>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', marginTop: '0.5rem', textAlign: 'center' }}>
                      Payment gateway not yet connected — demo only.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content', position: 'sticky', top: '90px' }}>
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={call.imageUrl} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>
                  <Building2 size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span>{call.productionHouse}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>
                  <Calendar size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span>Deadline: <strong style={{ color: 'var(--color-foreground)' }}>{call.deadline}</strong></span>
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.85rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', marginBottom: '0.25rem' }}>Application Fee</div>
                  <div className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 800, color: call.applicationFee > 0 ? 'var(--color-primary)' : 'var(--color-success)' }}>
                    {call.applicationFee > 0 ? `₹ ${call.applicationFee.toLocaleString()}` : 'Free'}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>
                  Status: <span style={{ fontWeight: 700, color: call.status === 'open' ? 'var(--color-success)' : 'var(--color-danger)' }}>{call.status}</span>
                </div>
              </div>
            </div>

            <Link to="/casting" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--color-muted-foreground)', textDecoration: 'none', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '10px', background: 'var(--color-surface)', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-muted-foreground)'}
            >
              <ArrowLeft size={13} /> More casting calls
            </Link>
          </aside>

        </div>
      </div>
    </div>
  );
}
