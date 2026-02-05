import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductionOrderService } from '../../../core/services/production-order.service';
import { ProductService } from '../../../core/services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models/product';

@Component({
    selector: 'app-production-order-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './order-form.component.html',
    styleUrls: ['./order-form.component.css']
})
export class ProductionOrderFormComponent implements OnInit {
    orderForm: FormGroup;
    isLoading = false;
    products: Product[] = [];

    constructor(
        private fb: FormBuilder,
        private orderService: ProductionOrderService,
        private productService: ProductService,
        private notificationService: NotificationService,
        private router: Router
    ) {
        this.orderForm = this.fb.group({
            productId: [null, [Validators.required]],
            quantity: [null, [Validators.required, Validators.min(1)]],
            priority: ['MEDIUM', [Validators.required]],
            startDate: [new Date().toISOString().substring(0, 10), [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.productService.getAllProducts(0, 100).subscribe({
            next: (response: any) => {
                let data: any[] = [];
                if (response && response.data && response.data.content) {
                    data = response.data.content;
                } else if (response && response.data) {
                    data = response.data;
                }
                this.products = data || [];
            }
        });
    }

    onSubmit(): void {
        if (this.orderForm.invalid) {
            this.orderForm.markAllAsTouched();
            this.notificationService.show('Please fill all required fields', 'error');
            return;
        }

        this.isLoading = true;
        this.orderService.createProductionOrder(this.orderForm.value).subscribe({
            next: () => {
                this.notificationService.show('Production Order launched successfully', 'success');
                this.router.navigate(['/dashboard/production/orders']);
            },
            error: (error) => {
                console.error('Error creating production order', error);
                this.notificationService.show(error.error?.message || 'Failed to launch production order. Check material availability.', 'error');
                this.isLoading = false;
            }
        });
    }
}
