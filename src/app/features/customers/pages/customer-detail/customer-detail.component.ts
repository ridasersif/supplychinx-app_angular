import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
    selector: 'app-customer-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './customer-detail.component.html',
    styleUrl: './customer-detail.component.css'
})
export class CustomerDetailComponent implements OnInit {
    customer: Customer | null = null;
    isLoading = false;

    constructor(
        private customerService: CustomerService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
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
            }
        });
    }
}
