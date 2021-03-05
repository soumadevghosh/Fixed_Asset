import { SharedModel } from '../../../Shared/appShared.model'
export class VendorTypeMasterModel extends SharedModel{
    VendorTypeId:number;
    VendorType:string;
    shortName:string;
    vendorTypeList:any[]; 
}