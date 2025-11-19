import { Routes } from '@angular/router';
import {RegisterComponent} from './components/register/register-component';
import {LoginComponent} from './components/login/login-component';
import {MainPageComponent} from './components/main-page/main-page-component';
import {CreateCvComponent} from './components/create-cv/create-cv-component';
import {EditCvComponent} from './components/edit-cv/edit-cv-component';
import {PreviewCvComponent} from './components/preview-cv/preview-cv-component';
import {MyCvsComponent} from './components/my-cvs/my-cvs-component';
import {authGuard} from './guards/auth.guards';



export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'main-page', component: MainPageComponent, canActivate: [authGuard] },
  { path: 'my-cvs', component: MyCvsComponent, canActivate: [authGuard] },
  { path: 'create-cv', component: CreateCvComponent, canActivate: [authGuard] },
  { path: 'edit-cv', component: EditCvComponent, canActivate: [authGuard] },
  { path: 'edit-cv/:id', component: EditCvComponent, canActivate: [authGuard] },
  { path: 'preview-cv/:id', component: PreviewCvComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'main-page', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
