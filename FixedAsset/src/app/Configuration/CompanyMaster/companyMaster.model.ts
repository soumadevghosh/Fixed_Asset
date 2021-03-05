import { SharedModel } from '../../Shared/appShared.model';
export class CompanyMasterModel extends SharedModel {
    companyId: number;
    companyName: string;
    invntoryDeptId: any[];
    inventoryDeptSelectedId: any[];
    inventoryDeptName: string;
    InventoryDeptId: number;
    isProduct: boolean;
    productStatus: string;
    maintenanceStatus: string;
    serviceStatus: string;
    isMaintenance: boolean;
    isService: boolean;
    inventoryDeptList: any[];
    selectedItems: any[];
    companyList: any[];
}