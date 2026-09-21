import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [

  {
    path: '',
    component: LayoutComponent,

    children: [

      // Home
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component')
            .then(m => m.HomeComponent)
      },


      // Departments
      {
        path: 'departments',
        loadComponent: () =>
          import('./features/departments/department-management/department-management.component')
            .then(m => m.DepartmentManagementComponent)
      },


      // Projects
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/project-management/project-management.component')
            .then(m => m.ProjectManagementComponent)
      },

      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./features/projects/project-detail/project-detail.component')
            .then(m => m.ProjectDetailComponent)
      },


      // Tasks
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/task-management/task-management.component')
            .then(m => m.TaskManagementComponent)
      },

      {
        path: 'tasks/:id',
        loadComponent: () =>
          import('./features/tasks/task-detail/task-detail.component')
            .then(m => m.TaskDetailComponent)
      },


      // Tags
      {
        path: 'tags',
        loadComponent: () =>
          import('./features/tags/tag-management/tag-management.component')
            .then(m => m.TagManagementComponent)
      },


      // Search
      {
        path: 'search',
        loadComponent: () =>
          import('./features/search/search.component')
            .then(m => m.SearchComponent)
      }

    ]
  },


  // Unknown route
  {
    path: '**',
    redirectTo: ''
  }

];