import { FormEvent, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector, addEvent, adminUpdateEvent, deleteEvent } from '@/store';
import { EVENT_TYPES, type EventItem } from '@/data/mock';
import { api } from '@/api/client';
import {
  Plus, X, LayoutPanelLeft, Calendar, DollarSign, MapPin, Globe,
  Users, Edit2, Trash2, Save, Eye, EyeOff, Upload,
} from 'lucide-react';

const PROJECT_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'Movie', label: 'Movie' },
  { value: 'TVSeries', label: 'TV Series' },
  { value: 'MusicVideo', label: 'Music Video' },
  { value: 'ShortDrama', label: 'Short Drama' },
];

const EVENT_TYPE_OPTIONS: string[] = [...EVENT_TYPES, 'Other'];

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1511765224389-37f0e75cf1eb?auto=format&fit=crop&q=80&w=1200';

function EventForm({
  initial,
  onSubmit,
  onCancel,
  label,
}: {
  initial?: Partial<EventItem>;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  label: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverImage, setCoverImage] = useState(initial?.imageUrl as string || '');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { url } = await api.upload(fd);
      setCoverImage(url);
    } catch {
      alert('Image upload failed');
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = e.currentTarget;
    const form = new FormData(fd);
    const data: Record<string, unknown> = {
      title: String(form.get('title')),
      eventType: String(form.get('eventType')),
      projectType: String(form.get('projectType')),
      productionHouse: String(form.get('house')),
      roles: String(form.get('roles')).split(',').map((s) => s.trim()).filter(Boolean),
      rolesDescription: String(form.get('rolesDesc')),
      description: String(form.get('description')),
      eligibilityCriteria: String(form.get('eligibility')),
      applicationFee: Number(form.get('fee') || 0),
      deadline: String(form.get('deadline')),
      eventDate: String(form.get('eventDate')),
      location: String(form.get('location')),
      imageUrl: String(form.get('imageUrl') || coverImage || DEFAULT_IMG),
      status: String(form.get('status')) as 'active' | 'inactive',
      visible: (fd.visible as HTMLInputElement).checked,
      order: Number(form.get('order') || 0),
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="field-label">Event Title</label>
          <input name="title" defaultValue={initial?.title} required placeholder="e.g. Jaipur Fashion Week" className="field" />
        </div>
        <div>
          <label className="field-label">Event Type</label>
          <select name="eventType" defaultValue={initial?.eventType || 'Fashion Show'} className="field">
            {EVENT_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="field-label">Format / Project Type</label>
          <select name="projectType" defaultValue={initial?.projectType} className="field">
            {PROJECT_TYPE_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Production House</label>
          <input name="house" defaultValue={initial?.productionHouse} required placeholder="Company name" className="field" />
        </div>
      </div>

      <div>
        <label className="field-label">Roles Needed (comma-separated)</label>
        <input name="roles" defaultValue={initial?.roles?.join(', ')} required placeholder="Runway Model, Extra, Crew" className="field" />
      </div>

      <div>
        <label className="field-label">Roles Description</label>
        <textarea name="rolesDesc" defaultValue={initial?.rolesDescription} required rows={2} placeholder="What the event is about and who you are looking for…" className="field" />
      </div>

      <div>
        <label className="field-label">Event Description</label>
        <textarea name="description" defaultValue={initial?.description} rows={3} placeholder="Full description of the event…" className="field" />
      </div>

      <div>
        <label className="field-label">Eligibility Criteria</label>
        <input name="eligibility" defaultValue={initial?.eligibilityCriteria} required placeholder="e.g. Age 18-35, 5'5+ for runway" className="field" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="field-label">Event Date</label>
          <input name="eventDate" type="date" defaultValue={initial?.eventDate} className="field" />
        </div>
        <div>
          <label className="field-label">Location</label>
          <input name="location" defaultValue={initial?.location} placeholder="City, Country" className="field" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="field-label">Application Fee (₹)</label>
          <input name="fee" type="number" min="0" defaultValue={initial?.applicationFee || 0} className="field" />
        </div>
        <div>
          <label className="field-label">Deadline</label>
          <input name="deadline" type="date" defaultValue={initial?.deadline} required className="field" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="field-label">Status</label>
          <select name="status" defaultValue={initial?.status || 'active'} className="field">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="field-label">Slider Order</label>
          <input name="order" type="number" min="0" defaultValue={initial?.order || 0} className="field" />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" name="visible" id="visible" defaultChecked={initial?.visible !== false} />
        <label htmlFor="visible" className="field-label" style={{ marginBottom: 0 }}>Visible on home page</label>
      </div>

      <div>
        <label className="field-label">Image URL</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input name="imageUrl" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Optional" className="field" style={{ flex: 1 }} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-outline btn-sm" style={{ flexShrink: 0 }}>
            <Upload size={14} /> Upload
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button type="button" onClick={onCancel} className="btn-outline btn-sm">Cancel</button>
        <button type="submit" className="btn-primary btn-sm"><Save size={14} /> {label}</button>
      </div>
    </form>
  );
}

export default function AdminEvents() {
  const events = useAppSelector((s) => s.data.events);
  const dispatch = useAppDispatch();
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data?: Partial<EventItem> } | null>(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => setModal({ mode: 'add' });
  const openEdit = (e: EventItem) => setModal({ mode: 'edit', data: e });
  const closeModal = () => setModal(null);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      if (modal!.mode === 'add') {
        const created = await api.createEvent(data as Record<string, unknown>) as EventItem;
        dispatch(addEvent(created));
      } else {
        const e = modal!.data as EventItem;
        const updated = await api.updateEvent(e.id, data as Record<string, unknown>) as EventItem;
        dispatch(adminUpdateEvent(updated));
      }
      closeModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e: EventItem) => {
    if (confirm(`Delete event "${e.title}"? This cannot be undone.`)) {
      try {
        await api.deleteEvent(e.id);
        dispatch(deleteEvent(e.id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete event');
      }
    }
  };

  const toggleVisible = async (e: EventItem) => {
    try {
      const updated = await api.updateEvent(e.id, { visible: !e.visible }) as EventItem;
      dispatch(adminUpdateEvent(updated));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update visibility');
    }
  };

  const sorted = [...events].sort((a, b) => {
    const oa = a.order ?? 0, ob = b.order ?? 0;
    if (oa !== ob) return oa - ob;
    return String(a.id).localeCompare(String(b.id));
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Events &amp; Sliders</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)', marginTop: '0.25rem' }}>
            Manage home page event sliders (fashion shows, talent shows, etc.). Each visible, active event
            appears as a card with a <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Participate</span> button.
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Event
        </button>
      </div>

      {sorted.length === 0 ? (
        <div style={{ background: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: '14px', padding: '4rem 1.25rem', textAlign: 'center' }}>
          <LayoutPanelLeft size={40} style={{ margin: '0 auto 1rem', opacity: 0.35, color: 'var(--color-muted-foreground)' }} />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>No events yet</h2>
          <button onClick={openAdd} className="btn-outline btn-sm" style={{ marginTop: '1rem' }}>
            Create the first event
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sorted.map((e, i) => (
            <div
              key={String(e.id)}
              className={`rca-card animate-slide-up stagger-${Math.min(i + 1, 12)}`}
              style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}
            >
              <div style={{ width: '130px', height: '90px', borderRadius: '8px', background: 'var(--color-muted)', overflow: 'hidden', flexShrink: 0 }}>
                <img src={e.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <h3 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700 }}>{e.title}</h3>
                  <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>{e.eventType}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-foreground)', marginBottom: '0.5rem' }}>{e.productionHouse}</p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-foreground)', opacity: 0.85, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={13} /> {e.eventDate || 'TBA'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={13} /> {e.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><DollarSign size={13} /> {e.applicationFee > 0 ? `₹ ${e.applicationFee}` : 'Free'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Status</div>
                  <span className={`badge ${e.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                    {e.status}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <button onClick={() => toggleVisible(e)} className="btn-ghost" style={{ padding: '0.35rem' }} title={e.visible ? 'Hide' : 'Show'}>
                    {e.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => openEdit(e)} className="btn-ghost" style={{ padding: '0.35rem' }} title="Edit">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => handleDelete(e)} className="btn-ghost" style={{ padding: '0.35rem', color: 'var(--color-danger)' }} title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-backdrop" onClick={onBackdropClose}>
          <div
            className="modal-box"
            style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid var(--color-border)',
            }}>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {modal.mode === 'add' ? 'Add New Event' : 'Edit Event'}
              </h3>
              <button onClick={closeModal} className="btn-ghost" style={{ padding: '0.25rem' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              <EventForm
                initial={modal.mode === 'edit' ? modal.data : undefined}
                label={modal.mode === 'add' ? 'Create Event' : 'Save Changes'}
                onSubmit={handleSubmit}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function onBackdropClose(e: React.MouseEvent) {
    if (e.target === e.currentTarget) closeModal();
  }
}
