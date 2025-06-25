import {
  differenceInDays,
  format,
  formatDistanceToNow,
  isPast,
} from 'date-fns';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router';

import axiosInstance from '@/api';
import { Textarea } from '@/components/ui/textarea';
import { customCategoryIcon } from '@/constant/categoryIcons';
import useAuth from '@/hooks/useAuth';
import { useFoodsDetails } from '@/hooks/useFoodsDetails';
import { cn } from '@/lib/utils';
import type { Note } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Info,
  Send,
  ShoppingBasket,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const FoodDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: food, isLoading } = useFoodsDetails(id as string);

  const { handleSubmit, register, formState, resetField } = useForm({
    defaultValues: { note: '' },
    mode: 'onChange',
  });

  const mutation = useMutation({
    mutationKey: ['addNote'],
    mutationFn: async (data: { note: string }) => {
      const response = await axiosInstance.patch(
        `/api/v1/foods/add-note/${id}`,
        {
          text: data.note,
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Note added successfully.');  
      queryClient.invalidateQueries({ queryKey: ['foodDetails'] });
      resetField('note');
    },
    onError: () => {
      toast.error('Failed to add note.');
    },
  });

  const handleAddNote = (data: { note: string }) => {
    if (!id) return;
    mutation.mutate({ note: data.note });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen py-24 px-4 w-full">
        <div className="container mx-auto max-w-4xl text-center">
          <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Food Item Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The food item you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/fridge"
            className="inline-flex items-center px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Fridge
          </Link>
        </div>
      </div>
    );
  }

  const CategoryIcon = customCategoryIcon(food.category);
  const expiryDate = new Date(food.expiryDate);
  const isExpired = isPast(expiryDate);
  const daysToExpiry = differenceInDays(expiryDate, new Date());
  const isNearlyExpired = daysToExpiry >= 0 && daysToExpiry <= 5;
  const canAddNote = currentUser?.email === food.userEmail;

  return (
    <div className="min-h-screen w-full py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link
          to="/fridge"
          className="inline-flex items-center text-gray-600 hover:text-green-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Fridge
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/2">
              <img
                src={
                  food.food_image ||
                  'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'
                }
                alt={food.food_title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="md:w-1/2 p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {food.food_title}
                </h1>
                <div className="flex items-center mb-4">
                  <span className="flex items-center text-gray-600 mr-4">
                    <CategoryIcon className="w-5 h-5 mr-1" />
                    {food.category}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <ShoppingBasket className="w-5 h-5 mr-1" />
                    {food.quantity}
                  </span>
                </div>

                <div
                  className={`mb-6 p-3 rounded-md ${
                    isExpired
                      ? 'bg-red-50 border border-red-100'
                      : isNearlyExpired
                      ? 'bg-amber-50 border border-amber-100'
                      : 'bg-green-50 border border-green-100'
                  }`}
                >
                  <div className="flex items-start">
                    {isExpired ? (
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-500 mt-0.5" />
                    ) : isNearlyExpired ? (
                      <Clock className="w-5 h-5 mr-2 text-amber-500 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500 mt-0.5" />
                    )}

                    <div>
                      <p
                        className={`font-medium ${
                          isExpired
                            ? 'text-red-700'
                            : isNearlyExpired
                            ? 'text-amber-700'
                            : 'text-green-700'
                        }`}
                      >
                        {isExpired
                          ? 'Expired!'
                          : isNearlyExpired
                          ? 'Expiring Soon!'
                          : 'Fresh'}
                      </p>
                      <div className="flex items-center mt-1 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          {isExpired
                            ? `Expired ${formatDistanceToNow(expiryDate, {
                                addSuffix: true,
                              })}`
                            : `Expires ${formatDistanceToNow(expiryDate, {
                                addSuffix: true,
                              })}`}
                        </span>
                      </div>

                      {!isExpired && (
                        <div className="mt-2 text-sm">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                isNearlyExpired
                                  ? 'bg-amber-500'
                                  : 'bg-green-500'
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  100 - (daysToExpiry / 30) * 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <p className="mt-1">
                            {daysToExpiry > 0
                              ? `${daysToExpiry} days remaining`
                              : 'Expiring today!'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {food.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600">{food.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="block font-medium text-gray-700">
                      Added On
                    </span>
                    {format(new Date(food.addedDate), 'MMMM d, yyyy')}
                  </div>
                  <div>
                    <span className="block font-medium text-gray-700">
                      Expires On
                    </span>
                    {format(expiryDate, 'MMMM d, yyyy')}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Note Section */}
          <div className="p-6 border-t">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Notes</h3>

            <div className="mb-6">
              <form
                onSubmit={handleSubmit(handleAddNote)}
                className="flex flex-col items-start gap-y-2"
              >
                <Textarea
                  {...register('note', { required: true })}
                  placeholder={
                    canAddNote
                      ? 'Add a note about this food...'
                      : 'Only the owner can add notes'
                  }
                  disabled={!canAddNote}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                  rows={2}
                />
                <button
                  type="submit"
                  disabled={
                    mutation.isPending || !formState.isValid || !canAddNote
                  }
                  className={cn(
                    !canAddNote
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white',
                    'h-8 gap-1.5 px-3 has-[>svg]:px-2.5 flex items-center justify-center rounded-sm text-sm cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  <Send className="w-4 h-4" />
                  <span className="ml-2">Add Note</span>
                </button>
              </form>
              {!canAddNote && (
                <p className="mt-2 text-xs text-gray-500">
                  You can only add notes to your own food items
                </p>
              )}
            </div>

            {/* Notes list */}
            {food.notes && food.notes.length > 0 ? (
              <div className="space-y-4">
                {food.notes.map((note: Note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 p-4 rounded-md"
                  >
                    <p className="text-gray-700 mb-2">{note.text}</p>
                    <p className="text-xs text-gray-500">
                      Added on{' '}
                      {format(new Date(note.postedDate), 'MMMM d, yyyy')}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No notes added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
