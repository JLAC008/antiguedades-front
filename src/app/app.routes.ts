import { Routes } from '@angular/router';
import { authChildGuard, authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
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
        loadComponent: () => import('./pages/upload-antique/upload-antique.component').then(m => m.UploadAntiqueComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/upload-antique/upload-antique.component').then(m => m.UploadAntiqueComponent)
      },
      {
        path: 'catalogos',
        loadComponent: () => import('./pages/manage-catalogs/manage-catalogs.component').then(m => m.ManageCatalogsComponent)
      },
    ]
  },
  { path: '**', redirectTo: '' }
];
