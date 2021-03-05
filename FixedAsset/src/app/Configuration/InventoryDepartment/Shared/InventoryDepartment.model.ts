import { SharedModel } from '../../../Shared/appShared.model'
export class InventoryDepartmentModel extends SharedModel{
    InventoryDeptId:number;
    InventoryDeptName:string;
    InventoryDeptShortName:string;
    InventoryDeptList:any[];
    SelectedInventoryDept:any[];
}