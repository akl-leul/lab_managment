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
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300  w-full flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-extrabold text-indigo-900 mb-3 tracking-tight">
          {equipment.name}
        </h3>

        {equipment.description && (
          <p className="text-gray-700 mb-5 leading-relaxed text-sm md:text-base">
            {equipment.description}
          </p>
        )}

        <div className="flex items-center gap-4 mb-3 text-indigo-700 font-semibold text-sm md:text-base">
          <FaBoxes className="text-indigo-500 text-lg md:text-xl" />
          <span>
            Quantity: <span className="font-normal text-indigo-900">{equipment.quantity}</span>
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4 font-semibold text-sm md:text-base">
          {isAvailable ? (
            <FaCheckCircle className="text-green-500 text-lg md:text-xl" title="Available" />
          ) : (
            <FaTimesCircle className="text-red-500 text-lg md:text-xl" title="Unavailable" />
          )}
          <span className={isAvailable ? 'text-green-700' : 'text-red-700'}>
            Status: <span className="font-normal">{equipment.status}</span>
          </span>
        </div>
      </div>

      {equipment.category && (
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 italic mt-auto pt-3 border-t border-gray-200">
          <FaTags className="text-gray-400" />
          <span>Category: {equipment.category}</span>
        </div>
      )}
    </div>
  );
}
