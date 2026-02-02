import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupplyOrderService } from '../../../core/services/supply-order.service';
import { SupplyOrder } from '../../../core/models/supply-order';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-supply-order-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './supply-order-list.component.html',
    styleUrls: ['./supply-order-list.component.css']
})
export class SupplyOrderListComponent implements OnInit {
    orders: SupplyOrder[] = [];
    isLoading = false;
    totalElements = 0;
    currentPage = 0;
    pageSize = 10;
    statusFilter = '';

    constructor(
        private supplyOrderService: SupplyOrderService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.isLoading = true;
        this.supplyOrderService.getAllSupplyOrders(this.currentPage, this.pageSize, this.statusFilter).subscribe({
            next: (response) => {
                let data: any[] = [];
                // Robust data extraction
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

                this.orders = data || [];
                // Check if totalElements is present in different locations
                this.totalElements = (response as any).totalElements ||
                    ((response as any).data && (response as any).data.totalElements) ||
                    this.orders.length;

                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading orders', error);
                this.isLoading = false;
                this.notificationService.show('Failed to load orders: ' + (error.statusText || 'Server Error'), 'error');
            }
        });
    }

    onStatusChange(): void {
        this.currentPage = 0;
        this.loadOrders();
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadOrders();
    }

    deleteOrder(id: string | number): void {
        if (confirm('Are you sure you want to delete this order?')) {
            this.supplyOrderService.deleteSupplyOrder(id).subscribe({
                next: () => {
                    this.notificationService.show('Order deleted successfully', 'success');
                    this.loadOrders();
                },
                error: (error) => {
                    console.error('Error deleting order', error);
                    this.notificationService.show('Could not delete order. Only orders not yet received can be deleted.', 'error');
                }
            });
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'EN_ATTENTE': return 'status-warning';
            case 'EN_COURS': return 'status-info';
            case 'RECUE': return 'status-success';
            default: return 'status-default';
        }
    }
}
