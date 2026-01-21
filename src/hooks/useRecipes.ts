import { useState, useEffect } from 'react';
import type { AnvilRecipe } from '../types';

const STORAGE_KEY = 'tfg_anvil_recipes';

export function useRecipes() {
  const [recipes, setRecipes] = useState<AnvilRecipe[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  }, [recipes]);

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

  const importRecipes = (jsonString: string) => {
    try {
        // Try parsing as raw JSON first
        let newRecipes: AnvilRecipe[] = [];
        try {
            newRecipes = JSON.parse(jsonString);
        } catch {
             // If that fails, try base64 decode
             try {
                newRecipes = JSON.parse(atob(jsonString));
             } catch (e) {
                 console.error("Failed to parse import string", e);
                 alert("Invalid import string");
                 return;
             }
        }
        
        if (!Array.isArray(newRecipes)) {
             // Maybe it's a single recipe?
             if(typeof newRecipes === 'object') {
                 newRecipes = [newRecipes];
             } else {
                 alert("Imported data is not a valid recipe list");
                 return;
             }
        }

        // Basic validation could go here
      setRecipes((prev) => {
          // Merge? Or replace? Let's just append for now, or maybe check for dupes by ID?
          // Let's replace ID to be safe if they collide, or just trust the user.
          // For simplicity, let's append.
          return [...prev, ...newRecipes];
      });
    } catch (e) {
      console.error('Failed to import recipes', e);
      alert('Failed to import recipes');
    }
  };

  const exportRecipes = (asBase64 = true) => {
      const str = JSON.stringify(recipes);
      if (asBase64) {
          return btoa(str);
      }
      return str;
  }

  return { recipes, addRecipe, updateRecipe, deleteRecipe, importRecipes, exportRecipes };
}
