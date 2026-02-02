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
            material.suppliers?.some(s => (s.idSupplier || s.id) == supplierId)
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
            next: (response: any) => {
                // Robust extraction: backend might wrap in .data or return directly
                const order = response.data || response;

                if (order) {
                    this.orderForm.patchValue({
                        supplierId: order.supplier?.idSupplier || order.supplier?.id,
                        materialIds: order.orderLines?.map((l: any) => l.rawMaterial?.idMaterial || l.rawMaterial?.id) || [],
                        status: order.status,
                        orderDate: order.orderDate
                    });

                    if (order.supplier?.idSupplier) {
                        this.filterMaterialsBySupplier(order.supplier.idSupplier);
                    }
                }
                this.isLoading = false;
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
            material.suppliers?.some(s => (s.idSupplier || s.id) == supplierId)
        );
    }

    onSubmit(): void {
        console.log('--- Supply Order Submission Attempt ---');
        console.log('Form Value:', this.orderForm.value);
        console.log('Form Status:', this.orderForm.status);

        if (this.orderForm.invalid) {
            this.orderForm.markAllAsTouched();
            const errors: string[] = [];

            if (this.orderForm.get('supplierId')?.invalid) errors.push('Partner Supplier');
            if (this.orderForm.get('orderDate')?.invalid) errors.push('Order Date');
            if (this.orderForm.get('status')?.invalid) errors.push('Fulfillment Status');

            const materialIds = this.orderForm.get('materialIds')?.value;
            if (!materialIds || materialIds.length === 0) {
                errors.push('At least one material');
            }

            this.notificationService.error(`Form incomplete. Please check: ${errors.join(', ')}`);
            console.warn('Form validation failed:', errors);
            return;
        }

        const formValue = this.orderForm.value;
        if (!formValue.materialIds || formValue.materialIds.length === 0) {
            this.notificationService.warning('Please select at least one material for this order.');
            return;
        }

        this.isLoading = true;

        // Construct objects from IDs
        const selectedSupplier = this.suppliers.find(s => (s.idSupplier || s.id) == formValue.supplierId);
        const selectedMaterials = this.allMaterials.filter(m => formValue.materialIds.includes(m.idMaterial || m.id));

        console.log('Selected Supplier:', selectedSupplier);
        console.log('Selected Materials Count:', selectedMaterials.length);

        if (!selectedSupplier) {
            this.isLoading = false;
            this.notificationService.error('Selected supplier not found in local data. Please refresh and try again.');
            return;
        }

        const orderData: any = {
            idOrder: this.isEditMode && this.orderId ? this.orderId : undefined,
            supplierId: formValue.supplierId,
            orderLines: selectedMaterials.map(m => {
                const matId = m.idMaterial || m.id;
                if (!matId) {
                    console.error('Missing ID for material:', m);
                }
                return {
                    idLine: matId, // Mapping material ID to idLine as verified by USER's Postman example
                    quantity: 1,
                    unitPrice: 0
                };
            }),
            orderDate: formValue.orderDate,
            status: formValue.status,
            orderNumber: `ORD-${Date.now().toString().slice(-6)}`
        };

        // Final sanity check before sending
        if (!orderData.supplierId) {
            console.error('MISSING SUPPLIER ID', orderData);
            this.notificationService.error('Critical Error: Supplier ID is missing.');
            this.isLoading = false;
            return;
        }

        if (orderData.orderLines.some((l: any) => !l.idLine)) {
            console.error('MISSING MATERIAL ID (idLine) IN LINES', orderData);
            this.notificationService.error('Critical Error: One or more material IDs are missing.');
            this.isLoading = false;
            return;
        }

        console.log('Final DTO Payload to send:', orderData);
        console.log('Sample Material ID:', selectedMaterials[0]?.idMaterial);

        if (this.isEditMode && this.orderId) {
            this.supplyOrderService.updateSupplyOrder(this.orderId, orderData).subscribe({
                next: (res) => {
                    console.log('Update Success:', res);
                    this.notificationService.success('Supply Order updated successfully');
                    this.isLoading = false;
                    this.router.navigate(['/procurement/supply-orders']);
                },
                error: (error) => {
                    console.error('API Error (Update):', error);
                    this.notificationService.error('Failed to update order: ' + (error.error?.message || 'Server error'));
                    this.isLoading = false;
                }
            });
        } else {
            this.supplyOrderService.createSupplyOrder(orderData).subscribe({
                next: (res) => {
                    console.log('Create Success:', res);
                    this.notificationService.success('Supply Order created successfully');
                    this.isLoading = false;
                    this.router.navigate(['/procurement/supply-orders']);
                },
                error: (error) => {
                    console.error('API Error (Create):', error);
                    this.notificationService.error('Failed to create order: ' + (error.error?.message || 'Server error'));
                    this.isLoading = false;
                }
            });
        }
    }
}
