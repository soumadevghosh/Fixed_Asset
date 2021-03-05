import {Component} from '@angular/core';
import{Router} from '@angular/router';
import { LoginService } from '../Login/Shared/loginService'
import { HttpErrorResponse } from '@angular/common/http';
import { AppSharedUrlComponent } from '../Shared/appSharedUrl.Component';

@Component({
    templateUrl:'./userDashboard.html',
    providers:[LoginService]
})
export class UserDashBoard extends AppSharedUrlComponent{
    showLoadingIndicator=true;
    constructor(private router:Router,private service:LoginService){
        super();
    }
}