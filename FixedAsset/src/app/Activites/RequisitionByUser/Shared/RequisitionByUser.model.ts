import { SharedModel } from '../../../Shared/appShared.model'
export class RequisitionByUserModel extends SharedModel{
    
    RequisitionId:number;
    RequisitionNo:string;
    RequisitionName:string;
    RequisitionDate:string;
    RequisitionMadyBy:number;
    RequisitionMadyByName:string;
    unitId:number;
    unitName:string;
    RequisitionStatus:string;
    departmentId:number;
    departmentName:string;
    InventoryDeptId:number;
    InventoryDeptName:string;
    ItemCategoryId:number;
    Itemcategory:string;
    ItemGroupId:number;
    ItemGroupName:string;
    RequisitionTypeId:number;
    RequistionTypeName:string;
    itemId:number;
    itemName:string;
    Quantity:number;
    UnitPrice:number;
    GST:number;
    OtherExpences:number;
    TotalBudget:number;
    Status:string;
    RequisitionList:any[];
    ItemGroupList:any[];
    ItemCategoryList:any[];
    InventoryDepartmentList:any[];
    FunctionalDeptList:any[];
    // TypeOfRequList:any[];
    ItemList:any[];
    UnitList:any[];
    RequisitionTypeList:any[];

}