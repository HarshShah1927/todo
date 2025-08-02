'use client';

import { Search, Filter, SortAsc, SortDesc, LayoutGrid, List } from 'lucide-react';
import { TaskFilters, TaskSort } from '@/types/task';

interface TaskFiltersProps {
  filters: TaskFilters;
  sort: TaskSort;
  groupByStatus: boolean;
  onFiltersChange: (filters: Partial<TaskFilters>) => void;
  onSortChange: (sort: TaskSort) => void;
  onToggleGrouping: () => void;
}

export default function TaskFiltersComponent({
  filters,
  sort,
  groupByStatus,
  onFiltersChange,
  onSortChange,
  onToggleGrouping,
}: TaskFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ status: e.target.value as any })}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={filters.priority}
            onChange={(e) => onFiltersChange({ priority: e.target.value as any })}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2">
          <select
            value={sort.field}
            onChange={(e) => onSortChange({ ...sort, field: e.target.value as any })}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
          <button
            onClick={() => onSortChange({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title={`Sort ${sort.direction === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sort.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </button>
        </div>

        {/* Group Toggle */}
        <button
          onClick={onToggleGrouping}
          className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors ${
            groupByStatus
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
          title={groupByStatus ? 'List View' : 'Group View'}
        >
          {groupByStatus ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          <span className="text-sm">{groupByStatus ? 'List' : 'Group'}</span>
        </button>
      </div>
    </div>
  );
}