import { Component, OnInit, Inject } from '@angular/core';
import { VendorModel } from './Shared/vendor.model';
import { VendorService } from './Shared/vendor.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoaderService } from 'src/app/Layout/Shared/loader.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DomPortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-vendor-dialog',
  templateUrl: './vendor-dialog.component.html',
  providers: [VendorModel, VendorService]
})
export class VendorDialogComponent implements OnInit {
  Title: string;
  VendorTypes: any[];
  Statutories: any[];
  VendorForm: FormGroup;
  constructor(private service: VendorService, public model: VendorModel, private toastr: ToastrService,
    public dialogRef: MatDialogRef<VendorDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: VendorModel,
    public loader: LoaderService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (this.dialogData != null) {
      this.VendorTypes = this.dialogData.vendorTypeList;
      this.Statutories = this.dialogData.statutoryList;
      this.model.statutoryInfo = this.dialogData.statutoryInfo;
      this.VendorForm = this.formBuilder.group({
        vendorId: [null],
        vendorName: ['', [Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/), Validators.required]],
        vendorType: ['', Validators.required],
        correspondingAddressDetail: this.formBuilder.group({
          correspondingAddress: ['', Validators.required],
          correspondingState: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
          correspondingPincode: ['', [Validators.required, Validators.pattern(/^\d{3}\d{3}$/)]],
          correspondingCity: ['', Validators.required],
          correspondingDistrict: ['', Validators.required],
          correspondingPostoffice: ['', Validators.required]
        }),
        billingAddressDetail: this.formBuilder.group({
          sameAddress: [false],
          billingAddress: ['', Validators.required],
          billingState: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
          billingPincode: ['', [Validators.required, Validators.pattern(/^\d{3}\d{3}$/)]],
          billingCity: ['', Validators.required],
          billingDistrict: ['', Validators.required],
          billingPostoffice: ['', Validators.required]
        }),
        phoneNo: ['', [Validators.required, Validators.pattern(/^[1-9]\d{9}$/)]],
        email: ['', Validators.pattern(/^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/)],
        contactPersonNo: ['', [Validators.required, Validators.pattern(/^[1-9]\d{9}$/)]],
        contactPersonName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)]],
        contactPersonEmail: ['', Validators.pattern(/^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/)],
        statutoryInfo: this.formBuilder.array([]),
        isActive: [true],
        remarks: ['']
      });
      if (this.dialogData.vendorId > 0) {
        this.Title = 'Edit Vendor';
        this.setFormData(this.dialogData);
        this.VendorForm.updateValueAndValidity();
      }
      else{
        this.Title = 'Add Vendor';
        this.statutoryInfo.push(this.formBuilder.group({
          statutoryName: ['', Validators.required],
          info: ['', Validators.required]
        }));
      }
    }
    this.VendorForm.get('billingAddressDetail.sameAddress').valueChanges.subscribe(value => {
      if (value == true) {
        this.billingAddressDetail.patchValue({
          billingAddress: this.CorrespondingAddressDetail.controls.correspondingAddress.value,
          billingState: this.CorrespondingAddressDetail.controls.correspondingState.value,
          billingPincode: this.CorrespondingAddressDetail.controls.correspondingPincode.value,
          billingCity: this.CorrespondingAddressDetail.controls.correspondingCity.value,
          billingDistrict: this.CorrespondingAddressDetail.controls.correspondingDistrict.value,
          billingPostoffice: this.CorrespondingAddressDetail.controls.correspondingPostoffice.value
        }, { emitEvent: false });
      }
      else {
        this.billingAddressDetail.reset({
          billingAddress: [],
          billingState: [],
          billingPincode: [],
          billingCity: [],
          billingDistrict: [],
          billingPostoffice: []
        }, { emitEvent: false });
      }
      this.billingAddressDetail.updateValueAndValidity()
    });
  }
  get statutoryInfo() { //getter for statutoryInfo formArray
    return this.VendorForm.get('statutoryInfo') as FormArray;
  }
  getStatutoryInfo() {
    return this.VendorForm.controls.statutoryInfo as FormGroup;
  }
  get CorrespondingAddressDetail() {
    return this.VendorForm.controls.correspondingAddressDetail as FormGroup;
  }
  get billingAddressDetail() {
    return this.VendorForm.controls.billingAddressDetail as FormGroup;
  }
  addStatutoryInfo() {
    this.statutoryInfo.push(this.formBuilder.group({
      statutoryName: ['', Validators.required],
      info: ['', Validators.required]
    }));
  }
  deleteStatutoryInfo(index) {
    if (this.statutoryInfo.controls.length > 1)
      this.statutoryInfo.removeAt(index);
    else
      this.toastr.info("All rows cannot be removed");
  }
  setFormData(dialogData: any) {
    this.VendorForm.patchValue({
      vendorId: dialogData.vendorId,
      vendorName: dialogData.vendorName,
      vendorType: dialogData.vendorTypeId,
      phoneNo: dialogData.phoneNo,
      email: dialogData.email,
      contactPersonNo: dialogData.contactPersonNo,
      contactPersonName: dialogData.contactPersonName,
      contactPersonEmail: dialogData.contactPersonEmail,
      isActive: dialogData.isActive,
      remarks: dialogData.remarks
    });
    this.CorrespondingAddressDetail.patchValue({
      correspondingAddress: dialogData.correspondingAddress,
      correspondingState: dialogData.correspondingState,
      correspondingPincode: dialogData.correspondingPincode,
      correspondingCity: dialogData.correspondingCity,
      correspondingDistrict: dialogData.correspondingDistrict,
      correspondingPostoffice: dialogData.correspondingPostoffice
    });
    this.CorrespondingAddressDetail.updateValueAndValidity();
    this.billingAddressDetail.patchValue({
      billingAddress: dialogData.billingAddress,
      billingState: dialogData.billingState,
      billingPincode: dialogData.correspondingPincode,
      billingCity: dialogData.billingCity,
      billingDistrict: dialogData.billingDistrict,
      billingPostoffice: dialogData.billingPostoffice
    });
    this.billingAddressDetail.updateValueAndValidity();
    if (dialogData.correspondingAddress == dialogData.billingAddress &&
      dialogData.correspondingState == dialogData.billingState &&
      dialogData.correspondingPincode == dialogData.correspondingPincode &&
      dialogData.correspondingCity == dialogData.billingCity &&
      dialogData.correspondingDistrict == dialogData.billingDistrict &&
      dialogData.correspondingPostoffice == dialogData.billingPostoffice
    ) {
      this.billingAddressDetail.controls.sameAddress.patchValue(true);
    }
    else {
      this.billingAddressDetail.controls.sameAddress.patchValue(false);
    }
    if(this.dialogData.statutoryInfo!=null){
      this.dialogData.statutoryInfo.forEach(x => {
        this.statutoryInfo.push(this.formBuilder.group({
          statutoryName: [x.statutoryName],
          info: [x.info]
        }))
      });
      this.statutoryInfo.updateValueAndValidity();
    }
    
  }

  onSubmit(VendorForm: any) {
    if (VendorForm.invalid) {
      return;
    }
    else {
      this.getFormData(VendorForm);
      if (VendorForm.controls.vendorId.value > 0) {
        this.service.updateVendor(this.model).subscribe((response: any) => {
          if (response.isIdentityExist == true) {
            if (response.isSuccess == true) {
              this.closeModal();
              this.toastr.success(response.responseMsg);
            }
            else {
              this.toastr.error(response.responseMsg);
            }
          }
          else {
            this.toastr.error(response.responseMsg);
            setTimeout(() => {
              this.router.navigate(["./login"]);
            }, 1000);
          }
        });
      }
      else {
        this.service.addVendor(this.model).subscribe((response) => {
          if (response.isIdentityExist == true) {
            if (response.isSuccess == true) {
              this.closeModal();
              this.toastr.success(response.responseMsg);
            }
            else {
              this.toastr.error(response.responseMsg);
            }
          }
          else {
            this.toastr.error(response.responseMsg);
            setTimeout(() => {
              this.router.navigate(["./login"]);
            }, 1000);
          }
        });
      }
    }

  }
  getFormData(form: any) {
    this.model.vendorId = form.controls.vendorId.value;
    this.model.vendorName = form.controls.vendorName.value.trim();
    this.model.vendorTypeId = form.controls.vendorType.value;
    this.model.correspondingAddress = this.CorrespondingAddressDetail.controls.correspondingAddress.value;
    this.model.correspondingState = this.CorrespondingAddressDetail.controls.correspondingState.value.trim();
    this.model.correspondingPincode = this.CorrespondingAddressDetail.controls.correspondingPincode.value.trim();
    this.model.correspondingCity = this.CorrespondingAddressDetail.controls.correspondingCity.value.trim();
    this.model.correspondingDistrict = this.CorrespondingAddressDetail.controls.correspondingDistrict.value.trim();
    this.model.correspondingPostoffice = this.CorrespondingAddressDetail.controls.correspondingPostoffice.value.trim();
    this.model.billingAddress = this.billingAddressDetail.controls.billingAddress.value;
    this.model.billingState = this.billingAddressDetail.controls.billingState.value.trim();
    this.model.billingPincode = this.billingAddressDetail.controls.billingPincode.value.trim();
    this.model.billingCity = this.billingAddressDetail.controls.billingCity.value.trim();
    this.model.billingDistrict = this.billingAddressDetail.controls.billingDistrict.value.trim();
    this.model.billingPostoffice = this.billingAddressDetail.controls.billingPostoffice.value.trim();
    this.model.phoneNo = form.controls.phoneNo.value.trim();
    this.model.email = form.controls.email.value.trim();
    this.model.contactPersonNo = form.controls.contactPersonNo.value.trim();
    this.model.contactPersonName = form.controls.contactPersonName.value.trim();
    this.model.contactPersonEmail = form.controls.contactPersonEmail.value.trim();
    this.model.statutoryInfo = [...this.statutoryInfo.value];
    this.model.isActive = form.controls.isActive.value;
    this.model.remarks = form.controls.remarks.value;
  }
  closeModal() {
    this.VendorForm.reset();
    this.dialogRef.close();
  }
}
