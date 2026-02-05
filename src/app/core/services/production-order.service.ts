import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductionOrder, ProductionOrderStatus } from '../models/production-order';
import { SuccessResponse } from '../models/success-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductionOrderService {
    private readonly API_URL = `${environment.apiBaseUrl}/production-orders`;

    constructor(private http: HttpClient) { }

    getAllProductionOrders(page: number = 0, size: number = 10, sortBy: string = 'idOrder', sortDirection: string = 'desc'): Observable<SuccessResponse<any>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sortBy', sortBy)
            .set('sortDirection', sortDirection);

        return this.http.get<SuccessResponse<any>>(this.API_URL, { params });
    }

    getProductionOrderById(id: number): Observable<SuccessResponse<ProductionOrder>> {
        return this.http.get<SuccessResponse<ProductionOrder>>(`${this.API_URL}/${id}`);
    }

    getProductionOrdersByStatus(status: ProductionOrderStatus, page: number = 0, size: number = 10): Observable<SuccessResponse<any>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<SuccessResponse<any>>(`${this.API_URL}/status/${status}`, { params });
    }

    createProductionOrder(order: ProductionOrder): Observable<SuccessResponse<ProductionOrder>> {
        return this.http.post<SuccessResponse<ProductionOrder>>(this.API_URL, order);
    }

    updateProductionOrder(id: number, order: ProductionOrder): Observable<SuccessResponse<ProductionOrder>> {
        return this.http.put<SuccessResponse<ProductionOrder>>(`${this.API_URL}/${id}`, order);
    }

    cancelProductionOrder(id: number): Observable<SuccessResponse<void>> {
        return this.http.delete<SuccessResponse<void>>(`${this.API_URL}/${id}`);
    }
}
