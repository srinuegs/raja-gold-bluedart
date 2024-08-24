import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse {
  status: string;
  message: string;
  // Add other fields as per your API response structure
}
@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiUrl = 'https://api.example.com'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  // Method to get data from the API
  getData(): Observable<any> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/data`);
  }

  postData(data: any): Observable<ApiResponse> { // Specify ApiResponse as the type
    return this.http.post<ApiResponse>(`${this.apiUrl}/submit`, data);
  }
}