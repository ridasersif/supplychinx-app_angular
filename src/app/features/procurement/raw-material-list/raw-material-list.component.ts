import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RawMaterialService } from '../../../core/services/raw-material.service';
import { RawMaterial } from '../../../core/models/raw-material';
import { NotificationService } from '../../../core/services/notification.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
    selector: 'app-raw-material-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ModalComponent],
    templateUrl: './raw-material-list.component.html',
    styleUrls: ['./raw-material-list.component.css']
})
export class RawMaterialListComponent implements OnInit {
    materials: RawMaterial[] = [];
    isLoading = false;
    totalElements = 0;
    currentPage = 0;
    pageSize = 10;
    searchText = '';

    // Modal state
    isDetailModalOpen = false;
    isDeleteModalOpen = false;
    selectedMaterial: RawMaterial | null = null;
    materialToDelete: RawMaterial | null = null;

    constructor(
        private rawMaterialService: RawMaterialService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.loadMaterials();
    }

    loadMaterials(): void {
        this.isLoading = true;
        this.rawMaterialService.getAllRawMaterials(this.currentPage, this.pageSize, this.searchText).subscribe({
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

                this.materials = data || [];
                // Check if totalElements is present in different locations
                this.totalElements = (response as any).totalElements ||
                    ((response as any).data && (response as any).data.totalElements) ||
                    this.materials.length;

                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading materials', error);
                this.isLoading = false;
                this.notificationService.show('Failed to load materials: ' + (error.statusText || 'Server Error'), 'error');
            }
        });
    }

    onSearch(): void {
        this.currentPage = 0;
        this.loadMaterials();
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadMaterials();
    }

    showInfo(material: RawMaterial): void {
        this.selectedMaterial = material;
        this.isDetailModalOpen = true;
    }

    confirmDelete(material: RawMaterial): void {
        this.materialToDelete = material;
        this.isDeleteModalOpen = true;
    }

    deleteMaterial(): void {
        if (!this.materialToDelete || !(this.materialToDelete.idMaterial || this.materialToDelete.id)) return;

        const id = (this.materialToDelete.idMaterial || this.materialToDelete.id)!;
        this.rawMaterialService.deleteRawMaterial(id).subscribe({
            next: () => {
                this.notificationService.show('Material deleted successfully', 'success');
                this.isDeleteModalOpen = false;
                this.materialToDelete = null;
                this.loadMaterials();
            },
            error: (error) => {
                console.error('Error deleting material', error);
                const errorMsg = error.error?.message || 'Check if it is used in orders or BOMs.';
                this.notificationService.show(`Could not delete material: ${errorMsg}`, 'error');
                this.isDeleteModalOpen = false;
                this.materialToDelete = null;
            }
        });
    }

    closeModals(): void {
        this.isDetailModalOpen = false;
        this.isDeleteModalOpen = false;
        this.selectedMaterial = null;
        this.materialToDelete = null;
    }

    isCriticalStock(material: RawMaterial): boolean {
        return material.stock <= material.stockMin;
    }
}
