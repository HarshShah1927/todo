import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskFilters, TaskSort } from '@/types/task';

interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
  sort: TaskSort;
  groupByStatus: boolean;
}

const initialState: TaskState = {
  tasks: [],
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
  groupByStatus: true,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    setFilters: (state, action: PayloadAction<Partial<TaskFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSort: (state, action: PayloadAction<TaskSort>) => {
      state.sort = action.payload;
    },
    toggleGroupByStatus: (state) => {
      state.groupByStatus = !state.groupByStatus;
    },
    loadTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  setFilters,
  setSort,
  toggleGroupByStatus,
  loadTasks,
} = taskSlice.actions;

export default taskSlice.reducer;