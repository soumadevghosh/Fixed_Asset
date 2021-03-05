import { Component,OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ServiceMasterModel } from './Shared/ServiceMaster.model';
import { ServiceMasterService } from './Shared/ServiceMaster.service';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { ServiceMasterDialogComponent } from './app.serviceMasterDialog.component';
@Component({
    templateUrl:'./app.serviceMasterList.component.html',
    providers:[ServiceMasterModel,ServiceMasterService]
})
export class ServiceMasterListComponent implements OnInit{
    constructor(public model:ServiceMasterModel,private service:ServiceMasterService,private toastr: ToastrService,
        private router:Router,private dialog:MatDialog,private dialogService:DialogService){
    }
    searchKey:string;
    datasource:MatTableDataSource<any>
    displayedColumns=['position','ServiceItemName','InventoryDeptName','ItemCategoryName','ItemGroupName','addedOn','status','Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    ngOnInit(){
        this.loadGrid();
    }
    loadGrid(){
        this.service.getServiceMaster().subscribe((res) => {
            
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.datasource=new MatTableDataSource(res.ServiceMasterList);
                   // this.datasource.data.length=res.ServiceMasterList.length;
                    this.datasource.paginator=this.paginator;
                    this.datasource.sort=this.sort;

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
            InventoryDepartmentList:this.model.InventoryDepartmentList,
            ServiceMasterId:0
        }
        this.dialog.open(ServiceMasterDialogComponent,dialogConfig)
       .afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    applyFilter(){
        this.datasource.filter=this.searchKey.trim().toLowerCase();
    }
    onEdit(model:ServiceMasterModel){
        const config=new MatDialogConfig();
        config.disableClose=true;
        config.autoFocus=true;
        config.width="50%";
        config.position={
            top:"55px"
        }
        config.data={
            InventoryDepartmentList:this.model.InventoryDepartmentList,
            InventoryDeptId:model.InventoryDeptId,
            ItemCategoryId:model.ItemCategoryId,
            ItemGroupId:model.ItemGroupId,
            ServiceMasterId:model.ServiceMasterId,
            ServiceItemName:model.ServiceItemName,
            isActive:model.isActive,
            
        }

       this.dialog.open(ServiceMasterDialogComponent,config).afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    onDelete(row:ServiceMasterModel){
        
        this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
            if(data==true){
                
        this.service.deleteServiceMaster(row.ServiceMasterId).subscribe((res) => {
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