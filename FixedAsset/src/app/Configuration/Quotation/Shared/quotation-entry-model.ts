import { SharedModel } from 'src/app/Shared/appShared.model';

export class QuotationEntryModel extends SharedModel {
    QuotationId : number;
    VendorId : number;
    VendorName : string;
    QuotationFile : string;
    InventoryDeptId : number;
    InventoryDeptName : string;
    ItemCategoryId : number;
    ItemCategoryName : string;
    ItemGroupId : number;
    ItemGroupName : string;
    ItemId : number;
    ItemName : string;
    UnitPrice : number;
    MinOrderQty : number;
    CGST : number;
    SGST : number;
    IGST : number;
    VendorList : any[];
    InventoryDeptList : any[];
    ItemCategoryList : any[];
    ItemGroupList : any[];
    ItemList : any[];
    SelectedCategory : any[];
    QuotationList : any[];
    MappingList : any[];


}
