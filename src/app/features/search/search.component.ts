import {
  Component,
  OnInit,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import {
  Task,
  TaskPriority,
  TaskSearchParams,
  TaskStatus
} from '../../core/models/task.model';
import { Tag } from '../../core/models/tag.model';
import { Project } from '../../core/models/project.model';
import { TaskService } from '../../core/services/task.service';
import { ProjectService } from '../../core/services/project.service';
import { TagService } from '../../core/services/tag.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzTableModule,
    NzTagModule,
    NzIconModule,
    NzSpinModule,
    NzCardModule,
    NzAlertModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly tagService = inject(TagService);

  projects: Project[] = [];
  tags: Tag[] = [];
  tasks: Task[] = [];

  loading = false;
  loadingProjects = false;
  loadingTags = false;
  hasSearched = false;
  errorMessage: string | null = null;

  // Filter models
  title = '';
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: number;
  tagId?: number;

  readonly TaskStatus = TaskStatus;
  readonly TaskPriority = TaskPriority;

  readonly statusOptions = [
    { label: 'To Do', value: TaskStatus.ToDo },
    { label: 'In Progress', value: TaskStatus.InProgress },
    { label: 'Done', value: TaskStatus.Done },
    { label: 'Cancelled', value: TaskStatus.Cancelled }
  ];

  readonly priorityOptions = [
    { label: 'Low', value: TaskPriority.Low },
    { label: 'Medium', value: TaskPriority.Medium },
    { label: 'High', value: TaskPriority.High },
    { label: 'Critical', value: TaskPriority.Critical }
  ];

  ngOnInit(): void {
    this.loadProjects();
    this.loadTags();
  }

  loadProjects(): void {
    this.loadingProjects = true;
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data || [];
        this.loadingProjects = false;
      },
      error: (err) => {
        console.error('Failed to load projects', err);
        this.loadingProjects = false;
      }
    });
  }

  loadTags(): void {
    this.loadingTags = true;
    this.tagService.getAll().subscribe({
      next: (data) => {
        this.tags = data || [];
        this.loadingTags = false;
      },
      error: (err) => {
        console.error('Failed to load tags', err);
        this.loadingTags = false;
      }
    });
  }

  search(): void {
    this.loading = true;
    this.errorMessage = null;

    const params: TaskSearchParams = {};

    if (this.title && this.title.trim()) {
      params.title = this.title.trim();
    }

    if (this.status !== undefined && this.status !== null) {
      params.status = this.status;
    }

    if (this.priority !== undefined && this.priority !== null) {
      params.priority = this.priority;
    }

    if (this.projectId !== undefined && this.projectId !== null) {
      params.projectId = this.projectId;
    }

    if (this.tagId !== undefined && this.tagId !== null) {
      params.tagId = this.tagId;
    }

    this.taskService.search(params).subscribe({
      next: (data) => {
        this.tasks = data || [];
        this.loading = false;
        this.hasSearched = true;
      },
      error: (err) => {
        console.error('Search failed', err);
        this.errorMessage = 'Failed to search tasks. Please try again.';
        this.loading = false;
        this.hasSearched = true;
      }
    });
  }

  clear(): void {
    this.title = '';
    this.status = undefined;
    this.priority = undefined;
    this.projectId = undefined;
    this.tagId = undefined;
    this.tasks = [];
    this.hasSearched = false;
    this.errorMessage = null;
  }

  getStatusLabel(status: TaskStatus | number): string {
    switch (status) {
      case TaskStatus.ToDo:
        return 'To Do';
      case TaskStatus.InProgress:
        return 'In Progress';
      case TaskStatus.Done:
        return 'Done';
      case TaskStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  getStatusColor(status: TaskStatus | number): string {
    switch (status) {
      case TaskStatus.ToDo:
        return 'default';
      case TaskStatus.InProgress:
        return 'processing';
      case TaskStatus.Done:
        return 'success';
      case TaskStatus.Cancelled:
        return 'error';
      default:
        return 'default';
    }
  }

  getPriorityLabel(priority: TaskPriority | number): string {
    switch (priority) {
      case TaskPriority.Low:
        return 'Low';
      case TaskPriority.Medium:
        return 'Medium';
      case TaskPriority.High:
        return 'High';
      case TaskPriority.Critical:
        return 'Critical';
      default:
        return 'Unknown';
    }
  }

  getPriorityColor(priority: TaskPriority | number): string {
    switch (priority) {
      case TaskPriority.Low:
        return 'default';
      case TaskPriority.Medium:
        return 'blue';
      case TaskPriority.High:
        return 'orange';
      case TaskPriority.Critical:
        return 'red';
      default:
        return 'default';
    }
  }
}
