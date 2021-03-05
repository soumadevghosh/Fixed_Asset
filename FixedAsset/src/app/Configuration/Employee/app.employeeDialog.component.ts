import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { EmployeeService } from './Shared/employee.Service';
import { EmployeeModel } from './Shared/employee.Model';
import { NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../Shared/datepicker.format';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../Layout/Shared/loader.service';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'
import { FormGroup, FormControl } from '@angular/forms';
@Component({
    templateUrl: './app.employeeDialog.component.html',
    providers: [
        EmployeeService, EmployeeModel, DatePipe,
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ]
})
export class EmployeeDialog extends AppSharedUrlComponent implements OnInit {

    constructor(private service: EmployeeService, public model: EmployeeModel, private toast: ToastrService,
        public dialogRef: MatDialogRef<EmployeeDialog>, @Inject(MAT_DIALOG_DATA) public dialogData: EmployeeModel,
        public loader: LoaderService, private router: Router, public datepipe: DatePipe) {
        super();
    }
    Title:string;
    genders: any;
    Maritals: any;
    AppointmentStatus: any;
    isSameAsCurrentAddress = false;
    birthDate: Date;
    appointDate: Date;
    registrationValidity: Date;
    resignationDate: Date;
    joiningDate: Date;
    EmpFormGroup: FormGroup;
    DorReq: boolean;
    @ViewChild('EmployeeForm') EmployeeForm: NgForm;
    ngOnInit() {

        this.genders = [
            { Value: 'Male', Text: 'Male' },
            { Value: 'Female', Text: 'Female' }
        ];
        this.Maritals = [
            { Value: 'Single', Text: 'Single' },
            { Value: 'Married', Text: 'Married' }

        ];
        this.AppointmentStatus = [
            { Value: 'Permanent', Text: 'Permanent' },
            { Value: 'Temporary', Text: 'Temporary' },
            { Value: 'Ex', Text: 'Ex' }

        ];
        if (this.dialogData != null) {
            this.model.EmpDepartmentList = this.dialogData.EmpDepartmentList;
            this.model.EmpCategoryList = this.dialogData.EmpCategoryList;
            if (this.dialogData.EmployeeId != "") {
                this.Title='Edit Employee';
                this.model = this.dialogData;
                this.setFormGroupData(this.dialogData);
                this.onCategoryChange(this.dialogData.Category);
                this.setisSameAsCurrentAddress();
            }
            else {
                this.Title='Add Employee';
                this.model.isActive = true;
                this.model.EmployeeId = '';
                this.setFormGroupData(this.dialogData);
            }

        }
    }
    setPermanentAddess(event: any) {
        if (event == true) {
            this.model.PAddress = this.model.CAddress;
            this.model.PCity = this.model.CCity;
            this.model.PPs = this.model.CPs;
            this.model.PDist = this.model.CDist;
            this.model.PState = this.model.CState;
            this.model.PCountry = this.model.CCountry;
            this.model.PPinCode = this.model.CPinCode;
            this.model.PPost = this.model.CPost;
        }
        else {
            this.model.PAddress = "";
            this.model.PCity = "";
            this.model.PPs = "";
            this.model.PDist = "";
            this.model.PState = "";
            this.model.PCountry = "";
            this.model.PPinCode = "";
            this.model.PPost = "";
        }
    }
    setisSameAsCurrentAddress(){
        if( this.model.PAddress == this.model.CAddress &&
        this.model.PCity == this.model.CCity &&
        this.model.PPs == this.model.CPs &&
        this.model.PDist == this.model.CDist &&
        this.model.PState == this.model.CState &&
        this.model.PCountry == this.model.CCountry &&
        this.model.PPinCode == this.model.CPinCode &&
        this.model.PPost == this.model.CPost){
            this.isSameAsCurrentAddress=true;
        }
        else{
            this.isSameAsCurrentAddress=false;
        }
    }
    
    onCategoryChange(category: string) {
        if (category.toLowerCase() == "doctor") {
            this.EmpFormGroup.get('registrationValidity').setValidators([Validators.required]);
            this.EmpFormGroup.get('registrationValidity').updateValueAndValidity();
            this.DorReq = true;

        } else {
            this.EmpFormGroup.get('registrationValidity').clearValidators();
            this.EmpFormGroup.get('registrationValidity').updateValueAndValidity();
            this.DorReq = false;
        }
    }
    onSubmit(form: NgForm) {
        try {
            if (this.EmpFormGroup.controls['birthDate'].value == null) {
                this.EmpFormGroup.controls['birthDate'].markAsTouched();
                this.EmployeeForm.form.setErrors({ 'invalid': true });
            } else {
                this.model.BirthDate = this.datepipe.transform(this.EmpFormGroup.controls['birthDate'].value, 'MM/dd/yyyy');
            }
            if (this.EmpFormGroup.controls['appointDate'].value == null) {
                this.EmpFormGroup.controls['appointDate'].markAsTouched();
                this.EmployeeForm.form.setErrors({ 'invalid': true });
            } else {
                this.model.AppointDate = this.datepipe.transform(this.EmpFormGroup.controls['appointDate'].value, 'MM/dd/yyyy');
            }
            if (this.EmpFormGroup.controls['joiningDate'].value == null) {
                this.EmpFormGroup.controls['joiningDate'].markAsTouched();
                this.EmployeeForm.form.setErrors({ 'invalid': true });
            } else {
                this.model.JoiningDate = this.datepipe.transform(this.EmpFormGroup.controls['joiningDate'].value, 'MM/dd/yyyy');
            }
            if (this.DorReq == true && this.EmpFormGroup.controls['registrationValidity'].value == null) {
                this.EmpFormGroup.controls['registrationValidity'].markAsTouched();
                this.EmployeeForm.form.setErrors({ 'invalid': true });
            } else {
                this.model.RegistrationValidity = this.datepipe.transform(this.EmpFormGroup.controls['registrationValidity'].value, 'MM/dd/yyyy');
            }
            this.model.ResignationDate = this.datepipe.transform(this.EmpFormGroup.controls['resignationDate'].value, 'MM/dd/yyyy');
            if (form.invalid) {
                return;
            }
            if (this.model.EmployeeId != '') {
                this.service.updateEmployee(this.model).subscribe((res: any) => {
                    if (res.isIdentityExist == true) {
                        if (res.isSuccess == true) {
                            this.closeModal();
                            this.toast.success(res.responseMsg);
                        }
                        else {
                            this.toast.error(res.responseMsg);
                        }
                    }
                    else {
                        this.toast.error(res.responseMsg);
                        setTimeout(() => {
                            this.router.navigate(["./login"]);
                        }, 1000);
                    }
                });
            }
            else {
                this.service.addEmployee(this.model).subscribe((res: any) => {
                    if (res.isIdentityExist == true) {
                        if (res.isSuccess == true) {
                            this.closeModal();
                            this.toast.success(res.responseMsg);
                        }
                        else {
                            this.toast.error(res.responseMsg);
                        }
                    }
                    else {
                        this.toast.error(res.responseMsg);
                        setTimeout(() => {
                            this.router.navigate(["./login"]);
                        }, 1000);
                    }
                });
            }
        }
        catch (error) {
            this.toast.error(this.serverError);
        }
    }
    resetFormData(form?: NgForm) {
        if (form != null)
            form.reset();
    }
    closeModal() {
        this.resetFormData();
        this.EmpFormGroup.reset();
        this.dialogRef.close();
    }
    setFormGroupData(data) {
        if (data.EmployeeId != '') {
            this.birthDate = undefined;
            this.appointDate = undefined;
            this.registrationValidity = undefined;
            this.resignationDate = undefined;
            this.joiningDate = undefined;
            if (data.BirthDate != '') {
                var bDateObject = new Date(data.BirthDate);
                this.birthDate = bDateObject;
            }
            if (data.AppointDate != '') {
                var appointDateObject = new Date(data.AppointDate);
                this.appointDate = appointDateObject;
            }
            if (data.RegistrationValidity != '') {
                var registrationDateObject = new Date(data.RegistrationValidity);
                this.registrationValidity = registrationDateObject;
            }
            if (data.ResignationDate != '') {
                var resignationDateObject = new Date(data.ResignationDate);
                this.resignationDate = resignationDateObject;
            }
            if (data.JoiningDate != '') {
                var joiningDateObject = new Date(data.JoiningDate);
                this.joiningDate = joiningDateObject;
            }
            this.EmpFormGroup = new FormGroup({
                birthDate: new FormControl(this.birthDate),
                appointDate: new FormControl(this.appointDate),
                registrationValidity: new FormControl(this.registrationValidity),
                resignationDate: new FormControl(this.resignationDate),
                joiningDate: new FormControl(this.joiningDate),
            })
        }
        else {
            this.EmpFormGroup = new FormGroup({
                birthDate: new FormControl(),
                appointDate: new FormControl(),
                registrationValidity: new FormControl(),
                resignationDate: new FormControl(),
                joiningDate: new FormControl(),
            })
        }
    }
}