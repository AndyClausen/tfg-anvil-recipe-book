import { useState } from 'react';
import { ACTION_ICONS, ACTION_LABELS } from '../types';
import type { AnvilRecipe, AnvilAction } from '../types';
import { ActionSelector } from './ActionSelector';
import { calculateSequence, CalculatorInstruction, Priority, CalculatorAction } from '../utils/calculator';

interface RecipeEditorProps {
  initialRecipe?: AnvilRecipe;
  onSave: (recipe: AnvilRecipe) => void;
  onCancel: () => void;
}

const CALC_ACTIONS: { label: string; value: CalculatorAction }[] = [
  { label: 'Punch (+2)', value: 'punch' },
  { label: 'Bend (+7)', value: 'bend' },
  { label: 'Upset (+13)', value: 'upset' },
  { label: 'Shrink (+16)', value: 'shrink' },
  { label: 'Hit (Generic)', value: 'hit' },
  { label: 'Light Hit (-3)', value: 'hit_light' },
  { label: 'Medium Hit (-6)', value: 'hit_medium' },
  { label: 'Hard Hit (-9)', value: 'hit_hard' },
  { label: 'Draw (-15)', value: 'draw' },
];

const PRIORITIES: { label: string; value: Priority }[] = [
  { label: 'Last', value: 'last' },
  { label: 'Second Last', value: 'second_last' },
  { label: 'Third Last', value: 'third_last' },
  { label: 'Not Last', value: 'not_last' },
  { label: 'Any', value: 'any' },
];

export function RecipeEditor({ initialRecipe, onSave, onCancel }: RecipeEditorProps) {
  const [name, setName] = useState(initialRecipe?.name || '');
  const [targetValue, setTargetValue] = useState<number | string>(initialRecipe?.targetValue || '');
  const [steps, setSteps] = useState<AnvilAction[]>(initialRecipe?.steps || []);
  
  // Calculator State
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInstructions, setCalcInstructions] = useState<CalculatorInstruction[]>([]);

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

  const addCalcInstruction = () => {
    setCalcInstructions([
      ...calcInstructions,
      { id: crypto.randomUUID(), action: 'hit', priority: 'any' }
    ]);
  };

  const removeCalcInstruction = (id: string) => {
    setCalcInstructions(calcInstructions.filter(i => i.id !== id));
  };

  const updateCalcInstruction = (id: string, field: 'action' | 'priority', value: string) => {
    setCalcInstructions(calcInstructions.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ));
  };

  const handleCalculate = () => {
    if (!targetValue) {
      alert("Please set a Target Value first.");
      return;
    }
    const result = calculateSequence(Number(targetValue), calcInstructions);
    if (result) {
      setSteps(result);
      setShowCalculator(false);
    } else {
      alert("Could not find a valid sequence for this target and these instructions. Check your target value or constraints.");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{initialRecipe ? 'Edit Recipe' : 'New Recipe'}</h2>
          <button 
            onClick={() => setShowCalculator(!showCalculator)}
            className="text-sm bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded text-white transition-colors"
          >
            {showCalculator ? 'Switch to Manual Editor' : 'Open Calculator'}
          </button>
      </div>
      
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
        <label className="block text-sm font-medium mb-1">Target Value {showCalculator && <span className="text-red-400">*</span>}</label>
        <input
          type="number"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g. 50"
        />
      </div>

      {showCalculator ? (
        <div className="mb-6 bg-gray-900 p-4 rounded border border-gray-700">
            <h3 className="font-bold mb-3 text-purple-400">Recipe Calculator</h3>
            <p className="text-sm text-gray-400 mb-4">Add the smithing rules from the anvil GUI, then click Calculate.</p>
            
            {calcInstructions.map((inst) => (
                <div key={inst.id} className="flex gap-2 mb-2 items-center">
                    <select 
                        value={inst.action}
                        onChange={(e) => updateCalcInstruction(inst.id, 'action', e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded p-2 text-sm flex-1"
                    >
                        {CALC_ACTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <select 
                        value={inst.priority}
                        onChange={(e) => updateCalcInstruction(inst.id, 'priority', e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded p-2 text-sm w-32"
                    >
                        {PRIORITIES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <button 
                        onClick={() => removeCalcInstruction(inst.id)}
                        className="text-red-500 hover:text-red-400 px-2"
                        title="Remove"
                    >
                        ✕
                    </button>
                </div>
            ))}
            
            <button 
                onClick={addCalcInstruction}
                className="w-full py-2 border-2 border-dashed border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300 rounded mb-4 text-sm"
            >
                + Add Rule
            </button>

            <button
                onClick={handleCalculate}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold"
            >
                Calculate Sequence
            </button>
        </div>
      ) : (
        <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Sequence</label>
            <div className="flex flex-wrap gap-2 mb-4 min-h-[60px] p-2 bg-gray-900 rounded border border-gray-700">
                {steps.length === 0 && <span className="text-gray-500 italic p-2">No steps added yet.</span>}
            {steps.map((step, index) => (
                <div key={index} className="relative group">
                <img
                    src={ACTION_ICONS[step]}
                    alt={ACTION_LABELS[step]}
                    className="w-10 h-10 object-contain bg-gray-700 rounded p-1"
                    title={ACTION_LABELS[step]}
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
      )}

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
