import { Component,OnInit,Inject } from '@angular/core';
import { EmployeeCategoryService } from './employee.category.service';
import { EmployeeCategoryModel } from './employee.category.model';
import { NgForm } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../Layout/Shared/loader.service';
import {AppSharedUrlComponent} from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';
@Component({
    templateUrl:'./app.employee.category.dialog.html',
    providers:[EmployeeCategoryService,EmployeeCategoryModel] 
})
export class EmployeeCategoryDialog extends AppSharedUrlComponent implements OnInit{
    constructor(private service:EmployeeCategoryService,public model:EmployeeCategoryModel,private toast:ToastrService,
        public dialogRef:MatDialogRef<EmployeeCategoryDialog>, @Inject(MAT_DIALOG_DATA) public dialogData:EmployeeCategoryModel,
        public loader:LoaderService, private router:Router){
            super();
         }
    
    ngOnInit(){
        if(this.dialogData!=null){
            this.setFormData(this.dialogData)
        }
        else{
            this.model.isActive=true;
        }
        
    }
    onSubmit(form:NgForm){
        if(form.invalid){
            return
        }
        this.getFormData(form);
        if(form.value.employeeCategoryId>0){
            this.service.updateEmployeeCategory(this.model).subscribe((res:any)=>{
                if(res.isIdentityExist==true){
                    if(res.isSuccess==true){
                         this.closeModal();
                         this.toast.success(res.responseMsg);
                    }
                    else{
                        this.toast.error(res.responseMsg);
                    }
                }
                else{
                    this.toast.error(res.responseMsg);
                    setTimeout(() => {
                        this.router.navigate(["./login"]);
                    }, 1000);
                }
            });
        }
        else{
            this.service.addEmployeeCategory(this.model).subscribe((res:any)=>{
                if(res.isIdentityExist==true){
                    if(res.isSuccess==true){
                         this.closeModal();
                         this.toast.success(res.responseMsg);
                    }
                    else{
                        this.toast.error(res.responseMsg);
                    }
                }
                else{
                    this.toast.error(res.responseMsg);
                    setTimeout(() => {
                        this.router.navigate(["./login"]);
                    }, 1000);
                }
            });
        }
    }
    getFormData(form:NgForm){
        this.model.employeeCategoryId=form.value.employeeCategoryId;
        this.model.employeeCategory=form.value.employeeCategory.trim();
        if(this.model.shortName == null){
            this.model.shortName=form.value.shortName.trim();
        }
        else{
            this.model.shortName = this.model.shortName;
        }
        this.model.isActive=form.value.IsActive;
        this.model.remarks=form.value.Remarks
    }
    setFormData(employeeCategoryData:any){
        this.model.employeeCategoryId=employeeCategoryData.employeeCategoryId;
        this.model.employeeCategory=employeeCategoryData.employeeCategory;
        this.model.shortName=employeeCategoryData.shortName;
        this.model.isActive=employeeCategoryData.isActive;
        this.model.remarks=employeeCategoryData.remarks
    }
    resetFormData(form?:NgForm){
        if(form!=null)
        form.reset();
    }
    closeModal(){
        this.resetFormData();
        this.dialogRef.close();
    }
}