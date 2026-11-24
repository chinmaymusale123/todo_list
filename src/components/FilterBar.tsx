import type { TaskFilter, TaskStats } from '../types/todo';

interface FilterBarProps {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  stats: TaskStats;
}

const FILTER_OPTIONS: { id: TaskFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
];

/**
 * Displays the task summary counter (Total, Pending, Completed) and
 * the segmented filter controls (All, Pending, Completed).
 */
export function FilterBar({
  activeFilter,
  onFilterChange,
  stats,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
      {/* Task Counter with Tabular Numerals */}
      <div
        aria-label="Task statistics"
        className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600"
      >
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono font-medium tabular-nums text-slate-900">
            {stats.total}
          </span>
          <span>Total</span>
        </div>
        <span className="text-slate-300" aria-hidden="true">
          ·
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono font-medium tabular-nums text-amber-700">
            {stats.pending}
          </span>
          <span>Pending</span>
        </div>
        <span className="text-slate-300" aria-hidden="true">
          ·
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono font-medium tabular-nums text-emerald-700">
            {stats.completed}
          </span>
          <span>Completed</span>
        </div>
      </div>

      {/* Segmented Filter Buttons */}
      <div
        role="group"
        aria-label="Filter tasks by status"
        className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto"
      >
        {FILTER_OPTIONS.map((option) => {
          const isActive = activeFilter === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onFilterChange(option.id)}
              aria-pressed={isActive}
              className={`px-3.5 py-2 min-h-[36px] text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
