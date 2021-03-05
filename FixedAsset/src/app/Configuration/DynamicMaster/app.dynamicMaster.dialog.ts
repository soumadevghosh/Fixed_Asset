import { Component,OnInit,Inject } from '@angular/core';
import {MatSelectModule} from '@angular/material/select'
import { DynamicMasterService } from './dynamicMaster.service';
import { DynamicMasterModel } from './dynamicMaster.model';
import { NgForm } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../Layout/Shared/loader.service';
import {AppSharedUrlComponent} from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';

@Component({
    templateUrl:'./app.dynamicMaster.dialog.html',
    providers:[DynamicMasterService,DynamicMasterModel]
})

export class DynamicMasterDialog extends AppSharedUrlComponent implements OnInit{
empId : any;
    constructor(private service:DynamicMasterService,public model:DynamicMasterModel,private toast:ToastrService,
        public dialogRef:MatDialogRef<DynamicMasterDialog>, @Inject(MAT_DIALOG_DATA) public dialogData:DynamicMasterModel,
        public loader:LoaderService, private router:Router){
            super();
         }
        
    ngOnInit(){
        
        
        if(this.dialogData!=null){
            
            this.setFormData(this.dialogData);
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
        if(form.value.dynamicTableDetailId>0){
            this.service.updateDynamicMasterData(this.model).subscribe((res:any)=>{
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
            this.service.addDyamicMasterData(this.model).subscribe((res:any)=>{
                if(res.isIdentityExist==true){
                    if(res.isSuccess==true){
                         this.closeModal();
                         this.toast.success(res.responseMsg);
                         window.location.reload();
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
        this.model.dynamicTableDetailId=form.value.dynamicTableDetailId;
        this.model.dynamicTableId=form.value.dynTabId;
        this.model.tableName=form.value.tableName;
        this.model.name=form.value.name;
        this.model.shortName=form.value.shortName;
        this.model.description=form.value.description;
        this.model.isActive=form.value.IsActive;
        this.model.remarks=form.value.Remarks;
        this.model.isShowDivTableName = form.value.isShowDivTableName;
        this.model.isShowDivTableProperty = form.value.isShowDivTableProperty;
    }
    setFormData(dynData:any){
        this.model.dynamicTableDetailId=dynData.dynamicTableDetailId;
        this.model.dynamicTableId=dynData.dynamicTableId;
        this.model.dynTabId=dynData.dynamicTableId;
        this.model.tableName=dynData.tableName;
        this.model.name=dynData.name;
        this.model.shortName=dynData.shortName;
        this.model.description=dynData.description;
        this.model.isActive=dynData.isActive;
        this.model.remarks=dynData.Remarks;
        this.model.TableList = dynData.TableList;
        this.model.isShowDivTableName = dynData.isShowDivTableName;
        this.model.isShowDivTableProperty = dynData.isShowDivTableProperty;
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