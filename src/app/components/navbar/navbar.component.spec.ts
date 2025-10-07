import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { ContatoService } from '../../services/contato.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let contatoServiceMock: Partial<ContatoService>;

  beforeEach(() => {
    contatoServiceMock = {
      setFiltro: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [NavbarComponent, FormsModule, CommonModule],
      providers: [
        { provide: ContatoService, useValue: contatoServiceMock }
      ]
    });

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setFiltro on filtrarContatos', () => {
    component.termoBusca = 'teste';
    component.filtrarContatos();
    expect(contatoServiceMock.setFiltro).toHaveBeenCalledWith('teste');
  });

  it('should call filtrarContatos on buscarContato', () => {
    const event = { preventDefault: jest.fn() } as unknown as Event;
    component.termoBusca = 'busca';
    const spy = jest.spyOn(component, 'filtrarContatos');
    
    component.buscarContato(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(contatoServiceMock.setFiltro).toHaveBeenCalledWith('busca');
  });
});
