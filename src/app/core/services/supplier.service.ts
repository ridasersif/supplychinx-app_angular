import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from '../models/supplier';
import { SuccessResponse } from '../models/success-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private readonly API_URL = `${environment.apiBaseUrl}/suppliers`;

  constructor(private http: HttpClient) { }

  getAllSuppliers(page: number = 0, size: number = 10, search?: string): Observable<SuccessResponse<any>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<SuccessResponse<any>>(this.API_URL, { params });
  }

  getSupplierById(id: number): Observable<SuccessResponse<Supplier>> {
    return this.http.get<SuccessResponse<Supplier>>(`${this.API_URL}/${id}`);
  }

  createSupplier(supplier: Supplier): Observable<SuccessResponse<Supplier>> {
    return this.http.post<SuccessResponse<Supplier>>(this.API_URL, supplier);
  }

  updateSupplier(id: number, supplier: Supplier): Observable<SuccessResponse<Supplier>> {
    return this.http.put<SuccessResponse<Supplier>>(`${this.API_URL}/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<SuccessResponse<void>> {
    return this.http.delete<SuccessResponse<void>>(`${this.API_URL}/${id}`);
  }
}
