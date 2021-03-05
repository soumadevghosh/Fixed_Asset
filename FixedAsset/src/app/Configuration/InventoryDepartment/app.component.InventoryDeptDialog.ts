import { Component,OnInit,Inject } from '@angular/core';
import { InventoryDepartmentService } from './Shared/InventoryDepartment.service';
import { InventoryDepartmentModel } from './Shared/InventoryDepartment.model';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Layout/Shared/loader.service';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';

@Component({
    templateUrl:'./app.component.InventoryDeptDialog.html',
    providers:[InventoryDepartmentModel,InventoryDepartmentService]
})
export class InventoryDepartmentDialogComponent extends AppSharedUrlComponent implements OnInit{
    constructor(private service:InventoryDepartmentService,public model:InventoryDepartmentModel,private toast:ToastrService,
        public dialogRef:MatDialogRef<InventoryDepartmentDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData:InventoryDepartmentModel,
        public loader:LoaderService, private router:Router){
            super();
    }
    ngOnInit(){
        if(this.dialogData!=null){
            if(this.dialogData.InventoryDeptId>0){
                this.setFormData(this.dialogData)
            }
            else{
                this.model.isActive=true;
                this.model.InventoryDeptId=0;
            }
            
        }
    }
    onSubmit(form:NgForm){
        if(form.invalid){
            return
        }
        this.getFormData(form);
        if(form.value.InventoryDeptId>0){
            this.service.updateInventoryDepartment(this.model).subscribe((res:any)=>{
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
            this.service.addInventoryDepartment(this.model).subscribe((res:any)=>{
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
        this.model.InventoryDeptName=form.value.InventoryDeptName;
        if(this.model.InventoryDeptShortName==null){
        this.model.InventoryDeptShortName=form.value.InventoryDeptShortName;
        }else{
            this.model.InventoryDeptShortName=this.model.InventoryDeptShortName;
        }
        this.model.isActive=form.value.isActive;
        this.model.remarks=form.value.remarks
    }
    setFormData(dialogData:any){
        this.model.InventoryDeptId=dialogData.InventoryDeptId,
        this.model.InventoryDeptName=dialogData.InventoryDeptName,
        this.model.InventoryDeptShortName=dialogData.InventoryDeptShortName,
        this.model.isActive=dialogData.isActive,
        this.model.remarks=dialogData.remarks
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