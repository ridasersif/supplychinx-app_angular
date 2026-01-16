import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Role } from '../../core/auth/auth.models';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    currentUser$;

    constructor(public authService: AuthService) {
        this.currentUser$ = this.authService.currentUser$;
    }

    get isAdmin(): boolean {
        return this.authService.hasRole(Role.ADMIN);
    }
}
