import { Component,OnInit,Inject } from '@angular/core';
import { ServiceMasterService } from './Shared/ServiceMaster.service';
import { ServiceMasterModel } from './Shared/ServiceMaster.model';
import { NgForm, FormControl,Validators,FormBuilder,FormGroup} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../Layout/Shared/loader.service';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ItemGroupModel } from '../ItemGroup/Shared/ItemGroup.model';
import { from } from 'rxjs';

@Component({
    templateUrl:'./app.serviceMasterDialog.component.html',
    providers:[ServiceMasterModel,ServiceMasterService]
})
export class ServiceMasterDialogComponent extends AppSharedUrlComponent implements OnInit{

    constructor( private service:ServiceMasterService,public model:ServiceMasterModel,private toast:ToastrService,
        public dialogRef:MatDialogRef<ServiceMasterDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData:ServiceMasterModel,
        public loader:LoaderService, private router:Router,private formBuilder:FormBuilder){
            super();
    }

    InventoryDepartmentList:any[];
    ItemCategoryList:any[];
    ItemGroupList:any[];
    ServiceMasterForm:FormGroup;

    ngOnInit(){
        if(this.dialogData!=null){
            this.InventoryDepartmentList=this.dialogData.InventoryDepartmentList;
            this.ServiceMasterForm=new FormGroup({
                        ServiceMasterId:new FormControl(null),
                        ServiceItemName: new FormControl('',[Validators.pattern('^[a-zA-Z ]*$'),Validators.required]),
                        inventoryDeptName:new FormControl('',Validators.required),
                        itemCategoryName:new FormControl('',Validators.required),
                        itemGroupName:new FormControl('',Validators.required),
                        isActive:new FormControl(true),
                              });
            if(this.dialogData.ServiceMasterId>0){
                this.BindItemCategory(this.dialogData);
            }
            
        }
    }

    onSubmit(ServiceMasterForm:any){
        if(ServiceMasterForm.invalid){
            return
        }
        this.getFormData(ServiceMasterForm);
        if(ServiceMasterForm.controls.ServiceMasterId.value > 0){
            this.service.updateServiceMaster(this.model).subscribe((res:any)=>{
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
            this.service.addServiceMaster(this.model).subscribe((res:any)=>{
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
    
    getFormData(form:any){
        this.model.ServiceMasterId=form.controls.ServiceMasterId.value;
        this.model.ServiceItemName=form.value.ServiceItemName;
        this.model.InventoryDeptId=form.controls.inventoryDeptName.value;
        this.model.ItemCategoryId=form.controls.itemCategoryName.value;
        this.model.ItemGroupId=form.controls.itemGroupName.value;
        this.model.isActive=form.controls.isActive.value;
    }

    setFormData(itemData:any){
        this.ServiceMasterForm.controls.ServiceMasterId.patchValue(itemData.ServiceMasterId);
        this.ServiceMasterForm.controls.ServiceItemName.patchValue(itemData.ServiceItemName);
        this.ServiceMasterForm.controls.inventoryDeptName.patchValue(itemData.InventoryDeptId);
        this.ServiceMasterForm.controls.itemCategoryName.patchValue(itemData.ItemCategoryId);
        this.ServiceMasterForm.controls.itemGroupName.patchValue(itemData.ItemGroupId);
        this.ServiceMasterForm.controls.isActive.patchValue(itemData.isActive);
        
    }

    resetFormData(form?:NgForm){
        if(form!=null)
        form.reset();
    }

    closeModal(){
        this.ServiceMasterForm.reset();
        this.dialogRef.close();
    }

    BindItemCategory(dialogData?:any){
        let invDeptId:number=this.ServiceMasterForm.controls.inventoryDeptName.value!="" ? this.ServiceMasterForm.controls.inventoryDeptName.value : dialogData.InventoryDeptId;
        this.service.getItemCategoryByInventoryDeptId(invDeptId).subscribe((res:any)=>{
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.ItemCategoryList=res.SelectedCategory;
                    if(dialogData!=null){
                        this.BindItemGroup(this.dialogData);
                        this.setFormData(this.dialogData);
                    }
                    else{
                        this.ServiceMasterForm.controls.itemCategoryName.reset();
                        this.ServiceMasterForm.controls.itemGroupName.reset();
                        this.ItemGroupList=null;
                    } 
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

    BindItemGroup(dialogData?:any){
        this.service.getItemGroup().subscribe((res:any)=>{
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    let itemCategory:number=this.ServiceMasterForm.controls.itemCategoryName.value!=""?this.ServiceMasterForm.controls.itemCategoryName.value:dialogData.ItemCategoryId;
                    let invDept:number=this.ServiceMasterForm.controls.inventoryDeptName.value!=""?this.ServiceMasterForm.controls.inventoryDeptName.value:dialogData.InventoryDeptId;

                    this.ItemGroupList=res.ItemGroupList
                            .filter(p=>p.ItemCategoryId==itemCategory && p.InventoryDeptId==invDept);
                    if(dialogData==null){
                        this.ServiceMasterForm.controls.itemGroupName.reset();
                    } 
                    
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