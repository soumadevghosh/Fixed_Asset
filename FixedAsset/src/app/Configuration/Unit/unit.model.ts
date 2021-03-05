import {SharedModel} from '../../Shared/appShared.model';
export class UnitModel extends SharedModel {
    unitId:number;
    unitName:string;
    unitAddress:string;
    unitHead:string;
    EmployeeId:string;
    EmpId:string;
    EmployeeName: string;
    EmployeeList : any[];
    isSync:boolean;
    unitList: any[];
} 