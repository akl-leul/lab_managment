'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import EquipmentCard from '@/components/EquipmentCard';
import { FaSearch, FaUserShield, FaBars, FaTimes } from 'react-icons/fa';
import AnnouncementList from '@/components/AnnouncementList';

interface Equipment {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  status: string;
  category?: string;
}

export default function Home() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filtered, setFiltered] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/equipment')
      .then(res => res.json())
      .then(data => {
        setEquipments(data);
        setFiltered(data);
      });
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFiltered(equipments);
      return;
    }
    const lower = term.toLowerCase();
    setFiltered(
      equipments.filter(
        eq =>
          eq.name.toLowerCase().includes(lower) ||
          eq.description?.toLowerCase().includes(lower) ||
          eq.category?.toLowerCase().includes(lower)
      )
    );
  };

  // Close nav when clicking outside (mobile)
  useEffect(() => {
    if (!navOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setNavOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navOpen]);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white/70 backdrop-blur-xl shadow-md sticky top-0 z-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between md:justify-start md:gap-100">
          {/* Site Title */}
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 font-['Inter'] select-none flex-shrink-0">
            Lab Equipment Inventory
          </h1>

          {/* Hamburger button for small screens */}
          <button
            className="md:hidden text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Nav content: search + admin link */}
          <div
            ref={navRef}
            className={`
              absolute top-full left-0 w-full bg-white/90 backdrop-blur-md border-b border-blue-200 shadow-md md:shadow-none md:border-none md:bg-transparent md:static md:flex md:items-center md:gap-6 md:w-auto
              transition-transform origin-top duration-300 ease-in-out
              ${navOpen ? 'scale-y-100' : 'scale-y-0 md:scale-y-100'}
              md:scale-y-100
              md:opacity-100
              ${navOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'}
              md:opacity-100
              md:translate-y-0
              z-40 md:z-auto
              md:overflow-visible overflow-hidden
            `}
          >
            <div className="flex flex-col md:flex-row md:items-center md:gap-6 px-6 py-4 md:p-0 max-w-lg md:max-w-none mx-auto md:mx-0">
              {/* Search input */}
              <div className="relative w-full md:w-72 mb-4 md:mb-0">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none" />
                <input
                  type="search"
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={e => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 border border-indigo-300 rounded-lg text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  aria-label="Search equipment"
                />
              </div>
 
              {/* Admin link */}
              <Link
                href="/SUPER_ADMIN"
                className="flex items-center gap-2 px-7 py-3 text-sm rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white font-semibold shadow-lg hover:brightness-110 transition whitespace-nowrap justify-center"
                onClick={() => setNavOpen(false)} // close menu on link click
              >
                <FaUserShield size={18} />
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-8 font-['Inter'] drop-shadow-md">
          Laboratory Equipment List
        </h2>

        {filtered.length === 0 ? (
          <p className="text-gray-600 text-center mt-12 text-lg">No equipment found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {filtered.map(eq => (
              <EquipmentCard key={eq.id} equipment={eq} />
            ))}
          </div>

        )}
        <AnnouncementList/>
      </main>
    </>
  );
}
