'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserAlt, FaLock } from 'react-icons/fa';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {  // No trailing slash
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Login successful, redirect to /admin
      router.push('/admin');
    } catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  }
} {
      console.error('Login error:', error);
      setError('Failed to fetch');
    }
  } 
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700 tracking-wide">
          Admin Login
        </h2>

        {error && (
          <p className="mb-6 text-center text-red-600 font-semibold animate-fade-in">
            {error}
          </p>
        )}

        {/* Username input with icon */}
        <div className="relative mb-6">
          <FaUserAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-indigo-300 rounded-xl text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            required
            autoComplete="username"
          />
        </div>

        {/* Password input with icon */}
        <div className="relative mb-8">
          <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-indigo-300 rounded-xl text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            required
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:brightness-110 transition"
        >
          Login
        </button>
      </form>
    </main>
  );
}
