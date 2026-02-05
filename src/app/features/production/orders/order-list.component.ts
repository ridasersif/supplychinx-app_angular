import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductionOrderService } from '../../../core/services/production-order.service';
import { ProductionOrder, ProductionOrderStatus } from '../../../core/models/production-order';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-production-order-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css']
})
export class ProductionOrderListComponent implements OnInit {
    orders: ProductionOrder[] = [];
    isLoading = false;
    totalElements = 0;
    currentPage = 0;
    pageSize = 10;
    statusFilter: ProductionOrderStatus | '' = '';

    constructor(
        private orderService: ProductionOrderService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.isLoading = true;
        if (this.statusFilter) {
            this.orderService.getProductionOrdersByStatus(this.statusFilter, this.currentPage, this.pageSize).subscribe({
                next: (response) => this.handleResponse(response),
                error: (error) => this.handleError(error)
            });
        } else {
            this.orderService.getAllProductionOrders(this.currentPage, this.pageSize).subscribe({
                next: (response) => this.handleResponse(response),
                error: (error) => this.handleError(error)
            });
        }
    }

    private handleResponse(response: any): void {
        let data: any[] = [];
        if (response && response.data && response.data.content) {
            data = response.data.content;
            this.totalElements = response.data.totalElements;
        } else if (response && response.data) {
            data = response.data;
            this.totalElements = data.length;
        }
        this.orders = data || [];
        this.isLoading = false;
    }

    private handleError(error: any): void {
        console.error('Error loading production orders', error);
        this.isLoading = false;
        this.notificationService.show('Failed to load production orders', 'error');
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadOrders();
    }

    onStatusFilterChange(): void {
        this.currentPage = 0;
        this.loadOrders();
    }

    cancelOrder(id: number): void {
        if (confirm('Are you sure you want to cancel this production order?')) {
            this.orderService.cancelProductionOrder(id).subscribe({
                next: () => {
                    this.notificationService.show('Order cancelled successfully', 'success');
                    this.loadOrders();
                },
                error: (error) => {
                    this.notificationService.show(error.error?.message || 'Could not cancel order', 'error');
                }
            });
        }
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'EN_ATTENTE': return 'badge-warning';
            case 'EN_PRODUCTION': return 'badge-info';
            case 'TERMINE': return 'badge-success';
            case 'BLOQUE': return 'badge-danger';
            case 'ANNULE': return 'badge-secondary';
            default: return '';
        }
    }

    getPriorityBadgeClass(priority: string): string {
        switch (priority) {
            case 'LOW': return 'priority-low';
            case 'MEDIUM': return 'priority-medium';
            case 'HIGH': return 'priority-high';
            case 'URGENT': return 'priority-urgent';
            default: return '';
        }
    }
}
