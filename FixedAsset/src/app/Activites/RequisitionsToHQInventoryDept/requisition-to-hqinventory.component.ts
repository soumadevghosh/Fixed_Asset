import { Component, OnInit, ViewChild } from '@angular/core';
import { RequisitionToHQInventoryService } from './Shared/requisition-to-hqinventory.service';
import { RequisitionToHQInventoryModel } from './Shared/requisition-to-hqinventory-model';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/Shared/datepicker.format';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { FormBuilder } from '@angular/forms';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RequisitionToHQInventoryDeptDialogComponent } from './requisition-to-hqinventory-dept-dialog.component';
import {HQManualRequisitionDialogComponent} from './HQ-manual-requisition-dialog.component'
@Component({
  selector: 'app-requisition-to-hqinventory',
  templateUrl: './requisition-to-hqinventory.component.html',
  providers: [RequisitionToHQInventoryModel, RequisitionToHQInventoryService, DatePipe,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class RequisitionToHQInventoryComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['select', 'SlNo', 'reqNo', 'unit', 'date', 'qty', 'status'];
  searchKey: string;
  selection = new SelectionModel<any>(true, []);
  cartCount: number = 0;
  constructor(public model: RequisitionToHQInventoryModel, private service: RequisitionToHQInventoryService,
    private toastr: ToastrService, private router: Router, private formBuilder: FormBuilder, public datepipe: DatePipe,
    private dialog: MatDialog, private dialogService: DialogService) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterForm = this.formBuilder.group({
    unit: [],
    fromDate: [],
    toDate: []
  });
  get fromDate() { return this.datepipe.transform(this.filterForm.get('fromDate').value, 'dd-MM-yyyy'); }
  get toDate() { return this.datepipe.transform(this.filterForm.get('toDate').value, 'dd-MM-yyyy'); }
  get unit() { return this.filterForm.get('unit').value; }
  ngOnInit(): void {
    this.loadGrid();
    this.loadCheckoutItemsCount();
    this.filterForm.valueChanges.subscribe(value => {
      const filter = { ...value, fromDate: this.fromDate, toDate: this.toDate } as string;
      this.dataSource.filter = filter;
    });
  }
  addToCart() {
    if (this.selection.selected.length > 0) {
      this.selection.selected.forEach(value => {
        this.model.isHQInventoryDeptRequisition = true;
      });
      this.model.requisitionByDeptList = [...this.selection.selected];
    }
    else {
      this.toastr.warning('Please select the Requisitions to add to Cart');
      return;
    }
    this.service.getRequisitionsToHQInventoryDeptDetails(this.model).subscribe(response => {
      if (response.isIdentityExist) {
        if (response.isSuccess) {
          const config = new MatDialogConfig();
          config.disableClose = true;
          config.autoFocus = true;
          config.position = {
            top: "55px"
          }
          config.width = "80%";
          config.data = {
            HQInventoryDeptRequisitionDetails: [...response.requisitionByDeptList.filter(x => x.isManualRequisition == false)]
          }
          this.dialog.open(RequisitionToHQInventoryDeptDialogComponent, config)
            .afterClosed().subscribe(() => {
              this.loadGrid();
              this.loadCheckoutItemsCount();
              this.clearFilter();
              this.selection.clear();
            });
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
    })
  }
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
  // loadGrid() {
  //   this.service.getRequisitionsToHQInventoryDept().subscribe(response => {
  //     if (response.isIdentityExist) {
  //       if (response.isSuccess) {
  //         this.dataSource = new MatTableDataSource(response.requisitionByDeptList);
  //         this.dataSource.sort = this.sort;
  //         this.dataSource.paginator = this.paginator;
  //         this.model.units = response.units;
  //         if (this.dataSource != null) {
  //           this.dataSource.filterPredicate = ((data, filter) => {
  //             const a = !filter.unit || data.unitId === filter.unit;
  //             const b = !filter.toDate || data.forwardDate >= filter.fromDate && data.forwardDate <= filter.toDate;
  //             return a && b;
  //           }) as (any, string) => boolean;
  //         }
  //       }
  //       else {
  //         this.toastr.error(response.responseMsg);
  //       }
  //     }
  //     else {
  //       this.toastr.error(response.responseMsg);
  //       setTimeout(() => {
  //         this.router.navigate(["./login"]);
  //       }, 1000);
  //     }
  //   });
  // }
  loadGrid() {
    this.service.getRequisitionsToHQInventoryDept().subscribe(response => {
      if (response.isIdentityExist) {
        if (response.isSuccess) {
          this.dataSource = new MatTableDataSource(response.requisitionByDeptList);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.model.units = response.units;
          if (this.dataSource != null) {
            this.dataSource.filterPredicate = ((data, filter) => {
              const a = !filter.unit || data.unitId === filter.unit;
              const b = !filter.toDate || data.forwardDate >= filter.fromDate && data.forwardDate <= filter.toDate;
              return a && b;
            }) as (any, string) => boolean;
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

    this.service.getManualRequisition().subscribe(response => {
      if (response.isIdentityExist) {
        this.model.inventoryDeptId = response.inventoryDeptId;
        this.model.inventoryDeptList = response.inventoryDeptList;
        this.model.requisitionTypeList = response.requisitionTypeList;
        this.model.itemCategoryList = response.itemCategoryList;
      }
    });
  }
  clearFilter() {
    this.filterForm.reset();
  }
  loadCheckoutItemsCount() {
    this.service.getRequisitionFromCart().subscribe(response => {
      if (response.isIdentityExist == true) {
        if (response.isSuccess == true) {
          this.cartCount = response.requisitionByDeptList
            .filter(x => x.isManualRequisition == false && x.isHQInventoryDeptRequisition == true).length;
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
  checkout() {
    this.router.navigate(['activities/requisitionsInCart', 'HQInventory']);
  }

  // openDialog() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.width = "auto";
  //   dialogConfig.position = {
  //     top: "55px"
  //   }
  //   dialogConfig.data = {
  //     inventoryDeptList: this.model.inventoryDeptList,
  //     requisitionTypeList: this.model.requisitionTypeList,
  //     itemCategoryList: this.model.itemCategoryList,
  //     inventoryDeptId: this.model.inventoryDeptId,
  //     inventoryDeptName: this.model.inventoryDeptName,
  //     requisitionId: this.model.requisitionId = 0
  //   }
  //   this.dialog.open(HQManualRequisitionDialogComponent, dialogConfig)
  //     .afterClosed()
  //     .subscribe(() => this.loadGrid());
  // } 
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "auto";
    dialogConfig.position = {
      top: "55px"
    }
    dialogConfig.data = {
      inventoryDeptList: this.model.inventoryDeptList,
      requisitionTypeList: this.model.requisitionTypeList,
      itemCategoryList: this.model.itemCategoryList,
      inventoryDeptId: this.model.inventoryDeptId,
      inventoryDeptName: this.model.inventoryDeptName,
      requisitionId: this.model.requisitionId = 0
    }
    this.dialog.open(HQManualRequisitionDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => this.loadGrid());
  }
}
