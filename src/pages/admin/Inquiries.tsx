import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { actionInquiry, deleteInquiry, hydrateData } from '@/store';
import { api } from '@/api/client';
import { CheckCircle2, MessageSquare, Clock, User, Building2, CheckSquare, Trash2 } from 'lucide-react';

export default function Inquiries() {
  const inquiries = useAppSelector((s) => s.data.inquiries);
  const profiles = useAppSelector((s) => s.data.profiles);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<'all' | 'new'>('new');

  // Fetch fresh inquiries from API on mount
  useEffect(() => {
    api.getInquiries()
      .then((data) => dispatch(hydrateData({ inquiries: data as never })))
      .catch(() => { /* use Redux state */ });
  }, [dispatch]);

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === 'new');

  const setStatus = async (id: number) => {
    try {
      await api.actionInquiry(id);
      dispatch(actionInquiry(id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update inquiry');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this inquiry permanently?')) {
      try {
        await api.deleteInquiry(id);
        dispatch(deleteInquiry(id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete inquiry');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Industry Inquiries</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem' }}>Mediate talent requests and messages</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.25rem' }}>
          <button 
            className={`btn-ghost ${filter === 'new' ? 'active' : ''}`} 
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', background: filter === 'new' ? 'var(--color-card)' : 'transparent', boxShadow: filter === 'new' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            onClick={() => setFilter('new')}
          >
            New ({inquiries.filter(i => i.status === 'new').length})
          </button>
          <button 
            className={`btn-ghost ${filter === 'all' ? 'active' : ''}`} 
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', background: filter === 'all' ? 'var(--color-card)' : 'transparent', boxShadow: filter === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            onClick={() => setFilter('all')}
          >
            All Messages
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filtered.length === 0 ? (
          <div style={{ background: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: '14px', padding: '4rem 1.25rem', textAlign: 'center' }}>
            <MessageSquare size={40} style={{ margin: '0 auto 1rem', opacity: 0.35, color: 'var(--color-success)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Inbox zero!</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.5rem' }}>No new inquiries to process.</p>
          </div>
        ) : (
          filtered.map((inq, i) => {
            const targetProfile = inq.profileId ? profiles.find(p => p.id === inq.profileId) : null;
            
            return (
              <div key={inq.id} className={`rca-card animate-slide-up stagger-${Math.min(i + 1, 10)}`} style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${inq.status === 'new' ? 'badge-primary animate-pulse-light' : 'badge-muted'}`}>
                        {inq.status === 'new' ? 'New Message' : 'Processed'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> Recent
                      </span>
                    </div>
                    <button onClick={() => handleDelete(inq.id)} className="btn-ghost" style={{ padding: '0.25rem', color: 'var(--color-danger)' }} title="Delete Inquiry">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <h3 className="font-serif" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>{inq.subject}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginBottom: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={13} /> {inq.name} ({inq.email})</span>
                    {inq.company && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Building2 size={13} /> {inq.company}</span>}
                  </div>
                  
                  <div style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--color-foreground)' }}>
                    {inq.message}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '220px', borderLeft: '1px solid var(--color-border)', paddingLeft: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Target</div>
                    {targetProfile ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-surface)', padding: '0.5rem', borderRadius: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-muted)', overflow: 'hidden' }}>
                          {targetProfile.photoUrl ? <img src={targetProfile.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={14} />}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{targetProfile.displayName}</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)' }}>General Platform Inquiry</div>
                    )}
                  </div>
                  
                  <div style={{ marginTop: 'auto' }}>
                    {inq.status === 'new' ? (
                      <button onClick={() => setStatus(inq.id)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        <CheckSquare size={14} /> Mark Processed
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600, padding: '0.5rem', border: '1px solid #6fcf97', borderRadius: '8px', background: 'var(--color-success-bg)' }}>
                        <CheckCircle2 size={14} /> Handled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
