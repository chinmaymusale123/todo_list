import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import type { TaskFormValues, ValidationErrors } from '../types/todo';
import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  validateTaskInput,
} from '../utils/validation';

interface TaskFormProps {
  onAddTask: (values: TaskFormValues) => void;
}

const INITIAL_VALUES: TaskFormValues = {
  title: '',
  description: '',
  dueDate: '',
};

/**
 * Input form component for creating a new task with title, description,
 * optional due date, and inline validation feedback.
 */
export function TaskForm({ onAddTask }: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const handleFieldChange = (field: keyof TaskFormValues, nextValue: string) => {
    const nextValues = { ...values, [field]: nextValue };
    setValues(nextValues);

    // Re-validate dynamically after the first failed submit attempt
    if (submittedOnce) {
      setErrors(validateTaskInput(nextValues));
    } else if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedOnce(true);

    const validationErrors = validateTaskInput(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onAddTask({
      title: values.title.trim(),
      description: values.description.trim(),
      dueDate: values.dueDate.trim(),
    });

    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmittedOnce(false);
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmittedOnce(false);
  };

  const hasInput =
    values.title.length > 0 ||
    values.description.length > 0 ||
    values.dueDate.length > 0;

  return (
    <section
      aria-labelledby="add-task-heading"
      className="bg-white border border-slate-200 rounded-xl p-6"
    >
      <div className="mb-5">
        <h2
          id="add-task-heading"
          className="text-lg font-semibold text-slate-900 tracking-tight"
        >
          Add New Task
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Enter a title, description, and optional target date.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Title Input */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-slate-800"
            >
              Task Title <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <span className="text-xs font-mono tabular-nums text-slate-400">
              {values.title.trim().length}/{TITLE_MAX_LENGTH}
            </span>
          </div>
          <input
            id="task-title"
            name="title"
            type="text"
            value={values.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            maxLength={TITLE_MAX_LENGTH + 10}
            placeholder="e.g., Prepare quarterly budget review"
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'task-title-error' : undefined}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${
              errors.title
                ? 'border-red-500 bg-red-50/40'
                : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
          />
          {errors.title && (
            <p
              id="task-title-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label
              htmlFor="task-description"
              className="block text-sm font-medium text-slate-800"
            >
              Description <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <span className="text-xs font-mono tabular-nums text-slate-400">
              {values.description.trim().length}/{DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
          <textarea
            id="task-description"
            name="description"
            rows={3}
            value={values.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            maxLength={DESCRIPTION_MAX_LENGTH + 20}
            placeholder="Add clear details or next steps for this task..."
            aria-required="true"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'task-description-error' : undefined}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors resize-y min-h-[88px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${
              errors.description
                ? 'border-red-500 bg-red-50/40'
                : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
          />
          {errors.description && (
            <p
              id="task-description-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        {/* Optional Due Date Input */}
        <div>
          <label
            htmlFor="task-due-date"
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Due Date <span className="text-xs font-normal text-slate-500">(Optional)</span>
          </label>
          <input
            id="task-due-date"
            name="dueDate"
            type="date"
            value={values.dueDate}
            onChange={(e) => handleFieldChange('dueDate', e.target.value)}
            aria-invalid={Boolean(errors.dueDate)}
            aria-describedby={errors.dueDate ? 'task-due-date-error' : undefined}
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${
              errors.dueDate
                ? 'border-red-500 bg-red-50/40'
                : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
          />
          {errors.dueDate && (
            <p
              id="task-due-date-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.dueDate}</span>
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 min-h-[42px] text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Add Task</span>
          </button>

          {hasInput && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 min-h-[42px] text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
