import { Component,OnInit,Inject } from '@angular/core';
import {MatSelectModule} from '@angular/material/select'
import { CompanyMasterService } from './companyMaster.service';
import { CompanyMasterModel } from './companyMaster.model';
import { NgForm } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../Layout/Shared/loader.service';
import {AppSharedUrlComponent} from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
    templateUrl:'./app.companyMaster.dialog.html',
    providers:[CompanyMasterService,CompanyMasterModel]
})
export class CompanyMasterDialog extends AppSharedUrlComponent implements OnInit{
    dropdownList = [];
    dropdownSettings:IDropdownSettings;
    selectedItems:any=[];

    constructor(private service:CompanyMasterService,public model:CompanyMasterModel,private toast:ToastrService,
        public dialogRef:MatDialogRef<CompanyMasterDialog>, @Inject(MAT_DIALOG_DATA) public dialogData:CompanyMasterModel,
        public loader:LoaderService, private router:Router){
            super();
         }
        
    ngOnInit(){
        
        if(this.dialogData!=null){
            this.model.inventoryDeptList=this.dialogData.inventoryDeptList;
            let InventoryList=[];
            this.dialogData.inventoryDeptList.forEach(element => {
                InventoryList.push({ InventoryDeptId:element.InventoryDeptId, inventoryDeptName: element.inventoryDeptName })
            });
            this.dropdownList=InventoryList
            this.dropdownSettings = {
                singleSelection: false,
                idField: 'InventoryDeptId',
                textField: 'inventoryDeptName',
                selectAllText: 'Select All',
                unSelectAllText: 'UnSelect All',
                itemsShowLimit: 3,
                allowSearchFilter: true
              };
              if(this.dialogData.companyId>0){
                this.service.getInventoryIdbyCompanyId(this.dialogData.companyId).subscribe(res=>{
                   
                    this.selectedItems=res.selectedItems;
                  })
                this.setFormData(this.dialogData)
            }
            else{
                this.model.isActive=true;
                this.model.companyId=0;
            }
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
        if(form.value.companyId>0){
            this.service.updateCompany(this.model).subscribe((res:any)=>{
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
            this.service.addCompany(this.model).subscribe((res:any)=>{
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
        this.model.companyId=form.value.companyId;
        this.model.companyName=form.value.companyName.trim();
        this.model.selectedItems=form.value.inventoryDeptList;
        this.model.isMaintenance=form.value.isMaintenance;
        this.model.isService=form.value.isService;
        this.model.isProduct=form.value.isProduct;
        this.model.isActive=form.value.isActive;
        this.model.remarks=form.value.Remarks;
        
    }
    setFormData(cmpData:any){
        this.model.companyId=cmpData.companyId;
        this.model.companyName=cmpData.companyName;
        this.model.isMaintenance=cmpData.isMaintenance;
        this.model.isService=cmpData.isService;
        this.model.isProduct=cmpData.isProduct;
        this.model.isActive=cmpData.isActive;
        this.model.remarks=cmpData.Remarks;
        // this.model.inventoryDeptList = cmpData.inventoryDeptList;
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