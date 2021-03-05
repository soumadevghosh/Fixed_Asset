import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeCategoryModel } from './employee.category.model';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
@Injectable()
export class EmployeeCategoryService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }
    getEmployeeCategory():Observable<EmployeeCategoryModel>{
        return this.http.get<EmployeeCategoryModel>(this.baseUrl + "/api/Admin/getEmployeeCategory");
    }
    addEmployeeCategory(empCat:EmployeeCategoryModel):Observable<EmployeeCategoryModel>{
        return this.http.post<EmployeeCategoryModel>(this.baseUrl + "/api/Admin/addEmployeeCategory",empCat,{
        headers:new HttpHeaders({
            'content-type': 'application/json' 
            })
        });        
    }
    deleteEmployeeCategoryById(empCat:number):Observable<EmployeeCategoryModel>{
        return this.http.post<EmployeeCategoryModel>(this.baseUrl + "/api/Admin/deleteEmployeeCategory?employeeCategoryId="+empCat,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
    updateEmployeeCategory(empCat:EmployeeCategoryModel):Observable<EmployeeCategoryModel>{
        return this.http.post<EmployeeCategoryModel>(this.baseUrl + "/api/Admin/updateEmployeeCategory",empCat,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
}