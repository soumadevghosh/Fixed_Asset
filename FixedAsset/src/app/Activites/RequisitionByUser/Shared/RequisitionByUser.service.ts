import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequisitionByUserModel } from './RequisitionByUser.model';
import { AppSharedUrlComponent } from '../../../Shared/appSharedUrl.Component';
import { tap, catchError } from 'rxjs/operators';
import { data } from 'jquery';

@Injectable()
export class RequisitionByUserService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }


    getRequisitionByUser():Observable<RequisitionByUserModel>{
        return this.http.get<RequisitionByUserModel>(this.baseUrl + "/api/Requisition/getRequisitionByUser");
    }
    // getItemCategoryByInventoryDeptId(inventoryDeptId:number):Observable<any[]>{
    //     return this.http.post<any[]>(this.baseUrl  + "/api/Admin/getItemCategoryByInventoryDeptId?inventoryDeptId="+inventoryDeptId,{
    //         headers:new HttpHeaders({
    //             'content-type': 'application/json'
    //         })
    //     });
    // }
    // getItemGroup():Observable<RequisitionModel>{
    //     return this.http.get<RequisitionModel>(this.baseUrl + "/api/Admin/getItemGroup")
    //     .pipe(
    //         tap(data=>console.log('All Data Retrive -'+ JSON.stringify(data))),
            
    //     );
    // }
    // getItems():Observable<any[]>{
    //     return this.http.get<any[]>(`${this.baseUrl}/api/Admin/getItems`)
    //     .pipe(
    //         tap(data=>console.log('all data retrive-'+JSON.stringify(data))),
    //     );
    // }

    // deleteRequisition(RequisitionId:number):Observable<RequisitionModel>{
    //     return this.http.post<RequisitionModel>(this.baseUrl  + "/api/Requisition/deleteRequisition?RequisitionId="+RequisitionId,{
    //         headers:new HttpHeaders({
    //             'content-type': 'application/json'
    //         })
    //     });
    // }

    // addRequisition(service:RequisitionModel):Observable<RequisitionModel>{
    //     return this.http.post<RequisitionModel>(this.baseUrl  + "/api/Requisition/addRequisition",service,{
    //         headers:new HttpHeaders({
    //             'content-type': 'application/json'
    //         })
    //     });
    // }

    // updateRequisition(service:RequisitionModel):Observable<RequisitionModel>{
    //     return this.http.post<RequisitionModel>(this.baseUrl  + "/api/Requisition/updateRequisition",service,{
    //         headers:new HttpHeaders({
    //             'content-type': 'application/json'
    //         })
    //     });
    // }

}