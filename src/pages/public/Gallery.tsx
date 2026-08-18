import { useEffect, useState } from 'react';
import { api } from '@/api/client';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Gallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.getGallery()
      .then(data => {
        setItems(data);
        const years = Array.from(new Set(data.map((d: any) => d.year).filter(Boolean))).sort().reverse() as string[];
        if (years.length > 0) setSelectedYear(years[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const years = Array.from(new Set(items.map(d => d.year).filter(Boolean))).sort().reverse() as string[];
  const filteredItems = selectedYear ? items.filter(d => d.year === selectedYear) : items;

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="relative pt-32 pb-20 bg-primary-bg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, var(--color-primary-subtle) 0%, transparent 40%)',
          opacity: 0.5
        }} />
        <div className="container relative z-10 px-6 mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            Previous Events
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-[1.1] mb-6">
            Our Gallery
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A glimpse into the glorious moments and events we've hosted over the years.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 max-w-6xl">
        {/* Year Filter Tabs */}
        {years.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedYear(null)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${!selectedYear ? 'bg-primary text-primary-foreground shadow-md' : 'bg-surface border border-border text-muted-foreground hover:border-primary hover:text-foreground'}`}
            >
              All Years
            </button>
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${selectedYear === year ? 'bg-primary text-primary-foreground shadow-md' : 'bg-surface border border-border text-muted-foreground hover:border-primary hover:text-foreground'}`}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20 text-muted-foreground">Loading gallery...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground bg-surface border border-border rounded-2xl shadow-sm">
            No gallery items found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <div key={item.id} className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1 shadow-sm drop-shadow-md">{item.year}</p>
                    <h3 className="text-lg font-bold leading-tight drop-shadow-md">{item.title}</h3>
                  </div>
                </div>
                {item.description && (
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
