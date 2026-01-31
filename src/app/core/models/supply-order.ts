import { Supplier } from './supplier';
import { RawMaterial } from './raw-material';

export interface SupplyOrder {
    id?: string | number;
    supplier: Supplier;
    materials: RawMaterial[];
    orderDate: string; // ISO date string
    status: 'EN_ATTENTE' | 'EN_COURS' | 'RECUE';
}
