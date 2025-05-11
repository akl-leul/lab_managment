'use client';

import { Equipment } from '@prisma/client';
import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Props {
  equipments: Equipment[];
  onUpdate: (id: string, quantity: number, status: string) => void;
  onDelete: (id: string) => void;       // New delete handler prop
  canEdit: boolean;
  canDelete: boolean;                   // Control delete button visibility
}

export default function AdminTable({ equipments, onUpdate, canEdit, canDelete, onDelete }: Props) {
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
          {(canEdit || canDelete) && (
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          )}
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
            {(canEdit || canDelete) && (
              <td className="border border-gray-300 px-4 py-2 text-center">
                {editId === eq.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="mr-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center justify-center"
                      title="Save"
                    >
                      <FaEdit className="mr-1" /> Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                      title="Cancel"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  < div className='flex items-center justify-center w-full'>
                    {canEdit && (
                      <button
                        onClick={() => startEdit(eq)}
                        className="bg-indigo-600 text-white px-3 py-1 cursor-pointer w-[50%] rounded hover:bg-indigo-700 mr-2 flex items-center justify-center"
                        title="Edit"
                      >
                        <FaEdit />EDIT
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onDelete(eq.id)}
                        className="bg-red-600 text-white px-3 py-1 cursor-pointer w-[50%] rounded hover:bg-red-700 flex items-center justify-center"
                        title="Delete"
                      >
                        <FaTrash />DELETE
                      </button>
                    )}
                  </div>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
