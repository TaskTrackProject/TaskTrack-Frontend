import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Task, TaskRequest, TaskSearchParams } from '../models/task.model';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  getAll(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.apiUrl)
      .pipe(map((tasks) => tasks.map((task) => this.toTask(task))));
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(map((task) => this.toTask(task)));
  }

  getByProject(projectId: number): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.apiUrl}/project/${projectId}`)
      .pipe(map((tasks) => tasks.map((task) => this.toTask(task))));
  }

  create(request: TaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, this.toRequest(request));
  }

  update(id: number, request: TaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, this.toRequest(request));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(params: TaskSearchParams): Observable<Task[]> {
    let httpParams = new HttpParams();

    if (params.title) {
      httpParams = httpParams.set('title', params.title);
    }

    if (params.status !== undefined) {
      httpParams = httpParams.set('status', params.status);
    }

    if (params.priority !== undefined) {
      httpParams = httpParams.set('priority', params.priority);
    }

    if (params.projectId !== undefined) {
      httpParams = httpParams.set('projectId', params.projectId);
    }

    if (params.tagId !== undefined) {
      httpParams = httpParams.set('tagId', params.tagId);
    }

    return this.http
      .get<Task[]>(`${this.apiUrl}/search`, { params: httpParams })
      .pipe(map((tasks) => tasks.map((task) => this.toTask(task))));
  }

  private toTask(task: Task): Task {
    const response = task as Task & {
      taskId?: number;
      taskName?: string;
      projectId?: number;
    };

    return {
      ...task,
      taskID: response.taskID ?? response.taskId!,
      title: response.title ?? response.taskName ?? '',
      projectID: response.projectID ?? response.projectId!,
      tags: (task.tags ?? []).map((tag) => ({
        ...tag,
        tagID: (tag as Tag & { tagId?: number }).tagID ?? (tag as Tag & { tagId?: number }).tagId!,
      })),
    };
  }

  private toRequest(request: TaskRequest): Record<string, unknown> {
    return {
      title: request.title,
      description: request.description,
      status: request.status,
      priority: request.priority,
      dueDate: request.dueDate?.substring(0, 10),
      projectId: request.projectID,
      tagIds: request.tagIDs ?? [],
    };
  }
}
