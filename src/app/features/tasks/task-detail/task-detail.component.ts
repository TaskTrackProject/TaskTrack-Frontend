import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { Task, TaskPriority, TaskStatus } from '../../../core/models/task.model';
import { Tag } from '../../../core/models/tag.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    NzAlertModule,
    NzButtonModule,
    NzCardModule,
    NzDescriptionsModule,
    NzIconModule,
    NzSpinModule,
    NzTagModule,
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  task?: Task;
  loading = true;
  errorMessage = '';

  readonly TaskStatus = TaskStatus;
  readonly TaskPriority = TaskPriority;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (idParam && !isNaN(id)) {
      this.loadTask(id);
    } else {
      this.loading = false;
      this.errorMessage = 'Invalid task ID.';
    }
  }

  loadTask(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.taskService.getById(id).subscribe({
      next: (task) => {
        if (task && !task.tags) {
          task.tags = [];
        }
        this.task = task;
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load task details.';
        this.changeDetector.markForCheck();
      },
    });
  }

  getStatusLabel(status?: TaskStatus): string {
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

  getStatusText(status?: TaskStatus): string {
    return this.getStatusLabel(status);
  }

  getStatusColor(status?: TaskStatus): string {
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

  getPriorityLabel(priority?: TaskPriority): string {
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

  getPriorityText(priority?: TaskPriority): string {
    return this.getPriorityLabel(priority);
  }

  getPriorityColor(priority?: TaskPriority): string {
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

  getTagColor(tag: Tag): string {
    return tag.color || 'blue';
  }
}
