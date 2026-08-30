import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import type { SortField } from '../../types';

export function TaskFiltersBar() {
  const { filters, setFilter, resetFilters, projects } = useAppStore();

  const hasActiveFilters =
    filters.search ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.projectId !== 'all';

  return (
    <div className="space-y-3">
      {/* Search */}
      <Input
        placeholder="Search tasks by title, description, or tag..."
        value={filters.search}
        onChange={(e) => setFilter('search', e.target.value)}
        leftIcon={<Search className="h-4 w-4" />}
      />

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400" />

        <Select
          value={filters.projectId}
          onChange={(e) => setFilter('projectId', e.target.value)}
          className="w-auto min-w-[120px]"
          aria-label="Filter by project"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>

        <Select
          value={filters.status}
          onChange={(e) => setFilter('status', e.target.value as typeof filters.status)}
          className="w-auto min-w-[110px]"
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="in_review">In Review</option>
          <option value="done">Done</option>
        </Select>

        <Select
          value={filters.priority}
          onChange={(e) => setFilter('priority', e.target.value as typeof filters.priority)}
          className="w-auto min-w-[110px]"
          aria-label="Filter by priority"
        >
          <option value="all">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>

        <div className="flex items-center gap-1 ml-auto">
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
          <Select
            value={filters.sortField}
            onChange={(e) => setFilter('sortField', e.target.value as SortField)}
            className="w-auto min-w-[110px]"
            aria-label="Sort by"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setFilter('sortDirection', filters.sortDirection === 'asc' ? 'desc' : 'asc')
            }
            aria-label={`Sort ${filters.sortDirection === 'asc' ? 'descending' : 'ascending'}`}
            title={`Sort ${filters.sortDirection === 'asc' ? 'descending' : 'ascending'}`}
          >
            <span className="text-xs font-bold">
              {filters.sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
