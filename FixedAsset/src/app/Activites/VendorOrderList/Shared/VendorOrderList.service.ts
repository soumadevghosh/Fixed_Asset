import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VendorOrderListModel } from './VendorOrdrList.model';
import { AppSharedUrlComponent } from '../../../Shared/appSharedUrl.Component';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class VendorOrderListService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }

    getVendorOrderList():Observable<VendorOrderListModel>{
        return this.http.get<VendorOrderListModel>(this.baseUrl + "/api/VendorOrderList/getVendorOrderList");
    }

    getItemDetailsByVendorOrderId(VendorOrderId:number):Observable<any[]>{
        return this.http.post<any[]>(this.baseUrl  + "/api/VendorOrderList/getItemDetailsByVendorOrderId?VendorOrderId="+VendorOrderId,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }



    // addServiceMaster(service:ServiceMasterModel):Observable<ServiceMasterModel>{
    //     return this.http.post<ServiceMasterModel>(this.baseUrl  + "/api/Admin/addServiceMaster",service,{
    //         headers:new HttpHeaders({
    //             'content-type': 'application/json'
    //         })
    //     });
    // }
    // updateServiceMaster(service:ServiceMasterModel):Observable<ServiceMasterModel>{
    //     return this.http.post<ServiceMasterModel>(this.baseUrl  + "/api/Admin/updateServiceMaster",service,{
    //         headers:new HttpHeaders({
    //             'content-type': 'application/json'
    //         })
    //     });
    // }
    // deleteServiceMaster(serviceMasterId:number):Observable<ServiceMasterModel>{
    //     return this.http.post<ServiceMasterModel>(this.baseUrl  + "/api/Admin/deleteServiceMaster?ServiceId="+serviceMasterId,{
    //         headers:new HttpHeaders({
    //             'content-type': 'application/json'
    //         })
    //     });
    // }

    // getItemCategoryByInventoryDeptId(inventoryDeptId:number):Observable<any[]>{
    //     return this.http.post<any[]>(this.baseUrl  + "/api/Admin/getItemCategoryByInventoryDeptId?inventoryDeptId="+inventoryDeptId,{
    //         headers:new HttpHeaders({
    //             'content-type': 'application/json'
    //         })
    //     });
    // }

    // getItemGroupByItemCatagoryId(itemCatagoryId:number):Observable<any[]>{
    //     return this.http.post<any[]>(this.baseUrl  + "/api/Admin/getItemGroupByItemCatagoryId?itemCatagoryId="+itemCatagoryId,{
    //         headers:new HttpHeaders({
    //             'content-type': 'application/json'
    //         })
    //     });
    // }

    // getItemGroup():Observable<ServiceMasterModel>{
    //     return this.http.get<ServiceMasterModel>(this.baseUrl + "/api/Admin/getItemGroup");
    // }

    // getItemGroup():Observable<ServiceMasterModel>{
    //     return this.http.get<ServiceMasterModel>(this.baseUrl + "/api/Admin/getItemGroup")
    //     .pipe(
    //         tap(data=>console.log('All Data Retrive -'+ JSON.stringify(data))),
            
    //     );
    // }

    // getDropDownText(id, object){
    //     const selObj = _.filter(object, function (o) {
    //         return (_.includes(id,o.id));
    //     });
    //     return selObj;
    //   }

}