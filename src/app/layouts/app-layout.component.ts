import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="d-flex" style="height: 100vh;">
      <!-- Sidebar -->
      <app-sidebar class="bg-light border-end"></app-sidebar>

      <!-- Main content -->
      <div class="flex-fill p-4 bg-light">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AppLayoutComponent {}
