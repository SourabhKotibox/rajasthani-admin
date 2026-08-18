import { useAppDispatch, useAppSelector } from '@/store';
import { api } from '@/api/client';
import {
  CheckCircle2, Zap, Star, Crown, ArrowRight,
  Shield, Lock, RefreshCw, Sparkles, Infinity,
} from 'lucide-react';
import { useState } from 'react';
import type { SubscriptionPlan } from '@/store';

/* ─── plan visual metadata ─── */
const PLAN_META: Record<string, {
  icon: typeof Zap;
  accentColor: string;
  bgGradient: string;
  recommended?: boolean;
  badge?: string;
}> = {
  Starter: {
    icon: Zap,
    accentColor: '#1a4a7a',
    bgGradient: 'linear-gradient(145deg,#e8f0fe 0%,#f0f4ff 100%)',
  },
  Pro: {
    icon: Star,
    accentColor: '#FA931A',
    bgGradient: 'linear-gradient(145deg,#FDD9AB 0%,#FFF3E6 100%)',
    recommended: true,
    badge: 'Most Popular',
  },
  Elite: {
    icon: Crown,
    accentColor: '#5a3e9a',
    bgGradient: 'linear-gradient(145deg,#ece3ff 0%,#f5f0ff 100%)',
    badge: 'Best Value',
  },
};
const DEFAULT_META = { icon: Sparkles, accentColor: 'var(--color-primary)', bgGradient: 'linear-gradient(145deg,#FFF3E6,#fff)', recommended: false };

/* ─── feature rows for comparison table ─── */
const FEATURE_TABLE = [
  { label: 'Portfolio Entries', key: 'maxEntries' as const },
  { label: 'Public Profile', all: true },
  { label: 'Casting Applications', all: true },
  { label: 'Featured Eligibility', starter: false, pro: true, elite: true },
  { label: 'Priority Casting', starter: false, pro: true, elite: true },
  { label: 'Dedicated Support', starter: false, pro: false, elite: true },
];

function TierBubble({ value }: { value: string | number | boolean }) {
  if (typeof value === 'boolean') {
    return value
      ? <CheckCircle2 size={18} style={{ color: '#2D5016' }} />
      : <span style={{ display: 'inline-block', width: 18, height: 2, background: 'var(--color-border)', borderRadius: 2, marginTop: 8 }} />;
  }
  return <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-foreground)' }}>{value}</span>;
}

export default function Subscription() {
  const dispatch = useAppDispatch();
  const plans = useAppSelector((s) => s.plans.items);
  const user = useAppSelector((s) => s.auth.user);
  const [activePlanId, setActivePlanId] = useState(
    plans.find((p) => PLAN_META[p.name]?.recommended)?.id ?? plans[1]?.id ?? plans[0]?.id,
  );
  const [showTable, setShowTable] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  if (!plans.length) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--color-muted-foreground)' }}>
        No subscription plans available at this time.
      </div>
    );
  }

  const activePlan = plans.find((p) => p.id === activePlanId) ?? plans[0];

  const handleSubscribe = async () => {
    if (!activePlan || subscribing) return;
    setSubscribing(true);
    try {
      await api.subscribeToPlan(activePlan.id);
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  /* helper — per-plan feature value for comparison table */
  const getFeatureVal = (feat: (typeof FEATURE_TABLE)[number], plan: typeof plans[number], idx: number) => {
    if (feat.key === 'maxEntries') return `${plan.maxEntries === 9999 ? '∞' : plan.maxEntries}`;
    if (feat.all) return true;
    if (idx === 0) return feat.starter ?? false;
    if (idx === 1) return feat.pro ?? false;
    return feat.elite ?? false;
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '6rem' }}>

      {/* ════════════════════════════════════
          HERO HEADER
      ════════════════════════════════════ */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(155deg, #1C1917 0%, #2c1f08 55%, #3b2a0a 100%)',
        borderRadius: '24px',
        padding: '4rem 2.5rem',
        textAlign: 'center',
        marginBottom: '3.5rem',
        overflow: 'hidden',
      }}>
        {/* Ambient blobs */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,200,66,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,200,66,0.10) 0%,transparent 70%)', pointerEvents: 'none' }} />

        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'rgba(245,200,66,0.12)', border: '1px solid rgba(245,200,66,0.3)',
          borderRadius: '99px', padding: '0.3rem 1rem', marginBottom: '1.5rem',
          color: '#F5C842', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <Sparkles size={12} /> Talent Subscription
        </div>

        <h1 className="font-serif" style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 800, color: '#fff',
          lineHeight: 1.1, letterSpacing: '-0.02em',
          marginBottom: '1rem',
        }}>
          Elevate Your Career
        </h1>
        <p style={{
          fontSize: '1rem', color: 'rgba(255,255,255,0.6)',
          maxWidth: '520px', margin: '0 auto 2.5rem',
          lineHeight: 1.7,
        }}>
          Unlock priority visibility, unlimited portfolio entries and direct access to casting directors across India.
        </p>

        {/* Platform stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px', maxWidth: '540px', margin: '0 auto',
          overflow: 'hidden',
        }}>
          {[['200+', 'Active talents'], ['50+', 'Casting calls'], ['140+', 'Studios'], ['98%', 'Match rate']].map(([val, lbl], i, arr) => (
            <div key={lbl} style={{
              flex: 1, minWidth: '100px', padding: '1.25rem 1rem', textAlign: 'center',
              borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#F5C842', lineHeight: 1, fontFamily: 'serif' }}>{val}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════
          PLAN CARDS
      ════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${plans.length}, 1fr)`,
        gap: '1.25rem',
        alignItems: 'start',
        marginBottom: '2.5rem',
      }}>
        {plans.map((plan, i) => {
          const meta = PLAN_META[plan.name] ?? DEFAULT_META;
          const Icon = meta.icon;
          const isActive = activePlanId === plan.id;
          const price = plan.priceMonthly;
          const displayPrice = price === 0 ? 'Free' : `₹ ${price.toLocaleString()}`;

          return (
            <div
              key={plan.id}
              className={`animate-slide-up stagger-${i + 1}`}
              onClick={() => setActivePlanId(plan.id)}
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'var(--color-card)',
                border: isActive
                  ? `2px solid ${meta.accentColor}`
                  : '1.5px solid var(--color-border)',
                boxShadow: isActive
                  ? `0 16px 48px ${meta.accentColor}28, 0 4px 16px rgba(0,0,0,0.06)`
                  : '0 2px 12px rgba(0,0,0,0.04)',
                transform: isActive ? 'translateY(-6px)' : 'translateY(0)',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Popular / Best Value badge */}
              {meta.badge && (
                <div style={{
                  position: 'absolute', top: '1.1rem', right: '1.1rem',
                  background: meta.accentColor, color: '#fff',
                  fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em',
                  textTransform: 'uppercase', padding: '0.22rem 0.65rem',
                  borderRadius: '99px',
                  zIndex: 2,
                }}>
                  {meta.badge}
                </div>
              )}

              {/* Active top bar */}
              {isActive && (
                <div style={{
                  height: '4px',
                  background: `linear-gradient(to right, ${meta.accentColor}, ${meta.accentColor}88)`,
                }} />
              )}

              {/* Gradient header zone */}
              <div style={{ background: meta.bgGradient, padding: '1.75rem 1.75rem 1.5rem' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '13px',
                  background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 12px ${meta.accentColor}22`,
                  marginBottom: '1.25rem',
                }}>
                  <Icon size={20} style={{ color: meta.accentColor }} />
                </div>

                <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '0.85rem' }}>
                  {plan.name}
                </h2>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', flexWrap: 'wrap' }}>
                  {price === 0 ? (
                    <span style={{ fontSize: '2.4rem', fontWeight: 900, color: meta.accentColor, fontFamily: 'serif', lineHeight: 1 }}>Free</span>
                  ) : (
                    <>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-muted-foreground)', alignSelf: 'flex-start', marginTop: '0.4rem' }}>₹</span>
                      <span style={{ fontSize: '2.4rem', fontWeight: 900, color: meta.accentColor, fontFamily: 'serif', lineHeight: 1 }}>
                        {(price).toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>/mo</span>
                    </>
                  )}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '1.5rem 1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Entries chip */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                  background: `${meta.accentColor}12`, border: `1px solid ${meta.accentColor}22`,
                  color: meta.accentColor, borderRadius: '8px', padding: '0.45rem 0.9rem',
                  fontSize: '0.8rem', fontWeight: 700,
                }}>
                  {plan.maxEntries >= 9999
                    ? <><Infinity size={14} /> Unlimited entries</>
                    : <><span style={{ fontSize: '1.05rem', fontWeight: 900 }}>{plan.maxEntries}</span> portfolio entries</>
                  }
                </div>

                {/* Features */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem', flex: 1 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--color-foreground)', lineHeight: 1.45 }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                        background: `${meta.accentColor}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <CheckCircle2 size={11} style={{ color: meta.accentColor }} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={(e) => { e.stopPropagation(); setActivePlanId(plan.id); }}
                  disabled={isActive}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    cursor: isActive ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    border: 'none',
                    background: isActive ? meta.accentColor : `${meta.accentColor}12`,
                    color: isActive ? '#fff' : meta.accentColor,
                    letterSpacing: '0.01em',
                  }}
                >
                  {isActive ? (
                    <><CheckCircle2 size={15} /> Current Plan</>
                  ) : (
                    <>Get {plan.name} <ArrowRight size={14} /></>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════
          COMPARE PLANS TOGGLE
      ════════════════════════════════════ */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setShowTable(!showTable)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-primary)', fontSize: '0.875rem',
            fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            textDecoration: 'underline', textUnderlineOffset: '3px',
            padding: '0.5rem 1rem',
          }}
        >
          {showTable ? '▲ Hide comparison' : '▼ Compare all plans'}
        </button>
      </div>

      {/* Comparison Table */}
      {showTable && (
        <div className="animate-slide-down" style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '3.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: `2fr ${plans.map(() => '1fr').join(' ')}`, background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Feature
            </div>
            {plans.map((plan) => {
              const meta = PLAN_META[plan.name] ?? DEFAULT_META;
              return (
                <div key={plan.id} style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: meta.accentColor }}>{plan.name}</div>
                </div>
              );
            })}
          </div>

          {/* Table rows */}
          {FEATURE_TABLE.map((feat, ri) => (
            <div
              key={feat.label}
              style={{
                display: 'grid',
                gridTemplateColumns: `2fr ${plans.map(() => '1fr').join(' ')}`,
                borderBottom: ri < FEATURE_TABLE.length - 1 ? '1px solid var(--color-border)' : 'none',
                background: ri % 2 === 0 ? 'transparent' : 'var(--color-surface)',
              }}
            >
              <div style={{ padding: '1rem 1.5rem', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                {feat.label}
              </div>
              {plans.map((plan, pi) => (
                <div key={plan.id} style={{ padding: '1rem 0.75rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TierBubble value={getFeatureVal(feat, plan, pi)} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ════════════════════════════════════
          TRUST STRIP
      ════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '3rem',
      }}>
        {[
          { icon: Shield, title: 'Secure Payments', desc: 'Processed via Razorpay with 256-bit encryption.', color: '#2D5016', bg: '#EEF5E8' },
          { icon: RefreshCw, title: 'Cancel Anytime', desc: 'No lock-in. Downgrade or cancel at any point.', color: '#1a4a7a', bg: '#E8F0FA' },
          { icon: Lock, title: 'Privacy First', desc: 'Your data is never sold or shared without consent.', color: '#5a3e9a', bg: '#f5f0ff' },
        ].map(({ icon: Icon, title, desc, color, bg }) => (
          <div key={title} style={{
            display: 'flex', gap: '1rem', alignItems: 'flex-start',
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '1.4rem 1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-foreground)', marginBottom: '0.25rem' }}>{title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', lineHeight: 1.55 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════
          ACTIVE PLAN SUMMARY BANNER
      ════════════════════════════════════ */}
      {activePlan && (() => {
        const meta = PLAN_META[activePlan.name] ?? DEFAULT_META;
        const Icon = meta.icon;
        return (
          <div style={{
            background: `linear-gradient(135deg, ${meta.accentColor}12, ${meta.accentColor}06)`,
            border: `1.5px solid ${meta.accentColor}30`,
            borderRadius: '20px',
            padding: '2rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '16px', background: meta.bgGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 14px ${meta.accentColor}22` }}>
                <Icon size={24} style={{ color: meta.accentColor }} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: meta.accentColor, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                  Selected Plan
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'serif' }}>
                  {activePlan.name}
                  {' '}
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>
                    — {activePlan.priceMonthly === 0 ? 'Free forever' : `₹ ${activePlan.priceMonthly.toLocaleString()}/month`}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleSubscribe}
              disabled={subscribing || subscribed}
              style={{
                padding: '0.85rem 2rem',
                background: subscribed ? '#2D5016' : meta.accentColor,
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: subscribing || subscribed ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                boxShadow: `0 4px 14px ${meta.accentColor}40`,
              }}
            >
              {subscribing ? 'Processing…' : subscribed ? <><CheckCircle2 size={16} /> Subscribed</> : <>Continue with {activePlan.name} <ArrowRight size={16} /></>}
            </button>
          </div>
        );
      })()}
    </div>
  );
}
