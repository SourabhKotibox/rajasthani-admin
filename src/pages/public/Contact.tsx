import { FormEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addInquiry } from '@/store';
import { api } from '@/api/client';
import { Mail, Phone, MapPin, Send, CheckCircle, Building2 } from 'lucide-react';

export default function Contact() {
  const dispatch = useAppDispatch();
  const contactPagesData = useAppSelector((s) => s.pages.contact || {});
  const heroData = contactPagesData.hero || { visible: true };
  const infoData = contactPagesData.info || { visible: true };
  const formData = contactPagesData.form || { visible: true };
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get('name')),
      email: String(fd.get('email')),
      company: String(fd.get('company') || ''),
      subject: String(fd.get('subject')),
      message: String(fd.get('message')),
    };
    try {
      const created = await api.createInquiry(body as never);
      dispatch(addInquiry(created as never));
    } catch {
      dispatch(addInquiry(body));
    }
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <div className="animate-fade-in">

      {/* Page header */}
      {heroData.visible !== false && (
        <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '3.5rem 1.25rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div className="section-eyebrow">{heroData.eyebrow || 'Get in touch'}</div>
            <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
              {heroData.title || 'Contact Rajasthan Cine Association'}
            </h1>
            <p style={{ color: 'var(--color-muted-foreground)', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
              {heroData.subtitle || 'General inquiries for press, partners, and industry professionals.'}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'start' }}>

        {/* Info panel */}
        <div className="animate-slide-left">
          {/* Note: In a fully dynamic setup, we might remove these redundant texts if they are covered by the hero. 
              But for structural parity, we'll hide them if not explicitly provided, or you can map them to new CMS fields. */}
          
          {infoData.visible !== false && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
              <div style={{ width: '36px', height: '36px', background: 'var(--color-primary-subtle)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                <Mail size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted-foreground)', marginBottom: '0.2rem' }}>{infoData.emailLabel || 'Email'}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-foreground)' }}>{infoData.email || 'info@rajasthaniacinema.org'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
              <div style={{ width: '36px', height: '36px', background: 'var(--color-primary-subtle)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                <MapPin size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted-foreground)', marginBottom: '0.2rem' }}>{infoData.locationLabel || 'Location'}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-foreground)' }}>{infoData.address || 'Jaipur, Rajasthan · India'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
              <div style={{ width: '36px', height: '36px', background: 'var(--color-primary-subtle)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                <Building2 size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-muted-foreground)', marginBottom: '0.2rem' }}>{infoData.phoneLabel || 'Phone'}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-foreground)', fontWeight: 500 }}>{infoData.phone || '+256 700 000 000'}</div>
              </div>
            </div>
          </div>
          )}



          {/* Note */}
          {infoData.noteText && (
          <div style={{ marginTop: '2rem', padding: '1rem 1.2rem', background: 'var(--color-primary-subtle)', border: '1px solid var(--color-primary-tint)', borderRadius: '10px' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-primary)', lineHeight: 1.6 }}>
              {infoData.noteText}
            </p>
          </div>
          )}
        </div>

        {/* Form */}
        <div className="animate-slide-up stagger-2">
          {sent ? (
            <div style={{ background: 'var(--color-success-bg)', border: '1.5px solid #6fcf97', borderRadius: '14px', padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <CheckCircle size={40} style={{ color: 'var(--color-success)' }} />
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-success)', marginBottom: '0.5rem' }}>Message Received!</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-success)' }}>
                  Thanks for reaching out. Rajasthan Cine Association's team will review your message and get back to you.
                </p>
              </div>
              <button className="btn-outline btn-sm" onClick={() => setSent(false)}>Send another message</button>
            </div>
          ) : formData.visible !== false ? (
            <form onSubmit={onSubmit} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <div>
                <label className="field-label">{formData.nameField || 'Your Name'}</label>
                <input name="name" required placeholder={formData.nameField || 'Your Name'} className="field" />
              </div>
              <div>
                <label className="field-label">{formData.emailField || 'Email Address'}</label>
                <input name="email" type="email" required placeholder={formData.emailField || 'Email Address'} className="field" />
              </div>
              <div>
                <label className="field-label">{formData.companyField || 'Company / Organization (optional)'}</label>
                <input name="company" placeholder={formData.companyField || 'Company'} className="field" />
              </div>
              <div>
                <label className="field-label">{formData.subjectField || 'Subject'}</label>
                <input name="subject" required placeholder={formData.subjectField || 'Subject'} className="field" />
              </div>
              <div>
                <label className="field-label">{formData.messageField || 'Message'}</label>
                <textarea name="message" required rows={5} placeholder={formData.messageField || 'Message'} className="field" />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}>
                <Send size={15} /> {formData.submitButton || 'Send Message'}
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', textAlign: 'center' }}>
                {formData.disclaimerText || 'We typically respond within 1-2 business days.'}
              </p>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
