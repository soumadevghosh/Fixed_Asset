import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeDepartmentModel } from './department.model';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
@Injectable()
export class EmployeeDepartmentService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }
    getDepartment():Observable<EmployeeDepartmentModel>{
        return this.http.get<EmployeeDepartmentModel>(this.baseUrl + "/api/Admin/getDepartment");
    }
    addDepartment(department:EmployeeDepartmentModel):Observable<EmployeeDepartmentModel>{
        return this.http.post<EmployeeDepartmentModel>(this.baseUrl + "/api/Admin/addDepartment",department,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
    deleteDepartment(departmentId:number):Observable<EmployeeDepartmentModel>{
        return this.http.post<EmployeeDepartmentModel>(this.baseUrl + "/api/Admin/deleteDepartment?departmentId="+departmentId,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
    updateDepartment(department:EmployeeDepartmentModel):Observable<EmployeeDepartmentModel>{
        return this.http.post<EmployeeDepartmentModel>(this.baseUrl + "/api/Admin/updateDepartment",department,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
}