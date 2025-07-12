
export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed';

export type Project = {
  id: string;
  title: string;
  tasks: Task[];
  completedTasks: number;
  totalTasks: number;
  status: ProjectStatus;
};