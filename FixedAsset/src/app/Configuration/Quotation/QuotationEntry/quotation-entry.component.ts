import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { QuotationEntryModel } from '../Shared/quotation-entry-model';
import { QuotationEntryService } from '../Shared/quotation-entry.service';
import { AppSharedUrlComponent } from 'src/app/Shared/appSharedUrl.Component';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/Layout/Shared/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ɵangular_material_src_cdk_a11y_a11y_b } from '@angular/cdk/a11y';

@Component({
  selector: 'app-quotation-entry',
  templateUrl: './quotation-entry.component.html',
  providers: [QuotationEntryModel, QuotationEntryService]
})
export class QuotationEntryComponent extends AppSharedUrlComponent implements OnInit {

  constructor(private service: QuotationEntryService, public model: QuotationEntryModel, private toastr: ToastrService,
    public QuotationEntryData: QuotationEntryModel, public loader: LoaderService, private router: Router, 
    private formBuilder: FormBuilder) { super() }

  Title: string;
  File: File = null;
  VendorList: any[];
  inventoryDepartmentList: any[];
  ItemGroupList: any[] = [];
  ItemCategoryList: any[] = [];
  ItemList: any[] = [];
  sgst: number;
  cgst: number;
  QuotationForm: FormGroup;
  items: any[]
  @Input() quotationId: number;
  removeButton: boolean;
  viewButton : boolean;
  isGridLoaded: boolean;
  isLoaded: boolean;
  @ViewChild('inputFile') displayedFile : ElementRef

  ngOnInit() {
    this.items = [];
    this.QuotationForm = new FormGroup({
      QuotationId: new FormControl(0),
      VendorId: new FormControl('', Validators.required),
      txthdnFileName : new FormControl(''),
      QuotationItemMapping: this.formBuilder.array([])
    });
    if (this.quotationId <= 0) {
      this.Title = "Add Quotation Entry";
      this.isLoaded = true;
      this.isGridLoaded = false;
      this.service.getQuotationEntryList().subscribe((res) => {
        if (res.isIdentityExist == true) {
          if (res.isSuccess == true) {
            this.model.VendorList = res.VendorList;
            this.model.InventoryDeptList = res.InventoryDeptList;
          }
        }
      });
      this.QuotationItemMapping.push(this.formBuilder.group({
        InventoryDeptId: [null, Validators.required],
        ItemGroupId: [null, Validators.required],
        ItemCategoryId: [null, Validators.required],
        ItemId: [null, Validators.required],
        UnitPrice: [null, [Validators.pattern('[0-9]+(\.[0-9][0-9]?)?'), Validators.required]],
        MinOrderQty: [null, [Validators.pattern('^[0-9]*$'), Validators.required]],
        CGST: [null],
        SGST: [null],
        IGST: [null]
      }))
    }
    else {
      this.Title = "Edit Quotation Entry";
      this.isLoaded = true;
      this.isGridLoaded = false;
      this.service.getQuotationEntryList().subscribe((res) => {
        if (res.isIdentityExist == true) {
          if (res.isSuccess == true) {
            this.model.VendorList = res.VendorList;
            this.model.InventoryDeptList = res.InventoryDeptList;
            this.model.QuotationId = res.QuotationId;
          }
        }
      });
      this.setFormData(this.quotationId);


    }
  }

  setFormData(quotationId: number) {
    this.service.getQuotationEntryById(quotationId).subscribe((res) => {
      if (res.isIdentityExist == true) {
        if (res.isSuccess == true) {
          if(res.QuotationFile != null){
            this.viewButton = true
            // this.QuotationForm.controls.txthdnFileName.patchValue(res.QuotationFile);
            this.model.QuotationFile = res.QuotationFile
          }
          this.QuotationForm.controls.VendorId.patchValue(res.VendorId);
          this.model.QuotationId = res.QuotationId;
          this.items = res.MappingList;
          if (this.items != null) {
            this.items.forEach((value, index) => {
              this.BindItemCategory(index, value.InventoryDeptId);
              this.BindItemGroup(index, value.InventoryDeptId, value.ItemCategoryId);
              this.BindItem(index, value.InventoryDeptId, value.ItemCategoryId, value.ItemGroupId);
              if (value.IGST == 0) {
                value.IGST = null;
              }
              this.QuotationItemMapping.push(this.formBuilder.group({
                InventoryDeptId: [value.InventoryDeptId],
                ItemCategoryId: [value.ItemCategoryId],
                ItemGroupId: [value.ItemGroupId],
                ItemId: [value.ItemId],
                UnitPrice: [value.UnitPrice],
                MinOrderQty: [value.MinOrderQty],
                CGST: [value.CGST],
                SGST: [value.SGST],
                IGST: [value.IGST]
              }))
            })
            this.items = [];
          }
        }
      }
    })
  }


  get QuotationItemMapping() {
    return this.QuotationForm.get('QuotationItemMapping') as FormArray;
  }

  getQuotationItemMapping() {
    return this.QuotationForm.controls.QuotationItemMapping as FormGroup;
  }

  addRow() {
    this.QuotationItemMapping.push(this.formBuilder.group({
      InventoryDeptId: [null, Validators.required],
      ItemGroupId: [null, Validators.required],
      ItemCategoryId: [null, Validators.required],
      ItemId: [null, Validators.required],
      UnitPrice: [null, [Validators.pattern('[0-9]+(\.[0-9][0-9]?)?'), Validators.required]],
      MinOrderQty: [null, [Validators.pattern('^[0-9]*$'), Validators.required]],
      CGST: [null],
      SGST: [null],
      IGST: [null],
    }));
  }

  deleteRow(index) {
    if (this.QuotationItemMapping.controls.length > 1) {
      this.QuotationItemMapping.removeAt(index);
      this.ItemGroupList.splice(index, 1);
      this.ItemCategoryList.splice(index, 1);
      this.ItemList.splice(index, 1);
    }
  }


  BindItemCategory(index: number, inventoryDeptId?: number) {
    if (this.items.length == 0) {
      this.QuotationItemMapping.at(index).get('ItemCategoryId').reset();
      this.QuotationItemMapping.at(index).get('ItemGroupId').reset();
      this.QuotationItemMapping.at(index).get('ItemId').reset();
      this.QuotationItemMapping.at(index).get('UnitPrice').reset();
      this.QuotationItemMapping.at(index).get('MinOrderQty').reset();
      this.QuotationItemMapping.at(index).get('CGST').reset();
      this.QuotationItemMapping.at(index).get('SGST').reset();
      this.QuotationItemMapping.at(index).get('IGST').reset();
      this.ItemGroupList[index] = null;
      this.ItemList[index] = null;
    }
    let InventoryDeptId = inventoryDeptId == null ? this.QuotationForm.value.QuotationItemMapping[index].InventoryDeptId : inventoryDeptId;
    this.service.getItemCategoryById(InventoryDeptId).subscribe((res) => {
      if (res.isIdentityExist == true) {
        if (res.isSuccess == true) {
          this.ItemCategoryList[index] = res.SelectedCategory;
        }
        else {
          this.toastr.error(res.responseMsg)
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

  BindItemGroup(index: number, inventoryDeptId?: number, itemCategoryId?: number) {
    if (this.items.length == 0) {
      this.QuotationItemMapping.at(index).get('ItemGroupId').reset();
      this.QuotationItemMapping.at(index).get('ItemId').reset();
      this.QuotationItemMapping.at(index).get('UnitPrice').reset();
      this.QuotationItemMapping.at(index).get('MinOrderQty').reset();
      this.QuotationItemMapping.at(index).get('CGST').reset();
      this.QuotationItemMapping.at(index).get('SGST').reset();
      this.QuotationItemMapping.at(index).get('IGST').reset();
      this.ItemList[index] = null
    }

    let InventoryDeptId: number = inventoryDeptId == null ? this.QuotationForm.value.QuotationItemMapping[index].InventoryDeptId : inventoryDeptId;
    let ItemCategoryId: number = itemCategoryId == null ? this.QuotationForm.value.QuotationItemMapping[index].ItemCategoryId : itemCategoryId;
    this.service.getQuotationEntryList().subscribe((res) => {
      if (res.isIdentityExist == true) {
        if (res.isSuccess == true) {
          this.ItemGroupList[index] = res.ItemGroupList.filter(x => x.InventoryDeptId == InventoryDeptId && x.ItemCategoryId == ItemCategoryId);
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

  BindItem(index: number, inventoryDeptId?: number, itemCategoryId?: number, itemGroupId?: number) {
    if (this.items.length == 0) {
      this.QuotationItemMapping.at(index).get('ItemId').reset();
      this.QuotationItemMapping.at(index).get('UnitPrice').reset();
      this.QuotationItemMapping.at(index).get('MinOrderQty').reset();
      this.QuotationItemMapping.at(index).get('CGST').reset();
      this.QuotationItemMapping.at(index).get('SGST').reset();
      this.QuotationItemMapping.at(index).get('IGST').reset();
    }

    let InventoryDeptId: number = inventoryDeptId == null ? this.QuotationForm.value.QuotationItemMapping[index].InventoryDeptId : inventoryDeptId;
    let ItemCategoryId: number = itemCategoryId == null ? this.QuotationForm.value.QuotationItemMapping[index].ItemCategoryId : itemCategoryId;
    let ItemGroupId: number = itemGroupId == null ? this.QuotationForm.value.QuotationItemMapping[index].ItemGroupId : itemGroupId;
    this.service.getQuotationEntryList().subscribe((res) => {
      if (res.isIdentityExist == true) {
        if (res.isSuccess == true) {
          this.ItemList[index] = res.ItemList.filter(x => x.inventoryDeptId == InventoryDeptId && x.itemCategoryId == ItemCategoryId && x.itemGroupId == ItemGroupId);
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

  getItemInfo(index: number, itemId?: number) {
    let ItemId: number = itemId == null ? this.QuotationForm.value.QuotationItemMapping[index].ItemId : itemId;
    this.service.getQuotationEntryList().subscribe((res) => {
      if (res.isIdentityExist == true) {
        if (res.isSuccess == true) {
          let itemlist = res.ItemList.filter(x => x.itemId == ItemId);
          let tax = itemlist[0].gstPercentage;
          this.sgst = (tax / 2);
          this.cgst = (tax / 2);
          this.QuotationItemMapping.at(index).get('CGST').patchValue(this.cgst);
          this.QuotationItemMapping.at(index).get('SGST').patchValue(this.sgst);
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

  selectFile(file: FileList) {
    this.File = file.item(0)
    this.service.saveFile(this.File).subscribe((res) => {
      if(res == null){
        this.toastr.warning("Please Choose Image or PDF File")
        setTimeout(()=>{
          this.displayedFile.nativeElement.value = ''
        },200)
      }
      else{
        this.model.QuotationFile = res.toString();
        this.removeButton = true;
        this.viewButton = true;
      }
    })

  }

  backToList() {
    this.isGridLoaded = true;
    this.isLoaded = false;
  }

  RemoveFile(){
    this.service.deleteFile(this.model).subscribe((response)=>{
      if(response.isIdentityExist ==  true){
        if(response.isSuccess == true){
          this.toastr.success(response.responseMsg)
          setTimeout(()=>{
            this.removeButton = false
            this.displayedFile.nativeElement.value = ''
            this.viewButton = false
          },300)
          
          
        }
      }
      else{
        this.toastr.error(response.responseMsg)
      }
    })
  }

  ViewFile(){
    this.service.ViewFile(this.model).subscribe((response)=>{
      if(response.isIdentityExist == true){
        if(response.isSuccess == true){
          let files = response.QuotationFile;
          let url = 'http://'+files
          window.open(url)
        }
      }
    })
  }

  onSubmit(QuotationForm: any) {
    if (QuotationForm.invalid) {
      return;
    }
    else {
      this.getFormData(QuotationForm);
      if (this.model.QuotationId == 0) {
        this.service.addQuotationEntry(this.model).subscribe((res) => {
          if (res.isIdentityExist == true) {
            if (res.isSuccess == true) {
              this.toastr.success(res.responseMsg);
              setTimeout(() => {
                this.isGridLoaded = true;
                this.isLoaded = false;
              }, 500)
            } else {
              this.toastr.error(res.responseMsg);
            }
          } else {
            this.toastr.error(res.responseMsg);
          }
        });
      }
      else {
        this.service.updateQuotationEntry(this.model).subscribe((response) => {
          if (response.isIdentityExist == true) {
            if (response.isSuccess == true) {
              this.toastr.success(response.responseMsg);
              setTimeout(() => {
                this.isGridLoaded = true;
                this.isLoaded = false;
              }, 500)
            } else {
              this.toastr.error(response.responseMsg);
            }
          } else {
            this.toastr.error(response.responseMsg);
          }
        })
      }

    }
  }

  getFormData(form: any) {
    this.model.QuotationId = this.quotationId;
    this.model.VendorId = form.value.VendorId;
    this.model.MappingList = form.value.QuotationItemMapping;
    // this.model.ImageFile = this.File;
    // console.log(this.model.ImageFile)
  }


}
