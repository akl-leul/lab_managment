'use client';

import { useEffect, useState } from 'react';
import EquipmentCard from '@/components/EquipmentCard';
import SearchFilter from '@/components/SearchFilter';

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

  useEffect(() => {
    fetch('/api/equipment')
      .then(res => res.json())
      .then(data => {
        setEquipments(data);
        setFiltered(data);
      });
  }, []);

  const handleSearch = (term: string) => {
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-8 font-['Inter']">
          Laboratory Equipment Inventory
        </h1>

        <SearchFilter onSearch={handleSearch} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {filtered.map(eq => (
            <EquipmentCard key={eq.id} equipment={eq} />
          ))}
        </div>
      </div>
    </main>
  );
}
