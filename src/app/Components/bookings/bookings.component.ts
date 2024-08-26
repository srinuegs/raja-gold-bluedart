import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import {HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../api.service'; 
export interface BookingData {
  id: number;
  name: string;
  email: string;
  date: string;
  contact: number;
}

interface EditableBookingData extends BookingData {
  dateStr: string;
}

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  data: any[] = []; 
  masterData: any[] =[];
  requestData: any[] =[];
  constructor(private http: HttpClient,private apiService: ApiService) {}
  originalData: BookingData[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com',date: '2024-01-15',contact:9966961096 },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com',date:'2024-02-20',contact:9966961096 },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com',date: '2024-03-10',contact:9966961096 },
    { id: 4, name: 'Bob Brown', email: 'bob.brown@example.com', date: '2024-04-05',contact:9966961096 },
    { id: 5, name: 'John Doe', email: 'john.doe@example.com', date:'2024-01-15',contact:9966961096 },
    { id: 6, name: 'Jane Smith', email: 'jane.smith@example.com', date: '2024-03-10',contact:9966961096 },
    { id: 7, name: 'Alice Johnson', email: 'alice.johnson@example.com', date: '2024-04-05',contact:9966961096 },
    { id: 8, name: 'Jane Smith', email: 'jane.smith@example.com',date:'2024-02-20',contact:9966961096 },
    // Add more data here
  ];
  
  displayedData: BookingData[]  = [];
  currentPage = 1;
  pageSize = 10;
  searchQuery = '';
  filterDate: string | null = null;
  sortColumn: keyof BookingData = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  editData: EditableBookingData | null = null;
  jsonData: any;
  uploadFilterDate: string = '';  // Date input bound to this property


  ngOnInit() {
    this.updateDisplayedData();
    this.loadData();
  }

  loadData(): void {
    this.http.get<any[]>('assets/masterdata.json').subscribe(
      (data) => {
        this.data = data;
        console.log(this.data);  // To verify data loading
      },
      (error) => {
        console.error('Error loading data', error);
      }
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get filteredData(): BookingData[] {
    let data = this.originalData.filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    // Filter by date
    const parsedFilterDate = this.parseDate(this.filterDate);
    if (parsedFilterDate) {
      data = data.filter(item => {
        return item.date === this.filterDate;
      });
    }

    // Sort
    data.sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }

  // Display Master data
  updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedData = this.filteredData.slice(startIndex, endIndex);
  }

  // Searching the String parameter
  onSearch(query: string) {
    this.searchQuery = query;
    this.updateDisplayedData();
  }

  // Searching data by Updating the data object
  onDateChange() {
    this.updateDisplayedData();
  }

  // Sorting the data base fields
  onSort(column: keyof BookingData) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.updateDisplayedData();
  }

  // Pagination change data
  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedData();
  }

  // Open Edit Modal
  openEditModal(item: BookingData) {
    this.editData = { 
      ...item, 
      dateStr: item.date 
    };
  }

  // Save Edit Modal data
  saveEdit() {
    if (this.editData) {
      const index = this.originalData.findIndex(d => d.id === this.editData?.id);
      if (index > -1) {
        const updatedDate = this.parseDate(this.editData.dateStr);
        if (updatedDate) {
          this.originalData[index] = {
            ...this.editData,
            date: updatedDate
          };
          this.updateDisplayedData();
        }
      }
      this.editData = null;
    }
  }

  // Close edit Modal data
  closeEditModal() {
    this.editData = null;
  }

  // Updating object after editing
  updateEditDate() {
    if (this.editData) {
      const updatedDate = this.parseDate(this.editData.dateStr);
      if (updatedDate) {
        this.editData.date = updatedDate;
      }
    }
  }

// Parsing date values
  parseDate(dateStr: string | null): string | null {
   if (!dateStr) return null;

  // Split the input string into components
  const [day, month, year] = dateStr.split('-');

  // Validate components and format them correctly
  if (!day || !month || !year || isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year))) {
    return null;
  }

  // Return formatted date string in dd/mm/yyyy
  return `${day}/${month}/${year}`;
  }

  // Send whataApp Message
  sendWhatsAppMessage(item: BookingData){
    
    //this.sentStatusMessage(item.contact) 
    let phoneNumber = this.getPhoneNumber((item.contact).toString());
    const message = 'Hello, this is a test message from Angular!';
    this.apiService.sendMessage(phoneNumber, message);
  }
  
  //Number to String
  getPhoneNumber(number: string) :string {
    return number; // Correctly returns a string
  }
  
  // Exporting or Downloading Data To Excel file
  exportToExcel(): void {
    // Convert the data to a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.originalData);

    // Create a new workbook and append the worksheet to it
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Convert the workbook to a binary string
    const wbout: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the binary string and save the file
    const fileName = 'data.xlsx';
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
  }

  // Uploading Excel for reading the data 
  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        this.jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        this.requestData = this.apiService.convertArrayToObjects(this.jsonData);
        console.log(this.requestData);
        
      };
      reader.readAsBinaryString(file);
    }
  }
}