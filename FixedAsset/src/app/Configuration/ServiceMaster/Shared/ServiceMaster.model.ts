import { SharedModel } from '../../../Shared/appShared.model'
export class ServiceMasterModel extends SharedModel{
    ServiceMasterId:number;
    ServiceItemName:string;
    ItemGroupId:number;
    ItemGroupName:string;
    ItemCategoryId:number;
    ItemCategoryName:string;
    InventoryDeptId:number;
    InventoryDeptName:string;
    ServiceMasterList:any[];
    ItemGroupList:any[];
    ItemCategoryList:any[];
    InventoryDepartmentList:any[];
    SelectedItemCatagory:number;
    SelectedItemGroup:number;
}