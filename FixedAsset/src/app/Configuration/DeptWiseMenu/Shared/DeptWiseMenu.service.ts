import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeptWiseMenuModel } from './DeptWiseMenu.model';
import { AppSharedUrlComponent } from '../../../Shared/appSharedUrl.Component';

import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
// import {Component, Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';


@Injectable()
export class DeptWiseMenuService extends AppSharedUrlComponent {
    
    constructor(private http:HttpClient) { 
        super();
    }  

    getDept():Observable<DeptWiseMenuModel>{
        return this.http.get<DeptWiseMenuModel>(this.baseUrl + "/api/Admin/getDept");
    }

    getMenu():Observable<DeptWiseMenuModel>{
      return this.http.get<DeptWiseMenuModel>(this.baseUrl +"/api/Admin/getMenu");
    }

    addDeptWiseMenu(service:DeptWiseMenuModel):Observable<DeptWiseMenuModel>{
        return this.http.post<DeptWiseMenuModel>(this.baseUrl  + "/api/Admin/addDeptWiseMenu",service,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }

    getMenuOfDept(DeptId:number):Observable<any[]>{
        return this.http.post<any[]>(this.baseUrl  + "/api/Admin/getMenuOfDept?DeptId="+DeptId,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }

}
