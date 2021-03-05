import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatutoryMasterModel } from './statutoryMaster.model';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
@Injectable()
export class StatutoryMasterService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }
    getStatutory():Observable<StatutoryMasterModel>{
        return this.http.get<StatutoryMasterModel>(this.baseUrl + "/api/Admin/getStatutory");
    }

    getVendorTypeList():Observable<StatutoryMasterModel>{
        return this.http.get<StatutoryMasterModel>(this.baseUrl + "/api/Admin/getVendorTypeList");
    }

    addStatutory(cmp:StatutoryMasterModel):Observable<StatutoryMasterModel>{
        return this.http.post<StatutoryMasterModel>(this.baseUrl + "/api/Admin/addStatutory",cmp,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
    
    updateStatutory(cmp:StatutoryMasterModel):Observable<StatutoryMasterModel>{
        return this.http.post<StatutoryMasterModel>(this.baseUrl + "/api/Admin/updateStatutory",cmp,{
        headers:new HttpHeaders({ 
            'content-type': 'application/json'
            })
        });        
    }

    getVendorTypeIdbyStatutoryId(StatutoryId:number):Observable<StatutoryMasterModel>{
        return this.http.post<StatutoryMasterModel>(this.baseUrl + "/api/Admin/getVendorTypeIdbyStatutoryId?StatutoryId="+StatutoryId,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
}