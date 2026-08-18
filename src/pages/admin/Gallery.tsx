import { useEffect, useState, useRef } from 'react';
import { api } from '@/api/client';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

export default function AdminGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadItems(); }, []);
  const loadItems = async () => { setLoading(true); try { setItems(await api.getGallery()); } finally { setLoading(false); } };

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
    const fd = new FormData(); fd.append('file', file);
    try {
      const { url } = await api.upload(fd);
      setFormData({ ...formData, imageUrl: url });
    } catch { alert('Upload failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try { await api.deleteGalleryItem(id); loadItems(); } catch (e) { alert('Delete failed'); }
  };

  if (loading) return <div>Loading gallery...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery Management</h1>
        <button className="btn-primary flex items-center gap-2" onClick={() => { setEditingId('new'); setFormData({ title: '', description: '', imageUrl: '', year: '' }); }}>
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <div key={item.id} className="border border-border bg-surface p-4 rounded-xl shadow-sm">
            <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover rounded-md mb-4 bg-muted" />
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{item.year}</p>
            <div className="flex gap-2 mt-4">
              <button className="btn-outline flex-1 text-xs" onClick={() => { setEditingId(item.id); setFormData(item); }}><Edit2 size={12} className="inline mr-1" /> Edit</button>
              <button className="btn-outline flex-1 text-xs text-danger border-danger-bg" onClick={() => handleDelete(item.id)}><Trash2 size={12} className="inline mr-1" /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-lg p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editingId === 'new' ? 'Add Item' : 'Edit Item'}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-1 block">Title</label>
                <input className="field" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Year/Date</label>
                <input className="field" value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Description</label>
                <textarea className="field" rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 flex justify-between">
                  Image URL
                  <button type="button" className="text-primary hover:underline flex items-center gap-1" onClick={() => fileRef.current?.click()}>
                    <ImageIcon size={14} /> Upload
                  </button>
                </label>
                <input type="file" ref={fileRef} hidden onChange={handleImageUpload} accept="image/*" />
                <input className="field" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                {formData.imageUrl && <img src={formData.imageUrl} className="mt-2 w-full h-32 object-cover rounded" />}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button className="btn-outline" onClick={() => setEditingId(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
