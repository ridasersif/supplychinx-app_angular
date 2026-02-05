export type ProductionOrderStatus = 'EN_ATTENTE' | 'EN_PRODUCTION' | 'TERMINE' | 'BLOQUE' | 'ANNULE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface ProductionOrder {
    idOrder?: number;
    orderNumber?: string;
    productId: number;
    productName?: string;
    quantity: number;
    status?: ProductionOrderStatus;
    priority?: Priority;
    startDate?: string;
    endDate?: string;
}
