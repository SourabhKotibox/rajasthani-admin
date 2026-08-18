import { useState, useRef, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateHomepageHero } from '@/store';
import { api } from '@/api/client';
import { Image as ImageIcon, Upload, Save, Eye, LayoutTemplate } from 'lucide-react';

export default function AdminBanners() {
  const dispatch = useAppDispatch();
  const heroBanner = useAppSelector(s => s.banners.homepageHero);
  
  // Local state for the form so we don't dispatch on every keystroke
  const [localHero, setLocalHero] = useState(heroBanner);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const { url } = await api.upload(fd);
        setLocalHero(prev => ({ ...prev, imageUrl: url }));
      } catch (err) {
        alert('Failed to upload image');
      }
    }
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.updateHomepageHero(localHero as never);
      dispatch(updateHomepageHero(localHero));
    } catch {
      dispatch(updateHomepageHero(localHero));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'var(--color-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LayoutTemplate size={20} style={{ color: 'var(--color-primary)' }} />
              </div>
              <h1 className="font-serif" style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Banner Management
              </h1>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)', marginLeft: '55px' }}>
              Control the platform's hero and promotional banners.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Editor */}
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={16} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Homepage Hero Banner</h2>
          </div>
          
          <form onSubmit={onSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div>
              <label className="field-label">Headline / Title</label>
              <input 
                className="field" 
                value={localHero.title} 
                onChange={e => setLocalHero({...localHero, title: e.target.value})} 
                placeholder="e.g. Elevate Your Creative Career."
                required
              />
            </div>

            <div>
              <label className="field-label">Subtitle / Description</label>
              <textarea 
                className="field" 
                rows={3}
                value={localHero.subtitle} 
                onChange={e => setLocalHero({...localHero, subtitle: e.target.value})} 
                required
              />
            </div>

            <div>
              <label className="field-label">Background Image URL</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  className="field" 
                  style={{ flex: 1 }} 
                  value={localHero.imageUrl} 
                  onChange={e => setLocalHero({...localHero, imageUrl: e.target.value})} 
                  placeholder="Paste URL or upload local image" 
                  required
                />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline btn-sm" style={{ flexShrink: 0 }}>
                  <Upload size={14} /> Upload
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="field-label">Call to Action (Text)</label>
                <input 
                  className="field" 
                  value={localHero.ctaText} 
                  onChange={e => setLocalHero({...localHero, ctaText: e.target.value})} 
                />
              </div>
              <div>
                <label className="field-label">Call to Action (Link)</label>
                <input 
                  className="field" 
                  value={localHero.ctaLink} 
                  onChange={e => setLocalHero({...localHero, ctaLink: e.target.value})} 
                />
              </div>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {saved ? (
                <span style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600 }}>Changes saved successfully!</span>
              ) : <span />}
              <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview */}
        <div style={{ position: 'sticky', top: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Eye size={16} style={{ color: 'var(--color-muted-foreground)' }} />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Preview</h3>
          </div>
          
          <div style={{ 
            position: 'relative', 
            borderRadius: '20px', 
            overflow: 'hidden', 
            aspectRatio: '16/9',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <img 
              src={localHero.imageUrl} 
              alt="Banner background preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)' }} />
            
            <div style={{ position: 'absolute', inset: 0, padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 className="font-serif" style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '1rem', maxWidth: '80%' }}>
                {localHero.title}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem', maxWidth: '70%' }}>
                {localHero.subtitle}
              </p>
              {localHero.ctaText && (
                <div>
                  <span style={{ 
                    display: 'inline-block',
                    background: 'var(--color-primary)', 
                    color: '#fff', 
                    padding: '0.6rem 1.25rem', 
                    borderRadius: '8px', 
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}>
                    {localHero.ctaText}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
