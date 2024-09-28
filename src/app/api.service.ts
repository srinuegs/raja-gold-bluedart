import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

export interface ApiResponse {
     status: string;
     message: string;
}
export interface BookingData {
     id: number;
     name: string;
     email: string;
     date: string;
     contact: number;
}
export interface RequestObject {
     id: number;
     name: string;
     status: string | null;
     generatedId: string | null;
}

export interface Alert {
     type: 'success' | 'error' | 'info';
     message: string;
}

@Injectable({
     providedIn: 'root'
})

export class ApiService {
     private apiUrl = 'http://localhost:3090'; // Replace with your API URL

     constructor(private http: HttpClient) { }

     // Getting Orders List
     getData<ApiResponse>(): Observable<any> {
          this.show();
          return this.http.get<ApiResponse>(`${this.apiUrl}/orders`).pipe(
               finalize(() => this.hide()));
     }

     // Placing Order or Creating Orders
     postData(data: any): Observable<ApiResponse> { // Specify ApiResponse as the type
          this.show();
          return this.http.post<ApiResponse>(`${this.apiUrl}/order`, data).pipe(
               finalize(() => this.hide()));
     }

     // Update Order record in Datase
     putData(data: any): Observable<ApiResponse> { // Specify ApiResponse as the type
          this.show();
          return this.http.put<ApiResponse>(`${this.apiUrl}/order`, data).pipe(
               finalize(() => this.hide()));
     }

     // Update Order record based on Stats in Datase
     updateStatus(data: any): Observable<ApiResponse> { // Specify ApiResponse as the type
          this.show();
          return this.http.put<ApiResponse>(`${this.apiUrl}/statusUpdate`, data).pipe(
               finalize(() => this.hide()));
     }

     // Getting Consolidated report for Dash Board
     getReports<ApiResponse>(): Observable<any> {
          this.show();
          return this.http.get<ApiResponse>(`${this.apiUrl}/getReports`).pipe(
               finalize(() => this.hide()));
     }

     // Sending Trackit ID to User WhatsApp Mobile number 
     sendMessage(phoneNumber: string, message: string): void {
          const encodedMessage = encodeURIComponent(message);
          const url = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
          window.open(url, '_blank');
     }

     //Conver Uploaded exce file to request object for saving the data in database
     convertArrayToObjects(dataArray: any[][], validIds: string[]): RequestObject[] {
          // Extract headers from the first row
          const headers = dataArray[0];
          // Convert the remaining rows to objects
          const objectsArray = dataArray.slice(1).map(row => {
               const obj: any = {};
               row.forEach((value: any, index: number) => {
                    obj[headers[index]] = value;
               });
               const referenceNumber = obj["Reference No *"];
               if (validIds.includes(referenceNumber)) {
                    return obj as RequestObject;
               } else {
                    return null; 
               }
          });
          return objectsArray.filter(item => item !== null) as RequestObject[];
     }

     private loadingSubject = new BehaviorSubject<boolean>(false);
     public loading$ = this.loadingSubject.asObservable();

     show() {
          this.loadingSubject.next(true);
     }

     hide() {
          this.loadingSubject.next(false);
     }

     private alertSubject = new BehaviorSubject<Alert | null>(null);

     alert$ = this.alertSubject.asObservable();

     showAlert(alert: Alert) {
          this.alertSubject.next(alert);
          // Auto-hide alert after 5 seconds
          setTimeout(() => this.clearAlert(), 5000);
     }

     clearAlert() {
          this.alertSubject.next(null);
     }
}