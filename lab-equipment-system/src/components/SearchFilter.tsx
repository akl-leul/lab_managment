'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface Props {
  onSearch: (term: string) => void;
}

export default function SearchFilter({ onSearch }: Props) {
  const [term, setTerm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full max-w-lg">
      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Search equipment..."
        value={term}
        onChange={handleChange}
        className="w-full pl-12 pr-4 py-2 border border-indigo-300 rounded-lg text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        aria-label="Search equipment"
      />
    </div>
  );
}
