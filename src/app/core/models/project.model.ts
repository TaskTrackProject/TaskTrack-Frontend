export enum ProjectStatus {
  NotStarted = 0,
  InProgress = 1,
  Completed = 2,
  OnHold = 3
}

export interface Project {
  projectID: number;
  projectName: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  departmentID: number;
  departmentName?: string;
  isActive: boolean;
  createdDate: string;
}

export interface ProjectRequest {
  projectName: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  departmentID: number;
  isActive?: boolean;
}

export interface ProjectSearchParams {
  name?: string;
  status?: ProjectStatus;
  departmentId?: number;
}