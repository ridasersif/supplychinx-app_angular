export interface Supplier {
    id?: number;
    idSupplier?: number;
    name: string;
    contact: string;
    email: string;
    phone: string;
    rating: number;
    leadTime: number;
    materialIds?: number[];
}
