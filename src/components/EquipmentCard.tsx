// src/components/EquipmentCard.tsx
import { Equipment } from '@prisma/client';
import { FaBoxes, FaCheckCircle, FaTimesCircle, FaTags } from 'react-icons/fa';

interface Props {
  equipment: Equipment;
}

export default function EquipmentCard({ equipment }: Props) {
  // Determine status icon and color
  const statusLower = equipment.status.toLowerCase();
  const isAvailable = statusLower === 'available';

  return (
    <div className="border rounded-lg p-5 shadow-md hover:shadow-xl transition bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <h3 className="text-xl font-bold text-indigo-900 mb-3">{equipment.name}</h3>
      {equipment.description && (
        <p className="text-gray-700 mb-4">{equipment.description}</p>
      )}

      <div className="flex items-center gap-3 mb-2 text-indigo-700 font-semibold">
        <FaBoxes className="text-indigo-500" />
        <span>Quantity: <span className="font-normal">{equipment.quantity}</span></span>
      </div>

      <div className="flex items-center gap-3 mb-2 font-semibold">
        {isAvailable ? (
          <FaCheckCircle className="text-green-500" title="Available" />
        ) : (
          <FaTimesCircle className="text-red-500" title="Unavailable" />
        )}
        <span className={isAvailable ? 'text-green-700' : 'text-red-700'}>
          Status: <span className="font-normal">{equipment.status}</span>
        </span>
      </div>

      {equipment.category && (
        <div className="flex items-center gap-3 text-sm text-gray-500 italic">
          <FaTags className="text-gray-400" />
          <span>Category: {equipment.category}</span>
        </div>
      )}
    </div>
  );
}
