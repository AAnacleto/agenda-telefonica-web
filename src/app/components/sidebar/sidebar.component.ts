import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContatoService } from '../../services/contato.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy{

  totalContatos: number = 0;
  totalAtivos: number = 0;
  totalInativos: number = 0;
  totalFavoritos: number = 0;
  private intervalSub?: Subscription;

  private contatoService = inject(ContatoService);



  ngOnInit() {
    this.intervalSub = interval(4000).subscribe(() => { 
    this.contatoService.getTotalContatosAtivos().subscribe(total => this.totalAtivos = total);
    this.contatoService.getTotalContatosInativos().subscribe(total => this.totalInativos = total);
    this.contatoService.getTotalfavoritos().subscribe(total => this.totalFavoritos = total)
     console.log(this.totalFavoritos);

    });
   
    
  }

  carregarTotalContatos() {
    this.contatoService.getTotalContatos().subscribe({
      next: (res) => {
        console.log(res);
        
        this.totalContatos = res;
      },
      error: (err) => {
        console.error('Erro ao carregar total de contatos', err);
      }
    });
  }

  ngOnDestroy() {
    this.intervalSub?.unsubscribe();
  }

}
