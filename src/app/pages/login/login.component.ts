import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    // Aqui você pode adicionar validação se quiser
    if (this.username && this.password) {
      // Simula login, salva token no localStorage
      localStorage.setItem('token', 'FAKE_TOKEN_123');

      // Redireciona para a tela principal do sistema
      this.router.navigate(['/contatos/lista']); 
    } else {
      alert('Informe usuário e senha!');
    }
  }
}
