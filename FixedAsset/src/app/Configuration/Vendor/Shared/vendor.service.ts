import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSharedUrlComponent } from 'src/app/Shared/appSharedUrl.Component';
import { VendorModel } from './vendor.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorService extends AppSharedUrlComponent{

  constructor(private http:HttpClient) { super(); }
  headers = new HttpHeaders({
    'content-type': 'application/json'
  });
  getVendor(): Observable<VendorModel> {
    return this.http.get<VendorModel>(`${this.baseUrl}/api/Admin/getVendors`);
  }
  addVendor(model: VendorModel): Observable<VendorModel> {
    return this.http.post<VendorModel>(`${this.baseUrl}/api/Admin/addVendor`, model, { headers: this.headers });
  }
  updateVendor(model: VendorModel): Observable<VendorModel> {
    return this.http.post<VendorModel>(`${this.baseUrl}/api/Admin/updateVendor`, model, { headers: this.headers});
  }
  deleteVendor(vendorId: number): Observable<VendorModel> {
    return this.http.post<VendorModel>(this.baseUrl + "/api/Admin/deleteVendor?vendorId=" + vendorId, { headers: this.headers});
  }
  getStatutoryInfo(vendorId: number):Observable<VendorModel>{
    return this.http.post<VendorModel>(this.baseUrl + "/api/Admin/getStatutoryInfo?vendorId=" + vendorId, {headers: this.headers});
  }
}
