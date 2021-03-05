import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ItemUnitMasterModel } from './Shared/ItemUnitMaster.model';
import { ItemUnitMasterService } from './Shared/ItemUnitMaster.service';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { ItemUnitMasterDialogComponent } from './app.ItemUnitMasterDialog.component';
@Component({
    templateUrl: './app.ItemUnitMasterList.component.html',
    providers: [ItemUnitMasterModel, ItemUnitMasterService]
})
export class ItemUnitMasterListComponent implements OnInit {
    constructor(public model: ItemUnitMasterModel, private service: ItemUnitMasterService, private toastr: ToastrService,
        private router: Router, private dialog: MatDialog, private dialogService: DialogService) {
    }
    searchKey: string;
    datasource: MatTableDataSource<any>
    displayedColumns = ['position', 'ItemUnitName', 'Description', 'addedOn', 'status', 'Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    ngOnInit() {
        this.loadGrid();
    }
    loadGrid() {
        this.service.getItemUnitMaster().subscribe((res) => {
            if (res.isIdentityExist == true) {
                if (res.isSuccess == true) {
                    this.datasource = new MatTableDataSource(res.ItemUnitMasterList);
                    this.datasource.paginator = this.paginator;
                    this.datasource.sort = this.sort;

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
            ItemUnitMasterList: this.model.ItemUnitMasterList,
            ItemUnitId: 0
        }
        this.dialog.open(ItemUnitMasterDialogComponent, dialogConfig)
            .afterClosed()
            .subscribe(() => this.loadGrid());
    }
    applyFilter() {
        this.datasource.filter = this.searchKey.trim().toLowerCase();
    }

    onEdit(model: ItemUnitMasterModel) {
        const config = new MatDialogConfig();
        config.disableClose = true;
        config.autoFocus = true;
        config.width = "50%";
        config.position = {
            top: "55px"
        }
        config.data = {
            ItemUnitId: model.ItemUnitId,
            ItemUnitName: model.ItemUnitName,
            Description: model.Description,
            isActive: model.isActive

        }

        this.dialog.open(ItemUnitMasterDialogComponent, config).afterClosed().subscribe(() => this.loadGrid());
    }

    onDelete(row: ItemUnitMasterModel) {
        this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
            if (data == true) {
                this.service.deleteItemUnitMaster(row.ItemUnitId).subscribe((res) => {
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