'use client';

import { useEffect, useRef, useState } from 'react';
import { FaTools, FaUsers, FaCalendarAlt, FaBars } from 'react-icons/fa';
import EquipmentForm from '@/components/EquipmentForm';
import TailwindCalendar from '@/components/TailwindCalendar';
import AdminTable from '@/components/AdminTable';


// Toast component for pop-up error messages
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-6 right-6 z-50 bg-gradient-to-br from-red-600 to-pink-400 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in font-semibold">
      {message}
    </div>
  );
}

interface Equipment {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  status: string;
  category?: string;
}

interface User {
  id: string;
  username: string;
  password: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER';
  profileImage?: string | null;
}

export default function AdminPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userRole, setUserRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'VIEWER'>('SUPER_ADMIN');
  const [activeTab, setActiveTab] = useState<'equipment' | 'users' | 'calendar'>('equipment');
  const [toast, setToast] = useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Close sidebar on click outside
  useEffect(() => {
    if (!sidebarOpen) return;
    function handleClick(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [sidebarOpen]);

  // Fetch initial data
  useEffect(() => {
    fetch('/api/equipment')
      .then(res => res.json())
      .then(setEquipments);

    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data.users || []));

    fetch('/api/auth')
      .then(res => res.json())
      .then(data => setUserRole(data?.user?.role || 'VIEWER'));
  }, []);

  const canEdit = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';
  const canDelete = true; // All users can delete

  // Equipment handlers
  const handleAdd = async (data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    setToast(null);
    const res = await fetch('/api/equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newEq = await res.json();
      setEquipments(prev => [newEq, ...prev]);
      setToast('Equipment added successfully!');
    } else {
      const err = await res.json().catch(() => ({}));
      setToast(err?.error || 'Failed to add equipment');
    }
  };

  const handleUpdate = async (id: string, quantity: number, status: string) => {
    setToast(null);
    const res = await fetch('/api/equipment', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantity, status }),
    });

    if (res.ok) {
      const updated = await res.json();
      setEquipments(prev => prev.map(eq => (eq.id === updated.id ? updated : eq)));
      setToast('Equipment updated!');
    } else {
      setToast('Failed to update equipment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) return;
    setToast(null);
    const res = await fetch(`/api/equipment?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setEquipments(prev => prev.filter(eq => eq.id !== id));
      setToast('Equipment deleted successfully!');
    } else {
      const err = await res.json().catch(() => ({}));
      setToast(err?.error || 'Failed to delete equipment');
    }
  };

  // User handlers
  const handleUserUpdate = async (id: string, username: string, password: string, role: User['role']) => {
    setToast(null);
    const res = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, username, password, role }),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
      setToast('User updated!');
    } else {
      setToast('Failed to update user');
    }
  };

  // New: Add user handler
  const handleUserAdd = async (data: { username: string; password: string; role: User['role'] }) => {
    setToast(null);
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newUser = await res.json();
      setUsers(prev => [newUser, ...prev]);
      setToast('User added successfully!');
    } else {
      const err = await res.json().catch(() => ({}));
      setToast(err?.error || 'Failed to add user');
    }
  };

  const handleTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex relative font-sans overflow-x-hidden">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Floating sidebar toggle button (all devices) */}
      {!sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-lg text-blue-700 p-3 rounded-full shadow-lg border border-blue-200 hover:scale-110 transition-transform"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <FaBars size={24} />
        </button>
      )}

      {/* Glassmorphic Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed z-50 top-0 left-0 h-full w-72
          bg-white/80 backdrop-blur-xl shadow-2xl border-r border-blue-200
          flex flex-col py-8 px-6
          transition-transform duration-500 cursor-pointer
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ minWidth: '18rem' }}
      >
        
        <h2 className="text-3xl font-extrabold cursor-pointer mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 drop-shadow-lg">
          Admin Panel
        </h2>
        <nav className="space-y-4">
          <SidebarButton
            active={activeTab === 'equipment'}
            onClick={() => handleTab('equipment')}
            icon={<FaTools />}
            label="Equipment" 
          />
          <SidebarButton
            active={activeTab === 'users'}
            onClick={() => handleTab('users')}
            icon={<FaUsers />}
            label="Users"
          />
          <SidebarButton
            active={activeTab === 'calendar'}
            onClick={() => handleTab('calendar')}
            icon={<FaCalendarAlt />}
            label="Calendar"
          />
        </nav>
        <div className="mt-auto text-center text-xs text-blue-400 opacity-70 pt-8">
          &copy; {new Date().getFullYear()} Modern Physics Admin
        </div>
      </aside>

      {/* Overlay for sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" />
      )}

      {/* Main Content */}
      <section className="flex-1 p-4 md:p-10 transition-all duration-500 mt-10">
        {activeTab === 'equipment' && (
          <>
            <h1 className="text-4xl font-extrabold mb-8 text-blue-700 drop-shadow">
              Equipment Management
            </h1>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Equipment List */}
              <div className="flex-1">
                <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-blue-100">
                  <AdminTable
                    equipments={equipments}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    canEdit={canEdit}
                    canDelete={canEdit}
                  />
                </div>
              </div>
              {/* Equipment Form */}
              <div className="md:w-1/3 w-full">
                <div className="bg-gradient-to-br from-blue-200 via-purple-100 to-pink-100 p-8 rounded-2xl shadow-xl border border-blue-100">
                  <h2 className="font-bold text-xl mb-4 text-blue-700">Add Equipment</h2>
                  <EquipmentForm onAdd={handleAdd} />
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === 'users' && (
          <>
            <h1 className="text-4xl font-extrabold mb-8 text-purple-700 drop-shadow">
              User Management
            </h1>
            <div className="flex flex-col md:flex-row gap-8">
              {/* User Add Form */}
              <div className="md:w-1/3 w-full">
                <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-purple-100 mb-6 md:mb-0">
                  <h2 className="font-bold text-xl mb-4 text-purple-700">Add User</h2>
                  <UserForm onAdd={handleUserAdd} />
                </div>
              </div>
              {/* Users Table */}
              <div className="flex-1">
                <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-purple-100 overflow-x-auto">
                  <UsersTable users={users} canEdit={canEdit} onUpdate={handleUserUpdate} />
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === 'calendar' && (
          <>
            <h1 className="text-4xl font-extrabold mb-8 text-pink-700 drop-shadow">
              Calendar
            </h1>
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-pink-100">
              <TailwindCalendar />
            </div>
          </>
        )}
      </section>
    </main>
  );
}

// SidebarButton: modern, animated, physics-inspired
function SidebarButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      className={`
        flex items-center gap-3 px-5 py-3 w-full rounded-xl text-lg font-semibold
        transition-all duration-300
        ${active
          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white shadow-lg scale-105'
          : 'bg-white/40 text-blue-700 hover:bg-blue-100 hover:scale-105'}
      `}
      onClick={onClick}
    >
      <span className="text-2xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function UserForm({
  onAdd,
}: {
  onAdd: (data: { username: string; password: string; role: User['role'] }) => Promise<void>;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>('VIEWER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Username and password are required');
      return;
    }

    setLoading(true);
    try {
      await onAdd({ username: username.trim(), password, role });
      setUsername('');
      setPassword('');
      setRole('VIEWER');
    } catch (err: any) {
      setError(err.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-600 font-semibold text-sm">
          {error}
        </div>
      )}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
        required
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
        required
        disabled={loading}
      />
      <select
        value={role}
        onChange={e => setRole(e.target.value as User['role'])}
        className="w-full border border-gray-300 rounded px-3 py-2"
        disabled={loading}
      >
        <option value="VIEWER">Viewer</option>
        <option value="ADMIN">Admin</option>
        <option value="SUPER_ADMIN">Super Admin</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add User'}
      </button>
    </form>
  );
}


// UsersTable component for displaying and editing users
function UsersTable({
  users,
  canEdit,
  onUpdate,
}: {
  users: User[];
  canEdit: boolean;
  onUpdate: (id: string, username: string, password: string, role: User['role']) => void;
}) {
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ username: string; password: string; role: User['role'] }>({
    username: '',
    password: '',
    role: 'VIEWER',
  });

  const startEdit = (user: User) => {
    setEditUserId(user.id);
    setFormData({
      username: user.username,
      password: '', // blank password means no change
      role: user.role,
    });
  };

  const cancelEdit = () => {
    setEditUserId(null);
    setFormData({ username: '', password: '', role: 'VIEWER' });
  };

  const saveEdit = () => {
    if (!formData.username.trim()) {
      alert('Username cannot be empty');
      return;
    }
    onUpdate(editUserId!, formData.username.trim(), formData.password, formData.role);
    cancelEdit();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 rounded-xl shadow">
        <thead className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
          <tr>
            <th className="border px-2 py-2">ID</th>
            <th className="border px-2 py-2">Username</th>
            <th className="border px-2 py-2">Password</th>
            <th className="border px-2 py-2">Role</th>
            <th className="border px-2 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            editUserId === user.id ? (
              <tr key={user.id} className="bg-blue-50">
                <td className="border px-2 py-1 break-all">{user.id}</td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData(f => ({ ...f, username: e.target.value }))}
                    className="border rounded px-1 py-0.5 w-full"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="password"
                    placeholder="New password (leave blank to keep)"
                    value={formData.password}
                    onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
                    className="border rounded px-1 py-0.5 w-full"
                  />
                </td>
                <td className="border px-2 py-1">
                  <select
                    value={formData.role}
                    onChange={e => setFormData(f => ({ ...f, role: e.target.value as User['role'] }))}
                    className="border rounded px-1 py-0.5 w-full"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>
                </td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    onClick={saveEdit}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={user.id} className="hover:bg-blue-50 transition">
                <td className="border px-2 py-1 break-all">{user.id}</td>
                <td className="border px-2 py-1">{user.username}</td>
                <td className="border px-2 py-1">••••••••</td>
                <td className="border px-2 py-1">{user.role}</td>
                <td className="border px-2 py-1 space-x-2">
                  {canEdit && (
                    <button
                      onClick={() => startEdit(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
