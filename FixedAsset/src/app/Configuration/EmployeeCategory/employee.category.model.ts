import {SharedModel} from '../../Shared/appShared.model';
export class EmployeeCategoryModel extends SharedModel {
    employeeCategoryId:number;
    employeeCategory:string;
    shortName:string;
    isSync:boolean;
    employeeCategoryList: any[];
} 