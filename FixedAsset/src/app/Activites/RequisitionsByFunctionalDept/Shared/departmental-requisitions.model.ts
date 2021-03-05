import { SharedModel } from 'src/app/Shared/appShared.model';

export class DepartmentalRequisitionsModel extends SharedModel {
    requisitionId: number;
    requisitionNo: string;
    requisitionDate: string;
    unitId: number;
    functionalDeptId: number;
    functionalDept: string;
    inventoryDeptId: number;
    isDeptHead: boolean;
    itemId: number;
    itemName: string;
    qty: number;
    approvedQty: number;
    totalQty: number = 0;
    requisitionByDeptList: any[];
    functionalDeptList: any[];
    itemList: any[];
    inventoryDeptList: any[];
    transferType = [{ type: "Procurement", value: 1 },
    { type: "HQInventoryDept", value: 2 }];
    transferTo: number;
    isManualRequisition: boolean;
    isHQInventoryDeptRequisition: boolean;
    requisitionToInventoryDeptId: number;

    requisitionMadeByType = [{ type: "FunctionalDept", value: 1 }, { type: "ManualRequisition", value: 2 }];
    hqRequisitionMadeByType = [{ type: "UnitInventoryDept", value: 1 }, { type: "ManualRequisition", value: 2 }];
    requisitionMadeBy: number;
    itemCategory: number;
    requisitionType: number;
    itemCategoryName: string;
    requisitionTypeName: string;
    inventoryDeptName: string;
    itemCategoryList: any[];
    requisitionTypeList: any[];
    items: number;
    item: any[];
    SelectedCategory: any[];
    itemgroupList: any[];
    itemGroup: number;
    cartId: number;
    isHQ: any[];
    isProcurementDepartmentRequisition: boolean;
    isHqProcurementDepartmentRequisition: boolean;
    vendorList: any[];
    vendorName: string;
    costPerUnit: number;
    gstPerUnit: number = 0;
    gstPercentage: number = 0;
    discountPerUnit: number = 0;
    discountPercentage: number = 0;
    totalGst: number = 0;
    totalDiscount: number = 0;
    totalAmount: number = 0;
    vendorId: number;
    orderType: number;
}
