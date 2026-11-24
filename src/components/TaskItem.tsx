import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Check,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import type { Task, TaskFormValues, ValidationErrors } from '../types/todo';
import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  formatDueDate,
  getDueDateStatus,
  validateTaskInput,
} from '../utils/validation';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onUpdateTask: (id: string, updates: TaskFormValues) => void;
  onRequestDelete: (task: Task) => void;
}

/**
 * Renders an individual task item with completion toggle, inline editing
 * with validation, and delete confirmation trigger.
 */
export function TaskItem({
  task,
  onToggleComplete,
  onUpdateTask,
  onRequestDelete,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<TaskFormValues>({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Sync draft when task prop updates externally
  useEffect(() => {
    if (!isEditing) {
      setDraft({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
      });
    }
  }, [task.title, task.description, task.dueDate, isEditing]);

  const handleStartEdit = () => {
    setDraft({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
    });
    setErrors({});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraft({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleSaveEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateTaskInput(draft);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onUpdateTask(task.id, {
      title: draft.title.trim(),
      description: draft.description.trim(),
      dueDate: draft.dueDate.trim(),
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleCancelEdit();
    }
  };

  const dueDateStatus = getDueDateStatus(task.dueDate, task.completed);
  const formattedDate = formatDueDate(task.dueDate);

  if (isEditing) {
    return (
      <li className="p-5 bg-slate-50/70 border-b border-slate-200 last:border-b-0">
        <form
          onSubmit={handleSaveEdit}
          onKeyDown={handleEditKeyDown}
          noValidate
          className="space-y-3.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Editing Task
            </span>
            <span className="text-xs text-slate-500">Press Esc to cancel</span>
          </div>

          <div>
            <label
              htmlFor={`edit-title-${task.id}`}
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Title
            </label>
            <input
              id={`edit-title-${task.id}`}
              type="text"
              value={draft.title}
              maxLength={TITLE_MAX_LENGTH + 10}
              onChange={(e) => {
                setDraft((prev) => ({ ...prev, title: e.target.value }));
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              aria-invalid={Boolean(errors.title)}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                errors.title ? 'border-red-500' : 'border-slate-300'
              }`}
              autoFocus
            />
            {errors.title && (
              <p
                role="alert"
                className="mt-1 flex items-center gap-1.5 text-xs font-medium text-red-600"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={`edit-desc-${task.id}`}
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Description
            </label>
            <textarea
              id={`edit-desc-${task.id}`}
              rows={2}
              value={draft.description}
              maxLength={DESCRIPTION_MAX_LENGTH + 20}
              onChange={(e) => {
                setDraft((prev) => ({ ...prev, description: e.target.value }));
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }
              }}
              aria-invalid={Boolean(errors.description)}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 bg-white resize-y focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                errors.description ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.description && (
              <p
                role="alert"
                className="mt-1 flex items-center gap-1.5 text-xs font-medium text-red-600"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={`edit-date-${task.id}`}
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Due Date (Optional)
            </label>
            <input
              id={`edit-date-${task.id}`}
              type="date"
              value={draft.dueDate}
              onChange={(e) => {
                setDraft((prev) => ({ ...prev, dueDate: e.target.value }));
                if (errors.dueDate) {
                  setErrors((prev) => ({ ...prev, dueDate: undefined }));
                }
              }}
              aria-invalid={Boolean(errors.dueDate)}
              className={`w-full sm:w-56 rounded-lg border px-3 py-2 text-sm font-mono tabular-nums text-slate-900 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                errors.dueDate ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.dueDate && (
              <p
                role="alert"
                className="mt-1 flex items-center gap-1.5 text-xs font-medium text-red-600"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{errors.dueDate}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 min-h-[40px] text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 min-h-[40px] text-xs font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="px-5 py-4 border-b border-slate-200 last:border-b-0 transition-colors hover:bg-slate-50/70">
      <div className="flex items-start gap-3">
        {/* Completion Checkbox with >=40px Touch Target */}
        <div className="pt-0.5 shrink-0">
          <label className="relative inline-flex items-center justify-center w-10 h-10 -m-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              aria-label={`Mark "${task.title}" as ${
                task.completed ? 'pending' : 'completed'
              }`}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={`flex items-center justify-center w-5 h-5 rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 ${
                task.completed
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white border-slate-300 text-transparent hover:border-slate-400'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          </label>
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="min-w-0">
              <h3
                className={`text-[15px] font-semibold leading-snug break-words ${
                  task.completed
                    ? 'line-through text-slate-400'
                    : 'text-slate-900'
                }`}
              >
                {task.title}
              </h3>
              <p
                className={`mt-1 text-sm leading-relaxed break-words whitespace-pre-line ${
                  task.completed ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {task.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0 sm:ml-4">
              <button
                type="button"
                onClick={handleStartEdit}
                aria-label={`Edit task "${task.title}"`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 min-h-[40px] text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => onRequestDelete(task)}
                aria-label={`Delete task "${task.title}"`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 min-h-[40px] text-xs font-medium text-red-600 transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Unboxed Metadata Row (Zero-Pill Discipline) */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
            <span
              className={`font-medium ${
                task.completed ? 'text-emerald-700' : 'text-slate-600'
              }`}
            >
              {task.completed ? 'Completed' : 'Pending'}
            </span>

            {formattedDate && (
              <>
                <span className="text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 font-mono tabular-nums ${
                    dueDateStatus === 'overdue'
                      ? 'text-red-600 font-medium'
                      : dueDateStatus === 'today'
                      ? 'text-amber-700 font-medium'
                      : 'text-slate-500'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    {dueDateStatus === 'overdue'
                      ? `Overdue: ${formattedDate}`
                      : dueDateStatus === 'today'
                      ? `Due Today: ${formattedDate}`
                      : `Due ${formattedDate}`}
                  </span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
