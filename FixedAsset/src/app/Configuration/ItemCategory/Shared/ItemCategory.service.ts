import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemCategoryModel } from './ItemCategory.model';
import { AppSharedUrlComponent } from '../../../Shared/appSharedUrl.Component';

@Injectable()
export class ItemCategoryService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }
    getItemCategory():Observable<ItemCategoryModel>{
        return this.http.get<ItemCategoryModel>(this.baseUrl + "/api/Admin/getItemCategory");
    }
    addItemCategory(Category:ItemCategoryModel):Observable<ItemCategoryModel>{
        return this.http.post<ItemCategoryModel>(this.baseUrl  + "/api/Admin/addItemCategory",Category,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
    updateItemCategory(Category:ItemCategoryModel):Observable<ItemCategoryModel>{
        return this.http.post<ItemCategoryModel>(this.baseUrl  + "/api/Admin/updateItemCategory",Category,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
    deleteItemCategory(ItemCategoryId:number):Observable<ItemCategoryModel>{
        return this.http.post<ItemCategoryModel>(this.baseUrl  + "/api/Admin/deleteItemCategory?itemCategoryId="+ItemCategoryId,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
    // getInventoryDepartmentByCategoryId(ItemCategoryId:number):Observable<ItemCategoryModel>{
    //     debugger
    //     return this.http.post<ItemCategoryModel>(this.baseUrl + "/api/Admin/getInventoryDepartmentByCategoryId?ItemCategoryId="+ItemCategoryId,{
    //     headers:new HttpHeaders({
    //         'content-type': 'application/json'
    //         })
    //     });        
    // }

    getInventoryDepartmentByCategoryId(ItemCategoryId:number):Observable<any[]>{
        return this.http.post<any[]>(this.baseUrl + "/api/Admin/getInventoryDepartmentByCategoryId?ItemCategoryId="+ItemCategoryId,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }

    


}