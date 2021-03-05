import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RequisitionsToProcurementModel } from './Shared/requisitions-to-procurement-model';
import { RequisitionsToProcurementService } from './Shared/requisitions-to-procurement.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/Shared/datepicker.format';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { RequisitionsToProcurementDialogComponent } from './requisitions-to-procurement-dialog.component';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-requisitions-to-procurement',
  templateUrl: './requisitions-to-procurement.component.html',
  styleUrls: ['./requisitions-to-procurement.component.css'],
  providers: [RequisitionsToProcurementModel, RequisitionsToProcurementService, DatePipe,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class RequisitionsToProcurementComponent implements OnInit {
  expandedElement: RequisitionsToProcurementModel | null;
  detailSource: MatTableDataSource<any>;
  detailColumns = ['SlNo', 'reqNo', 'unit', 'itemName', 'reqQty', 'apprByHQQty', 'action'];
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['reqNo', 'unit', 'invDept', 'date', 'qty', 'status'];
  selection = new SelectionModel<any>(true, []);
  filterForm = this.formBuilder.group({
    invDept: [],
    fromDate: [],
    toDate: []
  });
  cartCount: number = 0;
  get fromDate() { return this.datepipe.transform(this.filterForm.get('fromDate').value, 'dd-MM-yyyy'); }
  get toDate() { return this.datepipe.transform(this.filterForm.get('toDate').value, 'dd-MM-yyyy'); }
  get invDept() { return this.filterForm.get('invDept').value; }
  constructor(public model: RequisitionsToProcurementModel, private service: RequisitionsToProcurementService,
    private toastr: ToastrService, private router: Router, private formBuilder: FormBuilder, public datepipe: DatePipe,
    private dialog: MatDialog, private dialogService: DialogService) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.loadGrid();
    this.filterForm.valueChanges.subscribe(value => {
      const filter = { ...value, fromDate: this.fromDate, toDate: this.toDate } as string;
      this.dataSource.filter = filter;
    });
  }
  loadGrid() {
    this.service.getRequisitionsToProcurementDept().subscribe(response => {
      if (response.isIdentityExist) {
        if (response.isSuccess) {
          this.dataSource = new MatTableDataSource(response.requisitionByDeptList);
          this.model.isHQ = response.isHQ;
          if (this.dataSource != null) {
            this.dataSource.filterPredicate = ((data, filter) => {
              const a = !filter.invDept || data.inventoryDeptId === filter.invDept;
              const b = !filter.toDate || data.forwardDate >= filter.fromDate && data.forwardDate <= filter.toDate;
              return a && b;
            }) as (any, string) => boolean;
          }
          this.model.inventoryDeptList = response.inventoryDeptList;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
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
    this.loadCheckoutItemsCount();
  }
  onRowClick(element: RequisitionsToProcurementModel | null) {
    if (this.expandedElement == null || this.expandedElement != element) {
      this.service.getRequisitionsToProcurementDeptDetails(element.hqProcurementDepartmentRequisitionId > 0 ? element.hqProcurementDepartmentRequisitionId : element.InventoryDepartmentRequisitionId)
        .subscribe(response => {
          if (response.isIdentityExist) {
            if (response.isSuccess) {
              this.detailSource = new MatTableDataSource(response.requisitionByDeptList.filter(x => x.isManualRequisition == false));
              this.detailSource.sort = this.sort;
              this.detailSource.data.forEach(function (element) {
                element.approvedByHQInventory = element.approvedQty;
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
    this.expandedElement = this.expandedElement === element ? null : element
  }
  order(row: RequisitionsToProcurementModel) {
    this.service.getItemWiseVendorDetail(row.itemId).subscribe(response => {
      if (response.isIdentityExist) {
        if (response.isSuccess) {
          const config = new MatDialogConfig();
          config.disableClose = true;
          config.autoFocus = true;
          config.position = {
            top: "55px"
          }
          config.width = "85%";
          config.data = {
            isHQ: this.model.isHQ,
            itemUnitList: response.itemUnitList,
            unitId: row.unitId,
            functionalDeptId: row.functionalDeptId,
            requisitionId: row.requisitionId,
            requisitionNo: row.requisitionNo,
            inventoryDeptId: row.inventoryDeptId,
            itemId: row.itemId,
            itemName: response.itemList[0].itemName,
            itemUnit: response.itemList[0].itemUnitId,
            gst: response.itemList[0].gstPercentage,
            qty: row.approvedQty,
            approvedQty: row.approvedByHQInventory,
            vendorItemMapping: response.requisitionByDeptList
          }
          this.dialog.open(RequisitionsToProcurementDialogComponent, config)
            .afterClosed().subscribe(() => {
              this.loadGrid();
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
  checkout() {
    if (this.model.isHQ)
      this.router.navigate(['activities/requisitionsInCart', 'HQProcurement']);
    else
      this.router.navigate(['activities/requisitionsInCart', 'Procurement']);
  }
  loadCheckoutItemsCount() {
    this.service.getProcurementCartItems().subscribe(response => {
      if (response.isIdentityExist == true) {
        if (response.isSuccess == true) {
          if (this.model.isHQ)
            this.cartCount = response.requisitionByDeptList
              .filter(x => x.isManualRequisition == false && x.isHqProcurementDepartmentRequisition == true).length;
          else
            this.cartCount = response.requisitionByDeptList
              .filter(x => x.isManualRequisition == false && x.isProcurementDepartmentRequisition == true).length;
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
  clearFilter() {
    this.filterForm.reset();
  }
}
