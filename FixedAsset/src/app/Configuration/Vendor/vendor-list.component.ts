import { Component, OnInit, ViewChild } from '@angular/core';
import { VendorModel } from './Shared/vendor.model';
import { VendorService } from './Shared/vendor.service';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { VendorDialogComponent } from './vendor-dialog.component';
import { take } from 'rxjs/internal/operators/take';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  providers: [VendorModel, VendorService]
})
export class VendorListComponent implements OnInit {

  constructor(public model: VendorModel, private service: VendorService, private toastr: ToastrService,
    private router: Router, private dialog: MatDialog, private dialogService: DialogService) { }
  searchKey: string;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['SlNo', 'vendorName', 'status', 'Action'];
  statutoryInfo: any[];
  vendorList: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.loadGrid();
  }
  loadGrid() {
    this.service.getVendor().subscribe(response => {
      if (response.isIdentityExist == true) {
        if (response.isSuccess == true) {
          this.vendorList = response.vendorList;
          this.dataSource = new MatTableDataSource(response.vendorList);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.model.vendorTypeList = response.vendorTypeList;
          this.model.statutoryList = response.statutoryList;
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
  onEdit(model: VendorModel) {

    this.service.getStatutoryInfo(model.vendorId).subscribe(response => {
      if (response.isIdentityExist == true) {
        if (response.isSuccess == true) {
          const config = new MatDialogConfig();
          config.disableClose = true;
          config.autoFocus = true;
          config.width = "75%";
          config.height = "80%";
          config.position = {
            top: "55px"
          }
          config.data = {
            vendorTypeList: this.model.vendorTypeList,
            statutoryList: this.model.statutoryList,
            vendorId: model.vendorId,
            vendorName: model.vendorName,
            correspondingAddress: model.correspondingAddress,
            correspondingState: model.correspondingState,
            correspondingPincode: model.correspondingPincode,
            correspondingCity: model.correspondingCity,
            correspondingDistrict: model.correspondingDistrict,
            correspondingPostoffice: model.correspondingPostoffice,
            billingAddress: model.billingAddress,
            billingState: model.billingState,
            billingPincode: model.billingPincode,
            billingCity: model.billingCity,
            billingDistrict: model.billingDistrict,
            billingPostoffice: model.billingPostoffice,
            phoneNo: model.phoneNo,
            email: model.email,
            contactPersonNo: model.contactPersonNo,
            contactPersonName: model.contactPersonName,
            contactPersonEmail: model.contactPersonEmail,
            vendorTypeId: model.vendorTypeId,
            isActive: model.isActive,
            remarks: model.remarks,
            statutoryInfo: [...response.vendorList[0].statutoryInfo]

          }
          this.dialog.open(VendorDialogComponent, config)
            .afterClosed().subscribe(() => this.loadGrid());
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
  onDelete(vendorId: number) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
      if (data == true) {
        this.service.deleteVendor(vendorId).subscribe((res) => {
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
  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "75%";
    dialogConfig.height = "80%";
    dialogConfig.position = {
      top: "55px"
    }
    dialogConfig.data = {
      vendorTypeList: this.model.vendorTypeList,
      statutoryList: this.model.statutoryList,
      vendorId: 0
    }
    this.dialog.open(VendorDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => this.loadGrid());
  }
}
