import { AppSharedUrlComponent } from 'src/app/Shared/appSharedUrl.Component';
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ItemModel} from './item.model';

@Injectable()
export class ItemService extends AppSharedUrlComponent
{
    constructor(private http:HttpClient){
        super();
    }
    headers=new HttpHeaders({
        'content-type':'application/json'
    });
    getItem():Observable<ItemModel>{
        return this.http.get<ItemModel>(`${this.baseUrl}/api/Admin/getItems`);
    }
    getItemCategoryByInventoryDeptId(inventoryDeptId:number):Observable<any[]>{
        return this.http.post<any[]>(this.baseUrl  + "/api/Admin/getItemCategoryByInventoryDeptId?inventoryDeptId="+inventoryDeptId,{
            headers:this.headers
        });
    }
    getItemGroup():Observable<any[]>{
        return this.http.get<any[]>(`${this.baseUrl}/api/Admin/getItemGroup`);
    }
    getItemGroupDetail(itemGroupId:number):Observable<any>{
        return this.http.post<any>(this.baseUrl  + "/api/Admin/getItemGroupDetail?itemGroupId="+itemGroupId,{
            headers:this.headers
        });
    }
    addItem(model:ItemModel):Observable<ItemModel>{
        return this.http.post<ItemModel>(`${this.baseUrl}/api/Admin/addItem`,model,{
            headers:this.headers
        });
    }
    updateItem(model:ItemModel):Observable<ItemModel>{
        return this.http.post<ItemModel>(`${this.baseUrl}/api/Admin/updateItem`,model,{
            headers:this.headers
        });
    }
    deleteItem(itemId:number):Observable<ItemModel>{
        return this.http.post<ItemModel>(this.baseUrl  + "/api/Admin/deleteItem?itemId="+itemId,{
            headers:this.headers
        });
    }
}