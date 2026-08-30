import { useState } from 'react';

import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';
import { useAppStore } from '../../store/useAppStore';
import { toInputDate } from '../../utils/formatDate';

import type { Task, Priority, TaskStatus } from '../../types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTask?: Task | null;
  defaultProjectId?: string;
}

interface FormValues {
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  tags: string;
}

interface FormErrors {
  title?: string;
  projectId?: string;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.title.trim()) errors.title = 'Task title is required.';
  if (!values.projectId) errors.projectId = 'Please select a project.';
  return errors;
}

export function TaskForm({ isOpen, onClose, editTask, defaultProjectId }: TaskFormProps) {
  const { projects, addTask, updateTask, addToast } = useAppStore();

  const [values, setValues] = useState<FormValues>({
    title: editTask?.title || '',
    description: editTask?.description || '',
    projectId: editTask?.projectId || defaultProjectId || projects[0]?.id || '',
    status: editTask?.status || 'todo',
    priority: editTask?.priority || 'medium',
    dueDate: toInputDate(editTask?.dueDate || null),
    tags: editTask?.tags.join(', ') || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const parsedTags = values.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (editTask) {
      updateTask(editTask.id, {
        title: values.title.trim(),
        description: values.description.trim(),
        projectId: values.projectId,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        tags: parsedTags,
      });
      addToast({ type: 'success', title: 'Task updated', message: `"${values.title}" has been updated.` });
    } else {
      addTask({
        title: values.title.trim(),
        description: values.description.trim(),
        projectId: values.projectId,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        tags: parsedTags,
        subtasks: [],
      });
      addToast({ type: 'success', title: 'Task created', message: `"${values.title}" was added.` });
    }

    onClose();
    setValues({
      title: '', description: '', projectId: defaultProjectId || projects[0]?.id || '',
      status: 'todo', priority: 'medium', dueDate: '', tags: '',
    });
    setErrors({});
  }

  function handleClose() {
    onClose();
    setErrors({});
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editTask ? 'Edit Task' : 'New Task'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="task-form">
            {editTask ? 'Save Changes' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Task Title *"
          placeholder="e.g., Design the onboarding flow"
          value={values.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          autoFocus
        />

        <Textarea
          label="Description"
          placeholder="Describe the task in more detail..."
          value={values.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Project *"
            value={values.projectId}
            onChange={(e) => handleChange('projectId', e.target.value)}
            error={errors.projectId}
          >
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>

          <Select
            label="Status"
            value={values.status}
            onChange={(e) => handleChange('status', e.target.value as TaskStatus)}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            value={values.priority}
            onChange={(e) => handleChange('priority', e.target.value as Priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Select>

          <Input
            label="Due Date"
            type="date"
            value={values.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
          />
        </div>

        <Input
          label="Tags"
          placeholder="e.g., design, frontend, api"
          value={values.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
        />
        <p className="!mt-1 text-xs text-slate-400">Separate tags with commas</p>
      </form>
    </Modal>
  );
}
