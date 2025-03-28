import { useState } from 'react';
import { Category } from '../types';
import { DEFAULT_CATEGORIES } from '../data/categories';

export function useCategories() {
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);

  return {
    categories,
  };
}
