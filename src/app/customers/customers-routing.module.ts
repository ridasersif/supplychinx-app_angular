import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './pages/customer-list/customer-list.component';
import { CustomerFormComponent } from './pages/customer-form/customer-form.component';
import { CustomerDetailComponent } from './pages/customer-detail/customer-detail.component';

const routes: Routes = [
    { path: '', component: CustomerListComponent },
    { path: 'new', component: CustomerFormComponent },
    { path: 'edit/:id', component: CustomerFormComponent },
    { path: ':id', component: CustomerDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomersRoutingModule { }
