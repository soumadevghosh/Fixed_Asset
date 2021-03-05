import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatConfirmDialog } from './app.confirmDialog.component';
import { Observable } from 'rxjs';
@Injectable({
    providedIn:'root'
})
export class DialogService {
    constructor(private dialog:MatDialog){}
    openConfirmDialog(dialogData:string): Observable<boolean> {
        const dialogRef = this.dialog.open(MatConfirmDialog, {
            width:'390px',
            disableClose:true,
            data: dialogData
        });
        return dialogRef.afterClosed();
      }
}