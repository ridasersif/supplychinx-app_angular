import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { SuccessResponse } from '../models/success-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly API_URL = `${environment.apiBaseUrl}/products`;

    constructor(private http: HttpClient) { }

    getAllProducts(page: number = 0, size: number = 10, sortBy: string = 'name', sortDirection: string = 'asc'): Observable<SuccessResponse<any>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sortBy', sortBy)
            .set('sortDirection', sortDirection);

        return this.http.get<SuccessResponse<any>>(this.API_URL, { params });
    }

    getProductById(id: number): Observable<SuccessResponse<Product>> {
        return this.http.get<SuccessResponse<Product>>(`${this.API_URL}/${id}`);
    }

    createProduct(product: Product): Observable<SuccessResponse<Product>> {
        return this.http.post<SuccessResponse<Product>>(this.API_URL, product);
    }

    updateProduct(id: number, product: Product): Observable<SuccessResponse<Product>> {
        return this.http.put<SuccessResponse<Product>>(`${this.API_URL}/${id}`, product);
    }

    deleteProduct(id: number): Observable<SuccessResponse<void>> {
        return this.http.delete<SuccessResponse<void>>(`${this.API_URL}/${id}`);
    }
}
