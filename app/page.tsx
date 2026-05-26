"use client";

import { useState, useEffect } from 'react';

interface College {
  id: string;
  name: string;
  location: string;
  image: string;
  fees: number;
  placementRate: number;
  avgSalary: number;
  ranking: number;
  rating: number;
  overview: string;
  courseTypes: string[];
}

export default function HomePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [feesRange, setFeesRange] = useState(100000);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentSaved = JSON.parse(localStorage.getItem('saved_colleges') || '[]');
      setSavedIds(currentSaved);
    }
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const coursesParam = selectedCourses.join(',');
      const res = await fetch(
        `/api/colleges?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}&maxFees=${feesRange}&courses=${encodeURIComponent(coursesParam)}`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setColleges(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchColleges();
  }, [location, feesRange, selectedCourses]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchColleges();
  };

  const handleCourseChange = (course: string) => {
    if (selectedCourses.includes(course)) {
      setSelectedCourses(selectedCourses.filter(c => c !== course));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const toggleSaveCollege = (id: string) => {
    const currentSaved: string[] = JSON.parse(localStorage.getItem('saved_colleges') || '[]');
    let updated: string[];
    
    if (currentSaved.includes(id)) {
      updated = currentSaved.filter(item => item !== id);
      setSavedIds(updated);
    } else {
      updated = [...currentSaved, id];
      setSavedIds(updated);
    }
    
    localStorage.setItem('saved_colleges', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b]">
    
      <header className="bg-gradient-to-b from-blue-50/50 to-transparent py-16 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          Find Your Dream <span className="text-[#0052cc]">College</span>
        </h1>
        <p className="text-slate-500 text-lg mb-8 max-w-2xl mx-auto">
          Navigate the complex world of higher education with data-driven insights. Compare rankings, costs, and placement stats to secure your future.
        </p>

        <form onSubmit={handleSearchSubmit} className="flex bg-white p-2 rounded-2xl shadow-md border border-slate-100 max-w-2xl mx-auto">
          <div className="flex items-center flex-1 px-3 gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input
              type="text"
              placeholder="Search by college name, course, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-slate-700 focus:outline-none text-sm"
            />
          </div>
          <button type="submit" className="bg-[#0052cc] text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
            Search
          </button>
        </form>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">Filters</h3>
            <button onClick={() => { setLocation('All Locations'); setFeesRange(100000); setSelectedCourses([]); setSearch(''); }} className="text-xs text-[#0052cc] font-medium hover:underline">Clear all</button>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 tracking-wider uppercase mb-2">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
            >
              <option value="All Locations">All Locations</option>
              <option value="Palo Alto, CA">Palo Alto, CA</option>
              <option value="Cambridge, MA">Cambridge, MA</option>
              <option value="Philadelphia, PA">Philadelphia, PA</option>
            </select>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
              <span>Annual Fees Range</span>
            </div>
            <input
              type="range"
              min="20000"
              max="100000"
              step="5000"
              value={feesRange}
              onChange={(e) => setFeesRange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#0052cc]"
            />
            <div className="flex justify-between text-xs font-bold text-slate-600 mt-2">
              <span>$0</span>
              <span className="text-[#0052cc]">${feesRange}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 tracking-wider uppercase mb-3">Course Type</label>
            <div className="space-y-2.5 text-sm text-slate-600 font-medium">
              {['Engineering', 'Business & Management', 'Computer Science', 'Liberal Arts'].map((course) => (
                <label key={course} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course)}
                    onChange={() => handleCourseChange(course)}
                    className="w-4 h-4 rounded text-[#0052cc] border-slate-300 focus:ring-[#0052cc] cursor-pointer"
                  />
                  <span>{course}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-600 font-medium">
              <strong className="text-slate-900">{colleges.length}</strong> colleges found
            </span>
            <div className="text-sm font-medium text-slate-500 flex items-center gap-1">
              <span>Sort by:</span>
              <span className="text-[#0052cc] cursor-pointer hover:underline font-semibold">Rankings (High to Low) ▼</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0052cc] mx-auto"></div>
              <p className="text-slate-400 text-sm mt-4 font-medium">Loading live matching colleges...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college) => (
                <div key={college.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative">
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img src={college.image} alt={college.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <span className="absolute bottom-3 left-3 bg-[#e6f4ea] text-[#137333] text-xs font-bold px-2 py-1 rounded-md">
                      Match: {college.placementRate}%
                    </span>
                    
                    <button 
                      onClick={() => toggleSaveCollege(college.id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition text-lg leading-none"
                    >
                      {savedIds.includes(college.id) ? '❤️' : '🤍'}
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

                    <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-2 text-center border border-slate-100/50 mt-auto">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Avg. Fees</span>
                        <span className="text-slate-700 font-extrabold text-sm">${college.fees}/yr</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Placement</span>
                        <span className="text-slate-700 font-extrabold text-sm">{college.placementRate}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 gap-3">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-3.5 h-3.5 text-[#0052cc] rounded border-slate-300 cursor-pointer"
                          checked={selectedCompareIds.includes(college.id)}
                          onChange={() => {
                            if (selectedCompareIds.includes(college.id)) {
                              setSelectedCompareIds(selectedCompareIds.filter(id => id !== college.id));
                            } else {
                              if (selectedCompareIds.length >= 3) {
                                alert("Maximum 3 colleges hi compare kar sakte hain!");
                                return;
                              }
                              setSelectedCompareIds([...selectedCompareIds, college.id]);
                            }
                          }}
                        />
                        <span>Compare</span>
                      </label>
                      <button 
                        onClick={() => window.location.href = `/colleges/${college.id}`}
                        className="bg-[#0052cc] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && colleges.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-lg font-medium">No colleges match your current selection criteria.</p>
            </div>
          )}
        </section>
      </main>

      {/* FLOATING ACTION BOTTOM BAR */}
      {selectedCompareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-xl z-50 flex items-center gap-6 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-sm font-bold text-slate-700">
            Selected <span className="text-[#0052cc]">{selectedCompareIds.length}/3</span> Colleges
          </p>
          <div className="flex gap-3 items-center">
            <button 
              onClick={() => setSelectedCompareIds([])}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition px-2 py-1"
            >
              Clear
            </button>
            <button 
              onClick={() => window.location.href = `/compare?ids=${selectedCompareIds.join(',')}`}
              disabled={selectedCompareIds.length < 2}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-all duration-200 ${
                selectedCompareIds.length < 2 
                  ? 'bg-slate-300 cursor-not-allowed opacity-80' 
                  : 'bg-[#0052cc] hover:bg-blue-700 shadow-sm active:scale-95'
              }`}
            >
              Compare Now 📊
            </button>
          </div>
        </div>
      )}

    </div>
  );
}