// src/components/EquipmentForm.tsx
'use client';

import { useState } from 'react';

interface Props {
  onAdd: (data: {
    name: string;
    description?: string;
    quantity: number;
    status: string;
    category?: string;
  }) => void;
}

export default function EquipmentForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('Available');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Name is required');
      return;
    }
    onAdd({ name, description, quantity, status, category });
    setName('');
    setDescription('');
    setQuantity(1);
    setStatus('Available');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4 bg-white p-6 rounded shadow">
      <input
        type="text"
        placeholder="Equipment Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border rounded px-3 py-2"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        min={1}
        onChange={e => setQuantity(Number(e.target.value))}
        className="w-full border rounded px-3 py-2"
        required
      />
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        <option>Available</option>
        <option>In Use</option>
        <option>Under Maintenance</option>
        <option>Broken</option>
      </select>
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
      >
        Add Equipment
      </button>
    </form>
  );
}
