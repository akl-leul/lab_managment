'use client';

import { useEffect, useState } from 'react';
import EquipmentForm from '@/components/EquipmentForm';
import AdminTable from '@/components/AdminTable';

interface Equipment {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  status: string;
  category?: string;
}

export default function AdminPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [userRole, setUserRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'VIEWER'>('VIEWER');

  useEffect(() => {
    fetch('/api/equipment')
      .then(res => res.json())
      .then(setEquipments);

    fetch('/api/auth')
      .then(res => res.json())
      .then(data => setUserRole(data?.user?.role || 'VIEWER'));
  }, []);

  const canAdd = userRole === 'SUPER_ADMIN';
  const canEdit = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

  const handleAdd = async (data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch('/api/equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newEq = await res.json();
      setEquipments(prev => [newEq, ...prev]);
    } else {
      alert('Failed to add equipment');
    }
  };

  const handleUpdate = async (id: string, quantity: number, status: string) => {
    const res = await fetch('/api/equipment', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantity, status }),
    });

    if (res.ok) {
      const updated = await res.json();
      setEquipments(prev => prev.map(eq => (eq.id === updated.id ? updated : eq)));
    } else {
      alert('Failed to update equipment');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6">Admin Equipment Management</h1>

        {canAdd && <EquipmentForm onAdd={handleAdd} />}

        <div className="mt-10">
          <AdminTable
            equipments={equipments}
            onUpdate={handleUpdate}
            canEdit={canEdit}
            canDelete={canAdd}
          />
        </div>
      </div>
    </main>
  );
}
