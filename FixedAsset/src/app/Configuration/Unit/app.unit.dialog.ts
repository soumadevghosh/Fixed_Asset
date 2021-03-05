import { Component,OnInit,Inject } from '@angular/core';
import {MatSelectModule} from '@angular/material/select'
import { UnitService } from './unit.service';
import { UnitModel } from './unit.model';
import { NgForm } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../Layout/Shared/loader.service';
import {AppSharedUrlComponent} from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';

@Component({
    templateUrl:'./app.unit.dialog.html',
    providers:[UnitService,UnitModel]
})

export class UnitDialog extends AppSharedUrlComponent implements OnInit{
empId : any;
    constructor(private service:UnitService,public model:UnitModel,private toast:ToastrService,
        public dialogRef:MatDialogRef<UnitDialog>, @Inject(MAT_DIALOG_DATA) public dialogData:UnitModel,
        public loader:LoaderService, private router:Router){
            super();
         }
        
    ngOnInit(){
        if(this.dialogData!=null){
           
            this.setFormData(this.dialogData);
            this.model.isActive=true;
        }
        else{
            this.model.isActive=true;
            
        }
        
    }
    
    onSubmit(form:NgForm){
        
        if(form.invalid){
            return
        }
        this.getFormData(form);
        if(form.value.unitId>0){
            this.service.updateUnit(this.model).subscribe((res:any)=>{
                if(res.isIdentityExist==true){
                    if(res.isSuccess==true){
                         this.closeModal();
                         this.toast.success(res.responseMsg);
                    }
                    else{
                        this.toast.error(res.responseMsg);
                    }
                }
                else{
                    this.toast.error(res.responseMsg);
                    setTimeout(() => {
                        this.router.navigate(["./login"]);
                    }, 1000);
                }
            });
        }
        else{
            this.service.addUnit(this.model).subscribe((res:any)=>{
                if(res.isIdentityExist==true){
                    if(res.isSuccess==true){
                         this.closeModal();
                         this.toast.success(res.responseMsg);
                    }
                    else{
                        this.toast.error(res.responseMsg);
                    }
                }
                else{
                    this.toast.error(res.responseMsg);
                    setTimeout(() => {
                        this.router.navigate(["./login"]);
                    }, 1000);
                }
            });
        }
    }
    getFormData(form:NgForm){
        this.model.unitId=form.value.unitId;
        this.model.unitName=form.value.unitName.trim();
        this.model.EmployeeId=form.value.unitHead;
        this.model.unitAddress=form.value.unitAddress;
        this.model.isActive=form.value.IsActive;
        this.model.remarks=form.value.Remarks
    }
    setFormData(UnitData:any){
        this.model.unitId=UnitData.unitId;
        this.model.unitName=UnitData.unitName;
        this.model.EmployeeList=UnitData.EmployeeList;
        this.model.EmployeeId=UnitData.EmployeeId;
        this.model.EmpId=UnitData.EmployeeId;
        this.model.unitAddress=UnitData.unitAddress;
        this.model.isActive=UnitData.isActive;
        this.model.remarks=UnitData.remarks
    }
    
    resetFormData(form?:NgForm){
        if(form!=null)
        form.reset();
    }
    closeModal(){
        this.resetFormData();
        this.dialogRef.close();
    }
}