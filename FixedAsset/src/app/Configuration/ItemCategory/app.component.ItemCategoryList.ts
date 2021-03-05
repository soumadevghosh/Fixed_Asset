import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ItemCategoryModel } from './Shared/ItemCategory.model';
import { ItemCategoryService } from './Shared/ItemCategory.service';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { ItemCategoryDialogComponent } from './app.component.ItemCategoryDialog';
@Component({
    templateUrl: './app.component.ItemCategoryList.html',
    providers: [ItemCategoryModel, ItemCategoryService]
})
export class ItemCategoryListComponent implements OnInit {
    constructor(public model: ItemCategoryModel, private service: ItemCategoryService, private toastr: ToastrService,
        private router: Router, private dialog: MatDialog, private dialogService: DialogService) {
    }
    searchKey: string;
    datasource: MatTableDataSource<any>
    displayedColumns = ['position', 'Itemcategory', 'InventoryDepartments', 'addedOn', 'status', 'Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    ngOnInit() {
        this.loadGrid();
    }
    loadGrid() {
        this.service.getItemCategory().subscribe((res) => {
            this.model.InventoryDeptList = res.InventoryDeptList;
            if (res.isIdentityExist == true) {
                if (res.isSuccess == true) {
                    this.datasource = new MatTableDataSource(res.ItemCategorylist);
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
            InventoryDeptList: this.model.InventoryDeptList,
            ItemCategoryId: 0
        }
        this.dialog.open(ItemCategoryDialogComponent, dialogConfig)
            .afterClosed()
            .subscribe(() => this.loadGrid());
    }
    applyFilter() {
        this.datasource.filter = this.searchKey.trim().toLowerCase();
    }
    onEdit(model: ItemCategoryModel) {
        const config = new MatDialogConfig();
        config.disableClose = true;
        config.autoFocus = true;
        config.width = "50%";
        config.position = {
            top: "55px"
        }
        config.data = {
            InventoryDeptList: this.model.InventoryDeptList,
            ItemCategoryId: model.ItemCategoryId,
            Itemcategory: model.Itemcategory,
            isActive: model.isActive,
            remarks: model.remarks,
        }
        this.dialog.open(ItemCategoryDialogComponent, config).afterClosed()
            .subscribe(() => this.loadGrid());
    }
    onDelete(row: ItemCategoryModel) {
        this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
            if (data == true) {
                this.service.deleteItemCategory(row.ItemCategoryId).subscribe((res) => {
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