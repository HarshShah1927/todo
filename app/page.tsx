'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addTask, updateTask, deleteTask, setFilters, setSort, toggleGroupByStatus, loadTasks } from '@/store/taskSlice';
import { filterTasks, sortTasks } from '@/utils/taskUtils';
import { Task, TaskFormData } from '@/types/task';
import { Toast, Toaster } from '@/components/ui/toast';
import TaskModal from '@/components/TaskModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import TaskFilters from '@/components/TaskFilters';
import TaskList from '@/components/TaskList';
import ThemeToggle from '@/components/ThemeToggle';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { tasks, filters, sort, groupByStatus } = useAppSelector(state => state.tasks);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        dispatch(loadTasks(parsedTasks));
      } catch (error) {
        console.error('Failed to load tasks from localStorage:', error);
      }
    }
  }, [dispatch]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const newToast: Toast = {
      ...toast,
      id: Date.now().toString(),
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleCreateTask = (taskData: TaskFormData) => {
    dispatch(addTask(taskData));
    showToast({
      type: 'success',
      title: 'Task created successfully',
      description: `"${taskData.title}" has been added to your tasks.`,
    });
  };

  const handleUpdateTask = (taskData: TaskFormData) => {
    if (editingTask) {
      dispatch(updateTask({ ...editingTask, ...taskData }));
      showToast({
        type: 'success',
        title: 'Task updated successfully',
        description: `"${taskData.title}" has been updated.`,
      });
    }
  };

  const handleDeleteTask = () => {
    if (deletingTaskId) {
      const task = tasks.find(t => t.id === deletingTaskId);
      dispatch(deleteTask(deletingTaskId));
      showToast({
        type: 'success',
        title: 'Task deleted successfully',
        description: task ? `"${task.title}" has been removed.` : 'Task has been removed.',
      });
      setDeletingTaskId(null);
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(undefined);
    setIsTaskModalOpen(true);
  };

  const closeModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
  };

  const filteredTasks = filterTasks(tasks, filters);
  const sortedTasks = sortTasks(filteredTasks, sort);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">TaskFlow</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your tasks efficiently with smart filtering and organization
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <ThemeToggle />
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Tasks', value: tasks.length, color: 'bg-blue-500' },
            { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: 'bg-gray-500' },
            { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: 'bg-yellow-500' },
            { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: 'bg-green-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${stat.color} mr-3`}></div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <TaskFilters
            filters={filters}
            sort={sort}
            groupByStatus={groupByStatus}
            onFiltersChange={(newFilters) => dispatch(setFilters(newFilters))}
            onSortChange={(newSort) => dispatch(setSort(newSort))}
            onToggleGrouping={() => dispatch(toggleGroupByStatus())}
          />
        </div>

        {/* Task List */}
        <TaskList
          tasks={sortedTasks}
          groupByStatus={groupByStatus}
          onEditTask={openEditModal}
          onDeleteTask={setDeletingTaskId}
        />

        {/* Modals */}
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={closeModal}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          task={editingTask}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
        />

        <ConfirmDialog
          isOpen={!!deletingTaskId}
          onClose={() => setDeletingTaskId(null)}
          onConfirm={handleDeleteTask}
          title="Delete Task"
          description="Are you sure you want to delete this task? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />

        {/* Toast Notifications */}
        <Toaster toasts={toasts} onClose={removeToast} />

        {/* Floating Action Button for Mobile */}
        <button
          onClick={openCreateModal}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 md:hidden"
          title="Add Task"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}