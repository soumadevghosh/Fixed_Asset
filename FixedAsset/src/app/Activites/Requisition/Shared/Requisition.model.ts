import { SharedModel } from '../../../Shared/appShared.model'
//////////////to import enum file/////////
//import {RequesitionStatusEnum} from '../../../Shared/app.helper.component';
export class RequisitionModel extends SharedModel{
    
    RequisitionId:number;
    RequisitionNo:string;
    RequisitionName:string;
    RequisitionDate:string;
    RequisitionMadyBy:number;
    RequisitionMadyByName:string;
    unitId:number;
    unitName:string;
    RequisitionStatus:string;
    RequisitionStatusID:number;
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
    //EnumRequisitionStatus:number;
    //enumExample:RequesitionStatusEnum.Pending;


}