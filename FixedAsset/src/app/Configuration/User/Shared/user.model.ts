import { SharedModel } from 'src/app/Shared/appShared.model';

export class UserModel extends SharedModel {
    users = [{ type: "functionalDept", value: 1 },
    { type: "inventoryDept", value: 2 },
    { type: "procurementDept", value: 3 },
    { type: "accountsDept", value: 4 },
    { type: "centerInCharge", value: 5 }];
    userId: number;
    userName: string;
    emailId: string;
    password: string;
    unitId: number;
    unitName: string;
    unitList: any[];
    isDeptHead: boolean;
    inventoryDeptId: number;
    inventoryDeptList: any[];
    functionalDeptId: number;
    functionalDeptList: any[];
    isHQ: boolean;
    userType: number;
    userList: any[];
}