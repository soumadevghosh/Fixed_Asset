import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyMasterModel } from './companyMaster.model';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
@Injectable()
export class CompanyMasterService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }
    getCompany():Observable<CompanyMasterModel>{
        return this.http.get<CompanyMasterModel>(this.baseUrl + "/api/Admin/getCompany");
    }

    getInventoryDeptList():Observable<CompanyMasterModel>{
        return this.http.get<CompanyMasterModel>(this.baseUrl + "/api/Admin/getInventoryDeptList");
    }

    addCompany(cmp:CompanyMasterModel):Observable<CompanyMasterModel>{
        return this.http.post<CompanyMasterModel>(this.baseUrl + "/api/Admin/addCompany",cmp,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
    
    updateCompany(cmp:CompanyMasterModel):Observable<CompanyMasterModel>{
        return this.http.post<CompanyMasterModel>(this.baseUrl + "/api/Admin/updateCompany",cmp,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }

    getInventoryIdbyCompanyId(CompanyId:number):Observable<CompanyMasterModel>{
        return this.http.post<CompanyMasterModel>(this.baseUrl + "/api/Admin/getInventoryIdbyCompanyId?CompanyId="+CompanyId,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
}