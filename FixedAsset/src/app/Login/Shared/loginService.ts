import {HttpClient,HttpHeaders} from '@angular/common/http';
import {AppSharedUrlComponent} from '../../Shared/appSharedUrl.Component';
import { Injectable } from '@angular/core';
import { mLogin } from './loginModel';
import {Observable} from 'rxjs';
import{UserWiseMenuModel} from'../../Configuration/UserWiseMenu/Shared/UserWiseMenu.model';

@Injectable()
export class LoginService extends AppSharedUrlComponent{
    constructor(private http:HttpClient){
        super();
    }
    
    userAuthentication(userName, password) {
        var data = "username=" + userName + "&password=" + password + "&grant_type=password";
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded','No-Auth':'True' });
        return this.http.post(this.baseUrl + '/assetUserToken', data, { headers: reqHeader });
    }

    getAll() {
         
        return this.http.get(this.baseUrl + "/api/Login/getLoggedInUser",{headers : new HttpHeaders({"Authorization":"Bearer"+ localStorage.getItem("userToken")})});
    
    }

    
    // getUserMenu(){

    // }
    getUserMenuHeader():Observable<UserWiseMenuModel>{
        return this.http.get<UserWiseMenuModel>(this.baseUrl +"/api/Admin/getUserMenuHeader");
      }
}