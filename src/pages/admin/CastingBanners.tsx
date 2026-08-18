import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addCastingBanner, updateCastingBanner, deleteCastingBanner } from '@/store';
import { api } from '@/api/client';
import { Plus, Trash2, Edit2, Eye, EyeOff, Save, X } from 'lucide-react';

export default function AdminCastingBanners() {
  const castingBanners = useAppSelector((s) => s.banners.castingBanners || []);
  const casting = useAppSelector((s) => s.data.casting);
  const dispatch = useAppDispatch();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    ctaText: '',
    castingCallId: '',
  });

  const handleAdd = async () => {
    try {
      const result = await api.addCastingBanner(formData) as any;
      dispatch(addCastingBanner(result));
      setShowForm(false);
      setFormData({ title: '', subtitle: '', imageUrl: '', ctaText: '', castingCallId: '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add banner');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const result = await api.updateCastingBanner(id, formData) as any;
      dispatch(updateCastingBanner({ id, data: result }));
      setEditingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this banner?')) {
      try {
        await api.deleteCastingBanner(id);
        dispatch(deleteCastingBanner(id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete banner');
      }
    }
  };

  const toggleVisibility = async (id: string, currentVisible: boolean | undefined) => {
    try {
      const result = await api.updateCastingBanner(id, { visible: !currentVisible }) as any;
      dispatch(updateCastingBanner({ id, data: result }));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update visibility');
    }
  };

  const startEdit = (banner: any) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      ctaText: banner.ctaText,
      castingCallId: banner.castingCallId || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', subtitle: '', imageUrl: '', ctaText: '', castingCallId: '' });
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Casting Banners</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem' }}>
            Manage featured banners for the homepage casting section
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Banner</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="field-label">Title</label>
              <input
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Banner title"
                className="field"
              />
            </div>
            <div>
              <label className="field-label">CTA Text</label>
              <input
                value={formData.ctaText}
                onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                placeholder="Button text"
                className="field"
              />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label className="field-label">Subtitle</label>
            <textarea
              value={formData.subtitle}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Banner description"
              rows={2}
              className="field"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="field-label">Image URL</label>
              <input
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
                className="field"
              />
            </div>
            <div>
              <label className="field-label">Link to Casting Call</label>
              <select
                value={formData.castingCallId}
                onChange={e => setFormData({ ...formData, castingCallId: e.target.value })}
                className="field"
              >
                <option value="">Select casting call...</option>
                {casting.map(c => (
                  <option key={String(c.id)} value={String(c.id)}>{c.projectTitle}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleAdd} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={14} /> Save Banner
            </button>
            <button onClick={() => setShowForm(false)} className="btn-outline">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Banners List */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {castingBanners.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted-foreground)', background: 'var(--color-card)', borderRadius: '14px' }}>
            No casting banners yet. Click "Add Banner" to create one.
          </div>
        )}
        {castingBanners.map((banner, index) => (
          <div key={banner.id} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden' }}>
            {editingId === banner.id ? (
              /* Edit Form */
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Edit Banner</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="field-label">Title</label>
                    <input
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="field-label">CTA Text</label>
                    <input
                      value={formData.ctaText}
                      onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                      className="field"
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="field-label">Subtitle</label>
                  <textarea
                    value={formData.subtitle}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    rows={2}
                    className="field"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="field-label">Image URL</label>
                    <input
                      value={formData.imageUrl}
                      onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="field-label">Link to Casting Call</label>
                    <select
                      value={formData.castingCallId}
                      onChange={e => setFormData({ ...formData, castingCallId: e.target.value })}
                      className="field"
                    >
                      <option value="">Select casting call...</option>
                      {casting.map(c => (
                        <option key={String(c.id)} value={String(c.id)}>{c.projectTitle}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => handleUpdate(banner.id)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Save size={14} /> Save Changes
                  </button>
                  <button onClick={cancelEdit} className="btn-outline">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Display View */
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ width: '200px', height: '120px', flexShrink: 0 }}>
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
                <div style={{ flex: 1, padding: '1rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{banner.title}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => toggleVisibility(banner.id, banner.visible)}
                        className="btn-ghost"
                        style={{ padding: '0.35rem', color: banner.visible ? 'var(--color-primary)' : 'var(--color-muted-foreground)' }}
                        title={banner.visible ? 'Hide' : 'Show'}
                      >
                        {banner.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button
                        onClick={() => startEdit(banner)}
                        className="btn-ghost"
                        style={{ padding: '0.35rem' }}
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="btn-ghost"
                        style={{ padding: '0.35rem', color: 'var(--color-danger)' }}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginBottom: '0.5rem' }}>
                    {banner.subtitle}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-muted-foreground)' }}>
                    <span>CTA: {banner.ctaText}</span>
                    {banner.castingCallId && (
                      <span>Linked to: {casting.find(c => String(c.id) === banner.castingCallId)?.projectTitle || 'Unknown'}</span>
                    )}
                  </div>
                  {!banner.visible && (
                    <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-muted-foreground)', background: 'var(--color-surface)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  Hidden
                </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
