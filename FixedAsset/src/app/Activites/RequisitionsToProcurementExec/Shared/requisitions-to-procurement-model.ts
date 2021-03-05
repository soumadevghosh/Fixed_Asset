import { SharedModel } from 'src/app/Shared/appShared.model';

export class RequisitionsToProcurementModel extends SharedModel {
    requisitionId: number;
    requisitionNo: string;
    requisitionDate: string;
    unitId: number;
    functionalDeptId: number;
    functionalDept: string;
    inventoryDeptId: number;
    inventoryDept: string;
    isDeptHead: boolean;
    itemId: number;
    itemName: string;
    qty: number;
    approvedQty: number;
    approvedByHQInventory: number;
    totalQty: number = 0;
    requisitionByDeptList: any[];
    functionalDeptList: any[];
    itemList: any[];
    inventoryDeptList: any[];
    isManualReq: string;
    requisitionToInventoryDeptId: number;
    InventoryDepartmentRequisitionId: number;
    hqProcurementDepartmentRequisitionId: number;
    hqProcurementDepartmentRequisitionNo: string;
    hqProcurementDeptRequisitionDetailId: number;
    ProcurementDeptRequisitionDetails: any[];
    forwardDate: string;
    vendorId: number;
    vendorName: string;
    vendorTypeName: string;
    phoneNo: number;
    email: string;
    correspondingAddress: string;
    vendorItemMapping: any[];
    quotationId: number;
    unitPrice: number;
    minOrderQty: number;
    gst: number;
    sgst: number;
    cgst: number;
    igst: number;
    itemUnit: number;
    itemDetail: any[];
    itemUnitList: any[];
    requisitionDetail: any[];
    isHQ: any[];
    isProcurementDepartmentRequisition: boolean;
    isHqProcurementDepartmentRequisition: boolean;
    gstPerUnit: number;
    gstPercentage: number;
    discountPerUnit: number;
    discountPercentage: number;
}