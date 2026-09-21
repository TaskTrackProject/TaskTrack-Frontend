import { Tag } from './tag.model';

export enum TaskStatus {
  ToDo = 0,
  InProgress = 1,
  Done = 2,
  Cancelled = 3
}

export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

export interface Task {
  taskID: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectID: number;
  projectName?: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string;
  tags: Tag[];
}

export interface TaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectID: number;
  tagIDs?: number[];
}

export interface TaskSearchParams {
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: number;
  tagId?: number;
}