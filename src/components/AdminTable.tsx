// src/components/AdminTable.tsx
'use client';

import { Equipment } from '@prisma/client';
import { useState } from 'react';

interface Props {
  equipments: Equipment[];
  onUpdate: (id: string, quantity: number, status: string) => void;
  canEdit: boolean;
  canDelete: boolean; // For future delete feature if needed
}

export default function AdminTable({ equipments, onUpdate, canEdit }: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [status, setStatus] = useState<string>('Available');

  const startEdit = (equipment: Equipment) => {
    setEditId(equipment.id);
    setQuantity(equipment.quantity);
    setStatus(equipment.status);
  };

  const saveEdit = () => {
    if (editId !== null) {
      onUpdate(editId, quantity, status);
      setEditId(null);
    }
  };

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-indigo-100">
          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
          {canEdit && <th className="border border-gray-300 px-4 py-2">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {equipments.map(eq => (
          <tr key={eq.id} className="hover:bg-indigo-50">
            <td className="border border-gray-300 px-4 py-2">{eq.name}</td>
            <td className="border border-gray-300 px-4 py-2">
              {editId === eq.id ? (
                <input
                  type="number"
                  value={quantity}
                  min={0}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="w-20 border rounded px-2 py-1"
                />
              ) : (
                eq.quantity
              )}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {editId === eq.id ? (
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option>Available</option>
                  <option>In Use</option>
                  <option>Under Maintenance</option>
                  <option>Broken</option>
                </select>
              ) : (
                eq.status
              )}
            </td>
            {canEdit && (
              <td className="border border-gray-300 px-4 py-2">
                {editId === eq.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="mr-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startEdit(eq)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                  >
                    Edit
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
