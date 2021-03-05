import { Component,OnInit,ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgForm } from '@angular/forms';
import{MatButton} from '@angular/material/button'
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { CompanyMasterModel } from './companyMaster.model';
import { CompanyMasterService } from './companyMaster.service';
import { CompanyMasterDialog } from './app.companyMaster.dialog';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';

@Component({
    templateUrl:'./app.component.companyMasterList.html',
    providers:[CompanyMasterModel,CompanyMasterService]
})

export class CompanyMasterListComponent implements OnInit{
    constructor(public model:CompanyMasterModel,private service:CompanyMasterService,private toastr: ToastrService,
        private router:Router,private dialog:MatDialog,private dialogService:DialogService){

    }
    tableList: any[];
    inventoryDepartmenttList: any[];
    dialogTabList: any[];
    searchKey:string;
    datasource:MatTableDataSource<any>
    displayedColumns=['position','companyName','inventoryDeptName','productStatus','maintenanceStatus','serviceStatus','addedOn','status','Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
   
    ngOnInit(){   
        this.loadDropdown();
        this.loadGrid();
        
        
    } 
    loadGrid(){
        this.service.getCompany().subscribe((res) => {
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.datasource=new MatTableDataSource(res.companyList);
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

    loadDropdown(){
        
        this.service.getInventoryDeptList().subscribe((res) => {
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.inventoryDepartmenttList = res.companyList;
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
            inventoryDeptList : this.inventoryDepartmenttList,
            isActive : true
        }
        this.dialog.open(CompanyMasterDialog,dialogConfig)
        .afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    applyFilter(){
        this.datasource.filter=this.searchKey.trim().toLowerCase();
    }
    onEdit(row:CompanyMasterModel){
        const config=new MatDialogConfig();
        config.disableClose=true;
        config.autoFocus=true;
        config.width="50%";
        config.position={
            top:"55px"
        }
        config.data={
            companyId: row.companyId,
            inventoryDeptSelectedId : row.inventoryDeptSelectedId,
            invntoryDeptId : row.invntoryDeptId,
            companyName:row.companyName,
            isMaintenance:row.isMaintenance,
            isService:row.isService,
            isProduct:row.isProduct,
            isActive:row.isActive,
            remarks:row.remarks,
            inventoryDeptList :this.inventoryDepartmenttList,
            
          
        }
        this.dialog.open(CompanyMasterDialog,config).afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    // onDelete(row:CompanyMasterModel){
    //     this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
    //         if(data==true){
    //     this.service.deleteDynamicMasterData(row.dynamicTableDetailId).subscribe((res) => {
    //         if(res.isIdentityExist==true){
    //             if(res.isSuccess==true){
    //                 this.toastr.success(res.responseMsg);
    //                 this.loadGrid();
    //             }
    //             else{
    //                 this.toastr.error(res.responseMsg);
    //             }
    //         }
    //         else{
    //             this.toastr.error(res.responseMsg);
    //             setTimeout(() => {
    //                 this.router.navigate(["./login"]);
    //             }, 1000);
    //         }
           
    //             });
    //         }
    //     });
    // }
}