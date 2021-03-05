import { SharedModel } from 'src/app/Shared/appShared.model';

export class ItemModel extends SharedModel
{
    itemId:number;
    itemName:string;
    description:string;
    itemCategoryId:number;
    itemCategoryName:string;
    itemGroupId:number;
    itemGroupName:string;
    inventoryDeptId:number;
    inventoryDeptName:string;
    gstPercentage:number;
    hsnNo:number;
    itemUnitId:number;
    quantity:number;
    maintenanceSchedule:boolean;
    calibrationSchedule:boolean;
    strMaintenanceSchedule:number;
    strCalibrationSchedule:number;
    itemGroupList:any[];
    itemCategoryList:any[];
    inventoryDepartmentList:any[];
    itemUnitList:any[];
    itemList:any[];
}