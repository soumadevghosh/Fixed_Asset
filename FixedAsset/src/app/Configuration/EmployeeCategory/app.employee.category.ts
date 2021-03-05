import { Component,OnInit,ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { EmployeeCategoryModel } from './employee.category.model';
import { EmployeeCategoryService } from './employee.category.service';
import { EmployeeCategoryDialog } from './app.employee.category.dialog';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
@Component({
    templateUrl:'./app.employee.category.html',
    providers:[EmployeeCategoryModel,EmployeeCategoryService]
})
export class EmployeeCategoryComponent implements OnInit{
    constructor(public model:EmployeeCategoryModel,private service:EmployeeCategoryService,private toastr: ToastrService,
        private router:Router,private dialog:MatDialog,private dialogService:DialogService){

    }
    searchKey:string;
    datasource:MatTableDataSource<any>
    displayedColumns=['position','employeeCategory','shortName','addedOn','status','Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
   
    ngOnInit(){   
        this.loadGrid();
    } 
    loadGrid(){
        this.service.getEmployeeCategory().subscribe((res) => {
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.datasource=new MatTableDataSource(res.employeeCategoryList);
                    this.datasource.paginator=this.paginator;
                    this.datasource.sort=this.sort;
                    this.model.isSync=res.isSync;
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
        this.dialog.open(EmployeeCategoryDialog,dialogConfig)
        .afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    applyFilter(){
        this.datasource.filter=this.searchKey.trim().toLowerCase();
    }
    onEdit(row:EmployeeCategoryModel){
        const config=new MatDialogConfig();
        config.disableClose=true;
        config.autoFocus=true;
        config.width="50%";
        config.position={
            top:"55px"
        }
        config.data={
            employeeCategoryId: row.employeeCategoryId,
            employeeCategory:row.employeeCategory,
            shortName:row.shortName,
            isActive:row.isActive,
            remarks:row.remarks,

        }
        this.dialog.open(EmployeeCategoryDialog,config).afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    onDelete(row:EmployeeCategoryModel){
        this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
            if(data==true){
        this.service.deleteEmployeeCategoryById(row.employeeCategoryId).subscribe((res) => {
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