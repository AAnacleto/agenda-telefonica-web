import { Component, OnInit } from '@angular/core';
import { ContatoService } from '../../services/contato.service';
import { Contato } from '../../models/contato.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contato-list',
  imports: [CommonModule],
  templateUrl: './contato-list.component.html',
  styleUrl: './contato-list.component.scss'
})
export class ContatoListComponent implements OnInit{
  
  
  listaContatos: Contato[] = [];
  listaContatosFiltrados: Contato[] = [];
  isFavoritos: boolean = false;
  isInativos: boolean = false;


 constructor(
    private contatoService: ContatoService,
    private router: Router
  ) {}  


  ngOnInit(): void {
    this.isFavoritos = this.router.url.includes('favoritos');
    this.isInativos = this.router.url.includes('inativos')
    this.carregarContatos()
    this.contatoService.filtro$.subscribe(termo => {
    this.listaContatosFiltrados = this.listaContatos.filter(c =>
    c.nome.toLowerCase().includes(termo.toLowerCase()) || 
    c.celular.includes(termo)
    );
});
  }

  carregarContatos() {
    if (this.isFavoritos) {
      // Busca somente favoritos
      this.contatoService.getFavoritos().subscribe({
        next: (res) => {
          this.listaContatos = res;
          this.listaContatosFiltrados = [...this.listaContatos];

        },
        error: (err) => {
          console.error('Erro ao carregar favoritos', err);
        }
      });
    } else if (this.isInativos){
      // Busca somente favoritos
      this.contatoService.getInativos().subscribe({
        next: (res) => {
          this.listaContatos = res;
          this.listaContatosFiltrados = [...this.listaContatos];

        },
        error: (err) => {
          console.error('Erro ao carregar inativos', err);
        }
      });

    } else {
      // Busca todos os contatos
      this.contatoService.getContatos().subscribe({
        next: (res) => {
          this.listaContatos = res;
          this.listaContatosFiltrados = [...this.listaContatos];

          console.log(this.listaContatos);
          
        },
        error: (err) => {
          console.error('Erro ao carregar a lista de contatos', err);
        }
      });
    }
  }

  editarContato(id: any){
    console.log(id);
    this.router.navigate(['contatos/editar/' + id]);

    

  }

favoritarContato(contato: Contato): void {
  this.contatoService.favoritarContato(contato.id!).subscribe({
    next: (resp) => {
      contato.favorito = true; // atualiza direto o estado
      console.log(contato);
      
      console.log('Contato favoritado:', resp);
    },
    error: (err) => console.error('Erro ao favoritar contato:', err)
  });
}

desfavoritarContato(contato: Contato): void {
  this.contatoService.desfavoritarContato(contato.id!).subscribe({
    next: (resp) => {
      contato.favorito = false; // atualiza direto o estado
      console.log(contato);

      console.log('Contato desfavoritado:', resp);
    },
    error: (err) => console.error('Erro ao desfavoritar contato:', err)
  });
}

}
