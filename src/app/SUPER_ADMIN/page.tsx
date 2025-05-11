'use client';

import { useEffect, useRef, useState } from 'react';
import { FaTools, FaUsers, FaCalendarAlt, FaBars } from 'react-icons/fa';
import EquipmentForm from '@/components/EquipmentForm';
import TailwindCalendar from '@/components/TailwindCalendar';
import AnnouncementForm from '@/components/ScheduleForm';
import AdminTable from '@/components/AdminTable';
import UserTable from '@/components/UserTable';
import AnnouncementList from '@/components/AnnouncementList';

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

// Confirmation dialog for deletes
function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-xs w-full">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
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

interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
}

export default function AdminPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  // FORCE SUPER_ADMIN FOR ALL USERS
  const [userRole, setUserRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'VIEWER'>('SUPER_ADMIN');
  const [activeTab, setActiveTab] = useState<'equipment' | 'users' | 'calendar'>('equipment');
  const [toast, setToast] = useState<string | null>(null);

  // For confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ type: 'equipment' | 'user' | 'announcement'; id: string } | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // State to hold announcements array
  const [announcement, setAnnouncement] = useState<Announcement[]>([]);
  const [canEdit, setCanEdit] = useState(false); // example permission state

  // Fetch announcements on mount or via some effect
  useEffect(() => {
    async function fetchAnnouncements() {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        // Assuming API returns array of announcements directly
        setAnnouncement(data);
      } else {
        console.log('Failed to fetch announcements');
      }
    }
    fetchAnnouncements();

    // Example: set canEdit based on user role or logic
    setCanEdit(true);
  }, []);

  // Dummy handlers (replace with your real implementations)
  const handleUserUpdate = (updatedAnnouncement: Announcement) => {
    console.log('Update announcement:', updatedAnnouncement);
    // Implement update logic here
  };

  const setConfirmTargetHandler = (target: any) => {
    setConfirmTarget(target);
  };
  const setConfirmOpenHandler = (open: boolean) => {
    setConfirmOpen(open);
  };

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

    // FORCE SUPER_ADMIN FOR ALL USERS
    setUserRole('SUPER_ADMIN');
  }, []);

  const canEditPermission = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

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

  // User handlers
  const handleUserUpdateHandler = async (id: string, username: string, password: string, role: User['role']) => {
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

  // Add user handler
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

  // Centralized delete logic using the dialog
  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;
    setToast(null);
    if (confirmTarget.type === 'equipment') {
      const res = await fetch(`/api/equipment?id=${confirmTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        setEquipments(prev => prev.filter(eq => eq.id !== confirmTarget.id));
        setToast('Equipment deleted successfully!');
      } else {
        const err = await res.json().catch(() => ({}));
        setToast(err?.error || 'Failed to delete equipment');
      }
    } else if (confirmTarget.type === 'user') {
      const res = await fetch(`/api/users?id=${confirmTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== confirmTarget.id));
        setToast('User deleted successfully!');
      } else {
        const err = await res.json().catch(() => ({}));
        setToast(err?.error || 'Failed to delete user');
      }
    } else if (confirmTarget.type === 'announcement') {
      const res = await fetch(`/api/announcements?id=${confirmTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        setAnnouncement(prev => prev.filter(a => a.id !== confirmTarget.id));
        setToast('Announcement deleted successfully!');
      } else {
        const err = await res.json().catch(() => ({}));
        setToast(err?.error || 'Failed to delete announcement');
      }
    }
    setConfirmOpen(false);
    setConfirmTarget(null);
  };

  const handleTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex relative font-sans overflow-x-hidden">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Delete"
        message={
          confirmTarget?.type === 'equipment'
            ? 'Are you sure you want to delete this equipment?'
            : confirmTarget?.type === 'user'
            ? 'Are you sure you want to delete this user?'
            : 'Are you sure you want to delete this announcement?'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmTarget(null);
        }}
      />

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
                    onDelete={id => {
                      setConfirmTarget({ type: 'equipment', id });
                      setConfirmOpen(true);
                    }}
                    canEdit={canEditPermission}
                    canDelete={canEditPermission}
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
                  <UserTable
                    users={users}
                    canEdit={canEditPermission}
                    canDelete={canEditPermission}
                    onUpdate={handleUserUpdateHandler}
                    onDelete={id => {
                      setConfirmTarget({ type: 'user', id });
                      setConfirmOpen(true);
                    }}
                  />
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
            <main className="min-h-screen p-6 bg-gradient-to-br from-pink-50 to-pink-100">
              <h1 className="text-4xl font-extrabold mb-6 text-pink-700 drop-shadow">Announcements</h1>
              <div className='flex items-center justify-center  gap-20'>
              
              <AnnouncementList
                announcement={announcement}
                canEdit={canEdit}
                canDelete={canEdit}
                onUpdate={handleUserUpdate}
                onDelete={id => {
                  setConfirmTarget({ type: 'announcement', id });
                  setConfirmOpen(true);
                }}
              />
              <TailwindCalendar/>
              </div>
            </main>
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-pink-200 mt-8">
              <AnnouncementForm />
            </section>
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
      className={`flex items-center gap-3 px-5 py-3 w-full rounded-xl text-lg font-semibold
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
  const [role, setRole] = useState<User['role']>('SUPER_ADMIN');
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
        <option value="SUPER_ADMIN">Super Admin</option>
        <option value="ADMIN">Admin</option>
        <option value="VIEWER">Viewer</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add User'}
      </button>
    </form>
  );
}
