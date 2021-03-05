import {SharedModel} from '../../Shared/appShared.model';
export class DynamicMasterModel extends SharedModel {
    dynamicTableDetailId:number;
    dynamicTableId:number;
    tableName:string;
    name:string;
    shortName:string;
    isShowDivTableName:boolean;
    isShowDivTableProperty:boolean;
    dynTabId : number;
    srcDynTabName : string;
    description:string;
    TableNameList:any[];
    TableList:any[];
    dynamicMasterList: any[];
}