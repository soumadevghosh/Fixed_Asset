import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSharedUrlComponent } from 'src/app/Shared/appSharedUrl.Component';
import { VendorItemMappingModel } from './vendor-item-mapping-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorItemMappingService extends AppSharedUrlComponent {

  constructor(private http: HttpClient) { super(); }
  headers = new HttpHeaders({
    'content-type': 'application/json'
  });
  getVendorItemMapping(): Observable<VendorItemMappingModel> {
    return this.http.get<VendorItemMappingModel>(`${this.baseUrl}/api/Admin/getVendorItemMapping`);
  }
  getVendorItemMappingById(vendorId:number): Observable<VendorItemMappingModel>{
    return this.http.post<VendorItemMappingModel>(this.baseUrl + "/api/Admin/getVendorItemMappingById?vendorId=" + vendorId, {
      headers: this.headers
    });
  }
  addVendorItemMapping(model: VendorItemMappingModel): Observable<VendorItemMappingModel> {
    return this.http.post<VendorItemMappingModel>(`${this.baseUrl}/api/Admin/addVendorItemMapping`, model, { headers: this.headers });
  }
  getItemCategoryByInventoryDeptId(inventoryDeptId: number): Observable<any[]> {
    return this.http.post<any[]>(this.baseUrl + "/api/Admin/getItemCategoryByInventoryDeptId?inventoryDeptId=" + inventoryDeptId, {
      headers: this.headers
    });
  }
  getItemGroup(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/Admin/getItemGroup`);
  }
  getItem(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/Admin/getItems`);
  }
}
