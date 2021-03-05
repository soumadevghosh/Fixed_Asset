import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { RequisitionsToProcurementModel } from './Shared/requisitions-to-procurement-model';
import { RequisitionsToProcurementService } from './Shared/requisitions-to-procurement.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-requisitions-to-procurement-dialog',
  templateUrl: './requisitions-to-procurement-dialog.component.html',
  styleUrls: ['./requisitions-to-procurement.component.css'],
  providers: [RequisitionsToProcurementModel, RequisitionsToProcurementService]
})
export class RequisitionsToProcurementDialogComponent implements OnInit {
  requisitionByDeptList: any[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['SlNo', 'vendorName', 'vendorAddress', 'unitPrice', 'minOrderQty', 'cgst', 'sgst', 'action'];
  searchKey: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<any>(true, []);
  itemDetailForm = this.formBuilder.group({
    item: [],
    itemUnit: [],
    gst: [],
    reqQty: [],
    apprQty: [],
  });
  constructor(public dialogRef: MatDialogRef<RequisitionsToProcurementDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: RequisitionsToProcurementModel,
    public model: RequisitionsToProcurementModel, private service: RequisitionsToProcurementService,
    private toastr: ToastrService, private router: Router, private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    if (this.dialogData != null) {
      this.dataSource = new MatTableDataSource(this.dialogData.vendorItemMapping);
      this.dataSource.data.forEach(value => {
        value.unitId = this.dialogData.unitId;
        value.functionalDeptId = this.dialogData.functionalDeptId;
        value.requisitionId = this.dialogData.requisitionId;
        value.requisitionNo = this.dialogData.requisitionNo;
        value.inventoryDeptId = this.dialogData.inventoryDeptId;
        value.qty = this.dialogData.qty;
        value.approvedQty = this.dialogData.approvedQty;
        value.gstPercentage = value.cgst + value.sgst;
        value.gstPerUnit = (value.unitPrice * value.gstPercentage) / 100;
        value.discountPercentage = 0;       //feature to be added
        value.discountPerUnit = value.discountPercentage == 0 ? 0 : (value.unitPrice * value.discountPercentage) / 100;
        if (this.dialogData.isHQ) {
          value.isProcurementDepartmentRequisition = false;
          value.isHqProcurementDepartmentRequisition = true;
        }
        else {
          value.isProcurementDepartmentRequisition = true;
          value.isHqProcurementDepartmentRequisition = false;
        }
        value.itemId = this.dialogData.itemId;
      })
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.model.itemUnitList = this.dialogData.itemUnitList;
      this.itemDetailForm.setValue({
        item: [this.dialogData.itemName],
        itemUnit: [this.dialogData.itemUnit],
        gst: [this.dialogData.gst],
        reqQty: [this.dialogData.qty],
        apprQty: [this.dialogData.approvedQty]
      });
      this.itemDetailForm.controls.itemUnit.setValue(this.dialogData.itemUnit);
      this.itemDetailForm.disable();
    }
  }
  order(row: RequisitionsToProcurementModel) {
    this.requisitionByDeptList.push(row);
    this.model.requisitionByDeptList = this.requisitionByDeptList;
    this.service.addTocart(this.model).subscribe(response => {
      if (response.isIdentityExist == true) {
        if (response.isSuccess == true) {
          this.toastr.success(response.responseMsg);
          this.selection.clear();
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
  closeModal() {
    this.dialogRef.close();
  }
}
