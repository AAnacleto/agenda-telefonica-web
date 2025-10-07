import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { ContatoService } from '../../services/contato.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let contatoServiceMock: Partial<ContatoService>;

  beforeEach(() => {
    contatoServiceMock = {
      getTotalContatos: jest.fn().mockReturnValue(of(10)),
      getTotalContatosAtivos: jest.fn().mockReturnValue(of(7)),
      getTotalContatosInativos: jest.fn().mockReturnValue(of(3)),
      getTotalfavoritos: jest.fn().mockReturnValue(of(5)),
    };

    TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule],
      providers: [{ provide: ContatoService, useValue: contatoServiceMock }],
    });

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should carregarTotalContatos', () => {
    component.carregarTotalContatos();
    expect(component.totalContatos).toBe(10);
    expect(contatoServiceMock.getTotalContatos).toHaveBeenCalled();
  });

  it('should update totals on interval', fakeAsync(() => {
    component.ngOnInit();
    tick(4000); // dispara o interval
    expect(component.totalAtivos).toBe(7);
    expect(component.totalInativos).toBe(3);
    expect(component.totalFavoritos).toBe(5);

    tick(4000); // dispara mais um ciclo
    expect(component.totalAtivos).toBe(7);
    expect(component.totalInativos).toBe(3);
    expect(component.totalFavoritos).toBe(5);

    component.ngOnDestroy();
  }));
});
