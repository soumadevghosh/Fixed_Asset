import { Injectable } from '@angular/core';
import { AppSharedUrlComponent } from 'src/app/Shared/appSharedUrl.Component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuotationEntryModel } from './quotation-entry-model';

@Injectable({
  providedIn: 'root'
})
export class QuotationEntryService extends AppSharedUrlComponent {

  constructor(private http: HttpClient) {
    super();
  }

  getQuotationEntryList(): Observable<QuotationEntryModel> {
    return this.http.get<QuotationEntryModel>(this.baseUrl + "/api/Admin/getQuotationEntryList")
  }

  getItemCategoryById(inventoryDeptId: number): Observable<QuotationEntryModel> {
    return this.http.post<QuotationEntryModel>(this.baseUrl + "/api/Admin/getItemCategoryByInventoryDeptId?inventoryDeptId=" + inventoryDeptId, {
      header: new HttpHeaders({
        'content-type': 'application/json'
      })
    });
  }

  addQuotationEntry(model: QuotationEntryModel): Observable<QuotationEntryModel> {
    return this.http.post<QuotationEntryModel>(this.baseUrl + "/api/Admin/addQuotationEntry", model, {
      headers : new HttpHeaders({
        'content-type' : 'application/json'
      })
    })
    
  }

  getQuotationEntryById(QuotationEntryId: number): Observable<QuotationEntryModel> {
    return this.http.post<QuotationEntryModel>(this.baseUrl + "/api/Admin/getQuotationEntryById?QuotationEntryId=" + QuotationEntryId, {
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    });
  }

  updateQuotationEntry(model : QuotationEntryModel) : Observable<QuotationEntryModel> {
    return this.http.post<QuotationEntryModel>(this.baseUrl + "/api/Admin/updateQuotationEntry", model, {
      headers : new HttpHeaders({
        'content-type': 'application/json'
      })
    })
  }

  saveFile(file : File) {
    const formData : FormData = new FormData();
    formData.append("UploadedFile", file);
    return this.http.post(this.baseUrl + "/api/CommonApi/saveFile", formData)

  }

  deleteFile(model : QuotationEntryModel) : Observable<QuotationEntryModel>{
    return this.http.post<QuotationEntryModel>(this.baseUrl + "/api/Admin/deleteFile", model, {
      headers : new HttpHeaders({
        'content-type' : 'application/json'
      })
    })
  }

  ViewFile(model : QuotationEntryModel) : Observable<QuotationEntryModel>{
    return this.http.post<QuotationEntryModel> (this.baseUrl + "/api/Admin/ViewFile" , model, {
      headers : new HttpHeaders({
        'content-type' : 'application/json'
      })
    })
  }

}
