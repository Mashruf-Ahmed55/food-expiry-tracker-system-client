export interface FoodItem {
  _id: string;
  food_title: string;
  food_image: string;
  category: string;
  quantity: string;
  expiryDate: string;
  description: string;
  addedDate: string;
  userEmail: string;
  notes?: Note[];
}

export interface Note {
  id: string;
  text: string;
  postedDate: string;
}

export type FoodCategory =
  | 'Dairy'
  | 'Meat'
  | 'Vegetable'
  | 'Fruit'
  | 'Bakery'
  | 'Beverages'
  | 'Grains'
  | 'Snacks'
  | 'Condiments'
  | 'Other';

export const FOOD_CATEGORIES: FoodCategory[] = [
  'Dairy',
  'Meat',
  'Vegetable',
  'Fruit',
  'Bakery',
  'Beverages',
  'Grains',
  'Snacks',
  'Condiments',
  'Other',
];
