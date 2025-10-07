import { Routes } from '@angular/router';
import { NovoContatoComponent } from './pages/novo-contato/novo-contato.component';
import { ContatoListComponent } from './pages/contato-list/contato-list.component';
import { authGuard } from './guards/auth.guard';
import { contatoResolver } from './resolvers/contato.resolver';
import { canDeactivateGuard } from './guards/can-deactivate.guard'; // teu guard atual
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [

      { path: 'login', component: LoginComponent },

      {
            path: 'contatos/novo',
            component: NovoContatoComponent,
            // canActivate: [authGuard],
            canDeactivate: [canDeactivateGuard],
      },
      {
            path: 'contatos/editar/:id',
            component: NovoContatoComponent,
            // canActivate: [authGuard],
            canDeactivate: [canDeactivateGuard],
            resolve: { contato: contatoResolver },
      },
      {
            path: 'contatos/lista',
            component: ContatoListComponent,
            // canActivate: [authGuard],
      },
      {
            path: 'contatos/favoritos',
            component: ContatoListComponent,
            // canActivate: [authGuard],
      },
      {
            path: 'contatos/inativos',
            component: ContatoListComponent,
            // canActivate: [authGuard],
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login' },
];
