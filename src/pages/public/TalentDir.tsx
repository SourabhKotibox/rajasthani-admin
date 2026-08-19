import { useMemo, useState } from 'react';
import { useAppSelector } from '@/store';
import { TalentCard } from '@/components/Cards';
import { Search, SlidersHorizontal, Users, ChevronRight } from 'lucide-react';

const CATS = [
  'All', 'Actor', 'Director', 'Producer', 'Cinematographer',
  'Editor', 'Writer', 'Music Video Artist', 'Choreographer', 'Technician',
];

export default function TalentDir() {
  const profiles = useAppSelector((s) =>
    s.data.profiles.filter((p) => p.isFeatured && p.status === 'approved'),
  );
  const subcategoriesData = useAppSelector((s) => s.subcategories);

  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [subCat, setSubCat] = useState('All');

  // Get subcategories for the currently selected main category
  const currentSubcategories = useMemo(() => {
    if (cat === 'All') return [];
    const entry = subcategoriesData.find((e) => e.category === cat);
    return entry?.subs || [];
  }, [cat, subcategoriesData]);

  // Reset subcategory when main category changes
  const handleCatChange = (c: string) => {
    setCat(c);
    setSubCat('All');
  };

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      const matchCat = cat === 'All' || p.categories.includes(cat);
      // Filter by subcategory if one is selected — check skills array
      const matchSub = subCat === 'All' || (p.skills || []).some(
        (s) => s.toLowerCase() === subCat.toLowerCase()
      ) || p.categories.some((c) => c.toLowerCase() === subCat.toLowerCase());
      const hay = `${p.displayName} ${p.bio} ${p.location} ${(p.skills || []).join(' ')}`.toLowerCase();
      return matchCat && matchSub && hay.includes(q.toLowerCase());
    });
  }, [profiles, q, cat, subCat]);

  return (
    <div className="animate-fade-in">

      {/* Page header */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '3rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Users size={14} style={{ color: 'var(--color-primary)' }} />
            <span className="section-eyebrow" style={{ marginBottom: 0 }}>Curated by Rajasthan Cine Association</span>
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '0.5rem' }}>
            Talent/Members Directory
          </h1>
          <p style={{ color: 'var(--color-muted-foreground)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Featured professionals and members hand-picked by the Rajasthan Cine Association team.
          </p>

          {/* Search + Filter row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Search */}
            <div style={{ position: 'relative', maxWidth: '480px' }}>
              <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted-foreground)', pointerEvents: 'none' }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, skills, location…"
                className="field"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Main category pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
              <SlidersHorizontal size={13} style={{ color: 'var(--color-muted-foreground)', marginRight: '0.25rem' }} />
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCatChange(c)}
                  className={`pill-filter ${cat === c ? 'active' : ''}`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Subcategory pills — shown when a main category is selected and has subs */}
            {currentSubcategories.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', paddingLeft: '1.5rem', borderLeft: '2px solid var(--color-primary)' }}>
                <ChevronRight size={13} style={{ color: 'var(--color-primary)', marginRight: '0.1rem' }} />
                <button
                  onClick={() => setSubCat('All')}
                  className={`pill-filter ${subCat === 'All' ? 'active' : ''}`}
                  style={{ fontSize: '0.78rem' }}
                >
                  All {cat}s
                </button>
                {currentSubcategories.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubCat(s)}
                    className={`pill-filter ${subCat === s ? 'active' : ''}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-muted-foreground)', marginBottom: '1.5rem', fontWeight: 500 }}>
          {filtered.length} profile{filtered.length !== 1 ? 's' : ''} found
          {cat !== 'All' ? ` · ${cat}` : ''}
          {subCat !== 'All' ? ` › ${subCat}` : ''}
          {q ? ` · "${q}"` : ''}
        </p>

        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {filtered.map((p, i) => (
              <div key={p.id} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                <TalentCard profile={p} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--color-muted-foreground)' }}>
            <Users size={40} style={{ margin: '0 auto 1rem', opacity: 0.35 }} />
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No profiles match your search</p>
            <p style={{ fontSize: '0.875rem' }}>Try adjusting the category or search terms.</p>
            <button className="btn-outline btn-sm" style={{ marginTop: '1.25rem' }} onClick={() => { setQ(''); setCat('All'); setSubCat('All'); }}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
