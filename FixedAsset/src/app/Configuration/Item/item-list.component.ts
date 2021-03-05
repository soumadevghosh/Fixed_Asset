import { Component, OnInit, ViewChild } from '@angular/core';
import {ItemModel} from './Shared/item.model';
import {ItemService} from './Shared/item.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {ItemDialogComponent} from './item-dialog.component';

@Component({
  templateUrl:'./item-list.component.html',
  providers: [ItemModel,ItemService]
})
export class ItemListComponent implements OnInit {

  constructor(public model:ItemModel,private service:ItemService,private toastr:ToastrService,
    private router:Router,private dialog:MatDialog,private dialogService:DialogService) { 
    }
    ItemGroup:any[];
    searchKey:string;
    dataSource:MatTableDataSource<any>;
    displayedColumns= ['SlNo' , 'itemName' , 'inventoryDeptName' , 'itemCategoryName' , 'status' , 'Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;  
  ngOnInit() {
    this.loadGrid();
  }
  loadGrid(){
    this.service.getItem().subscribe((res)=>{
      if(res.isIdentityExist == true){
        if(res.isSuccess == true){
          this.dataSource=new MatTableDataSource(res.itemList);
          this.dataSource.paginator=this.paginator;
          this.dataSource.sort=this.sort;
          this.model.inventoryDepartmentList=res.inventoryDepartmentList;
          this.model.itemUnitList=res.itemUnitList;
        }
        else{
          this.toastr.error(res.responseMsg);
        }
      }
      else{
        this.toastr.error(res.responseMsg);
        setTimeout(()=>{
          this.router.navigate(["./login"]);
        },1000);
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
          inventoryDepartmentList:this.model.inventoryDepartmentList,
          itemUnitList:this.model.itemUnitList,
          itemId:0
        }
        this.dialog.open(ItemDialogComponent,dialogConfig)
        .afterClosed()
        .subscribe(()=>this.loadGrid());
  }
  applyFilter(){
        this.dataSource.filter=this.searchKey.trim().toLowerCase();
  }
  onEdit(model:ItemModel){
    const config=new MatDialogConfig();
    config.disableClose=true;
    config.autoFocus=true;
    config.width="50%";
    config.position={
        top:"55px"
    }
    config.data={
        itemId:model.itemId,
        itemName:model.itemName,
        inventoryDepartmentList:this.model.inventoryDepartmentList,
        inventoryDeptId:model.inventoryDeptId,
        itemCategoryId:model.itemCategoryId,
        itemGroupId:model.itemGroupId,
        gstPercentage:model.gstPercentage,
        hsnNo:model.hsnNo,
        itemUnitList:this.model.itemUnitList,
        itemUnitId:model.itemUnitId,
        quantity:model.quantity,
        strMaintenanceSchedule:model.strMaintenanceSchedule,
        strCalibrationSchedule:model.strCalibrationSchedule,
        description:model.description,
        isActive:model.status=='Active'?true:false,
        remarks:model.remarks
    }

   this.dialog.open(ItemDialogComponent,config)
    .afterClosed()
    .subscribe(()=>this.loadGrid());
  }
  onDelete(row:ItemModel){
      this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
          if(data==true){
      this.service.deleteItem(row.itemId).subscribe((res) => {
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
