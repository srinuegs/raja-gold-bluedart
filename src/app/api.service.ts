import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse {
  status: string;
  message: string;
  // Add other fields as per your API response structure
}
export interface BookingData {
  id: number;
  name: string;
  email: string;
  date: string;
  contact:number;
}
export interface RequestObject  {
  id: number;
  name: string;
  status: string | null;
  generatedId: string | null;
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiUrl = 'http://localhost:3090'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  // Method to get data from the API
  getData(): Observable<any> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/orders`);
  }

  // Saving new record in Datase
  postData(data: any): Observable<ApiResponse> { // Specify ApiResponse as the type
    return this.http.post<ApiResponse>(`${this.apiUrl}/order`, data);
  }

  // Sending Trackit ID to User WhatsApp Mobile number 
  sendMessage(phoneNumber: string, message: string): void {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  }
  
  //Conver Uploaded exce file to request object for saving the data in database
  convertArrayToObjects(dataArray: any[][]): RequestObject[] {
    // Extract headers from the first row
    const headers = dataArray[0];
    
    // Convert the remaining rows to objects
    const objectsArray = dataArray.slice(1).map(row => {
      const obj: any = {};
      row.forEach((value: any, index: number) => {
        obj[headers[index]] = value;
      });
      return obj as RequestObject;
    });
    return objectsArray;
  }
}