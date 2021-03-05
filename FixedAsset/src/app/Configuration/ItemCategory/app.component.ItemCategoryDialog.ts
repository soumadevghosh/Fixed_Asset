import { Component,OnInit,Inject } from '@angular/core';
import { ItemCategoryService } from './Shared/ItemCategory.service';
import { ItemCategoryModel } from './Shared/ItemCategory.model';
import { NgForm,Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Layout/Shared/loader.service';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
    templateUrl:'./app.component.ItemCategoryDialog.html',
    providers:[ItemCategoryModel,ItemCategoryService]
})
export class ItemCategoryDialogComponent extends AppSharedUrlComponent implements OnInit{
    dropdownList = [];
    //dropdownSettings = {};
    dropdownSettings:IDropdownSettings;
    selectedItems:any=[];

    constructor(private service:ItemCategoryService,public model:ItemCategoryModel,private toast:ToastrService,
        public dialogRef:MatDialogRef<ItemCategoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData:ItemCategoryModel,
        public loader:LoaderService, private router:Router){
            super();
    }
    ngOnInit(){
        if(this.dialogData!=null){
           
            this.model.InventoryDeptList=this.dialogData.InventoryDeptList;
            let InventoryList=[];
            this.dialogData.InventoryDeptList.forEach(element => {
                InventoryList.push({ InventoryDeptId:element.InventoryDeptId, InventoryDeptName: element.InventoryDeptName })
            });
            
            this.dropdownList=InventoryList
            
            this.dropdownSettings = {
                singleSelection: false,
                idField: 'InventoryDeptId',
                textField: 'InventoryDeptName',
                selectAllText: 'Select All',
                unSelectAllText: 'UnSelect All',
                itemsShowLimit: 3,
                allowSearchFilter: true
              };

            if(this.dialogData.ItemCategoryId>0){

                 this.service.getInventoryDepartmentByCategoryId(this.dialogData.ItemCategoryId).subscribe((res:any)=>{
                   
                    //this.model.SelectedInventoryDept=this.model.InventoryDeptList;

                   // this.model.SelectedInventoryDept=res.SelectedInventoryDept

                    // this.dialogData.InventoryDeptList.forEach(element => {
                    //     InventoryList.push({ InventoryDeptId:element.InventoryDeptId, InventoryDeptName: element.InventoryDeptName })
                    // });
                    // 
                    // this.dropdownList=InventoryList

                   this.selectedItems= res.SelectedInventoryDept
                    // .forEach(element => {
                    //     this.selectedItems.push({InventoryDeptId:element.InventoryDeptId,InventoryDeptName: element.InventoryDeptName })
                    // });

                   // this.model.InventoryDepartments
            //         this.model.InventoryDeptList=this.dialogData.InventoryDeptList;
            // let InventoryList=[];
            // this.dialogData.InventoryDeptList.forEach(element => {
            //     InventoryList.push({ InventoryDeptId:element.InventoryDeptId, InventoryDeptName: element.InventoryDeptName })
            // });
                    // =res.SelectedInventoryDept;
                   })
                this.setFormData(this.dialogData)
            }
            else{
                this.model.isActive=true;
                this.model.ItemCategoryId=0;
            }
            
        }
    }
    onSubmit(form:NgForm){
        if(form.invalid){
            return
        }
        
        this.getFormData(form);
        if(form.value.ItemCategoryId>0){
            this.service.updateItemCategory(this.model).subscribe((res:any)=>{
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
            
            this.service.addItemCategory(this.model).subscribe((res:any)=>{
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
        
        this.model.SelectedInventoryDept=form.value.InventoryDeptList
        this.model.Itemcategory=form.value.Itemcategory;
        this.model.isActive=form.value.isActive;
        this.model.remarks=form.value.remarks
    }
    setFormData(dialogData:any){
        
        this.model.ItemCategoryId=dialogData.ItemCategoryId;
        this.model.Itemcategory=dialogData.Itemcategory;
        this.model.isActive=dialogData.isActive;
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