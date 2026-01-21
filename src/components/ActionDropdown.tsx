import { useState, useRef, useEffect } from 'react';
import { ACTION_ICONS } from '../types';
import type { CalculatorAction } from '../utils/calculator';

interface CustomSelectProps {
  value: CalculatorAction;
  onChange: (value: CalculatorAction) => void;
  options: { label: string; value: CalculatorAction }[];
}

export function ActionDropdown({ value, onChange, options }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative flex-1 min-w-[160px]" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gray-800 border border-gray-700 rounded p-2 text-sm text-left hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
           {value !== 'hit' && (
               <img 
                src={ACTION_ICONS[value as keyof typeof ACTION_ICONS]} 
                alt="" 
                className="w-5 h-5 object-contain"
               />
           )}
           {/* Generic hit has no icon in our map? Or use empty? Or use hit? */}
           {/* We used 'hit' for generic in calculator logic, but we don't have an icon for it in ACTION_ICONS unless we mapped it. */}
           {/* Let's check ACTION_ICONS. It has hit_light, hit_medium, hit_hard. It does NOT have 'hit'. */}
           {/* We should probably map 'hit' to something or just show no icon. */}
           {value === 'hit' && <span className="w-5 h-5 flex items-center justify-center text-gray-500">?</span>}

           <span>{selectedOption?.label}</span>
        </div>
        <span className="text-gray-500 ml-2">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded shadow-xl max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 p-2 text-sm hover:bg-gray-700 text-left transition-colors"
            >
               {option.value !== 'hit' && (
                   <img 
                    src={ACTION_ICONS[option.value as keyof typeof ACTION_ICONS]} 
                    alt="" 
                    className="w-5 h-5 object-contain" 
                   />
               )}
               {option.value === 'hit' && <span className="w-5 h-5 flex items-center justify-center text-gray-500">?</span>}
               <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
