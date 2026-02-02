import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupplierService } from '../../../core/services/supplier.service';
import { Supplier } from '../../../core/models/supplier';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-supplier-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './supplier-list.component.html',
    styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
    suppliers: Supplier[] = [];
    isLoading = false;
    totalElements = 0;
    currentPage = 0;
    pageSize = 10;
    searchText = '';

    constructor(
        private supplierService: SupplierService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.loadSuppliers();
    }

    loadSuppliers(): void {
        this.isLoading = true;
        this.supplierService.getAllSuppliers(this.currentPage, this.pageSize, this.searchText).subscribe({
            next: (response) => {
                let data: any[] = [];
                // Robust data extraction strategy
                if (Array.isArray(response)) {
                    data = response;
                } else if (response && Array.isArray((response as any).data)) {
                    data = (response as any).data;
                } else if (response && (response as any).data && Array.isArray((response as any).data.content)) {
                    data = (response as any).data.content;
                } else if (response && Array.isArray((response as any).content)) {
                    data = (response as any).content;
                } else {
                    console.warn('Unknown response structure', response);
                }

                this.suppliers = data || [];
                // Check if totalElements is present in different locations
                this.totalElements = (response as any).totalElements ||
                    ((response as any).data && (response as any).data.totalElements) ||
                    this.suppliers.length;

                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading suppliers', error);
                this.isLoading = false;
                this.notificationService.show('Failed to load suppliers: ' + (error.statusText || 'Server Error'), 'error');
            }
        });
    }

    onSearch(): void {
        this.currentPage = 0;
        this.loadSuppliers();
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadSuppliers();
    }

    deleteSupplier(id: number): void {
        const targetId = id; // The id passed comes from the template fallback already
        if (confirm('Are you sure you want to delete this supplier?')) {
            this.supplierService.deleteSupplier(targetId).subscribe({
                next: () => {
                    this.notificationService.show('Supplier deleted successfully', 'success');
                    this.loadSuppliers();
                },
                error: (error) => {
                    console.error('Error deleting supplier', error);
                    this.notificationService.show('Could not delete supplier. It might have active orders.', 'error');
                }
            });
        }
    }
}
