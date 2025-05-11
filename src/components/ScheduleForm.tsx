'use client';

import { useState } from 'react';

export default function AnnouncementForm() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !message.trim() || !date) {
      setError('Title, message, and date are required.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          date,
        }),
      });

      if (!response.ok) {
        // Attempt to parse error message from response
        let errorMsg = 'Failed to create announcement';
        try {
          const errorData = await response.json();
          if (errorData?.error) errorMsg = errorData.error;
        } catch {
          // fallback if JSON parsing fails
          const text = await response.text();
          if (text) errorMsg = text;
        }
        throw new Error(errorMsg);
      }

      // Success
      setSuccess('Announcement added successfully!');
      setTitle('');
      setMessage('');
      setDate('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {error && <p className="text-red-600 font-semibold">{error}</p>}
      {success && <p className="text-green-600 font-semibold">{success}</p>}

      <div>
        <label htmlFor="title" className="block mb-1 font-semibold">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
          disabled={loading}
          placeholder="Enter announcement title"
        />
      </div>

      <div>
        <label htmlFor="message" className="block mb-1 font-semibold">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
          disabled={loading}
          placeholder="Enter announcement message"
        />
      </div>

      <div>
        <label htmlFor="date" className="block mb-1 font-semibold">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Announcement'}
      </button>
    </form>
  );
}
