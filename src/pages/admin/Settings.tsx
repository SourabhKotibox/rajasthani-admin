import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateBranding, resetBranding, updateRazorpaySettings, updateSmtpSettings } from '@/store';
import { api } from '@/api/client';
import { Settings, Palette, RotateCcw, CheckCircle, Type, Sliders, CreditCard, Lock, Upload, User, Key, Mail, Send } from 'lucide-react';

const PRESET_COLORS = [
  { label: 'Vibrant Orange', value: '#FA931A' },
  { label: 'Royal Blue',     value: '#1A4A7A' },
  { label: 'Forest Green',   value: '#2D5016' },
  { label: 'Deep Purple',    value: '#5B21B6' },
  { label: 'Crimson',        value: '#8B1A1A' },
  { label: 'Teal',           value: '#0891b2' },
  { label: 'Slate',          value: '#334155' },
];

export default function AdminSettings() {
  const dispatch = useAppDispatch();
  const branding = useAppSelector(s => s.branding);
  const razorpay = useAppSelector(s => s.settings?.razorpay || { enabled: false, keyId: '', keySecret: '' });

  const [activeTab, setActiveTab] = useState<'branding' | 'payments' | 'smtp' | 'admin'>('branding');
  const [saved, setSaved] = useState(false);

  const [localBrand, setLocalBrand] = useState(branding);
  const [localRP, setLocalRP] = useState(razorpay);
  const smtp = useAppSelector(s => s.settings?.smtp || { enabled: false, host: '', port: 587, secure: false, user: '', password: '', fromEmail: '', fromName: '' });
  const [localSmtp, setLocalSmtp] = useState(smtp);
  const [adminCreds, setAdminCreds] = useState({ email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'faviconUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const { url } = await api.upload(fd);
        setLocalBrand(prev => ({ ...prev, [field]: url }));
      } catch (err) {
        alert('Failed to upload image');
      }
    }
  };

  const onSave = async () => {
    try {
      if (activeTab === 'branding') {
        await api.updateBranding(localBrand as never);
        dispatch(updateBranding(localBrand));
        document.documentElement.style.setProperty('--color-primary', localBrand.primaryColor);
        document.documentElement.style.setProperty('--color-primary-tint', localBrand.accentColor);
      } else if (activeTab === 'payments') {
        await api.updateSettings({ razorpay: localRP } as never);
        dispatch(updateRazorpaySettings(localRP));
      } else if (activeTab === 'smtp') {
        await api.updateSmtpSettings(localSmtp as never);
        dispatch(updateSmtpSettings(localSmtp));
      } else if (activeTab === 'admin') {
        if (adminCreds.newPassword !== adminCreds.confirmPassword) {
          alert('New passwords do not match');
          return;
        }
        if (adminCreds.newPassword && adminCreds.newPassword.length < 6) {
          alert('Password must be at least 6 characters');
          return;
        }
        await api.updateAdminCredentials(adminCreds);
        setAdminCreds({ email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      if (activeTab === 'admin') {
        alert(err instanceof Error ? err.message : 'Failed to update admin credentials');
        return;
      }
      if (activeTab === 'smtp') {
        alert(err instanceof Error ? err.message : 'Failed to update SMTP settings');
        return;
      }
      if (activeTab === 'branding') {
        dispatch(updateBranding(localBrand));
        document.documentElement.style.setProperty('--color-primary', localBrand.primaryColor);
      } else if (activeTab === 'payments') {
        dispatch(updateRazorpaySettings(localRP));
      }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    dispatch(resetBranding());
    setLocalBrand({
      platformName: 'Rajasthan Cine Association',
      tagline: 'Cinema Association',
      logoUrl: '',
      faviconUrl: '',
      primaryColor: '#FA931A',
      accentColor: '#FDD9AB',
      logoShape: 'rounded'
    });
    document.documentElement.style.setProperty('--color-primary', '#FA931A');
    document.documentElement.style.setProperty('--color-primary-tint', '#FDD9AB');
  };

  const previewFirstChar = (localBrand.platformName || 'K').charAt(0);
  const shapeRadius = localBrand.logoShape === 'circle' ? '50%' : localBrand.logoShape === 'rounded' ? '10px' : '4px';

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted-foreground)' }}>
              <Settings size={16} />
            </div>
            <h1 className="font-serif" style={{ fontSize: '1.65rem', fontWeight: 800 }}>Platform Settings</h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>
            Customize system configurations and branding.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {activeTab === 'branding' && (
            <button onClick={handleReset} className="btn-outline btn-sm">
              <RotateCcw size={13} /> Reset
            </button>
          )}
          <button onClick={onSave} className="btn-primary btn-sm">
            <CheckCircle size={13} /> Save Changes
          </button>
        </div>
      </div>

      {saved && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '0.75rem 1.25rem', marginBottom: '1.5rem', color: '#166534', fontWeight: 600 }}>
          <CheckCircle size={16} /> Settings saved successfully!
        </div>
      )}

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Settings Form */}
        <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '0.25rem' }}>
            <button
              className={`btn-ghost ${activeTab === 'branding' ? 'active' : ''}`}
              style={{ flex: 1, background: activeTab === 'branding' ? 'var(--color-surface)' : 'transparent', boxShadow: activeTab === 'branding' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
              onClick={() => setActiveTab('branding')}
            >
              <Palette size={16} /> Branding & UI
            </button>
            <button
              className={`btn-ghost ${activeTab === 'payments' ? 'active' : ''}`}
              style={{ flex: 1, background: activeTab === 'payments' ? 'var(--color-surface)' : 'transparent', boxShadow: activeTab === 'payments' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
              onClick={() => setActiveTab('payments')}
            >
              <CreditCard size={16} /> Payment Gateway
            </button>
            <button
              className={`btn-ghost ${activeTab === 'admin' ? 'active' : ''}`}
              style={{ flex: 1, background: activeTab === 'admin' ? 'var(--color-surface)' : 'transparent', boxShadow: activeTab === 'admin' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
              onClick={() => setActiveTab('admin')}
            >
              <User size={16} /> Admin Account
            </button>
            <button
              className={`btn-ghost ${activeTab === 'smtp' ? 'active' : ''}`}
              style={{ flex: 1, background: activeTab === 'smtp' ? 'var(--color-surface)' : 'transparent', boxShadow: activeTab === 'smtp' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
              onClick={() => setActiveTab('smtp')}
            >
              <Mail size={16} /> Mail Server
            </button>
          </div>

          {activeTab === 'branding' && (
            <>
              {/* Logo & Identity */}
              <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 16 }}>
                <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Type size={15} style={{ color: 'var(--color-primary)' }} />
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Logo & Identity</h2>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <label className="field-label">Platform Name</label>
                    <input className="field" value={localBrand.platformName} onChange={e => setLocalBrand({ ...localBrand, platformName: e.target.value })} placeholder="e.g. Rajasthan Cine Association" />
                  </div>
                  <div>
                    <label className="field-label">Tagline</label>
                    <input className="field" value={localBrand.tagline} onChange={e => setLocalBrand({ ...localBrand, tagline: e.target.value })} placeholder="e.g. Cinema Association" />
                  </div>
                  <div>
                    <label className="field-label">Logo Image URL</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input className="field" style={{ flex: 1 }} value={localBrand.logoUrl} onChange={e => setLocalBrand({ ...localBrand, logoUrl: e.target.value })} placeholder="Leave empty for text logo" />
                      <button type="button" onClick={() => logoInputRef.current?.click()} className="btn-outline btn-sm" style={{ flexShrink: 0 }}>
                        <Upload size={14} /> Upload
                      </button>
                      <input type="file" accept="image/*" ref={logoInputRef} onChange={(e) => handleImageUpload(e, 'logoUrl')} style={{ display: 'none' }} />
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Favicon Image URL</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input className="field" style={{ flex: 1 }} value={localBrand.faviconUrl || ''} onChange={e => setLocalBrand({ ...localBrand, faviconUrl: e.target.value })} placeholder="Browser tab icon URL" />
                      <button type="button" onClick={() => faviconInputRef.current?.click()} className="btn-outline btn-sm" style={{ flexShrink: 0 }}>
                        <Upload size={14} /> Upload
                      </button>
                      <input type="file" accept="image/*" ref={faviconInputRef} onChange={(e) => handleImageUpload(e, 'faviconUrl')} style={{ display: 'none' }} />
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Logo Shape</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {(['circle', 'rounded', 'square'] as const).map(shape => (
                        <button
                          key={shape}
                          onClick={() => setLocalBrand({ ...localBrand, logoShape: shape })}
                          style={{
                            flex: 1, padding: '0.65rem 0.5rem', borderRadius: 9,
                            border: `1.5px solid ${localBrand.logoShape === shape ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            background: localBrand.logoShape === shape ? 'var(--color-surface)' : 'transparent',
                            color: localBrand.logoShape === shape ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                          }}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 16 }}>
                <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Palette size={15} style={{ color: 'var(--color-primary)' }} />
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Brand Colors</h2>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <label className="field-label">Primary Color</label>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <input type="color" value={localBrand.primaryColor} onChange={e => setLocalBrand({ ...localBrand, primaryColor: e.target.value })} style={{ width: 48, height: 40, borderRadius: 8, cursor: 'pointer', padding: '2px' }} />
                      <input className="field" value={localBrand.primaryColor} onChange={e => setLocalBrand({ ...localBrand, primaryColor: e.target.value })} style={{ fontFamily: 'monospace' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
                      {PRESET_COLORS.map(c => (
                        <button
                          key={c.value}
                          onClick={() => setLocalBrand({ ...localBrand, primaryColor: c.value })}
                          style={{
                            width: 28, height: 28, borderRadius: 6, background: c.value, cursor: 'pointer',
                            border: localBrand.primaryColor === c.value ? '2.5px solid var(--color-foreground)' : '2px solid transparent',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Accent Color</label>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <input type="color" value={localBrand.accentColor} onChange={e => setLocalBrand({ ...localBrand, accentColor: e.target.value })} style={{ width: 48, height: 40, borderRadius: 8, cursor: 'pointer', padding: '2px' }} />
                      <input className="field" value={localBrand.accentColor} onChange={e => setLocalBrand({ ...localBrand, accentColor: e.target.value })} style={{ fontFamily: 'monospace' }} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'payments' && (
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={18} style={{ color: 'var(--color-primary)' }} /> Razorpay
                </h2>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  <input type="checkbox" checked={localRP.enabled} onChange={e => setLocalRP({ ...localRP, enabled: e.target.checked })} style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }} />
                  Enable Payments
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', opacity: localRP.enabled ? 1 : 0.5, pointerEvents: localRP.enabled ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
                <div>
                  <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Lock size={14} /> Key ID
                  </label>
                  <input className="field" placeholder="rzp_test_..." value={localRP.keyId} onChange={e => setLocalRP({ ...localRP, keyId: e.target.value })} />
                </div>
                <div>
                  <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Lock size={14} /> Key Secret
                  </label>
                  <input type="password" className="field" placeholder="Secret key" value={localRP.keySecret} onChange={e => setLocalRP({ ...localRP, keySecret: e.target.value })} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', marginTop: '0.4rem' }}>Keep your secret key safe.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                <User size={18} style={{ color: 'var(--color-primary)' }} />
                <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Admin Account Settings</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Key size={14} /> Admin Email
                  </label>
                  <input
                    className="field"
                    type="email"
                    placeholder="admin@example.com"
                    value={adminCreds.email}
                    onChange={e => setAdminCreds({ ...adminCreds, email: e.target.value })}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', marginTop: '0.4rem' }}>
                    Update your admin email address
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                  <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Lock size={14} /> Current Password
                  </label>
                  <input
                    className="field"
                    type="password"
                    placeholder="Enter current password"
                    value={adminCreds.currentPassword}
                    onChange={e => setAdminCreds({ ...adminCreds, currentPassword: e.target.value })}
                  />
                </div>

                <div>
                  <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Lock size={14} /> New Password
                  </label>
                  <input
                    className="field"
                    type="password"
                    placeholder="Enter new password (min 6 characters)"
                    value={adminCreds.newPassword}
                    onChange={e => setAdminCreds({ ...adminCreds, newPassword: e.target.value })}
                  />
                </div>

                <div>
                  <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Lock size={14} /> Confirm New Password
                  </label>
                  <input
                    className="field"
                    type="password"
                    placeholder="Confirm new password"
                    value={adminCreds.confirmPassword}
                    onChange={e => setAdminCreds({ ...adminCreds, confirmPassword: e.target.value })}
                  />
                </div>

                <div style={{ background: 'var(--color-surface)', borderRadius: 8, padding: '1rem', fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>
                  <strong>Security Note:</strong> To update your email or password, you must provide your current password. Leave the password fields empty if you only want to update your email.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'smtp' && (
            <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={18} style={{ color: 'var(--color-primary)' }} /> SMTP Configuration
                </h2>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  <input type="checkbox" checked={localSmtp.enabled} onChange={e => setLocalSmtp({ ...localSmtp, enabled: e.target.checked })} style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }} />
                  Enable SMTP
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', opacity: localSmtp.enabled ? 1 : 0.5, pointerEvents: localSmtp.enabled ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="field-label">SMTP Host</label>
                    <input className="field" placeholder="smtp.gmail.com" value={localSmtp.host} onChange={e => setLocalSmtp({ ...localSmtp, host: e.target.value })} />
                  </div>
                  <div>
                    <label className="field-label">Port</label>
                    <input className="field" type="number" placeholder="587" value={localSmtp.port} onChange={e => setLocalSmtp({ ...localSmtp, port: Number(e.target.value) })} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    <input type="checkbox" checked={localSmtp.secure} onChange={e => setLocalSmtp({ ...localSmtp, secure: e.target.checked })} style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }} />
                    Use SSL/TLS (port 465)
                  </label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>Enable for port 465. Disable for port 587 (STARTTLS).</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="field-label">Username</label>
                    <input className="field" placeholder="your-email@gmail.com" value={localSmtp.user} onChange={e => setLocalSmtp({ ...localSmtp, user: e.target.value })} />
                  </div>
                  <div>
                    <label className="field-label">Password / App Password</label>
                    <input className="field" type="password" placeholder="••••••••" value={localSmtp.password} onChange={e => setLocalSmtp({ ...localSmtp, password: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="field-label">From Email</label>
                    <input className="field" type="email" placeholder="noreply@rajasthaniacinema.org" value={localSmtp.fromEmail} onChange={e => setLocalSmtp({ ...localSmtp, fromEmail: e.target.value })} />
                  </div>
                  <div>
                    <label className="field-label">From Name</label>
                    <input className="field" placeholder="Rajasthan Cine Association" value={localSmtp.fromName} onChange={e => setLocalSmtp({ ...localSmtp, fromName: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', paddingTop: '0.5rem' }}>
                  <button
                    onClick={async () => {
                      setTestingSmtp(true);
                      setSmtpTestResult(null);
                      try {
                        const result = await api.testSmtpEmail(localSmtp as never) as { success: boolean; message?: string; error?: string };
                        setSmtpTestResult(result.success ? (result.message || 'Test email sent!') : (result.error || 'Failed'));
                      } catch {
                        setSmtpTestResult('Failed to send test email');
                      } finally {
                        setTestingSmtp(false);
                      }
                    }}
                    disabled={testingSmtp}
                    className="btn-outline btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Send size={14} /> {testingSmtp ? 'Testing...' : 'Send Test Email'}
                  </button>
                  {smtpTestResult && (
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: smtpTestResult.includes('Failed') || smtpTestResult.includes('error') ? '#dc2626' : '#2D5016' }}>
                      {smtpTestResult}
                    </span>
                  )}
                </div>

                <div style={{ background: 'var(--color-surface)', borderRadius: 8, padding: '1rem', fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>
                  <strong>Note:</strong> For Gmail, use an <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>App Password</a> if 2FA is enabled. For Outlook, use port 587 with STARTTLS (secure: false).
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview */}
        {activeTab === 'branding' && (
          <div style={{ width: '360px', flexShrink: 0 }}>
            <div style={{ position: 'sticky', top: '5.5rem' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-muted-foreground)', fontWeight: 700, marginBottom: '0.75rem' }}>Live Preview</div>
              
              <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}>
                {/* Simulated Navbar */}
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {localBrand.logoUrl ? (
                    <img src={localBrand.logoUrl} alt="" style={{ width: 'auto', maxWidth: 100, height: 32, objectFit: 'contain' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: shapeRadius, background: localBrand.primaryColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif', fontWeight: 800, fontSize: '1.25rem' }}>
                      {previewFirstChar}
                    </div>
                  )}
                </div>

                {/* Color swatches */}
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <button style={{ background: localBrand.primaryColor, color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem 1.25rem', fontWeight: 600, fontSize: '0.875rem' }}>Primary Button</button>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ background: localBrand.accentColor, color: localBrand.primaryColor, padding: '0.2rem 0.65rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 600 }}>Badge</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
