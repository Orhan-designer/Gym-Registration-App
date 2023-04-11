import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = 'http://localhost:3000/enquiry';

  constructor(private http: HttpClient) { }

  postRegistration(registerObj: User) {
    return this.http.post<User>(`${this.baseUrl}`, registerObj);
  }

  getRegisterUser() {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  updateRegisterUser(updateObj: User, id: number) {
    return this.http.put<User>(`${this.baseUrl}/${id}`, updateObj);
  }

  deleteRegisterUser(id: number) {
    return this.http.delete<User>(`${this.baseUrl}/${id}`);
  }

  getRegisterUserById(id: number) {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }
}
