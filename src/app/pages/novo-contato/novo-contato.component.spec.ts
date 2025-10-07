import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NovoContatoComponent } from './novo-contato.component';
import { ContatoService } from '../../services/contato.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { Contato } from '../../models/contato.model';
import { provideNoopAnimations } from '@angular/platform-browser/animations';


// --- Mocks dos Serviços ---
// O tipo implícito aqui é crucial para a tipagem do Jest abaixo
const mockContatoService = {
  criarContato: jest.fn().mockReturnValue(of({} as Contato)),
  atualizarContato: jest.fn().mockReturnValue(of({} as Contato)),
  inativarContato: jest.fn().mockReturnValue(of({} as Contato)),
  ativarContato: jest.fn().mockReturnValue(of({} as Contato)),
  deletarContato: jest.fn().mockReturnValue(of(void 0)),
};

const mockRouter = {
  navigate: jest.fn(),
};

const mockActivatedRoute = {
  snapshot: {
    paramMap: new Map(),
    data: {},
  },
};

describe('NovoContatoComponent', () => {
  let component: NovoContatoComponent;
  let fixture: ComponentFixture<NovoContatoComponent>;
  // Tipagem correta: usamos 'typeof' para referenciar o objeto mock
  let contatoService: jest.Mocked<typeof mockContatoService>;
  let router: jest.Mocked<typeof mockRouter>;

  beforeEach(async () => {
    window.alert = jest.fn();
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NovoContatoComponent],
      providers: [
        { provide: ContatoService, useValue: mockContatoService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
         provideNoopAnimations()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NovoContatoComponent);
    component = fixture.componentInstance;
    
    // Injeção com tipagem corrigida (resolve o erro)
    contatoService = TestBed.inject(ContatoService) as any;
    router = TestBed.inject(Router) as any;
    
    // Inicializa o componente (chama ngOnInit, etc.)
    fixture.detectChanges(); 
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
    expect(component.contatoForm).toBeDefined();
  });

  it('deve salvar um novo contato e navegar para a lista', () => {
    contatoService.criarContato.mockClear();

    component.contatoForm.setValue({
      nome: 'Teste',
      email: 'teste@teste.com',
      celular: '81999999999',
      telefone: '8133333333',
      favorito: false,
      ativo: true
    });

    component.salvarContato();

    expect(contatoService.criarContato).toHaveBeenCalledTimes(1);
    const calledPayload = contatoService.criarContato.mock.calls[0][0]; 
    expect(calledPayload).toEqual(({ 
        nome: 'Teste',
        email: 'teste@teste.com',
        celular: '81999999999',
        telefone: '8133333333',
        favorito: false,
        ativo: true
    }));
    
  });

  it('deve atualizar um contato existente e navegar para a lista', () => {
    component.contatoId = 1;
    fixture.detectChanges();
    
    component.contatoForm.setValue({
      nome: 'Teste Atualizado',
      email: 'teste@teste.com',
      celular: '81999999999',
      telefone: '8133333333',
      favorito: true,
      ativo:true
    });

    component.salvarContato();

    expect(contatoService.atualizarContato).toHaveBeenCalledTimes(1);
    const [[calledId, calledPayload]] = contatoService.atualizarContato.mock.calls;
    expect(calledId).toBe(1);
 
    
  expect(router.navigate).toHaveBeenCalledWith(['/contatos/lista']);
  });

  it('deve inativar um contato se o usuário confirmar', () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    component.contatoId = 1;
    component.inativarContato();

    expect(confirmSpy).toHaveBeenCalled();
    expect(contatoService.inativarContato).toHaveBeenCalledWith(1);
    expect(router.navigate).toHaveBeenCalledWith(['/contatos/inativos']); 
    
    confirmSpy.mockRestore();
  });

  it('NÃO deve inativar um contato se o usuário NÃO confirmar', () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);
    contatoService.inativarContato.mockClear();

    component.contatoId = 1;
    component.inativarContato();

    expect(confirmSpy).toHaveBeenCalled();
    expect(contatoService.inativarContato).not.toHaveBeenCalled();
    
    confirmSpy.mockRestore();
  });

  it('deve ativar um contato e navegar para a lista', () => {
    contatoService.ativarContato.mockClear();

    component.contatoId = 1;
    component.ativarContato();

    expect(contatoService.ativarContato).toHaveBeenCalledWith(1);
    expect(router.navigate).toHaveBeenCalledWith(['/contatos/lista']);
  });

  it('deve excluir um contato se o usuário confirmar', () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    contatoService.deletarContato.mockClear();

    component.contatoId = 1;
    component.excluirContato();

    expect(confirmSpy).toHaveBeenCalled();
    expect(contatoService.deletarContato).toHaveBeenCalledWith(1);
    expect(router.navigate).toHaveBeenCalledWith(['/contatos/lista']);
    
    confirmSpy.mockRestore();
  });
  
  it('NÃO deve excluir um contato se o usuário NÃO confirmar', () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);
    contatoService.deletarContato.mockClear();

    component.contatoId = 1;
    component.excluirContato();

    expect(confirmSpy).toHaveBeenCalled();
    expect(contatoService.deletarContato).not.toHaveBeenCalled();
    
    confirmSpy.mockRestore();
  });
});