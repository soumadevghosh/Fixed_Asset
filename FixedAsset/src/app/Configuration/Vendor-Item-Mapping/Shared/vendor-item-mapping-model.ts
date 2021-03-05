import { SharedModel } from 'src/app/Shared/appShared.model';

export class VendorItemMappingModel extends SharedModel {
    vendorItemMappingId: number;
    vendorId: number;
    vendorName: string;
    itemId: number;
    itemName: string;
    items: any[];
    vendorItemMappingList: any[];
    inventoryDepartmentList: any[];
    vendorList: any[];
}
