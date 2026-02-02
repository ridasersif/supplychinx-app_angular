import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupplierService } from '../../../core/services/supplier.service';
import { Supplier } from '../../../core/models/supplier';
import { NotificationService } from '../../../core/services/notification.service';
import { RawMaterialService } from '../../../core/services/raw-material.service';
import { RawMaterial } from '../../../core/models/raw-material';

@Component({
    selector: 'app-supplier-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './supplier-form.component.html',
    styleUrls: ['./supplier-form.component.css']
})
export class SupplierFormComponent implements OnInit {
    supplierForm: FormGroup;
    isEditMode = false;
    supplierId: number | null = null;
    isLoading = false;
    availableMaterials: RawMaterial[] = [];

    constructor(
        private fb: FormBuilder,
        private supplierService: SupplierService,
        private rawMaterialService: RawMaterialService,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.supplierForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            contact: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
            rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
            leadTime: [1, [Validators.required, Validators.min(1)]],
            materialIds: [[], []] // Removed required validation to allow initial creation
        });
    }

    ngOnInit(): void {
        this.loadMaterials();
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.supplierId = +params['id'];
                this.loadSupplier(this.supplierId);
            }
        });
    }

    loadMaterials(): void {
        console.log('Loading materials for supplier form...');
        this.rawMaterialService.getAllRawMaterials(0, 100).subscribe({
            next: (response: any) => {
                console.log('Materials response:', response);
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
                this.availableMaterials = data;
                console.log('Available materials count:', this.availableMaterials.length);
            },
            error: (err) => {
                console.error('Error loading materials', err);
                this.notificationService.error('Failed to load materials list');
            }
        });
    }

    loadSupplier(id: number): void {
        this.isLoading = true;
        this.supplierService.getSupplierById(id).subscribe({
            next: (response) => {
                const supplier = response.data;
                this.supplierForm.patchValue({
                    name: supplier.name,
                    contact: supplier.contact,
                    email: supplier.email,
                    phone: supplier.phone,
                    rating: supplier.rating,
                    leadTime: supplier.leadTime,
                    materialIds: supplier.materialIds || []
                });
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading supplier', error);
                this.notificationService.error('Failed to load supplier details');
                this.isLoading = false;
            }
        });
    }

    onToggleMaterial(materialId: number, event: any): void {
        const materialIds = this.supplierForm.get('materialIds')?.value as number[];
        if (event.target.checked) {
            if (!materialIds.includes(materialId)) {
                this.supplierForm.get('materialIds')?.setValue([...materialIds, materialId]);
            }
        } else {
            this.supplierForm.get('materialIds')?.setValue(materialIds.filter(id => id !== materialId));
        }
        this.supplierForm.get('materialIds')?.markAsTouched();
    }

    isMaterialSelected(materialId: number): boolean {
        const materialIds = this.supplierForm.get('materialIds')?.value as number[];
        return materialIds && materialIds.includes(materialId);
    }

    onSubmit(): void {
        console.log('Suppler Form Value:', this.supplierForm.value);
        console.log('Suppler Form Status:', this.supplierForm.status);

        if (this.supplierForm.invalid) {
            this.supplierForm.markAllAsTouched();
            const invalidFields = [];
            for (const name in this.supplierForm.controls) {
                if (this.supplierForm.controls[name].invalid) {
                    invalidFields.push(name);
                }
            }
            console.warn('Invalid fields:', invalidFields);
            this.notificationService.error(`Form is invalid. Please check: ${invalidFields.join(', ')}`);
            return;
        }

        this.isLoading = true;
        const supplierData: Supplier = {
            ...this.supplierForm.value,
            idSupplier: this.isEditMode ? this.supplierId : undefined
        };

        if (this.isEditMode && this.supplierId) {
            this.supplierService.updateSupplier(this.supplierId, supplierData).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.notificationService.success('Supplier updated successfully');
                    this.router.navigate(['/procurement/suppliers']);
                },
                error: (error) => {
                    console.error('Error updating supplier', error);
                    this.notificationService.error('Failed to update supplier');
                    this.isLoading = false;
                }
            });
        } else {
            this.supplierService.createSupplier(supplierData).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.notificationService.success('Supplier created successfully');
                    this.router.navigate(['/procurement/suppliers']);
                },
                error: (error) => {
                    console.error('Error creating supplier', error);
                    const errorMsg = error.error?.message || 'Check validation errors.';
                    this.notificationService.error(`Failed to create supplier: ${errorMsg}`);
                    this.isLoading = false;
                }
            });
        }
    }
}
