'use client';

import { Task } from '@/types/task';
import { groupTasksByStatus } from '@/utils/taskUtils';
import TaskCard from './TaskCard';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TaskListProps {
  tasks: Task[];
  groupByStatus: boolean;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

const statusOrder = ['pending', 'in-progress', 'completed'];

export default function TaskList({ tasks, groupByStatus, onEditTask, onDeleteTask }: TaskListProps) {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (status: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">No tasks found</div>
        <p className="text-gray-500 dark:text-gray-400">Create your first task to get started!</p>
      </div>
    );
  }

  if (!groupByStatus) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    );
  }

  const groupedTasks = groupTasksByStatus(tasks);

  return (
    <div className="space-y-6">
      {statusOrder.map((status) => {
        const statusTasks = groupedTasks[status] || [];
        if (statusTasks.length === 0) return null;

        const isCollapsed = collapsedSections[status];

        return (
          <div key={status} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => toggleSection(status)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {statusLabels[status as keyof typeof statusLabels]}
                </h3>
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                  {statusTasks.length}
                </span>
              </div>
            </button>

            {!isCollapsed && (
              <div className="p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {statusTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}