import { ACTION_ICONS } from '../types';
import type { AnvilRecipe } from '../types';

interface RecipeListProps {
  recipes: AnvilRecipe[];
  onEdit: (recipe: AnvilRecipe) => void;
  onDelete: (id: string) => void;
}

export function RecipeList({ recipes, onEdit, onDelete }: RecipeListProps) {
  if (recipes.length === 0) {
    return <div className="text-gray-400 text-center py-8">No recipes found. Add one to get started!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow hover:border-gray-600 transition-colors">
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
          
          <div className="flex flex-wrap gap-1 mt-3">
            {recipe.steps.map((step, index) => (
              <img
                key={index}
                src={ACTION_ICONS[step]}
                alt={step}
                className="w-8 h-8 object-contain bg-gray-900 rounded p-0.5"
                title={`${index + 1}. ${step}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
