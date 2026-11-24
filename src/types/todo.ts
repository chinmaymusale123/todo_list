/**
 * Core domain types for the My To-Do List application.
 */

export type TaskFilter = 'all' | 'pending' | 'completed';

export interface Task {
  /** Unique identifier generated per task */
  id: string;
  /** Required short title of the task */
  title: string;
  /** Detailed task description (optional or descriptive text) */
  description: string;
  /** Optional ISO date string (YYYY-MM-DD) */
  dueDate: string;
  /** Whether the task has been marked completed */
  completed: boolean;
  /** ISO timestamp when the task was created */
  createdAt: string;
  /** ISO timestamp when the task was last modified */
  updatedAt: string;
}

export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
}

export interface ValidationErrors {
  title?: string;
  description?: string;
  dueDate?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
}
