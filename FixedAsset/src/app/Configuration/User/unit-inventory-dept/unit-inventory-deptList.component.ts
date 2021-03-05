import { Component, OnInit, ViewChild } from '@angular/core';
import { UserModel } from '../Shared/user.model';
import { UserService } from '../Shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UnitInventoryDeptDialogComponent } from './unit-inventory-dept-dialog.component';

@Component({
  selector: 'app-unit-inventory-dept',
  templateUrl: './unit-inventory-deptList.component.html',
  providers: [UserService, UserModel]
})
export class UnitInventoryDeptComponent implements OnInit {

  constructor(public model: UserModel, private service: UserService, private toastr: ToastrService,
    private router: Router, private dialog: MatDialog, private dialogService: DialogService) { }
  searchKey: string;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['SlNo', 'userName', 'emailId', 'unit', 'HQ', 'iventoryDept', 'isHod', 'status', 'Action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.loadGrid();
  }
  loadGrid() {
    this.service.getUser().subscribe((res) => {
      if (res.isIdentityExist == true) {
        if (res.isSuccess == true) {
          this.dataSource = new MatTableDataSource(res.userList.filter(p => p.inventoryDeptId > 0));
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.model.unitList = res.unitList;
          this.model.inventoryDeptList = res.inventoryDeptList;
        }
        else {
          this.toastr.error(res.responseMsg);
        }
      }
      else {
        this.toastr.error(res.responseMsg);
        setTimeout(() => {
          this.router.navigate(["./login"]);
        }, 1000);
      }
    });
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.position = {
      top: "55px"
    }
    dialogConfig.data = {
      inventoryDeptList: this.model.inventoryDeptList,
      unitList: this.model.unitList,
      userId: 0
    }
    this.dialog.open(UnitInventoryDeptDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => this.loadGrid());
  }
  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }
  onEdit(model: UserModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.position = {
      top: "55px"
    }
    dialogConfig.data = {
      userId: model.userId,
      userName: model.userName,
      email: model.emailId,
      password: model.password,
      isHQ: model.isHQ,
      unitId: model.unitId,
      unitList: this.model.unitList,
      inventoryDeptList: this.model.inventoryDeptList,
      inventoryDepId: model.inventoryDeptId,
      isDeptHead: model.isDeptHead,
      isActive: model.status == 'Active' ? true : false,
      remarks: model.remarks
    }
    this.dialog.open(UnitInventoryDeptDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => this.loadGrid());
  }

  onDelete(userId: number) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
      if (data == true) {
        this.service.deleteUser(userId).subscribe((res) => {
          if (res.isIdentityExist == true) {
            if (res.isSuccess == true) {
              this.toastr.success(res.responseMsg);
              this.loadGrid();
            }
            else {
              this.toastr.error(res.responseMsg);
            }
          }
          else {
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
