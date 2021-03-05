import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserWiseMenuModel } from './UserWiseMenu.model';
import { AppSharedUrlComponent } from '../../../Shared/appSharedUrl.Component';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class UserWiseMenuService extends AppSharedUrlComponent{
    constructor(private http:HttpClient) { 
        super();
    }  

    getDept():Observable<UserWiseMenuModel>{
        return this.http.get<UserWiseMenuModel>(this.baseUrl + "/api/Admin/getDept");
    }

    getuserForMenu():Observable<UserWiseMenuModel>{
        return this.http.get<UserWiseMenuModel>(this.baseUrl + "/api/Admin/getuserForMenu").pipe(
            tap(data=>console.log('All Data Retrive -'+ JSON.stringify(data))),
            
        );

        // return this.http.get<ServiceMasterModel>(this.baseUrl + "/api/Admin/getItemGroup")
        // .pipe(
        //     tap(data=>console.log('All Data Retrive -'+ JSON.stringify(data))),
            
        // );

    }

    getMenu():Observable<UserWiseMenuModel>{
      return this.http.get<UserWiseMenuModel>(this.baseUrl +"/api/Admin/getMenu");
    }

    addUserWiseMenu(service:UserWiseMenuModel):Observable<UserWiseMenuModel>{
        return this.http.post<UserWiseMenuModel>(this.baseUrl  + "/api/Admin/addUserWiseMenu",service,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }

    getMenuOfDeptandBindTree(DeptId:number):Observable<any[]>{
        return this.http.post<any[]>(this.baseUrl  + "/api/Admin/getMenuOfDeptandBindTree?DeptId="+DeptId,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }

    getMenuOfUser(UserId:number):Observable<any[]>{
        return this.http.post<any[]>(this.baseUrl  + "/api/Admin/getMenuOfUser?UserId="+UserId,{
            headers:new HttpHeaders({
                'content-type': 'application/json'
            })
        });
    }
}



