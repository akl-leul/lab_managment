// src/components/SearchFilter.tsx
'use client';

import { useState } from 'react';

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
    <input
      type="text"
      placeholder="Search equipment..."
      value={term}
      onChange={handleChange}
      className="w-full max-w-lg px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}
