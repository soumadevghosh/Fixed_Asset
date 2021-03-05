import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnitModel } from './unit.model';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
@Injectable()
export class UnitService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }
    getUnit():Observable<UnitModel>{
        return this.http.get<UnitModel>(this.baseUrl + "/api/Admin/getUnit");
    }
    getUnitHead():Observable<UnitModel>{
        return this.http.get<UnitModel>(this.baseUrl + "/api/Admin/getUnitHead");
    }
    addUnit(unitMaster:UnitModel):Observable<UnitModel>{
        return this.http.post<UnitModel>(this.baseUrl + "/api/Admin/addUnit",unitMaster,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
    deleteUnitById(unitMaster:number):Observable<UnitModel>{
        return this.http.post<UnitModel>(this.baseUrl + "/api/Admin/deleteUnit?unitId="+unitMaster,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
    updateUnit(unitMaster:UnitModel):Observable<UnitModel>{
        return this.http.post<UnitModel>(this.baseUrl + "/api/Admin/updateUnit",unitMaster,{
        headers:new HttpHeaders({
            'content-type': 'application/json'
            })
        });        
    }
}