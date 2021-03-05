import { Component,OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ItemGroupModel } from './Shared/ItemGroup.model';
import { ItemGroupService } from './Shared/ItemGroup.service';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { ItemGroupDialogComponent } from './app.itemgroupDialog.component';
@Component({
    templateUrl:'./app.itemgroupList.component.html',
    providers:[ItemGroupModel,ItemGroupService]
})
export class ItemGroupListComponent implements OnInit{
    constructor(public model:ItemGroupModel,private service:ItemGroupService,private toastr: ToastrService,
        private router:Router,private dialog:MatDialog,private dialogService:DialogService){
    }
    searchKey:string;
    datasource:MatTableDataSource<any>
    displayedColumns=['SlNo','ItemGroupName','ItemCategoryName','InventoryDeptName','strMaintenanceSchedule','strCalibrationSchedule','addedOn','status','Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    ngOnInit(){
        this.loadGrid();
    }
    loadGrid(){
        this.service.getItemGroup().subscribe((res) => {
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.datasource=new MatTableDataSource(res.ItemGroupList);
                    this.datasource.paginator=this.paginator;
                    this.datasource.sort=this.sort;

                    //this.model.ItemCategoryList=res.ItemCategoryList;
                    this.model.InventoryDepartmentList=res.InventoryDepartmentList;
                }
                else{
                    this.toastr.error(res.responseMsg);
                }
            }
            else{
                this.toastr.error(res.responseMsg);
                setTimeout(() => {
                    this.router.navigate(["./login"]);
                }, 1000);
            }
           
        });
    }
    openDialog(){
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.autoFocus=true;
        dialogConfig.width="50%";
        dialogConfig.position={
            top:"55px"
        }
        dialogConfig.data={
            //ItemCategoryList:this.model.ItemCategoryList,
            InventoryDepartmentList:this.model.InventoryDepartmentList,
            ItemGroupId:0
        }
        this.dialog.open(ItemGroupDialogComponent,dialogConfig)
        .afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    applyFilter(){
        this.datasource.filter=this.searchKey.trim().toLowerCase();
    }
    onEdit(row:ItemGroupModel){
        const config=new MatDialogConfig();
        config.disableClose=true;
        config.autoFocus=true;
        config.width="50%";
        config.position={
            top:"55px"
        }
        config.data={
            //ItemCategoryList:this.model.ItemCategoryList,
            InventoryDepartmentList:this.model.InventoryDepartmentList,
            InventoryDeptId:row.InventoryDeptId,
            ItemCategoryId:row.ItemCategoryId,
            ItemGroupId:row.ItemGroupId,
            ItemGroupName:row.ItemGroupName,
            MaintenanceSchedule:row.MaintenanceSchedule,
            isActive:row.isActive,
            remarks:row.remarks,
            CalibrationSchedule:row.CalibrationSchedule
        }
        this.dialog.open(ItemGroupDialogComponent,config).afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    onDelete(row:ItemGroupModel){
        this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
            if(data==true){
        this.service.deleteItemGroup(row.ItemGroupId).subscribe((res) => {
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.toastr.success(res.responseMsg);
                    this.loadGrid();
                }
                else{
                    this.toastr.error(res.responseMsg);
                }
            }
            else{
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