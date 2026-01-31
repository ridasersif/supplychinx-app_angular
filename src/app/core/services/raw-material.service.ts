import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RawMaterial } from '../models/raw-material';
import { SuccessResponse } from '../models/success-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RawMaterialService {
  private readonly API_URL = `${environment.apiBaseUrl}/raw-materials`;

  constructor(private http: HttpClient) { }

  getAllRawMaterials(page: number = 0, size: number = 10, search?: string): Observable<SuccessResponse<any>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<SuccessResponse<any>>(this.API_URL, { params });
  }

  getRawMaterialById(id: number): Observable<SuccessResponse<RawMaterial>> {
    return this.http.get<SuccessResponse<RawMaterial>>(`${this.API_URL}/${id}`);
  }

  createRawMaterial(rawMaterial: RawMaterial): Observable<SuccessResponse<RawMaterial>> {
    return this.http.post<SuccessResponse<RawMaterial>>(this.API_URL, rawMaterial);
  }

  updateRawMaterial(id: number, rawMaterial: RawMaterial): Observable<SuccessResponse<RawMaterial>> {
    return this.http.put<SuccessResponse<RawMaterial>>(`${this.API_URL}/${id}`, rawMaterial);
  }

  deleteRawMaterial(id: number): Observable<SuccessResponse<void>> {
    return this.http.delete<SuccessResponse<void>>(`${this.API_URL}/${id}`);
  }
}
