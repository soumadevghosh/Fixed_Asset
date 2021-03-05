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
import { StatutoryMasterService } from './statutoryMaster.service';
import { StatutoryMasterDialog } from './app.component.statutoryMaster.dialog';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { StatutoryMasterModel } from './statutoryMaster.model';
var tableList: any[];
var vendorTypeList: any[];
var dialogTabList: any[];
@Component({
    templateUrl:'./app.component.statutoryMasterList.html',
    providers:[StatutoryMasterModel,StatutoryMasterService]
})

export class StatutoryMasterListComponent implements OnInit{
    constructor(public model:StatutoryMasterModel,private service:StatutoryMasterService,private toastr: ToastrService,
        private router:Router,private dialog:MatDialog,private dialogService:DialogService){

    }
    
    searchKey:string;
    datasource:MatTableDataSource<any>
    displayedColumns=['position','statutoryName','vendorTypeName','addedOn','status','Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
   
    ngOnInit(){   
        this.loadDropdown();
        this.loadGrid();
        
        
    } 
    loadGrid(){
        this.service.getStatutory().subscribe((res) => {
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.datasource=new MatTableDataSource(res.statutoryList);
                    this.datasource.paginator=this.paginator;
                    this.datasource.sort=this.sort;
                    this.model.statutoryList = res.statutoryList;
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
        this.service.getVendorTypeList().subscribe((res) => {
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    vendorTypeList = res.vendorTypeList;
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
            vendorTypeList : vendorTypeList,
            isActive : true
        }
        this.dialog.open(StatutoryMasterDialog,dialogConfig)
        .afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    applyFilter(){
        this.datasource.filter=this.searchKey.trim().toLowerCase();
    }
    onEdit(row:StatutoryMasterModel){
        
        const config=new MatDialogConfig();
        config.disableClose=true;
        config.autoFocus=true;
        config.width="60%";
        config.position={
            top:"55px" 
        }
        config.data={
            statutoryId: row.statutoryId,
            statutoryName : row.statutoryName,
            isActive:row.status=="Active"?true:false,
            remarks:row.remarks,
            vendorTypeList:vendorTypeList
        }
        this.dialog.open(StatutoryMasterDialog,config).afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    // onDelete(row:StatutoryMasterModel){
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