import { ACTION_ICONS } from '../types';
import type { AnvilAction } from '../types';

interface ActionSelectorProps {
  onSelect: (action: AnvilAction) => void;
}

const actions: AnvilAction[] = ['punch', 'bend', 'upset', 'shrink', 'hit', 'draw'];

export function ActionSelector({ onSelect }: ActionSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {actions.map((action) => (
        <button
          key={action}
          onClick={() => onSelect(action)}
          className="flex flex-col items-center justify-center p-2 bg-gray-800 rounded hover:bg-gray-700 border border-gray-700 transition-colors"
          title={action}
        >
          <img src={ACTION_ICONS[action]} alt={action} className="w-12 h-12 object-contain" />
          <span className="mt-1 text-sm capitalize">{action}</span>
        </button>
      ))}
    </div>
  );
}
