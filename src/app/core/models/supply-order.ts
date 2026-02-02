import { Supplier } from './supplier';
import { RawMaterial } from './raw-material';

export interface SupplyOrderLine {
    idLine?: number;
    rawMaterial: { idMaterial: number };
    quantity: number;
    unitPrice: number;
}

export interface SupplyOrder {
    id?: number;
    idOrder?: number;
    supplier?: { idSupplier: number; name?: string };
    supplierId?: number; // Used for some DTO mappings
    orderLines: SupplyOrderLine[];
    orderDate: string;
    status: 'EN_ATTENTE' | 'EN_COURS' | 'RECUE';
    orderNumber?: string;
    totalAmount?: number;
}
