import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContatoListComponent } from './contato-list.component';
import { ContatoService } from '../../services/contato.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Contato } from '../../models/contato.model';
import { CommonModule } from '@angular/common';

describe('ContatoListComponent', () => {
  let component: ContatoListComponent;
  let fixture: ComponentFixture<ContatoListComponent>;
  let contatoServiceMock: Partial<ContatoService>;
  let routerMock: Partial<Router>;

  const contatosMock: Contato[] = [
    { id: 1, nome: 'Alice', email:'alice@gmail.com', celular: '1111', favorito: false },
    { id: 2, nome: 'Bob', email:'bob@gmail.com', celular: '2222', favorito: true },
    { id: 3, nome: 'Álvaro',email:'alvaro@gmail.com', celular: '3333', favorito: false }
  ];

  beforeEach(() => {
    contatoServiceMock = {
      getContatos: jest.fn().mockReturnValue(of(contatosMock)),
      getFavoritos: jest.fn().mockReturnValue(of(contatosMock.filter(c => c.favorito))),
      getInativos: jest.fn().mockReturnValue(of([])),
      favoritarContato: jest.fn().mockReturnValue(of(true)),
      desfavoritarContato: jest.fn().mockReturnValue(of(true)),
      filtro$: of('') as any
    };

    routerMock = {
      url: '/contatos',
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [ContatoListComponent, CommonModule],
      providers: [
        { provide: ContatoService, useValue: contatoServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    fixture = TestBed.createComponent(ContatoListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should carregar contatos e organizar grupos', () => {
    component.ngOnInit();

    expect(contatoServiceMock.getContatos).toHaveBeenCalled();
    expect(component.listaContatos.length).toBe(3);
    expect(component.listaContatosFiltrados.length).toBe(3);
    expect(component.contatosAgrupados.length).toBeGreaterThan(0);
  });

  it('should favoritar contato', () => {
    const contato = { ...contatosMock[0] };
    component.favoritarContato(contato);
    expect(contatoServiceMock.favoritarContato).toHaveBeenCalledWith(contato.id);
    expect(contato.favorito).toBe(true);
  });

  it('should desfavoritar contato', () => {
    const contato = { ...contatosMock[1] };
    component.desfavoritarContato(contato);
    expect(contatoServiceMock.desfavoritarContato).toHaveBeenCalledWith(contato.id);
    expect(contato.favorito).toBe(false);
  });

  it('should navigate to edit', () => {
    component.editarContato(123);
    expect(routerMock.navigate).toHaveBeenCalledWith(['contatos/editar/123']);
  });
});

