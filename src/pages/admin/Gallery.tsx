import { useEffect, useState, useRef } from 'react';
import { api } from '@/api/client';
import { Plus, Edit2, Trash2, Image as ImageIcon, ChevronDown, Camera, LayoutTemplate } from 'lucide-react';

export default function AdminGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Filters
  const [filterYear, setFilterYear] = useState<string>('All');
  const [filterEvent, setFilterEvent] = useState<string>('All');

  useEffect(() => { loadItems(); }, []);
  const loadItems = async () => {
    setLoading(true);
    try { setItems(await api.getGallery()); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      if (editingId === 'new') await api.createGalleryItem(formData);
      else await api.updateGalleryItem(editingId!, formData);
      setEditingId(null);
      loadItems();
    } catch (e) { alert('Save failed'); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    try {
      const { url } = await api.upload(fd);
      setFormData({ ...formData, imageUrl: url });
    } catch { alert('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try { await api.deleteGalleryItem(id); loadItems(); } catch (e) { alert('Delete failed'); }
  };

  const availableYears = Array.from(new Set(items.map(i => i.year).filter(Boolean))).sort().reverse() as string[];
  const availableEvents = Array.from(new Set(items.map(i => i.event).filter(Boolean))).sort() as string[];

  const filteredItems = items.filter(item => {
    if (filterYear !== 'All' && item.year !== filterYear) return false;
    if (filterEvent !== 'All' && item.event !== filterEvent) return false;
    return true;
  });

  // Group filtered items by event for the list view
  const groupedByEvent = new Map<string, any[]>();
  filteredItems.forEach(item => {
    const ev = item.event || 'Uncategorized';
    if (!groupedByEvent.has(ev)) groupedByEvent.set(ev, []);
    groupedByEvent.get(ev)!.push(item);
  });

  const generateYearsList = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({length: 10}, (_, i) => (currentYear - i).toString());
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'var(--color-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h1 className="font-serif" style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Gallery Management
          </h1>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-muted-foreground)', marginLeft: '55px' }}>
          Manage event albums and photos. Group photos by event and year.
        </p>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end',
        marginBottom: '1.75rem', padding: '1.25rem',
        background: 'var(--color-card)', border: '1px solid var(--color-border)',
        borderRadius: '14px',
      }}>
        <div style={{ flex: 1, minWidth: '160px' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Year</label>
          <div style={{ position: 'relative' }}>
            <select className="field" style={{ width: '100%', appearance: 'none' as const, paddingRight: '2rem' }} value={filterYear} onChange={e => setFilterYear(e.target.value)}>
              <option value="All">All Years</option>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '160px' }}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Event</label>
          <div style={{ position: 'relative' }}>
            <select className="field" style={{ width: '100%', appearance: 'none' as const, paddingRight: '2rem' }} value={filterEvent} onChange={e => setFilterEvent(e.target.value)}>
              <option value="All">All Events</option>
              {availableEvents.map(ev => <option key={ev} value={ev}>{ev}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: 'auto' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-muted-foreground)', fontWeight: 600 }}>
            {filteredItems.length} photo{filteredItems.length !== 1 ? 's' : ''}
          </span>
          <button
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            onClick={() => {
              setEditingId('new');
              setFormData({
                title: '', event: filterEvent !== 'All' ? filterEvent : '',
                description: '', imageUrl: '',
                year: filterYear !== 'All' ? filterYear : new Date().getFullYear().toString(),
              });
            }}
          >
            <Plus size={14} /> Add Photo
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-muted-foreground)' }}>Loading gallery...</div>
      ) : filteredItems.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem 0', color: 'var(--color-muted-foreground)',
          background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px',
        }}>
          No photos found matching the filters.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {Array.from(groupedByEvent.entries()).map(([eventName, eventItems]) => (
            <div key={eventName} style={{
              background: 'var(--color-card)', border: '1px solid var(--color-border)',
              borderRadius: '16px', overflow: 'hidden',
            }}>
              {/* Event Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem', background: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '10px',
                    background: 'var(--color-primary-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-primary)',
                  }}>
                    <ImageIcon size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-foreground)' }}>{eventName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted-foreground)' }}>
                      {eventItems[0]?.year} &bull; {eventItems.length} photo{eventItems.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Photos grid inside event */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', padding: '1.25rem' }}>
                {eventItems.map((item: any) => (
                  <div key={item.id} style={{
                    border: '1px solid var(--color-border)', borderRadius: '10px',
                    overflow: 'hidden', background: 'var(--color-surface)',
                    transition: 'box-shadow 0.2s',
                  }}>
                    <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--color-surface)' }}>
                      <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                        {item.title}
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          className="btn-outline"
                          style={{ flex: 1, fontSize: '0.72rem', padding: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                          onClick={() => { setEditingId(item.id); setFormData(item); }}
                        >
                          <Edit2 size={11} /> Edit
                        </button>
                        <button
                          className="btn-outline"
                          style={{ flex: 1, fontSize: '0.72rem', padding: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: '#dc2626', borderColor: '#fecaca' }}
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editingId && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          overflowY: 'auto',
        }}>
          <div style={{
            background: 'var(--color-card)', border: '1px solid var(--color-border)',
            borderRadius: '16px', width: '100%', maxWidth: '520px',
            padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--color-foreground)' }}>
              {editingId === 'new' ? 'Add Photo to Gallery' : 'Edit Photo'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Year & Event row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Year</label>
                  <div style={{ position: 'relative' }}>
                    <select className="field" style={{ width: '100%', appearance: 'none' as const, paddingRight: '2rem' }} value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})}>
                      <option value="" disabled>Select Year</option>
                      {generateYearsList().map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Event Name</label>
                  <input className="field" style={{ width: '100%' }} placeholder="e.g. Annual Awards" value={formData.event || ''} onChange={e => setFormData({...formData, event: e.target.value})} list="event-suggestions" />
                  <datalist id="event-suggestions">
                    {availableEvents.map(ev => <option key={ev} value={ev} />)}
                  </datalist>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Photo Title / Caption</label>
                <input className="field" style={{ width: '100%' }} placeholder="e.g. Best Actor Award Presentation" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>Description (Optional)</label>
                <textarea className="field" style={{ width: '100%', resize: 'vertical' }} rows={2} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>Photo Image</span>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                      padding: '0.3rem 0.65rem', borderRadius: '6px',
                      border: 'none', background: 'var(--color-primary-subtle)',
                      fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                      color: 'var(--color-primary)',
                    }}
                  >
                    <ImageIcon size={12} /> {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </label>
                <input type="file" ref={fileRef} hidden onClick={(e) => { (e.target as any).value = null; }} onChange={handleImageUpload} accept="image/*" />
                <input className="field" style={{ width: '100%', fontSize: '0.8rem' }} placeholder="Or paste image URL directly" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                {formData.imageUrl && (
                  <div style={{ marginTop: '0.75rem', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <img src={formData.imageUrl} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              <button className="btn-outline" onClick={() => setEditingId(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={uploading || !formData.imageUrl || !formData.event}>Save Photo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
