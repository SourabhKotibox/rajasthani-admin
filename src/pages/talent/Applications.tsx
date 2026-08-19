import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { Clapperboard, Calendar, ArrowRight, ExternalLink, Activity } from 'lucide-react';

const APP_STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  submitted: { label: 'Submitted', badge: 'badge-muted' },
  under_review: { label: 'Under Review', badge: 'badge-warning' },
  shortlisted: { label: 'Shortlisted', badge: 'badge-success' },
  rejected: { label: 'Not Selected', badge: 'badge-danger' },
};

export default function Applications() {
  const user = useAppSelector((s) => s.auth.user)!;
  const applications = useAppSelector((s) => s.data.applications.filter((a) => a.userId === user.id));
  const casting = useAppSelector((s) => s.data.casting);

  const enriched = applications.map((a) => {
    const call = casting.find((c) => c.id === a.castingCallId);
    return { ...a, call };
  }).sort((a, b) => String(b.id).localeCompare(String(a.id)));

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Applications</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem' }}>Track your casting submissions</p>
        </div>
        <Link to="/casting" className="btn-primary btn-sm">
          <Clapperboard size={14} /> Browse Roles
        </Link>
      </div>

      {enriched.length === 0 ? (
        <div style={{ background: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: '14px', padding: '4rem 1.25rem', textAlign: 'center' }}>
          <Activity size={40} style={{ margin: '0 auto 1rem', opacity: 0.35, color: 'var(--color-muted-foreground)' }} />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>No applications yet</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginBottom: '1.5rem', maxWidth: '360px', margin: '0 auto 1.5rem' }}>
            Find open casting calls for movies, TV series, and music videos. Apply directly with your Rajasthan Cine Association portfolio.
          </p>
          <Link to="/casting" className="btn-outline btn-sm">
            View Casting Board
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {enriched.map((app, i) => (
            <div key={app.id} className={`rca-card animate-slide-up stagger-${Math.min(i + 1, 6)}`} style={{ display: 'flex', flexWrap: 'wrap' }}>
              {/* Image side */}
              {app.call?.imageUrl && (
                <div style={{ width: '180px', height: '100%', minHeight: '140px', flexShrink: 0, position: 'relative' }} className="hidden sm:block">
                  <img src={app.call.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, var(--color-card))' }} />
                </div>
              )}
              
              {/* Content side */}
              <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', minWidth: '280px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                      {app.call?.projectTitle || 'Unknown Project'}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                      Role: {app.roleAppliedFor}
                    </p>
                  </div>
                  <span className={`badge ${APP_STATUS_CONFIG[app.status]?.badge || 'badge-muted'}`}>
                    {APP_STATUS_CONFIG[app.status]?.label || app.status}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
                    <Calendar size={13} />
                    Applied: <strong style={{ color: 'var(--color-foreground)', fontWeight: 500 }}>Recent</strong>
                  </div>
                  {app.call && (
                    <Link to={`/casting/${app.call.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--color-muted-foreground)', textDecoration: 'none', marginLeft: 'auto' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-muted-foreground)'}
                    >
                      View listing <ExternalLink size={12} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
