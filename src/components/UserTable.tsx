'use client';

import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

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

export default function UsersTable({ users, onUpdate, onDelete, canEdit, canDelete }: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>('VIEWER');

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
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-purple-100">
          <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
          {canEdit && <th className="border border-gray-300 px-4 py-2 text-left">Password</th>}
          {(canEdit || canDelete) && (
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          )}
        </tr>
      </thead>
      <tbody>
        {users.length === 0 && (
          <tr>
            <td colSpan={canEdit || canDelete ? 4 : 3} className="text-center py-4 text-gray-500">
              No users found.
            </td>
          </tr>
        )}
        {users.map(user => (
          <tr key={user.id} className="hover:bg-purple-50">
            <td className="border border-gray-300 px-4 py-2">
              {editId === user.id ? (
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              ) : (
                user.username
              )}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {editId === user.id ? (
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as User['role'])}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                >
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="VIEWER">Viewer</option>
                </select>
              ) : (
                user.role
              )}
            </td>
            {canEdit && (
              <td className="border border-gray-300 px-4 py-2">
                {editId === user.id ? (
                  <input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                ) : (
                  <span className="italic text-gray-400">••••••••</span>
                )}
              </td>
            )}
            {(canEdit || canDelete) && (
              <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                {editId === user.id ? (
                  <div className='w-full flex gap-3 items-center justify-center'>
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center justify-center"
                      title="Save"
                    >
                      <FaEdit className="mr-1" /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                      title="Cancel"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className='w-full flex gap-3 items-center justify-center'>
                    {canEdit && (
                      <button
                        onClick={() => startEdit(user)}
                        className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 flex items-center justify-center"
                        title="Edit"
                      >
                        <FaEdit /> Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onDelete(user.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center justify-center"
                        title="Delete"
                      >
                        <FaTrash /> Delete
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
