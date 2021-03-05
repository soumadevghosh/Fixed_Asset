import { Component, OnInit, ViewChild } from '@angular/core';
import { DepartmentalRequisitionsService } from './Shared/departmental-requisitions.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { DepartmentalRequisitionsModel } from './Shared/departmental-requisitions.model';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-departmental-requisition-checkout',
  templateUrl: './requisition-checkout.component.html',
  providers: [DepartmentalRequisitionsModel, DepartmentalRequisitionsService]
})
export class RequisitionCheckoutComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['select', 'SlNo', 'reqId', 'reqNo', 'functionalDept', 'itemName', 'reqQty', 'apprQty'];
  searchKey: string;
  selection = new SelectionModel<any>(true, []);
  transferTo = [{ name: "Procurement Department", value: 1 },
  { name: "HQ Inventory Department", value: 2 }]
  showDept: boolean = false;
  buttonText: string;
  showType: boolean = false;
  buttonTextType: string;

  show: boolean = true;
  showButton: boolean = false;
  requisitionType: string;
  requisitionMadeBy = [{ name: "Functional Department", value: 1 }, { name: "Manual Requistion", value: 2 }]
  hqRequisitionMadeByType = [{ name: "Unit Inventory Department", value: 1 }, { name: "Manual Requistion", value: 2 }]
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalQty: number = 0;
  manualTransferForm = this.formBuilder.group({
    requisitionMadeBy: [],
    transferTo: [],
    inventoryDept: []
  });
  manualProcTransferForm = this.formBuilder.group({
    hqRequisitionMadeByType: [],
    transferTo: [3]
  });
  transferForm = this.formBuilder.group({
    transferTo: [],
    inventoryDept: []
  });
  procTransferForm = this.formBuilder.group({
    transferTo: [3]
  });
  vendorTransferForm = this.formBuilder.group({
    vendor: [],
    orderType: []
  });
  orderTypes=  [{ typeId: 1, typeName: "Challan" },
    { typeId: 2, typeName: "Receipt" }]
  //get requisitionMadeBy() { return this.filterForm.get('invDept').value; }
  constructor(private service: DepartmentalRequisitionsService, private toastr: ToastrService, private router: Router,
    public model: DepartmentalRequisitionsModel, private formBuilder: FormBuilder, private route: ActivatedRoute) { }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  ngOnInit(): void {
    this.requisitionType = this.route.snapshot.params['RequisitionType'];
    this.loadGrid();
    this.manualTransferForm.controls.requisitionMadeBy.valueChanges.subscribe(value => {
      if (value == 2) {
        this.showType = true;
        //this.show=false;
        this.displayedColumns = ['select', 'SlNo', 'reqId', 'cartId', 'itemName', 'reqQty', 'apprQty'];
        this.buttonTextType = '2';
        this.loadGrid();
        //this.buttonTextType='Manual Requistion';
        //this.dataSource.filter = this.buttonTextType;
      }
      else {
        this.showType = true;
        this.buttonTextType = '1';
        this.displayedColumns = ['select', 'SlNo', 'reqId', 'reqNo', 'functionalDept', 'itemName', 'reqQty', 'apprQty'];
        this.loadGrid();
        //this.buttonTextType='Functional Department';
        // this.dataSource.filter = this.buttonTextType;
      }
    });
    this.manualProcTransferForm.controls.hqRequisitionMadeByType.valueChanges.subscribe(value => {
      if (value == 2) {
        this.showType = true;
        //this.show=false;
        this.displayedColumns = ['select', 'SlNo', 'reqId', 'cartId', 'itemName', 'reqQty', 'apprQty'];
        this.buttonTextType = '2';
        this.loadGrid();
        //this.buttonTextType='Manual Requistion';
        //this.dataSource.filter = this.buttonTextType;
      }
      else {
        this.showType = true;
        this.buttonTextType = '1';
        this.displayedColumns = ['select', 'SlNo', 'reqId', 'reqNo', 'functionalDept', 'itemName', 'reqQty', 'apprQty'];
        this.loadGrid();
        //this.buttonTextType='Functional Department';
        // this.dataSource.filter = this.buttonTextType;
      }
    });
    this.manualTransferForm.controls.transferTo.valueChanges.subscribe(value => {
      this.showButton = true;
      if (value == 2) {
        this.showDept = true;
        this.buttonText = 'HQ Inventory Department';
      }
      else {
        this.showDept = false;
        this.buttonText = 'Procurement Department';
      }
    });
    this.transferForm.controls.transferTo.valueChanges.subscribe(value => {
      this.showButton = true;
      if (value == 2) {
        this.showDept = true;
        this.buttonText = 'HQ Inventory Department';
      }
      else {
        this.showDept = false;
        this.buttonText = 'Procurement Department';
      }
    });
    this.vendorTransferForm.valueChanges.subscribe(value => {
      const filter = { ...value } as string;
      this.dataSource.filter = filter;
    });
  }
  loadGrid() {
    if (this.requisitionType == 'HQInventory') {
      this.service.getHQInventoryCartItems().subscribe(response => {
        if (response.isIdentityExist) {
          if (response.isSuccess) {
            this.dataSource = new MatTableDataSource(response.requisitionByDeptList
              .filter(x => x.isManualRequisition == false && x.isHQInventoryDeptRequisition == true));
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.model.inventoryDeptList = response.inventoryDeptList;
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
    else if (this.requisitionType == 'ManualRequisition') {
      if (this.buttonTextType == '2') {
        this.service.getManualRequisitionFromCart().subscribe(response => {
          if (response.isIdentityExist) {
            if (response.isSuccess) {
              this.dataSource = new MatTableDataSource(response.requisitionByDeptList
                .filter(x => x.isManualRequisition == true && x.isHQInventoryDeptRequisition == false));
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
              this.model.inventoryDeptList = response.inventoryDeptList;

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
      else {
        this.service.getManualRequisitionFromCart().subscribe(response => {
          if (response.isIdentityExist) {
            if (response.isSuccess) {
              this.dataSource = new MatTableDataSource(response.requisitionByDeptList
                .filter(x => x.isManualRequisition == false && x.isHQInventoryDeptRequisition == false));
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
              this.model.inventoryDeptList = response.inventoryDeptList;
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
    }
    else if (this.requisitionType == 'HQManualRequisition') {
      if (this.buttonTextType == '2') {
        this.service.getHQManualRequisitionFromCart().subscribe(response => {
          if (response.isIdentityExist) {
            if (response.isSuccess) {
              this.dataSource = new MatTableDataSource(response.requisitionByDeptList
                .filter(x => x.isManualRequisition == true && x.isHQInventoryDeptRequisition == true));
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
              this.model.inventoryDeptList = response.inventoryDeptList;

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
      else if (this.buttonTextType == '1') {
        this.service.getHQInventoryCartItems().subscribe(response => {
          if (response.isIdentityExist) {
            if (response.isSuccess) {
              this.dataSource = new MatTableDataSource(response.requisitionByDeptList
                .filter(x => x.isManualRequisition == false && x.isHQInventoryDeptRequisition == true));
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
              this.model.inventoryDeptList = response.inventoryDeptList;
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
    }
    else if (this.requisitionType == 'HQProcurement' || this.requisitionType == 'Procurement') {
      this.service.getProcurementCartItems().subscribe(response => {
        if (response.isIdentityExist) {
          if (response.isSuccess) {
            if (this.requisitionType == 'HQProcurement') {
              this.dataSource = new MatTableDataSource(response.requisitionByDeptList
                .filter(x => x.isManualRequisition == false && x.isHqProcurementDepartmentRequisition == true));
            }
            else if (this.requisitionType == 'Procurement') {
              this.dataSource = new MatTableDataSource(response.requisitionByDeptList
                .filter(x => x.isManualRequisition == false && x.isProcurementDepartmentRequisition == true));
            }
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.model.vendorList = response.vendorList;
            if (this.dataSource != null) {
              this.dataSource.filterPredicate = ((data, filter) => {
                const a = !filter.vendor || data.vendorId === filter.vendor;
                return a;
              }) as (any, string) => boolean;
            }
            this.displayedColumns = ['select', 'SlNo', 'reqId', 'reqNo', 'functionalDept', 'itemName', 'reqQty', 'apprQty', 'vendor'];
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
    else {
      this.service.getRequisitionFromCart().subscribe(response => {
        if (response.isIdentityExist) {
          if (response.isSuccess) {
            this.dataSource = new MatTableDataSource(response.requisitionByDeptList
              .filter(x => x.isManualRequisition == false && x.isHQInventoryDeptRequisition == false));
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.model.inventoryDeptList = response.inventoryDeptList;
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
  }
  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }
  transfer(transferForm: any) {
    if (transferForm.invalid)
      return;
    else {
      if (transferForm.controls.transferTo.value == 1) {
        this.model.transferTo = this.model.transferType[0].value;
      }
      else {
        if (transferForm.controls.inventoryDept.value == null || transferForm.controls.inventoryDept.value == '') {
          this.toastr.warning('Please choose an Inventory Department before forwarding');
          return;
        }
        else {
          this.model.transferTo = this.model.transferType[1].value;
          this.model.requisitionToInventoryDeptId = transferForm.controls.inventoryDept.value;
        }
      }
      if (this.selection.selected.length > 0) {
        this.model.requisitionByDeptList = [...this.selection.selected];
        this.selection.selected.forEach(value => {
          this.model.totalQty = this.model.totalQty + value.approvedQty;
          value.isManualRequisition = false;
        });
      }
      else {
        this.toastr.warning('Please select the Requisitions to forward');
        return;
      }
      this.service.transferRequisitions(this.model).subscribe(response => {
        if (response.isIdentityExist == true) {
          if (response.isSuccess == true) {
            this.toastr.success(response.responseMsg);
            this.selection.clear();
            this.transferForm.reset();
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
  }
  transferToHQProcurement(procTransferForm: any) {
    if (this.selection.selected.length > 0) {
      this.model.requisitionByDeptList = [...this.selection.selected];
      this.selection.selected.forEach(value => {
        this.model.totalQty = this.model.totalQty + value.approvedQty;
        this.model.isManualRequisition = false;
      });
    }
    else {
      this.toastr.warning('Please select the Requisitions to forward');
      return;
    }
    this.service.transferRequisitionsToHQProcurementDept(this.model).subscribe(response => {
      if (response.isIdentityExist == true) {
        if (response.isSuccess == true) {
          this.toastr.success(response.responseMsg);
          this.selection.clear();
          this.procTransferForm.reset();
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

  transferToHQProcurementForManual(manualProcTransferForm: any) {
    if (this.selection.selected.length > 0) {
      this.model.requisitionByDeptList = [...this.selection.selected];
      this.selection.selected.forEach(value => {
        this.model.totalQty = this.model.totalQty + value.approvedQty;
        this.model.isManualRequisition = true;
      });
    }
    else {
      this.toastr.warning('Please select the Requisitions to forward');
      return;
    }
    this.service.transferManualRequisitionsToHQProcurementDept(this.model).subscribe(response => {
      if (response.isIdentityExist == true) {
        if (response.isSuccess == true) {
          this.toastr.success(response.responseMsg);
          this.selection.clear();
          this.manualProcTransferForm.reset();
          // this.loadGrid();
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

  transferForManual(manualTransferForm: any) {
    if (manualTransferForm.invalid)
      return;
    else {
      // if(manualTransferForm.controls.requisitionMadeBy.value==1){
      //   this.model.requisitionMadeBy=this.model.requisitionMadeByType[0].value;
      // }
      // else{
      //   this.model.requisitionMadeBy=this.model.requisitionMadeByType[1].value;
      // }
      if (manualTransferForm.controls.transferTo.value == 1) {
        this.model.transferTo = this.model.transferType[0].value;
      }
      else {
        if (manualTransferForm.controls.inventoryDept.value == null || manualTransferForm.controls.inventoryDept.value == '') {
          this.toastr.warning('Please choose an Inventory Department before forwarding');
          return;
        }
        else {
          this.model.transferTo = this.model.transferType[1].value;
          this.model.requisitionToInventoryDeptId = manualTransferForm.controls.inventoryDept.value;
        }
      }
      if (this.selection.selected.length > 0) {
        this.model.requisitionByDeptList = [...this.selection.selected];
        this.selection.selected.forEach(value => {
          this.model.totalQty = this.model.totalQty + value.approvedQty;
          value.isManualRequisition = true;
        });
      }
      else {
        this.toastr.warning('Please select the Requisitions to forward');
        return;
      }
      this.service.transferManualRequisitions(this.model).subscribe(response => {
        if (response.isIdentityExist == true) {
          if (response.isSuccess == true) {
            this.toastr.success(response.responseMsg);
            this.selection.clear();
            this.manualTransferForm.reset();

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
  }
  orderToVendor(vendorTransferForm: any) {
    if (this.vendorTransferForm.controls.vendor.value == null) {
      this.toastr.warning("Please select a vendor");
      return;
    }
    else if (this.vendorTransferForm.controls.orderType.value == null) {
      this.toastr.warning("Please select an Order type");
      return;
    }
    if (this.selection.selected.length > 0) {
      this.model.requisitionByDeptList = [...this.selection.selected.filter(x=> x.vendorId==this.vendorTransferForm.controls.vendor.value)];
      this.model.requisitionByDeptList.forEach(value => {
        this.model.totalQty = (this.model.totalQty + value.approvedQty);
        this.model.totalGst = (this.model.totalGst + (value.gstPerUnit * value.approvedQty));
        this.model.totalDiscount = (this.model.totalDiscount + (value.discountPerUnit * value.approvedQty));
        this.model.totalAmount = (this.model.totalAmount + (value.approvedQty * value.costPerUnit));
        this.model.vendorId = this.vendorTransferForm.controls.vendor.value;
        this.model.orderType =this.vendorTransferForm.controls.orderType.value;
        value.isManualRequisition = false;
      });

    }
    else {
      this.toastr.warning('Please select the Requisitions to place order');
      return;
    }
    this.service.addVendorOrder(this.model).subscribe(response => {
      if (response.isIdentityExist == true) {
        if (response.isSuccess == true) {
          this.toastr.success(response.responseMsg);
          this.selection.clear();
          this.vendorTransferForm.reset();
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
} 
