import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { ToastNotificationComponent } from './shared/components/toast-notification/toast-notification.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, AsyncPipe, RouterOutlet, RouterLink, RouterLinkActive, ToastNotificationComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
    title = 'SupplyChainX';
    showDashboardLayout = false;

    constructor(
        public authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            const url = event.urlAfterRedirects || event.url;
            // Hide dashboard layout for home and auth pages
            this.showDashboardLayout = !url.includes('/home') && !url.includes('/auth/');
        });
    }

    logout() {
        this.authService.logout();
    }
}
