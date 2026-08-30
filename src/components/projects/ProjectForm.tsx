import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/Input';
import { useAppStore } from '../../store/useAppStore';
import { toInputDate } from '../../utils/formatDate';
import type { Project, ProjectStatus } from '../../types';

const PROJECT_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#ec4899',
];

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  editProject?: Project | null;
}

interface FormValues {
  name: string;
  description: string;
  color: string;
  status: ProjectStatus;
  dueDate: string;
  tags: string;
}

interface FormErrors {
  name?: string;
}

export function ProjectForm({ isOpen, onClose, editProject }: ProjectFormProps) {
  const { addProject, updateProject, addToast } = useAppStore();

  const [values, setValues] = useState<FormValues>({
    name: editProject?.name || '',
    description: editProject?.description || '',
    color: editProject?.color || PROJECT_COLORS[0],
    status: editProject?.status || 'active',
    dueDate: toInputDate(editProject?.dueDate || null),
    tags: editProject?.tags.join(', ') || '',
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
    const validationErrors: FormErrors = {};
    if (!values.name.trim()) validationErrors.name = 'Project name is required.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const parsedTags = values.tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (editProject) {
      updateProject(editProject.id, {
        name: values.name.trim(),
        description: values.description.trim(),
        color: values.color,
        status: values.status,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        tags: parsedTags,
      });
      addToast({ type: 'success', title: 'Project updated', message: `"${values.name}" has been updated.` });
    } else {
      addProject({
        name: values.name.trim(),
        description: values.description.trim(),
        color: values.color,
        status: values.status,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        tags: parsedTags,
      });
      addToast({ type: 'success', title: 'Project created', message: `"${values.name}" is ready.` });
    }

    onClose();
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
      title={editProject ? 'Edit Project' : 'New Project'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="project-form">
            {editProject ? 'Save Changes' : 'Create Project'}
          </Button>
        </>
      }
    >
      <form id="project-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Project Name *"
          placeholder="e.g., Website Redesign"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          autoFocus
        />

        <Textarea
          label="Description"
          placeholder="What is this project about?"
          value={values.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            value={values.status}
            onChange={(e) => handleChange('status', e.target.value as ProjectStatus)}
          >
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
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
          placeholder="e.g., design, frontend, urgent"
          value={values.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
        />

        {/* Color picker */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Project Color</p>
          <div className="flex gap-2">
            {PROJECT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleChange('color', color)}
                className="h-7 w-7 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    backgroundColor: color,
                    outline: values.color === color ? `3px solid ${color}` : 'none',
                    outlineOffset: '2px',
                  }}
                aria-label={`Select color ${color}`}
                aria-pressed={values.color === color}
              />
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}
