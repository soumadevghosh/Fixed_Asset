import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RequisitionModel } from './Shared/Requisition.model';
import { RequisitionService } from './Shared/Requisition.service';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { RequisitionDialogComponent } from './app.RequisitionDialog.component';
@Component({
    templateUrl: './app.RequisitionList.component.html',
    providers: [RequisitionModel, RequisitionService]
})
export class RequisitionListComponent implements OnInit {
    constructor(public model: RequisitionModel, private service: RequisitionService, private toastr: ToastrService,
        private router: Router, private dialog: MatDialog, private dialogService: DialogService) {
    }
    searchKey: string;
    datasource: MatTableDataSource<any>
    // displayedColumns = ['position', 'RequisitionName', 'RequisitionMadeByName', 'RequisitionDate', 'BranchName', 'RequisitionStatus', 'FunctionalDeptName', 'TypeOfRequIdName', 'InventoryDeptName', 'ItemCategoryName', 'ItemName', 'Quantity', 'UnitPrice', 'Gst', 'OtherExpences', 'TotalBudget', 'addedOn', 'status', 'Action'];
    displayedColumns = ['position', 'RequisitionNo','RequisitionDate', 'InventoryDeptName','ItemName','RequisitionStatus', 'Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    ngOnInit() {
        this.loadGrid();
    }
    loadGrid() {
        this.service.getRequisition().subscribe((res) => {
            if (res.isIdentityExist == true) {
                if (res.isSuccess == true) {
                    this.datasource = new MatTableDataSource(res.RequisitionList);
                    this.datasource.paginator = this.paginator;
                    this.datasource.sort = this.sort;
                    this.model.RequisitionNo=res.RequisitionNo;
                    this.model.RequisitionDate=res.RequisitionDate;
                    this.model.InventoryDepartmentList = res.InventoryDepartmentList;
                    this.model.RequisitionStatus=res.RequisitionStatus;
                    this.model.RequisitionStatusID=res.RequisitionStatusID;
                    this.model.Quantity=res.Quantity;
                    this.model.RequisitionTypeList = res.RequisitionTypeList;
                   // this.model.UnitList = res.UnitList;
                   // this.model.FunctionalDeptList = res.FunctionalDeptList;
                    // this.model.FunctionalDeptList=res.FunctionalDeptList;
                    //this.model.TypeOfRequList=res.TypeOfRequList;
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
    openDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "50%";
        dialogConfig.position = {
            top: "55px"
        }
        dialogConfig.data = {
            InventoryDepartmentList: this.model.InventoryDepartmentList,
            // UnitList: this.model.UnitList,
            // FunctionalDeptList: this.model.FunctionalDeptList,
            RequisitionTypeList: this.model.RequisitionTypeList,
            RequisitionId: 0
        }
        this.dialog.open(RequisitionDialogComponent, dialogConfig)
            .afterClosed()
            .subscribe(() => this.loadGrid());
    }
    applyFilter() {
        this.datasource.filter = this.searchKey.trim().toLowerCase();
    }
    onEdit(model: RequisitionModel) {
        const config = new MatDialogConfig();
        config.disableClose = true;
        config.autoFocus = true;
        config.width = "50%";
        config.position = {
            top: "55px"
        }
        config.data = {
            RequisitionNo: model.RequisitionNo,
            RequisitionId: model.RequisitionId,
            RequisitionStatus: model.RequisitionStatus,
            RequisitionStatusID:model.RequisitionStatusID,
            InventoryDepartmentList: this.model.InventoryDepartmentList,
            InventoryDeptId: model.InventoryDeptId,
            ItemCategoryId: model.ItemCategoryId,
            ItemGroupId: model.ItemGroupId,
            itemId: model.itemId,
            RequisitionTypeList: this.model.RequisitionTypeList,
            RequisitionTypeId: model.RequisitionTypeId,
            Quantity: model.Quantity,
            // TypeOfRequId:this.model.TypeOfRequId,
            // RequistionTypeName:this.model.RequistionTypeName,
             // TypeOfRequList:this.model.TypeOfRequList,
            // UnitList: this.model.UnitList,
            // unitId: model.unitId,
            // FunctionalDeptList: this.model.FunctionalDeptList,
            // depertmentId: model.departmentId,
            // UnitPrice: model.UnitPrice,
            // GST: model.GST,
            // OtherExpences: model.OtherExpences,
            // TotalBudget: model.TotalBudget,

            // isActive: model.isActive,

        }

        this.dialog.open(RequisitionDialogComponent, config).afterClosed()
            .subscribe(() => this.loadGrid());
    }
    // onDelete(row: RequisitionModel) {

    //     this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
    //         if (data == true) {

    //             this.service.deleteRequisition(row.RequisitionId).subscribe((res) => {
    //                 if (res.isIdentityExist == true) {
    //                     if (res.isSuccess == true) {
    //                         this.toastr.success(res.responseMsg);
    //                         this.loadGrid();
    //                     }
    //                     else {
    //                         this.toastr.error(res.responseMsg);
    //                     }
    //                 }
    //                 else {
    //                     this.toastr.error(res.responseMsg);
    //                     setTimeout(() => {
    //                         this.router.navigate(["./login"]);
    //                     }, 1000);
    //                 }

    //             });
    //         }
    //     });
    // }
}