import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RawMaterialService } from '../../../core/services/raw-material.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { RawMaterial } from '../../../core/models/raw-material';
import { Supplier } from '../../../core/models/supplier';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-raw-material-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './raw-material-form.component.html',
    styleUrls: ['./raw-material-form.component.css']
})
export class RawMaterialFormComponent implements OnInit {
    materialForm: FormGroup;
    isEditMode = false;
    materialId: number | null = null;
    isLoading = false;
    availableSuppliers: Supplier[] = [];

    constructor(
        private fb: FormBuilder,
        private rawMaterialService: RawMaterialService,
        private supplierService: SupplierService,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.materialForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            description: ['', [Validators.maxLength(255)]],
            stock: [0, [Validators.required, Validators.min(0)]],
            stockMin: [0, [Validators.required, Validators.min(0)]],
            unit: ['', [Validators.required]],
            supplierIds: [[], []] // Removed required validation to allow initial creation
        });
    }

    ngOnInit(): void {
        this.loadSuppliers();
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.materialId = +params['id'];
                this.loadMaterial(this.materialId);
            }
        });
    }

    loadSuppliers(): void {
        this.supplierService.getAllSuppliers(0, 100).subscribe({
            next: (response) => {
                if (response.data && Array.isArray(response.data)) {
                    this.availableSuppliers = response.data;
                } else if (response.data && Array.isArray(response.data['content'])) {
                    this.availableSuppliers = response.data['content'];
                }
            },
            error: (err) => console.error('Error loading suppliers', err)
        });
    }

    loadMaterial(id: number): void {
        this.isLoading = true;
        this.rawMaterialService.getRawMaterialById(id).subscribe({
            next: (response) => {
                const material = response.data;
                this.materialForm.patchValue({
                    name: material.name,
                    description: material.description,
                    stock: material.stock,
                    stockMin: material.stockMin,
                    unit: material.unit,
                    supplierIds: material.suppliers?.map(s => s.idSupplier) || []
                });
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading material', error);
                this.notificationService.error('Failed to load raw material details');
                this.isLoading = false;
            }
        });
    }

    onToggleSupplier(supplierId: number, event: any): void {
        const supplierIds = this.materialForm.get('supplierIds')?.value as number[];
        if (event.target.checked) {
            if (!supplierIds.includes(supplierId)) {
                this.materialForm.get('supplierIds')?.setValue([...supplierIds, supplierId]);
            }
        } else {
            this.materialForm.get('supplierIds')?.setValue(supplierIds.filter(id => id !== supplierId));
        }
        this.materialForm.get('supplierIds')?.markAsTouched();
    }

    isSupplierSelected(supplierId: number): boolean {
        const supplierIds = this.materialForm.get('supplierIds')?.value as number[];
        return supplierIds && supplierIds.includes(supplierId);
    }

    onSubmit(): void {
        if (this.materialForm.invalid) {
            this.materialForm.markAllAsTouched();
            const invalidFields = [];
            for (const name in this.materialForm.controls) {
                if (this.materialForm.controls[name].invalid) {
                    invalidFields.push(name);
                }
            }
            this.notificationService.error(`Form is invalid. Please check: ${invalidFields.join(', ')}`);
            return;
        }

        this.isLoading = true;
        const formValue = this.materialForm.value;

        const materialData: RawMaterial = {
            ...formValue,
            idMaterial: this.isEditMode && this.materialId ? this.materialId : undefined
        };

        if (this.isEditMode && this.materialId) {
            this.rawMaterialService.updateRawMaterial(this.materialId, materialData).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.notificationService.success('Raw material updated successfully');
                    this.router.navigate(['/dashboard/procurement/raw-materials']);
                },
                error: (error) => {
                    console.error('Error updating material', error);
                    this.notificationService.error('Failed to update raw material');
                    this.isLoading = false;
                }
            });
        } else {
            this.rawMaterialService.createRawMaterial(materialData).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.notificationService.success('Raw material created successfully');
                    this.router.navigate(['/dashboard/procurement/raw-materials']);
                },
                error: (error) => {
                    console.error('Error creating material', error);
                    const errorMsg = error.error?.message || 'Check validation errors.';
                    this.notificationService.error(`Failed to create raw material: ${errorMsg}`);
                    this.isLoading = false;
                }
            });
        }
    }
}
