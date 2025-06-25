import { customCategoryIcon } from '@/constant/categoryIcons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { differenceInDays, format, isPast } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  CalendarIcon,
  Edit,
  FileImage,
  Info,
  Plus,
  Trash,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

import axiosInstance from '@/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FOOD_CATEGORIES, type FoodItem } from '@/types';
import { FaRegEye } from 'react-icons/fa';
import { RiLoader2Line } from 'react-icons/ri';
import { Link } from 'react-router';
import { toast } from 'sonner';

// Create a motion-enabled TableRow component
const MotionTableRow = motion(TableRow);

// Mock API function - replace with your actual API call
const fetchMyFoods = async () => {
  const response = await axiosInstance.get('/api/v1/foods/my-food-items', {
    withCredentials: true,
  });
  return response.data.data;
};

const handleDeleteFood = async (foodId: string) => {
  const response = await axiosInstance.delete(
    `/api/v1/foods/delete-food/${foodId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export default function MyItems() {
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    quantity: '',
    expiryDate: new Date(),
    description: '',
    image: '',
  });
  const getCategoryIcon = (category: string) => {
    const capitalizeWords = (str: string) =>
      str
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    return customCategoryIcon(capitalizeWords(category));
  };

  const queryClient = useQueryClient();
  const { data: foods = [], isLoading: isLoadingFoods } = useQuery({
    queryKey: ['myFoods'],
    queryFn: fetchMyFoods,
  });

  const handleEditClick = (food: FoodItem) => {
    setEditingFood(food);
    setFormData({
      title: food.food_title,
      category: food.category,
      quantity: food.quantity,
      expiryDate: new Date(food.expiryDate),
      description: food.description,
      image: food.food_image,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (foodId: string) => {
    setFoodToDelete(foodId);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (field: string, value: string | Date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const useUpdateFood = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({
        id,
        updatedData,
      }: {
        id: string;
        updatedData: any;
      }) => {
        const res = await axiosInstance.put(
          `/api/v1/foods/update-food/${id}`,
          updatedData,
          { withCredentials: true }
        );
        return res.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ['myFoods'] });
      },
      onError: () => {
        toast.error('Failed to update item.');
      },
    });
  };

  const { mutate: updateFood, isPending } = useUpdateFood();

  const handleUpdate = () => {
    if (!editingFood) return;
    const formattedData = {
      food_image: formData.image,
      food_title: formData.title,
      category: formData.category,
      quantity: formData.quantity,
      expiryDate: formData.expiryDate,
      description: formData.description,
    };
    updateFood({ id: editingFood._id, updatedData: formattedData });
    setIsEditModalOpen(false);
    setEditingFood(null);
  };

  const handleDelete = async () => {
    try {
      const data = await handleDeleteFood(String(foodToDelete));
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['myFoods'] });
    } catch (err) {
      toast.error('Failed to delete item.');
    } finally {
      setIsDeleteModalOpen(false);
      setFoodToDelete(null);
    }
  };

  // Function to get status variant based on expiry date
  const getStatusVariant = (
    expiryDate: string
  ): 'default' | 'secondary' | 'destructive' => {
    const date = new Date(expiryDate);
    const isExpired = isPast(date);
    const daysToExpiry = differenceInDays(date, new Date());

    if (isExpired) {
      return 'destructive';
    } else if (daysToExpiry <= 5) {
      return 'secondary';
    } else {
      return 'default';
    }
  };

  // Function to get status text based on expiry date
  const getStatusText = (expiryDate: string) => {
    const date = new Date(expiryDate);
    const isExpired = isPast(date);
    const daysToExpiry = differenceInDays(date, new Date());

    if (isExpired) {
      return 'Expired';
    } else if (daysToExpiry <= 5) {
      return `Expires in ${daysToExpiry} days`;
    } else {
      return 'Good';
    }
  };

  return (
    <div className="min-h-screen pt-16 px-4 w-full">
      <div className="container mx-auto">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                My Food Items
              </h1>
              <p className="text-muted-foreground">
                Manage your personal food inventory. Update details or remove
                items as needed.
              </p>
            </div>
            <Button asChild>
              <Link to="/add-food">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoadingFoods ? (
          <Card>
            <CardContent className="px-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <Skeleton className="h-8 w-[100px]" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Food Items Table */}
            {foods.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-0 shadow-none">
                  <CardContent className="px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Food Item</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Expiry Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {foods.map((food: FoodItem, index: number) => {
                          const CategoryIcon = getCategoryIcon(food.category);
                          const statusVariant = getStatusVariant(
                            food.expiryDate
                          );
                          const statusText = getStatusText(food.expiryDate);

                          return (
                            <MotionTableRow
                              key={food._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              layout
                            >
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarImage
                                      src={
                                        food.food_image || '/placeholder.svg'
                                      }
                                      alt={food.food_title}
                                    />
                                    <AvatarFallback>
                                      {food.food_title.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {food.food_title}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                                  <span>{food.category}</span>
                                </div>
                              </TableCell>
                              <TableCell>{food.quantity}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span>
                                    {format(
                                      new Date(food.expiryDate),
                                      'MMM dd, yyyy'
                                    )}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={statusVariant}>
                                  {statusText}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditClick(food)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteClick(food._id)}
                                  >
                                    <Trash className="w-4 h-4" />
                                  </Button>
                                  <Link to={`/food/${food._id}`}>
                                    <Button variant="ghost" size="icon">
                                      <FaRegEye className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                </div>
                              </TableCell>
                            </MotionTableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-12 text-center">
                    <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <CardTitle className="mb-2">No food items yet</CardTitle>
                    <CardDescription className="mb-4">
                      You haven't added any food items to your inventory yet.
                    </CardDescription>
                    <Button asChild>
                      <a href="/add-food">Add Your First Item</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Food Item</DialogTitle>
            <DialogDescription>
              Make changes to your food item here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-title">Food Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="Enter food title"
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleFormChange('category', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>

                <SelectContent className="w-full">
                  <SelectGroup>
                    <SelectLabel>Choose a category</SelectLabel>
                    {FOOD_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity</Label>
              <Input
                id="edit-quantity"
                value={formData.quantity}
                onChange={(e) => handleFormChange('quantity', e.target.value)}
                placeholder="Enter quantity"
              />
            </div>

            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.expiryDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? (
                      format(formData.expiryDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date) =>
                      date && handleFormChange('expiryDate', date)
                    }
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Image URL</Label>
              <div className="relative">
                <FileImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="edit-image"
                  type="url"
                  className="pl-10"
                  value={formData.image}
                  onChange={(e) => handleFormChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  handleFormChange('description', e.target.value)
                }
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} onClick={handleUpdate}>
              {isPending && (
                <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-destructive/10 rounded-full p-3">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">
              Delete Food Item
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to delete this food item? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
