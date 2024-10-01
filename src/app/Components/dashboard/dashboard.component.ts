import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Alert, ApiService } from '../../api.service'; // Ensure correct import

export interface ReportData {
     totalOrders: number;
     successfulOrders: number;
     failedOrders: number;
     pendingOrders: number;
   }

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'], // Fixed typo from 'styleUrl' to 'styleUrls'
})

export class DashboardComponent implements OnInit {
     displayedData: ReportData = {
          totalOrders: 0,
          successfulOrders: 0,
          failedOrders: 0,
          pendingOrders: 0,
        };
    isLoading$ = this.apiService.loading$;
    alert: Alert | null = null;

    constructor(private http: HttpClient, private apiService: ApiService) { }

    // Calling Initiate function
    ngOnInit() {
        this.apiService.alert$.subscribe(alert => {
            this.alert = alert;
            if (alert) {
                setTimeout(() => {
                    this.alert = null;
                }, 5000); // Auto-hide after 5 seconds
            }
        });
        this.getReport();
    }

    // generating Report for the current Month
    getReport(): void {
        this.apiService.getReports<ReportData[]>().subscribe(
            (response) => {
               console.log(response);
               if (response && response.message && response.message.counts) {
                    this.displayedData = response.message.counts; // Assign the counts directly
                } else {
                    console.error('Unexpected response structure', response);
                    //this.displayedData = {}; // Ensure it's an empty object on error
                }
                console.log(this.displayedData);
            },
            (error) => {
                console.error('Error loading data', error);
                this.alert = { message: 'Failed to load report data. Please try again later.', type: 'error' }; // Example alert
                setTimeout(() => {
                    this.alert = null;
                }, 5000); // Auto-hide after 5 seconds
            }
        );
    }
}
