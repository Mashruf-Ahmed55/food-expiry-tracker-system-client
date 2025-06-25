import { customCategoryIcon } from '@/constant/categoryIcons';
import type { FoodItem } from '@/types';
import { differenceInDays, formatDistanceToNow, isPast } from 'date-fns';
import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

interface FoodCardProps {
  food: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const expiryDate = new Date(food.expiryDate);
  const isExpired = isPast(expiryDate);
  const daysToExpiry = differenceInDays(expiryDate, new Date());
  const isNearlyExpired = daysToExpiry >= 0 && daysToExpiry <= 5;

  // Get category icon
  const CategoryIcon = customCategoryIcon(food.category);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img
          loading="lazy"
          src={
            food.food_image ||
            'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'
          }
          alt={food.food_title}
          className="w-full h-48 object-cover"
        />

        {/* Status Badge */}
        {isExpired && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Expired
          </div>
        )}
        {isNearlyExpired && !isExpired && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
            Expires Soon
          </div>
        )}

        {/* Category Icon */}
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 p-2 rounded-full">
          <CategoryIcon className="w-5 h-5 text-green-500" />
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg mb-1 text-gray-800">
          {food.food_title}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <div className="flex items-center mr-3">
            <span className="font-medium text-gray-700 mr-1">Qty:</span>
            {food.quantity}
          </div>
          <div className="flex items-center">
            <CategoryIcon className="w-4 h-4 mr-1" />
            {food.category}
          </div>
        </div>

        {/* Expiry Date */}
        <div className="flex items-center text-sm mt-auto">
          <Calendar className="w-4 h-4 mr-1 text-gray-500" />
          <span
            className={`${
              isExpired
                ? 'text-red-500'
                : isNearlyExpired
                ? 'text-amber-500'
                : 'text-gray-600'
            }`}
          >
            {isExpired
              ? `Expired ${formatDistanceToNow(expiryDate, {
                  addSuffix: true,
                })}`
              : `Expires ${formatDistanceToNow(expiryDate, {
                  addSuffix: true,
                })}`}
          </span>
        </div>

        <div className="mt-3 pt-3 border-t">
          <Link
            to={`/food/${food._id}`}
            className="block w-full py-2 text-center bg-green-500 hover:bg-green-600 text-white rounded transition duration-200"
          >
            See Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;

{
  /* <div class="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col animate-pulse">
  <div class="relative w-full h-48 bg-gray-200"></div>
  <div class="p-4 flex-grow flex flex-col">
    <div class="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div class="h-4 bg-gray-200 rounded mb-2"></div>
    <div class="h-4 bg-gray-200 rounded"></div>
    <div class="mt-3 pt-3 border-t h-10 bg-gray-200 rounded"></div>
  </div>
</div>; */
}
