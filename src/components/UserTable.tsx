'use client';

import { useState, useMemo } from 'react';
import { FaEdit, FaTrash, FaSearch, FaFilter, FaCheck, FaTimes } from 'react-icons/fa';

interface User {
  id: string;
  username: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER';
  profileImage?: string | null;
}

interface Props {
  users: User[];
  onUpdate: (id: string, username: string, password: string, role: User['role']) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

type FilterMode = 'username' | 'role';

export default function UsersTable({ users, onUpdate, onDelete, canEdit, canDelete }: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>('VIEWER');

  // Search and filter mode state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('username');

  // Filtered users based on search term and filter mode
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lower = searchTerm.toLowerCase();
    return users.filter(user => {
      if (filterMode === 'username') {
        return user.username.toLowerCase().includes(lower);
      } else if (filterMode === 'role') {
        return user.role.toLowerCase().includes(lower);
      }
      return false;
    });
  }, [users, searchTerm, filterMode]);

  const startEdit = (user: User) => {
    setEditId(user.id);
    setUsername(user.username);
    setPassword(''); // empty password means no change
    setRole(user.role);
  };

  const cancelEdit = () => {
    setEditId(null);
    setUsername('');
    setPassword('');
    setRole('VIEWER');
  };

  const saveEdit = () => {
    if (!username.trim()) {
      alert('Username cannot be empty');
      return;
    }
    onUpdate(editId!, username.trim(), password, role);
    cancelEdit();
  };

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="mb-6 max-w-full flex items-center gap-3 border border-purple-300 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-purple-500 transition">
        <FaSearch className="text-purple-400" />
        <input
          type="search"
          placeholder={`Search users by ${filterMode}...`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-grow outline-none  text-purple-900 placeholder-purple-400"
          aria-label="Search users"
        />
        <div className="relative inline-block text-left ">
          <label htmlFor="filterMode" className="sr-only">Filter Mode</label>
          <select
            id="filterMode"
            value={filterMode}
            onChange={e => setFilterMode(e.target.value as FilterMode)}
            className=" appearance-none cursor-pointer w-full rounded-lg border border-purple-300 bg-white py-1 px-2 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            aria-label="Select filter mode"
          > 
            <option value="username">Username</option>
            <option value="role">Role</option>
          </select>
          <FaFilter className="pointer-events-none absolute right-1 top-1/2 transform -translate-y-1/2 text-purple-400" />
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white text-left">
            <th className="border border-purple-700 px-4 py-3 font-semibold">Username</th>
            <th className="border border-purple-700 px-4 py-3 font-semibold">Role</th>
            {canEdit && <th className="border border-purple-700 px-4 py-3 font-semibold">Password</th>}
            {(canEdit || canDelete) && (
              <th className="border border-purple-700 px-4 py-3 font-semibold text-center">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={canEdit || canDelete ? 4 : 3} className="text-center py-8 text-gray-600 italic">
                No users found.
              </td>
            </tr>
          ) : (
            filteredUsers.map(user => (
             <tr
  key={user.id}
  className="hover:bg-purple-100 transition-colors duration-300"
>
  <td className="border border-purple-300 px-6 py-4 font-semibold text-purple-900">
    {editId === user.id ? (
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="w-full rounded-md border border-purple-400 px-3 py-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        autoFocus
      />
    ) : (
      user.username
    )}
  </td>

  <td className="border border-purple-300 px-6 py-4 text-purple-800">
    {editId === user.id ? (
      <select
        value={role}
        onChange={e => setRole(e.target.value as User['role'])}
        className="w-full rounded-md border border-purple-400 px-3 py-2 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
      >
        <option value="SUPER_ADMIN">Super Admin</option>
        <option value="ADMIN">Admin</option>
        <option value="VIEWER">Viewer</option>
      </select>
    ) : (
      <span className="capitalize">{user.role.toLowerCase()}</span>
    )}
  </td>

  {canEdit && (
    <td className="border border-purple-300 px-6 py-4 text-purple-800">
      {editId === user.id ? (
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full rounded-md border border-purple-400 px-3 py-2 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        />
      ) : (
        <span className="italic text-gray-400 select-none">••••••••</span>
      )}
    </td>
  )}

  {(canEdit || canDelete) && (
    <td className="border border-purple-300 px-6 py-4 text-center space-x-4">
      {editId === user.id ? (
        <div className="flex justify-center gap-4">
          <button
            onClick={saveEdit}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            title="Save"
            aria-label="Save"
            type="button"
          >
            <FaCheck />
            Save
          </button>
          <button
            onClick={cancelEdit}
            className="flex items-center justify-center rounded-md bg-gray-300 px-4 py-2 text-gray-700 shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            title="Cancel"
            aria-label="Cancel"
            type="button"
          >
            <FaTimes />
          </button>
        </div>
      ) : (
        <div className="flex justify-center gap-4">
          {canEdit && (
            <button
              onClick={() => startEdit(user)}
              className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-white shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              title="Edit"
              aria-label="Edit"
              type="button"
            >
              <FaEdit />
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(user.id)}
              className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              title="Delete"
              aria-label="Delete"
              type="button"
            >
              <FaTrash />
              Delete
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
    </>
  );
}
