import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Article } from './article/article';
import { About } from './about/about';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'article', component: Article },
  { path: 'about', component: About },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '' }
];
