import { Component,OnInit,ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { UnitModel } from './unit.model';
import { UnitService } from './unit.service';
import { UnitDialog } from './app.unit.dialog';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';

@Component({
    templateUrl:'./app.unit.html',
    providers:[UnitModel,UnitService]
})

export class UnitComponent implements OnInit{
    constructor(public model:UnitModel,private service:UnitService,private toastr: ToastrService,
        private router:Router,private dialog:MatDialog,private dialogService:DialogService){

    }
    unitHeadList: any[];
    searchKey:string;
    datasource:MatTableDataSource<any>
    displayedColumns=['position','unitName','unitAddress','unitHead','addedOn','status','Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
   
    ngOnInit(){   
        
        this.loadGrid();
        this.loadDropdown();
    } 
    loadGrid(){
        this.service.getUnit().subscribe((res) => {
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.datasource=new MatTableDataSource(res.unitList);
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
    
    loadDropdown(){
        
        this.service.getUnitHead().subscribe((res) => {
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.unitHeadList = res.unitList;
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
            EmployeeList : this.unitHeadList,
        }
        this.dialog.open(UnitDialog,dialogConfig)
        .afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    applyFilter(){
        this.datasource.filter=this.searchKey.trim().toLowerCase();
    }
    onEdit(row:UnitModel){
        const config=new MatDialogConfig();
        config.disableClose=true;
        config.autoFocus=true;
        config.width="50%";
        config.position={
            top:"55px"
        }
        config.data={
            unitId: row.unitId,
            EmployeeId : row.EmployeeId,
            EmpId : row.EmployeeId,
            unitName:row.unitName,
            unitAddress:row.unitAddress,
            isActive:row.isActive,
            remarks:row.remarks,
            EmployeeList : this.unitHeadList
        }
        this.dialog.open(UnitDialog,config).afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    onDelete(row:UnitModel){
        this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
            if(data==true){
        this.service.deleteUnitById(row.unitId).subscribe((res) => {
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