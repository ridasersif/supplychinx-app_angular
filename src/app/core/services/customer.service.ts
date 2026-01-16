import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../../customers/models/customer.model';
import { SuccessResponse } from '../models/success-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private readonly API_URL = `${environment.apiBaseUrl}/customers`;

    constructor(private http: HttpClient) { }

    getAllCustomers(page: number = 0, size: number = 10, filter?: string): Observable<SuccessResponse<any>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (filter) {
            params = params.set('filter', filter);
        }

        return this.http.get<SuccessResponse<any>>(this.API_URL, { params });
    }

    getCustomerById(id: number): Observable<SuccessResponse<Customer>> {
        return this.http.get<SuccessResponse<Customer>>(`${this.API_URL}/${id}`);
    }

    createCustomer(customer: Customer): Observable<SuccessResponse<Customer>> {
        return this.http.post<SuccessResponse<Customer>>(this.API_URL, customer);
    }

    updateCustomer(id: number, customer: Customer): Observable<SuccessResponse<Customer>> {
        return this.http.put<SuccessResponse<Customer>>(`${this.API_URL}/${id}`, customer);
    }

    deleteCustomer(id: number): Observable<SuccessResponse<void>> {
        return this.http.delete<SuccessResponse<void>>(`${this.API_URL}/${id}`);
    }
}
