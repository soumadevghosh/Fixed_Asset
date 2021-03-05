import { Component,OnInit,Inject } from '@angular/core';
import { VendorTypeService } from './Shared/VendorType.service';
import { VendorTypeMasterModel } from './Shared/VendorType.model';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Layout/Shared/loader.service';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';

@Component({
    templateUrl:'./app.component.VendorTypeMaster.dialog.html',
    providers:[VendorTypeMasterModel,VendorTypeService]
})
export class VendorTypeDialogComponent extends AppSharedUrlComponent implements OnInit{
    constructor(private service:VendorTypeService,public model:VendorTypeMasterModel,private toast:ToastrService,
        public dialogRef:MatDialogRef<VendorTypeDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData:VendorTypeMasterModel,
        public loader:LoaderService, private router:Router){
            super();
    }
    ngOnInit(){
        if(this.dialogData!=null){
            if(this.dialogData.VendorTypeId>0){
                this.setFormData(this.dialogData)
            }
            else{
                this.model.isActive=true;
                this.model.VendorTypeId=0;
            }
            
        }
    }
    onSubmit(form:NgForm){
        if(form.invalid){
            return
        }
        this.getFormData(form);
        if(form.value.VendorTypeId>0){
            this.service.updateVendorType(this.model).subscribe((res:any)=>{
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
            this.service.addVendorType(this.model).subscribe((res:any)=>{
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
        this.model.VendorType=form.value.VendorType.trim();
        if(this.model.shortName == null){
            this.model.shortName=form.value.shortName.trim();
        }
        else{
            this.model.shortName = this.model.shortName;
        }
        this.model.isActive=form.value.isActive;
        this.model.remarks=form.value.remarks;
    }
    setFormData(dialogData:any){
        this.model.VendorTypeId=dialogData.VendorTypeId,
        this.model.VendorType=dialogData.VendorType,
        this.model.shortName=dialogData.shortName,
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