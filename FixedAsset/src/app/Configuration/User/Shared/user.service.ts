import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSharedUrlComponent } from 'src/app/Shared/appSharedUrl.Component';
import { UserModel } from './user.model';
import { Observable } from 'rxjs';

@Injectable()
export class UserService extends AppSharedUrlComponent {

  constructor(private http: HttpClient) { super(); }
  headers = new HttpHeaders({
    'content-type': 'application/json'
  });

  getUser(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.baseUrl}/api/Admin/getUser`);
  }
  addUser(model: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.baseUrl}/api/Admin/addUser`, model, { headers: this.headers });
  }
  updateUser(model: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.baseUrl}/api/Admin/updateUser`, model, { headers: this.headers});
  }
  deleteUser(userId: number): Observable<UserModel> {
    return this.http.post<UserModel>(this.baseUrl + "/api/Admin/deleteUser?userId=" + userId, { headers: this.headers});
  }
}
