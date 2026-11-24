import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckSquare, X } from 'lucide-react';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { FilterBar } from './components/FilterBar';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import type {
  Task,
  TaskFilter,
  TaskFormValues,
  TaskStats,
} from './types/todo';
import { generateTaskId, loadTasks, saveTasks } from './utils/storage';

/**
 * Root component for the My To-Do List application.
 * Manages full CRUD state and synchronizes every mutation to LocalStorage.
 */
export default function App() {
  // Initialize tasks synchronously from LocalStorage so saved items appear immediately
  const [initialLoad] = useState(() => loadTasks());
  const [tasks, setTasks] = useState<Task[]>(initialLoad.data);
  const [storageError, setStorageError] = useState<string | null>(
    initialLoad.error
  );
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
  const [taskPendingDelete, setTaskPendingDelete] = useState<Task | null>(null);

  // Persist task updates to LocalStorage whenever the task list changes
  useEffect(() => {
    const saveError = saveTasks(tasks);
    if (saveError) {
      setStorageError(saveError);
    }
  }, [tasks]);

  /**
   * CREATE: Adds a validated new task with a unique ID and timestamps.
   */
  const handleCreateTask = useCallback((values: TaskFormValues) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: generateTaskId(),
      title: values.title,
      description: values.description,
      dueDate: values.dueDate,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [newTask, ...prev]);
  }, []);

  /**
   * UPDATE (Status): Toggles a task's completed state between Pending and Completed.
   */
  const handleToggleComplete = useCallback((id: string) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: now }
          : task
      )
    );
  }, []);

  /**
   * UPDATE (Details): Saves edited title, description, and due date for a task.
   */
  const handleUpdateTask = useCallback(
    (id: string, updates: TaskFormValues) => {
      const now = new Date().toISOString();
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                title: updates.title,
                description: updates.description,
                dueDate: updates.dueDate,
                updatedAt: now,
              }
            : task
        )
      );
    },
    []
  );

  /**
   * DELETE: Opens confirmation modal and removes the selected task upon confirmation.
   */
  const handleConfirmDelete = useCallback(() => {
    if (!taskPendingDelete) return;
    setTasks((prev) => prev.filter((task) => task.id !== taskPendingDelete.id));
    setTaskPendingDelete(null);
  }, [taskPendingDelete]);

  // Derived task counters (Total, Pending, Completed)
  const stats: TaskStats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    return {
      total: tasks.length,
      pending: tasks.length - completed,
      completed,
    };
  }, [tasks]);

  // READ: Filtered tasks matching the active filter selection
  const filteredTasks = useMemo(() => {
    if (activeFilter === 'pending') {
      return tasks.filter((task) => !task.completed);
    }
    if (activeFilter === 'completed') {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  }, [tasks, activeFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Application Header */}
        <header className="mb-8 pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <CheckSquare className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                My To-Do List
              </h1>
              <p className="mt-0.5 text-sm text-slate-600">
                Organize your tasks, track progress, and keep everything saved locally.
              </p>
            </div>
          </div>
        </header>

        {/* Storage Error Alert (if LocalStorage read/write fails) */}
        {storageError && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{storageError}</span>
            </div>
            <button
              type="button"
              onClick={() => setStorageError(null)}
              aria-label="Dismiss storage error"
              className="rounded p-1 text-red-600 hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Workspace: Two-Column Balanced Layout on Desktop */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Task Input Section */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <TaskForm onAddTask={handleCreateTask} />
          </div>

          {/* Right Column: Task Display, Counters & Filters */}
          <section
            aria-labelledby="tasks-section-heading"
            className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden"
          >
            <div className="px-5 pt-5">
              <h2
                id="tasks-section-heading"
                className="text-lg font-semibold text-slate-900 tracking-tight mb-4"
              >
                Tasks
              </h2>
              <FilterBar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                stats={stats}
              />
            </div>

            <TaskList
              tasks={filteredTasks}
              totalCount={tasks.length}
              activeFilter={activeFilter}
              onFilterReset={() => setActiveFilter('all')}
              onToggleComplete={handleToggleComplete}
              onUpdateTask={handleUpdateTask}
              onRequestDelete={setTaskPendingDelete}
            />
          </section>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        task={taskPendingDelete}
        onCancel={() => setTaskPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
