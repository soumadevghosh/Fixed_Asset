import { Component, OnInit, Inject } from '@angular/core';
import { RequisitionToHQInventoryService } from './Shared/requisition-to-hqinventory.service';
import { RequisitionToHQInventoryModel } from './Shared/requisition-to-hqinventory-model';
import { NgForm, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../Layout/Shared/loader.service';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
    templateUrl: './HQ-manual-requisition-dialog.component.html',
    providers: [RequisitionToHQInventoryModel, RequisitionToHQInventoryService]
})
export class HQManualRequisitionDialogComponent extends AppSharedUrlComponent implements OnInit {
    constructor(private service: RequisitionToHQInventoryService, public model: RequisitionToHQInventoryModel, private toast: ToastrService,
        public dialogRef: MatDialogRef<HQManualRequisitionDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: RequisitionToHQInventoryModel,
        public loader: LoaderService, private router: Router, private formBuilder: FormBuilder) {
        super();
    }
    title: string;
    ItemCategories: any[] = [];
    ItemGroups: any[] = [];
    Items: any[] = [];
    manualRequisitionForm: FormGroup;
    ngOnInit() {

        this.manualRequisitionForm = this.formBuilder.group({
            requisitionId:new FormControl(0),
            invDept: new FormControl({ value: this.dialogData.inventoryDeptId, disabled: true }),
            // requisitionType: new FormControl('', Validators.required),
            // itemCategory: new FormControl('', Validators.required),
            // itemGroup: new FormControl('', Validators.required),
            // items: new FormControl('', Validators.required),
            // quantity: new FormControl('', Validators.required),
            manualRequisitionCart : this.formBuilder.array([])
        })
        if (this.dialogData != null) {
            this.title = 'Add HQ Manual Requisition';
            this.model.inventoryDeptList = this.dialogData.inventoryDeptList;
            this.model.requisitionTypeList = this.dialogData.requisitionTypeList;
            this.service.getItemCategoryByInventoryDeptId(this.dialogData.inventoryDeptId).subscribe((res) => {
                if (res.isIdentityExist == true) {
                    if (res.isSuccess == true) {
                        this.model.itemCategoryList = res.SelectedCategory;
                    }
                }
            })
            this.addRow()
        }
    }

    bindItemGroup(index: number) {
        let InventoryDeptId: number = this.dialogData.inventoryDeptId;
        let ItemCategoryId: number = this.manualRequisitionForm.value.manualRequisitionCart[index].itemCategory;
        this.service.getManualRequisition().subscribe((res) => {
            if (res.isIdentityExist == true) {
                if (res.isSuccess == true) {
                    this.ItemGroups[index] = res.itemgroupList.filter(x => x.InventoryDeptId == InventoryDeptId && x.ItemCategoryId == ItemCategoryId);
                }
                else {
                    this.toast.error(res.responseMsg);
                }
            }
            else {
                this.toast.error(res.responseMsg);
                setTimeout(() => {
                    this.router.navigate(["./login"]);
                }, 1000);
            }
        });
    }

    bindItems(index: number) {
        let InventoryDeptId: number = this.dialogData.inventoryDeptId;
        let ItemCategoryId: number = this.manualRequisitionForm.value.manualRequisitionCart[index].itemCategory;
        let ItemGroupId: number = this.manualRequisitionForm.value.manualRequisitionCart[index].itemGroup;
        this.service.getManualRequisition().subscribe((res) => {
            if (res.isIdentityExist == true) {
                if (res.isSuccess == true) {
                    this.Items[index] = res.itemList.filter(x => x.inventoryDeptId == InventoryDeptId && x.itemCategoryId == ItemCategoryId && x.itemGroupId == ItemGroupId);
                }
                else {
                    this.toast.error(res.responseMsg);
                }
            }
            else {
                this.toast.error(res.responseMsg);
                setTimeout(() => {
                    this.router.navigate(["./login"]);
                }, 1000);
            }
        });
    }

    get manualRequisitionCart() {
        return this.manualRequisitionForm.get("manualRequisitionCart") as FormArray
    }

    addRow(){
        this.manualRequisitionCart.push(this.formBuilder.group({
            requisitionType: new FormControl('', Validators.required),
            itemCategory: new FormControl('', Validators.required),
            itemGroup: new FormControl('', Validators.required),
            items: new FormControl('', Validators.required),
            qty: new FormControl('', Validators.required),
        }))
    }

    removeRow(index : number){
        this.manualRequisitionCart.removeAt(index);
        this.ItemGroups.splice(index,1);
        this.Items.splice(index,1)
    }


    onSubmit(manualRequisitionForm: any) {
        if (manualRequisitionForm.invalid) {
            return;
        }
        else{
            this.getFormData(manualRequisitionForm);
            this.model.isHQInventoryDeptRequisition=true;
            this.service.addManualRequisition(this.model).subscribe((res)=>{
                if (res.isIdentityExist == true) {
                    if (res.isSuccess == true) {
                      this.closeModal();
                      if(this.model.requisitionId == 0){
                        this.toast.success(res.responseMsg);
                        setTimeout(()=>{
                            this.router.navigate(["./activities/requisitionsInCart","HQManualRequisition"]);
                        },1000);
                       

                      }
                    }
                    else {
                        this.toast.error(res.responseMsg);
                    }
                }
                else {
                    this.toast.error(res.responseMsg);
                     setTimeout(() => {
                     this.router.navigate(["./login"]);
                    }, 1000);
                }
                
            });
        }
    }

    getFormData(form: any) {
        this.model.inventoryDeptId = this.manualRequisitionForm.controls.invDept.value;
        this.model.item = [...this.manualRequisitionCart.value];
        this.model.requisitionId = this.manualRequisitionForm.controls.requisitionId.value;
        
      }

    closeModal() {
        this.manualRequisitionForm.reset();
        this.dialogRef.close();
    }
}
