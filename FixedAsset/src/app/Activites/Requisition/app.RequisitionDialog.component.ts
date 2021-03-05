import { Component,OnInit,Inject } from '@angular/core';
import { RequisitionService } from './Shared/Requisition.service';
//import { RequisitionModel } from './Shared/Requisition.model';
import {RequisitionModel} from './Shared/Requisition.model';
import { NgForm, FormControl,Validators,FormBuilder,FormGroup} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
//import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../Layout/Shared/loader.service';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';
import { from } from 'rxjs';
//////////////to import enum file/////////
import {RequesitionStatusEnum} from '../../Shared/app.helper.component';
//import { map } from 'rxjs/operators';
//import { ItemGroupModel } from '../Configuration/ItemGroup/Shared/ItemGroup.model';
//import { from } from 'rxjs';

@Component({
    templateUrl:'./app.RequisitionDialog.component.html',
    providers:[RequisitionModel,RequisitionService]
})
export class RequisitionDialogComponent extends AppSharedUrlComponent implements OnInit{

    constructor( private service:RequisitionService,public model:RequisitionModel,private toast:ToastrService,
        public dialogRef:MatDialogRef<RequisitionDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData:RequisitionModel,
        public loader:LoaderService, private router:Router,private formBuilder:FormBuilder){
            super();
    }
    Title:string;
    InventoryDepartmentList:any[];
    ItemCategoryList:any[];
    ItemGroupList:any[];
    FunctionalDeptList:any[];
    ItemList:any[];
    UnitList:any[];
    RequisitionTypeList:any[];
    RequsitionStatusID:number;
    RequisitionForm:FormGroup;
    EnumRequisitionStatus:number;
    //public enumExample:RequesitionStatusEnum.Pending;

    ngOnInit(){
        if(this.dialogData!=null){
            this.Title = 'Add Item';
            this.InventoryDepartmentList=this.dialogData.InventoryDepartmentList;
             //this.UnitList=this.dialogData.UnitList;
             //this.FunctionalDeptList=this.dialogData.FunctionalDeptList;
            this.RequisitionTypeList=this.dialogData.RequisitionTypeList;
            this.RequisitionForm=new FormGroup({
                        RequisitionId:new FormControl(null),
                        requisitionStatus:new FormControl(null),
                        requisitionStatusId:new FormControl(null),
                        inventoryDeptName:new FormControl('',Validators.required),
                        itemCategoryName:new FormControl('',Validators.required),
                        itemGroupName:new FormControl('',Validators.required),
                        ItemName:new FormControl('',Validators.required),
                        ReqType:new FormControl('',Validators.required),
                        Quantity:new FormControl('',[Validators.pattern('^[0-9]*$'),Validators.required]),
                        //RequisitionName: new FormControl('',[Validators.pattern('^[a-zA-Z ]*$'),Validators.required]),
                        //UnitName:new FormControl('',Validators.required),
                       // departmentName:new FormControl('',Validators.required),
                        // UnitPrice:new FormControl('',[Validators.pattern('^[0-9]*$'),Validators.required]),
                        // GST:new FormControl('',Validators.pattern('^[0-9]*$')),
                        // OtherExpences:new FormControl('',Validators.pattern('^[0-9]*$')),
                        // TotalBudget:new FormControl('',[Validators.pattern('^[0-9]*$'),Validators.required]),
                        // isActive:new FormControl(true),
                    });
            if(this.dialogData.RequisitionId>0){
                this.Title = 'Edit Item';
                this.RequsitionStatusID=this.dialogData.RequisitionStatusID;
                this.EnumRequisitionStatus=RequesitionStatusEnum.Pending;
                this.BindItemCategory(this.dialogData);
                if(this.dialogData.RequisitionStatusID!=RequesitionStatusEnum.Pending){
                    this.RequisitionForm.disable();
                }
               
            }
            
        }
    }

    onSubmit(RequisitionForm:any){
        if(RequisitionForm.invalid){
            return
        }
        this.getFormData(RequisitionForm);
        if(RequisitionForm.controls.RequisitionId.value > 0){
            this.service.updateRequisition(this.model).subscribe((res:any)=>{
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
            this.service.addRequisition(this.model).subscribe((res:any)=>{
                
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
        this.model.RequisitionId=form.controls.RequisitionId.value;
        this.model.InventoryDeptId=form.controls.inventoryDeptName.value;
        this.model.ItemCategoryId=form.controls.itemCategoryName.value;
        this.model.ItemGroupId=form.controls.itemGroupName.value;
        this.model.itemId=form.controls.ItemName.value;
        this.model.RequisitionTypeId=form.controls.ReqType.value;
        this.model.Quantity=form.controls.Quantity.value;
        this.model.RequisitionStatus=form.controls.requisitionStatus.value; 
        this.model.RequisitionStatusID=form.controls.requisitionStatusId.value; 
        //this.model.RequisitionName=form.value.RequisitionName;
        //this.model.unitId=form.controls.UnitName.value;
        //this.model.departmentId=form.controls.departmentName.value;
        // this.model.UnitPrice=form.controls.UnitPrice.value;
        // this.model.GST=form.controls.GST.value;
        // this.model.OtherExpences=form.controls.OtherExpences.value;
        // this.model.TotalBudget=form.controls.TotalBudget.value;
        // this.model.RequisitionStatus=form.controls.requisitionStatus.value;
        // this.model.isActive=form.controls.isActive.value;
    }

    setFormData(itemData:any){
        this.RequisitionForm.controls.RequisitionId.patchValue(itemData.RequisitionId);
        this.RequisitionForm.controls.requisitionStatus.patchValue(itemData.RequisitionStatus);
        this.RequisitionForm.controls.requisitionStatusId.patchValue(itemData.RequisitionStatusID);
        this.RequisitionForm.controls.inventoryDeptName.patchValue(itemData.InventoryDeptId);
        this.RequisitionForm.controls.itemCategoryName.patchValue(itemData.ItemCategoryId);
        this.RequisitionForm.controls.itemGroupName.patchValue(itemData.ItemGroupId);
        this.RequisitionForm.controls.ItemName.patchValue(itemData.itemId);
        this.RequisitionForm.controls.ReqType.patchValue(itemData.RequisitionTypeId);
        this.RequisitionForm.controls.Quantity.patchValue(itemData.Quantity);
        // this.RequisitionForm.controls.RequisitionName.patchValue(itemData.RequisitionName);
        // this.RequisitionForm.controls.UnitName.patchValue(itemData.unitId);
        // this.RequisitionForm.controls.departmentName.patchValue(itemData.depertmentId);
        // this.RequisitionForm.controls.UnitPrice.patchValue(itemData.UnitPrice);
        // this.RequisitionForm.controls.GST.patchValue(itemData.GST);
        // this.RequisitionForm.controls.OtherExpences.patchValue(itemData.OtherExpences);
        // this.RequisitionForm.controls.TotalBudget.patchValue(itemData.TotalBudget);
        // this.RequisitionForm.controls.isActive.patchValue(itemData.isActive);
        
    }

    resetFormData(form?:NgForm){
        if(form!=null)
        form.reset();
    }

    closeModal(){
        this.RequisitionForm.reset();
        this.dialogRef.close();
    }

    BindItemCategory(dialogData?:any){
        let invDeptId:number=this.RequisitionForm.controls.inventoryDeptName.value!="" ? this.RequisitionForm.controls.inventoryDeptName.value : dialogData.InventoryDeptId;
        this.service.getItemCategoryByInventoryDeptId(invDeptId).subscribe((res:any)=>{
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.ItemCategoryList=res.SelectedCategory;
                    if(dialogData!=null){
                        
                        this.BindItemGroup(this.dialogData);
                         //this.setFormData(this.dialogData);
                    }
                    else{
                        this.RequisitionForm.controls.itemCategoryName.reset();
                        this.RequisitionForm.controls.itemGroupName.reset();
                        this.RequisitionForm.controls.ItemName.reset();
                        this.ItemGroupList=null;
                        this.ItemList=null;
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
                    let itemCategory:number=this.RequisitionForm.controls.itemCategoryName.value!=""?this.RequisitionForm.controls.itemCategoryName.value:dialogData.ItemCategoryId;
                    let invDept:number=this.RequisitionForm.controls.inventoryDeptName.value!=""?this.RequisitionForm.controls.inventoryDeptName.value:dialogData.InventoryDeptId;

                    this.ItemGroupList=res.ItemGroupList
                            .filter(p=>p.ItemCategoryId==itemCategory && p.InventoryDeptId==invDept);

                    if(dialogData!=null){
                        this.BindItems(this.dialogData);
                        this.setFormData(this.dialogData);
                       // this.setFormData(this.dialogData);

                           
                    }
                    if(dialogData==null){
                        this.RequisitionForm.controls.itemGroupName.reset();
                        this.RequisitionForm.controls.ItemName.reset();
                        this.ItemList=null;

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


    BindItems(dialogData?:any){
        
        this.service.getItems().subscribe((res:any)=>{
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    let itemCategory:number=this.RequisitionForm.controls.itemCategoryName.value!=""?this.RequisitionForm.controls.itemCategoryName.value:dialogData.ItemCategoryId;
                    let invDept:number=this.RequisitionForm.controls.inventoryDeptName.value!=""?this.RequisitionForm.controls.inventoryDeptName.value:dialogData.InventoryDeptId;
                    let itemGroup:number=this.RequisitionForm.controls.itemGroupName.value!=""?this.RequisitionForm.controls.itemGroupName.value:dialogData.ItemGroupId;

                    this.ItemList=res.itemList
                            .filter(p=>p.itemCategoryId==itemCategory && p.inventoryDeptId==invDept && p.itemGroupId==itemGroup);
                    if(dialogData==null){
                        this.RequisitionForm.controls.ItemName.reset();
                    } 
                //     if(dialogData!=null){
                //     this.setFormData(this.dialogData);
                // }
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