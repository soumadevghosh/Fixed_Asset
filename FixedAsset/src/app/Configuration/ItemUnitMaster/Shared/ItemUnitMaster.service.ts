import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemUnitMasterModel } from './ItemUnitMaster.model';
import { AppSharedUrlComponent } from '../../../Shared/appSharedUrl.Component';
@Injectable()
export class ItemUnitMasterService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }
    getItemUnitMaster():Observable<ItemUnitMasterModel>{
        return this.http.get<ItemUnitMasterModel>(this.baseUrl + "/api/Admin/getItemUnitMaster");
    }
    deleteItemUnitMaster(ItemUnitId:number):Observable<ItemUnitMasterModel>{
        return this.http.post<ItemUnitMasterModel>(this.baseUrl  + "/api/Admin/deleteItemUnitMaster?ItemUnitId="+ItemUnitId,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
    addItemUnitMaster(service:ItemUnitMasterModel):Observable<ItemUnitMasterModel>{
        return this.http.post<ItemUnitMasterModel>(this.baseUrl  + "/api/Admin/addItemUnitMaster",service,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
    updateItemUnitMaster(service:ItemUnitMasterModel):Observable<ItemUnitMasterModel>{
        return this.http.post<ItemUnitMasterModel>(this.baseUrl  + "/api/Admin/updateItemUnitMaster",service,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
}