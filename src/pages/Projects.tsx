import { useState } from 'react';
import { FolderKanban, Plus, Search } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectForm } from '../components/projects/ProjectForm';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';
import type { Project, ProjectStatus } from '../types';
import { cn } from '../utils/cn';

const statusTabs: { value: 'all' | ProjectStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

export function Projects() {
  const { projects } = useAppStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | ProjectStatus>('all');

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || p.status === activeTab;
    return matchesSearch && matchesTab;
  });

  function handleEdit(project: Project) {
    setEditProject(project);
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
    setEditProject(null);
  }

  return (
    <>
      <Header title="Projects" onNewProject={() => setFormOpen(true)} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="sm:max-w-xs"
          />
          <Button onClick={() => setFormOpen(true)} className="shrink-0">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Status Tabs */}
        <div className="mb-6 flex items-center gap-1 overflow-x-auto">
          {statusTabs.map((tab) => {
            const count = tab.value === 'all'
              ? projects.length
              : projects.filter((p) => p.status === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                  activeTab === tab.value
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                )}
              >
                {tab.label}
                <span className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                  activeTab === tab.value
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FolderKanban className="h-8 w-8" />}
            title={search ? 'No projects match your search' : 'No projects yet'}
            description={
              search
                ? 'Try a different search term or clear the filter.'
                : 'Create your first project to start organizing your work.'
            }
            action={
              !search ? (
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="h-4 w-4" /> New Project
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      <ProjectForm
        isOpen={formOpen}
        onClose={handleCloseForm}
        editProject={editProject}
      />
    </>
  );
}
