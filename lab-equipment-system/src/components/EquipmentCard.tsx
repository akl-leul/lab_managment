// src/components/EquipmentCard.tsx
import { Equipment } from '@prisma/client';

interface Props {
  equipment: Equipment;
}

export default function EquipmentCard({ equipment }: Props) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white">
      <h3 className="text-lg font-semibold text-indigo-900">{equipment.name}</h3>
      {equipment.description && (
        <p className="text-gray-600 mt-1">{equipment.description}</p>
      )}
      <p className="mt-2">
        <span className="font-semibold">Quantity:</span> {equipment.quantity}
      </p>
      <p>
        <span className="font-semibold">Status:</span> {equipment.status}
      </p>
      {equipment.category && (
        <p className="text-sm text-gray-500 mt-1 italic">Category: {equipment.category}</p>
      )}
    </div>
  );
}
