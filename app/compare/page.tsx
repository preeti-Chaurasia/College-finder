'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
export const dynamic = "force-dynamic";

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
  courseTypes: string[];
}

function ComparePageContent() {
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompareData() {
      const idsString = searchParams.get('ids');
      if (!idsString) {
        setColleges([]);
        setLoading(false);
        return;
      }
      
      const compareIds = idsString.split(',');
      try {
        const res = await fetch('/api/colleges');
        if (res.ok) {
          const allData: College[] = await res.json();
          if (Array.isArray(allData)) {
            const filtered = allData.filter(col => compareIds.includes(col.id));
            setColleges(filtered);
          }
        }
      } catch (err) {
        console.error("Error fetching comparison pipeline datasets", err);
      } finally {
        setLoading(false);
      }
    }
    loadCompareData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="text-center py-20 bg-[#f8fafc] min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0052cc] mx-auto"></div>
        <p className="text-slate-400 text-sm mt-4 font-medium">Building comparison matrix...</p>
      </div>
    );
  }

  if (colleges.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-6">
        <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm">
          <p className="text-slate-500 font-semibold mb-4">Please select colleges from the dashboard to compare side by side.</p>
          <Link href="/" className="bg-[#0052cc] text-white px-5 py-2.5 rounded-xl text-xs font-bold inline-block shadow-sm hover:bg-blue-700 transition">
            Go to Discover
          </Link>
        </div>
      </div>
    );
  }

  const minFees = Math.min(...colleges.map(c => c.fees || 0));
  const maxPlacement = Math.max(...colleges.map(c => c.placementRate || 0));

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight mb-2">Compare Colleges</h1>
          <p className="text-slate-500 text-sm">Analyze and compare your top choices side-by-side to make the most informed decision for your future career.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider w-1/4 align-middle bg-slate-50/40">
                  Comparison Metric
                </th>
                
                {colleges.map((col) => (
                  <th key={col.id} className="p-6 border-l border-slate-100 w-1/4 relative group">
                    <div className="flex flex-col gap-3">
                      <div className="relative h-36 w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
                        <img 
                          src={col.image || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800"} 
                          alt={col.name} 
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800";
                          }}
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-300" 
                        />
                      </div>
                      <div className="text-center mt-1">
                        <h3 className="font-extrabold text-slate-900 text-[15px] leading-snug tracking-tight truncate">{col.name}</h3>
                        <p className="text-slate-400 text-xs font-semibold mt-0.5">📍 {col.location}</p>
                      </div>
                    </div>
                  </th>
                ))}

                {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <th key={`empty-${i}`} className="p-6 border-l border-slate-100 w-1/4 bg-slate-50/20 text-center text-slate-300 text-xs font-medium italic">
                    Slot Available
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              <tr>
                <td className="p-6 bg-slate-50/40 text-slate-800 font-bold text-xs uppercase tracking-wider">Fees (Per Year)</td>
                {colleges.map((col) => {
                  const isBestValue = col.fees === minFees;
                  return (
                    <td key={col.id} className={`p-6 border-l border-slate-100 text-center transition-colors ${isBestValue ? 'bg-emerald-50/20' : ''}`}>
                      <span className="text-slate-900 font-extrabold text-[15px] block">${Number(col.fees).toLocaleString()}</span>
                      {isBestValue && (
                        <span className="text-[10px] font-black tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase mt-1 inline-block">
                          Best Value
                        </span>
                      )}
                    </td>
                  );
                })}
                {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <td key={`empty-row1-${i}`} className="p-6 border-l border-slate-100 bg-slate-50/10"></td>
                ))}
              </tr>

              <tr>
                <td className="p-6 bg-slate-50/40 text-slate-800 font-bold text-xs uppercase tracking-wider">Placement Rate</td>
                {colleges.map((col) => {
                  const isWinner = col.placementRate === maxPlacement;
                  return (
                    <td key={col.id} className={`p-6 border-l border-slate-100 text-center transition-colors ${isWinner ? 'bg-blue-50/10' : ''}`}>
                      <span className="text-slate-900 font-extrabold text-[15px] block">{col.placementRate}%</span>
                      {isWinner && (
                        <span className="text-[10px] font-black tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase mt-1 inline-block">
                          Winner
                        </span>
                      )}
                    </td>
                  );
                })}
                {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <td key={`empty-row2-${i}`} className="p-6 border-l border-slate-100 bg-slate-50/10"></td>
                ))}
              </tr>

              <tr>
                <td className="p-6 bg-slate-50/40 text-slate-800 font-bold text-xs uppercase tracking-wider">Avg. Salary (Annual)</td>
                {colleges.map((col) => (
                  <td key={col.id} className="p-6 border-l border-slate-100 text-center">
                    <span className="text-[#0052cc] font-black text-[15px]">${Number(col.avgSalary || (col.fees * 2.5)).toLocaleString()}</span>
                  </td>
                ))}
                {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <td key={`empty-row3-${i}`} className="p-6 border-l border-slate-100 bg-slate-50/10"></td>
                ))}
              </tr>

              <tr>
                <td className="p-6 bg-slate-50/40 text-slate-800 font-bold text-xs uppercase tracking-wider">Global Ranking</td>
                {colleges.map((col) => (
                  <td key={col.id} className="p-6 border-l border-slate-100 text-center">
                    <span className="text-slate-900 font-black text-[15px] block">#{col.ranking || 'N/A'}</span>
                    <div className="text-amber-500 font-bold text-xs mt-1 flex items-center justify-center gap-0.5">
                      {"★".repeat(Math.round(col.rating || 5))}
                      {"☆".repeat(5 - Math.round(col.rating || 5))}
                    </div>
                  </td>
                ))}
                {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <td key={`empty-row4-${i}`} className="p-6 border-l border-slate-100 bg-slate-50/10"></td>
                ))}
              </tr>

              <tr>
                <td className="p-6 bg-slate-50/40 text-slate-800 font-bold text-xs uppercase tracking-wider">Top Stream Type</td>
                {colleges.map((col) => (
                  <td key={col.id} className="p-6 border-l border-slate-100 text-center">
                    <div className="flex flex-wrap gap-1.5 justify-center max-w-[180px] mx-auto">
                      {(col.courseTypes || ['Engineering', 'CS']).slice(0, 2).map((course, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-200/50">
                          {course}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
                {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <td key={`empty-row5-${i}`} className="p-6 border-l border-slate-100 bg-slate-50/10"></td>
                ))}
              </tr>

              <tr>
                <td className="p-6 bg-slate-50/40 text-slate-800 font-bold text-xs uppercase tracking-wider">Action</td>
                {colleges.map((col) => (
                  <td key={col.id} className="p-6 border-l border-slate-100 text-center">
                    <button 
                      onClick={() => window.location.href = `/colleges/${col.id}`}
                      className="w-full max-w-[160px] mx-auto border border-slate-200 hover:border-[#0052cc] text-slate-700 hover:text-[#0052cc] bg-white transition-all text-xs font-bold py-2.5 rounded-xl block text-center shadow-2xs"
                    >
                      View Details
                    </button>
                  </td>
                ))}
                {colleges.length < 3 && Array.from({ length: 3 - colleges.length }).map((_, i) => (
                  <td key={`empty-row6-${i}`} className="p-6 border-l border-slate-100 bg-slate-50/10"></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="text-center py-20 bg-[#f8fafc] min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0052cc] mx-auto"></div>
        <p className="text-slate-400 text-sm mt-4 font-medium">Loading comparison matrix configuration...</p>
      </div>
    }>
      <ComparePageContent />
    </Suspense>
  );
}