import AsyncStorage from '@react-native-async-storage/async-storage';

const PROJECTS_KEY = '@projects';

export const getProjects = async (): Promise<Project[]> => {
  const jsonValue = await AsyncStorage.getItem(PROJECTS_KEY);
  return jsonValue ? JSON.parse(jsonValue) : [];
};

export const saveProjects = async (projects: Project[]): Promise<void> => {
  await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

export const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Sample Project',
    tasks: [],
    completedTasks: 0,
    totalTasks: 0,
    status: 'Not Started'
  }
];

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