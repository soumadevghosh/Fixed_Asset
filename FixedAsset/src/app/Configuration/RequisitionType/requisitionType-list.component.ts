import { Component, OnInit, ViewChild } from '@angular/core';
import { RequisitionTypeModel } from './Shared/RequisitionTypeModel';
import { RequisitionTypeService } from './Shared/requisitionType.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RequisitionTypeDialogComponent } from './requisitionType-dialog.component';

@Component({
  selector: 'app-requisition-list',
  templateUrl: './requisitionType-list.component.html',
  providers: [RequisitionTypeModel, RequisitionTypeService]
})
export class RequisitionTypeListComponent implements OnInit {

  constructor(public model:RequisitionTypeModel, private service:RequisitionTypeService, private tostr:ToastrService,
    private router:Router, private dialog:MatDialog, private dialogservice:DialogService) { }
    searchKey:string;
    datasource:MatTableDataSource<any>;
    displayedColumns=['position','RequisitionTypeName','Description','status','Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.loadGrid();
  }

  loadGrid(){
    
    this.service.getRequisition().subscribe((res)=>{
      if (res.isIdentityExist == true) {
        if (res.isSuccess == true) {
          this.datasource = new MatTableDataSource(res.RequisitionTypeList);
          this.datasource.paginator = this.paginator;
          this.datasource.sort = this.sort;
          this.model.RequisitionTypeList = res.RequisitionTypeList;
        }
        else{
          this.tostr.error(res.responseMsg);
        }
      }
      else{
        this.tostr.error(res.responseMsg);
        setTimeout(()=>{
          this.router.navigate(["./login"]);
        },1000);
      }
    });
  }

  openDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.position={
      top:"55px"
    }
    dialogConfig.data={
      RequisitionTypeId:0
    }
    this.dialog.open(RequisitionTypeDialogComponent, dialogConfig)
    .afterClosed()
    .subscribe(()=>this.loadGrid());
  }

  applyFilter(){
    this.datasource.filter=this.searchKey.trim().toLocaleLowerCase();
  }

  onEdit(model:RequisitionTypeModel){
    
    const config = new MatDialogConfig();
    config.disableClose=true;
    config.autoFocus=true;
    config.width="50%";
    config.position={
      top:"55px"
    }
    config.data={
      RequisitionTypeId:model.RequisitionTypeId,
      RequistionTypeName:model.RequistionTypeName,
      Description:model.Description,
      isActive:model.status=='Active'?true:false,
      remarks:model.remarks
    }
    this.dialog.open(RequisitionTypeDialogComponent,config)
    .afterClosed()
    .subscribe(() => this.loadGrid());
  }

  onDelete(row:RequisitionTypeModel){
    this.dialogservice.openConfirmDialog('Are you sure to delete the record?').subscribe(data => {
      if(data == true){
        this.service.DeleteRequisitionType(row.RequisitionTypeId).subscribe((res)=>{
          if(res.isIdentityExist==true){
            if(res.isSuccess==true){
              this.tostr.success(res.responseMsg);
              this.loadGrid();
            }
            else{
              this.tostr.error(res.responseMsg);
            }
          }
          else{
            this.tostr.error(res.responseMsg);
            setTimeout(() => {
              this.router.navigate(["./login"]);
            }, 1000);
          }
        });
      }
    });
  }

}
