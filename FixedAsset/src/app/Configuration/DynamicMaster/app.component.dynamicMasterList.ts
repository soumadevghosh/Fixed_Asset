import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgForm } from '@angular/forms';
import { MatButton } from '@angular/material/button'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DynamicMasterModel } from './dynamicMaster.model';
import { DynamicMasterService } from './dynamicMaster.service';
import { DynamicMasterDialog } from './app.dynamicMaster.dialog';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';

@Component({
    templateUrl: './app.component.dynamicMasterList.html',
    providers: [DynamicMasterModel, DynamicMasterService]
})

export class DynamicMasterListComponent implements OnInit {
    constructor(public model: DynamicMasterModel, private service: DynamicMasterService, private toastr: ToastrService,
        private router: Router, private dialog: MatDialog, private dialogService: DialogService) {

    }
    tableList: any[];
    dialogTableList: any[];
    dialogTabList: any[];
    searchKey: string;
    datasource: MatTableDataSource<any>
    displayedColumns = ['tableName', 'name', 'shortName', 'description', 'addedOn', 'status', 'Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    ngOnInit() {
        this.loadDropdown();
        this.loadGrid();


    }
    loadGrid() {
        this.service.getdynmicMasterList().subscribe((res) => {
            if (res.isIdentityExist == true) {
                if (res.isSuccess == true) {
                    this.datasource = new MatTableDataSource(res.dynamicMasterList);
                    this.datasource.paginator = this.paginator;
                    this.datasource.sort = this.sort;
                    this.model.TableNameList = this.tableList;
                    this.model.TableList = this.tableList;
                    // this.model.isSync=res[0].isSync;
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

    ReloadGrid() {
        this.loadGrid();
    }

    loadDropdown() {

        this.service.getTableEntityList().subscribe((res) => {
            if (res.isIdentityExist == true) {
                if (res.isSuccess == true) {

                    this.dialogTableList = res.dynamicMasterList.slice(1);
                    // dialogTableList.shift();
                    this.tableList = res.dynamicMasterList;

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

    getFormData(form: NgForm) {
        this.model.tableName = form.value.srcDynTabName;

    }
    onSubmit(form: NgForm) {

        if (form.invalid) {
            return
        }
        this.getFormData(form);
        if (form.value.tableName != null) {

            this.service.searchDynamicMasterData(form.value.tableName).subscribe((res: any) => {

                if (res.isIdentityExist == true) {
                    if (res.isSuccess == true) {
                        this.datasource = new MatTableDataSource(res);
                        this.datasource.paginator = this.paginator;
                        this.datasource.sort = this.sort;
                        this.model.TableNameList = this.dialogTableList;
                        this.model.TableList = this.tableList;
                        // this.model.isSync=res[0].isSync;
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
    }

    openTableDialog() {

        const dialogTblConfig = new MatDialogConfig();
        dialogTblConfig.disableClose = true;
        dialogTblConfig.autoFocus = true;
        dialogTblConfig.width = "50%";
        dialogTblConfig.position = {
            top: "55px"
        }
        dialogTblConfig.data = {
            TableList: this.dialogTableList,
            isShowDivTableName: true,
            isShowDivTableProperty: false
        }
        this.dialog.open(DynamicMasterDialog, dialogTblConfig)
            .afterClosed()
            .subscribe(() => this.loadGrid());
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
            TableList: this.dialogTableList,
            isShowDivTableName: false,
            isShowDivTableProperty: true
        }
        this.dialog.open(DynamicMasterDialog, dialogConfig)
            .afterClosed()
            .subscribe(() => this.loadGrid());
    }
    applyFilter() {
        this.datasource.filter = this.searchKey.trim().toLowerCase();
    }
    onEdit(row: DynamicMasterModel) {
        const config = new MatDialogConfig();
        config.disableClose = true;
        config.autoFocus = true;
        config.width = "50%";
        config.position = {
            top: "55px"
        }
        config.data = {
            dynamicTableDetailId: row.dynamicTableDetailId,
            dynamicTableId: row.dynamicTableId,
            tableName: row.tableName,
            name: row.name,
            shortName: row.shortName,
            description: row.description,
            isActive: row.isActive,
            remarks: row.remarks,
            TableList: this.dialogTableList,
            isShowDivTableName: false,
            isShowDivTableProperty: true

        }
        this.dialog.open(DynamicMasterDialog, config).afterClosed()
            .subscribe(() => this.loadGrid());
    }
    onDelete(row: DynamicMasterModel) {
        this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
            if (data == true) {
                this.service.deleteDynamicMasterData(row.dynamicTableDetailId).subscribe((res) => {
                    if (res.isIdentityExist == true) {
                        if (res.isSuccess == true) {
                            this.toastr.success(res.responseMsg);
                            this.loadGrid();
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
        });
    }
}