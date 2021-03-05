import { Component,OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { InventoryDepartmentModel } from './Shared/InventoryDepartment.model';
import { InventoryDepartmentService } from './Shared/InventoryDepartment.service';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { InventoryDepartmentDialogComponent } from './app.component.InventoryDeptDialog';
@Component({
    templateUrl:'./app.component.InventoryDeptList.html',
    providers:[InventoryDepartmentModel,InventoryDepartmentService]
})
export class InventoryDepartmentListComponent implements OnInit{
    constructor(public model:InventoryDepartmentModel,private service:InventoryDepartmentService,private toastr: ToastrService,
        private router:Router,private dialog:MatDialog,private dialogService:DialogService){
    }
    searchKey:string;
    datasource:MatTableDataSource<any>
    displayedColumns=['position','InventoryDeptName','InventoryDeptShortName','addedOn','status','Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    ngOnInit(){
        this.loadGrid();
    }
    loadGrid(){
        this.service.getInventoryDepartment().subscribe((res) => {
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.datasource=new MatTableDataSource(res.InventoryDeptList);
                    this.datasource.paginator=this.paginator;
                    this.datasource.sort=this.sort;
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
            InventoryDeptId:0
        }
        this.dialog.open(InventoryDepartmentDialogComponent,dialogConfig)
        .afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    applyFilter(){
        this.datasource.filter=this.searchKey.trim().toLowerCase();
    }
    onEdit(model:InventoryDepartmentModel){
        const config=new MatDialogConfig();
        config.disableClose=true;
        config.autoFocus=true;
        config.width="50%";
        config.position={
            top:"55px"
        }
        config.data={
            InventoryDeptId:model.InventoryDeptId,
            InventoryDeptName:model.InventoryDeptName,
            InventoryDeptShortName:model.InventoryDeptShortName,
            isActive:model.isActive,
            remarks:model.remarks,
        }
        this.dialog.open(InventoryDepartmentDialogComponent,config).afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    onDelete(row:InventoryDepartmentModel){
        this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
            if(data==true){
        this.service.deleteInventoryDepartment(row.InventoryDeptId).subscribe((res) => {
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