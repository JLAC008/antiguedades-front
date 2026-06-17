import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'coleccion',
        loadComponent: () => import('./pages/collection/collection.component').then(m => m.CollectionComponent)
      },
      {
        path: 'catalogo/:id',
        loadComponent: () => import('./pages/catalog-detail/catalog-detail.component').then(m => m.CatalogDetailComponent)
      },
      {
        path: 'pieza/:id',
        loadComponent: () => import('./pages/antique-detail/antique-detail.component').then(m => m.AntiqueDetailComponent)
      },
      {
        path: 'subir',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/upload-antique/upload-antique.component').then(m => m.UploadAntiqueComponent)
      },
      {
        path: 'editar/:id',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/upload-antique/upload-antique.component').then(m => m.UploadAntiqueComponent)
      },
      {
        path: 'usuarios',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/manage-users/manage-users.component').then(m => m.ManageUsersComponent)
      },
    ]
  },
  { path: '**', redirectTo: '' }
];
