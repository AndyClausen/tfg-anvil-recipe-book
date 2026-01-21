import { useState } from 'react';
import { ACTION_ICONS } from '../types';
import type { AnvilRecipe, AnvilAction } from '../types';
import { ActionSelector } from './ActionSelector';

interface RecipeEditorProps {
  initialRecipe?: AnvilRecipe;
  onSave: (recipe: AnvilRecipe) => void;
  onCancel: () => void;
}

export function RecipeEditor({ initialRecipe, onSave, onCancel }: RecipeEditorProps) {
  const [name, setName] = useState(initialRecipe?.name || '');
  const [targetValue, setTargetValue] = useState<number | string>(initialRecipe?.targetValue || '');
  const [steps, setSteps] = useState<AnvilAction[]>(initialRecipe?.steps || []);

  const handleAddStep = (action: AnvilAction) => {
    setSteps([...steps, action]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a recipe name');
      return;
    }
    onSave({
      id: initialRecipe?.id || crypto.randomUUID(),
      name,
      targetValue: targetValue ? Number(targetValue) : undefined,
      steps,
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4">{initialRecipe ? 'Edit Recipe' : 'New Recipe'}</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g. Bronze Pickaxe Head"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Target Value (Optional)</label>
        <input
          type="number"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g. 50"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Sequence</label>
        <div className="flex flex-wrap gap-2 mb-4 min-h-[60px] p-2 bg-gray-900 rounded border border-gray-700">
            {steps.length === 0 && <span className="text-gray-500 italic p-2">No steps added yet.</span>}
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <img
                src={ACTION_ICONS[step]}
                alt={step}
                className="w-10 h-10 object-contain bg-gray-700 rounded p-1"
                title={step}
              />
              <button
                onClick={() => handleRemoveStep(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <ActionSelector onSelect={handleAddStep} />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}
