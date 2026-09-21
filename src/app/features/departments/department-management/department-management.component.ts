import { Component, ChangeDetectorRef, OnInit, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../../core/services/department.service';
import { Department, DepartmentRequest } from '../../../core/models/department.model';

@Component({
  selector: 'app-department-management',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzModalModule,
    NzTableModule,
    NzIconModule,
    NzSpinModule,
  ],
  templateUrl: './department-management.component.html',
  styleUrl: './department-management.component.scss',
})
export class DepartmentManagementComponent implements OnInit {
  private readonly service = inject(DepartmentService);

  private readonly fb = inject(FormBuilder);

  private readonly modal = inject(NzModalService);

  private readonly notification = inject(NzNotificationService);

  private readonly changeDetector = inject(ChangeDetectorRef);

  departments: Department[] = [];

  loading = false;

  modalVisible = false;

  editingId: number | null = null;

  searchName = '';

  form = this.fb.nonNullable.group({
    departmentName: ['', [Validators.required, Validators.maxLength(100)]],

    departmentDescription: ['', Validators.maxLength(500)],
  });

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;

    this.service.getAll().subscribe({
      next: (data) => {
        this.departments = data;
        this.loading = false;
        this.changeDetector.markForCheck();
      },

      error: () => {
        this.loading = false;

        this.changeDetector.markForCheck();

        this.notification.error('Error', 'Unable to load departments.');
      },
    });
  }

  search(): void {
    if (!this.searchName.trim()) {
      this.loadDepartments();
      return;
    }

    this.loading = true;

    this.service.search(this.searchName.trim()).subscribe({
      next: (data) => {
        this.departments = data;
        this.loading = false;
        this.changeDetector.markForCheck();
      },

      error: () => {
        this.loading = false;

        this.changeDetector.markForCheck();

        this.notification.error('Error', 'Search failed.');
      },
    });
  }

  openCreate(): void {
    this.editingId = null;

    this.form.reset({
      departmentName: '',
      departmentDescription: '',
    });

    this.modalVisible = true;
  }

  openEdit(department: Department): void {
    this.editingId = department.departmentID;

    this.form.patchValue({
      departmentName: department.departmentName,

      departmentDescription: department.departmentDescription ?? '',
    });

    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: DepartmentRequest = this.form.getRawValue();

    if (this.editingId === null) {
      this.service.create(request).subscribe({
        next: () => {
          this.notification.success('Success', 'Department created successfully.');

          this.closeModal();
          this.loadDepartments();
        },

        error: () => {
          this.notification.error('Error', 'Unable to create department.');
        },
      });
    } else {
      this.service.update(this.editingId, request).subscribe({
        next: () => {
          this.notification.success('Success', 'Department updated successfully.');

          this.closeModal();
          this.loadDepartments();
        },

        error: () => {
          this.notification.error('Error', 'Unable to update department.');
        },
      });
    }
  }

  confirmDelete(department: Department): void {
    this.modal.confirm({
      nzTitle: 'Delete department',

      nzContent: `Are you sure you want to delete "${department.departmentName}"?`,

      nzOkText: 'Delete',

      nzOkDanger: true,

      nzCancelText: 'Cancel',

      nzOnOk: () =>
        new Promise<void>((resolve, reject) => {
          this.service.delete(department.departmentID).subscribe({
            next: () => {
              this.notification.success('Success', 'Department deleted successfully.');

              this.loadDepartments();

              resolve();
            },

            error: () => {
              this.notification.error('Cannot delete', 'This department may have linked projects.');

              reject();
            },
          });
        }),
    });
  }
}
