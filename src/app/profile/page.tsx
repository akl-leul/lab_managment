'use client';

import { useEffect, useState } from 'react';
import ProfileImageUploader from '@/components/ProfileImageUploader';

export default function ProfilePage() {
  const [user, setUser] = useState<{
    username: string;
    role: string;
    profileImage: string | null;
  } | null>(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    fetch('/api/auth')
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');

    const res = await fetch('/api/user/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      setPasswordMessage('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
    } else {
      setPasswordMessage(data.error || 'Failed to change password');
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/user/upload-profile-image', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setUser(prev => prev && { ...prev, profileImage: data.url });
    } else {
      alert('Failed to upload image');
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6 space-y-8">
        <h1 className="text-3xl font-bold">Profile</h1>

        <div className="flex items-center space-x-6">
          <ProfileImageUploader currentImage={user.profileImage} onUpload={handleImageUpload} />
          <div>
            <p className="text-lg font-semibold">{user.username}</p>
            <p className="text-gray-600">{user.role}</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Change Password
          </button>
          {passwordMessage && (
            <p className="mt-2 text-sm text-green-600">{passwordMessage}</p>
          )}
        </form>
      </div>
    </main>
  );
}
