import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { RequisitionToHQInventoryModel } from './Shared/requisition-to-hqinventory-model';
import { RequisitionToHQInventoryService } from './Shared/requisition-to-hqinventory.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-requisition-to-hqinventory-dept-dialog',
  templateUrl: './requisition-to-hqinventory-dept-dialog.component.html',
  providers: [RequisitionToHQInventoryModel, RequisitionToHQInventoryService]
})
export class RequisitionToHQInventoryDeptDialogComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['select', 'SlNo', 'reqNo', 'unit', 'itemName', 'reqQty' , 'apprByHQQty'];
  searchKey: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<any>(true, []);
  constructor(public dialogRef: MatDialogRef<RequisitionToHQInventoryDeptDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: RequisitionToHQInventoryModel,
    public model: RequisitionToHQInventoryModel, private service: RequisitionToHQInventoryService,
    private toastr: ToastrService, private router: Router) { }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  ngOnInit(): void {
    if (this.dialogData != null) {
      this.dataSource = new MatTableDataSource(this.dialogData.HQInventoryDeptRequisitionDetails);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.data.forEach(function (element) {
        element.approvedByHQInventory = element.approvedQty;
      });
    }
  }
  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }
  closeModal() {
    this.dialogRef.close();
  }
  confirmOrder() {
    if (this.selection.selected.length > 0) {
      for (const element of this.selection.selected) {
        if (element.approvedByHQInventory > element.approvedQty) {
          this.toastr.warning("Cannot approve more than the quantity approved by Unit Inventory");
          return;
        }
        else if (element.approvedByHQInventory < 1) {
          this.toastr.warning("Approved quantity should be at least 1");
          return;
        }
      }
      this.model.requisitionByDeptList = [...this.selection.selected];
      this.model.requisitionByDeptList.forEach(value => {
        value.isHQInventoryDeptRequisition = true;
        value.qty = value.approvedQty;
        value.approvedQty = value.approvedByHQInventory;
      });
    }
    else {
      this.toastr.warning('Please select the Requisitions to add to Cart');
      return;
    }
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
}
