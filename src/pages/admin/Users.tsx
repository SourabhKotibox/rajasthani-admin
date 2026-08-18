import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateUserRole, deleteUser } from '@/store';
import { api } from '@/api/client';
import { Search, Shield, Users, Trash2, Mail, ChevronDown, UserCheck, UserX, Crown, Sparkles } from 'lucide-react';
import type { User as RcaUser } from '@/data/mock';

const AVATAR_GRADIENTS = [
  ['#FA931A', '#FDD9AB'],
  ['#1a4a7a', '#4f9cf9'],
  ['#2D5016', '#6abf4b'],
  ['#7a1a4a', '#f97fb5'],
  ['#5a3e9a', '#a78cf9'],
  ['#8B1A1A', '#f97070'],
];

export default function UsersAdmin() {
  const users = useAppSelector((s) => s.data.users);
  const dispatch = useAppDispatch();
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'talent'>('all');
  const [openMenu, setOpenMenu] = useState<number | string | null>(null);

  const filtered = users.filter((u: RcaUser) => {
    const matchesQ =
      u.fullName.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesQ && matchesRole;
  });

  const adminCount = users.filter((u: RcaUser) => u.role === 'admin').length;
  const talentCount = users.filter((u: RcaUser) => u.role === 'talent').length;

  const handleDelete = async (id: number | string, name: string) => {
    if (confirm(`Remove ${name}? This will permanently delete all their data.`)) {
      try {
        await api.deleteUser(id);
        dispatch(deleteUser(id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete user');
      }
      setOpenMenu(null);
    }
  };

  const handleRoleChange = async (id: number | string, role: 'admin' | 'talent') => {
    try {
      await api.updateUserRole(id, role);
      dispatch(updateUserRole({ id, role }));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update role');
    }
    setOpenMenu(null);
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

  const getGradient = (id: number | string) => {
    let numId = typeof id === 'number' ? id : 0;
    if (typeof id === 'string') {
      numId = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    }
    return AVATAR_GRADIENTS[numId % AVATAR_GRADIENTS.length];
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'var(--color-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} style={{ color: 'var(--color-primary)' }} />
              </div>
              <h1 className="font-serif" style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                User Management
              </h1>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)', marginLeft: '55px' }}>
              Manage platform accounts, roles and permissions
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'var(--color-primary)', bg: 'var(--color-primary-subtle)' },
          { label: 'Administrators', value: adminCount, icon: Crown, color: '#1a4a7a', bg: '#E8F0FA' },
          { label: 'Talent Members', value: talentCount, icon: UserCheck, color: '#2D5016', bg: '#EEF5E8' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1, color: 'var(--color-foreground)', fontFamily: 'serif' }}>{value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted-foreground)', marginTop: '0.2rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '20px', overflow: 'visible', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

        {/* Toolbar */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', background: 'var(--color-surface)' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or email…"
              className="field"
              style={{ paddingLeft: '2.5rem', height: '42px', fontSize: '0.9rem', borderRadius: '10px', background: 'var(--color-card)' }}
            />
          </div>

          <div style={{ display: 'flex', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
            {(['all', 'admin', 'talent'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                style={{
                  padding: '0.5rem 1.1rem', fontSize: '0.82rem', fontWeight: 600,
                  textTransform: 'capitalize', border: 'none', cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: roleFilter === role ? 'var(--color-primary)' : 'transparent',
                  color: roleFilter === role ? '#fff' : 'var(--color-muted-foreground)',
                }}
              >
                {role === 'all' ? `All (${users.length})` : role === 'admin' ? `Admin (${adminCount})` : `Talent (${talentCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Table Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: '1rem', padding: '0.75rem 1.5rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          {['User', 'Email', 'Role', 'Actions'].map((h) => (
            <div key={h} style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--color-muted-foreground)' }}>
              <UserX size={52} style={{ opacity: 0.15, margin: '0 auto 1.25rem auto' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '0.5rem' }}>No users found</h3>
              <p style={{ fontSize: '0.88rem' }}>Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filtered.map((u: RcaUser, i: number) => {
              const [g1, g2] = getGradient(u.id);
              const isAdmin = u.role === 'admin';
              return (
                <div
                  key={u.id}
                  className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr',
                    gap: '1rem', padding: '1rem 1.5rem', alignItems: 'center',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none',
                    transition: 'background 0.15s',
                    position: 'relative',
                    zIndex: openMenu === u.id ? 10 : 1,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* User */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
                      background: `linear-gradient(135deg, ${g1}, ${g2})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', fontWeight: 800, color: '#fff',
                      boxShadow: `0 3px 10px ${g1}55`,
                    }}>
                      {getInitials(u.fullName)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-foreground)' }}>{u.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', marginTop: '1px' }}>ID #{u.id}</div>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-muted-foreground)', fontSize: '0.875rem', overflow: 'hidden' }}>
                    <Mail size={13} style={{ flexShrink: 0 }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</span>
                  </div>

                  {/* Role Badge */}
                  <div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      padding: '0.3rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700,
                      background: isAdmin ? '#FDF4DC' : '#EEF5E8',
                      color: isAdmin ? 'var(--color-primary)' : '#2D5016',
                      border: `1px solid ${isAdmin ? 'var(--color-primary-tint)' : '#c5e6b0'}`,
                    }}>
                      {isAdmin ? <Crown size={11} /> : <Sparkles size={11} />}
                      {isAdmin ? 'Admin' : 'Talent'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Role toggle */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.4rem',
                          padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                          color: 'var(--color-foreground)', cursor: 'pointer', transition: 'all 0.15s',
                        }}
                      >
                        <Shield size={13} style={{ color: 'var(--color-primary)' }} />
                        Role
                        <ChevronDown size={12} />
                      </button>
                      {openMenu === u.id && (
                        <div
                          style={{
                            position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 50,
                            background: 'var(--color-card)', border: '1px solid var(--color-border)',
                            borderRadius: '10px', overflow: 'hidden',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: '130px',
                          }}
                        >
                          {(['talent', 'admin'] as const).map((role) => (
                            <button
                              key={role}
                              onClick={() => handleRoleChange(u.id, role)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                                padding: '0.65rem 1rem', fontSize: '0.85rem', fontWeight: 600,
                                background: u.role === role ? 'var(--color-primary-subtle)' : 'transparent',
                                color: u.role === role ? 'var(--color-primary)' : 'var(--color-foreground)',
                                border: 'none', cursor: 'pointer', textAlign: 'left', textTransform: 'capitalize',
                                transition: 'background 0.15s',
                              }}
                            >
                              {role === 'admin' ? <Crown size={13} /> : <Sparkles size={13} />}
                              {role}
                              {u.role === role && <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--color-primary)' }}>✓</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(u.id, u.fullName)}
                      title="Delete user"
                      style={{
                        padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)', color: 'var(--color-muted-foreground)',
                        cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#FAEAEA';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-danger)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#f5b8b8';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted-foreground)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div style={{ padding: '0.9rem 1.5rem', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)' }}>
              Showing <strong style={{ color: 'var(--color-foreground)' }}>{filtered.length}</strong> of <strong style={{ color: 'var(--color-foreground)' }}>{users.length}</strong> users
            </span>
          </div>
        )}
      </div>

      {/* Click-outside handler for dropdown */}
      {openMenu !== null && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
          onClick={() => setOpenMenu(null)}
        />
      )}
    </div>
  );
}
