import { Injectable } from '@angular/core';
import { AppSharedUrlComponent } from 'src/app/Shared/appSharedUrl.Component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequisitionsToProcurementModel } from './requisitions-to-procurement-model';

@Injectable({
  providedIn: 'root'
})
export class RequisitionsToProcurementService extends AppSharedUrlComponent{

  constructor(private http: HttpClient) { super(); }
  headers = new HttpHeaders({
    'content-type': 'application/json'
  });
  getRequisitionsToProcurementDept(): Observable<RequisitionsToProcurementModel> {
    return this.http.get<RequisitionsToProcurementModel>(`${this.baseUrl}/api/Requisition/getRequisitionsToProcurementDept`);
  }
  getRequisitionsToProcurementDeptDetails(reqId: number): Observable<RequisitionsToProcurementModel> {
    return this.http.post<RequisitionsToProcurementModel>(this.baseUrl+"/api/Requisition/getRequisitionsToProcurementDeptDetails?reqId=" + reqId,
     { headers: this.headers });
  }
  getItemWiseVendorDetail(itemId: number): Observable<RequisitionsToProcurementModel>{
    return this.http.post<RequisitionsToProcurementModel>(this.baseUrl+"/api/Requisition/getItemWiseVendorDetail?itemId=" + itemId,
     { headers: this.headers });
  }
  addTocart(model: RequisitionsToProcurementModel): Observable<RequisitionsToProcurementModel>{
    return this.http.post<RequisitionsToProcurementModel>(`${this.baseUrl}/api/Requisition/addToCart`, model, { headers: this.headers });
  }
  getProcurementCartItems(): Observable<RequisitionsToProcurementModel> {
    return this.http.get<RequisitionsToProcurementModel>(`${this.baseUrl}/api/Requisition/getProcurementCartItems`);
  }
}
