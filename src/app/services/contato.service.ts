import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contato } from '../models/contato.model';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/contatos';

  private filtroSubject = new BehaviorSubject<string>('');
  filtro$ = this.filtroSubject.asObservable();

  setFiltro(termo: string) {
    this.filtroSubject.next(termo);
  }

  /** Listar todos os contatos */
  getContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.apiUrl);
  }

  /** Listar contatos favoritos */
  getFavoritos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(`${this.apiUrl}/favoritos`);
  }

  getInativos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(`${this.apiUrl}/inativos`);
  }

  /** Buscar contato por ID */
  buscarPorId(id: number): Observable<Contato> {
    return this.http.get<Contato>(`${this.apiUrl}/${id}`);
  }

  /** Criar novo contato */
  criarContato(contato: Contato): Observable<any> {
    return this.http.post<any>(this.apiUrl, contato);
  }

  /** Atualizar contato existente */
  atualizarContato(id: number, contato: Contato): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, contato);
  }

  /** Deletar contato */
  deletarContato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /** Inativar contato */
  inativarContato(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/inativar`, {});
  }

   ativarContato(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/ativar`, {});
  }

  /** Alternar status de favorito */
  // toggleFavorito(id: number): Observable<any> {
  //   return this.http.patch<any>(`${this.apiUrl}/${id}/favorito`, {});
  // }

  // Favoritar
  favoritarContato(id: number): Observable<Contato> {
    return this.http.patch<Contato>(`${this.apiUrl}/${id}/favoritar`, {});
  }

  // Desfavoritar
  desfavoritarContato(id: number): Observable<Contato> {
    return this.http.patch<Contato>(`${this.apiUrl}/${id}/desfavoritar`, {});
  }



  /** Obter total de contatos */
  getTotalContatos(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`);
  }

  /** Obter total de contatos ativos */
getTotalContatosAtivos(): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/totalAtivos`);
}

/** Obter total de contatos inativos */
getTotalContatosInativos(): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/totalInativos`);
}

/** Obter total de contatos inativos */
getTotalfavoritos(): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/totalFavoritos`);
}

}
