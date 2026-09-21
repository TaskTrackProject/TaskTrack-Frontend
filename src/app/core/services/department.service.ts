import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Department, DepartmentRequest } from '../models/department.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/departments`;

  getAll(): Observable<Department[]> {
    return this.http
      .get<Department[]>(this.apiUrl)
      .pipe(map((departments) => departments.map((department) => this.toDepartment(department))));
  }

  getById(id: number): Observable<Department> {
    return this.http
      .get<Department>(`${this.apiUrl}/${id}`)
      .pipe(map((department) => this.toDepartment(department)));
  }

  create(request: DepartmentRequest): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, request);
  }

  update(id: number, request: DepartmentRequest): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(name: string): Observable<Department[]> {
    return this.getAll().pipe(
      map((departments) =>
        departments.filter((department) =>
          department.departmentName.toLowerCase().includes(name.toLowerCase()),
        ),
      ),
    );
  }

  private toDepartment(department: Department): Department {
    const response = department as Department & { departmentId?: number };

    return {
      ...department,
      departmentID: response.departmentID ?? response.departmentId!,
    };
  }
}
