import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContatoService } from '../../services/contato.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

    termoBusca: string = '';

    private contatoService = inject(ContatoService);

  filtrarContatos() {
    console.log(this.termoBusca);
    
    this.contatoService.setFiltro(this.termoBusca);
   }

  buscarContato(event: Event) {
    event.preventDefault(); // evita reload
    this.filtrarContatos();
  }
     
}
