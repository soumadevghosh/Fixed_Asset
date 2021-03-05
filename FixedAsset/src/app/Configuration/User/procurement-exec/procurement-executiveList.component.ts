import { Component, OnInit, ViewChild } from '@angular/core';
import { UserModel } from '../Shared/user.model';
import { UserService } from '../Shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { ProcurementExecutiveDialogComponent } from './procurement-executive-dialog.component';

@Component({
  selector: 'procurement-executive',
  templateUrl: './procurement-executiveList.component.html',
  providers: [UserModel, UserService]
})
export class ProcurementExecComponent implements OnInit {

  constructor(public model: UserModel, private service: UserService, private toastr: ToastrService, private router: Router,
    private dialog: MatDialog, private dialogService: DialogService) { }
  searchKey: string;
  dataSource: MatTableDataSource<any>
  displayedColumns: any[] = ['slNo', 'userName', 'emailId', 'unit', 'HQ', 'status', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.loadGrid();
  }
  loadGrid() {
    this.service.getUser().subscribe((response) => {
      if (response.isIdentityExist) {
        if (response.isSuccess) {
          this.dataSource = new MatTableDataSource(response.userList.filter(filter => filter.procurementDeptId > 0));
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.model.unitList = response.unitList;
        }
        else {
          this.toastr.error(response.responseMsg);
        }
      }
      else {
        this.toastr.error(response.responseMsg);
        setTimeout(() => {
          this.router.navigate(["./login"]);
        }, 1000)
      }
    });
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.position = { top: "55px" }
    dialogConfig.data = {
      unitList: this.model.unitList,
      userId: 0
    }
    this.dialog.open(ProcurementExecutiveDialogComponent, dialogConfig)
      .afterClosed().subscribe(() => this.loadGrid());
  }
  onEdit(model: UserModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.position = { top: "55px" };
    dialogConfig.data = {
      userId: model.userId,
      userName: model.userName,
      isHQ: model.isHQ,
      unitId: model.unitId,
      unitList: this.model.unitList,
      email: model.emailId,
      password: model.password,
      isActive: model.status == 'Active' ? true : false,
      remarks: model.remarks
    }
    this.dialog.open(ProcurementExecutiveDialogComponent, dialogConfig)
      .afterClosed().subscribe(() => this.loadGrid());
  }
  onDelete(userId: number) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
      if (data == true) {
        this.service.deleteUser(userId).subscribe(response => {
          if (response.isIdentityExist == true) {
            if (response.isSuccess == true) {
              this.toastr.success(response.responseMsg);
              this.loadGrid();
            }
            else {
              this.toastr.error(response.responseMsg);
            }
          }
          else {
            this.toastr.error(response.responseMsg);
            setTimeout(() => {
              this.router.navigate(["./login"]);
            }, 1000);
          }
        });
      }
    });
  }
  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }
}
