import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
@Component({
templateUrl:'./app.confirmDialog.component.html'
})
export class MatConfirmDialog{
    message :string;
    constructor(public dialogRef: MatDialogRef<MatConfirmDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.message=this.data;
        }
        onConfirm(): void {
        this.dialogRef.close(true);
        }
        onDismiss(): void {
        this.dialogRef.close(false);
      }
}