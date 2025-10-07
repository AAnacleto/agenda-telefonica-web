import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AuthLayoutComponent {}
