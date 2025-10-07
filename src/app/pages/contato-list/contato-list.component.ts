import { Component, inject, OnInit } from '@angular/core';
import { ContatoService } from '../../services/contato.service';
import { Contato } from '../../models/contato.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ContatosAgrupados {
  letra: string;
  contatos: Contato[];
}

@Component({
  selector: 'app-contato-list',
  imports: [CommonModule],
  templateUrl: './contato-list.component.html',
  styleUrl: './contato-list.component.scss'
})

export class ContatoListComponent implements OnInit{
  
  
  listaContatos: Contato[] = [];
  listaContatosFiltrados: Contato[] = [];
  contatosAgrupados: ContatosAgrupados[] = []; // NOVO
  isFavoritos: boolean = false;
  isInativos: boolean = false;

  private contatoService = inject(ContatoService)
  private router = inject(Router)



  ngOnInit(): void {
    this.isFavoritos = this.router.url.includes('favoritos');
    this.isInativos = this.router.url.includes('inativos')
    this.carregarContatos()

    this.contatoService.filtro$.subscribe(termo => {
    this.listaContatosFiltrados = this.listaContatos.filter(c =>
    c.nome.toLowerCase().includes(termo.toLowerCase()) || 
    c.celular.includes(termo)
    );
    
    this.organizarContatos();
});
  }

    carregarContatos() {
    let observable$;
    if (this.isFavoritos) {
      observable$ = this.contatoService.getFavoritos();
    } else if (this.isInativos) {
      observable$ = this.contatoService.getInativos();
    } else {
      observable$ = this.contatoService.getContatos();
    }

    observable$.subscribe({
      next: (res) => {
        this.listaContatos = res;
        this.listaContatosFiltrados = [...this.listaContatos];
        this.organizarContatos(); // chama a função para agrupar
      },
      error: (err) => console.error('Erro ao carregar contatos', err)
    });
    }


   organizarContatos() {
  // Ordenar alfabeticamente
  this.listaContatosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));

  const grupos: { [letra: string]: Contato[] } = {};
  this.listaContatosFiltrados.forEach(contato => {
    // Remove espaços e pega a primeira letra
    let letra = contato.nome.trim()[0].toUpperCase();

    // Se não for A-Z, coloca no grupo '#'
    if (!letra.match(/[A-Z]/)) letra = '#';

    // Cria o grupo se não existir e adiciona o contato
    if (!grupos[letra]) grupos[letra] = [];
    grupos[letra].push(contato);
  });

  // Transformar o objeto em array para usar no HTML
  this.contatosAgrupados = Object.keys(grupos)
    .sort()
    .map(letra => ({ letra, contatos: grupos[letra] }));
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
