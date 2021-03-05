import { Component,OnInit,Inject } from '@angular/core';
import { ItemUnitMasterService } from './Shared/ItemUnitMaster.service';
import { ItemUnitMasterModel } from './Shared/ItemUnitMaster.model';
import { NgForm, FormControl,Validators,FormBuilder,FormGroup} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../Layout/Shared/loader.service';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { InventoryDepartmentDialogComponent } from '../InventoryDepartment/app.component.InventoryDeptDialog';

@Component({
    templateUrl:'./app.ItemUnitMasterDialog.component.html',
    providers:[ItemUnitMasterModel,ItemUnitMasterService]
})
export class ItemUnitMasterDialogComponent extends AppSharedUrlComponent implements OnInit{

    constructor( private service:ItemUnitMasterService,public model:ItemUnitMasterModel,private toast:ToastrService,
        public dialogRef:MatDialogRef<ItemUnitMasterDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData:ItemUnitMasterModel,
        public loader:LoaderService, private router:Router,private formBuilder:FormBuilder){
            super();
    }
    ItemUnitMasterForm:FormGroup;

    ngOnInit(){
        if(this.dialogData!=null){
            this.ItemUnitMasterForm=new FormGroup({
                        ItemUnitId:new FormControl(null),
                        ItemUnitName: new FormControl('',[Validators.pattern('^[a-zA-Z ]*$'),Validators.required]),
                        Description:new FormControl(''),
                        isActive:new FormControl(true)
                              });
                          if(this.dialogData.ItemUnitId>0){
                                this.setFormData(this.dialogData);
                            }
        }
    }

    onSubmit(ItemUnitMasterForm:any){
        if(ItemUnitMasterForm.invalid){
            return
        }
        this.getFormData(ItemUnitMasterForm);
        if(ItemUnitMasterForm.controls.ItemUnitId.value > 0){
            this.service.updateItemUnitMaster(this.model).subscribe((res:any)=>{
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
            this.service.addItemUnitMaster(this.model).subscribe((res:any)=>{
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
        this.model.ItemUnitId=form.controls.ItemUnitId.value;
        this.model.ItemUnitName=form.value.ItemUnitName;
        this.model.Description=form.controls.Description.value;
        this.model.isActive=form.controls.isActive.value;
    }

    setFormData(itemData:any){
        
        this.ItemUnitMasterForm.controls.ItemUnitId.patchValue(itemData.ItemUnitId);
        this.ItemUnitMasterForm.controls.ItemUnitName.patchValue(itemData.ItemUnitName);
        this.ItemUnitMasterForm.get('Description').patchValue(itemData.Description);
        this.ItemUnitMasterForm.controls.isActive.patchValue(itemData.isActive);
        
    }

    resetFormData(form?:NgForm){
        if(form!=null)
        form.reset();
    }

    closeModal(){
        this.ItemUnitMasterForm.reset();
        this.dialogRef.close();
    }

}