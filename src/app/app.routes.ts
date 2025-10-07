import { Routes } from '@angular/router';
import { NovoContatoComponent } from './pages/novo-contato/novo-contato.component';
import { ContatoListComponent } from './pages/contato-list/contato-list.component';
import { authGuard } from './guards/auth.guard';
import { contatoResolver } from './resolvers/contato.resolver';
import { canDeactivateGuard } from './guards/can-deactivate.guard';
import { LoginComponent } from './pages/login/login.component';
import { AppLayoutComponent } from './layouts/app-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
    ],
  },

  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'contatos/novo',
        component: NovoContatoComponent,
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: 'contatos/editar/:id',
        component: NovoContatoComponent,
        canDeactivate: [canDeactivateGuard],
        resolve: { contato: contatoResolver },
      },
      { path: 'contatos/lista', component: ContatoListComponent },
      { path: 'contatos/favoritos', component: ContatoListComponent },
      { path: 'contatos/inativos', component: ContatoListComponent },
      { path: '', redirectTo: 'contatos/lista', pathMatch: 'full' },
    ],
  },

  // fallback
  { path: '**', redirectTo: 'login' },
];
