import {SharedModel} from '../../Shared/appShared.model';
export class StatutoryMasterModel extends SharedModel {
    statutoryId:number;
    vendorTypeId:number;
    statutoryName:string;
    vendorTypeName:string;
    statutoryList : any[];
    selectedItems : any[];
    vendorTypeList : any[]; 
}