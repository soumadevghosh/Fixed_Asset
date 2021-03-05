import { Component,OnInit,ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { EmployeeModel } from './Shared/employee.Model';
import { EmployeeService } from './Shared/employee.Service';
import { EmployeeDialog } from './app.employeeDialog.component';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';

@Component({
    templateUrl:'./app.employeeList.component.html',
    providers:[EmployeeModel,EmployeeService]
})
export class EmployeeListComponent implements OnInit{
    constructor(public model:EmployeeModel,private service:EmployeeService,private toastr: ToastrService,
        private router:Router,private dialog:MatDialog,private dialogService:DialogService){

    }
    searchKey:string;
    datasource:MatTableDataSource<any>
    displayedColumns=['SlNo','EmployeeId','EmployeeName','Age','Department','Designation','addedOn','status','Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    departmentList:any[];
    categoryList:any[];
    ngOnInit(){   
        this.loadGrid();
    } 
    loadGrid(){
        this.service.getEmployee().subscribe((res) => {
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.datasource=new MatTableDataSource(res.EmployeeList);
                    this.datasource.paginator=this.paginator;
                    this.datasource.sort=this.sort;

                    this.departmentList=res.EmpDepartmentList;
                    this.categoryList=res.EmpCategoryList;

                    this.model.isSync=res.EmployeeList[0].isSync;
                    if(res.EmployeeList[0].isSync==true){
                       this.displayedColumns=['EmployeeId','EmployeeName','Age','Department','Designation','status'];
                    }
                }
                else{
                    this.toastr.error(res.responseMsg);
                }
            }
            else{
                this.toastr.error(res.responseMsg);
                setTimeout(() => {
                    this.router.navigate(["./login"]);
                }, 1000);
            }
           
        });
    }
    openDialog(){
        const dialogConfig=new MatDialogConfig();
        dialogConfig.disableClose=true;
        dialogConfig.autoFocus=true;
        dialogConfig.width="80%";
        dialogConfig.height="80%";
        dialogConfig.position={
            top:"55px"
        }
        dialogConfig.data={
            EmpDepartmentList:this.departmentList,
            EmpCategoryList:this.categoryList,
            EmployeeId:""
        }
        this.dialog.open(EmployeeDialog,dialogConfig)
        .afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    applyFilter(){
        this.datasource.filter=this.searchKey.trim().toLowerCase();
    }
    onEdit(row:EmployeeModel){
        const config=new MatDialogConfig();
        config.disableClose=true;
        config.autoFocus=true;
        config.width="80%";
        config.height="80%";
        config.position={
            top:"55px"
        }
        config.data={
            EmpDepartmentList:this.departmentList,
            EmpCategoryList:this.categoryList,
            EmployeeId:row.EmployeeId,
            EmployeeName:row.EmployeeName,
            FatherGuardianName:row.FatherGuardianName,
            Sex:row.Sex,
            BirthDate:row.BirthDate,
            MaritalStatus:row.MaritalStatus,
            Qualification:row.Qualification,
            NoOfDependent:row.NoOfDependent,
            WorkExp:row.WorkExp,
            EMail:row.EMail,
            Phone:row.Phone,
            Mobile:row.Mobile,
            AppointDate:row.AppointDate,
            JoiningDate:row.JoiningDate,
            Department:row.Department,
            Designation:row.Designation,
            Category:row.Category,
            Status:row.Status,
            ProvidentFundNO:row.ProvidentFundNO,
            CommentID:row.CommentID,
            CAddress:row.CAddress,
            CCity:row.CCity,
            CPs:row.CPs,
            CDist:row.CDist,
            CState:row.CState,
            CCountry:row.CCountry,
            CPinCode:row.CPinCode,
            CPost:row.CPost,
            PAddress:row.PAddress,
            PCity:row.PCity,
            PPs:row.PPs,
            PDist:row.PDist,
            PState:row.PState,
            PCountry:row.PCountry,
            PPinCode:row.PPinCode,
            PPost:row.PPost,
            BloodGroup:row.BloodGroup,
            ResignationDate:row.ResignationDate,
            RegistrationValidity:row.RegistrationValidity,
            isActive:row.isActive
        }
        this.dialog.open(EmployeeDialog,config).afterClosed()
        .subscribe(()=>this.loadGrid());
    }
    onDelete(row:EmployeeModel){
        this.dialogService.openConfirmDialog('Are you sure to delete this record?').subscribe(data => {
            if(data==true){
        this.service.deleteEmployee(row.EmployeeId).subscribe((res) => {
            if(res.isIdentityExist==true){
                if(res.isSuccess==true){
                    this.toastr.success(res.responseMsg);
                    this.loadGrid();
                }
                else{
                    this.toastr.error(res.responseMsg);
                }
            }
            else{
                this.toastr.error(res.responseMsg);
                setTimeout(() => {
                    this.router.navigate(["./login"]);
                }, 1000);
            }
           
            });
            }
        });
    }
}