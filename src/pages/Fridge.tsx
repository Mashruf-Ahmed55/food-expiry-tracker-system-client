import axiosInstance from '@/api';
import FoodCardSkeleton from '@/components/skeleton/FoodCardSkeleton';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { FOOD_CATEGORIES, type FoodItem } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import FoodCard from '../components/common/FoodCard';
import SearchFilter from '../components/common/SearchFilter';

interface UseFoodOptions {
  page: number;
  limit?: number;
  search?: string;
  category?: string;
}

const fetchFoods = async ({
  page,
  limit,
  search,
  category,
}: UseFoodOptions) => {
  try {
    const res = await axiosInstance.get(`/api/v1/foods/get-all-foods`, {
      params: {
        page: page,
        limit: limit,
        search: search,
        category: category,
      },
    });
    return res.data;
  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
  }
};
const Fridge = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // State for API response
  const { isPending, data } = useQuery({
    queryKey: ['foods', page, search, category],
    queryFn: () => fetchFoods({ page, search, category }),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const handleSearch = (q: string) => {
    setSearch(q);
  };

  const handleFilter = (cat: string) => {
    setCategory(cat);
  };

  return (
    <div className="min-h-screen w-full px-4">
      <div className="container py-10 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
          My Fridge
        </h1>

        <SearchFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          categories={FOOD_CATEGORIES}
        />

        {isPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <FoodCardSkeleton key={idx} />
            ))}
          </div>
        ) : data && Array.isArray(data.data) && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
              {data.data.map((food: FoodItem, i: number) => (
                <FoodCard key={i * 10} food={food} />
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <PaginationComponent
                currentPage={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                hasNextPage={data.pagination.hasNextPage}
                hasPreviousPage={data.pagination.hasPreviousPage}
                onPageChange={setPage}
              />
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            No food items found.
            <div>
              <button
                className="text-green-500 hover:underline mt-2"
                onClick={() => {
                  setSearch('');
                  setCategory('');
                }}
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fridge;

const PaginationComponent = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, totalPages, onPageChange, hasNextPage, hasPreviousPage]);
  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
            className={!hasPreviousPage ? 'opacity-50 cursor-not-allowed' : ''}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i}>
            <Button
              size={'icon'}
              variant={currentPage === i + 1 ? 'secondary' : 'ghost'}
              className="w-8 h-8"
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </Button>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => hasNextPage && onPageChange(currentPage + 1)}
            className={!hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
