import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Project, ProjectRequest, ProjectSearchParams } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/projects`;

  getAll(): Observable<Project[]> {
    return this.http
      .get<Project[]>(this.apiUrl)
      .pipe(map((projects) => projects.map((project) => this.toProject(project))));
  }

  getById(id: number): Observable<Project> {
    return this.http
      .get<Project>(`${this.apiUrl}/${id}`)
      .pipe(map((project) => this.toProject(project)));
  }

  getByDepartment(departmentId: number): Observable<Project[]> {
    return this.http
      .get<Project[]>(`${this.apiUrl}/department/${departmentId}`)
      .pipe(map((projects) => projects.map((project) => this.toProject(project))));
  }

  create(request: ProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, this.toRequest(request));
  }

  update(id: number, request: ProjectRequest): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, this.toRequest(request));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(params: ProjectSearchParams): Observable<Project[]> {
    let httpParams = new HttpParams();

    if (params.name) {
      httpParams = httpParams.set('name', params.name);
    }

    if (params.status !== undefined) {
      httpParams = httpParams.set('status', params.status);
    }

    if (params.departmentId !== undefined) {
      httpParams = httpParams.set('departmentId', params.departmentId);
    }

    return this.http
      .get<Project[]>(`${this.apiUrl}/search`, {
        params: httpParams,
      })
      .pipe(map((projects) => projects.map((project) => this.toProject(project))));
  }

  private toProject(project: Project): Project {
    const response = project as Project & {
      projectId?: number;
      departmentId?: number;
    };

    return {
      ...project,
      projectID: response.projectID ?? response.projectId!,
      departmentID: response.departmentID ?? response.departmentId!,
    };
  }

  private toRequest(request: ProjectRequest): Record<string, unknown> {
    return {
      projectName: request.projectName,
      description: request.description,
      startDate: request.startDate.substring(0, 10),
      endDate: request.endDate?.substring(0, 10),
      status: request.status,
      departmentId: request.departmentID,
    };
  }
}
