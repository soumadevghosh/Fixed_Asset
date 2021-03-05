import { SharedModel } from '../../../Shared/appShared.model'
export class ItemGroupModel extends SharedModel{
    ItemGroupId:number;
    ItemGroupName:string;
    ItemCategoryId:number;
    ItemCategoryName:string;
    InventoryDeptId:number;
    InventoryDeptName:string;
    MaintenanceSchedule:boolean;
    CalibrationSchedule:boolean;
    strMaintenanceSchedule:string;
    strCalibrationSchedule:string;
    ItemGroupList:any[];
    ItemCategoryList:any[];
    InventoryDepartmentList:any[];
}