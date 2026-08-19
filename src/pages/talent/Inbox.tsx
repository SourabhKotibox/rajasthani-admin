import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { markMessageRead, deleteMessage } from '@/store';
import {
  Inbox as InboxIcon, Mail, Trash2, Clock, Eye, Shield, Users, User, X
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

export default function TalentInbox() {
  const dispatch = useAppDispatch();
  const allMessages = useAppSelector(s => s.messages.items);
  const user = useAppSelector(s => s.auth.user)!;

  const [preview, setPreview] = useState<RcaMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Filter messages intended for this user
  const myMessages = useMemo(() => {
    return allMessages.filter(m => 
      m.toUserId === 'all' || 
      m.toUserId === user.role || 
      m.toUserId === user.id
    );
  }, [allMessages, user]);

  const filteredMessages = myMessages.filter(m => {
    if (filter === 'unread') return !m.readBy.includes(user.id);
    return true;
  });

  const unreadCount = myMessages.filter(m => !m.readBy.includes(user.id)).length;

  const handleOpenMessage = (m: RcaMessage) => {
    setPreview(m);
    if (!m.readBy.includes(user.id)) {
      dispatch(markMessageRead({ messageId: m.id, userId: user.id }));
    }
  };

  const targetLabel = (m: RcaMessage) => {
    if (m.toUserId === 'all') return 'All Users';
    if (m.toUserId === 'talent') return 'All Talent';
    if (m.toUserId === 'admin') return 'All Admins';
    return 'Me';
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Inbox</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem' }}>
            Messages and communications from Rajasthan Cine Association administration
          </p>
        </div>
        <div style={{ display: 'flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.25rem' }}>
          <button 
            className={`btn-ghost ${filter === 'all' ? 'active' : ''}`} 
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', background: filter === 'all' ? 'var(--color-card)' : 'transparent', boxShadow: filter === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            onClick={() => setFilter('all')}
          >
            All Messages
          </button>
          <button 
            className={`btn-ghost ${filter === 'unread' ? 'active' : ''}`} 
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', background: filter === 'unread' ? 'var(--color-card)' : 'transparent', boxShadow: filter === 'unread' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            onClick={() => setFilter('unread')}
          >
            Unread
            {unreadCount > 0 && (
              <span style={{ background: 'var(--color-danger)', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: 99, fontSize: '0.65rem', fontWeight: 700 }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div>
        {filteredMessages.length === 0 ? (
          <div style={{ background: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: '14px', padding: '4rem 1.25rem', textAlign: 'center' }}>
            <InboxIcon size={40} style={{ margin: '0 auto 1rem', opacity: 0.35 }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Inbox empty</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.5rem' }}>
              {filter === 'unread' ? 'You have read all your messages.' : 'You have no messages yet.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {filteredMessages.map((m, i) => {
              const isRead = m.readBy.includes(user.id);
              return (
                <div
                  key={m.id}
                  className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}
                  style={{ 
                    background: isRead ? 'var(--color-card)' : 'var(--color-primary-subtle)', 
                    border: '1px solid',
                    borderColor: isRead ? 'var(--color-border)' : 'var(--color-primary)',
                    borderRadius: 12, 
                    padding: '1rem 1.25rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    cursor: 'pointer', 
                    transition: 'all 0.15s' 
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}
                  onClick={() => handleOpenMessage(m)}
                >
                  <div style={{ 
                    width: 40, height: 40, 
                    borderRadius: 10, 
                    background: isRead ? 'var(--color-surface)' : '#fff', 
                    color: isRead ? 'var(--color-muted-foreground)' : 'var(--color-primary)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                  }}>
                    <Mail size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: isRead ? 600 : 800, fontSize: '0.9rem', marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-foreground)' }}>
                      {m.subject}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Shield size={11} /> {m.senderName}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={11} /> {timeAgo(m.createdAt)}
                      </span>
                      {!isRead && (
                        <span className="badge badge-primary" style={{ padding: '0.1rem 0.4rem', fontSize: '0.6rem' }}>New</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Preview Modal */}
      {preview && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setPreview(null); }}>
          <div className="modal-box" style={{ maxWidth: 600 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--color-foreground)' }}>{preview.subject}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted-foreground)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-foreground)' }}>From:</span> {preview.senderName} &lt;{preview.senderEmail}&gt;
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-foreground)' }}>To:</span> {targetLabel(preview)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-foreground)' }}>Date:</span> {new Date(preview.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <button onClick={() => setPreview(null)} style={{ background: 'var(--color-surface)', border: 'none', cursor: 'pointer', color: 'var(--color-foreground)', padding: '0.4rem', borderRadius: '50%' }}><X size={18} /></button>
            </div>
            
            <div style={{ height: '1px', background: 'var(--color-border)', margin: '1rem 0' }}></div>
            
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--color-foreground)', maxHeight: '60vh', overflowY: 'auto' }}>
              {preview.body}
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setPreview(null)} className="btn-primary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
