import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemGroupModel } from './ItemGroup.model';
import { AppSharedUrlComponent } from '../../../Shared/appSharedUrl.Component';

@Injectable()
export class ItemGroupService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }
    getItemGroup():Observable<ItemGroupModel>{
        return this.http.get<ItemGroupModel>(this.baseUrl + "/api/Admin/getItemGroup");
    }
    addItemGroup(group:ItemGroupModel):Observable<ItemGroupModel>{
        return this.http.post<ItemGroupModel>(this.baseUrl  + "/api/Admin/addItemGroup",group,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
    updateItemGroup(group:ItemGroupModel):Observable<ItemGroupModel>{
        return this.http.post<ItemGroupModel>(this.baseUrl  + "/api/Admin/updateItemGroup",group,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
    deleteItemGroup(itemGroupId:number):Observable<ItemGroupModel>{
        return this.http.post<ItemGroupModel>(this.baseUrl  + "/api/Admin/deleteItemGroup?itemGroupId="+itemGroupId,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
    getItemCategoryByInventoryDeptId(inventoryDeptId:number):Observable<any[]>{
        return this.http.post<any[]>(this.baseUrl  + "/api/Admin/getItemCategoryByInventoryDeptId?inventoryDeptId="+inventoryDeptId,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
}