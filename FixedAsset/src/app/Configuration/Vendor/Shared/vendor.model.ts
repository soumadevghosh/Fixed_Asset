import { SharedModel } from 'src/app/Shared/appShared.model';

export class VendorModel extends SharedModel {
    vendorId: number;
    vendorName: string;
    vendorCode: string;
    registrationDate: string;
    correspondingAddress: string;
    correspondingState: string;
    correspondingPincode: string;
    correspondingCity: string;
    correspondingDistrict: string;
    correspondingPostoffice: string;
    billingAddress: string;
    billingState: string;
    billingPincode: string;
    billingCity: string;
    billingDistrict: string;
    billingPostoffice: string;
    phoneNo: string;
    email: string;
    contactPersonNo: string;
    contactPersonName: string;
    contactPersonEmail: string;
    vendorList: any[];
    vendorTypeId: number;
    vendorTypeName: string;
    vendorTypeList: any[];
    statutoryId: number;
    statutoryName: string;
    statutoryList: any[];
    statutoryInfo: any[];
}