import { Component,OnInit,Inject } from '@angular/core';
import { EmployeeDepartmentService } from './department.service';
import { EmployeeDepartmentModel } from './department.model';
import { NgForm } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../Layout/Shared/loader.service';
import {AppSharedUrlComponent} from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';
@Component({
    templateUrl:'./app.department.dialog.html',
    providers:[EmployeeDepartmentService,EmployeeDepartmentModel]
})
export class EmployeeDepartmentDialog extends AppSharedUrlComponent implements OnInit{
    constructor(private service:EmployeeDepartmentService,public model:EmployeeDepartmentModel,private toast:ToastrService,
        public dialogRef:MatDialogRef<EmployeeDepartmentDialog>, @Inject(MAT_DIALOG_DATA) public dialogData:EmployeeDepartmentModel,
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
        if(form.value.DepartemntId>0){
            this.service.updateDepartment(this.model).subscribe((res:any)=>{
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
            this.service.addDepartment(this.model).subscribe((res:any)=>{
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
        this.model.departmentId=form.value.DepartemntId;
        this.model.departmentName=form.value.department;
        if(this.model.shortName==null){
        this.model.shortName=form.value.shortName;
        }else
        this.model.shortName=this.model.shortName;
        this.model.isActive=form.value.IsActive;
        this.model.remarks=form.value.Remarks
        
    }
    setFormData(departmentData:any){
        this.model.departmentId=departmentData.departmentId;
        this.model.departmentName=departmentData.departmentName;
        this.model.shortName=departmentData.shortName;
        this.model.isActive=departmentData.isActive;
        this.model.remarks=departmentData.remarks
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