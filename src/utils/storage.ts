import type { Task } from '../types/todo';

const STORAGE_KEY = 'my_todo_list_tasks_v1';

export interface StorageResult<T> {
  data: T;
  error: string | null;
}

/**
 * Generates a unique identifier for each task using crypto.randomUUID when available,
 * with a timestamp + random suffix fallback for older browser contexts.
 */
export function generateTaskId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Type guard verifying that a parsed JSON object conforms to the Task interface.
 */
function isValidTaskRecord(item: unknown): item is Task {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    candidate.id.trim().length > 0 &&
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.dueDate === 'string' &&
    typeof candidate.completed === 'boolean' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string'
  );
}

/**
 * Loads saved tasks from LocalStorage with defensive JSON parsing and schema validation.
 */
export function loadTasks(): StorageResult<Task[]> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { data: [], error: null };
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return {
        data: [],
        error: 'Saved task data had an unexpected format and could not be restored.',
      };
    }

    const validTasks = parsed.filter(isValidTaskRecord);
    return { data: validTasks, error: null };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Unable to read tasks from browser storage.';
    return {
      data: [],
      error: `Storage read error: ${message}`,
    };
  }
}

/**
 * Persists the current list of tasks to LocalStorage and reports storage errors (e.g. quota exceeded).
 */
export function saveTasks(tasks: Task[]): string | null {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return null;
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Unable to save tasks to browser storage.';
    return `Storage save error: ${message}`;
  }
}
