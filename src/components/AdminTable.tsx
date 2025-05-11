'use client';

import { Equipment } from '@prisma/client';
import { useState, useMemo } from 'react';
import { FaEdit, FaTrash, FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Props {
  equipments: Equipment[];
  onUpdate: (id: string, quantity: number, status: string) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

type FilterMode = 'name' | 'category' | 'status' | 'description';

const PAGE_SIZE = 8;

export default function AdminTable({ equipments, onUpdate, canEdit, canDelete, onDelete }: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [status, setStatus] = useState<string>('Available');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('name');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered equipment based on search term and mode
  const filteredEquipments = useMemo(() => {
    if (!searchTerm) return equipments;
    const lower = searchTerm.toLowerCase();

    return equipments.filter(eq => {
      switch (filterMode) {
        case 'name':
          return eq.name.toLowerCase().includes(lower);
        case 'category':
          return eq.category?.toLowerCase().includes(lower);
        case 'status':
          return eq.status.toLowerCase().includes(lower);
        case 'description':
          return eq.description?.toLowerCase().includes(lower);
        default:
          return false;
      }
    });
  }, [equipments, searchTerm, filterMode]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredEquipments.length / PAGE_SIZE);
  const paginatedEquipments = filteredEquipments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset to first page on search/filter change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, filterMode, equipments]);

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
    <>
      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:gap-4 max-w-lg">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 pointer-events-none" />
          <input
            type="search"
            placeholder={`Search by ${filterMode}...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-indigo-300 rounded-lg text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            aria-label="Search equipment"
          />
        </div>

        <div className="relative inline-block text-left mt-3 md:mt-0">
          <label htmlFor="filterMode" className="sr-only">Filter Mode</label>
          <select
            id="filterMode"
            value={filterMode}
            onChange={e => setFilterMode(e.target.value as FilterMode)}
            className="appearance-none cursor-pointer rounded-lg border border-indigo-300 bg-white py-2 pl-3 pr-8 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            aria-label="Select filter mode"
          >
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="status">Status</option>
            <option value="description">Description</option>
          </select>
          <FaFilter className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-400" />
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white text-left">
            <th className="border border-indigo-600 px-4 py-3 font-semibold">Name</th>
            <th className="border border-indigo-600 px-4 py-3 font-semibold">Quantity</th>
            <th className="border border-indigo-600 px-4 py-3 font-semibold">Status</th>
            {(canEdit || canDelete) && (
              <th className="border border-indigo-600 px-4 py-3 font-semibold text-center">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedEquipments.length === 0 ? (
            <tr>
              <td colSpan={canEdit || canDelete ? 4 : 3} className="text-center py-8 text-gray-600 italic">
                No equipment found.
              </td>
            </tr>
          ) : (
            paginatedEquipments.map(eq => (
              <tr
                key={eq.id}
                className="hover:bg-indigo-50 transition-colors duration-200"
              >
                <td className="border border-indigo-300 px-4 py-3 font-medium">{eq.name}</td>
                <td className="border border-indigo-300 px-4 py-3">
                  {editId === eq.id ? (
                    <input
                      type="number"
                      value={quantity}
                      min={0}
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="w-20 border border-indigo-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    eq.quantity
                  )}
                </td>
                <td className="border border-indigo-300 px-4 py-3">
                  {editId === eq.id ? (
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="border border-indigo-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <td className="border border-indigo-300 px-4 py-3 text-center">
                    {editId === eq.id ? (
                      <div className="flex items-center justify-center w-full gap-3">
                        <button
                          onClick={saveEdit}
                          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 flex items-center justify-center transition"
                          title="Save"
                        >
                          <FaEdit className="mr-2" /> Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 transition"
                          title="Cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full gap-3">
                        {canEdit && (
                          <button
                            onClick={() => startEdit(eq)}
                            className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 flex items-center justify-center transition"
                            title="Edit"
                          >
                            <FaEdit className="mr-2" /> EDIT
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => onDelete(eq.id)}
                            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 flex items-center justify-center transition"
                            title="Delete"
                          >
                            <FaTrash className="mr-2" /> DELETE
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${currentPage === 1
              ? 'cursor-not-allowed text-gray-400 border-gray-300 bg-gray-100'
              : 'hover:bg-indigo-500 hover:text-white border-indigo-500 text-indigo-600 bg-white'
            } flex items-center gap-1`}
            aria-label="Previous page"
          >
            <FaChevronLeft /> Prev
          </button>
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border ${page === currentPage
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'hover:bg-indigo-100 border-gray-300 text-gray-700 bg-white'
                }`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${currentPage === totalPages
              ? 'cursor-not-allowed text-gray-400 border-gray-300 bg-gray-100'
              : 'hover:bg-indigo-500 hover:text-white border-indigo-500 text-indigo-600 bg-white'
            } flex items-center gap-1`}
            aria-label="Next page"
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
