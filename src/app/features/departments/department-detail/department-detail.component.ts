import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { DepartmentService } from '../../../core/services/department.service';
import {
  Department
} from '../../../core/models/department.model';

import {
  ProjectStatus
} from '../../../core/models/project.model';

@Component({
  selector: 'app-department-detail',
  standalone: true,
  imports: [
    RouterLink,
    NzAlertModule,
    NzCardModule,
    NzIconModule,
    NzSpinModule,
    NzTagModule
  ],
  templateUrl: './department-detail.component.html',
  styleUrl: './department-detail.component.scss'
})
export class DepartmentDetailComponent
  implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly departmentService =
    inject(DepartmentService);

  department?: Department;

  loading = true;

  errorMessage = '';

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadDepartment(id);
  }

  private loadDepartment(id: number): void {

    this.departmentService
      .getById(id)
      .subscribe({

        next: department => {
          this.department = department;
          this.loading = false;
        },

        error: () => {
          this.loading = false;
          this.errorMessage =
            'Unable to load department.';
        }

      });
  }

  getProjectStatusLabel(
    status: ProjectStatus
  ): string {

    switch (status) {
      case ProjectStatus.NotStarted:
        return 'Not Started';

      case ProjectStatus.InProgress:
        return 'In Progress';

      case ProjectStatus.Completed:
        return 'Completed';

      case ProjectStatus.OnHold:
        return 'On Hold';

      default:
        return 'Unknown';
    }
  }

  getProjectStatusColor(
    status: ProjectStatus
  ): string {

    switch (status) {
      case ProjectStatus.InProgress:
        return 'processing';

      case ProjectStatus.Completed:
        return 'success';

      case ProjectStatus.OnHold:
        return 'warning';

      default:
        return 'default';
    }
  }
}