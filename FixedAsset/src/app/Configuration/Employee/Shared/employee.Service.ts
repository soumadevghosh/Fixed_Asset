import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeModel } from './employee.Model';
import { AppSharedUrlComponent } from '../../../Shared/appSharedUrl.Component';
@Injectable()
export class EmployeeService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }
    getEmployee():Observable<EmployeeModel>{
        return this.http.get<EmployeeModel>(this.baseUrl + "/api/Admin/getEmployee");
    }
    addEmployee(employee:EmployeeModel):Observable<EmployeeModel>{
        return this.http.post<EmployeeModel>(this.baseUrl + "/api/Admin/addEmployee",employee,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
    deleteEmployee(employeeId:string):Observable<EmployeeModel>{
        return this.http.post<EmployeeModel>(this.baseUrl + "/api/Admin/deleteEmployee?employeeId="+employeeId,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
    updateEmployee(employee:EmployeeModel):Observable<EmployeeModel>{
        return this.http.post<EmployeeModel>(this.baseUrl + "/api/Admin/updateEmployee",employee,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
}