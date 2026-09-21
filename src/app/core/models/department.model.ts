export interface Department {
  departmentID: number;
  departmentName: string;
  departmentDescription?: string;
  isActive: boolean;
}

export interface DepartmentRequest {
  departmentName: string;
  departmentDescription?: string;
  isActive?: boolean;
}