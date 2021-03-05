import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { LoginService } from '../Login/Shared/loginService';
import {mLogin} from '../Login/Shared/loginModel'
import { HttpErrorResponse } from '@angular/common/http';
import { from } from 'rxjs';
import { data } from 'jquery';
import { UserWiseMenuModel } from '../Configuration/UserWiseMenu/Shared/UserWiseMenu.model';
@Component({
    selector:'app-header',
    templateUrl:'./header.Component.html',
    providers: [mLogin,LoginService,UserWiseMenuModel]
})
export class HeaderComponent implements OnInit{
    menuList = [];
    userDetails: any;
    // ,model:UserWiseMenuModel
    constructor(private router: Router, private service: LoginService, private mode: UserWiseMenuModel, private model: mLogin){
        
    }
    ngOnInit(){

         if(localStorage.getItem("userToken")!=null){

            this.service.getUserMenuHeader().subscribe((res:any)=>{
                // this.menuList=res.MenuListR;
                 this.menuList=res.MenuList;
            });
        }
            this.service.getAll().subscribe((data: any) => {
                this.userDetails = data;
            });
        //     ,
        //     (err:HttpErrorResponse)=>{

        //     });
        // }
    }

    
   
    Logout(){
        localStorage.removeItem("userToken");
        this.router.navigate(["./login"]);
    }
}
