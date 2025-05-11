import { useState } from 'react';
import { FaBullhorn, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

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
        let errorMsg = 'Failed to create announcement';
        try {
          const errorData = await response.json();
          if (errorData?.error) errorMsg = errorData.error;
        } catch {
          const text = await response.text();
          if (text) errorMsg = text;
        }
        throw new Error(errorMsg);
      }

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
    <div className='flex flex-col w-full md:w-md'>
         <h1 className="text-2xl font-extrabold mb-6 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 bg-clip-text text-transparent drop-shadow-lg">
  Add Announcements
</h1>

    <form onSubmit={handleSubmit} className="space-y-6 w-full md:min-w-md mx-0 bg-white p-6 rounded-xl shadow-lg">
      
      {error && (
        <p className="text-red-600 font-semibold bg-red-100 p-3 rounded-md border border-red-400">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 font-semibold bg-green-100 p-3 rounded-md border border-green-400">
          {success}
        </p>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
          <FaBullhorn className="text-pink-600" />
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
          disabled={loading}
          placeholder="Enter announcement title"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
          <FaEnvelope className="text-pink-600" />
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
          disabled={loading}
          placeholder="Enter announcement message"
        />
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="block mb-2 font-semibold text-gray-700 flex items-center gap-2">
          <FaCalendarAlt className="text-pink-600" />
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          required
          disabled={loading}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : 'Add Announcement'}
      </button>
    </form></div>
  );
}
