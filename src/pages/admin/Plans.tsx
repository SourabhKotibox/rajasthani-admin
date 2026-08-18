import { useState, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addPlan, updatePlan, deletePlan, SubscriptionPlan } from '@/store';
import { api } from '@/api/client';
import {
  Plus, Edit2, Trash2, CheckCircle, X, Sparkles, Zap, Star, Rocket, Crown
} from 'lucide-react';

const PLAN_META: Record<string, { icon: typeof Zap; gradient: string; accentColor: string; glow: string; label?: string }> = {
  Free: { icon: Zap, gradient: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)', accentColor: '#1a4a7a', glow: 'rgba(26, 74, 122, 0.1)' },
  Basic: { icon: Star, gradient: 'linear-gradient(135deg, #FFF3E6 0%, #FDD9AB 100%)', accentColor: '#FA931A', glow: 'rgba(250, 147, 26, 0.15)' },
  Pro: { icon: Rocket, gradient: 'linear-gradient(135deg, #eef5e8 0%, #d6efcb 100%)', accentColor: '#2D5016', glow: 'rgba(45, 80, 22, 0.15)', label: 'Most Popular' },
  Elite: { icon: Crown, gradient: 'linear-gradient(135deg, #f5f0ff 0%, #ece3ff 100%)', accentColor: '#5a3e9a', glow: 'rgba(90, 62, 154, 0.15)' },
};

const DEFAULT_META = { icon: Sparkles, gradient: 'linear-gradient(135deg, #f5f5f5, #e8e8e8)', accentColor: 'var(--color-primary)', glow: 'rgba(0,0,0,0.05)' };

export default function AdminPlans() {
  const plans = useAppSelector((s) => s.plans.items);
  const dispatch = useAppDispatch();

  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Delete the "${name}" plan? Subscribers may be affected.`)) {
      try {
        await api.deletePlan(id);
        dispatch(deletePlan(id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete plan');
      }
    }
  };

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const plan = {
      id: editingPlan?.id ?? 0,
      name: String(fd.get('name')),
      priceMonthly: Number(fd.get('priceMonthly')),
      maxEntries: Number(fd.get('maxEntries')),
      features: String(fd.get('features')).split(',').map((f) => f.trim()).filter(Boolean),
    };
    try {
      if (isCreating) {
        const created = await api.createPlan(plan as never) as SubscriptionPlan;
        dispatch(addPlan(created));
      } else {
        const updated = await api.updatePlan(plan.id, plan as never) as SubscriptionPlan;
        dispatch(updatePlan(updated));
      }
    } catch (err) {
      // Fallback: update Redux even if API fails
      if (isCreating) dispatch(addPlan(plan));
      else dispatch(updatePlan(plan));
      alert(err instanceof Error ? `Saved locally (API error: ${err.message})` : 'Saved locally');
    }
    setEditingPlan(null);
    setIsCreating(false);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Subscription Plans
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)', marginTop: '0.3rem' }}>
            Define what each tier of talent can access on the platform.
          </p>
        </div>
        <button
          onClick={() => { setIsCreating(true); setEditingPlan(null); }}
          className="btn-primary"
          style={{ padding: '0.7rem 1.4rem', borderRadius: '12px', gap: '0.5rem' }}
        >
          <Plus size={16} /> New Plan
        </button>
      </div>

      {/* Plan Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {plans.map((plan, i) => {
          const meta = PLAN_META[plan.name] ?? DEFAULT_META;
          const PlanIcon = meta.icon;
          const price = plan.priceMonthly === 0 ? 'Free' : `₹ ${plan.priceMonthly.toLocaleString()}`;

          return (
            <div
              key={plan.id}
              className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}
              style={{
                position: 'relative',
                background: 'var(--color-card)',
                border: '1.5px solid var(--color-border)',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: `0 4px 24px ${meta.glow}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 40px ${meta.glow}`;
                (e.currentTarget as HTMLDivElement).style.borderColor = meta.accentColor + '55';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 24px ${meta.glow}`;
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
              }}
            >
              {/* Popular label */}
              {meta.label && (
                <div style={{
                  position: 'absolute', top: '1.2rem', right: '1.2rem',
                  background: meta.accentColor, color: '#fff',
                  fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
                  padding: '0.25rem 0.65rem', borderRadius: '99px',
                }}>
                  {meta.label}
                </div>
              )}

              {/* Gradient Header */}
              <div style={{ background: meta.gradient, padding: '2rem 2rem 1.5rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '14px',
                  background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 14px ${meta.glow}`, marginBottom: '1.25rem',
                }}>
                  <PlanIcon size={22} style={{ color: meta.accentColor }} />
                </div>

                <h3 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '0.5rem' }}>
                  {plan.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: meta.accentColor, lineHeight: 1, fontFamily: 'serif' }}>
                    {price}
                  </span>
                  {plan.priceMonthly > 0 && (
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>/month</span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '1.5rem 2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Max Entries Chip */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: meta.accentColor + '12', border: `1px solid ${meta.accentColor}22`,
                  color: meta.accentColor, borderRadius: '10px', padding: '0.5rem 0.9rem',
                  fontSize: '0.82rem', fontWeight: 700,
                }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>{plan.maxEntries}</span>
                  portfolio entries included
                </div>

                {/* Features */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted-foreground)', marginBottom: '0.85rem' }}>
                    What's included
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', listStyle: 'none' }}>
                    {plan.features.map((f, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--color-foreground)', lineHeight: 1.4 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                          background: meta.accentColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <CheckCircle size={11} style={{ color: meta.accentColor }} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                  <button
                    onClick={() => { setEditingPlan(plan); setIsCreating(false); }}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                      padding: '0.6rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700,
                      background: meta.accentColor + '12', color: meta.accentColor,
                      border: `1px solid ${meta.accentColor}22`, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = meta.accentColor + '22')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = meta.accentColor + '12')}
                  >
                    <Edit2 size={13} /> Edit Plan
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id, plan.name)}
                    style={{
                      padding: '0.6rem 0.8rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700,
                      background: '#fef2f2', color: 'var(--color-danger)',
                      border: '1px solid #fca5a5', cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#fef2f2')}
                    title="Delete Plan"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Modal */}
      {(isCreating || editingPlan) && (
        <div
          className="modal-backdrop"
          onClick={(e) => { if (e.target === e.currentTarget) { setIsCreating(false); setEditingPlan(null); } }}
        >
          <div className="modal-box" style={{ maxWidth: '540px', padding: '0', overflow: 'hidden' }}>

            {/* Modal Header */}
            <div style={{ padding: '1.75rem 2rem 1.25rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {isCreating ? '✦ Create New Plan' : `Edit "${editingPlan?.name}" Plan`}
                </h2>
                <button
                  onClick={() => { setIsCreating(false); setEditingPlan(null); }}
                  style={{ padding: '0.4rem', background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '50%', cursor: 'pointer', color: 'var(--color-muted-foreground)', display: 'flex' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={onSave} style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              <div>
                <label className="field-label">Plan Name</label>
                <input name="name" required defaultValue={editingPlan?.name} className="field" placeholder="e.g. Elite, Pro, Basic" style={{ marginTop: '0.4rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label className="field-label">Monthly Price (cents)</label>
                  <input name="priceMonthly" type="number" min="0" required defaultValue={editingPlan?.priceMonthly} className="field" placeholder="0 = Free" style={{ marginTop: '0.4rem' }} />
                  <p style={{ fontSize: '0.73rem', color: 'var(--color-muted-foreground)', marginTop: '0.4rem' }}>Use 0 for Free plans</p>
                </div>
                <div>
                  <label className="field-label">Max Portfolio Entries</label>
                  <input name="maxEntries" type="number" min="1" required defaultValue={editingPlan?.maxEntries} className="field" placeholder="e.g. 50" style={{ marginTop: '0.4rem' }} />
                </div>
              </div>
              <div>
                <label className="field-label">Features</label>
                <textarea
                  name="features"
                  required
                  rows={4}
                  defaultValue={(editingPlan?.features || []).join(', ')}
                  className="field"
                  placeholder="Verified badge, Priority search, Analytics dashboard"
                  style={{ marginTop: '0.4rem', resize: 'vertical' }}
                />
                <p style={{ fontSize: '0.73rem', color: 'var(--color-muted-foreground)', marginTop: '0.4rem' }}>Separate features with a comma</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                <button type="button" onClick={() => { setIsCreating(false); setEditingPlan(null); }} className="btn-outline" style={{ padding: '0.75rem 1.4rem', borderRadius: '10px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.4rem', borderRadius: '10px' }}>
                  <Sparkles size={15} /> {isCreating ? 'Create Plan' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
