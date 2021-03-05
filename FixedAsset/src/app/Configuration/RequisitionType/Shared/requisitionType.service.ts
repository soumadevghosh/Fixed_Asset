import { Injectable } from '@angular/core';
import { AppSharedUrlComponent } from 'src/app/Shared/appSharedUrl.Component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequisitionTypeModel } from './RequisitionTypeModel';

@Injectable()
export class RequisitionTypeService extends AppSharedUrlComponent {

  constructor(private http:HttpClient) {
    super();
  }

   getRequisition(): Observable<RequisitionTypeModel>{
     return this.http.get<RequisitionTypeModel>(this.baseUrl+"/api/Admin/getRequisitionType");
   }

   AddRequisitionType(group:RequisitionTypeModel):Observable<RequisitionTypeModel>{
      return this.http.post<RequisitionTypeModel>(this.baseUrl  + "/api/Admin/addRequisitionType",group,{
          headers:new HttpHeaders({
              'content-type': 'application/json'
          })
      });
    }

    UpdateRequisitionType(group:RequisitionTypeModel):Observable<RequisitionTypeModel>{
      return this.http.post<RequisitionTypeModel>(this.baseUrl  + "/api/Admin/updateRequistionType",group,{
          headers:new HttpHeaders({
              'content-type': 'application/json'
          })
      });
    }

    DeleteRequisitionType(RequisitionTypeId:number):Observable<RequisitionTypeModel>{
      return this.http.post<RequisitionTypeModel>(this.baseUrl + "/api/Admin/deleteRequistionType?RequisitionTypeId="+RequisitionTypeId,{
        headers:new HttpHeaders({
          'content-type': 'application/json'
        })
      });
    }
}
