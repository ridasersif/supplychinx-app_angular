import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupplyOrderService } from '../../../core/services/supply-order.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { RawMaterialService } from '../../../core/services/raw-material.service';
import { Supplier } from '../../../core/models/supplier';
import { RawMaterial } from '../../../core/models/raw-material';
import { SupplyOrder } from '../../../core/models/supply-order';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-supply-order-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './supply-order-form.component.html',
    styleUrls: ['./supply-order-form.component.css']
})
export class SupplyOrderFormComponent implements OnInit {
    orderForm: FormGroup;
    isEditMode = false;
    orderId: number | null = null;
    isLoading = false;
    suppliers: Supplier[] = [];
    allMaterials: RawMaterial[] = [];
    filteredMaterials: RawMaterial[] = [];

    constructor(
        private fb: FormBuilder,
        private supplyOrderService: SupplyOrderService,
        private supplierService: SupplierService,
        private rawMaterialService: RawMaterialService,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.orderForm = this.fb.group({
            supplierId: [null, [Validators.required]],
            materialIds: [[], [Validators.required]],
            status: ['EN_ATTENTE', [Validators.required]],
            orderDate: [new Date().toISOString().substring(0, 10), [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.loadSuppliers();
        this.loadMaterials();

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.orderId = +params['id'];
                this.loadOrder(this.orderId);
            }
        });

        // Listen to supplier changes to filter materials
        this.orderForm.get('supplierId')?.valueChanges.subscribe(supplierId => {
            this.filterMaterialsBySupplier(supplierId);
        });
    }

    loadSuppliers(): void {
        this.supplierService.getAllSuppliers(0, 100).subscribe({
            next: (response: any) => {
                let data: any[] = [];
                if (Array.isArray(response)) {
                    data = response;
                } else if (response && Array.isArray(response.data)) {
                    data = response.data;
                } else if (response && response.data && Array.isArray(response.data.content)) {
                    data = response.data.content;
                } else if (response && Array.isArray(response.content)) {
                    data = response.content;
                }
                this.suppliers = data;
                // Initial filtering if supplier is already selected (e.g. edit mode)
                const currentSupplierId = this.orderForm.get('supplierId')?.value;
                if (currentSupplierId) {
                    this.filterMaterialsBySupplier(currentSupplierId);
                }
            }
        });
    }

    loadMaterials(): void {
        this.rawMaterialService.getAllRawMaterials(0, 100).subscribe({
            next: (response: any) => {
                let data: any[] = [];
                if (Array.isArray(response)) {
                    data = response;
                } else if (response && Array.isArray(response.data)) {
                    data = response.data;
                } else if (response && response.data && Array.isArray(response.data.content)) {
                    data = response.data.content;
                } else if (response && Array.isArray(response.content)) {
                    data = response.content;
                }
                this.allMaterials = data;
                // Initial filtering if supplier is already selected
                const currentSupplierId = this.orderForm.get('supplierId')?.value;
                if (currentSupplierId) {
                    this.filterMaterialsBySupplier(currentSupplierId);
                }
            }
        });
    }

    filterMaterialsBySupplier(supplierId: any): void {
        if (!supplierId || !this.allMaterials.length) {
            this.filteredMaterials = [];
            return;
        }
        // Use == to handle string/number comparison from select values
        this.filteredMaterials = this.allMaterials.filter(material =>
            material.suppliers?.some(s => s.id == supplierId)
        );

        // If no materials are linked to this supplier yet, show all as fallback
        // to avoid blocking the user during initial data seeding
        if (this.filteredMaterials.length === 0) {
            this.filteredMaterials = [...this.allMaterials];
        }
    }

    loadOrder(id: number): void {
        this.isLoading = true;
        this.supplyOrderService.getSupplyOrderById(id).subscribe({
            next: (response) => {
                const order = response.data;
                this.orderForm.patchValue({
                    supplierId: order.supplier.id,
                    materialIds: order.materials.map(m => m.id),
                    status: order.status,
                    orderDate: order.orderDate
                });
                this.isLoading = false;
                // Trigger filter
                if (order.supplier.id) {
                    this.filterMaterialsBySupplier(order.supplier.id);
                }
            },
            error: (error) => {
                console.error('Error loading order', error);
                this.isLoading = false;
            }
        });
    }

    onToggleMaterial(materialId: number): void {
        const materialIds = this.orderForm.get('materialIds')?.value as number[];
        if (materialIds.includes(materialId)) {
            this.orderForm.get('materialIds')?.setValue(materialIds.filter(id => id !== materialId));
        } else {
            this.orderForm.get('materialIds')?.setValue([...materialIds, materialId]);
        }
        this.orderForm.get('materialIds')?.markAsTouched();
    }

    isMaterialSelected(materialId: number): boolean {
        const materialIds = this.orderForm.get('materialIds')?.value as number[];
        return materialIds && materialIds.includes(materialId);
    }

    isSupplierLinkedToAnyMaterial(): boolean {
        const supplierId = this.orderForm.get('supplierId')?.value;
        if (!supplierId || !this.allMaterials.length) return true;
        return this.allMaterials.some(material =>
            material.suppliers?.some(s => s.id == supplierId)
        );
    }

    onSubmit(): void {
        console.log('Supply Order Form Value:', this.orderForm.value);
        if (this.orderForm.invalid) {
            this.orderForm.markAllAsTouched();
            const invalidFields = [];
            for (const name in this.orderForm.controls) {
                if (this.orderForm.controls[name].invalid) {
                    invalidFields.push(name);
                }
            }
            this.notificationService.error(`Form is invalid. Check: ${invalidFields.join(', ')}`);
            return;
        }

        this.isLoading = true;
        const formValue = this.orderForm.value;

        // Construct objects from IDs
        const selectedSupplier = this.suppliers.find(s => s.id == formValue.supplierId);
        const selectedMaterials = this.allMaterials.filter(m => formValue.materialIds.includes(m.id));

        if (!selectedSupplier) {
            this.isLoading = false;
            return;
        }

        const orderData: SupplyOrder = {
            id: this.isEditMode && this.orderId ? this.orderId : undefined,
            supplier: selectedSupplier,
            materials: selectedMaterials,
            orderDate: formValue.orderDate,
            status: formValue.status
        };

        if (this.isEditMode && this.orderId) {
            this.supplyOrderService.updateSupplyOrder(this.orderId, orderData).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.router.navigate(['/procurement/supply-orders']);
                },
                error: (error) => {
                    console.error('Error updating order', error);
                    this.isLoading = false;
                }
            });
        } else {
            this.supplyOrderService.createSupplyOrder(orderData).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.router.navigate(['/procurement/supply-orders']);
                },
                error: (error) => {
                    console.error('Error creating order', error);
                    this.isLoading = false;
                }
            });
        }
    }
}
