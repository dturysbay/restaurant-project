import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'restaurant/:id',
    loadComponent: () => import('./pages/restaurant-detail/restaurant-detail.component').then(m => m.RestaurantDetailComponent),
  },
  { path: '**', redirectTo: '' },
];
