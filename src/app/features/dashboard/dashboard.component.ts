import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink],
  template: `
    <div class="dashboard-header animate-fade" *ngIf="authService.currentUser$ | async as user">
      <h1>Welcome back, {{ user.sub.split('@')[0] }}!</h1>
      <p>Here's what's happening with your supply chain today.</p>
    </div>

    <div class="dashboard-stats animate-fade" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 30px;">
      <div class="glass-card stat-card" style="padding: 20px;">
        <i class="fas fa-users" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 10px;"></i>
        <h3>Active Customers</h3>
        <p style="font-size: 1.5rem; font-weight: 700;">1,284</p>
      </div>
      <div class="glass-card stat-card" style="padding: 20px;">
        <i class="fas fa-truck" style="font-size: 2rem; color: var(--accent-color); margin-bottom: 10px;"></i>
        <h3>Shipments</h3>
        <p style="font-size: 1.5rem; font-weight: 700;">42 Pending</p>
      </div>
      <div class="glass-card stat-card" style="padding: 20px;">
        <i class="fas fa-box" style="font-size: 2rem; color: var(--success-color); margin-bottom: 10px;"></i>
        <h3>Inventory</h3>
        <p style="font-size: 1.5rem; font-weight: 700;">85% Capacity</p>
      </div>
    </div>

    <!-- Procurement Navigation -->
    <h2 style="margin-top: 40px; margin-bottom: 20px;">Procurement Module</h2>
    <div class="procurement-nav animate-fade" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
        <div class="glass-card nav-card" routerLink="/procurement/suppliers" style="padding: 20px; cursor: pointer; text-align: center;">
            <i class="fas fa-building" style="font-size: 2rem; color: #4361ee; margin-bottom: 10px;"></i>
            <h3>Suppliers</h3>
            <p>Manage Suppliers</p>
        </div>
        <div class="glass-card nav-card" routerLink="/procurement/raw-materials" style="padding: 20px; cursor: pointer; text-align: center;">
            <i class="fas fa-cubes" style="font-size: 2rem; color: #f72585; margin-bottom: 10px;"></i>
            <h3>Raw Materials</h3>
            <p>Manage Inventory</p>
        </div>
        <div class="glass-card nav-card" routerLink="/procurement/supply-orders" style="padding: 20px; cursor: pointer; text-align: center;">
            <i class="fas fa-clipboard-list" style="font-size: 2rem; color: #4cc9f0; margin-bottom: 10px;"></i>
            <h3>Supply Orders</h3>
            <p>Create & Track Orders</p>
        </div>
    </div>
  `,
  styles: [`
    .dashboard-header h1 { margin-bottom: 5px; }
    .dashboard-header p { color: var(--text-secondary); }
    .stat-card:hover { transform: translateY(-5px); transition: transform 0.3s ease; }
  `]
})
export class DashboardComponent {
  constructor(public authService: AuthService) { }
}
