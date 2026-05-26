"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();


  const isActive = (path: string) => pathname === path;

  return (
    <nav className="w-full bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center z-50">
      {/* Brand Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-black text-[#0052cc] tracking-tight">
          EduScout
        </Link>
      </div>


      <div className="flex items-center gap-8 text-sm font-semibold">
        <Link 
          href="/" 
          className={`pb-1 transition-all relative ${
            isActive('/') 
              ? 'text-[#0052cc] border-b-2 border-[#0052cc]' 
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Discover
        </Link>

        <Link 
          href="/compare" 
          className={`pb-1 transition-all relative ${
            isActive('/compare') 
              ? 'text-[#0052cc] border-b-2 border-[#0052cc]' 
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Compare
        </Link>

        <Link 
          href="/saved" 
          className={`pb-1 transition-all relative ${
            isActive('/saved') 
              ? 'text-[#0052cc] border-b-2 border-[#0052cc]' 
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Saved
        </Link>
      </div>

  
      <div className="flex items-center gap-4">
        <button className="text-sm font-semibold text-slate-600 hover:text-slate-900">
          Sign In
        </button>
        <button className="bg-[#0052cc] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-xs">
          Join Now
        </button>
      </div>
    </nav>
  );
}