import { useState, useEffect } from 'react';
import type { AnvilRecipe, Category, ExportData } from '../types';

const STORAGE_KEY_RECIPES = 'tfg_anvil_recipes';
const STORAGE_KEY_CATEGORIES = 'tfg_anvil_categories';

export function useRecipes() {
  const [recipes, setRecipes] = useState<AnvilRecipe[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_RECIPES);
    return stored ? JSON.parse(stored) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  const addRecipe = (recipe: AnvilRecipe) => {
    setRecipes((prev) => [...prev, recipe]);
  };

  const updateRecipe = (updatedRecipe: AnvilRecipe) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );
  };

  const deleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  // Category Management
  const addCategory = (name: string) => {
    const newCategory: Category = { id: crypto.randomUUID(), name };
    setCategories(prev => [...prev, newCategory]);
    return newCategory.id;
  };

  const updateCategory = (id: string, name: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };

  const deleteCategory = (id: string) => {
    // Unassign recipes from this category
    setRecipes(prev => prev.map(r => r.categoryId === id ? { ...r, categoryId: undefined } : r));
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const reorderCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
  };

  const importRecipes = (encodedString: string) => {
    try {
        let parsedData: any;
        try {
            parsedData = JSON.parse(atob(encodedString));
        } catch (e) {
            console.error("Failed to decode import string", e);
            alert("Invalid import string. Please ensure it is a valid Base64 encoded JSON.");
            return;
        }
        
        let newRecipes: AnvilRecipe[] = [];
        let newCategories: Category[] = [];

        // Handle legacy format (array of recipes) vs new format (object)
        if (Array.isArray(parsedData)) {
            newRecipes = parsedData;
        } else if (typeof parsedData === 'object' && parsedData !== null) {
            if (parsedData.recipes && Array.isArray(parsedData.recipes)) {
                newRecipes = parsedData.recipes;
            } else if (parsedData.id && parsedData.name && parsedData.steps) {
                 // Single recipe import
                 newRecipes = [parsedData];
            }

            if (parsedData.categories && Array.isArray(parsedData.categories)) {
                newCategories = parsedData.categories;
            }
        } else {
             alert("Imported data is not valid.");
             return;
        }

        const existingRecipeIds = new Set(recipes.map(r => r.id));
        const uniqueNewRecipes = newRecipes.filter(r => {
            if (!r.id) r.id = crypto.randomUUID();
            return !existingRecipeIds.has(r.id);
        });

        const existingCategoryIds = new Set(categories.map(c => c.id));
        const uniqueNewCategories = newCategories.filter(c => {
             if (!c.id) c.id = crypto.randomUUID();
             return !existingCategoryIds.has(c.id);
        });

        if (uniqueNewRecipes.length === 0 && uniqueNewCategories.length === 0) {
            alert("No new data imported (duplicates ignored).");
            return;
        }

        setRecipes((prev) => [...prev, ...uniqueNewRecipes]);
        setCategories((prev) => [...prev, ...uniqueNewCategories]);
        
        alert(`Imported ${uniqueNewRecipes.length} recipes and ${uniqueNewCategories.length} categories.`);

    } catch (e) {
      console.error('Failed to import data', e);
      alert('Failed to import data');
    }
  };

  const exportRecipes = (asBase64 = true) => {
      const data: ExportData = {
          recipes,
          categories
      };
      const str = JSON.stringify(data);
      if (asBase64) {
          return btoa(str);
      }
      return str;
  }

  return { 
      recipes, 
      categories,
      addRecipe, 
      updateRecipe, 
      deleteRecipe,
      addCategory,
      updateCategory,
      deleteCategory,
      reorderCategories,
      importRecipes, 
      exportRecipes 
  };
}
