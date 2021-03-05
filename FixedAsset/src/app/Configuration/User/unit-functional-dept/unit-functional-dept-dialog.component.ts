import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../Shared/user.service';
import { UserModel } from '../Shared/user.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/Layout/Shared/loader.service';

@Component({
  selector: 'app-unit-functional-dept-dialog',
  templateUrl: './unit-functional-dept-dialog.component.html',
  providers: [UserModel, UserService]
})
export class UnitFunctionalDeptDialogComponent implements OnInit {
  Title:string;
  Units: any[];
  UnitFuntionalDepartments: any[];
  UserForm: FormGroup;
  constructor(private service: UserService, public model: UserModel, private toastr: ToastrService,
    public dialogRef: MatDialogRef<UnitFunctionalDeptDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: UserModel,
    public loader: LoaderService, private router: Router) { }

  ngOnInit(): void {
    if (this.dialogData != null) {
      this.Title='Add User';
      this.Units = this.dialogData.unitList.filter(filter => filter.isHQ == false);
      this.UnitFuntionalDepartments = this.dialogData.functionalDeptList;
      this.UserForm = new FormGroup({
        userId: new FormControl(null),
        userName: new FormControl('', [Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/), Validators.required]),
        isHQ: new FormControl(false),
        unitName: new FormControl('', Validators.required),
        functionalDeptName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.pattern(/^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/), Validators.required]),
        password: new FormControl('', [Validators.required]),
        isDeptHead: new FormControl(false),
        isActive: new FormControl(true),
        remarks: new FormControl('')
      });
      if (this.dialogData.userId > 0) {
        this.Title='Edit User';
        this.setFormData(this.dialogData);
      }
    }

    this.UserForm.controls.isHQ.valueChanges.subscribe(value => {
      this.UserForm.controls.unitName.reset();
      if (value == true) {
        this.Units = this.dialogData.unitList.filter(filter => filter.isHQ == true);
      }
      else {
        this.Units = this.dialogData.unitList.filter(filter => filter.isHQ == false);
      }
    })
  }


  setFormData(dialogData: any) {
    this.UserForm.controls.userId.patchValue(dialogData.userId);
    this.UserForm.controls.userName.patchValue(dialogData.userName);
    this.UserForm.controls.isHQ.patchValue(dialogData.isHQ);
    if (dialogData.isHQ) {
      this.Units = this.dialogData.unitList.filter(filter => filter.isHQ == true);
    } else {
      this.Units = this.dialogData.unitList.filter(filter => filter.isHQ == false);
    }
    this.UserForm.controls.unitName.patchValue(dialogData.unitId);
    this.UserForm.controls.functionalDeptName.patchValue(dialogData.functionalDeptId);
    this.UserForm.controls.email.patchValue(dialogData.email);
    this.UserForm.controls.password.patchValue(dialogData.password);
    this.UserForm.controls.isDeptHead.patchValue(dialogData.isDeptHead);
    this.UserForm.controls.isActive.patchValue(dialogData.isActive);
    this.UserForm.controls.remarks.patchValue(dialogData.remarks);
  }
  onSubmit(UserForm: any) {
    if (UserForm.invalid) {
      return;
    }
    this.getFormData(UserForm);
    this.model.userType=this.model.users[0].value;
    if (UserForm.controls.userId.value > 0) {
      this.service.updateUser(this.model).subscribe((res: any) => {
        if (res.isIdentityExist == true) {
          if (res.isSuccess == true) {
            this.closeModal();
            this.toastr.success(res.responseMsg);
          }
          else {
            this.toastr.error(res.responseMsg);
          }
        }
        else {
          this.toastr.error(res.responseMsg);
          setTimeout(() => {
            this.router.navigate(["./login"]);
          }, 1000);
        }
      });
    }
    else {
      this.service.addUser(this.model).subscribe((res: any) => {
        if (res.isIdentityExist == true) {
          if (res.isSuccess == true) {
            this.closeModal();
            this.toastr.success(res.responseMsg);
          }
          else {
            this.toastr.error(res.responseMsg);
          }
        }
        else {
          this.toastr.error(res.responseMsg);
          setTimeout(() => {
            this.router.navigate(["./login"]);
          }, 1000);
        }
      });
    }
  }
  getFormData(form: any) {
    this.model.userId = form.controls.userId.value;
    this.model.userName = form.controls.userName.value.trim();
    this.model.unitId = form.controls.unitName.value;
    this.model.functionalDeptId = form.controls.functionalDeptName.value;
    this.model.emailId = form.controls.email.value;
    this.model.password = form.controls.password.value;
    this.model.isHQ = form.controls.isHQ.value;
    this.model.isDeptHead = form.controls.isDeptHead.value;
    this.model.isActive = form.controls.isActive.value;
    this.model.remarks = form.controls.remarks.value;
  }
  closeModal() {
    this.UserForm.reset();
    this.dialogRef.close();
  }
}
