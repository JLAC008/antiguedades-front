import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'coleccion',
    loadComponent: () => import('./pages/collection/collection.component').then(m => m.CollectionComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
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
    canActivate: [authGuard],
    loadComponent: () => import('./pages/upload-antique/upload-antique.component').then(m => m.UploadAntiqueComponent)
  },
  {
    path: 'editar/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/upload-antique/upload-antique.component').then(m => m.UploadAntiqueComponent)
  },
  {
    path: 'catalogos',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/manage-catalogs/manage-catalogs.component').then(m => m.ManageCatalogsComponent)
  },
  { path: '**', redirectTo: '' }
];
