import {
  Apple,
  Beef,
  Candy,
  Coffee,
  Cookie,
  Milk,
  Package2,
  Salad,
  Soup,
  Wheat,
} from 'lucide-react';

export const customCategoryIcon = (category: string) => {
  switch (category) {
    case 'Dairy':
      return Milk;
    case 'Meat':
      return Beef;
    case 'Vegetable':
      return Salad;
    case 'Fruit':
      return Apple;
    case 'Bakery':
      return Cookie;
    case 'Beverage':
      return Coffee;
    case 'Grain':
      return Wheat;
    case 'Snack':
      return Candy;
    case 'Condiment':
      return Soup;
    default:
      return Package2;
  }
};
