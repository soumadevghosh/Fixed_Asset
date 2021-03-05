import {SharedModel} from '../../Shared/appShared.model';
export class EmployeeDepartmentModel extends SharedModel {
    departmentId:number;
    departmentName:string;
    shortName:string;
    isSync:boolean;
    departmentList: any[];
}