import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container mt-4">
      <h1>Tableau de bord</h1>
      <p>Bienvenue dans SupplyChainX. Vous êtes connecté en tant que :</p>
      
      <div class="card mt-4">
        <h3>Vos Rôles</h3>
        <ul>
          <li *ngFor="let role of (currentUser$ | async)?.roles">{{ role }}</li>
        </ul>
      </div>
    </div>
  `,
    styles: []
})
export class DashboardComponent {
    currentUser$;

    constructor(private authService: AuthService) {
        this.currentUser$ = this.authService.currentUser$;
    }
}
