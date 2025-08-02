import { Task, TaskFilters, TaskSort } from '@/types/task';
import { isAfter, isBefore, parseISO } from 'date-fns';

export const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  return tasks.filter(task => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(searchTerm);
      const matchesDescription = task.description?.toLowerCase().includes(searchTerm);
      if (!matchesTitle && !matchesDescription) return false;
    }

    // Status filter
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    return true;
  });
};

export const sortTasks = (tasks: Task[], sort: TaskSort): Task[] => {
  return [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else {
          const dateA = parseISO(a.dueDate);
          const dateB = parseISO(b.dueDate);
          comparison = isBefore(dateA, dateB) ? -1 : isAfter(dateA, dateB) ? 1 : 0;
        }
        break;
      case 'priority':
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
        break;
      case 'createdAt':
        const createdA = parseISO(a.createdAt);
        const createdB = parseISO(b.createdAt);
        comparison = isBefore(createdA, createdB) ? -1 : isAfter(createdA, createdB) ? 1 : 0;
        break;
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });
};

export const groupTasksByStatus = (tasks: Task[]) => {
  return tasks.reduce((groups, task) => {
    const status = task.status;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(task);
    return groups;
  }, {} as Record<string, Task[]>);
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-800';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800';
    case 'in-progress':
      return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800';
    case 'pending':
      return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-800';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-800';
  }
};