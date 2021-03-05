import { SharedModel } from '../../../Shared/appShared.model'
export class ItemCategoryModel extends SharedModel{
    ItemCategoryId:number;
    Itemcategory:string;
    InventoryDepartments:string;
    ItemCategorylist:any[];
    InventoryDeptList:any[];
    SelectedInventoryDept:any[];
}