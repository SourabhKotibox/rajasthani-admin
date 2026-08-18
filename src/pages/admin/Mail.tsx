import { useState, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { sendMessage, deleteMessage } from '@/store';
import { api } from '@/api/client';
import {
  Mail, Send, Trash2, Users, User, Clock, CheckCircle,
  Inbox, Shield, Eye, X,
} from 'lucide-react';
import type { RcaMessage } from '@/store';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminMail() {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(s => s.messages.items);
  const allUsers = useAppSelector(s => s.data.users);
  const user = useAppSelector(s => s.auth.user)!;

  const [subject, setSubject]     = useState('');
  const [body, setBody]           = useState('');
  const [toTarget, setToTarget]   = useState<string>('talent');
  const [sent, setSent]           = useState(false);
  const [preview, setPreview]     = useState<RcaMessage | null>(null);

  const talentUsers = allUsers.filter(u => u.role === 'talent');

  const onSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    const toUserId: RcaMessage['toUserId'] =
      toTarget === 'all' ? 'all' :
      toTarget === 'talent' ? 'talent' :
      toTarget === 'admin' ? 'admin' :
      Number(toTarget);

    const msgBody = {
      subject: subject.trim(),
      body: body.trim(),
      senderName: user.fullName,
      senderEmail: 'admin@rajasthaniacinema.org',
      toUserId,
    };
    try {
      const created = await api.createMessage(msgBody as never) as RcaMessage;
      dispatch(sendMessage(created as never));
    } catch {
      dispatch(sendMessage(msgBody));
    }
    setSubject(''); setBody('');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const targetLabel = (m: RcaMessage) => {
    if (m.toUserId === 'all') return 'All Users';
    if (m.toUserId === 'talent') return 'All Talent';
    if (m.toUserId === 'admin') return 'All Admins';
    const u = allUsers.find(x => x.id === m.toUserId);
    return u ? u.fullName : `User #${m.toUserId}`;
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <Mail size={16} />
            </div>
            <h1 className="font-serif" style={{ fontSize: '1.65rem', fontWeight: 800 }}>Mail Center</h1>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>
            Compose and send emails to individual users or broadcast to all
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-success">{messages.length} sent</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px,420px) 1fr', gap: '1.75rem', alignItems: 'start' }}>
        {/* Compose */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', position: 'sticky', top: '90px' }}>
          <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Send size={15} style={{ color: '#059669' }} />
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Compose Message</h2>
          </div>

          <form onSubmit={onSend} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Recipient */}
            <div>
              <label className="field-label">Send To</label>
              <select className="field" value={toTarget} onChange={e => setToTarget(e.target.value)}>
                <optgroup label="Broadcast">
                  <option value="all">📢 All Users</option>
                  <option value="talent">🎭 All Talent Users</option>
                  <option value="admin">🛡️ All Admins</option>
                </optgroup>
                <optgroup label="Individual Talent">
                  {talentUsers.map(u => (
                    <option key={u.id} value={String(u.id)}>👤 {u.fullName} ({u.email})</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="field-label">Subject *</label>
              <input
                className="field"
                placeholder="Message subject..."
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
              />
            </div>

            {/* Body */}
            <div>
              <label className="field-label">Message Body *</label>
              <textarea
                className="field"
                rows={8}
                placeholder="Write your message here. You can use line breaks for formatting."
                value={body}
                onChange={e => setBody(e.target.value)}
                required
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>From: {user.fullName} &lt;admin@rajasthaniacinema.org&gt;</span>
                <span>{body.length} chars</span>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
              <Send size={15} /> Send Message
            </button>

            {sent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 600, fontSize: '0.875rem', justifyContent: 'center' }} className="animate-slide-up">
                <CheckCircle size={16} /> Message delivered!
              </div>
            )}
          </form>
        </div>

        {/* Sent Log */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Inbox size={16} style={{ color: '#475569' }} />
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Sent Messages</h2>
          </div>

          {messages.length === 0 ? (
            <div style={{ background: '#f8fafc', border: '1px dashed #e2e8f0', borderRadius: 14, padding: '3rem 1.25rem', textAlign: 'center' }}>
              <Mail size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <p style={{ color: 'var(--color-muted-foreground)', fontSize: '0.9rem' }}>No messages sent yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {messages.map((m, i) => (
                <div
                  key={m.id}
                  className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}
                  style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}
                  onClick={() => setPreview(m)}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {typeof m.toUserId === 'number' ? <User size={11} /> : m.toUserId === 'admin' ? <Shield size={11} /> : <Users size={11} />}
                        {targetLabel(m)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={11} /> {timeAgo(m.createdAt)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Eye size={11} /> {m.readBy.length} read
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={async e => { e.stopPropagation(); try { await api.deleteMessage(m.id); dispatch(deleteMessage(m.id)); } catch {} }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.25rem', borderRadius: 6, flexShrink: 0 }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#dc2626'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Preview Modal */}
      {preview && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setPreview(null); }}>
          <div className="modal-box" style={{ maxWidth: 560 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.2rem' }}>{preview.subject}</h3>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', gap: '0.75rem' }}>
                  <span>From: {preview.senderName}</span>
                  <span>To: {targetLabel(preview)}</span>
                  <span>{timeAgo(preview.createdAt)}</span>
                </div>
              </div>
              <button onClick={() => setPreview(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={18} /></button>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: '1rem 1.25rem', whiteSpace: 'pre-wrap', fontSize: '0.875rem', lineHeight: 1.7, color: '#374151', maxHeight: '60vh', overflowY: 'auto' }}>
              {preview.body}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
