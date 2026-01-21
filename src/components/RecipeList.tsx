import { useState } from 'react';
import { ACTION_ICONS, ACTION_LABELS } from '../types';
import type { AnvilRecipe, AnvilAction, Category } from '../types';

interface RecipeListProps {
  recipes: AnvilRecipe[];
  categories: Category[];
  onEdit: (recipe: AnvilRecipe) => void;
  onDelete: (id: string) => void;
  onUpdateRecipe: (recipe: AnvilRecipe) => void;
  onUpdateCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
}

function compressSteps(steps: AnvilAction[]) {
  const compressed: { action: AnvilAction; count: number }[] = [];
  if (steps.length === 0) return compressed;

  let current = steps[0];
  let count = 1;

  for (let i = 1; i < steps.length; i++) {
    if (steps[i] === current) {
      count++;
    } else {
      compressed.push({ action: current, count });
      current = steps[i];
      count = 1;
    }
  }
  compressed.push({ action: current, count });
  return compressed;
}

export function RecipeList({ 
    recipes, 
    categories, 
    onEdit, 
    onDelete, 
    onUpdateRecipe,
    onUpdateCategory,
    onDeleteCategory 
}: RecipeListProps) {

  const handleDragStart = (e: React.DragEvent, recipeId: string) => {
      e.dataTransfer.setData('recipeId', recipeId);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault(); // Allow drop
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string | undefined) => {
      e.preventDefault();
      const recipeId = e.dataTransfer.getData('recipeId');
      const recipe = recipes.find(r => r.id === recipeId);
      if (recipe && recipe.categoryId !== targetCategoryId) {
          onUpdateRecipe({ ...recipe, categoryId: targetCategoryId });
      }
  };

  const renderRecipeCard = (recipe: AnvilRecipe) => (
      <div 
        key={recipe.id} 
        draggable
        onDragStart={(e) => handleDragStart(e, recipe.id)}
        className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow hover:border-gray-600 transition-colors cursor-move"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
              <h3 className="font-bold text-lg">{recipe.name}</h3>
              {recipe.targetValue !== undefined && (
                  <span className="text-xs text-gray-400">Target: {recipe.targetValue}</span>
              )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(recipe)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(recipe.id)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {compressSteps(recipe.steps).map((group, index) => (
            <div key={index} className="relative">
                <img
                  src={ACTION_ICONS[group.action]}
                  alt={ACTION_LABELS[group.action]}
                  className="w-10 h-10 object-contain bg-gray-900 rounded p-1"
                  title={`${ACTION_LABELS[group.action]}${group.count > 1 ? ` x${group.count}` : ''}`}
                />
                {group.count > 1 && (
                    <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-gray-800 min-w-[1.25rem] text-center">
                        {group.count}
                    </span>
                )}
            </div>
          ))}
        </div>
      </div>
  );

  const renderCategory = (category: Category) => {
      const categoryRecipes = recipes.filter(r => r.categoryId === category.id);
      
      return (
          <details key={category.id} open className="group mb-4 border border-gray-700 rounded-lg bg-gray-800/50 overflow-hidden">
              <summary 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, category.id)}
                className="flex items-center justify-between p-4 cursor-pointer bg-gray-800 hover:bg-gray-750 select-none list-none"
              >
                  <div className="flex items-center gap-2 font-bold text-lg">
                      <span className="transform group-open:rotate-90 transition-transform text-gray-400">▶</span>
                      <EditableLabel 
                        value={category.name} 
                        onSave={(newName) => onUpdateCategory(category.id, newName)} 
                      />
                      <span className="text-sm text-gray-500 font-normal">({categoryRecipes.length})</span>
                  </div>
                  <button 
                    onClick={(e) => {
                        e.preventDefault(); // Prevent accordion toggle
                        if(confirm('Delete category? Recipes will become unsorted.')) onDeleteCategory(category.id);
                    }}
                    className="text-gray-500 hover:text-red-400 text-sm px-2"
                  >
                      ✕
                  </button>
              </summary>
              <div 
                className="p-4 bg-gray-900/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, category.id)}
              >
                  {categoryRecipes.length === 0 ? (
                      <div className="col-span-full text-center text-gray-500 py-8 border-2 border-dashed border-gray-800 rounded">
                          Drag recipes here
                      </div>
                  ) : (
                      categoryRecipes.map(renderRecipeCard)
                  )}
              </div>
          </details>
      );
  };

  const unsortedRecipes = recipes.filter(r => !r.categoryId || !categories.find(c => c.id === r.categoryId));

  return (
    <div className="space-y-6">
      {categories.map(renderCategory)}

      <details open className="group mb-4 border border-gray-700 rounded-lg bg-gray-800/50 overflow-hidden">
          <summary 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, undefined)}
            className="flex items-center justify-between p-4 cursor-pointer bg-gray-800 hover:bg-gray-750 select-none list-none"
          >
              <div className="flex items-center gap-2 font-bold text-lg text-gray-300">
                  <span className="transform group-open:rotate-90 transition-transform text-gray-400">▶</span>
                  <span>Unsorted</span>
                  <span className="text-sm text-gray-500 font-normal">({unsortedRecipes.length})</span>
              </div>
          </summary>
          <div 
            className="p-4 bg-gray-900/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, undefined)}
          >
               {unsortedRecipes.length === 0 ? (
                      <div className="col-span-full text-center text-gray-500 py-8 border-2 border-dashed border-gray-800 rounded">
                          {categories.length > 0 ? "All recipes sorted!" : "No recipes found. Add one to get started!"}
                      </div>
                  ) : (
                      unsortedRecipes.map(renderRecipeCard)
                  )}
          </div>
      </details>
    </div>
  );
}

function EditableLabel({ value, onSave }: { value: string, onSave: (val: string) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSave(text);
            setIsEditing(false);
        } else if (e.key === 'Escape') {
            setText(value);
            setIsEditing(false);
        }
    }

    if (isEditing) {
        return (
            <input 
                autoFocus
                type="text" 
                value={text} 
                onChange={e => setText(e.target.value)}
                onBlur={() => { onSave(text); setIsEditing(false); }}
                onKeyDown={handleKeyDown}
                onClick={e => e.stopPropagation()} // Prevent accordion toggle
                className="bg-gray-700 text-white px-2 py-0.5 rounded outline-none border border-blue-500"
            />
        )
    }

    return (
        <span 
            onDoubleClick={() => setIsEditing(true)}
            title="Double click to rename"
            className="cursor-text hover:text-blue-300 transition-colors"
        >
            {value}
        </span>
    )
}
