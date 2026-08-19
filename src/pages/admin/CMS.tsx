import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector, updateCmsSection, toggleCmsSection, type CmsPages } from '@/store';
import { api } from '@/api/client';
import {
  Eye, EyeOff, Save, ChevronDown, ChevronUp, LayoutTemplate,
  Home, Info, Mail, Image as ImageIcon, Type, BarChart3,
   Users, Clapperboard, Film, Zap, Upload, CheckCircle2, LayoutPanelLeft, Trash2
} from 'lucide-react';

type PageKey = keyof CmsPages;
type SectionDef = {
  key: string;
  label: string;
  icon: React.ReactNode;
  fields: FieldDef[];
};
type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'toggle';
  placeholder?: string;
};

const PAGE_SECTIONS: Record<string, SectionDef[]> = {
  home: [
    {
      key: 'seo',
      label: 'Homepage SEO',
      icon: <LayoutTemplate size={16} />,
      fields: [
        { key: 'title', label: 'Page Title', type: 'text', placeholder: 'Rajasthan Cine Association — India\'s Premier Cinema Association' },
        { key: 'description', label: 'Meta Description', type: 'textarea', placeholder: 'Discover and connect with top film, TV, and commercial talent across Rajasthan and India.' },
        { key: 'keywords', label: 'Meta Keywords', type: 'text', placeholder: 'talent, casting, actors, models, Rajasthan, India, film, television' },
        { key: 'ogImage', label: 'Social Share Image URL', type: 'image', placeholder: 'https://...' },
        { key: 'canonicalUrl', label: 'Canonical URL', type: 'text', placeholder: 'https://rajasthaniacinema.org' },
      ],
    },
    {
      key: 'hero',
      label: 'Hero Banner',
      icon: <ImageIcon size={16} />,
      fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text' },
        { key: 'title', label: 'Headline', type: 'text', placeholder: 'Discover Exceptional Talent' },
        { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'The premier casting network...' },
        { key: 'imageUrl', label: 'Background Image URL', type: 'image', placeholder: 'https://...' },
        { key: 'ctaText', label: 'Primary Button Text', type: 'text', placeholder: 'Browse Talent' },
        { key: 'ctaLink', label: 'Primary Button Link', type: 'text', placeholder: '/talent' },
        { key: 'secondaryCtaText', label: 'Secondary Button Text', type: 'text' },
        { key: 'secondaryCtaLink', label: 'Secondary Button Link', type: 'text', placeholder: '/talent' },
      ],
    },
    {
      key: 'stats',
      label: 'Stats Bar',
      icon: <BarChart3 size={16} />,
      fields: [
        { key: 'stat1Value', label: 'Stat 1 Value', type: 'text', placeholder: '500+' },
        { key: 'stat1Label', label: 'Stat 1 Label', type: 'text', placeholder: 'Verified Talents' },
        { key: 'stat2Value', label: 'Stat 2 Value', type: 'text', placeholder: '120+' },
        { key: 'stat2Label', label: 'Stat 2 Label', type: 'text', placeholder: 'Active Casting Calls' },
        { key: 'stat3Value', label: 'Stat 3 Value', type: 'text', placeholder: '50+' },
        { key: 'stat3Label', label: 'Stat 3 Label', type: 'text', placeholder: 'Productions Served' },
        { key: 'stat4Value', label: 'Stat 4 Value', type: 'text' },
        { key: 'stat4Label', label: 'Stat 4 Label', type: 'text' },
      ],
    },
    {
      key: 'featured',
      label: 'Featured Talent Section',
      icon: <Users size={16} />,
      fields: [
        { key: 'eyebrow', label: 'Eyebrow Label', type: 'text', placeholder: 'Rajasthan Cine Association Verified' },
        { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Featured Talent' },
        { key: 'viewAllText', label: 'View All Text', type: 'text' },
      ],
    },
    {
      key: 'howItWorks',
      label: 'How It Works Section',
      icon: <Info size={16} />,
      fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text' },
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'step1Title', label: 'Step 1 Title', type: 'text', placeholder: 'Register & Build Your ID' },
        { key: 'step1Desc', label: 'Step 1 Description', type: 'textarea', placeholder: 'Sign up as a talent professional...' },
        { key: 'step2Title', label: 'Step 2 Title', type: 'text', placeholder: 'Subscribe to Go Live' },
        { key: 'step2Desc', label: 'Step 2 Description', type: 'textarea', placeholder: 'Choose a plan...' },
        { key: 'step3Title', label: 'Step 3 Title', type: 'text', placeholder: 'Get Discovered' },
        { key: 'step3Desc', label: 'Step 3 Description', type: 'textarea', placeholder: 'Industry professionals browse...' },
        { key: 'step4Title', label: 'Step 4 Title', type: 'text', placeholder: 'Apply to Casting' },
        { key: 'step4Desc', label: 'Step 4 Description', type: 'textarea', placeholder: 'Browse open casting calls...' },
        { key: 'trustPoint1', label: 'Trust Point 1', type: 'text' },
        { key: 'trustPoint2', label: 'Trust Point 2', type: 'text' },
        { key: 'trustPoint3', label: 'Trust Point 3', type: 'text' },
        { key: 'trustPoint4', label: 'Trust Point 4', type: 'text' },
      ],
    },
    {
      key: 'casting',
      label: 'Open Casting Section',
      icon: <Clapperboard size={16} />,
      fields: [
        { key: 'eyebrow', label: 'Eyebrow Label', type: 'text', placeholder: 'Now Casting' },
        { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Open Casting Calls' },
      ],
    },
    {
      key: 'events',
      label: 'Events Slider Section',
      icon: <LayoutPanelLeft size={16} />,
      fields: [
        { key: 'eyebrow', label: 'Eyebrow Label', type: 'text', placeholder: 'Coming Up' },
        { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Events & Shows' },
        { key: 'subtitle', label: 'Section Subtitle', type: 'textarea', placeholder: 'Discover upcoming shows, fashion weeks, and talent events.' },
        { key: 'viewAllText', label: 'View All Link Text', type: 'text', placeholder: 'View all events' },
        { key: 'viewAllLink', label: 'View All Link URL', type: 'text', placeholder: '/event/all' },
      ],
    },
    {
      key: 'works',
      label: 'Portfolio Credits Section',
      icon: <Film size={16} />,
      fields: [
        { key: 'visible', label: 'Show Entire Section', type: 'toggle' },
        { key: 'eyebrow', label: 'Eyebrow Label', type: 'text', placeholder: 'Portfolio Credits' },
        { key: 'moviesVisible', label: 'Show Movies', type: 'toggle' },
        { key: 'tvVisible', label: 'Show TV Series', type: 'toggle' },
        { key: 'musicVisible', label: 'Show Music Videos', type: 'toggle' },
        { key: 'dramaVisible', label: 'Show Short Dramas', type: 'toggle' },
      ],
    },
    {
      key: 'cta',
      label: 'Call to Action Banner',
      icon: <Zap size={16} />,
      fields: [
        { key: 'title', label: 'Headline', type: 'text', placeholder: 'Ready to get discovered?' },
        { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Join thousands of...' },
        { key: 'ctaText', label: 'Primary Button Text', type: 'text', placeholder: 'Join as Talent' },
        { key: 'ctaLink', label: 'Primary Button Link', type: 'text', placeholder: '/register' },
        { key: 'secondaryCtaText', label: 'Secondary Button Text', type: 'text' },
      ],
    },
    {
      key: 'testimonials',
      label: 'Testimonials Section',
      icon: <Users size={16} />,
      fields: [
        { key: 'visible', label: 'Show Testimonials', type: 'toggle' },
        { key: 'eyebrow', label: 'Eyebrow Label', type: 'text', placeholder: 'Testimonials' },
        { key: 'title', label: 'Section Title', type: 'text', placeholder: 'What our talent says' },
      ],
    },
  ],
  about: [
    {
      key: 'hero',
      label: 'About Hero',
      icon: <ImageIcon size={16} />,
      fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text' },
        { key: 'title', label: 'Headline', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
        { key: 'primaryCtaText', label: 'Primary Button Text', type: 'text' },
        { key: 'secondaryCtaText', label: 'Secondary Button Text', type: 'text' },
      ],
    },
    {
      key: 'mission',
      label: 'Mission Statement',
      icon: <Type size={16} />,
      fields: [
        { key: 'title', label: 'Mission Title', type: 'text' },
        { key: 'body', label: 'Mission Body', type: 'textarea' },
      ],
    },
    {
      key: 'values',
      label: 'Value Propositions',
      icon: <CheckCircle2 size={16} />,
      fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text' },
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'val1Title', label: 'Value 1 Title', type: 'text' },
        { key: 'val1Desc', label: 'Value 1 Description', type: 'textarea' },
        { key: 'val2Title', label: 'Value 2 Title', type: 'text' },
        { key: 'val2Desc', label: 'Value 2 Description', type: 'textarea' },
        { key: 'val3Title', label: 'Value 3 Title', type: 'text' },
        { key: 'val3Desc', label: 'Value 3 Description', type: 'textarea' },
        { key: 'val4Title', label: 'Value 4 Title', type: 'text' },
        { key: 'val4Desc', label: 'Value 4 Description', type: 'textarea' },
      ],
    },
    {
      key: 'team',
      label: 'Committee Members',
      icon: <Users size={16} />,
      fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text' },
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'members', label: 'Members List', type: 'team_array' as any },
      ],
    },
    {
      key: 'workTypes',
      label: 'Work Types Section',
      icon: <Film size={16} />,
      fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text' },
        { key: 'title', label: 'Section Title', type: 'text' },
      ],
    },
  ],
  contact: [
    {
      key: 'hero',
      label: 'Contact Hero',
      icon: <Mail size={16} />,
      fields: [
        { key: 'eyebrow', label: 'Eyebrow Text', type: 'text' },
        { key: 'title', label: 'Headline', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      ],
    },
    {
      key: 'info',
      label: 'Contact Information',
      icon: <Info size={16} />,
      fields: [
        { key: 'emailLabel', label: 'Email Label', type: 'text' },
        { key: 'email', label: 'Email Address', type: 'text' },
        { key: 'locationLabel', label: 'Location Label', type: 'text' },
        { key: 'address', label: 'Physical Address', type: 'textarea' },
        { key: 'phoneLabel', label: 'Phone Label', type: 'text' },
        { key: 'phone', label: 'Phone Number', type: 'text' },
        { key: 'noteText', label: 'Information Note', type: 'textarea' },
      ],
    },
    {
      key: 'form',
      label: 'Contact Form Labels',
      icon: <Type size={16} />,
      fields: [
        { key: 'nameField', label: 'Name Field Label', type: 'text' },
        { key: 'emailField', label: 'Email Field Label', type: 'text' },
        { key: 'companyField', label: 'Company Field Label', type: 'text' },
        { key: 'subjectField', label: 'Subject Field Label', type: 'text' },
        { key: 'messageField', label: 'Message Field Label', type: 'text' },
        { key: 'submitButton', label: 'Submit Button Label', type: 'text' },
        { key: 'disclaimerText', label: 'Disclaimer Text', type: 'text' },
      ],
    },
  ],
  navbar: [
    {
      key: 'links',
      label: 'Navigation Links',
      icon: <Type size={16} />,
      fields: [
        { key: 'homeLabel', label: 'Home Link Label', type: 'text' },
        { key: 'talentLabel', label: 'Talent Link Label', type: 'text', placeholder: 'Talent/Members' },
        { key: 'worksLabel', label: 'Works Link Label', type: 'text' },
        { key: 'castingLabel', label: 'Casting Link Label', type: 'text' },
        { key: 'aboutLabel', label: 'About Link Label', type: 'text' },
        { key: 'contactLabel', label: 'Contact Link Label', type: 'text' },
      ],
    },
    {
      key: 'auth',
      label: 'Authentication Buttons',
      icon: <Users size={16} />,
      fields: [
        { key: 'loginLabel', label: 'Login Button Label', type: 'text' },
        { key: 'joinLabel', label: 'Join Button Label', type: 'text' },
      ],
    },
  ],
  footer: [
    {
      key: 'ticker',
      label: 'Marquee Ticker',
      icon: <Film size={16} />,
      fields: [
        { key: 'text', label: 'Ticker Text (Comma separated)', type: 'textarea', placeholder: 'Movies, TV Series, Music Videos...' },
      ],
    },
    {
      key: 'brand',
      label: 'Brand Description',
      icon: <Info size={16} />,
      fields: [
        { key: 'subtitle', label: 'Footer Subtitle', type: 'textarea' },
      ],
    },
    {
      key: 'columns',
      label: 'Footer Columns',
      icon: <LayoutTemplate size={16} />,
      fields: [
        { key: 'col1Title', label: 'Column 1 Title', type: 'text' },
        { key: 'col2Title', label: 'Column 2 Title', type: 'text' },
        { key: 'col3Title', label: 'Column 3 Title', type: 'text' },
      ],
    },
  ],
};

const PAGE_TABS = [
  { key: 'home', label: 'Home', icon: <Home size={16} /> },
  { key: 'about', label: 'About', icon: <Info size={16} /> },
  { key: 'contact', label: 'Contact', icon: <Mail size={16} /> },
] as const;

// ---- SectionCard ----
function SectionCard({
  pageName,
  section,
  sectionData,
}: {
  pageName: PageKey;
  section: SectionDef;
  sectionData: Record<string, unknown>;
}) {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);
  const [localData, setLocalData] = useState<Record<string, unknown>>(sectionData || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toggling, setToggling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVisible = (localData.visible as boolean) !== false;

  const handleToggle = async () => {
    setToggling(true);
    try {
      const { visible } = await api.togglePageSection(pageName, section.key) as { visible: boolean };
      dispatch(toggleCmsSection({ page: pageName, section: section.key, visible }));
      setLocalData(prev => ({ ...prev, visible }));
    } catch {
      // optimistic fallback
      const newVis = !isVisible;
      dispatch(toggleCmsSection({ page: pageName, section: section.key, visible: newVis }));
      setLocalData(prev => ({ ...prev, visible: newVis }));
    }
    setToggling(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updatePageSection(pageName, section.key, localData as Record<string, unknown>);
      dispatch(updateCmsSection({ page: pageName, section: section.key, data: updated as Record<string, unknown> }));
    } catch {
      dispatch(updateCmsSection({ page: pageName, section: section.key, data: localData as Record<string, unknown> }));
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleImageUpload = async (fieldKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { url } = await api.upload(fd);
      setLocalData(prev => ({ ...prev, [fieldKey]: url }));
    } catch {
      alert('Image upload failed');
    }
  };

  const cardBg = isVisible ? 'var(--color-card)' : 'var(--color-surface)';
  const borderColor = isVisible ? 'var(--color-border)' : 'var(--color-border)';

  return (
    <div style={{
      background: cardBg,
      border: `1px solid ${borderColor}`,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      transition: 'all 0.2s',
      opacity: isVisible ? 1 : 0.7,
    }}>
      {/* Card header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '1rem 1.25rem',
        background: 'var(--color-surface)',
        borderBottom: expanded ? '1px solid var(--color-border)' : 'none',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px',
          background: isVisible ? 'var(--color-primary-subtle)' : 'var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isVisible ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
          flexShrink: 0,
        }}>
          {section.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-foreground)' }}>
            {section.label}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-muted-foreground)', marginTop: '1px' }}>
            {isVisible ? '● Visible on page' : '○ Hidden from page'}
          </div>
        </div>

        {/* Visibility toggle */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          title={isVisible ? 'Hide section' : 'Show section'}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.4rem 0.75rem', borderRadius: '8px',
            fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
            border: '1px solid var(--color-border)',
            background: isVisible ? '#EEF5E8' : '#FAEAEA',
            color: isVisible ? '#2D5016' : '#8B1A1A',
            transition: 'all 0.15s',
          }}
        >
          {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
          {isVisible ? 'Visible' : 'Hidden'}
        </button>

        {/* Expand toggle */}
        {section.fields.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.4rem 0.75rem', borderRadius: '8px',
              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
              border: '1px solid var(--color-border)',
              background: expanded ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
              color: expanded ? 'var(--color-primary)' : 'var(--color-foreground)',
              transition: 'all 0.15s',
            }}
          >
            Edit
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        )}
      </div>

      {/* Editor panel */}
      {expanded && section.fields.length > 0 && (
        <div style={{ padding: '1.25rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>

          {/* Form */}
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {section.fields.map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '0.35rem' }}>
                  {field.label}
                </label>
                {field.type === 'image' ? (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      className="field"
                      style={{ fontSize: '0.82rem' }}
                      value={(localData[field.key] as string) || ''}
                      onChange={e => setLocalData(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => handleImageUpload(field.key, e)}
                    />
                    <button
                      type="button"
                      onClick={() => { if (fileInputRef.current) fileInputRef.current.value = ''; fileInputRef.current?.click(); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.5rem 0.75rem', borderRadius: '8px',
                        border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                        fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                        color: 'var(--color-foreground)',
                      }}
                    >
                      <Upload size={13} /> Upload
                    </button>
                  </div>
                ) : field.type === 'textarea' ? (
                  <textarea
                    className="field"
                    rows={3}
                    style={{ fontSize: '0.82rem', resize: 'vertical' }}
                    value={(localData[field.key] as string) || ''}
                    onChange={e => setLocalData(p => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                  />
                ) : field.type === 'toggle' ? (
                  <button
                    type="button"
                    onClick={() => setLocalData(p => ({ ...p, [field.key]: (localData[field.key] as string) === 'false' ? 'true' : 'false' }))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.5rem 0.9rem', borderRadius: '8px',
                      fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                      border: '1px solid var(--color-border)',
                      background: (localData[field.key] as string) === 'false' ? '#FAEAEA' : '#EEF5E8',
                      color: (localData[field.key] as string) === 'false' ? '#8B1A1A' : '#2D5016',
                      transition: 'all 0.15s',
                    }}
                  >
                    {(localData[field.key] as string) === 'false' ? <EyeOff size={14} /> : <Eye size={14} />}
                    {(localData[field.key] as string) === 'false' ? 'Hidden' : 'Visible'}
                  </button>
                ) : (field.type as any) === 'team_array' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button type="button" className="btn-outline btn-sm" style={{ width: 'fit-content' }} onClick={() => {
                      const members = (localData[field.key] as any[]) || [];
                      setLocalData(p => ({ ...p, [field.key]: [...members, { name: '', role: '', dob: '', photoUrl: '', details: '', order: members.length }] }));
                    }}>+ Add Member</button>
                    {((localData[field.key] as any[]) || []).map((m, idx) => (
                      <div key={idx} style={{
                        border: '1px solid var(--color-border)', borderRadius: '12px',
                        background: 'var(--color-surface)', overflow: 'hidden',
                      }}>
                        {/* Member card header */}
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)',
                          background: 'var(--color-card)',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            {m.photoUrl ? (
                              <img src={m.photoUrl} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }} />
                            ) : (
                              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                                <Users size={14} />
                              </div>
                            )}
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-foreground)' }}>
                              {m.name || `Member ${idx + 1}`}
                            </span>
                            {m.role && <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-primary)', background: 'var(--color-primary-subtle)', padding: '1px 8px', borderRadius: '4px' }}>{m.role}</span>}
                          </div>
                          <button type="button" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 28, height: 28, borderRadius: '6px', border: '1px solid #fecaca',
                            background: '#fff5f5', color: '#dc2626', cursor: 'pointer',
                          }} onClick={() => {
                            const members = [...(localData[field.key] as any[])]; members.splice(idx, 1); setLocalData(p => ({ ...p, [field.key]: members }));
                          }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                        {/* Member fields — 2 column grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Name</label>
                            <input className="field" style={{ width: '100%', fontSize: '0.82rem' }} placeholder="Full name" value={m.name || ''} onChange={(e) => {
                              const members = [...(localData[field.key] as any[])]; members[idx].name = e.target.value; setLocalData(p => ({ ...p, [field.key]: members }));
                            }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Designation</label>
                            <input className="field" style={{ width: '100%', fontSize: '0.82rem' }} placeholder="e.g. President" value={m.role || ''} onChange={(e) => {
                              const members = [...(localData[field.key] as any[])]; members[idx].role = e.target.value; setLocalData(p => ({ ...p, [field.key]: members }));
                            }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Date of Birth</label>
                            <input type="date" className="field" style={{ width: '100%', fontSize: '0.82rem' }} value={m.dob || ''} onChange={(e) => {
                              const members = [...(localData[field.key] as any[])]; members[idx].dob = e.target.value; setLocalData(p => ({ ...p, [field.key]: members }));
                            }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.3rem' }}>Photo</label>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              <input className="field" style={{ flex: 1, fontSize: '0.82rem' }} placeholder="Photo URL" value={m.photoUrl || ''} onChange={(e) => {
                                const members = [...(localData[field.key] as any[])]; members[idx].photoUrl = e.target.value; setLocalData(p => ({ ...p, [field.key]: members }));
                              }} />
                              <label style={{
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.45rem 0.65rem', borderRadius: '6px',
                                border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                                fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const,
                                color: 'var(--color-foreground)',
                              }}>
                                <Upload size={11} /> Upload
                                <input type="file" hidden accept="image/*" onClick={(e) => { (e.target as HTMLInputElement).value = ''; }} onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const fd = new FormData(); fd.append('file', file);
                                  try {
                                    const { url } = await api.upload(fd);
                                    const members = [...(localData[field.key] as any[])]; members[idx].photoUrl = url; setLocalData(p => ({ ...p, [field.key]: members }));
                                  } catch { alert('Upload failed'); }
                                }} />
                              </label>
                            </div>
                          </div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.3rem' }}>About / Details</label>
                            <textarea className="field" style={{ width: '100%', fontSize: '0.82rem', resize: 'vertical' }} rows={2} placeholder="Brief bio or description" value={m.details || ''} onChange={(e) => {
                              const members = [...(localData[field.key] as any[])]; members[idx].details = e.target.value; setLocalData(p => ({ ...p, [field.key]: members }));
                            }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    className="field"
                    style={{ fontSize: '0.82rem' }}
                    value={(localData[field.key] as string) || ''}
                    onChange={e => setLocalData(p => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', paddingTop: '0.5rem' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
              >
                <Save size={14} />
                {saving ? 'Saving...' : 'Save Section'}
              </button>
              {saved && (
                <span style={{ fontSize: '0.8rem', color: '#2D5016', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Saved!
                </span>
              )}
            </div>
          </div>

          {/* Preview */}
          {Boolean(localData.imageUrl || localData.title || localData.subtitle) && (
            <div style={{
              width: '240px', flexShrink: 0, border: '1px solid var(--color-border)',
              borderRadius: '12px', overflow: 'hidden', height: 'fit-content'
            }}>
              <div style={{ padding: '0.5rem 0.75rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Preview
              </div>
              {Boolean(localData.imageUrl) && (
                <img
                  src={localData.imageUrl as string}
                  alt="Preview"
                  style={{ width: '100%', height: '110px', objectFit: 'cover' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <div style={{ padding: '0.75rem' }}>
                {Boolean(localData.title) && (
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-foreground)', lineHeight: 1.3, marginBottom: '0.35rem' }}>
                    {localData.title as string}
                  </div>
                )}
                {Boolean(localData.subtitle) && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-muted-foreground)', lineHeight: 1.5 }}>
                    {(localData.subtitle as string).substring(0, 80)}{(localData.subtitle as string).length > 80 ? '...' : ''}
                  </div>
                )}
                {Boolean(localData.ctaText) && (
                  <div style={{
                    marginTop: '0.5rem', display: 'inline-block',
                    background: 'var(--color-primary)', color: '#fff',
                    padding: '0.25rem 0.6rem', borderRadius: '6px',
                    fontSize: '0.7rem', fontWeight: 700,
                  }}>
                    {localData.ctaText as string}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---- Main CMS Page ----
export default function AdminCMS() {
  const [activePage, setActivePage] = useState<PageKey>('home');
  const pagesData = useAppSelector(s => s.pages);
  const sections = PAGE_SECTIONS[activePage] || [];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'var(--color-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutTemplate size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h1 className="font-serif" style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            CMS / Page Editor
          </h1>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)', marginLeft: '55px' }}>
          Edit page content, show or hide sections, and preview changes live.
        </p>
      </div>

      {/* Page tabs */}
      <div style={{
        display: 'flex', gap: '0.5rem', marginBottom: '1.75rem',
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: '12px', padding: '0.4rem',
        width: 'fit-content',
        flexWrap: 'wrap'
      }}>
        {PAGE_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActivePage(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1.1rem', borderRadius: '9px',
              fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
              border: 'none',
              background: activePage === tab.key ? 'var(--color-primary)' : 'transparent',
              color: activePage === tab.key ? '#fff' : 'var(--color-muted-foreground)',
              transition: 'all 0.15s',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Preview link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <a
          href={activePage === 'home' ? '/' : `/${activePage}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)',
            textDecoration: 'none', border: '1px solid var(--color-primary-tint)',
            background: 'var(--color-primary-subtle)', padding: '0.4rem 1rem',
            borderRadius: '8px',
          }}
        >
          <Eye size={13} /> Open Live Page →
        </a>
      </div>

      {/* Section cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sections.map(section => {
          const pageData = (pagesData[activePage] || {}) as Record<string, Record<string, unknown>>;
          const sectionData = pageData[section.key] || {};
          return (
            <SectionCard
              key={section.key}
              pageName={activePage}
              section={section}
              sectionData={sectionData as Record<string, unknown>}
            />
          );
        })}
      </div>
    </div>
  );
}
