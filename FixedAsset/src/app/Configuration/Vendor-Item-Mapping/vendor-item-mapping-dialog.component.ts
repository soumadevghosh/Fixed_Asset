import { Component, OnInit, Inject } from '@angular/core';
import { VendorItemMappingModel } from './Shared/vendor-item-mapping-model';
import { VendorItemMappingService } from './Shared/vendor-item-mapping.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from 'src/app/Layout/Shared/loader.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-vendor-item-mapping-dialog',
  templateUrl: './vendor-item-mapping-dialog.component.html',
  providers: [VendorItemMappingModel, VendorItemMappingService]
})
export class VendorItemMappingDialogComponent implements OnInit {

  constructor(private service: VendorItemMappingService, public model: VendorItemMappingModel, private toastr: ToastrService,
    public dialogRef: MatDialogRef<VendorItemMappingDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: VendorItemMappingModel,
    public loader: LoaderService, private router: Router, private formBuilder: FormBuilder) { }
  title: string;
  ItemCategories: any[] = [];
  ItemGroups: any[] = [];
  Items: any[] = [];
  vendorItemMappingForm: FormGroup;
  ngOnInit(): void {
    if (this.dialogData != null) {
      this.model.vendorList = this.dialogData.vendorList;
      this.model.inventoryDepartmentList = this.dialogData.inventoryDepartmentList;
      this.vendorItemMappingForm = this.formBuilder.group({
        vendorItemMappingId: [null],
        vendorName: [null, Validators.required],
        itemMapping: this.formBuilder.array([]),
        isActive: [true],
        remarks: ['']
      })
      if (this.dialogData.vendorItemMappingId == 0) {
        this.title = 'Add Vendor Item Mapping';
        this.addNewMapping();

      }
      else {
        this.title = 'Edit Vendor Item Mapping';
        this.setFormData(this.dialogData);
      }
    }
  }
  setFormData(dialogData: any) {
    this.vendorItemMappingForm.patchValue({
      vendorItemMappingId: dialogData.vendorItemMappingId,
      vendorName: dialogData.vendorId,
      isActive: dialogData.isActive,
      remarks: dialogData.remarks
    });
    if (this.dialogData.items != null) {
      this.dialogData.items.forEach((value, index) => {
        this.bindItemCategory(index, value.invDept);
        this.bindItemGroup(index, value.invDept, value.itemCategory);
        this.bindItems(index, value.invDept, value.itemCategory, value.itemGroup);
        this.itemMapping.push(this.formBuilder.group({
          invDept: [value.invDept],
          itemCategory: [value.itemCategory],
          itemGroup: [value.itemGroup],
          items: [value.items]
        }))
      });
      this.itemMapping.updateValueAndValidity();
    }
  }
  get itemMapping() {
    return this.vendorItemMappingForm.get('itemMapping') as FormArray;
  }
  onSubmit(vendorItemMappingForm: any) {
    if (vendorItemMappingForm.invalid) {
      return;
    }
    else {
      this.getFormData(vendorItemMappingForm);
      this.service.addVendorItemMapping(this.model).subscribe((response: any) => {
        if (response.isIdentityExist == true) {
          if (response.isSuccess == true) {
            this.closeModal();
            if(this.model.vendorItemMappingId == 0){
              this.toastr.success(response.responseMsg);
            }
            else{
              this.toastr.success("Updated successfully");
            }
            
          }
          else {
            this.toastr.error(response.responseMsg);
          }
        }
        else {
          this.toastr.error(response.responseMsg);
          setTimeout(() => {
            this.router.navigate(["./login"]);
          }, 1000);
        }
      });
    }
  }
  getFormData(form: any) {
    this.model.vendorItemMappingId = this.vendorItemMappingForm.controls.vendorItemMappingId.value;
    this.model.vendorId = this.vendorItemMappingForm.controls.vendorName.value;
    this.model.items = [...this.itemMapping.value];
    this.model.isActive = this.vendorItemMappingForm.controls.isActive.value;
    this.model.remarks = this.vendorItemMappingForm.controls.remarks.value;
  }
  bindItemCategory(index: number, invDept?: number) {
    let invDeptId: number = invDept != null ? invDept : this.itemMapping.controls[index].get('invDept').value;
    this.service.getItemCategoryByInventoryDeptId(invDeptId).subscribe((res: any) => {
      if (res.isIdentityExist == true) {
        if (res.isSuccess == true) {
          this.ItemCategories[index] = res.SelectedCategory;
          if (invDept == null) {
            this.itemMapping.controls[index].get('itemCategory').reset();
            this.itemMapping.controls[index].get('itemGroup').reset();
            this.itemMapping.controls[index].get('items').reset();
            this.ItemGroups[index] = null;
            this.Items[index] = null;
          }
        }
        else {
          this.toastr.error(res.responseMsg);
        }
      }
      else {
        this.toastr.error(res.responseMsg);
        setTimeout(() => {
          this.router.navigate(["./login"]);
        }, 1000);
      }
    });
  }
  bindItemGroup(index: number, invDepartment?: number, itemCategoory?: number) {
    this.service.getItemGroup().subscribe((res: any) => {
      if (res.isIdentityExist == true) {
        if (res.isSuccess == true) {
          let invDept: number = invDepartment == null ? this.itemMapping.controls[index].get('invDept').value : invDepartment;
          let itemCategory: number = itemCategoory == null ? this.itemMapping.controls[index].get('itemCategory').value : itemCategoory;
          this.ItemGroups[index] = res.ItemGroupList
            .filter(p => p.ItemCategoryId == itemCategory && p.InventoryDeptId == invDept);
          if (itemCategoory == null && invDepartment == null) {
            this.itemMapping.controls[index].get('itemGroup').reset();
            this.itemMapping.controls[index].get('items').reset();
            this.Items[index] = null;
          }
        }
        else {
          this.toastr.error(res.responseMsg);
        }
      }
      else {
        this.toastr.error(res.responseMsg);
        setTimeout(() => {
          this.router.navigate(["./login"]);
        }, 1000);
      }
    });
  }
  bindItems(index: number, invDepartment?: number, itemCategoory?: number, itemGroupId?: number) {
    this.service.getItem().subscribe((res: any) => {
      if (res.isIdentityExist == true) {
        if (res.isSuccess == true) {
          let invDept: number = invDepartment == null ? this.itemMapping.controls[index].get('invDept').value : invDepartment;
          let itemCategory: number = itemCategoory == null ? this.itemMapping.controls[index].get('itemCategory').value : itemCategoory;
          let itemGroup: number = itemGroupId == null ? this.itemMapping.controls[index].get('itemGroup').value : itemGroupId;
          this.Items[index] = res.itemList
            .filter(p => p.itemCategoryId == itemCategory && p.inventoryDeptId == invDept && p.itemGroupId == itemGroup && p.isActive == true);
          if (itemCategoory == null && invDepartment == null && itemGroupId == null) {
            this.itemMapping.controls[index].get('items').reset();
          }
        }
        else {
          this.toastr.error(res.responseMsg);
        }
      }
      else {
        this.toastr.error(res.responseMsg);
        setTimeout(() => {
          this.router.navigate(["./login"]);
        }, 1000);
      }
    });
  }
  addNewMapping() {
    this.itemMapping.push(this.formBuilder.group({
      invDept: [null, Validators.required],
      itemCategory: [null, Validators.required],
      itemGroup: [null, Validators.required],
      items: [null, Validators.required]
    }));
  }
  deleteMapping(index) {
    this.itemMapping.removeAt(index);
    this.ItemCategories.splice(index,1);
    this.ItemGroups.splice(index,1);
    this.Items.splice(index,1);
  }
  closeModal() {
    this.vendorItemMappingForm.reset();
    this.dialogRef.close();
  }
}
