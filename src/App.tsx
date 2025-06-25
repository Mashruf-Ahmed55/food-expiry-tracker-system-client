import { useQuery } from '@tanstack/react-query';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Grid as Fridge, ShieldAlert } from 'lucide-react';
import CountUp from 'react-countup';
import { Link } from 'react-router';

import axiosInstance from './api';
import FoodCard from './components/common/FoodCard';
import FoodCardSkeleton from './components/skeleton/FoodCardSkeleton';
import { Button } from './components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './components/ui/carousel';
import type { FoodItem } from './types';

const fetchNearlyExpiredItems = async (): Promise<FoodItem[]> => {
  const res = await axiosInstance.get(
    '/api/v1/foods/get-all-foods?nearlyExpired=true&limit=6'
  );
  return res.data.data;
};

const fetchExpiredItems = async (): Promise<FoodItem[]> => {
  const res = await axiosInstance.get(
    '/api/v1/foods/get-all-foods?expired=true&limit=6'
  );
  return res.data.data;
};

const App = () => {
  const { data: nearlyExpiredItems = [], isLoading: isLoadingNearlyExpired } =
    useQuery({
      queryKey: ['nearlyExpiredItems'],
      queryFn: fetchNearlyExpiredItems,
    });

  const { data: expiredItems = [], isLoading: isLoadingExpired } = useQuery({
    queryKey: ['expiredItems'],
    queryFn: fetchExpiredItems,
  });

  const bannerSlides = [
    {
      image:
        'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
      title: 'Never Waste Food Again',
      description:
        'Track expiry dates to make sure no food goes to waste in your kitchen.',
    },
    {
      image:
        'https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg',
      title: 'Smart Kitchen Management',
      description:
        'Organize your food inventory and get notified before items expire.',
    },
    {
      image:
        'https://images.pexels.com/photos/2449665/pexels-photo-2449665.jpeg',
      title: 'Save Money, Reduce Waste',
      description:
        'Our platform helps you prioritize what to use first to minimize food waste.',
    },
  ];

  return (
    <div>
      {/* Banner */}
      <section className="relative">
        <Carousel plugins={[Autoplay({ delay: 6000 })]}>
          <CarouselContent>
            {bannerSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden shadow-md">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center gap-y-4 px-4">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold drop-shadow-md">
                      {slide.title}
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl max-w-2xl drop-shadow-sm">
                      {slide.description}
                    </p>
                    <Link to="">
                      <Button
                        size="lg"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        View My Fridge
                      </Button>
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:left-4 text-green-600 border-green-600" />
          <CarouselNext className="right-2 md:right-4 text-green-600 border-green-600" />
        </Carousel>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm text-center"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Fridge className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">
              <CountUp end={12} duration={2.5} />+
            </div>
            <p className="text-gray-600">Food Items Tracked</p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm text-center"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">
              <CountUp end={nearlyExpiredItems.length} duration={2.5} />
            </div>
            <p className="text-gray-600">Nearly Expired Items</p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm text-center"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Calendar className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">
              <CountUp end={expiredItems.length} duration={2.5} />
            </div>
            <p className="text-gray-600">Expired Items</p>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm text-center"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">
              <CountUp end={85} duration={2.5} />%
            </div>
            <p className="text-gray-600">Waste Reduction</p>
          </motion.div>
        </div>
      </section>

      {/* Nearly Expired Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Nearly Expired Items
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These items will expire within the next 5 days. Use them soon to
              reduce food waste.
            </p>
          </div>

          {isLoadingNearlyExpired ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <FoodCardSkeleton key={idx} />
              ))}
            </div>
          ) : nearlyExpiredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearlyExpiredItems.map((item: FoodItem, idx) => (
                <FoodCard key={idx + 2} food={item} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                No items expiring soon. Great job at managing your food!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Expired Items */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Expired Items
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These items have already expired. Check them and remove them from
              your inventory.
            </p>
          </div>

          {isLoadingExpired ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <FoodCardSkeleton key={idx} />
              ))}
            </div>
          ) : expiredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiredItems.map((item, idx) => (
                <FoodCard key={idx + 2} food={item} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600">
                No expired items. You're doing great at managing your food!
              </p>
            </div>
          )}
        </div>
      </section>
      {/* Tips and Facts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Food Waste Facts & Tips
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn how to reduce food waste and make a positive impact on the
              environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Shocking Food Waste Facts
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-red-100 rounded-full p-1 text-red-500 mr-2 mt-1">
                    •
                  </span>
                  <span>
                    Approximately 1/3 of all food produced globally is wasted
                    each year.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 rounded-full p-1 text-red-500 mr-2 mt-1">
                    •
                  </span>
                  <span>
                    The average household throws away $1,500 worth of food
                    annually.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 rounded-full p-1 text-red-500 mr-2 mt-1">
                    •
                  </span>
                  <span>
                    Food waste in landfills produces methane, a greenhouse gas
                    25 times more potent than CO2.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 rounded-full p-1 text-red-500 mr-2 mt-1">
                    •
                  </span>
                  <span>
                    Reducing food waste is ranked as one of the top solutions to
                    climate change.
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Smart Storage Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-green-100 rounded-full p-1 text-green-500 mr-2 mt-1">
                    •
                  </span>
                  <span>
                    Store dairy products on interior refrigerator shelves where
                    temperature is most consistent.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 rounded-full p-1 text-green-500 mr-2 mt-1">
                    •
                  </span>
                  <span>
                    Keep fruits and vegetables separate as many fruits release
                    ethylene gas that can speed ripening.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 rounded-full p-1 text-green-500 mr-2 mt-1">
                    •
                  </span>
                  <span>
                    Freeze bread, sliced meat, and leftovers if you won't use
                    them within a few days.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 rounded-full p-1 text-green-500 mr-2 mt-1">
                    •
                  </span>
                  <span>
                    Use glass containers for leftovers - they preserve food
                    better and let you see what's inside.
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-green-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Reduce Food Waste?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start tracking your food items today and never let good food go to
            waste again.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/add-food"
              className="px-8 py-3 bg-white text-green-600 font-semibold rounded-md hover:bg-gray-100 transition duration-300"
            >
              Add Food Item
            </a>
            <a
              href="/fridge"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-green-600 transition duration-300"
            >
              View My Fridge
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
