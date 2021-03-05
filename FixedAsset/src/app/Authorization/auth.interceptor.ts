import {Injectable} from '@angular/core';
import {HttpEvent,HttpHandler, HttpInterceptor,HttpRequest, HttpResponse,HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import { LoaderService } from '../Layout/Shared/loader.service';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private router:Router,private dialogRef: MatDialog,public loaderService: LoaderService,
        private toastr: ToastrService ){}
    intercept(request:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{
        this.loaderService.show();
        if(request.headers.get('No-Auth')=="True"){
            return next.handle(request.clone());
        }
        if(localStorage.getItem("userToken")!=null){
            const clonedreq=request.clone({
                headers:request.headers.set("Authorization","Bearer "+localStorage.getItem("userToken"))
            });
            return next.handle(clonedreq).pipe(
                tap(evt => {
                    if (evt instanceof HttpResponse) {
                        if(evt.body && evt.body.success){
                            if(evt.body.isIdentityExist==false){
                                this.dialogRef.closeAll();
                            }
                        }
                        this.loaderService.hide();   
                    }
                }),
                catchError((err: any) => {
                    if(err instanceof HttpErrorResponse) {
                        this.dialogRef.closeAll();
                        try {
                            if(err.status==401){
                                this.loaderService.hide();   
                                localStorage.removeItem("userToken");
                                this.router.navigate(["./login"]);
                            } 
                            else if(err.status==0){
                                this.loaderService.hide();   
                                this.toastr.error("Unable to process your request");
                            } 
                            else if(err.status==404){
                                this.loaderService.hide();   
                                this.toastr.error("Unable to process your request");
                            } 
                        } catch(e) {
                            this.loaderService.hide();   
                        }
                        
                    }
                   
                    return of(err);
                }));
        }
        else{
            this.loaderService.hide();   
            localStorage.removeItem("userToken");
            this.router.navigate(["./login"]);
        }
    }
    
}