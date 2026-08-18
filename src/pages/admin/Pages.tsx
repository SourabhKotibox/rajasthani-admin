import { users } from '@/data/mock';
import { useAppSelector, useAppDispatch, actionInquiry, setProfileStatus, addCasting, updateCastingStatus } from '@/store';
import { FormEvent, useState } from 'react';
import type { ProjectType } from '@/data/mock';

export function AdminDashboard() {
  const profiles = useAppSelector((s) => s.data.profiles);
  const casting = useAppSelector((s) => s.data.casting);
  const inquiries = useAppSelector((s) => s.data.inquiries);
  const apps = useAppSelector((s) => s.data.applications);
  const cards = [
    { label: 'Users', value: users.length },
    { label: 'Featured', value: profiles.filter((p) => p.isFeatured).length },
    { label: 'Pending', value: profiles.filter((p) => p.status === 'pending').length },
    { label: 'Open casting', value: casting.filter((c) => c.status === 'open').length },
    { label: 'Applications', value: apps.length },
    { label: 'New inquiries', value: inquiries.filter((i) => i.status === 'new').length },
  ];
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-border bg-card p-4">
            <p className="text-xs uppercase text-muted-foreground">{c.label}</p>
            <p className="font-serif text-3xl font-bold mt-2">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminUsers() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Users</h1>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card text-left">
            <tr className="border-b border-border">
              <th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/60">
                <td className="p-3">{u.fullName}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminProfiles() {
  const profiles = useAppSelector((s) => s.data.profiles);
  const dispatch = useAppDispatch();
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Profiles</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {profiles.map((p) => (
          <article key={p.id} className="border border-border bg-card overflow-hidden flex flex-col">
            <div className="aspect-[3/4] bg-muted overflow-hidden">
              <img src={p.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col">
              <p className="font-serif text-lg font-semibold">{p.displayName}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{p.bio}</p>
              <p className="text-xs text-muted-foreground">
                {(p.categories || []).join(' · ')} · {p.status}
                {p.isFeatured ? ' · featured' : ''}
              </p>
              <div className="flex gap-2 flex-wrap pt-2 mt-auto">
                <button onClick={() => dispatch(setProfileStatus({ id: p.id, status: 'approved' }))} className="text-xs border border-border px-2 py-1">Approve</button>
                <button onClick={() => dispatch(setProfileStatus({ id: p.id, status: 'rejected', isFeatured: false }))} className="text-xs border border-border px-2 py-1">Reject</button>
                <button onClick={() => dispatch(setProfileStatus({ id: p.id, status: 'approved', isFeatured: true }))} className="text-xs border border-border px-2 py-1">Feature</button>
                <button onClick={() => dispatch(setProfileStatus({ id: p.id, isFeatured: false }))} className="text-xs border border-border px-2 py-1">Unfeature</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function AdminInquiries() {
  const inquiries = useAppSelector((s) => s.data.inquiries);
  const profiles = useAppSelector((s) => s.data.profiles);
  const dispatch = useAppDispatch();
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-6">Inquiries</h1>
      <ul className="space-y-3">
        {inquiries.map((i) => (
          <li key={i.id} className="border border-border bg-card p-4">
            <p className="font-semibold">{i.subject}</p>
            <p className="text-sm text-muted-foreground">{i.name} · {i.email} · {i.status}</p>
            {i.profileId && <p className="text-sm mt-1">Talent: {profiles.find((p) => p.id === i.profileId)?.displayName}</p>}
            <p className="text-sm mt-2">{i.message}</p>
            {i.status === 'new' && (
              <button onClick={() => dispatch(actionInquiry(i.id))} className="mt-3 text-sm px-3 py-1.5 bg-primary text-primary-foreground">
                Mark details shared
              </button>
            )}
          </li>
        ))}
        {!inquiries.length && <p className="text-muted-foreground">No inquiries yet. Submit one from Contact or a profile.</p>}
      </ul>
    </div>
  );
}

export function AdminCasting() {
  const casting = useAppSelector((s) => s.data.casting);
  const apps = useAppSelector((s) => s.data.applications);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const onCreate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    dispatch(addCasting({
      projectTitle: String(fd.get('title')),
      projectType: String(fd.get('type')) as ProjectType,
      roles: String(fd.get('roles')).split(',').map((r) => r.trim()).filter(Boolean),
      rolesDescription: String(fd.get('desc') || ''),
      eligibilityCriteria: String(fd.get('elig') || ''),
      deadline: String(fd.get('deadline')),
      productionHouse: String(fd.get('house') || ''),
      applicationFee: Number(fd.get('fee') || 0),
      status: 'open',
      imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop',
    }));
    setOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold">Casting Calls</h1>
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-primary text-primary-foreground text-sm">New call</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {casting.map((c) => (
          <article key={c.id} className="border border-border bg-card overflow-hidden flex flex-col">
            <div className="aspect-[16/10] bg-muted overflow-hidden">
              <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col">
              <p className="font-serif text-lg font-semibold">{c.projectTitle}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{c.rolesDescription}</p>
              <p className="text-xs text-muted-foreground">
                {c.projectType} · {c.status} · {apps.filter((a) => a.castingCallId === c.id).length} apps · fee {c.applicationFee}
              </p>
              <button
                onClick={() => dispatch(updateCastingStatus({ id: c.id, status: c.status === 'open' ? 'closed' : 'open' }))}
                className="mt-auto text-xs border border-border px-2 py-1 w-fit"
              >
                {c.status === 'open' ? 'Close' : 'Reopen'}
              </button>
            </div>
          </article>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={onCreate} className="bg-card border border-border p-6 w-full max-w-md space-y-3">
            <h2 className="font-serif text-xl font-bold">New casting call</h2>
            <input name="title" required placeholder="Project title" className="w-full bg-background border border-border px-3 py-2" />
            <select name="type" className="w-full bg-background border border-border px-3 py-2">
              <option value="Movie">Movie</option>
              <option value="TVSeries">TV Series</option>
              <option value="MusicVideo">Music Video</option>
              <option value="ShortDrama">Short Drama</option>
            </select>
            <input name="roles" required placeholder="Roles (comma-separated)" className="w-full bg-background border border-border px-3 py-2" />
            <textarea name="desc" placeholder="Roles description" className="w-full bg-background border border-border px-3 py-2" />
            <textarea name="elig" placeholder="Eligibility" className="w-full bg-background border border-border px-3 py-2" />
            <input name="deadline" type="date" required className="w-full bg-background border border-border px-3 py-2" />
            <input name="house" placeholder="Production house" className="w-full bg-background border border-border px-3 py-2" />
            <input name="fee" type="number" defaultValue={0} placeholder="Fee" className="w-full bg-background border border-border px-3 py-2" />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 border border-border">Cancel</button>
              <button className="px-3 py-2 bg-primary text-primary-foreground">Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
