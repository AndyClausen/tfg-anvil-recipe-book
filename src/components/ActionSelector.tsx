import { ACTION_ICONS, ACTION_LABELS } from '../types';
import type { AnvilAction } from '../types';

interface ActionSelectorProps {
  onSelect: (action: AnvilAction) => void;
}

const actions: AnvilAction[] = ['punch', 'bend', 'upset', 'shrink', 'draw', 'hit_light', 'hit_medium', 'hit_hard'];

export function ActionSelector({ onSelect }: ActionSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => onSelect(action)}
          className="flex flex-col items-center justify-center p-2 bg-gray-800 rounded hover:bg-gray-700 border border-gray-700 transition-colors"
          title={ACTION_LABELS[action]}
        >
          <img src={ACTION_ICONS[action]} alt={ACTION_LABELS[action]} className="w-12 h-12 object-contain" />
          <span className="mt-1 text-xs text-center">{ACTION_LABELS[action]}</span>
        </button>
      ))}
    </div>
  );
}