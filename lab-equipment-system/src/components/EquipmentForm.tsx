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
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-5 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-3xl shadow-xl border border-indigo-200"
    >
      <input
        type="text"
        placeholder="Equipment Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border border-indigo-300 rounded-lg px-4 py-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        required
        autoComplete="off"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full border border-indigo-300 rounded-lg px-4 py-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
        rows={4}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        min={1}
        onChange={e => setQuantity(Number(e.target.value))}
        className="w-full border border-indigo-300 rounded-lg px-4 py-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        required
      />
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="w-full border border-indigo-300 rounded-lg px-4 py-3 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
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
        className="w-full border border-indigo-300 rounded-lg px-4 py-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        autoComplete="off"
      />
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:brightness-110 transition"
      >
        Add Equipment
      </button>
    </form>
  );
}
