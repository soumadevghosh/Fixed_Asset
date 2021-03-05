import { Component, OnInit, Inject } from '@angular/core';
import { RequisitionTypeModel } from './Shared/RequisitionTypeModel';
import { RequisitionTypeService } from './Shared/requisitionType.service';
import { AppSharedUrlComponent } from 'src/app/Shared/appSharedUrl.Component';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from 'src/app/Layout/Shared/loader.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-requisition.dialog',
  templateUrl: './requisitionType-dialog.component.html',
  providers:[RequisitionTypeModel, RequisitionTypeService]
})
export class RequisitionTypeDialogComponent extends AppSharedUrlComponent implements OnInit {
  constructor(private service:RequisitionTypeService, public model:RequisitionTypeModel, private toast:ToastrService,
    public dialogRef:MatDialogRef<RequisitionTypeDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData:RequisitionTypeModel,
    public loader:LoaderService, private router:Router) 
  { 
      super();
  }


  
  ngOnInit(){
      if(this.dialogData!=null){
          if(this.dialogData.RequisitionTypeId>0){
              this.setFormData(this.dialogData);
          }
          else{
              this.model.isActive = true;
              this.model.RequisitionTypeId = 0;
          }
      }
  }

  onSubmit(form:NgForm){
      if(form.invalid){
          return;
      }
      this.getFormData(form);
      if(form.value.RequisitionTypeId>0){
          this.service.UpdateRequisitionType(this.model).subscribe((res:any)=>{
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
                  setTimeout(()=>{
                      this.router.navigate(["./login"]);
                  }, 1000);
              }
          });
        }
        else{
            this.service.AddRequisitionType(this.model).subscribe((res:any)=>{
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
                    setTimeout(()=>{
                        this.router.navigate(["./login"]);
                    }, 1000);
                }
            });
        }
    }

    getFormData(form:NgForm){
        this.model.RequistionTypeName = form.value.RequistionTypeName;
        this.model.Description = form.value.Description;
        this.model.isActive = form.value.isActive;
        this.model.remarks = form.value.remarks;
    }

    setFormData(dialogData:any){
        this.model.RequisitionTypeId=dialogData.RequisitionTypeId,
        this.model.RequistionTypeName=dialogData.RequistionTypeName,
        this.model.Description=dialogData.Description,
        this.model.isActive=dialogData.isActive,
        this.model.remarks=dialogData.remarks
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
