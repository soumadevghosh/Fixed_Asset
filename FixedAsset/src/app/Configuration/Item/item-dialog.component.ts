import { Component, OnInit,Inject } from '@angular/core';
import {ItemModel} from './Shared/item.model';
import {ItemService} from './Shared/item.service';
import {FormGroup,FormControl,Validators,FormBuilder, NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from 'src/app/Layout/Shared/loader.service';
import { Router } from '@angular/router';
import { AppSharedUrlComponent } from 'src/app/Shared/appSharedUrl.Component';

@Component({
  templateUrl: './item-dialog.component.html',
  providers:[ItemModel,ItemService]
})
export class ItemDialogComponent extends AppSharedUrlComponent implements OnInit {

  constructor( private service:ItemService,public model:ItemModel,private toastr:ToastrService,
    public dialogRef:MatDialogRef<ItemDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData:ItemModel,
    public loader:LoaderService, private router:Router) { super();}
    Title:string;
    InventoryDepartments:any[];
    ItemCategories:any[];
    ItemCategoryList:any[];
    ItemGroups:any[];
    ItemUnits:any[];
    maintenanceSchedule:boolean;
    calibrationSchedule:boolean;
    ItemForm:FormGroup;
    ngOnInit() {
        if(this.dialogData!=null){
            this.InventoryDepartments=this.dialogData.inventoryDepartmentList;
            this.ItemUnits=this.dialogData.itemUnitList;
            this.Title = 'Add Item';
            this.ItemForm=new FormGroup({
                itemId:new FormControl(null),
                itemName: new FormControl('',[Validators.pattern('^[a-zA-Z ]*$'),Validators.required]),
                inventoryDeptName:new FormControl('',Validators.required),
                itemCategoryName:new FormControl('',Validators.required),
                itemGroupName:new FormControl('',Validators.required),
                gstPercent:new FormControl(null,[Validators.pattern(/(^99([.]0{1,2})?)$|(^\d{1,2}([.]\d{1,2})?)$/),Validators.required]),
                hsnNo:new FormControl(null,[Validators.pattern('^[0-9]*$'),Validators.required]),
                itemUnit:new FormControl('',Validators.required),
                quantity:new FormControl(null,[Validators.pattern('^[0-9]*$'),Validators.required]),
                strMaintenanceSchedule:new FormControl(null),
                strCalibrationSchedule:new FormControl(null),
                description:new FormControl(''),
                isActive:new FormControl(true),
                remarks:new FormControl('')
              });
            if(this.dialogData.itemId>0){
                this.Title = 'Edit Item';
                this.BindItemCategory(this.dialogData);
            }
        }
    }
    setFormData(itemData:any){
            this.ItemForm.controls.itemId.patchValue(itemData.itemId);
            this.ItemForm.controls.itemName.patchValue(itemData.itemName);
            this.ItemForm.controls.inventoryDeptName.patchValue(itemData.inventoryDeptId);
            this.ItemForm.controls.itemCategoryName.patchValue(itemData.itemCategoryId);
            this.ItemForm.controls.itemGroupName.patchValue(itemData.itemGroupId);
            this.ItemForm.controls.gstPercent.patchValue(itemData.gstPercentage);
            this.ItemForm.controls.hsnNo.patchValue(itemData.hsnNo);
            this.ItemForm.controls.itemUnit.patchValue(itemData.itemUnitId);
            this.ItemForm.controls.quantity.patchValue(itemData.quantity);
            if(itemData.strMaintenanceSchedule > 0){
                this.ItemForm.controls.strMaintenanceSchedule.patchValue(itemData.strMaintenanceSchedule);
                this.maintenanceSchedule=itemData.strMaintenanceSchedule > 0 ? true : false;
                this.ItemForm.get('strMaintenanceSchedule').setValidators([Validators.required,Validators.pattern('^[1-9]+[0-9]*$')]);
            }
            if(itemData.strCalibrationSchedule > 0){
                this.ItemForm.controls.strCalibrationSchedule.patchValue(itemData.strCalibrationSchedule);
                this.calibrationSchedule=itemData.strCalibrationSchedule > 0 ? true : false;
                this.ItemForm.get('strCalibrationSchedule').setValidators([Validators.required,Validators.pattern('^[1-9]+[0-9]*$')]);
            }
            this.ItemForm.controls.description.patchValue(itemData.description);
            this.ItemForm.controls.isActive.patchValue(itemData.isActive);
            this.ItemForm.controls.remarks.patchValue(itemData.remarks);
    }
    BindItemCategory(dialogData?:any){
        let invDeptId:number=this.ItemForm.controls.inventoryDeptName.value!="" ? this.ItemForm.controls.inventoryDeptName.value : dialogData.inventoryDeptId;
        this.service.getItemCategoryByInventoryDeptId(invDeptId).subscribe((res:any)=>{
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.ItemCategories=res.SelectedCategory;
                    if(dialogData!=null){
                        this.BindItemGroup(this.dialogData);
                        this.setFormData(this.dialogData);
                    }
                    else{
                        this.ItemForm.controls.strMaintenanceSchedule.reset();
                        this.ItemForm.controls.strCalibrationSchedule.reset();
                        this.ItemForm.controls.itemCategoryName.reset();
                        this.ItemForm.controls.itemGroupName.reset();
                        this.ItemGroups=null;
                        this.maintenanceSchedule=false;
                        this.calibrationSchedule=false;
                    } 
                }
                else{
                    this.toastr.error(res.responseMsg);
                }
            }
            else{
                this.toastr.error(res.responseMsg);
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
                    let itemCategory:number=this.ItemForm.controls.itemCategoryName.value!=""?this.ItemForm.controls.itemCategoryName.value:dialogData.itemCategoryId;
                    let invDept:number=this.ItemForm.controls.inventoryDeptName.value!=""?this.ItemForm.controls.inventoryDeptName.value:dialogData.inventoryDeptId;

                    this.ItemGroups=res.ItemGroupList
                            .filter(p=>p.ItemCategoryId==itemCategory && p.InventoryDeptId==invDept);
                    if(dialogData==null){
                        this.ItemForm.controls.strMaintenanceSchedule.reset();
                        this.ItemForm.controls.strCalibrationSchedule.reset();
                        this.ItemForm.controls.itemGroupName.reset();
                        this.maintenanceSchedule=false;
                        this.calibrationSchedule=false;
                    }
                }
                else{
                    this.toastr.error(res.responseMsg);
                }
            }
            else{
                this.toastr.error(res.responseMsg);
                setTimeout(() => {
                    this.router.navigate(["./login"]);
                }, 1000);
            }
        });
    }
    getGroupDetail(){
        this.service.getItemGroupDetail(this.ItemForm.controls.itemGroupName.value).subscribe((res:any)=>{
            if(res.isIdentityExist==true){
                if(res.isSuccess ==true){
                    this.maintenanceSchedule=res.itemGroup.MaintenanceSchedule==true?true:false;
                    this.calibrationSchedule=res.itemGroup.CalibrationSchedule==true?true:false;
                    this.ItemForm.controls.strMaintenanceSchedule.reset();
                    this.ItemForm.controls.strCalibrationSchedule.reset();
                    if(this.maintenanceSchedule==true){
                        this.ItemForm.get('strMaintenanceSchedule').setValidators([Validators.required,Validators.pattern('^[1-9]+[0-9]*$')]);
                    }
                    else{
                        this.ItemForm.get('strMaintenanceSchedule').clearValidators();
                        this.ItemForm.get('strMaintenanceSchedule').updateValueAndValidity();
                    }
                    if(this.calibrationSchedule==true){
                        this.ItemForm.get('strCalibrationSchedule').setValidators([Validators.required,Validators.pattern('^[1-9]+[0-9]*$')]);
                    }
                    else{
                        this.ItemForm.get('strCalibrationSchedule').clearValidators();
                        this.ItemForm.get('strCalibrationSchedule').updateValueAndValidity();
                    }
                }
                else{
                    this.toastr.error(res.responseMsg);
                }
            }
            else{
                this.toastr.error(res.responseMsg);
                setTimeout(() => {
                    this.router.navigate(["./login"]);
                }, 1000);
            }
        });
    }
    onSubmit(ItemForm:any){
        if(ItemForm.invalid){
            return;
        }
        this.getFormData(ItemForm);
        if(ItemForm.controls.itemId.value > 0){
            this.service.updateItem(this.model).subscribe((res:any)=>{
                if(res.isIdentityExist==true){
                    if(res.isSuccess==true){
                         this.closeModal();
                         this.toastr.success(res.responseMsg);
                    }
                    else{
                        this.toastr.error(res.responseMsg);
                    }
                }
                else{
                    this.toastr.error(res.responseMsg);
                    setTimeout(() => {
                        this.router.navigate(["./login"]);
                    }, 1000);
                }
            });
        }
        else{
            this.service.addItem(this.model).subscribe((res:any)=>{
                if(res.isIdentityExist==true){
                    if(res.isSuccess==true){
                        this.closeModal();
                        this.toastr.success(res.responseMsg);
                    }
                    else{
                        this.toastr.error(res.responseMsg);
                    }
                }
                else{
                    this.toastr.error(res.responseMsg);
                    setTimeout(() => {
                        this.router.navigate(["./login"]);
                    }, 1000);
                }
            });
        }
    }
    getFormData(form:any){
        this.model.itemId=form.controls.itemId.value;
        this.model.itemName=form.value.itemName.trim();
        this.model.inventoryDeptId=form.controls.inventoryDeptName.value;
        this.model.itemCategoryId=form.controls.itemCategoryName.value;
        this.model.itemGroupId=form.controls.itemGroupName.value;
        this.model.gstPercentage=form.controls.gstPercent.value;
        this.model.hsnNo=form.controls.hsnNo.value;
        this.model.itemUnitId=form.controls.itemUnit.value;
        this.model.quantity=form.controls.quantity.value;
        this.model.strMaintenanceSchedule=form.controls.strMaintenanceSchedule.value;
        this.model.strCalibrationSchedule=form.controls.strCalibrationSchedule.value;
        this.model.description=form.controls.description.value;
        this.model.isActive=form.controls.isActive.value;
        this.model.remarks=form.controls.remarks.value;
    }
    closeModal(){
        this.ItemForm.reset();
        this.dialogRef.close();
    }
}
