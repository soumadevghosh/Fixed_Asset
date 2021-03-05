import { Component,OnInit,Inject } from '@angular/core';
import {MatSelectModule} from '@angular/material/select'
import { StatutoryMasterService } from './statutoryMaster.service';
import { StatutoryMasterModel } from './statutoryMaster.model';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../Layout/Shared/loader.service';
import {AppSharedUrlComponent} from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
    templateUrl:'./app.component.statutoryMaster.dialog.html',
    providers:[StatutoryMasterService,StatutoryMasterModel]
})
export class StatutoryMasterDialog extends AppSharedUrlComponent implements OnInit{
    dropdownList = [];
    dropdownSettings:IDropdownSettings;
    selectedItems:any=[];

    constructor(private service:StatutoryMasterService,public model:StatutoryMasterModel,private toast:ToastrService,
        public dialogRef:MatDialogRef<StatutoryMasterDialog>, @Inject(MAT_DIALOG_DATA) public dialogData:StatutoryMasterModel,
        public loader:LoaderService, private router:Router, private formBuilder:FormBuilder){
            super();
         }

         Itemform : FormGroup; 
        
    ngOnInit(){
        if(this.dialogData!=null){
            
            this.model.vendorTypeList=this.dialogData.vendorTypeList;
            let VendorTypeList=[];
            this.dialogData.vendorTypeList.forEach(element => {
                VendorTypeList.push({ vendorTypeId:element.VendorTypeId, vendorTypeName: element.VendorType })
            });
            this.dropdownList=VendorTypeList
            this.dropdownSettings = {
                singleSelection: false,
                idField: 'vendorTypeId',
                textField: 'vendorTypeName',
                selectAllText: 'Select All',
                unSelectAllText: 'UnSelect All',
                itemsShowLimit: 3,
                allowSearchFilter: true
              };
              this.Itemform = new FormGroup({
                statutoryId: new FormControl(null),
                statutoryName: new FormControl('',[Validators.pattern('^[a-zA-Z ]*$'),Validators.required]),
                vendorType: new FormControl('', Validators.required),
                isActive: new FormControl(true),
                remarks: new FormControl(''),
                // vendorType: new FormControl('',Validators.required)
              });
              if(this.dialogData.statutoryId>0){
                this.service.getVendorTypeIdbyStatutoryId(this.dialogData.statutoryId).subscribe(res=>{
                   this.selectedItems = null;
                    this.selectedItems=res.selectedItems;
                  })
                this.setFormData(this.dialogData)
            }
            else{
                this.model.isActive=true;
                this.model.statutoryId=0;
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
        if(form.value.statutoryId>0){
            this.service.updateStatutory(this.model).subscribe((res:any)=>{
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
            this.service.addStatutory(this.model).subscribe((res:any)=>{
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
        this.model.statutoryId=form.value.statutoryId;
        this.model.vendorTypeId=form.value.vendorTypeId;
        this.model.selectedItems=form.value.vendorTypeList;
        this.model.statutoryName=form.value.statutoryName.trim();
        this.model.isActive=form.value.isActive;
        this.model.remarks=form.value.remarks;
        
    }
    setFormData(stData:any){
        this.model.statutoryId=stData.statutoryId;
        //this.model.vendorTypeId=stData.vendorTypeId;
        this.model.statutoryName=stData.statutoryName;
        this.model.isActive=stData.isActive;
        this.model.remarks=stData.remarks;
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