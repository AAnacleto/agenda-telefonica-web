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
  styleUrl: './novo-contato.component.scss',
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
export class NovoContatoComponent implements OnInit, CanComponentDeactivate  {

  contato: Contato = new Contato();
  contatoForm!: FormGroup;
  contatoId?: number;
  titulo: string = "Novo Contato"
  formularioAlterado = false;


  private contatoService = inject(ContatoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);


  ngOnInit(): void {

    this.contatoForm = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.email]),
      celular: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      telefone: new FormControl('', [Validators.minLength(10), Validators.maxLength(11)]),
      favorito: new FormControl(false)
    });

    this.contatoForm.valueChanges.subscribe(() => {
     this.formularioAlterado = true;
    });

    
    const contatoDoResolver = this.route.snapshot.data['contato'];

     if (contatoDoResolver) {
      this.titulo = "Editar Contato";
      this.contato = contatoDoResolver;

      // ============================
      // IMPORTANTE: MANTÉM contatoId
      // ============================
      this.contatoId = contatoDoResolver.id;

      this.contatoForm.patchValue({
        nome: contatoDoResolver.nome,
        email: contatoDoResolver.email,
        celular: contatoDoResolver.celular,
        telefone: contatoDoResolver.telefone,
        favorito: contatoDoResolver.favorito,
        ativo: contatoDoResolver.ativo
      });
    }
    
    



    // this.contatoId = Number(this.route.snapshot.paramMap.get('id'));
    // console.log(this.contatoId);
    

    // if (this.contatoId) {
    //   this.titulo = "Editar Contato";
    //   this.carregarContato(this.contatoId);
    // }

  }

  // carregarContato(id: number) {
  //   this.contatoService.buscarPorId(id).subscribe(contato => {
  //     this.contato = contato;
  //     console.log(this.contato);
      
  //     this.contatoForm.patchValue({
  //       nome: contato.nome,
  //       email: contato.email,
  //       celular: contato.celular,
  //       telefone: contato.telefone,
  //       favorito: contato.favorito,
  //       ativo: contato.ativo
  //     });
  //   });
  // }


  permitirApenasNumeros(event: KeyboardEvent) {
    const char = event.key;
    // Permite apenas números
    if (!/[0-9]/.test(char)) {
      event.preventDefault();
    }
  }


  formatarTelefone(event: any, campo: 'celular' | 'telefone') {
    // pega apenas números
    let numeros = event.target.value.replace(/\D/g, '');

    // limita quantidade de números
    if (campo === 'celular') numeros = numeros.slice(0, 11);
    if (campo === 'telefone') numeros = numeros.slice(0, 11);

    // atualiza o FormControl com apenas números
    this.contatoForm.controls[campo].setValue(numeros, { emitEvent: false });

    // cria valor formatado para exibir
    let valorFormatado = '';
    if (campo === 'celular') {
      if (numeros.length > 0) valorFormatado = '(' + numeros.slice(0, 2);
      if (numeros.length >= 3) valorFormatado += ') ' + numeros.slice(2, 3);
      if (numeros.length >= 4) valorFormatado += numeros.slice(3, 7);
      if (numeros.length >= 8) valorFormatado += '-' + numeros.slice(7, 11);
    }
    if (campo === 'telefone') {
      if (numeros.length > 0) valorFormatado = '(' + numeros.slice(0, 2);
      if (numeros.length >= 3) valorFormatado += ') ' + numeros.slice(2, 6);
      if (numeros.length >= 7) valorFormatado += '-' + numeros.slice(6, 10);
      if (numeros.length > 10) valorFormatado += numeros.slice(10, 11);
    }

    event.target.value = valorFormatado;
  }

 
  salvarContato() {
  if (this.contatoForm.valid) {
    const celular = this.contatoForm.controls['celular'].value;
    const telefone = this.contatoForm.controls['telefone'].value;

    const contatoParaSalvar = {
      ...this.contatoForm.value,
      celular,
      telefone
    };

    console.log(contatoParaSalvar);

    if (this.contatoId) {
      // Atualização
      this.contatoService.atualizarContato(this.contatoId, contatoParaSalvar).subscribe({
        next: () => {
          alert('Contato atualizado com sucesso!');
          this.router.navigate(['/contatos/lista']);
          this.formularioAlterado = false;
          this.contatoForm.markAsPristine();

        },
        error: (err) => {
          // Aqui pegamos a mensagem do backend
          if (err.error && err.error.mensagem) {
            alert('Erro: ' + err.error.mensagem);
          } else {
            alert('Erro inesperado ao atualizar contato!');
          }
        }
      });
    } else {
      // Criação
      contatoParaSalvar.ativo = true;
      this.contatoService.criarContato(contatoParaSalvar).subscribe({
        next: () => {
          alert('Contato cadastrado com sucesso!');
          this.formularioAlterado = false;
          this.contatoForm.markAsPristine();

          this.contatoForm.reset();
        },
        error: (err) => {
          // Mensagem do backend
          if (err.error && err.error.mensagem) {
            alert('Erro: ' + err.error.mensagem);
          } else {
            alert('Erro inesperado ao cadastrar contato!');
          }
        }
      });
    }
  } else {
    this.contatoForm.markAllAsTouched();
  }
}


 excluirContato() {
  if (confirm('Tem certeza que deseja excluir este contato?')) {
    this.contatoService.deletarContato(this.contatoId!).subscribe({
      next: () => {
        alert('Contato excluído com sucesso!');
        this.router.navigate(['/contatos/lista']);
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao excluir o contato.');
      }
    });
  }
}


inativarContato() {
  if (confirm('Deseja realmente inativar este contato?')) {
    this.contatoService.inativarContato(this.contatoId!).subscribe({
      next: () => {
        alert('Contato inativado com sucesso!');
        this.contatoForm.patchValue({ ativo: false });
        this.contato.ativo = false;
        this.router.navigate(['/contatos/inativos'])
        
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao inativar o contato.');
      }
    });
  }
}


ativarContato(){
   if (!this.contatoId) return;

  this.contatoService.ativarContato(this.contatoId).subscribe({
    next: (response) => {
      console.log("Contato ativado:", response);
      this.contatoForm.patchValue({ ativo: true }); // atualiza o form
      alert("Contato ativado com sucesso!");
      this.contato.ativo = true;
      this.router.navigate(['/contatos/lista'])

    },
    error: (err) => {
      console.error(err);
      alert("Erro ao ativar contato.");
    }
  });

}

canDeactivate(): boolean | Promise<boolean> {
  if (this.formularioAlterado && this.contatoForm.dirty) {
    return confirm('Você tem alterações não salvas. Deseja realmente sair?');
  }
  return true;
}




}


