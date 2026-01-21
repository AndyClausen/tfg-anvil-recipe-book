import { ACTION_ICONS, ACTION_LABELS } from '../types';
import type { AnvilRecipe, AnvilAction } from '../types';

interface RecipeListProps {
  recipes: AnvilRecipe[];
  onEdit: (recipe: AnvilRecipe) => void;
  onDelete: (id: string) => void;
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
      ))}
    </div>
  );
}
