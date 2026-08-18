import { useState, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { sendNotification, deleteNotification } from '@/store';
import { api } from '@/api/client';
import {
  Bell, Send, Trash2, Info, CheckCircle, AlertTriangle, Clapperboard,
  RefreshCw, Users, Shield, Zap, Clock, ChevronDown,
} from 'lucide-react';
import type { RcaNotification } from '@/store';

const TYPE_OPTIONS: { value: RcaNotification['type']; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { value: 'info',    label: 'Information',   icon: <Info size={14} />,         color: '#1A4A7A', bg: '#E8F0FA' },
  { value: 'success', label: 'Announcement',  icon: <CheckCircle size={14} />,  color: '#2D5016', bg: '#EEF5E8' },
  { value: 'warning', label: 'Alert / Notice',icon: <AlertTriangle size={14} />,color: '#7A5200', bg: '#FDF4DC' },
  { value: 'casting', label: 'Casting Update',icon: <Clapperboard size={14} />, color: '#6366f1', bg: '#eef2ff' },
  { value: 'update',  label: 'Platform Update',icon: <RefreshCw size={14} />,   color: '#0891b2', bg: '#e0f7fa' },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminNotifications() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(s => s.notifications.items);
  const user = useAppSelector(s => s.auth.user)!;

  const [title, setTitle]       = useState('');
  const [message, setMessage]   = useState('');
  const [type, setType]         = useState<RcaNotification['type']>('info');
  const [priority, setPriority] = useState<RcaNotification['priority']>('normal');
  const [target, setTarget]     = useState<RcaNotification['targetRole']>('all');
  const [sent, setSent]         = useState(false);
  const [filter, setFilter]     = useState<'all' | RcaNotification['type']>('all');

  const onSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    const body = {
      title: title.trim(),
      message: message.trim(),
      type,
      priority,
      targetRole: target,
      createdBy: user.fullName,
    };
    try {
      const created = await api.createNotification(body as never) as RcaNotification;
      dispatch(sendNotification(created as never));
    } catch {
      dispatch(sendNotification(body));
    }
    setTitle(''); setMessage('');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);
  const typeInfo = (t: RcaNotification['type']) => TYPE_OPTIONS.find(o => o.value === t)!;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
              <Bell size={16} />
            </div>
            <h1 className="font-serif" style={{ fontSize: '1.65rem', fontWeight: 800 }}>Push Notifications</h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>
            Compose and broadcast notifications to all users or specific roles
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-info">{notifications.length} total sent</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px,420px) 1fr', gap: '1.75rem', alignItems: 'start' }}>
        {/* Compose Panel */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', position: 'sticky', top: '90px' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#f8fafc' }}>
            <Send size={15} style={{ color: 'var(--color-primary)' }} />
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Compose Notification</h2>
          </div>
          <form onSubmit={onSend} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Title */}
            <div>
              <label className="field-label">Notification Title *</label>
              <input
                className="field"
                placeholder="e.g. New casting call available!"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="field-label">Message Body *</label>
              <textarea
                className="field"
                rows={4}
                placeholder="Write the full notification message here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem', textAlign: 'right' }}>
                {message.length} chars
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="field-label">Notification Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {TYPE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setType(opt.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.45rem',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 9,
                      border: `1.5px solid ${type === opt.value ? opt.color : '#e2e8f0'}`,
                      background: type === opt.value ? opt.bg : '#fafafa',
                      color: type === opt.value ? opt.color : '#64748b',
                      fontSize: '0.8rem', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.15s',
                      fontFamily: 'inherit',
                    }}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority + Target row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="field-label">Priority</label>
                <select className="field" value={priority} onChange={e => setPriority(e.target.value as any)}>
                  <option value="normal">Normal</option>
                  <option value="urgent">🔴 Urgent</option>
                </select>
              </div>
              <div>
                <label className="field-label">Send To</label>
                <select className="field" value={target} onChange={e => setTarget(e.target.value as any)}>
                  <option value="all">All Users</option>
                  <option value="talent">Talent Only</option>
                  <option value="admin">Admins Only</option>
                </select>
              </div>
            </div>

            {/* Preview */}
            {(title || message) && (
              <div style={{ background: typeInfo(type).bg, border: `1.5px solid ${typeInfo(type).color}22`, borderRadius: 12, padding: '0.9rem 1rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: typeInfo(type).color, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {typeInfo(type).icon} Preview
                </div>
                {title && <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1C1917', marginBottom: '0.2rem' }}>{title}</div>}
                {message && <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>{message.slice(0, 120)}{message.length > 120 ? '…' : ''}</div>}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.25rem' }}>
              <Send size={15} />
              {priority === 'urgent' ? '🔴 Send Urgent Notification' : 'Send Notification'}
            </button>

            {sent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 600, fontSize: '0.875rem', justifyContent: 'center' }} className="animate-slide-up">
                <CheckCircle size={16} /> Notification sent to {target === 'all' ? 'all users' : target === 'talent' ? 'talent users' : 'admins'}!
              </div>
            )}
          </form>
        </div>

        {/* Sent Log */}
        <div>
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {[{ value: 'all', label: 'All' }, ...TYPE_OPTIONS.map(o => ({ value: o.value, label: o.label }))].map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as any)}
                className={`pill-filter ${filter === f.value ? 'active' : ''}`}
                style={{ fontSize: '0.78rem' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ background: '#f8fafc', border: '1px dashed #e2e8f0', borderRadius: 14, padding: '3rem 1.25rem', textAlign: 'center' }}>
              <Bell size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <p style={{ color: 'var(--color-muted-foreground)', fontSize: '0.9rem' }}>No notifications sent yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filtered.map((n, i) => {
                const t = typeInfo(n.type);
                return (
                  <div
                    key={n.id}
                    className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}
                    style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', borderLeft: `4px solid ${t.color}` }}
                  >
                    <div style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: t.color }}>{t.icon}</span>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C1917' }}>{n.title}</span>
                          {n.priority === 'urgent' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: '#fef2f2', color: '#dc2626', padding: '0.1rem 0.45rem', borderRadius: 99, fontSize: '0.65rem', fontWeight: 700 }}>
                              <Zap size={10} /> URGENT
                            </span>
                          )}
                        </div>
                        <button
                          onClick={async () => { try { await api.deleteNotification(n.id); dispatch(deleteNotification(n.id)); } catch {} }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.15rem', borderRadius: 6, transition: 'color 0.15s', flexShrink: 0 }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#dc2626'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#475569', marginBottom: '0.75rem', lineHeight: 1.55 }}>{n.message}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                          <Clock size={12} /> {timeAgo(n.createdAt)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                          {n.targetRole === 'all' ? <Users size={12} /> : <Shield size={12} />}
                          Sent to: <strong style={{ color: '#475569' }}>{n.targetRole === 'all' ? 'All Users' : n.targetRole === 'talent' ? 'Talent' : 'Admins'}</strong>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle size={12} />
                          {n.readBy.length} read
                        </div>
                        <span style={{ background: t.bg, color: t.color, padding: '0.1rem 0.5rem', borderRadius: 99, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {n.type}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
