import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DashboardOverviewComponent } from './features/dashboard/dashboard-overview.component';
import { HomeComponent } from './features/home/home.component';
import { NotFound } from './features/not-found/not-found';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: DashboardOverviewComponent
            },
            {
                path: 'procurement',
                loadChildren: () => import('./features/procurement/procurement.routes').then(m => m.PROCUREMENT_ROUTES)
            },
            {
                path: 'production',
                loadChildren: () => import('./features/production/production.routes').then(m => m.PRODUCTION_ROUTES)
            },
            {
                path: 'customers',
                loadChildren: () => import('./features/customers/customers-routing.module').then(m => m.CustomersRoutingModule)
            },
            {
                path: 'settings',
                // Assuming there might be a settings component later, for now we can redirect or placeholder
                redirectTo: '',
                pathMatch: 'full'
            }
        ]
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
