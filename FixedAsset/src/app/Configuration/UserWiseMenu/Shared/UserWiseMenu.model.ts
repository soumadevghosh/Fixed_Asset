import { SharedModel } from '../../../Shared/appShared.model'
export class UserWiseMenuModel extends SharedModel{
    DeptWiseMenuId:number;
    DeptName:string;
    DeptId:number;
    DeptWiseMenuList:any[];
    DeptList:any[];
    MenuList:any[];
    SelectedMenuList:any[];
    unitList:any[];

    menuId:number;

    parentId :number;  //parentMenuId

    name:string ;    //menuName

    actualMenuName:string; 

    controllerName:string ;
    routerLink:string;

    actionName:string; 

    queryString:string;

    ordering:number; 

    parentMenuLinkId:string;

    parentMenuCssClass:string; 

    userId:number; 
    children:any[];

   userNameList:any[];
    menuList:any[];
    SelectedMenu:any[];
    Menu:any[];
    MenuListR:any[];
    unitId:number;
    unitName:string;
    userName:string;
    //userId:number;
    userList:any[];
    users:any[];
    
}
