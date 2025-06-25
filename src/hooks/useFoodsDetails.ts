import axiosInstance from '@/api';
import { useQuery } from '@tanstack/react-query';

async function fetchFoodDetails(id: string) {
  const response = await axiosInstance.get(
    `/api/v1/foods/get-single-food/${id}`,
    {
      withCredentials: true,
    }
  );
  return response.data.data;
}

export const useFoodsDetails = (foodId: string) => {
  return useQuery({
    queryKey: ['foodDetails', foodId],
    queryFn: () => fetchFoodDetails(foodId),
  });
};
