//import { Component, Inject } from '@angular/core';

export enum RequesitionStatusEnum
{
    Pending = 1,
    AcceptedByInventoryDeratment = 2,
    RejectedByInventoryDeratment = 3,
    ResolvedByInventoryDeratment = 4,
    ForwordedToHQInventoryDeratment = 5,
    ForwordedToProcurementInventoryDeratment = 6,
    ExceptedByProcurementExecutive = 7,
    RejectedByProcurementExecutive = 8,
    ExceptedByHQInventoryDeratmentExecutive = 9,
    RejectedByHQInventoryDeratmentExecutive = 10,
    OrderedToSupplierByUnitProcurementExecutive = 11,
    OrderedToSupplierByUnitHQProcurementExecutive = 12
}