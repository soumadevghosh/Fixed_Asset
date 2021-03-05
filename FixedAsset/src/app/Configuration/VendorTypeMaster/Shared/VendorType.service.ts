import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VendorTypeMasterModel } from './VendorType.model';
import { AppSharedUrlComponent } from '../../../Shared/appSharedUrl.Component';

@Injectable()
export class VendorTypeService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }
    getVendorType():Observable<VendorTypeMasterModel>{
        return this.http.get<VendorTypeMasterModel>(this.baseUrl + "/api/Admin/getVendorType");
    }
    
    addVendorType(group:VendorTypeMasterModel):Observable<VendorTypeMasterModel>{
        return this.http.post<VendorTypeMasterModel>(this.baseUrl  + "/api/Admin/addVendorType",group,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
    updateVendorType(group:VendorTypeMasterModel):Observable<VendorTypeMasterModel>{
        return this.http.post<VendorTypeMasterModel>(this.baseUrl  + "/api/Admin/updateVendorType",group,{
            headers:new HttpHeaders({
                'content-type': 'application/json' 
            })
        });
    }
    deleteVendorType(vendorTypeId:number):Observable<VendorTypeMasterModel>{
        debugger;
        return this.http.post<VendorTypeMasterModel>(this.baseUrl  + "/api/Admin/deleteVendorType?vendorTypeId="+vendorTypeId,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
}