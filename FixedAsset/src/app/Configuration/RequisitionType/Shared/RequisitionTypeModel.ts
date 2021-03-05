import { SharedModel } from 'src/app/Shared/appShared.model';

export class RequisitionTypeModel extends SharedModel{
    RequisitionTypeId : number;
    RequistionTypeName : string;
    Description : string;
    RequisitionTypeList : any[];
    SelectedRequisitionType : any[];
}