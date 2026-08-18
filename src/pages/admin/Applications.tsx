import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateApplicationStatus, deleteApplication } from '@/store';
import { api } from '@/api/client';
import { Search, Star, Trash2, Filter, Clapperboard, CheckCircle2, XCircle, DollarSign, Calendar, User, Mail } from 'lucide-react';

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop';

export default function AdminApplications() {
  const applications = useAppSelector((s) => s.data.applications);
  const casting = useAppSelector((s) => s.data.casting);
  const users = useAppSelector((s) => s.data.users);
  const profiles = useAppSelector((s) => s.data.profiles);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<'all' | 'submitted' | 'shortlisted'>('all');

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const handleStatusChange = async (id: number | string, status: 'submitted' | 'shortlisted' | 'rejected') => {
    try {
      await api.updateApplication(id, { status });
      dispatch(updateApplicationStatus({ id, status }));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDelete = async (id: number | string) => {
    if (confirm('Delete this application permanently?')) {
      try {
        await api.deleteApplication(id);
        dispatch(deleteApplication(id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete application');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Casting Applications</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem' }}>Manage talent submissions</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.25rem' }}>
          <button
            className={`btn-ghost ${filter === 'all' ? 'active' : ''}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', background: filter === 'all' ? 'var(--color-card)' : 'transparent', boxShadow: filter === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`btn-ghost ${filter === 'submitted' ? 'active' : ''}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', background: filter === 'submitted' ? 'var(--color-card)' : 'transparent', boxShadow: filter === 'submitted' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            onClick={() => setFilter('submitted')}
          >
            Submitted
          </button>
          <button
            className={`btn-ghost ${filter === 'shortlisted' ? 'active' : ''}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', background: filter === 'shortlisted' ? 'var(--color-card)' : 'transparent', boxShadow: filter === 'shortlisted' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            onClick={() => setFilter('shortlisted')}
          >
            Shortlisted
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="rca-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Contact</th>
                <th>Casting Call</th>
                <th>Role Applied For</th>
                <th>Payments</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => {
                const user = users.find(u => u.id === app.userId);
                const profile = profiles.find(p => p.userId === app.userId);
                const call = casting.find(c => c.id === app.castingCallId);
                return (
                  <tr key={app.id} className={`animate-slide-up stagger-${Math.min(i + 1, 10)}`}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img
                          src={profile?.photoUrl || DEFAULT_IMG}
                          alt=""
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)', background: 'var(--color-muted)' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>{user ? user.fullName : (profile?.displayName || 'Unknown User')}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>ID: {app.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                        <Mail size={12} style={{ color: 'var(--color-muted-foreground)' }} />
                        {user ? user.email : 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{call ? call.projectTitle : 'Unknown Casting'}</div>
                      {call && <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>{call.productionHouse}</div>}
                    </td>
                    <td>
                      <span className="badge badge-primary">{app.roleAppliedFor}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem' }}>{app.availability}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {app.accountPaymentId && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                            <DollarSign size={10} style={{ color: 'var(--color-primary)' }} />
                            <span style={{ color: 'var(--color-muted-foreground)' }}>Account: {app.accountPaymentId.slice(0, 12)}…</span>
                            <CheckCircle2 size={10} style={{ color: '#22c55e' }} />
                          </div>
                        )}
                        {app.applicationPaymentId && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                            <DollarSign size={10} style={{ color: 'var(--color-primary)' }} />
                            <span style={{ color: 'var(--color-muted-foreground)' }}>App: {app.applicationPaymentId.slice(0, 12)}…</span>
                            <CheckCircle2 size={10} style={{ color: '#22c55e' }} />
                          </div>
                        )}
                        {!app.accountPaymentId && !app.applicationPaymentId && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>No payments</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <select
                        className="field"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', height: 'auto', width: 'auto' }}
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as 'submitted' | 'shortlisted' | 'rejected')}
                      >
                        <option value="submitted">Submitted</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDelete(app.id)} className="btn-ghost" style={{ padding: '0.35rem', color: 'var(--color-danger)' }} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-muted-foreground)' }}>
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
