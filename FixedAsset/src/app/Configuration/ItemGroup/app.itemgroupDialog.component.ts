import { Component,OnInit,Inject } from '@angular/core';
import { ItemGroupService } from './Shared/ItemGroup.service';
import { ItemGroupModel } from './Shared/ItemGroup.model';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../Layout/Shared/loader.service';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';

@Component({
    templateUrl:'./app.itemgroup.Dialog.component.html',
    providers:[ItemGroupModel,ItemGroupService]
})
export class ItemGroupDialogComponent extends AppSharedUrlComponent implements OnInit{
    constructor(private service:ItemGroupService,public model:ItemGroupModel,private toast:ToastrService,
        public dialogRef:MatDialogRef<ItemGroupDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData:ItemGroupModel,
        public loader:LoaderService, private router:Router){
            super();
    }
    ngOnInit(){
        if(this.dialogData!=null){
            this.model.InventoryDepartmentList=this.dialogData.InventoryDepartmentList;
            if(this.dialogData.ItemGroupId>0){
                this.setFormData(this.dialogData);
                this.BindItemCategory(this.dialogData);
                
            }
            else{
                this.model.isActive=true;
                this.model.ItemGroupId=0;
            }
            
        }
    }
    onSubmit(form:NgForm){
        if(form.invalid){
            return
        }
        this.getFormData(form);
        if(form.value.ItemGroupId>0){
            this.service.updateItemGroup(this.model).subscribe((res:any)=>{
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
            this.service.addItemGroup(this.model).subscribe((res:any)=>{
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
        
        this.model.InventoryDeptId=form.value.InventoryDeptId;
        this.model.ItemCategoryId=form.value.ItemCategoryId;
        this.model.ItemGroupName=form.value.ItemGroupName;
        this.model.MaintenanceSchedule=form.value.MaintenanceSchedule;
        this.model.CalibrationSchedule=form.value.CalibrationSchedule;
        this.model.isActive=form.value.isActive;
        this.model.remarks=form.value.remarks
    }
    setFormData(itemGroupdata:any){
        this.model.ItemGroupId=itemGroupdata.ItemGroupId;
        this.model.InventoryDeptId=itemGroupdata.InventoryDeptId;
        this.model.ItemCategoryId=itemGroupdata.ItemCategoryId;
        this.model.ItemGroupName=itemGroupdata.ItemGroupName;
        this.model.MaintenanceSchedule=itemGroupdata.MaintenanceSchedule;
        this.model.CalibrationSchedule=itemGroupdata.CalibrationSchedule;
        this.model.isActive=itemGroupdata.isActive;
        this.model.remarks=itemGroupdata.remarks
    }
    resetFormData(form?:NgForm){
        if(form!=null)
        form.reset();
    }
    closeModal(){
        this.resetFormData();
        this.dialogRef.close();
    }
    BindItemCategory(dialogData?:any){
        this.service.getItemCategoryByInventoryDeptId(this.model.InventoryDeptId).subscribe((res:any)=>{
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                   
                    this.model.ItemCategoryList=res.SelectedCategory;
                    if(dialogData==null)
                        this.model.ItemCategoryId=null;
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