import type { AnvilAction } from '../types';

export type CalculatorAction = AnvilAction | 'hit';

export type Priority = 'last' | 'second_last' | 'third_last' | 'not_last' | 'any';

export interface CalculatorInstruction {
  action: CalculatorAction;
  priority: Priority;
  id: string; // for React keys
}

const ACTION_VALUES: Record<string, number> = {
  punch: 2,
  bend: 7,
  upset: 13,
  shrink: 16,
  hit_light: -3,
  hit_medium: -6,
  hit_hard: -9,
  draw: -15,
};

// Generic hits resolve to these for optimization
// const HIT_OPTIONS: AnvilAction[] = ['hit_light', 'hit_medium', 'hit_hard'];

export function calculateSequence(targetValue: number, instructions: CalculatorInstruction[]): AnvilAction[] | null {
  // 1. Resolve Generic Hits and Calculate Instruction Sum
  const resolvedInstructions: { action: AnvilAction; priority: Priority }[] = [];
  let currentSum = 0;
  
  // Helper to get value
  const getVal = (act: string) => ACTION_VALUES[act];
  
  // Re-run pass
  for (const inst of instructions) {
      let act = inst.action;
      if (act === 'hit') {
          // Simplified: just pick hit_medium (-6)
          act = 'hit_medium'; 
      }
      currentSum += getVal(act);
      resolvedInstructions.push({ action: act as AnvilAction, priority: inst.priority });
  }

  const preTarget = targetValue - currentSum;
  
  if (preTarget < 0) {
      // If we need to reach a negative value, we can't do it with standard setup (positive only).
      // Unless we implement BFS with negatives.
      // But usually target is positive.
      // If `preTarget` is negative, it means `Instructions` sum to something > `Target`.
      // e.g. Target 50. Instructions: Punch(+2) * 30 = 60.
      // PreTarget = -10.
      // We need Setup to sum to -10.
      // Setup actions are Punch(2), Bend(7), Upset(13), Shrink(16).
      // None are negative.
      // So impossible.
      return null;
  }

  // 2. BFS to find Setup Steps
  // We want to reach `preTarget` using {punch, bend, upset, shrink}
  // We prefer fewer steps.
  // Since all edge weights are 1, BFS finds shortest path.
  // We also want to prefer "easier" actions? BFS just finds shortest.
  
  const setupActions = findShortestPath(preTarget);
  
  if (setupActions === null) return null;
  
  // 3. Sort Instructions
  const sortedInstructions = sortInstructions(resolvedInstructions);
  
  return [...setupActions, ...sortedInstructions.map(i => i.action)];
}

function findShortestPath(target: number): AnvilAction[] | null {
    if (target === 0) return [];
    
    // Actions available for setup (Additive)
    const moves: AnvilAction[] = ['shrink', 'upset', 'bend', 'punch']; 
    // Sorted by value desc (16, 13, 7, 2) to greedy-ish? BFS doesn't care about order for correctness, but maybe for aesthetics.
    
    const queue: number[] = [0];
    const visited = new Map<number, { parent: number, action: AnvilAction }>();
    visited.set(0, { parent: -1, action: 'punch' }); // dummy
    // Pruning: if current > target, stop branch? 
    // Yes, because we only have positive moves.
    
    let head = 0;
    while(head < queue.length) {
        const curr = queue[head++];
        
        if (curr === target) {
            // Reconstruct path
            const path: AnvilAction[] = [];
            let temp = target;
            while(temp !== 0) {
                const node = visited.get(temp);
                if (!node) break; 
                path.push(node.action);
                temp = node.parent;
            }
            return path.reverse();
        }
        
        for (const move of moves) {
            const val = ACTION_VALUES[move];
            const next = curr + val;
            
            if (next <= target && !visited.has(next)) {
                visited.set(next, { parent: curr, action: move });
                queue.push(next);
            }
        }
    }
    
    return null; // Not reachable
}

function sortInstructions(instrs: { action: AnvilAction; priority: Priority }[]): { action: AnvilAction }[] {
    const third = instrs.filter(i => i.priority === 'third_last');
    const second = instrs.filter(i => i.priority === 'second_last');
    const last = instrs.filter(i => i.priority === 'last');
    
    const others = instrs.filter(i => !['third_last', 'second_last', 'last'].includes(i.priority));
    
    // Sort others: 'any' then 'not_last'? Doesn't matter much.
    // Just preserve relative order.
    
    return [...others, ...third, ...second, ...last];
}
