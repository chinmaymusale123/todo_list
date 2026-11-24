import type { TaskFormValues, ValidationErrors } from '../types/todo';

export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;

/**
 * Checks whether a YYYY-MM-DD string represents a real calendar date.
 */
function isValidCalendarDate(dateString: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }
  const [year, month, day] = dateString.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
}

/**
 * Validates task form fields prior to creating or updating a task.
 * Requires a non-empty title and description, and validates optional dueDate format.
 */
export function validateTaskInput(values: TaskFormValues): ValidationErrors {
  const errors: ValidationErrors = {};
  const trimmedTitle = values.title.trim();
  const trimmedDescription = values.description.trim();
  const trimmedDueDate = values.dueDate.trim();

  if (!trimmedTitle) {
    errors.title = 'Task title is required.';
  } else if (trimmedTitle.length < 2) {
    errors.title = 'Task title must be at least 2 characters.';
  } else if (trimmedTitle.length > TITLE_MAX_LENGTH) {
    errors.title = `Task title cannot exceed ${TITLE_MAX_LENGTH} characters.`;
  }

  if (!trimmedDescription) {
    errors.description = 'Task description is required.';
  } else if (trimmedDescription.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters.`;
  }

  if (trimmedDueDate && !isValidCalendarDate(trimmedDueDate)) {
    errors.dueDate = 'Please enter a valid calendar date.';
  }

  return errors;
}

export type DueDateState = 'none' | 'overdue' | 'today' | 'upcoming';

/**
 * Evaluates a task's due date relative to the user's current local date.
 */
export function getDueDateStatus(dueDate: string, completed: boolean): DueDateState {
  if (!dueDate || completed) {
    return 'none';
  }

  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;

  if (dueDate < todayIso) {
    return 'overdue';
  }
  if (dueDate === todayIso) {
    return 'today';
  }
  return 'upcoming';
}

/**
 * Formats an ISO YYYY-MM-DD date string into a readable short label (e.g. "Nov 24, 2026").
 */
export function formatDueDate(dueDate: string): string {
  if (!dueDate || !isValidCalendarDate(dueDate)) {
    return '';
  }
  const [year, month, day] = dueDate.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
