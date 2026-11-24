import { ClipboardList } from 'lucide-react';
import type { Task, TaskFilter, TaskFormValues } from '../types/todo';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  totalCount: number;
  activeFilter: TaskFilter;
  onFilterReset: () => void;
  onToggleComplete: (id: string) => void;
  onUpdateTask: (id: string, updates: TaskFormValues) => void;
  onRequestDelete: (task: Task) => void;
}

/**
 * Renders the organized list of filtered tasks or an informative empty state
 * when no tasks exist or match the active status filter.
 */
export function TaskList({
  tasks,
  totalCount,
  activeFilter,
  onFilterReset,
  onToggleComplete,
  onUpdateTask,
  onRequestDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    const isFilteredEmpty = totalCount > 0 && activeFilter !== 'all';

    return (
      <div className="py-14 px-6 text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <ClipboardList className="w-5 h-5" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          {isFilteredEmpty
            ? `No ${activeFilter} tasks`
            : 'No tasks yet'}
        </h3>
        <p className="mt-1.5 text-sm text-slate-600 max-w-sm mx-auto">
          {isFilteredEmpty
            ? `You currently have no tasks marked as ${activeFilter}. Switch back to view all saved tasks.`
            : 'Your to-do list is empty. Add your first task using the form to start tracking your work.'}
        </p>
        {isFilteredEmpty && (
          <button
            type="button"
            onClick={onFilterReset}
            className="mt-4 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 min-h-[40px] text-xs font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
          >
            View All Tasks
          </button>
        )}
      </div>
    );
  }

  return (
    <ul aria-label="Task list" className="divide-y-0">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onUpdateTask={onUpdateTask}
          onRequestDelete={onRequestDelete}
        />
      ))}
    </ul>
  );
}
