import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contato } from '../../models/contato.model';
import { ContatoService } from '../../services/contato.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';
import { CanComponentDeactivate } from '../../guards/can-component-deactivate';

@Component({
  selector: 'app-novo-contato',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './novo-contato.component.html',
  styleUrls: ['./novo-contato.component.scss'],
  animations:[
    trigger('fadeScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class NovoContatoComponent implements OnInit, CanComponentDeactivate {

  contato!: Contato;              
  contatoForm!: FormGroup;
  contatoId?: number;
  titulo: string = "Novo Contato";
  formularioAlterado = false;

  private contatoService = inject(ContatoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    // Cria o form
    this.contatoForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.email]),
      celular: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      telefone: new FormControl('', [Validators.minLength(10), Validators.maxLength(11)]),
      favorito: new FormControl(false),
      ativo: new FormControl(true) 
    });

    // Detecta alterações
    this.contatoForm.valueChanges.subscribe(() => {
      this.formularioAlterado = true;
    });

    // Pega contato do resolver, se existir
    const contatoDoResolver = this.route.snapshot.data['contato'];
    if (contatoDoResolver) {
      this.titulo = "Editar Contato";
      // Clona para não mexer no objeto original da lista
      this.contato = { ...contatoDoResolver };
      this.contatoId = contatoDoResolver.id;

      this.contatoForm.patchValue({
        nome: this.contato.nome,
        email: this.contato.email,
        celular: this.contato.celular,
        telefone: this.contato.telefone,
        favorito: this.contato.favorito,
        ativo: this.contato.ativo
      });
    } else {
      // Novo contato
      this.contato = new Contato();
      this.contato.ativo = true;
      this.contato.favorito = false;
    }
  }

  permitirApenasNumeros(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  formatarTelefone(event: any, campo: 'celular' | 'telefone') {
    let numeros = event.target.value.replace(/\D/g, '').slice(0,11);
    this.contatoForm.controls[campo].setValue(numeros, { emitEvent: false });

    // Formatação visual
    let valorFormatado = '';
    if (campo === 'celular') {
      if (numeros.length > 0) valorFormatado = '(' + numeros.slice(0,2);
      if (numeros.length >= 3) valorFormatado += ') ' + numeros.slice(2,3);
      if (numeros.length >= 4) valorFormatado += numeros.slice(3,7);
      if (numeros.length >= 8) valorFormatado += '-' + numeros.slice(7,11);
    }
    if (campo === 'telefone') {
      if (numeros.length > 0) valorFormatado = '(' + numeros.slice(0,2);
      if (numeros.length >= 3) valorFormatado += ') ' + numeros.slice(2,6);
      if (numeros.length >= 7) valorFormatado += '-' + numeros.slice(6,10);
      if (numeros.length > 10) valorFormatado += numeros.slice(10,11);
    }
    event.target.value = valorFormatado;
  }

  salvarContato() {
    if (!this.contatoForm.valid) {
      this.contatoForm.markAllAsTouched();
      return;
    }

    const contatoParaSalvar = {
      ...this.contatoForm.value,
      celular: this.contatoForm.value.celular,
      telefone: this.contatoForm.value.telefone,
      ativo: this.contato.ativo,       // preserva ativo
      favorito: this.contato.favorito  // preserva favorito
    };

    if (this.contatoId) {
      // Atualização
      this.contatoService.atualizarContato(this.contatoId, contatoParaSalvar).subscribe({
        next: (updated) => {
          // Atualiza o objeto local sem quebrar referência
          Object.assign(this.contato, updated, {
            ativo: this.contato.ativo,
            favorito: this.contato.favorito
          });
          alert('Contato atualizado com sucesso!');
          this.router.navigate(['/contatos/lista']);
          this.formularioAlterado = false;
          this.contatoForm.markAsPristine();
        },
        error: (err) => {
          alert(err?.error?.mensagem ?? 'Erro inesperado ao atualizar contato!');
        }
      });
    } else {
      // Criação
      this.contatoService.criarContato(contatoParaSalvar).subscribe({
        next: (created) => {
          alert('Contato cadastrado com sucesso!');
          this.formularioAlterado = false;
          this.contatoForm.markAsPristine();
          this.contatoForm.reset();
        },
        error: (err) => {
          alert(err?.error?.mensagem ?? 'Erro inesperado ao cadastrar contato!');
        }
      });
    }
  }

 inativarContato() {
  if (confirm('Deseja realmente inativar este contato?')) {
    this.contatoService.inativarContato(this.contatoId!).subscribe({
      next: () => {
        this.contato.ativo = false;  
        this.contato.favorito = false;
        this.contatoForm.patchValue({ 
          ativo: false,
          favorito: false
        });
        alert('Contato inativado com sucesso!');
        this.router.navigate(['/contatos/inativos']);
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao inativar o contato.');
      }
    });
  }
}


  ativarContato() {
    if (!this.contatoId) return;

    this.contatoService.ativarContato(this.contatoId).subscribe({
      next: () => {
        this.contato.ativo = true;
        this.contatoForm.patchValue({ ativo: true });
        alert('Contato ativado com sucesso!');
        this.router.navigate(['/contatos/lista']);
      },
      error: (err) => alert('Erro ao ativar o contato.')
    });
  }

  excluirContato() {
    if (!this.contatoId || !confirm('Tem certeza que deseja excluir este contato?')) return;

    this.contatoService.deletarContato(this.contatoId).subscribe({
      next: () => {
        alert('Contato excluído com sucesso!');
        this.router.navigate(['/contatos/lista']);
      },
      error: () => alert('Erro ao excluir o contato.')
    });
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (this.formularioAlterado && this.contatoForm.dirty) {
      return confirm('Você tem alterações não salvas. Deseja realmente sair?');
    }
    return true;
  }
}
