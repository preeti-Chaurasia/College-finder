'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface College {
  id: string;
  name: string;
  location: string;
  image: string;
  fees: number;
  placementRate: number;
  rating: number;
}

export default function SavedCollegesPage() {
  const [savedColleges, setSavedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSavedData() {
      try {
        const savedIds: string[] = JSON.parse(localStorage.getItem('saved_colleges') || '[]');
        
        if (savedIds.length === 0) {
          setSavedColleges([]);
          setLoading(false);
          return;
        }

        const res = await fetch('/api/colleges');
        if (res.ok) {
          const allColleges: College[] = await res.json();
          if (Array.isArray(allColleges)) {
            const matched = allColleges.filter(col => savedIds.includes(col.id));
            setSavedColleges(matched);
          }
        }
      } catch (err) {
        console.error("Failed loading local client synchronization states", err);
      } finally {
        setLoading(false);
      }
    }
    loadSavedData();
  }, []);

  const removeBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const savedIds: string[] = JSON.parse(localStorage.getItem('saved_colleges') || '[]');
    const updatedIds = savedIds.filter(item => item !== id);
    localStorage.setItem('saved_colleges', JSON.stringify(updatedIds));
    setSavedColleges(prev => prev.filter(col => col.id !== id));
  };

  if (loading) {
    return (
      <div className="text-center py-20 bg-white min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0052cc] mx-auto"></div>
        <p className="text-slate-400 text-sm mt-4 font-medium">Loading your collections...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-[#f8fafc] min-h-screen">
      <div className="mb-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">Dashboard &gt; Saved Colleges</div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
        Your Saved Colleges <span className="text-[#0052cc]">({savedColleges.length})</span>
      </h1>
      <p className="text-slate-500 text-sm mb-8">Keep track of your top choices and application progress.</p>

      {savedColleges.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-sm max-w-4xl mx-auto">
          <p className="text-slate-400 font-medium text-base mb-5">No colleges saved yet.</p>
          <Link href="/" className="bg-[#0052cc] text-white px-6 py-3 rounded-xl font-bold text-sm inline-block shadow-sm hover:bg-blue-700 transition">
            Discover Colleges
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedColleges.map((college) => (
            <div key={college.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative">
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img 
                  src={college.image || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800"} 
                  alt={college.name} 
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800";
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                />
                <span className="absolute bottom-3 left-3 bg-[#e6f4ea] text-[#137333] text-xs font-bold px-2 py-1 rounded-md">
                  Match: {college.placementRate}%
                </span>
                
                <button 
                  onClick={(e) => removeBookmark(college.id, e)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition text-lg leading-none z-10"
                >
                  ❤️
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1.5 gap-2">
                    <h4 className="font-bold text-[16px] text-slate-800 leading-snug group-hover:text-[#0052cc] transition">{college.name}</h4>
                    <span className="text-amber-500 font-bold text-sm shrink-0">★ {college.rating}</span>
                  </div>
                  <p className="text-slate-400 text-xs font-medium mb-3">📍 {college.location}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-2 text-center border border-slate-100/50 mt-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Avg. Fees</span>
                    <span className="text-slate-700 font-extrabold text-sm">${college.fees}/yr</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Placement</span>
                    <span className="text-slate-700 font-extrabold text-sm">{college.placementRate}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-end mt-4 pt-3 border-t border-slate-50">
                  <button 
                    onClick={() => window.location.href = `/colleges/${college.id}`}
                    className="bg-[#0052cc] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm w-full"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}