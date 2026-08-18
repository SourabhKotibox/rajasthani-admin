import { Link } from 'react-router-dom';
import { Calendar, MapPin, User, Clapperboard, ExternalLink, Star } from 'lucide-react';
import type { CastingCall, PortfolioEntry, TalentProfile, ProjectType } from '@/data/mock';

const TYPE_LABEL: Record<ProjectType, string> = {
  Movie: 'Movie',
  TVSeries: 'TV Series',
  MusicVideo: 'Music Video',
  ShortDrama: 'Short Drama',
};

const TYPE_COLOR: Record<ProjectType, string> = {
  Movie: 'badge-primary',
  TVSeries: 'badge-info',
  MusicVideo: 'badge-warning',
  ShortDrama: 'badge-success',
};

/* ===================================================================
   TALENT CARD
=================================================================== */
export function TalentCard({ profile }: { profile: TalentProfile }) {
  return (
    <Link
      to={`/talent/${profile.id}`}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}
      className="rca-card"
    >
      <div style={{ position: 'relative', aspectRatio: '3/4', background: 'var(--color-muted)', overflow: 'hidden' }}>
        {profile.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt={profile.displayName}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'}
            onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={48} style={{ color: 'var(--color-muted-foreground)' }} />
          </div>
        )}

        {profile.isFeatured && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--color-primary)',
            color: '#fff',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            padding: '3px 10px',
            borderRadius: '99px',
          }}>
            <Star size={9} fill="currentColor" /> Featured
          </div>
        )}

        {/* Gradient overlay at bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(28,25,23,0.55), transparent)' }} />
      </div>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        <h3 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-foreground)', lineHeight: 1.2 }}>
          {profile.displayName}
        </h3>
        {profile.stageName && (
          <p style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', marginTop: '-0.1rem' }}>
            aka {profile.stageName}
          </p>
        )}
        <p style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={12} /> {profile.location}
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-foreground)', opacity: 0.75, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {profile.bio}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
          {profile.categories.slice(0, 3).map((c) => (
            <span key={c} className="badge badge-primary">{c}</span>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>
          {profile.yearsOfExperience} yrs experience
        </p>
      </div>
    </Link>
  );
}

/* ===================================================================
   CASTING CARD
=================================================================== */
export function CastingCard({ call }: { call: CastingCall }) {
  return (
    <Link
      to={`/casting/${call.id}`}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}
      className="rca-card"
    >
      <div style={{ position: 'relative', aspectRatio: '16/10', background: 'var(--color-muted)', overflow: 'hidden' }}>
        <img
          src={call.imageUrl}
          alt={call.projectTitle}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)'}
          onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,25,23,0.75) 0%, transparent 60%)' }} />
        <span className={`badge ${TYPE_COLOR[call.projectType]}`} style={{ position: 'absolute', top: '12px', left: '12px' }}>
          {TYPE_LABEL[call.projectType]}
        </span>
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: call.applicationFee > 0 ? 'var(--color-primary)' : '#2D5016', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>
          {call.applicationFee > 0 ? `₹ ${call.applicationFee.toLocaleString()}` : 'Free'}
        </div>
      </div>

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <h3 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-foreground)', lineHeight: 1.2 }}>
          {call.projectTitle}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', fontWeight: 500 }}>{call.productionHouse}</p>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-foreground)', opacity: 0.75, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {call.rolesDescription}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', paddingTop: '0.25rem' }}>
          {call.roles.map((r) => (
            <span key={r} style={{ fontSize: '0.72rem', border: '1px solid var(--color-border)', padding: '2px 8px', borderRadius: '6px', color: 'var(--color-muted-foreground)' }}>
              {r}
            </span>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.3rem', paddingTop: '0.2rem' }}>
          <Calendar size={11} /> Deadline {call.deadline}
        </p>
      </div>
    </Link>
  );
}

/* ===================================================================
   CREDIT CARD
=================================================================== */
export function CreditCard({
  entry,
  talentName,
  talentId,
  talentPhoto,
}: {
  entry: PortfolioEntry;
  talentName?: string;
  talentId?: number;
  talentPhoto?: string;
}) {
  return (
    <article style={{ display: 'flex', flexDirection: 'column', height: '100%' }} className="rca-card">
      <div style={{ position: 'relative', aspectRatio: '16/10', background: 'var(--color-muted)', overflow: 'hidden' }}>
        <img
          src={entry.imageUrl}
          alt={entry.projectTitle}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'}
          onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,25,23,0.5), transparent 60%)' }} />
        <span className={`badge ${TYPE_COLOR[entry.projectType]}`} style={{ position: 'absolute', top: '12px', left: '12px' }}>
          {TYPE_LABEL[entry.projectType]}
        </span>
        {entry.releaseYear && (
          <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(28,25,23,0.7)', color: '#fff', fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '6px' }}>
            {entry.releaseYear}
          </span>
        )}
      </div>

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <h3 className="font-serif" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
          {entry.projectTitle}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Clapperboard size={11} /> {entry.role}
        </p>
        {entry.productionHouse && (
          <p style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)' }}>{entry.productionHouse}</p>
        )}
        {entry.platform && (
          <span className="badge badge-muted" style={{ width: 'fit-content' }}>{entry.platform}</span>
        )}
        {entry.description && (
          <p style={{ fontSize: '0.8rem', color: 'var(--color-foreground)', opacity: 0.72, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {entry.description}
          </p>
        )}

        {talentName && talentId && (
          <Link
            to={`/talent/${talentId}`}
            style={{
              marginTop: 'auto',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: 'var(--color-primary)',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >
            {talentPhoto ? (
              <img src={talentPhoto} alt="" style={{ width: '26px', height: '26px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--color-primary-tint)' }} />
            ) : (
              <User size={18} />
            )}
            {talentName}
            <ExternalLink size={11} style={{ marginLeft: 'auto' }} />
          </Link>
        )}
      </div>
    </article>
  );
}
