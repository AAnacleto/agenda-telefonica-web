import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { ContatoService } from '../services/contato.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const contatoResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot
): Observable<any> => {
  const service = inject(ContatoService);
  const id = Number(route.paramMap.get('id'));

  // Evita erro se o ID não for válido
  if (!id) return of(null);

  return service.buscarPorId(id).pipe(
    catchError(() => of(null)) // Se der erro, retorna null
  );
};
