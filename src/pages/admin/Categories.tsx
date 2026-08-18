import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector, updateSubcategoriesState, type SubcategoryEntry } from '@/store';
import { api } from '@/api/client';
import { Plus, Trash2, Save, Tag, CheckCircle2 } from 'lucide-react';

const MAIN_CATS = [
  'Actor', 'Director', 'Producer', 'Cinematographer',
  'Editor', 'Writer', 'Music Video Artist', 'Choreographer', 'Technician',
];

export default function AdminCategories() {
  const dispatch = useAppDispatch();
  const subcategories = useAppSelector((s) => s.subcategories);

  // Local editable state
  const [local, setLocal] = useState<SubcategoryEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSubInputs, setNewSubInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    // Merge store data with all main cats (ensure all cats appear)
    const merged = MAIN_CATS.map((cat) => {
      const existing = subcategories.find((e) => e.category === cat);
      return existing || { category: cat, subs: [] };
    });
    setLocal(merged);
  }, [subcategories]);

  const handleAddSub = (cat: string) => {
    const newSub = (newSubInputs[cat] || '').trim();
    if (!newSub) return;
    setLocal((prev) =>
      prev.map((e) =>
        e.category === cat && !e.subs.includes(newSub)
          ? { ...e, subs: [...e.subs, newSub] }
          : e
      )
    );
    setNewSubInputs((prev) => ({ ...prev, [cat]: '' }));
  };

  const handleRemoveSub = (cat: string, sub: string) => {
    setLocal((prev) =>
      prev.map((e) =>
        e.category === cat ? { ...e, subs: e.subs.filter((s) => s !== sub) } : e
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSubcategories(local);
      dispatch(updateSubcategoriesState(local));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Tag size={20} style={{ color: 'var(--color-primary)' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Category Subcategories</h1>
          </div>
          <p style={{ color: 'var(--color-muted-foreground)', fontSize: '0.9rem' }}>
            Add subcategories for each main category. They appear as filter pills when users click a category in the Talent/Members directory.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save All'}
        </button>
      </div>

      {/* Category cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {local.map((entry) => (
          <div
            key={entry.category}
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Card header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem 1.5rem',
              background: 'var(--color-surface)',
              borderBottom: '1px solid var(--color-border)'
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'var(--color-primary-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-primary)', fontWeight: 800, fontSize: '0.85rem'
              }}>
                {entry.category.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{entry.category}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)' }}>
                  {entry.subs.length} subcategor{entry.subs.length !== 1 ? 'ies' : 'y'}
                </div>
              </div>
            </div>

            {/* Card body */}
            <div style={{ padding: '1.25rem 1.5rem' }}>
              {/* Existing subcategory tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem', minHeight: '36px' }}>
                {entry.subs.length === 0 ? (
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', fontStyle: 'italic' }}>
                    No subcategories yet. Add some below.
                  </span>
                ) : (
                  entry.subs.map((sub) => (
                    <span
                      key={sub}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                        background: 'var(--color-primary-subtle)',
                        border: '1px solid var(--color-primary-tint)',
                        color: 'var(--color-primary)',
                        borderRadius: '99px',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      {sub}
                      <button
                        onClick={() => handleRemoveSub(entry.category, sub)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--color-primary)', display: 'flex', alignItems: 'center',
                          padding: 0, marginLeft: '0.1rem'
                        }}
                        title={`Remove ${sub}`}
                      >
                        <Trash2 size={11} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add new subcategory input */}
              <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '400px' }}>
                <input
                  className="field"
                  style={{ flex: 1 }}
                  placeholder={`Add subcategory for ${entry.category}…`}
                  value={newSubInputs[entry.category] || ''}
                  onChange={(e) => setNewSubInputs((prev) => ({ ...prev, [entry.category]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSub(entry.category)}
                />
                <button
                  className="btn-primary btn-sm"
                  onClick={() => handleAddSub(entry.category)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
