import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { DepartmentalRequisitionsModel } from './departmental-requisitions.model';
import { AppSharedUrlComponent } from 'src/app/Shared/appSharedUrl.Component';
import { EmployeeDepartmentModel } from 'src/app/Configuration/Department/department.model';
import { RequisitionModel } from 'src/app/Activites/Requisition/Shared/Requisition.model';
//import { RequisitionService } from './../Requisition/Shared/Requisition.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentalRequisitionsService extends AppSharedUrlComponent {

  constructor(private http: HttpClient) { super(); }
  headers = new HttpHeaders({
    'content-type': 'application/json'
  });
  getRequisitionByDept(): Observable<DepartmentalRequisitionsModel> {
    return this.http.get<DepartmentalRequisitionsModel>(`${this.baseUrl}/api/Requisition/getRequisitionsByDept`);
  }
  addTocart(model: DepartmentalRequisitionsModel): Observable<DepartmentalRequisitionsModel>{
    return this.http.post<DepartmentalRequisitionsModel>(`${this.baseUrl}/api/Requisition/addToCart`, model, { headers: this.headers });
  }
  getRequisitionFromCart(): Observable<DepartmentalRequisitionsModel> {
    return this.http.get<DepartmentalRequisitionsModel>(`${this.baseUrl}/api/Requisition/getCartItems`);
  }
  transferRequisitions(model: DepartmentalRequisitionsModel): Observable<DepartmentalRequisitionsModel>{
    return this.http.post<DepartmentalRequisitionsModel>(`${this.baseUrl}/api/Requisition/addInventoryDepartmentRequisitions`, model, { headers: this.headers });
  }
  getHQInventoryCartItems(): Observable<DepartmentalRequisitionsModel> {
    return this.http.get<DepartmentalRequisitionsModel>(`${this.baseUrl}/api/Requisition/getHQInventoryCartItems`);
  }
  transferRequisitionsToHQProcurementDept(model: DepartmentalRequisitionsModel): Observable<DepartmentalRequisitionsModel>{
    return this.http.post<DepartmentalRequisitionsModel>(`${this.baseUrl}/api/Requisition/addHQProcurementDepartmentRequisitions`, model, { headers: this.headers });
  }
  getManualRequisition(): Observable<DepartmentalRequisitionsModel>{
    return this.http.get<DepartmentalRequisitionsModel>(this.baseUrl + "/api/Requisition/getManualRequisition")
  }
  getItemCategoryByInventoryDeptId(inventoryDeptId: number): Observable<DepartmentalRequisitionsModel> {
    return this.http.post<DepartmentalRequisitionsModel>(this.baseUrl + "/api/Admin/getItemCategoryByInventoryDeptId?inventoryDeptId=" + inventoryDeptId, {
      headers: this.headers
    });
  }
  addManualRequisition(model:DepartmentalRequisitionsModel): Observable<DepartmentalRequisitionsModel>{
    return this.http.post<DepartmentalRequisitionsModel>(this.baseUrl+"/api/Requisition/addManualRequisition", model, {
      headers:this.headers
    }) ;
  }
  getManualRequisitionFromCart(): Observable<DepartmentalRequisitionsModel> {
    return this.http.get<DepartmentalRequisitionsModel>(`${this.baseUrl}/api/Requisition/getManualRequisitionsFromCart`);
  }
  
  transferManualRequisitions(model: DepartmentalRequisitionsModel): Observable<DepartmentalRequisitionsModel>{
    return this.http.post<DepartmentalRequisitionsModel>(`${this.baseUrl}/api/Requisition/addInventoryDepartmentManualRequisitions`, model, { headers: this.headers });
  }
  getHQManualRequisitionFromCart(): Observable<DepartmentalRequisitionsModel> {
    return this.http.get<DepartmentalRequisitionsModel>(`${this.baseUrl}/api/Requisition/getHQManualRequisitionsFromCart`);
  }

  transferManualRequisitionsToHQProcurementDept(model: DepartmentalRequisitionsModel): Observable<DepartmentalRequisitionsModel>{
    return this.http.post<DepartmentalRequisitionsModel>(`${this.baseUrl}/api/Requisition/addHQProcurementDepartmentMannualRequisitions`, model, { headers: this.headers });
  }
  getProcurementCartItems(): Observable<DepartmentalRequisitionsModel> {
    return this.http.get<DepartmentalRequisitionsModel>(`${this.baseUrl}/api/Requisition/getProcurementCartItems`);
  }
  addVendorOrder(model: DepartmentalRequisitionsModel): Observable<DepartmentalRequisitionsModel>{
    return this.http.post<DepartmentalRequisitionsModel>(`${this.baseUrl}/api/Requisition/addVendorOrder`, model, { headers: this.headers });
  }
}
