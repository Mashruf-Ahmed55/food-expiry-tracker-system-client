'use client';

import { format } from 'date-fns';
import { AlertCircle, ArrowLeft, CalendarIcon, FileImage } from 'lucide-react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import axiosInstance from '@/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RiLoader2Line } from 'react-icons/ri';
import { useNavigate } from 'react-router';

// Mock types - replace with your actual types
interface FoodCategory {
  value: string;
  label: string;
}

const FOOD_CATEGORIES: FoodCategory[] = [
  { value: 'dairy', label: 'Dairy' },
  { value: 'fruit', label: 'Fruits' },
  { value: 'vegetable', label: 'Vegetables' },
  { value: 'meat', label: 'Meat' },
  { value: 'grain', label: 'Grains' },
  { value: 'beverage', label: 'Beverages' },
  { value: 'snack', label: 'Snacks' },
  { value: 'frozen', label: 'Frozen' },
];

interface AddFoodFormData {
  title: string;
  image: string;
  category: string;
  quantity: string;
  expiryDate: Date;
  description: string;
}

export default function AddFood() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddFoodFormData>();

  const selectedCategory = watch('category');
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: {
      expiryDate: string;
      title: string;
      image: string;
      category: string;
      quantity: string;
      description: string;
    }): Promise<any> => {
      const formattedData = {
        food_image: data.image,
        food_title: data.title,
        category: data.category,
        quantity: data.quantity,
        expiryDate: data.expiryDate,
        description: data.description,
      };
      const response = await axiosInstance.post(
        '/api/v1/foods/create-food',
        formattedData
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Food item added successfully!');
      navigate('/my-items');
      queryClient.invalidateQueries({ queryKey: ['myFoods'] });
    },
  });

  const onSubmit = async (data: AddFoodFormData) => {
    // Format the date for API submission if needed
    const formattedData = {
      ...data,
      expiryDate: data.expiryDate ? format(data.expiryDate, 'yyyy-MM-dd') : '',
    };

    mutation.mutate(formattedData);
  };

  const handleGoBack = () => {
    // Replace with your navigation logic
    navigate(-1);
  };

  return (
    <div className="min-h-screen py-8 px-4 w-full">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-none">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleGoBack}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-3xl font-bold">
                  Add Food Item
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Food Title */}
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="title">
                      Food Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="E.g., Organic Milk, Fresh Apples"
                      {...register('title', {
                        required: 'Food title is required',
                      })}
                      className={cn(
                        errors.title ? 'border-destructive' : '',
                        'w-full'
                      )}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Image URL */}
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <div className="relative">
                      <FileImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="image"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className="pl-10 w-full"
                        {...register('image')}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Leave empty to use a default image
                    </p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2 w-full">
                    <Label htmlFor="category">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) => setValue('category', value)}
                      value={selectedCategory}
                    >
                      <SelectTrigger
                        className={cn(
                          errors.category ? 'border-destructive' : '',
                          'w-full'
                        )}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {FOOD_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="hidden"
                      {...register('category', {
                        required: 'Category is required',
                      })}
                    />
                    {errors.category && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2 w-full">
                    <Label htmlFor="quantity">
                      Quantity <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="quantity"
                      placeholder="E.g., 1 gallon, 500g, 2 pcs"
                      {...register('quantity', {
                        required: 'Quantity is required',
                      })}
                      className={cn(
                        errors.quantity ? 'border-destructive' : '',
                        'w-full'
                      )}
                    />
                    {errors.quantity && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>

                  {/* Expiry Date */}
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="expiryDate">
                      Expiry Date <span className="text-destructive">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !watch('expiryDate') && 'text-muted-foreground',
                            errors.expiryDate && 'border-destructive'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {watch('expiryDate') ? (
                            format(watch('expiryDate'), 'PPP')
                          ) : (
                            <span>Pick an expiry date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={watch('expiryDate')}
                          onSelect={(date) =>
                            setValue('expiryDate', date as Date)
                          }
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <input
                      type="hidden"
                      {...register('expiryDate', {
                        required: 'Expiry date is required',
                      })}
                    />
                    {errors.expiryDate && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.expiryDate.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Additional details about the food item..."
                      rows={3}
                      {...register('description')}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoBack}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    size={mutation.isPending ? 'icon' : 'default'}
                  >
                    {mutation.isPending ? (
                      <RiLoader2Line className="animate-spin" size={20} />
                    ) : (
                      'Add Food'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Tips for Adding Food:</strong>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  Always check the expiration date on packaging before adding
                </li>
                <li>
                  Include specific quantities to better track your inventory
                </li>
                <li>
                  Add a detailed description for items with specific storage
                  needs
                </li>
                <li>Set reminders for items that expire quickly</li>
              </ul>
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    </div>
  );
}
