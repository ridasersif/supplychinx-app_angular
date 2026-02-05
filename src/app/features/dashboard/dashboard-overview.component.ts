import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-dashboard-overview',
    standalone: true,
    imports: [CommonModule, AsyncPipe, RouterLink],
    templateUrl: './dashboard-overview.component.html',
    styleUrl: './dashboard-overview.component.css'
})
export class DashboardOverviewComponent {
    constructor(public authService: AuthService) { }
}
