import { Component, OnInit, ViewChild } from '@angular/core';
import { DepartmentalRequisitionsModel } from './Shared/departmental-requisitions.model';
import { DepartmentalRequisitionsService } from './Shared/departmental-requisitions.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/Shared/datepicker.format';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { ManualRequisitionDialogComponent } from './manual-requisition-dialog.component';
import { timer, Observable } from 'rxjs';

@Component({
  selector: 'app-departmental-requisitions',
  templateUrl: './departmental-requisitions.component.html',
  providers: [DepartmentalRequisitionsModel, DepartmentalRequisitionsService, DatePipe,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class DepartmentalRequisitionsComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['select', 'SlNo', 'reqId', 'reqNo', 'functionalDept', 'itemName', 'date', 'status', 'reqQty', 'apprQty'];
  selection = new SelectionModel<any>(true, []);
  approvedQty;
  cartCount: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterForm = this.formBuilder.group({
    functionalDept: [],
    item: [],
    fromDate: [],
    toDate: []
  });
  get fromDate() { return this.datepipe.transform(this.filterForm.get('fromDate').value, 'dd-MM-yyyy'); }
  get toDate() { return this.datepipe.transform(this.filterForm.get('toDate').value, 'dd-MM-yyyy'); }
  get functionalDept() { return this.filterForm.get('functionalDept').value; }
  get item() { return this.filterForm.get('item').value; }

  constructor(public model: DepartmentalRequisitionsModel, private service: DepartmentalRequisitionsService, private toastr: ToastrService,
    private router: Router, private formBuilder: FormBuilder, public datepipe: DatePipe, private dialog: MatDialog, private dialogService: DialogService,) {
  }

  ngOnInit(): void {
    this.loadGrid();
    this.loadCheckoutItemsCount();
    this.filterForm.valueChanges.subscribe(value => {
      const filter = { ...value, fromDate: this.fromDate, toDate: this.toDate } as string;
      this.dataSource.filter = filter;
    });
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
  addToCart() {
    if (this.selection.selected.length > 0) {
      for (const element of this.selection.selected) {
        if (element.approvedQty > element.qty) {
          this.toastr.warning("Cannot approve more than the requsition quantity");
          return;
        }
        else if (element.approvedQty < 1) {
          this.toastr.warning("Approved quantity should be at least 1");
          return;
        }
      }
      this.selection.selected.forEach(value => {
        value.isHQInventoryDeptRequisition = false;
      });
      this.model.requisitionByDeptList = [...this.selection.selected];
    }
    else {
      this.toastr.warning('Please select the Requisitions to add to Cart');
      return;
    }
    this.service.addTocart(this.model).subscribe(response => {
      if (response.isIdentityExist == true) {
        if (response.isSuccess == true) {
          this.toastr.success(response.responseMsg);
          this.clearFilter();
          this.selection.clear();
          this.loadCheckoutItemsCount();
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
  loadGrid() {
    this.service.getRequisitionByDept().subscribe(response => {
      if (response.isIdentityExist) {
        if (response.isSuccess) {
          this.dataSource = new MatTableDataSource(response.requisitionByDeptList);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.model.itemList = response.itemList;
          this.model.functionalDeptList = response.functionalDeptList;
          if (this.dataSource != null) {
            this.dataSource.filterPredicate = ((data, filter) => {

              const a = !filter.functionalDept || data.functionalDeptId === filter.functionalDept;
              const b = !filter.item || data.itemId === filter.item;
              const c = !filter.toDate || data.requisitionDate >= filter.fromDate && data.requisitionDate <= filter.toDate;
              return a && b && c;
            }) as (any, string) => boolean;
          }
          this.dataSource.data.forEach(function (element) {
            element.approvedQty = element.qty;
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
  loadCheckoutItemsCount() {
    this.service.getRequisitionFromCart().subscribe(response => {
      if (response.isIdentityExist == true) {
        if (response.isSuccess == true) {
          this.cartCount = response.requisitionByDeptList.filter(x => x.isManualRequisition == false && x.isHQInventoryDeptRequisition == false).length;
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
  openDialog() {
    // this.service.getManualRequisition().subscribe(response => {
    //   if (response.isIdentityExist) {
    //     this.model.inventoryDeptId = response.inventoryDeptId;
    //     this.model.inventoryDeptList = response.inventoryDeptList;
    //     this.model.requisitionTypeList = response.requisitionTypeList;
    //     this.model.itemCategoryList = response.itemCategoryList;
    //   }
    // });
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
    this.dialog.open(ManualRequisitionDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => this.loadGrid());
  }
  clearFilter() {
    this.filterForm.reset();
  }
  checkout() {
    this.router.navigate(['activities/requisitionsInCart']);
  }
}
