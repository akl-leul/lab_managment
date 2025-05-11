import React, { useMemo } from 'react';

interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string; // ISO string
}

interface AnnouncementListProps {
  announcement: Announcement[]; // list of announcements passed from parent
  canEdit: boolean;
  canDelete: boolean;
  onUpdate: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
}

export default function AnnouncementList({
  announcement,
  canEdit,
  canDelete,
  onUpdate,
  onDelete,
}: AnnouncementListProps) {
  if (!announcement || announcement.length === 0) {
    return <p className="text-center italic py-4">No announcements at this time.</p>;
  }

  const renderedAnnouncements = useMemo(() => {
    return announcement.map(({ id, title, message, date }) => (
      <div className='flex flex-col w-[98%]'>
   

      <article
        key={id}
        className="p-4 bg-gray-800 rounded-lg border border-green-600 shadow-sm relative"
        aria-label={`Announcement titled ${title}`}
        role="article"
      >
        <header className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-green-400">{title}</h3>
          <time
            className="text-sm text-green-300"
            dateTime={date}
            title={new Date(date).toLocaleString()}
          >
            {new Date(date).toLocaleDateString()}
          </time>
        </header>
        <p className="text-green-200 whitespace-pre-line">{message}</p>

        {(canEdit || canDelete) && (
          <div className="mt-3 flex space-x-2">
            {canEdit && (
              <button
                onClick={() => onUpdate({ id, title, message, date })}
                className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-700 text-white text-sm"
                aria-label={`Edit announcement titled ${title}`}
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(id)}
                className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-white text-sm"
                aria-label={`Delete announcement titled ${title}`}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </article>
      </div>
    ));
  }, [announcement, canEdit, canDelete, onUpdate, onDelete]);

  return <div className="max-w-3xl mx-auto space-y-6">{renderedAnnouncements}</div>;
  
}
