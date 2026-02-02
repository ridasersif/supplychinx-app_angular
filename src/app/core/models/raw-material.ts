import { Supplier } from './supplier';

export interface RawMaterial {
    id?: number;
    idMaterial?: number;
    name: string;
    description?: string;
    stock: number;
    stockMin: number;
    unit: string;
    suppliers?: Supplier[];
    supplierIds?: number[];
}
