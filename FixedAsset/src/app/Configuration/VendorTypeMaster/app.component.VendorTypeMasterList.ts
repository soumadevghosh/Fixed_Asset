import { Component,OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VendorTypeMasterModel } from './Shared/VendorType.model';
import { VendorTypeService } from './Shared/VendorType.service';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { VendorTypeDialogComponent } from './app.component.VendorTypeMaster.dialog';
@Component({
    templateUrl:'./app.component.VendorTypeMasterList.html',
    providers:[VendorTypeMasterModel,VendorTypeService]
})
export class VendorTypeListComponent implements OnInit{
    constructor(public model:VendorTypeMasterModel,private service:VendorTypeService,private toastr: ToastrService,
        private router:Router,private dialog:MatDialog,private dialogService:DialogService){
    }
    searchKey:string;
    datasource:MatTableDataSource<any>
    displayedColumns=['position','VendorType','shortName','addedOn','status','Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    ngOnInit(){
        this.loadGrid();
    }
    loadGrid(){
        this.service.getVendorType().subscribe((res) => { 
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.datasource=new MatTableDataSource(res.vendorTypeList);
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
        this.dialog.open(VendorTypeDialogComponent,dialogConfig)
        .afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    applyFilter(){
        this.datasource.filter=this.searchKey.trim().toLowerCase();
    }
    onEdit(row:VendorTypeMasterModel){
        const config=new MatDialogConfig();
        config.disableClose=true;
        config.autoFocus=true;
        config.width="50%";
        config.position={
            top:"55px"
        }
        config.data={
            VendorTypeId:row.VendorTypeId,
            VendorType:row.VendorType,
            shortName:row.shortName,
            isActive:row.isActive,
            remarks:row.remarks,
        }
        this.dialog.open(VendorTypeDialogComponent,config).afterClosed()
        .subscribe(()=>this.loadGrid());
    }
   

        onDelete(row:VendorTypeMasterModel){
        this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
            if(data==true){
        this.service.deleteVendorType(row.VendorTypeId).subscribe((res) => {
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