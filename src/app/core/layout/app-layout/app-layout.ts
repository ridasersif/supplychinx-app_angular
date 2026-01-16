import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../auth/auth.models';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout-wrapper">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
           <span class="brand">SupplyChain<span class="highlight">X</span></span>
        </div>
        
        <nav class="sidebar-nav">
          <a [routerLink]="['/dashboard']" routerLinkActive="active" class="nav-item">
            <span class="icon">📊</span>
            Tableau de bord
          </a>
          
          <div class="nav-section">APPROVISIONNEMENT</div>
          <a class="nav-item disabled">
            <span class="icon">📦</span> Fournisseurs
          </a>
          <a class="nav-item disabled">
            <span class="icon">📄</span> Commandes
          </a>

          <div class="nav-section">PRODUCTION</div>
          <a class="nav-item disabled">
            <span class="icon">⚙️</span> Ordres de Production
          </a>

          <div class="nav-section">LIVRAISON</div>
          <a class="nav-item disabled">
            <span class="icon">🚚</span> Livraisons
          </a>

          <!-- Admin Section -->
          <ng-container *ngIf="isAdmin$ | async">
            <div class="nav-section">ADMINISTRATION</div>
            <a [routerLink]="['/admin/create-user']" routerLinkActive="active" class="nav-item">
                <span class="icon">👤</span> Gestion Utilisateurs
            </a>
          </ng-container>
        </nav>
      </aside>

      <div class="main-content">
        <!-- Header -->
        <header class="top-header">
          <div class="header-left">
            <button class="menu-toggle">☰</button>
            <h2 class="page-title">Bienvenue</h2>
          </div>
          <div class="header-right">
            <div class="user-info">
              <span class="user-name">{{ (currentUser$ | async)?.sub }}</span>
              <span class="user-role">{{ (currentUser$ | async)?.roles?.[0] }}</span>
            </div>
            <button (click)="onLogout()" class="btn-logout" title="Déconnexion">
              🚪 Déconnexion
            </button>
          </div>
        </header>

        <!-- Dynamic Content -->
        <main class="page-body">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      width: 260px;
      background: #1e293b;
      color: white;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #334155;
    }

    .brand {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .highlight {
      color: #6366f1;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
    }

    .nav-item:hover {
      background: #334155;
      color: white;
    }

    .nav-item.active {
      background: #334155;
      color: white;
      border-left: 4px solid #6366f1;
    }

    .nav-item .icon {
      margin-right: 0.75rem;
      font-size: 1.2rem;
    }

    .nav-section {
      padding: 1.5rem 1.5rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      letter-spacing: 0.05em;
    }

    .nav-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--bg-body);
      overflow: hidden;
    }

    .top-header {
      height: 64px;
      background: white;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      flex-shrink: 0;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .menu-toggle {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-muted);
    }

    .page-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      text-align: right;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .user-role {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .btn-logout {
      background: #fee2e2;
      color: #b91c1c;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-logout:hover {
      background: #fecaca;
    }

    .page-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }
  `]
})
export class AppLayoutComponent {
  currentUser$;
  isAdmin$: Observable<boolean>;

  constructor(public authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAdmin$ = this.authService.currentUser$.pipe(
      map(user => user ? this.authService.hasRole(Role.ADMIN) : false)
    );
  }

  onLogout(): void {
    this.authService.logout();
  }
}
