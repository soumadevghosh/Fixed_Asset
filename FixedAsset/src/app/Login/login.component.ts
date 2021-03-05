import{Component} from '@angular/core';
import{Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {mLogin} from './Shared/loginModel';
import {LoginService} from './Shared/loginService';
import {AppSharedUrlComponent} from '../Shared/appSharedUrl.Component';
import { LoaderService } from '../Layout/Shared/loader.service';


@Component({
    templateUrl:'login.component.html',
    providers:[
        mLogin,LoginService
    ]
})
export class LoginComponent extends AppSharedUrlComponent{
    showLoadingIndicator=true;
    constructor(private router:Router,public model:mLogin,private loginService:LoginService,private toastr: ToastrService,
        private loader:LoaderService ){
        super();
    }
    onSubmit(form:NgForm){
        let userName=form.value.EmailId
        let password=form.value.Password
        this.loginService.userAuthentication(userName,password).subscribe((data:any)=>{
            if(data.access_token!='' && data.access_token!=null){
                localStorage.setItem('userToken',data.access_token);
                setTimeout(() => {
                    this.router.navigate(["./dashboard"]);
                }, 1000);
            }
            else{
                this.toastr.error("Incorrect User Name Or Password");
            }            
        },
        (error:HttpErrorResponse)=>{
            localStorage.removeItem("userToken");
            if(error.status==400){
                this.toastr.error("Incorrect User Name Or Password");
            }
            else{
            this.loader.hide();
            this.toastr.error(this.serverError)

            }
        });
    }
}