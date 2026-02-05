import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { RawMaterialService } from '../../../core/services/raw-material.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RawMaterial } from '../../../core/models/raw-material';
import { Product, BillOfMaterial } from '../../../core/models/product';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
    productForm: FormGroup;
    isEditMode = false;
    productId: number | null = null;
    isLoading = false;
    materials: RawMaterial[] = [];

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private rawMaterialService: RawMaterialService,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {
        this.productForm = this.fb.group({
            name: ['', [Validators.required]],
            description: [''],
            productionTime: [null, [Validators.required, Validators.min(1)]],
            cost: [null, [Validators.required, Validators.min(0)]],
            unit: ['', [Validators.required]],
            minimumStock: [0, [Validators.required, Validators.min(0)]],
            billOfMaterials: this.fb.array([], [Validators.required])
        });
    }

    ngOnInit(): void {
        this.loadMaterials();
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.productId = +params['id'];
                this.loadProduct(this.productId);
            } else {
                // Add one initial BOM line if new
                this.addBOMItem();
            }
        });
    }

    get bomItems(): FormArray {
        return this.productForm.get('billOfMaterials') as FormArray;
    }

    createBOMItem(item?: BillOfMaterial): FormGroup {
        return this.fb.group({
            materialId: [item?.materialId || null, [Validators.required]],
            quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]]
        });
    }

    addBOMItem(): void {
        this.bomItems.push(this.createBOMItem());
    }

    removeBOMItem(index: number): void {
        if (this.bomItems.length > 1) {
            this.bomItems.removeAt(index);
        } else {
            this.notificationService.show('At least one material is required', 'warning');
        }
    }

    loadMaterials(): void {
        console.log('Loading materials for BOM...');
        this.rawMaterialService.getAllRawMaterials(0, 500).subscribe({
            next: (response: any) => {
                console.log('Raw materials response received:', response);
                let data: any[] = [];

                if (Array.isArray(response)) {
                    data = response;
                } else if (response && response.data) {
                    if (Array.isArray(response.data)) {
                        data = response.data;
                    } else if (Array.isArray(response.data.content)) {
                        data = response.data.content;
                    } else if (response.data.data && Array.isArray(response.data.data.content)) {
                        data = response.data.data.content; // Extreme wrapping
                    }
                } else if (response && Array.isArray(response.content)) {
                    data = response.content;
                }

                this.materials = data || [];
                console.log('Processed materials for select:', this.materials);
                this.cdr.detectChanges();

                if (this.materials.length === 0) {
                    console.warn('No materials were processed from the response');
                }
            },
            error: (error) => {
                console.error('Error loading materials', error);
                this.notificationService.show('Failed to load raw materials', 'error');
            }
        });
    }

    loadProduct(id: number): void {
        this.isLoading = true;
        this.productService.getProductById(id).subscribe({
            next: (response: any) => {
                const product = response.data || response;
                if (product) {
                    this.productForm.patchValue({
                        name: product.name,
                        description: product.description,
                        productionTime: product.productionTime,
                        cost: product.cost,
                        unit: product.unit,
                        minimumStock: product.minimumStock
                    });

                    // Clear and fill BOM array
                    while (this.bomItems.length) {
                        this.bomItems.removeAt(0);
                    }
                    product.billOfMaterials?.forEach((item: BillOfMaterial) => {
                        this.bomItems.push(this.createBOMItem(item));
                    });
                }
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading product', error);
                this.isLoading = false;
                this.notificationService.show('Failed to load product', 'error');
            }
        });
    }

    onSubmit(): void {
        if (this.productForm.invalid) {
            this.productForm.markAllAsTouched();
            this.notificationService.show('Please fill all required fields correctly', 'error');
            return;
        }

        this.isLoading = true;
        const productData: Product = this.productForm.value;

        if (this.isEditMode && this.productId) {
            this.productService.updateProduct(this.productId, productData).subscribe({
                next: () => {
                    this.notificationService.show('Product updated successfully', 'success');
                    this.router.navigate(['/dashboard/production/products']);
                },
                error: (error) => {
                    this.notificationService.show(error.error?.message || 'Failed to update product', 'error');
                    this.isLoading = false;
                }
            });
        } else {
            this.productService.createProduct(productData).subscribe({
                next: () => {
                    this.notificationService.show('Product created successfully', 'success');
                    this.router.navigate(['/dashboard/production/products']);
                },
                error: (error) => {
                    this.notificationService.show(error.error?.message || 'Failed to create product', 'error');
                    this.isLoading = false;
                }
            });
        }
    }
}
