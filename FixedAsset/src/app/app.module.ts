import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'


import { AppComponent } from './app.component';
import { AngularMaterialModule } from './app.angular.material';
import { appRoutingModule } from './app-routing.module';
import { LoaderService } from './Layout/Shared/loader.service';
import { AuthInterceptor } from './Authorization/auth.interceptor';
import { AuthGuard } from './Authorization/auth.guard';
import { LoaderComponent } from './Layout/loader.component';
import { HeaderComponent } from './Layout/header.component';
import { FooterComponent } from './Layout/footer.component';
import { LoginComponent } from './Login/login.component';
import { UserDashBoard } from './Dashboard/userDashboard';
import { EmployeeListComponent } from './Configuration/Employee/app.employeeList.component';
import { EmployeeDialog } from './Configuration/Employee/app.employeeDialog.component';
import { ItemGroupListComponent } from './Configuration/ItemGroup/app.temgroupList.component';
import { ItemGroupDialogComponent } from './Configuration/ItemGroup/app.itemgroupDialog.component';
import { EmployeeDepartmentComponent } from './Configuration/Department/app.component.department';
import { EmployeeDepartmentDialog } from './Configuration/Department/app.department.dialog';
import { InventoryDepartmentListComponent } from './Configuration/InventoryDepartment/app.component.InventoryDeptList';
import { InventoryDepartmentDialogComponent } from './Configuration/InventoryDepartment/app.component.InventoryDeptDialog';
import { ItemCategoryListComponent } from './Configuration/ItemCategory/app.component.ItemCategoryList';
import { ItemCategoryDialogComponent } from './Configuration/ItemCategory/app.component.ItemCategoryDialog';

import { EmployeeCategoryComponent } from './Configuration/EmployeeCategory/app.employee.category';
import { EmployeeCategoryDialog } from './Configuration/EmployeeCategory/app.employee.category.dialog';
import { UnitComponent } from './Configuration/Unit/app.unit';
import { UnitDialog } from './Configuration/Unit/app.unit.dialog';
import { CompanyMasterListComponent } from './Configuration/CompanyMaster/app.component.companyMasterList';
import { CompanyMasterDialog } from './Configuration/CompanyMaster/app.companyMaster.dialog';
import { VendorTypeListComponent } from './Configuration/VendorTypeMaster/app.component.VendorTypeMasterList';
import { VendorTypeDialogComponent } from './Configuration/VendorTypeMaster/app.component.VendorTypeMaster.dialog';
import { StatutoryMasterListComponent } from './Configuration/StatutoryMaster/app.component.statutoryMasterList';
import { StatutoryMasterDialog } from './Configuration/StatutoryMaster/app.component.statutoryMaster.dialog';
import { DynamicMasterListComponent } from './Configuration/DynamicMaster/app.component.dynamicMasterList';
import { DynamicMasterDialog } from './Configuration/DynamicMaster/app.dynamicMaster.dialog';

//work by Soumadev
import { ItemListComponent } from './Configuration/Item/item-list.component';
import { ItemDialogComponent } from './Configuration/Item/item-dialog.component';
import { UserComponent } from './Configuration/User/user.component';
import { UnitFunctionalDeptComponent } from './Configuration/User/unit-functional-dept/unit-functional-deptList.component';
import { UnitFunctionalDeptDialogComponent } from './Configuration/User/unit-functional-dept/unit-functional-dept-dialog.component';
import { UnitInventoryDeptComponent } from './Configuration/User/unit-inventory-dept/unit-inventory-deptList.component';
import { UnitInventoryDeptDialogComponent } from './Configuration/User/unit-inventory-dept/unit-inventory-dept-dialog.component';
import { ProcurementExecComponent } from './Configuration/User/procurement-exec/procurement-executiveList.component';
import { ProcurementExecutiveDialogComponent } from './Configuration/User/procurement-exec/procurement-executive-dialog.component';
import { AccountsDeptListComponent } from './Configuration/User/accounts-dept/accounts-dept-list.component';
import { AccountsDeptDialogComponent } from './Configuration/User/accounts-dept/accounts-dept-dialog.component';
import { CenterInChargeListComponent } from './Configuration/User/center-in-charge/center-in-charge-list.component';
import { CenterInChargeDialogComponent } from './Configuration/User/center-in-charge/center-in-charge-dialog.component';
import { VendorListComponent } from './Configuration/Vendor/vendor-list.component';
import { VendorDialogComponent } from './Configuration/Vendor/vendor-dialog.component';
import { VendorItemMappingListComponent } from './Configuration/Vendor-Item-Mapping/vendor-item-mapping-list.component';
import { VendorItemMappingDialogComponent } from './Configuration/Vendor-Item-Mapping/vendor-item-mapping-dialog.component';
import { DepartmentalRequisitionsComponent } from './Activites/RequisitionsByFunctionalDept/departmental-requisitions.component';
import { RequisitionCheckoutComponent } from './Activites/RequisitionsByFunctionalDept/requisition-checkout.component';
import { RequisitionsToProcurementComponent } from './Activites/RequisitionsToProcurementExec/requisitions-to-procurement.component';
import { RequisitionToHQInventoryComponent } from './Activites/RequisitionsToHQInventoryDept/requisition-to-hqinventory.component';
import { RequisitionToHQInventoryDeptDialogComponent } from './Activites/RequisitionsToHQInventoryDept/requisition-to-hqinventory-dept-dialog.component';
import { RequisitionsToProcurementDialogComponent } from './Activites/RequisitionsToProcurementExec/requisitions-to-procurement-dialog.component';
// end

// work by sulagna
import { ServiceMasterDialogComponent } from './Configuration/ServiceMaster/app.serviceMasterDialog.component';
import { ServiceMasterListComponent } from './Configuration/ServiceMaster/app.serviceMasterList.component';
import { VendorOrderListComponent} from './Activites/VendorOrderList/app.VendorOrderList.component';
import { VendorOrderDetailsComponent } from './Activites/VendorOrderList/app.VendorOrderDetails.component';
import { DeptWiseMenuComponent } from './Configuration/DeptWiseMenu/app.DeptWiseMenu.component';
import { UserWiseMenuComponent } from './Configuration/UserWiseMenu/app.UserWiseMenu.component';
import { ItemUnitMasterListComponent } from './Configuration/ItemUnitMaster/app.ItemUnitMasterList.component';
import { ItemUnitMasterDialogComponent } from './Configuration/ItemUnitMaster/app.ItemUnitMasterDialog.component';
//import { RequisitionListComponent } from './Configuration/Requisition/app.RequisitionList.component';
//import { RequisitionDialogComponent } from './Configuration/Requisition/app.RequisitionDialog.component';
import {RequisitionByUserListComponent} from './Activites/RequisitionByUser/app.RequisitionByUserList.component';
import { RequisitionListComponent } from './Activites/Requisition/app.RequisitionList.component';
import { RequisitionDialogComponent } from './Activites/Requisition/app.RequisitionDialog.component';
// end

//Work by Sugata
import { RequisitionTypeDialogComponent } from './Configuration/RequisitionType/requisitionType-dialog.component';
import { RequisitionTypeListComponent } from './Configuration/RequisitionType/requisitionType-list.component';
import { QuotationListComponent } from './Configuration/Quotation/quotation-list.component';
import { QuotationEntryComponent } from './Configuration/Quotation/QuotationEntry/quotation-entry.component';
import { from } from 'rxjs';

//end

//Work by Sushmita
import {ManualRequisitionDialogComponent} from './Activites/RequisitionsByFunctionalDept/manual-requisition-dialog.component';
import {HQManualRequisitionDialogComponent} from './Activites/RequisitionsToHQInventoryDept/HQ-manual-requisition-dialog.component'
//end

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    UserDashBoard,
    EmployeeListComponent,
    EmployeeDialog,
    ItemGroupListComponent,
    ItemGroupDialogComponent,
    EmployeeDepartmentComponent,
    EmployeeDepartmentDialog,
    InventoryDepartmentListComponent,
    InventoryDepartmentDialogComponent,
    ItemCategoryListComponent,
    ItemCategoryDialogComponent,

    EmployeeCategoryComponent,
    EmployeeCategoryDialog,
    UnitComponent,
    UnitDialog,
    StatutoryMasterListComponent,
    StatutoryMasterDialog,
    VendorTypeListComponent,
    VendorTypeDialogComponent,
    CompanyMasterListComponent,
    CompanyMasterDialog,
    DynamicMasterListComponent,
    DynamicMasterDialog,
    ServiceMasterListComponent,
    ServiceMasterDialogComponent,
    VendorOrderListComponent,
    VendorOrderDetailsComponent,
    DeptWiseMenuComponent,
    UserWiseMenuComponent,
    ItemUnitMasterListComponent,
    ItemUnitMasterDialogComponent,
    RequisitionListComponent,
    RequisitionDialogComponent,
    RequisitionByUserListComponent,

    ItemListComponent,
    ItemDialogComponent,
    UserComponent,
    UnitFunctionalDeptComponent,
    UnitInventoryDeptComponent,
    ProcurementExecComponent,
    UnitFunctionalDeptDialogComponent,
    UnitInventoryDeptDialogComponent,
    RequisitionTypeDialogComponent,
    RequisitionTypeListComponent,
    ProcurementExecutiveDialogComponent,
    AccountsDeptListComponent,
    AccountsDeptDialogComponent,
    CenterInChargeListComponent,
    CenterInChargeDialogComponent,
    QuotationListComponent,
    QuotationEntryComponent,
    VendorListComponent,
    VendorDialogComponent,
    VendorItemMappingListComponent,
    VendorItemMappingDialogComponent,
    DepartmentalRequisitionsComponent,
    RequisitionCheckoutComponent,
    RequisitionsToProcurementComponent,
    RequisitionToHQInventoryComponent,
    RequisitionToHQInventoryDeptDialogComponent,
   // RequisitionToHQInventoryComponent,
    ManualRequisitionDialogComponent,
   RequisitionsToProcurementDialogComponent,   
    HQManualRequisitionDialogComponent

  ],
  imports: [
    BrowserModule,
    NgbModule,
    NgbDatepickerModule,
    AngularMaterialModule,
    appRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ timeOut: 5000, positionClass: "toast-top-right", preventDuplicates: false }),
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    LoaderService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,

      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
