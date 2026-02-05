import { Routes } from '@angular/router';
import { ProductListComponent } from './products/product-list.component';
import { ProductFormComponent } from './products/product-form.component';
import { ProductionOrderListComponent } from './orders/order-list.component';
import { ProductionOrderFormComponent } from './orders/order-form.component';

export const PRODUCTION_ROUTES: Routes = [
    {
        path: 'products',
        children: [
            { path: '', component: ProductListComponent },
            { path: 'new', component: ProductFormComponent },
            { path: 'edit/:id', component: ProductFormComponent }
        ]
    },
    {
        path: 'orders',
        children: [
            { path: '', component: ProductionOrderListComponent },
            { path: 'new', component: ProductionOrderFormComponent }
        ]
    },
    {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
    }
];
