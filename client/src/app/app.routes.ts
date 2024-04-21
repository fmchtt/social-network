import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { BaseLayout } from './layouts/base/base.layout';
import { authGuard } from './guards/auth.guard';
import { ServerComponent } from './pages/server/server.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  {
    path: '',
    component: BaseLayout,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent, title: 'Home' },
      { path: ':serverId', component: ServerComponent, title: 'Server' },
    ],
  },
];
