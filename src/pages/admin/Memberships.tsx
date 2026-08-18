import { useState, useEffect } from 'react';
import { api } from '@/api/client';
import { Users, FileText, Download, UserCheck, ShieldAlert, CreditCard } from 'lucide-react';

export default function AdminMemberships() {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api.getMemberships().then((data: unknown) => {
      setMemberships(data as any[]);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  const handleUpdate = async (id: string, payload: any) => {
    try {
      await api.updateMembership(id, payload);
      fetchData();
    } catch (err) {
      alert('Failed to update');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users style={{ color: 'var(--color-primary)' }} />
            Membership Applications
          </h1>
          <p style={{ color: 'var(--color-muted-foreground)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Review all membership applications and registrations.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted-foreground)' }}>Loading...</div>
      ) : memberships.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--color-card)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
          <ShieldAlert size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p style={{ fontWeight: 600 }}>No applications yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {memberships.map((m: any) => (
            <div key={m.id} style={{ background: 'var(--color-card)', borderRadius: '16px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img src={m.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'User')}&background=random`} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.1rem' }}>{m.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>{m.email} • {m.contact}</div>
                </div>
              </div>
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-muted-foreground)' }}>Status</span>
                  <span style={{ fontWeight: 700, color: m.status === 'paid' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                    {m.status.toUpperCase()}
                  </span>
                </div>
                {m.membershipNo && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-muted-foreground)' }}>Membership No</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{m.membershipNo}</span>
                  </div>
                )}
                {m.paymentId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-muted-foreground)' }}>Payment ID</span>
                    <span style={{ fontFamily: 'monospace' }}>{m.paymentId}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-muted-foreground)' }}>Age / Gender</span>
                  <span>{m.age || '-'} / {m.gender || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-muted-foreground)' }}>Qualification</span>
                  <span>{m.qualification || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-muted-foreground)' }}>Occupation</span>
                  <span>{m.occupation || '-'}</span>
                </div>
                {m.address && (
                  <div>
                    <span style={{ color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '0.2rem' }}>Address</span>
                    <p style={{ lineHeight: 1.4 }}>{m.address} - {m.pincode}</p>
                  </div>
                )}
              </div>
              <div style={{ padding: '1rem 1.25rem', background: 'rgba(0,0,0,0.1)', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select
                  className="field"
                  style={{ height: '32px', fontSize: '0.75rem', padding: '0 0.5rem', flex: 1 }}
                  value={m.status}
                  onChange={(e) => handleUpdate(m.id, { status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  className="field"
                  style={{ height: '32px', fontSize: '0.75rem', padding: '0 0.5rem', flex: 1 }}
                  value={m.cardColor || 'gold'}
                  onChange={(e) => handleUpdate(m.id, { cardColor: e.target.value })}
                >
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="black">Black</option>
                  <option value="blue">Blue</option>
                  <option value="red">Red</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
