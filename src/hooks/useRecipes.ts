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

  const importRecipes = (encodedString: string) => {
    try {
        let newRecipes: AnvilRecipe[] = [];
        try {
            newRecipes = JSON.parse(atob(encodedString));
        } catch (e) {
            console.error("Failed to decode import string", e);
            alert("Invalid import string. Please ensure it is a valid Base64 encoded JSON.");
            return;
        }
        
        if (!Array.isArray(newRecipes)) {
             if(typeof newRecipes === 'object') {
                 newRecipes = [newRecipes];
             } else {
                 alert("Imported data is not a valid recipe list");
                 return;
             }
        }

      setRecipes((prev) => {
          const existingIds = new Set(prev.map(r => r.id));
          const uniqueNewRecipes = newRecipes.filter(r => {
              if (!r.id) {
                  // If incoming recipe has no ID, generate one?
                  // Or just warn? Let's generate one to be nice.
                  r.id = crypto.randomUUID();
              }
              return !existingIds.has(r.id);
          });
          
          if (uniqueNewRecipes.length === 0) {
              alert("No new recipes imported (duplicates ignored).");
              return prev;
          }
          
          alert(`Imported ${uniqueNewRecipes.length} new recipes.`);
          return [...prev, ...uniqueNewRecipes];
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
