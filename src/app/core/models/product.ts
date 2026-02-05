export interface BillOfMaterial {
    idBOM?: number;
    materialId: number;
    materialName?: string;
    materialUnit?: string;
    quantity: number;
}

export interface Product {
    idProduct?: number;
    name: string;
    description?: string;
    productionTime: number;
    cost: number;
    stock?: number;
    minimumStock?: number;
    unit: string;
    billOfMaterials: BillOfMaterial[];
}
