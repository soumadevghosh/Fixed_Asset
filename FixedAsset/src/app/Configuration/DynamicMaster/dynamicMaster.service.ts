import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DynamicMasterModel } from './dynamicMaster.model';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
@Injectable()
export class DynamicMasterService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }
    getdynmicMasterList():Observable<DynamicMasterModel>{
        return this.http.get<DynamicMasterModel>(this.baseUrl + "/api/Admin/getDynamicMasterList");
    }

    getTableEntityList():Observable<DynamicMasterModel>{
        return this.http.get<DynamicMasterModel>(this.baseUrl + "/api/Admin/getTableEntityList");
    }

    searchDynamicMasterData(dyn:string):Observable<DynamicMasterModel>{
        debugger;
        return this.http.post<DynamicMasterModel>(this.baseUrl + "/api/Admin/getDynamicMaster?tableName="+dyn,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }

    addDyamicMasterData(dyn:DynamicMasterModel):Observable<DynamicMasterModel>{
        return this.http.post<DynamicMasterModel>(this.baseUrl + "/api/Admin/addDynamicMasterdetails",dyn,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
    deleteDynamicMasterData(dyn:number):Observable<DynamicMasterModel>{
        return this.http.post<DynamicMasterModel>(this.baseUrl + "/api/Admin/deleteDynamicMasterDetails?tableDetailId="+dyn,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
    updateDynamicMasterData(dyn:DynamicMasterModel):Observable<DynamicMasterModel>{
        return this.http.post<DynamicMasterModel>(this.baseUrl + "/api/Admin/updateDynamicMasterDetails",dyn,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
}