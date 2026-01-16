import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../models/customer.model';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-customer-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './customer-list.component.html',
    styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {
    customers: Customer[] = [];
    isLoading = false;
    totalElements = 0;
    currentPage = 0;
    pageSize = 10;
    filterText = '';

    constructor(private customerService: CustomerService) { }

    ngOnInit(): void {
        this.loadCustomers();
    }

    loadCustomers(): void {
        this.isLoading = true;
        this.customerService.getAllCustomers(this.currentPage, this.pageSize, this.filterText).subscribe({
            next: (response) => {
                this.customers = response.data.content;
                this.totalElements = response.data.totalElements;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                // Handle error
            }
        });
    }

    onSearch(): void {
        this.currentPage = 0;
        this.loadCustomers();
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadCustomers();
    }

    deleteCustomer(id: number): void {
        if (confirm('Are you sure you want to delete this customer?')) {
            this.customerService.deleteCustomer(id).subscribe({
                next: () => {
                    this.loadCustomers();
                }
            });
        }
    }
}
