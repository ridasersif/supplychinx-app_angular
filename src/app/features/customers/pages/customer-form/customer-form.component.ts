import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
    selector: 'app-customer-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './customer-form.component.html',
    styleUrl: './customer-form.component.css'
})
export class CustomerFormComponent implements OnInit {
    customer: Customer = {
        name: '',
        email: '',
        phone: '',
        address: ''
    };
    isLoading = false;
    isEditMode = false;
    errorMessage = '';

    constructor(
        private customerService: CustomerService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.isEditMode = true;
            this.loadCustomer(id);
        }
    }

    loadCustomer(id: number): void {
        this.isLoading = true;
        this.customerService.getCustomerById(id).subscribe({
            next: (response) => {
                this.customer = response.data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                this.errorMessage = 'Failed to load customer data';
            }
        });
    }

    onSubmit(): void {
        this.isLoading = true;
        this.errorMessage = '';

        const observation = this.isEditMode
            ? this.customerService.updateCustomer(this.customer.idCustomer!, this.customer)
            : this.customerService.createCustomer(this.customer);

        observation.subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/dashboard/customers']);
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.message || 'Failed to save customer';
            }
        });
    }
}
