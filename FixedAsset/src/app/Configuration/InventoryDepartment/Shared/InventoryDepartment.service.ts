import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryDepartmentModel } from './InventoryDepartment.model';
import { AppSharedUrlComponent } from '../../../Shared/appSharedUrl.Component';

@Injectable()
export class InventoryDepartmentService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }
    getInventoryDepartment():Observable<InventoryDepartmentModel>{
        return this.http.get<InventoryDepartmentModel>(this.baseUrl + "/api/Admin/getInventoryDepartment");
    }
    addInventoryDepartment(group:InventoryDepartmentModel):Observable<InventoryDepartmentModel>{
        return this.http.post<InventoryDepartmentModel>(this.baseUrl  + "/api/Admin/addInventoryDepartment",group,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
    updateInventoryDepartment(group:InventoryDepartmentModel):Observable<InventoryDepartmentModel>{
        return this.http.post<InventoryDepartmentModel>(this.baseUrl  + "/api/Admin/updateInventoryDepartment",group,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
    deleteInventoryDepartment(InventoryDepartmentId:number):Observable<InventoryDepartmentModel>{
        debugger;
        return this.http.post<InventoryDepartmentModel>(this.baseUrl  + "/api/Admin/deleteInventoryDepartment?invDeptId="+InventoryDepartmentId,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
}