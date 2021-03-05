import { Component, OnInit, ViewChild } from '@angular/core';
import { VendorItemMappingModel } from './Shared/vendor-item-mapping-model';
import { VendorItemMappingService } from './Shared/vendor-item-mapping.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { VendorItemMappingDialogComponent } from './vendor-item-mapping-dialog.component';

@Component({
  selector: 'app-vendor-item-mapping-list',
  templateUrl: './vendor-item-mapping-list.component.html',
  providers: [VendorItemMappingModel, VendorItemMappingService]
})
export class VendorItemMappingListComponent implements OnInit {

  constructor(public model: VendorItemMappingModel, private service: VendorItemMappingService, private toastr: ToastrService,
    private router: Router, private dialog: MatDialog, private dialogService: DialogService) { }
  dataSource: MatTableDataSource<any>
  searchKey: string;
  displayedColumns = ['SlNo', 'vendorName', 'items', 'status', 'action'];
  inventoryDeptList: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.loadgrid();
  }
  loadgrid() {
    this.service.getVendorItemMapping().subscribe(response => {
      if (response.isIdentityExist) {
        if (response.isSuccess) {
          this.dataSource = new MatTableDataSource(response.vendorItemMappingList);
          this.model.inventoryDepartmentList = response.inventoryDepartmentList;
          this.model.vendorList = response.vendorList;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
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
  openDialog() {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.width = "80%";
    config.position = {
      top: "55px"
    }
    config.data = {
      vendorItemMappingId: 0,
      vendorList: this.model.vendorList,
      inventoryDepartmentList: this.model.inventoryDepartmentList
    }
    this.dialog.open(VendorItemMappingDialogComponent, config)
      .afterClosed().subscribe(() => this.loadgrid());
  }
  onEdit(model: VendorItemMappingModel) {

    this.service.getVendorItemMappingById(model.vendorId).subscribe(response => {
      if (response.isIdentityExist) {
        if (response.isSuccess) {
          const config = new MatDialogConfig();
          config.disableClose = true;
          config.autoFocus = true;
          config.width = "80%";
          config.position = {
            top: "55px"
          }
          config.data = {
            vendorItemMappingId: -1,
            vendorId: model.vendorId,
            isActive: model.isActive,
            remarks: model.remarks,
            vendorList: this.model.vendorList,
            inventoryDepartmentList: this.model.inventoryDepartmentList,
            items: [...response.vendorItemMappingList[0].items]
          }
          this.dialog.open(VendorItemMappingDialogComponent, config)
        .afterClosed().subscribe(() => this.loadgrid());
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
      
    })


  }
  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }
}
