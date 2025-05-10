// src/components/ProfileImageUploader.tsx
'use client';

import { useState, ChangeEvent } from 'react';

interface Props {
  currentImage?: string | null;
  onUpload: (file: File) => Promise<void>;
}

export default function ProfileImageUploader({ currentImage, onUpload }: Props) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    await onUpload(file);
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300">
        {preview ? (
          <img src={preview} alt="Profile Image" className="object-cover w-full h-full" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
            No Image
          </div>
        )}
      </div>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}
