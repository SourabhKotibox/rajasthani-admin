import React from 'react';
import { User, Calendar, MapPin, Briefcase } from 'lucide-react';
import { Branding } from '@/store';

interface MembershipCardProps {
  membership: any;
  branding: Branding;
}

export function MembershipCard({ membership, branding }: MembershipCardProps) {
  const colorMap: Record<string, string> = {
    gold: 'linear-gradient(135deg, #4A3A15 0%, #1A1407 100%)',
    silver: 'linear-gradient(135deg, #3A3A3A 0%, #111111 100%)',
    black: 'linear-gradient(135deg, #151515 0%, #000000 100%)',
    blue: 'linear-gradient(135deg, #1A2B4C 0%, #080D1A 100%)',
    red: 'linear-gradient(135deg, #4C1A1A 0%, #1A0808 100%)',
  };
  const bg = colorMap[membership?.cardColor] || colorMap.gold;

  return (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      background: bg,
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--color-primary-subtle)',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        borderBottom: '1px solid var(--color-border)'
      }}>
        {branding.logoUrl ? (
          <img src={branding.logoUrl} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
        ) : (
          <div style={{
            width: '40px',
            height: '40px',
            background: 'var(--color-primary)',
            color: '#000',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}>
            RCA
          </div>
        )}
        <div>
          <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
            {branding.platformName || 'Rajasthani Cinema Association'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground)', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Official Member
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '2rem 1.5rem', display: 'flex', gap: '1.5rem' }}>
        <div style={{
          width: '100px',
          height: '120px',
          background: 'var(--color-surface)',
          borderRadius: '8px',
          border: '2px solid var(--color-border)',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {membership.photoUrl ? (
            <img src={membership.photoUrl} alt="Member" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted-foreground)' }}>
              <User size={40} />
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</div>
            <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>{membership.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Membership No.</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)', letterSpacing: '0.1em' }}>
              {membership.membershipNo || 'PENDING'}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--color-foreground)' }}>
              <Calendar size={12} style={{ color: 'var(--color-muted-foreground)' }} />
              {membership.dob || '-'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--color-foreground)' }}>
              <Briefcase size={12} style={{ color: 'var(--color-muted-foreground)' }} />
              {membership.occupation || '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1.5rem', fontSize: '0.75rem', color: 'var(--color-muted-foreground)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div>Valid from: {new Date(membership.createdAt).toLocaleDateString()}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={10} /> Rajasthan, India</div>
      </div>
    </div>
  );
}
