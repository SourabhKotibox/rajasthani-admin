import { Link } from 'react-router-dom';
import { WORK_TYPES } from '@/data/mock';
import { Sparkles, Users, Clapperboard, Shield, Film, Tv, Music, Drama, ArrowRight } from 'lucide-react';

const WORK_ICONS: Record<string, React.ReactNode> = {
  movies: <Film size={22} />,
  'tv-series': <Tv size={22} />,
  'music-videos': <Music size={22} />,
  'short-dramas': <Drama size={22} />,
};

function ValueProp({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div style={{
      background: 'var(--color-card)',
      border: '1px solid var(--color-border)',
      borderRadius: '14px',
      padding: '1.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      transition: 'box-shadow 0.25s, transform 0.25s',
    }}
      className="rca-card"
    >
      <div style={{ width: '46px', height: '46px', background: 'var(--color-primary-subtle)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
        {icon}
      </div>
      <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-foreground)' }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

import { useAppSelector } from '@/store';

export default function About() {
  const aboutPagesData = useAppSelector((s) => s.pages.about || {});
  const heroData = aboutPagesData.hero || { visible: true };
  const missionData = aboutPagesData.mission || { visible: true };
  const workTypesData = aboutPagesData.workTypes || { visible: true };
  const valuesData = aboutPagesData.values || { visible: true };
  const homeCtaData = useAppSelector((s) => s.pages.home?.cta || { visible: true });

  return (
    <div className="animate-fade-in">

      {/* Hero */}
      {heroData.visible !== false && (
      <section style={{ textAlign: 'center', padding: '6rem 1.25rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="section-eyebrow" style={{ textAlign: 'center' }}>{heroData.eyebrow || 'About Us'}</div>
        <h1 className="font-serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
          {heroData.title || 'Empowering Cinema Professionals'}
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-muted-foreground)', lineHeight: 1.6, marginBottom: '2.5rem', whiteSpace: 'pre-wrap' }}>
          {heroData.subtitle || "The Rajasthani Cinema Association is the premier community and professional network for talent and creators."}
        </p>
        <Link to="/register" className="btn-primary">{heroData.primaryCtaText || 'Join the Association'}</Link>
      </section>
      )}

      {/* Mission */}
      {missionData.visible !== false && (
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.25rem 6rem', textAlign: 'center' }}>
        <h2 className="font-serif" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>{missionData.title || 'Our Mission'}</h2>
        <p style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'var(--color-foreground)', fontStyle: 'italic', fontWeight: 500, whiteSpace: 'pre-wrap' }}>
          &quot;{missionData.body || "To foster, protect, and elevate the standard of cinema production by connecting exceptional talent with visionary creators."}&quot;
        </p>
      </section>
      )}

      {/* Values Grid */}
      {valuesData.visible !== false && (
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem 6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-eyebrow" style={{ textAlign: 'center' }}>{valuesData.eyebrow || 'Why Join'}</div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800 }}>{valuesData.title || 'The Rajasthani Cinema Association Advantage'}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="animate-slide-up stagger-1">
            <ValueProp
              icon={<Users size={20} />}
              title={valuesData.val1Title || "Verified Community"}
              desc={valuesData.val1Desc || "Every profile on the platform is verified by our team. Studios trust Rajasthani Cinema Association talent because they know they are hiring real professionals."}
            />
          </div>
          <div className="animate-slide-up stagger-2">
            <ValueProp
              icon={<Shield size={20} />}
              title={valuesData.val2Title || "Admin-Mediated Introductions"}
              desc={valuesData.val2Desc || "Rajasthani Cinema Association's team personally reviews every inquiry from industry. Your contact details are never publicly exposed — shared only at your discretion."}
            />
          </div>
          <div className="animate-slide-up stagger-3">
            <ValueProp
              icon={<Clapperboard size={20} />}
              title={valuesData.val3Title || "Real Casting Opportunities"}
              desc={valuesData.val3Desc || "Browse open roles for productions posted directly through Rajasthani Cinema Association. Apply with your portfolio auto-attached."}
            />
          </div>
          <div className="animate-slide-up stagger-4">
            <ValueProp
              icon={<Sparkles size={20} />}
              title={valuesData.val4Title || "Curated Visibility"}
              desc={valuesData.val4Desc || "Rajasthani Cinema Association's editorial team hand-picks which profiles appear publicly. Quality over quantity — industry knows every featured profile is vetted."}
            />
          </div>
          </div>
        </section>
      )}

      {/* Work type cards */}
      {workTypesData.visible !== false && (
        <section style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '5rem 1.25rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div className="section-eyebrow" style={{ textAlign: 'center' }}>{workTypesData.eyebrow || 'Formats we cover'}</div>
              <h2 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800 }}>{workTypesData.title || 'Explore by Format'}</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {WORK_TYPES.map((w, i) => (
                <Link
                  key={w.slug}
                  to={`/works/${w.slug}`}
                  className={`rca-card animate-slide-up stagger-${i + 1}`}
                  style={{ display: 'block', textDecoration: 'none', overflow: 'hidden' }}
                >
                  <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                    <img
                      src={w.img}
                      alt={w.label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)'}
                      onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,25,23,0.7), transparent)' }} />
                    <div style={{ position: 'absolute', bottom: '12px', left: '14px', color: '#fff' }}>
                      {WORK_ICONS[w.slug]}
                    </div>
                  </div>
                  <div style={{ padding: '1.1rem' }}>
                    <h3 className="font-serif" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {w.label} <ArrowRight size={14} style={{ color: 'var(--color-primary)' }} />
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginTop: '0.3rem' }}>
                      Explore casting and credits in {w.label.toLowerCase()}.
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Committee Members */}
      {aboutPagesData.team?.visible !== false && (aboutPagesData.team?.members?.length || 0) > 0 && (
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 1.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-eyebrow" style={{ textAlign: 'center' }}>{aboutPagesData.team?.eyebrow || 'Our Committee'}</div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800 }}>{aboutPagesData.team?.title || 'Meet the Members'}</h2>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 gap-6 hide-scrollbar" style={{ margin: '0 -1.25rem', padding: '0 1.25rem' }}>
            {aboutPagesData.team?.members?.map((member: any, i: number) => (
              <div key={i} className={`snap-center flex-shrink-0 animate-slide-up stagger-${(i % 5) + 1} group`} style={{ width: '300px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--color-muted)' }}>
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted-foreground)' }}>
                      <Users size={32} />
                    </div>
                  )}
                </div>
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '0.25rem' }}>{member.name}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {member.role && <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', background: 'var(--color-primary-subtle)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{member.role}</span>}
                    {member.dob && <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-muted-foreground)', border: '1px solid var(--color-border)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>DOB: {member.dob}</span>}
                  </div>
                  
                  {member.details && (
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)', lineHeight: 1.5, marginBottom: '1.5rem', flex: 1 }}>
                      {member.details}
                    </div>
                  )}
                  
                  <button className="btn-primary w-full mt-auto" style={{ padding: '0.6rem', borderRadius: '6px' }}>View Profile</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {homeCtaData.visible !== false && (
      <section style={{ padding: '5rem 1.25rem', textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
        <h2 className="font-serif" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '1rem' }}>
          {homeCtaData.title || 'Ready to Join Rajasthani Cinema Association?'}
        </h2>
        <p style={{ color: 'var(--color-muted-foreground)', marginBottom: '2rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {homeCtaData.subtitle || "Whether you're a veteran director or an emerging actor, Rajasthani Cinema Association is your professional home. Build your ID, showcase your credits, and get discovered by India's top productions."}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to={homeCtaData.ctaLink || "/register"} className="btn-primary">{homeCtaData.ctaText || 'Create Your Rajasthani Cinema Association ID'}</Link>
          <Link to="/contact" className="btn-outline">{homeCtaData.secondaryCtaText || 'Get in Touch'}</Link>
        </div>
      </section>
      )}
    </div>
  );
}
