import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupplyOrder } from '../models/supply-order';
import { SuccessResponse } from '../models/success-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplyOrderService {
  private readonly API_URL = `${environment.apiBaseUrl}/supplier-orders`;

  constructor(private http: HttpClient) { }

  getAllSupplyOrders(page: number = 0, size: number = 10, status?: string): Observable<SuccessResponse<any>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<SuccessResponse<any>>(this.API_URL, { params });
  }

  getSupplyOrderById(id: string | number): Observable<SuccessResponse<SupplyOrder>> {
    return this.http.get<SuccessResponse<SupplyOrder>>(`${this.API_URL}/${id}`);
  }

  createSupplyOrder(supplyOrder: SupplyOrder): Observable<SuccessResponse<SupplyOrder>> {
    return this.http.post<SuccessResponse<SupplyOrder>>(this.API_URL, supplyOrder);
  }

  updateSupplyOrder(id: string | number, supplyOrder: SupplyOrder): Observable<SuccessResponse<SupplyOrder>> {
    return this.http.put<SuccessResponse<SupplyOrder>>(`${this.API_URL}/${id}`, supplyOrder);
  }

  deleteSupplyOrder(id: string | number): Observable<SuccessResponse<void>> {
    return this.http.delete<SuccessResponse<void>>(`${this.API_URL}/${id}`);
  }
}
