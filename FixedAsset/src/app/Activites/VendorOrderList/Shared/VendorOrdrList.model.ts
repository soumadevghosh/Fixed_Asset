import { SharedModel } from '../../../Shared/appShared.model'
export class VendorOrderListModel extends SharedModel{
   
    VendorOrderId:number;
    VendorId :number;
    VendorName :string;
    OrderType:number; //challan or receipt id
    OrderTypeName :string; //challan or receipt name
    VendorOrderNo :string;
    TotalOrderQty :number;
    TotalGst :number;
    TotalDiscount :number;

    VendorOrderItemId :number;
    ItemId :number;
    ItemName :string;
    ItemPerUnitCost :number;
    GstPerUnit :number;
    Quantity :number;
    DiscountPerUnit:number;
    GstPercentage :number;
    DiscountPercentage:number;

    ProductCatagoryId :number;
    ProductCatagoryName :string;
    ProductId :number;
    ProductName :string;

   VendorOrderList :any[];
    vendorItem:any[];
}