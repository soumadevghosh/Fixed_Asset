import { Component, OnInit, Inject } from '@angular/core';
import { VendorOrderListService } from './Shared/VendorOrderList.service';
import { VendorOrderListModel } from './Shared/VendorOrdrList.model';
import { NgForm, FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../Layout/Shared/loader.service';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
//import { InventoryDepartmentDialogComponent } from '../InventoryDepartment/app.component.InventoryDeptDialog';

@Component({
    templateUrl: './app.VendorOrderDetails.component.html',
    providers: [VendorOrderListModel, VendorOrderListService]
})
export class VendorOrderDetailsComponent extends AppSharedUrlComponent implements OnInit {

    VendorName: string;
    VendorId: number;
    vendorList: any[];
    OrderType: string;
    File: File = null;
    items: any[]

    constructor(private service: VendorOrderListService, public model: VendorOrderListModel, private toast: ToastrService,
        // public dialogRef:MatDialogRef<ItemUnitMasterDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData:ItemUnitMasterModel,
        public loader: LoaderService, private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute) {
        super();
    }
    // ItemUnitMasterForm:FormGroup;
    VendorItemDetails: FormGroup;



    ngOnInit() {

        this.VendorId = this.route.snapshot.params['vendorId'];
        var VendorOrderId = (this.VendorId);
        this.service.getItemDetailsByVendorOrderId(VendorOrderId).subscribe((res: any) => {
            if (res.isIdentityExist == true) {
                if (res.isSuccess == true) {

                    this.items = res.VendorOrderList
                    if(this.items != null){


                        this.items.forEach((value, index)=>{

                            this.model.OrderType = value.OrderType;
                            this.model.OrderTypeName = value.OrderTypeName;
        
                            this.OrderType = this.model.OrderTypeName;

                            this.ItemDetails.push(this.formBuilder.group({
                                Item : [value.ItemName],
                                Gst : [value.GstPerUnit],
                                ItemCPrice: [value.ItemPerUnitCost],
                                // DRs: [value.ItemPerUnitCost],
                                // DPer: [value.ItemPerUnitCost],
                                // TAmount: [value.ItemPerUnitCost],
                                OQT: [value.ItemPerUnitCost],
                                RecQT: [value.TotalOrderQty],


                            }))
                        })
                        this.items = [];
                    }

                    // this.model.VendorName = res.VendorOrderList[0].VendorName;
                    // this.model.VendorId = res.VendorOrderList[0].VendorId;
                    // this.VendorItemDetails.controls.VendorName.setValue(this.model.VendorName);
                    // this.VendorItemDetails.controls.vid.setValue(this.model.VendorId);
                    // //this.VendorItemDetails.controls.VendorId.setValue(this.model.VendorId);
                    // //this.VendorItemDetails.controls.vendorId.patchValue(this.model.VendorId);
                    // this.VendorItemDetails.controls.vOid.setValue(res.VendorOrderList[0].VendorOrderId);
                    // this.VendorItemDetails.controls.Catagory.setValue("Catagory");
                    // this.VendorItemDetails.controls.product.setValue(res.VendorOrderList[0].ItemName);
                    // this.VendorItemDetails.controls.Item.setValue(res.VendorOrderList[0].ItemName);
                    // this.VendorItemDetails.controls.Gst.setValue(res.VendorOrderList[0].GstPerUnit);
                    // this.VendorItemDetails.controls.ItemCPrice.setValue(res.VendorOrderList[0].ItemPerUnitCost);
                    // //this.VendorItemDetails.controls.DRs.setValue(res.VendorOrderList[0].ItemPerUnitCost);
                    // this.model.ItemPerUnitCost = res.VendorOrderList[0].ItemPerUnitCost;
                    // this.model.TotalOrderQty = res.VendorOrderList[0].TotalOrderQty;
                    // var totalPrice = (this.model.ItemPerUnitCost * this.model.TotalOrderQty);
                    // this.VendorItemDetails.controls.TAmount.setValue(totalPrice);
                    // this.VendorItemDetails.controls.OQT.setValue(this.model.TotalOrderQty);

                    // this.model.OrderType = res.VendorOrderList[0].OrderType;
                    // this.model.OrderTypeName = res.VendorOrderList[0].OrderTypeName;

                    // this.OrderType = this.model.OrderTypeName;


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

        this.VendorItemDetails = new FormGroup({
            // ServiceMasterId:new FormControl(null),
            //    '',[Validators.pattern('^[a-zA-Z ]*$'),Validators.required]
            VendorName: new FormControl(null),
            vid: new FormControl(null),
            vOid: new FormControl(null),
            Catagory: new FormControl(null),
            product: new FormControl(null),
            Item: new FormControl(null),
            Gst: new FormControl(null),
            ItemCPrice: new FormControl(null),
            DRs: new FormControl(null),
            DPer: new FormControl(null),
            TAmount: new FormControl(null),
            OQT: new FormControl(null),
            RecQT: new FormControl(null),
            ChallanNo: new FormControl(null),
            ChallanDate: new FormControl(null),
            ItemDetails : this.formBuilder.array([])
            // ChallanUpload:new FormControl(null),

            // vendorId: new FormControl(null),

        });
    }

    get ItemDetails() {
        return this.VendorItemDetails.get('ItemDetails') as FormArray;
      }


    // selectFile(file: FileList) {
    //     this.File = file.item(0)
    //     this.service.saveFile(this.File).subscribe((res) => {
    //       if(res == null){
    //         this.toastr.warning("Please Choose Image or PDF File")
    //         setTimeout(()=>{
    //           this.displayedFile.nativeElement.value = ''
    //         },200)
    //       }
    //       else{
    //         this.model.QuotationFile = res.toString();
    //         this.removeButton = true;
    //         this.viewButton = true;
    //       }
    //     })

    //   }


}