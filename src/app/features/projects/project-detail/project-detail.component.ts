import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { Project, ProjectStatus } from '../../../core/models/project.model';
import { Task, TaskStatus, TaskPriority } from '../../../core/models/task.model';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzCardModule,
    NzTableModule,
    NzTagModule,
    NzIconModule,
    NzSpinModule,
    NzAlertModule,
    NzButtonModule,
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private changeDetector = inject(ChangeDetectorRef);

  projectId: number | null = null;
  project: Project | null = null;
  tasks: Task[] = [];

  loadingProject = false;
  loadingTasks = false;
  error: string | null = null;
  tasksError: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.projectId = +id;
        this.loadProjectDetails(this.projectId);
        this.loadProjectTasks(this.projectId);
      }
    });
  }

  loadProjectDetails(id: number): void {
    this.loadingProject = true;
    this.error = null;
    this.projectService
      .getById(id)
      .pipe(finalize(() => (this.loadingProject = false)))
      .subscribe({
        next: (project) => {
          this.project = project;
          this.changeDetector.markForCheck();
        },
        error: (err) => {
          this.error = 'Failed to load project details.';
          console.error(err);
        },
      });
  }

  loadProjectTasks(id: number): void {
    this.loadingTasks = true;
    this.tasksError = null;
    this.taskService
      .getByProject(id)
      .pipe(finalize(() => (this.loadingTasks = false)))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks || [];
          this.changeDetector.markForCheck();
        },
        error: (err) => {
          this.tasksError = 'Failed to load project tasks.';
          this.changeDetector.markForCheck();
          console.error(err);
        },
      });
  }

  getProjectStatusLabel(status: number): string {
    switch (status) {
      case 0:
        return 'Not Started';
      case 1:
        return 'In Progress';
      case 2:
        return 'Completed';
      case 3:
        return 'On Hold';
      default:
        return 'Unknown';
    }
  }

  getProjectStatusColor(status: number): string {
    switch (status) {
      case 0:
        return 'default';
      case 1:
        return 'processing';
      case 2:
        return 'success';
      case 3:
        return 'warning';
      default:
        return 'default';
    }
  }

  getTaskStatusLabel(status: number): string {
    switch (status) {
      case 0:
        return 'To Do';
      case 1:
        return 'In Progress';
      case 2:
        return 'Done';
      case 3:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  getTaskStatusColor(status: number): string {
    switch (status) {
      case 0:
        return 'default';
      case 1:
        return 'processing';
      case 2:
        return 'success';
      case 3:
        return 'error';
      default:
        return 'default';
    }
  }

  getTaskPriorityLabel(priority: number): string {
    switch (priority) {
      case 0:
        return 'Low';
      case 1:
        return 'Medium';
      case 2:
        return 'High';
      case 3:
        return 'Critical';
      default:
        return 'Unknown';
    }
  }

  getTaskPriorityColor(priority: number): string {
    switch (priority) {
      case 0:
        return 'success';
      case 1:
        return 'processing';
      case 2:
        return 'warning';
      case 3:
        return 'error';
      default:
        return 'default';
    }
  }
}
