import { TestBed } from '@angular/core/testing';
import { ContatoService } from './contato.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ContatoService', () => {
  let service: ContatoService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContatoService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ContatoService);
    httpClient = TestBed.inject(HttpClient);

    // Spies do Jest para simular requisições HTTP
    jest.spyOn(httpClient, 'get').mockImplementation((url: string) => {
      if (url.endsWith('/favoritos')) return of([{ id: 2, nome: 'B', celular: '', telefone: '', email: '', favorito: true, ativo: true }]);
      if (url.endsWith('/inativos')) return of([{ id: 3, nome: 'C', celular: '', telefone: '', email: '', favorito: false, ativo: false }]);
      if (url.endsWith('/total')) return of(10);
      if (url.endsWith('/totalAtivos')) return of(7);
      if (url.endsWith('/totalInativos')) return of(3);
      if (url.endsWith('/totalFavoritos')) return of(5);
      return of([{ id: 1, nome: 'A', celular: '123', telefone: '456', email: '', favorito: false, ativo: true }]);
    });

    jest.spyOn(httpClient, 'post').mockImplementation(() => of({ success: true }));
    jest.spyOn(httpClient, 'put').mockImplementation(() => of({ success: true }));
    jest.spyOn(httpClient, 'delete').mockImplementation(() => of(void 0));
    jest.spyOn(httpClient, 'patch').mockImplementation((url: string) => {
      if (url.endsWith('/favoritar')) return of({ id: 1, nome: 'G', celular: '', telefone: '', email: '', favorito: true, ativo: true });
      if (url.endsWith('/desfavoritar')) return of({ id: 1, nome: 'H', celular: '', telefone: '', email: '', favorito: false, ativo: true });
      return of(void 0);
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and emit filtro', (done) => {
    service.filtro$.subscribe((filtro) => {
      expect(filtro).toBe('teste');
      done();
    });
    service.setFiltro('teste');
  });

  it('should get contatos', (done) => {
    service.getContatos().subscribe((res) => {
      expect(res[0].nome).toBe('A');
      done();
    });
  });

  it('should get favoritos', (done) => {
    service.getFavoritos().subscribe((res) => {
      expect(res[0].favorito).toBe(true);
      done();
    });
  });

  it('should get inativos', (done) => {
    service.getInativos().subscribe((res) => {
      expect(res[0].ativo).toBe(false);
      done();
    });
  });

 
  it('should create contato', (done) => {
    service.criarContato({ id: 0, nome: 'E', celular: '', telefone: '', email: '', favorito: false, ativo: true }).subscribe((res) => {
      expect(res).toEqual({ success: true });
      done();
    });
  });

  it('should atualizar contato', (done) => {
    service.atualizarContato(1, { id: 1, nome: 'F', celular: '', telefone: '', email: '', favorito: true, ativo: true }).subscribe((res) => {
      expect(res).toEqual({ success: true });
      done();
    });
  });

  it('should deletar contato', (done) => {
    service.deletarContato(1).subscribe((res) => {
      expect(res).toBeUndefined();
      done();
    });
  });

  it('should inativar contato', (done) => {
    service.inativarContato(1).subscribe((res) => {
      expect(res).toBeUndefined();
      done();
    });
  });

  it('should ativar contato', (done) => {
    service.ativarContato(1).subscribe((res) => {
      expect(res).toBeUndefined();
      done();
    });
  });

  it('should favoritar contato', (done) => {
    service.favoritarContato(1).subscribe((res) => {
      expect(res.favorito).toBe(true);
      done();
    });
  });

  it('should desfavoritar contato', (done) => {
    service.desfavoritarContato(1).subscribe((res) => {
      expect(res.favorito).toBe(false);
      done();
    });
  });

  it('should get total contatos', (done) => {
    service.getTotalContatos().subscribe((res) => {
      expect(res).toBe(10);
      done();
    });
  });

  it('should get total contatos ativos', (done) => {
    service.getTotalContatosAtivos().subscribe((res) => {
      expect(res).toBe(7);
      done();
    });
  });

  it('should get total contatos inativos', (done) => {
    service.getTotalContatosInativos().subscribe((res) => {
      expect(res).toBe(3);
      done();
    });
  });

  it('should get total favoritos', (done) => {
    service.getTotalfavoritos().subscribe((res) => {
      expect(res).toBe(5);
      done();
    });
  });
});
