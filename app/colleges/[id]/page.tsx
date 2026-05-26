'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';

interface College {
  id: string;
  name: string;
  location: string;
  image: string;
  fees: number;
  avgSalary: number; // Avg Package
  ranking: number;   // Global Ranking
  totalStudents?: number;
  overview: string;
  type?: string;     // Private Research University, etc.
}

export default function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function getDetails() {
      try {
        const res = await fetch(`/api/colleges/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCollege(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) getDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 font-medium">Loading premium dashboard...</div>;
  }

  if (!college) {
    return <div className="text-center py-20 text-red-500 font-bold">College not found.</div>;
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-12">
      {/* 1. HERO BANNER COVER SECTION */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="relative h-[380px] w-full rounded-3xl overflow-hidden shadow-sm">
          <Image
            src={college.image || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800"}
            alt={college.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-10">
            <div>
              <p className="text-white/90 text-sm font-semibold flex items-center gap-1.5 mb-2">
                📍 {college.location}
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                {college.name}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#22c55e] text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {college.type || "Private Research University"}
                </span>
                <span className="bg-[#0052cc] text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                  Ranked #{college.ranking || "N/A"} Worldwide
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CORE DYNAMIC KPI STATS ROW */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Annual Fees</p>
            <p className="text-2xl font-black text-[#0052cc]">${Number(college.fees || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Package</p>
            <p className="text-2xl font-black text-[#0052cc]">${college.avgSalary ? `${college.avgSalary}k` : 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Global Ranking</p>
            <p className="text-2xl font-black text-[#0052cc]">#{college.ranking || "N/A"} (QS)</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Students</p>
            <p className="text-2xl font-black text-[#0052cc]">{college.totalStudents ? `${college.totalStudents.toLocaleString()}+` : '15,000+'}</p>
          </div>
        </div>
      </div>

      {/* 3. TABS NAVIGATION & DETAILS GRID */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Tab Pages Area */}
        <div className="lg:col-span-2">
          {/* Tabs header line */}
          <div className="flex gap-6 border-b border-slate-200 mb-6 text-sm font-semibold text-slate-500">
            {['overview', 'courses & fees', 'placements', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 capitalize transition-all ${
                  activeTab === tab ? 'border-b-2 border-[#0052cc] text-[#0052cc] font-bold' : 'hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Cards */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm min-h-[250px]">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">About the University</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{college.overview}</p>
              </div>
            )}
            {activeTab !== 'overview' && (
              <div className="text-slate-400 text-center py-10">
                {activeTab} data will be fetched automatically based on schema variables extension.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: QUICK CALL TO ACTION PANEL */}
        <div className="h-fit bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
          <h4 className="text-lg font-bold text-slate-800 mb-2">Interested?</h4>
          <p className="text-xs text-slate-500 mb-6">Take the next step in your academic journey with this university.</p>
          
          <button className="w-full bg-[#0052cc] hover:bg-[#0041a3] text-white py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all mb-3 flex items-center justify-center gap-2">
            🚀 Apply Now
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all">
              🔖 Save
            </button>
            <button className="border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all">
              🔄 Compare
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}