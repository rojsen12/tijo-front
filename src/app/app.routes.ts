import { Routes } from '@angular/router';
import {RegisterComponent} from './components/register/register-component';
import {LoginComponent} from './components/login/login-component';
import {MainPageComponent} from './components/main-page/main-page-component';



export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'main-page', component: MainPageComponent}
];
