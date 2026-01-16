import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth-routing.module').then(m => m.AuthRoutingModule)
    },
    {
        path: 'customers',
        loadChildren: () => import('./customers/customers-routing.module').then(m => m.CustomersRoutingModule),
        canActivate: [authGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        redirectTo: 'auth/login'
    },
    {
        path: 'register',
        redirectTo: 'auth/register'
    }
];
