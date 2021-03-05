import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSharedUrlComponent } from 'src/app/Shared/appSharedUrl.Component';
import { Observable } from 'rxjs';
import { RequisitionToHQInventoryModel } from './requisition-to-hqinventory-model';

@Injectable({
  providedIn: 'root'
})
export class RequisitionToHQInventoryService extends AppSharedUrlComponent {

  constructor(private http: HttpClient) { super(); }
  headers = new HttpHeaders({
    'content-type': 'application/json'
  });
  getRequisitionsToHQInventoryDept(): Observable<RequisitionToHQInventoryModel> {
    return this.http.get<RequisitionToHQInventoryModel>(`${this.baseUrl}/api/Requisition/getRequisitionsToHQInventoryDept`);
  }
  getRequisitionsToHQInventoryDeptDetails(model: RequisitionToHQInventoryModel): Observable<RequisitionToHQInventoryModel> {
    return this.http.post<RequisitionToHQInventoryModel>(`${this.baseUrl}/api/Requisition/getRequisitionsToHQInventoryDeptDetails`, model,
     { headers: this.headers });
  }
  addTocart(model: RequisitionToHQInventoryModel): Observable<RequisitionToHQInventoryModel>{
    return this.http.post<RequisitionToHQInventoryModel>(`${this.baseUrl}/api/Requisition/addToCart`, model, { headers: this.headers });
  }
  getRequisitionFromCart(): Observable<RequisitionToHQInventoryModel> {
    return this.http.get<RequisitionToHQInventoryModel>(`${this.baseUrl}/api/Requisition/getHQInventoryCartItems`);
  }

  getManualRequisition(): Observable<RequisitionToHQInventoryModel>{
    return this.http.get<RequisitionToHQInventoryModel>(this.baseUrl + "/api/Requisition/getManualRequisition")
  }
  getItemCategoryByInventoryDeptId(inventoryDeptId: number): Observable<RequisitionToHQInventoryModel> {
    return this.http.post<RequisitionToHQInventoryModel>(this.baseUrl + "/api/Admin/getItemCategoryByInventoryDeptId?inventoryDeptId=" + inventoryDeptId, {
      headers: this.headers
    });
  }
  addManualRequisition(model:RequisitionToHQInventoryModel): Observable<RequisitionToHQInventoryModel>{
    return this.http.post<RequisitionToHQInventoryModel>(this.baseUrl+"/api/Requisition/addManualRequisition", model, {
      headers:this.headers
    }) ;
  }
} 
