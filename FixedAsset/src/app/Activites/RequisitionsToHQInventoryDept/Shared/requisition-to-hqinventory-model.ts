import { SharedModel } from 'src/app/Shared/appShared.model';

export class RequisitionToHQInventoryModel extends SharedModel{
    requisitionId: number;
    requisitionNo: string;
    requisitionDate: string;
    forwardDate: string;
    unitId: number;
    functionalDeptId: number;
    functionalDept: string;
    inventoryDeptId: number;
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
    units: any[];
    inventoryDepartmentRequisitionId: any[];
    isManualReq: string;
    requisitionToInventoryDeptId: number;
    requisitionFromUnit: string;
    requisitionToInventoryDept: string;
    isHQInventoryDeptRequisition: boolean;
    HQInventoryDeptRequisitionDetails: any[];


    
    itemCategory:number;
    requisitionType:number;
    itemCategoryName:string;
    requisitionTypeName:string;
    inventoryDeptName:string;
    itemCategoryList: any[];
    requisitionTypeList:any[];
    items: number;
    item : any[];
    SelectedCategory: any[];
    itemgroupList : any[];
    itemGroup:number;
}
