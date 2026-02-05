import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
    products: Product[] = [];
    isLoading = false;
    totalElements = 0;
    currentPage = 0;
    pageSize = 10;
    sortBy = 'name';
    sortDirection = 'asc';
    protected readonly Math = Math;

    constructor(
        private productService: ProductService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.isLoading = true;
        this.productService.getAllProducts(this.currentPage, this.pageSize, this.sortBy, this.sortDirection).subscribe({
            next: (response) => {
                let data: any[] = [];
                if (response && response.data && response.data.content) {
                    data = response.data.content;
                    this.totalElements = response.data.totalElements;
                } else if (response && response.data) {
                    data = response.data;
                    this.totalElements = data.length;
                }
                this.products = data || [];
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading products', error);
                this.isLoading = false;
                this.notificationService.show('Failed to load products', 'error');
            }
        });
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadProducts();
    }

    deleteProduct(id: number): void {
        if (confirm('Are you sure you want to delete this product?')) {
            this.productService.deleteProduct(id).subscribe({
                next: () => {
                    this.notificationService.show('Product deleted successfully', 'success');
                    this.loadProducts();
                },
                error: (error) => {
                    console.error('Error deleting product', error);
                    this.notificationService.show('Could not delete product. It might have active production orders.', 'error');
                }
            });
        }
    }
}
