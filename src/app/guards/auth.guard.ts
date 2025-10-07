import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    alert('Acesso negado! Faça login primeiro.');
    // Retorna UrlTree para redirecionar pro login
    return router.parseUrl('/login');
  }

  return true; // Permite acesso
};
