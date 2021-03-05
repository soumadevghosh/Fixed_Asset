import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './Authorization/auth.guard';
import { LoginComponent } from './Login/login.component';
import { UserDashBoard } from './Dashboard/userDashboard';
import { EmployeeListComponent } from './Configuration/Employee/app.employeeList.component';
import { EmployeeDepartmentComponent } from './Configuration/Department/app.component.department';
import { InventoryDepartmentListComponent } from './Configuration/InventoryDepartment/app.component.InventoryDeptList';
import { ItemCategoryListComponent } from './Configuration/ItemCategory/app.component.ItemCategoryList';
import { ItemGroupListComponent } from './Configuration/ItemGroup/app.temgroupList.component';

import { EmployeeCategoryComponent } from './Configuration/EmployeeCategory/app.employee.category'
import { UnitComponent } from './Configuration/Unit/app.unit'
import { VendorTypeListComponent } from './Configuration/VendorTypeMaster/app.component.VendorTypeMasterList';
import { CompanyMasterListComponent } from './Configuration/CompanyMaster/app.component.companyMasterList';
import { StatutoryMasterListComponent } from './Configuration/StatutoryMaster/app.component.statutoryMasterList'
import { DynamicMasterListComponent } from './Configuration/DynamicMaster/app.component.dynamicMasterList'

//work by Soumadev
import { ItemListComponent } from './Configuration/Item/item-list.component';
import { UserComponent } from './Configuration/User/user.component';
import { UnitFunctionalDeptComponent } from './Configuration/User/unit-functional-dept/unit-functional-deptList.component';
import { UnitInventoryDeptComponent } from './Configuration/User/unit-inventory-dept/unit-inventory-deptList.component';
import { ProcurementExecComponent } from './Configuration/User/procurement-exec/procurement-executiveList.component';
import { AccountsDeptListComponent } from './Configuration/User/accounts-dept/accounts-dept-list.component';
import { CenterInChargeListComponent } from './Configuration/User/center-in-charge/center-in-charge-list.component';
import { VendorListComponent } from './Configuration/Vendor/vendor-list.component';
import { VendorItemMappingListComponent } from './Configuration/Vendor-Item-Mapping/vendor-item-mapping-list.component';
import { DepartmentalRequisitionsComponent } from './Activites/RequisitionsByFunctionalDept/departmental-requisitions.component';
import { RequisitionCheckoutComponent } from './Activites/RequisitionsByFunctionalDept/requisition-checkout.component';
import { RequisitionsToProcurementComponent } from './Activites/RequisitionsToProcurementExec/requisitions-to-procurement.component';
import { RequisitionToHQInventoryComponent } from './Activites/RequisitionsToHQInventoryDept/requisition-to-hqinventory.component';
// end

// work by sulagna
import { ServiceMasterListComponent } from './Configuration/ServiceMaster/app.serviceMasterList.component';
import {VendorOrderListComponent} from './Activites/VendorOrderList/app.VendorOrderList.component';
import{VendorOrderDetailsComponent} from './Activites/VendorOrderList/app.VendorOrderDetails.component';
import { ItemUnitMasterListComponent } from './Configuration/ItemUnitMaster/app.ItemUnitMasterList.component';
import { RequisitionListComponent } from './Activites/Requisition/app.RequisitionList.component';
import {RequisitionByUserListComponent} from './Activites/RequisitionByUser/app.RequisitionByUserList.component';
import {DeptWiseMenuComponent} from './Configuration/DeptWiseMenu/app.DeptWiseMenu.component';
import {UserWiseMenuComponent} from './Configuration/UserWiseMenu/app.UserWiseMenu.component';
// import {UserWiseMenuComponent} from './Configuration/DynamicMenu/UserWiseMenu/app.UserWiseMenu.component';
//import { Component } from '@angular/core';
// end

//Work by Sugata
import { RequisitionTypeListComponent } from './Configuration/RequisitionType/requisitionType-list.component';
import { QuotationListComponent } from './Configuration/Quotation/quotation-list.component';
import { QuotationEntryComponent } from './Configuration/Quotation/QuotationEntry/quotation-entry.component';
import { from } from 'rxjs';
// import { from } from 'rxjs';
//end

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: UserDashBoard, canActivate: [AuthGuard] },
    { path: 'configuration/employee', component: EmployeeListComponent, canActivate: [AuthGuard] },
    { path: 'configuration/department', component: EmployeeDepartmentComponent, canActivate: [AuthGuard] },
    { path: 'configuration/itemgroup', component: ItemGroupListComponent, canActivate: [AuthGuard] },
    { path: 'configuration/inventorydepartment', component: InventoryDepartmentListComponent, canActivate: [AuthGuard] },
    { path: 'configuration/itemcategory', component: ItemCategoryListComponent, canActivate: [AuthGuard] },
    { path: 'configuration/employeeCategory', component: EmployeeCategoryComponent, canActivate: [AuthGuard] },
    { path: 'configuration/Unit', component: UnitComponent, canActivate: [AuthGuard] },
    { path: 'configuration/DynamicMaster', component: DynamicMasterListComponent, canActivate: [AuthGuard] },
    { path: 'configuration/CompanyMaster', component: CompanyMasterListComponent, canActivate: [AuthGuard] },
    { path: 'configuration/StatutoryMaster', component: StatutoryMasterListComponent, canActivate: [AuthGuard] },
    { path: 'configuration/VendorTypeMaster', component: VendorTypeListComponent, canActivate: [AuthGuard] },
    { path: 'configuration/Item', component: ItemListComponent, canActivate: [AuthGuard] },
    {
        path: 'configuration/Users', component: UserComponent, canActivate: [AuthGuard],
        children: [                          //<---- child components declared here
            { path: 'unitFunctionalDept', component: UnitFunctionalDeptComponent },
            { path: 'unitInventoryDept', component: UnitInventoryDeptComponent },
            { path: 'procurementDept', component: ProcurementExecComponent },
            { path: 'AccountsDept', component: AccountsDeptListComponent },
            { path: 'centerincharge', component: CenterInChargeListComponent }
        ]
    },
    { path: 'configuration/Vendor', component: VendorListComponent, canActivate: [AuthGuard] },
    { path: 'configuration/VendorItemMapping', component: VendorItemMappingListComponent, canActivate: [AuthGuard] },
    { path: 'activities/requisitionsByDepartment', component: DepartmentalRequisitionsComponent, canActivate: [AuthGuard] },
    { path: 'activities/requisitionsInCart', component: RequisitionCheckoutComponent, canActivate: [AuthGuard] },
    { path: 'activities/requisitionsInCart/:RequisitionType', component: RequisitionCheckoutComponent, canActivate: [AuthGuard] },
    { path: 'activities/requisitionToProcurement', component: RequisitionsToProcurementComponent, canActivate: [AuthGuard] },
    { path: 'activities/requisitionToHQInventory', component: RequisitionToHQInventoryComponent, canActivate: [AuthGuard] },
    { path: 'configuration/servicemaster', component: ServiceMasterListComponent, canActivate: [AuthGuard] },
    { path: 'activities/VendorOrderList', component:VendorOrderListComponent, canActivate:[AuthGuard]},
    { path: 'activities/VendorOrderDetails', component: VendorOrderDetailsComponent, canActivate: [AuthGuard] },
    { path: 'activities/VendorOrderDetails/:vendorId', component: VendorOrderDetailsComponent, canActivate: [AuthGuard] },
    { path: 'configuration/DeptWiseMenu', component: DeptWiseMenuComponent, canActivate: [AuthGuard] },
    { path: 'configuration/UserWiseMenu', component: UserWiseMenuComponent, canActivate: [AuthGuard] },
    { path: 'configuration/ItemUnitMaster', component: ItemUnitMasterListComponent, canActivate: [AuthGuard] },
    { path: 'activities/Requisition', component: RequisitionListComponent, canActivate: [AuthGuard] },
    { path: 'activities/RequisitionByUser', component: RequisitionByUserListComponent, canActivate: [AuthGuard] },

    // { path: 'configuration/Requisition', component: RequisitionListComponent, canActivate: [AuthGuard] },
    { path: 'configuration/RequisitionType', component: RequisitionTypeListComponent, canActivate: [AuthGuard] },
    { path: 'configuration/Quotation', component: QuotationListComponent, canActivate: [AuthGuard] },
    { path: 'configuration/QuotationEntry/:Id', component: QuotationEntryComponent, canActivate: [AuthGuard] },




    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
