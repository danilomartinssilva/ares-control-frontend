import { Routes } from '@angular/router';
import { LoginComponent } from '../components/public/login/login.component';
import { HomeComponent } from '../components/private/home/home.component';
import { authGuard } from '../guards/authGuard';
import { AddressComponent } from '../components/private/address/address.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../components/public/login/new-user/new-user.component').then(
        (m) => m.NewUserComponent
      ),
  },
  {
    path: 'address',
    component: AddressComponent,
  },
];
