import { Routes } from '@angular/router';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { RawMaterialListComponent } from './raw-material-list/raw-material-list.component';
import { RawMaterialFormComponent } from './raw-material-form/raw-material-form.component';
import { SupplyOrderListComponent } from './supply-order-list/supply-order-list.component';
import { SupplyOrderFormComponent } from './supply-order-form/supply-order-form.component';

export const PROCUREMENT_ROUTES: Routes = [
    {
        path: 'suppliers',
        component: SupplierListComponent
    },
    {
        path: 'suppliers/new',
        component: SupplierFormComponent
    },
    {
        path: 'suppliers/edit/:id',
        component: SupplierFormComponent
    },
    {
        path: 'raw-materials',
        component: RawMaterialListComponent
    },
    {
        path: 'raw-materials/new',
        component: RawMaterialFormComponent
    },
    {
        path: 'raw-materials/edit/:id',
        component: RawMaterialFormComponent
    },
    {
        path: 'supply-orders',
        component: SupplyOrderListComponent
    },
    {
        path: 'supply-orders/new',
        component: SupplyOrderFormComponent
    },
    {
        path: 'supply-orders/edit/:id',
        component: SupplyOrderFormComponent
    },
    {
        path: '',
        redirectTo: 'suppliers',
        pathMatch: 'full'
    }
];
