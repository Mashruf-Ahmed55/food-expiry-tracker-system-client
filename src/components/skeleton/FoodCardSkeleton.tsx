import { motion } from 'motion/react';
import { Skeleton } from '../ui/skeleton';

const FoodCardSkeleton = () => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Skeleton className="w-full h-48" />

        {/* Status Badge Placeholder */}
        <div className="absolute top-2 right-2">
          <Skeleton className="w-16 h-5 rounded" />
        </div>

        {/* Category Icon Placeholder */}
        <div className="absolute bottom-2 left-2">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        {/* Title */}
        <Skeleton className="h-5 w-3/4 mb-2" />

        {/* Quantity & Category */}
        <div className="flex items-center text-sm mb-4 space-x-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Expiry Date */}
        <div className="flex items-center mt-auto space-x-2">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Button */}
        <div className="mt-3 pt-3 border-t">
          <Skeleton className="w-full h-9 rounded" />
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCardSkeleton;
