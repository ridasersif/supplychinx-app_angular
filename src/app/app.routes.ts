import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HomeComponent } from './features/home/home.component';
import { NotFound } from './features/not-found/not-found';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'procurement',
        loadChildren: () => import('./features/procurement/procurement.routes').then(m => m.PROCUREMENT_ROUTES),
        canActivate: [authGuard]
    },
    {
        path: 'customers',
        loadChildren: () => import('./features/customers/customers-routing.module').then(m => m.CustomersRoutingModule),
        canActivate: [authGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        redirectTo: 'auth/login'
    },
    {
        path: 'register',
        redirectTo: 'auth/register'
    },
    {
        path: '**',
        component: NotFound
    }
];
