import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import {Alert, ApiService } from '../../api.service';

export interface BookingData {
    ReferenceNumber: number;
    BillingArea: string;
    ShipperName: string;
    PickupAddress: string;
    PickupPincode: string;
    CreatedBy: number;
    UpdatedBy: number;
    CompanyName: string;
    DeliveryAddress: string;
    DeliveryPincode: string;
    ProductCode: string;
    ProductType: string;
    SubProductCode: string;
    PakType: string;
    PieceCount: string;
    PickupDate: string; // Date as ISO String
    PickupTime: string;
    BillingCustomerCode: string;
    ActualWeight: string;
    DeclaredValue: string;
    RegisterPickup: string; // Date as ISO String
    Length: string;
    Breath: string;
    Height: string;
    ToPayCustomer: string;
    Sender: string | null;
    VendorCode: string | null;
    SenderMobile: string;
    ReceiverTelephone: string;
    ReceiverMobile: string;
    ReceiverName: string;
    ReceiverEmailId: string;
    ReceiverLatitude: string;
    ReceiverLongitude: string;
    ReceiverMaskedContactNumber: string;
    InvoiceNumber: string;
    SpecialInstruction: string;
    CollectableAmount: string;
    CommodityDetail1: string;
    CommodityDetail2: string;
    CommodityDetail3: string;
    IsReversePickup: string;
    ReferenceNo2: string;
    ReferenceNo3: string;
    ItemCount: string;
    OTPBasedDelivery: string;
    OfficeClosureTime: string;
    AWBNo: string;
    Status: string;
    Message: string;
    ClusterCode: string;
    DestinationArea: string;
    DestinationLocation: string;
    PickupTokenNo: string;
    ResponsePicupDate: string,
    TransactionAmount: string;
    WalletBalance: string;
    AvailableBookingAmount: string,
    createdAt: string; // ISO Date String
    updatedAt: string; // ISO Date String
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
    isLoading$ = this.apiService.loading$;
    originalData: BookingData[] = [];
    displayedData: BookingData[] = [];
    requestData: any[] = [];
    currentPage = 1;
    pageSize = 15;
    searchQuery = '';
    filterDate: string | null = null;
    sortColumn: keyof BookingData = 'ReferenceNumber';
    sortDirection: 'asc' | 'desc' = 'desc';
    editData: EditableBookingData | null = null;
    jsonData: any;
    uploadFilterDate: string = '';  // Date input bound to this property
    selectedItems: Set<number> = new Set<number>();
    alert: Alert  | null = null;
    validIds: string[] = [];

    constructor(private http: HttpClient, private apiService: ApiService) { }
      
    ngOnInit(): void {

     // Calling Notification alert
     this.apiService.alert$.subscribe(alert => {
          this.alert = alert;
          if (alert) 
          {
               setTimeout(() => {
                    this.alert = null;
               }, 5000);
          }
        });

        // Getting Order List
        this.getBookingList();
    }

    // Showing alert message
    getAlertClass() {
     if (!this.alert) return '';
          return `alert-${this.alert.type}`;
     }

     // Resetting Filleters
     resetFilters(): void {
          this.searchQuery = '';
          this.filterDate = null; // or ''
          this.updateDisplayedData();
     }

     // Calling Orders list API
     getBookingList(): void {
        this.apiService.getData<BookingData[]>().subscribe(
            (response) => {
                this.originalData = response.message;
                this.updateDisplayedData();
                console.log(this.originalData);
            },
            (error) => {
                console.error('Error loading data', error);
            }
        );
    }

    // Calculating Total Pages
    get totalPages(): number {
        return Math.ceil(this.filteredData.length / this.pageSize);
    }

     // Getting filtered Data
     get filteredData(): BookingData[] {
          let data = this.originalData.filter(item =>
               item.ReferenceNumber.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
               item.ReceiverMobile.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
               item.ReceiverName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
               item.Status.toLowerCase().includes(this.searchQuery.toLowerCase())            
          );

          if (this.filterDate) {
               data = data.filter(item => item.PickupDate === this.filterDate);
          }

          data.sort((a, b) => {
               const aValue = a[this.sortColumn];
               const bValue = b[this.sortColumn];

               // Handle number and string sorting
               if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return this.sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
               }
               if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
               }
               return 0;
          });

          return data;
     }

     // Updating Display Table
     updateDisplayedData() {
          const startIndex = (this.currentPage - 1) * this.pageSize;
          const endIndex = startIndex + this.pageSize;
          this.displayedData = this.filteredData.slice(startIndex, endIndex);
          //console.log(this.displayedData);
     }

     // Searching Data in Table
     onSearch(query: string) {
          this.searchQuery = query;
          console.log(this.searchQuery);
          this.updateDisplayedData();
     }

     // Entering Date
     onDateChange() {
          this.updateDisplayedData();
     }

     // Sorting the Data on Table header
     onSort(column: keyof BookingData) {
          if (this.sortColumn === column) {
               this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
          } else {
               this.sortColumn = column;
               this.sortDirection = 'asc';
          }
          this.updateDisplayedData();
     }

     // Calling Pagination
     onPageChange(page: number) {
          if (page < 1) page = 1;
          if (page > this.totalPages) page = this.totalPages;
          this.currentPage = page;
          this.updateDisplayedData();
     }

     // Opening Edit Record Modal
     openEditModal(item: BookingData) {
          this.editData = {
               ...item,
               dateStr: item.PickupDate
          };
     }

     // Closing Edit Record Modal
     closeEditModal() {
          this.editData = null;
     }

     // Saving updated Record Modal
     saveEdit() {
          if (this.editData) {
               const index = this.originalData.findIndex(d => d.ReferenceNumber === this.editData?.ReferenceNumber);
               if (index > -1) {
                    const updatedDate = this.parseDate(this.editData.dateStr);
                    if (updatedDate) {
                         this.originalData[index] = {
                         ...this.editData,
                         PickupDate: updatedDate.toISOString() // Ensure date is in ISO format
                         };
                         this.apiService.putData(this.originalData[index]).subscribe(
                         (response) => {
                              this.apiService.showAlert({
                                   type: 'success',
                                   message: response.message
                              });
                              this.getBookingList();
                         },
                         (error) => {
                              console.error('Error submitting data:', error);
                              this.apiService.showAlert({
                                   type: 'error',
                                   message: error
                              });
                         }
                    );
                    
                    }
               }
               this.editData = null;
          }
     }

     // Updating Edit Date
     updateEditDate() {
          if (this.editData) {
               const updatedDate = this.parseDate(this.editData.dateStr);
               if (updatedDate) {
                    this.editData.PickupDate = updatedDate.toISOString(); // Ensure date is in ISO format
               }
          }
     }

     // Parsing updated date
     parseDate(dateStr: string | null): Date | null {
          if (!dateStr) return null;

          // Split the input string into components
          const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));

          // Validate components and format them correctly
          if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

          // Return Date object
          return new Date(year, month - 1, day); // month is zero-based in Date
     }

     // Sending WhatsApp Message
     sendWhatsAppMessage(item: BookingData) {
          try {
               let TrackingID = item.AWBNo;
               let phoneNumber = this.getPhoneNumber(item.ReceiverMobile);
               const message = 'Thanks for Ordering items from "Raveendra Gold Covering Works" Your Tracking ID :' +item.AWBNo+' for  the name konda divya'+ item.ReceiverMobile ;
               this.apiService.sendMessage(phoneNumber, message);
          } catch (e) {
               console.error('Error sending message:', e);
          }
     }

     // Getting Phonenumber for WhatsApp Number
     getPhoneNumber(number: string): string {
          return number; // Assuming number is in correct format
     }

     // Add or remove All item from table
     toggleSelectAll(event: Event): void {
          const isChecked = (event.target as HTMLInputElement).checked;
          if (isChecked) {
               this.displayedData.forEach(item => this.selectedItems.add(item.ReferenceNumber));
          } else {
               this.selectedItems.clear();
          }
     }

     // Add or remove item from selectedItems
     toggleSelection(item: BookingData): void {
          if (this.selectedItems.has(item.ReferenceNumber)) {
               this.selectedItems.delete(item.ReferenceNumber);
          } else {
               this.selectedItems.add(item.ReferenceNumber);
          }
     }

     // Handle checkbox selection
     isAllSelected(): boolean {
          return this.displayedData.every(item => this.selectedItems.has(item.ReferenceNumber));
     }

     // values selection with Checkbox in table
     onSelectionChange(item: BookingData, isChecked: boolean) {
          if (isChecked) {
               this.selectedItems.add(item.ReferenceNumber);
          } else {
               this.selectedItems.delete(item.ReferenceNumber);
          }
     }

     // Converting Date formate
    

     // Exporting Excel file to download list of records
     exportToExcel(): void {
          const selectedData = this.originalData.filter(item => this.selectedItems.has(item.ReferenceNumber));
          
          if (selectedData.length === 0) {
            alert('No items selected for export.');
            return;
          }
      
          const preparedData = selectedData.map(item => ({
            'Reference No *': 'RVR ' + item.ReferenceNumber,
            'Billing Area': item.BillingArea,
            'Billing Customer Code *': '200034',
            'Pickup Date': this.convertDateFormat(item.PickupDate),
            'Pickup Time': item.PickupTime,
            'Shipper Name': item.ShipperName,
            'Pickup Address *': item.PickupAddress,
            'Pickup Pincode *': item.PickupPincode,
            'Company Name': item.CompanyName,
            'Delivery Address *': item.DeliveryAddress,
            'Delivery Pincode *': item.DeliveryPincode,
            'Product Code *': item.ProductCode,
            'Product Type *': item.ProductType,
            'Sub Product Code': item.SubProductCode,
            'Pack Type': item.PakType,
            'Piece Count *': item.PieceCount,
            'Actual Weight *': item.ActualWeight,
            'Declared Value': item.DeclaredValue,
            'Register Pickup': item.RegisterPickup,
            'Length': item.Length,
            'Breadth': item.Breath,
            'Height': item.Height,
            'To Pay Customer': item.ToPayCustomer,
            'Sender': item.Sender,
            'Vendor Code': item.VendorCode,
            'Sender Mobile': item.SenderMobile,
            'Receiver Telephone': item.ReceiverTelephone,
            'Receiver Mobile': item.ReceiverMobile,
            'Receiver Name': item.ReceiverName,
            'Receiver Email ID': item.ReceiverEmailId,
            'Receiver Latitude': item.ReceiverLatitude,
            'Receiver Longitude': item.ReceiverLongitude,
            'Receiver Masked Contact Number': item.ReceiverMaskedContactNumber,
            'Invoice Number': 'RVR' + item.ReferenceNumber,
            'Special Instruction': item.SpecialInstruction,
            'Collectable Amount': item.CollectableAmount,
            'Commodity Detail 1': item.CommodityDetail1,
            'Commodity Detail 2': item.CommodityDetail2,
            'Commodity Detail 3': item.CommodityDetail3,
            'Is Reverse Pickup': item.IsReversePickup,
            'Reference No 2': item.ReferenceNo2,
            'Reference No 3': item.ReferenceNo3,
            'Item Count': item.ItemCount,
            'OTP Based Delivery': item.OTPBasedDelivery,
            'Office Closure Time': item.OfficeClosureTime,
            'AWB No': item.AWBNo,
            'Status': item.Status,
            'Message': item.Message,
            'Cluster Code': item.ClusterCode,
            'Destination Area': item.DestinationArea,
            'Destination Location': item.DestinationLocation,
            'Pick Up Token No': item.PickupTokenNo,
            'Response Pickup Date': "",
            'Transaction Amount': item.TransactionAmount,
            'Wallet Balance': item.WalletBalance,
            'Available Booking Amount': item.AvailableBookingAmount,
          }));
      
          this.fillWaybillTemplate(preparedData);
        }
      
        fillWaybillTemplate(preparedData: any[]) {
          const templateUrl = 'assets/mater_template.xlsx';
      
          fetch(templateUrl)
            .then(response => response.arrayBuffer())
            .then(data => {
              const workbook = XLSX.read(data, { type: 'array' });
      
              // Access the "Waybill" sheet
              const waybillSheetName = 'Waybill';
              const worksheet = workbook.Sheets[waybillSheetName];
      
              // Fill the "Waybill" worksheet with prepared data
              this.fillWaybillWorksheet(worksheet, preparedData);
      
              // Generate a new Excel file
              const newWorkbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(newWorkbook, worksheet, waybillSheetName);
      
              // Write the new workbook to a binary string
              const excelBuffer = XLSX.write(newWorkbook, {
                bookType: 'xlsx',
                type: 'array',
              });
      
              // Save the file
              const blob = new Blob([excelBuffer], {
                type: 'application/octet-stream',
              });
              saveAs(blob, 'updated-waybill-template.xlsx');
            })
            .catch(err => console.error('Error loading the template:', err));
        }
      
        fillWaybillWorksheet(worksheet: XLSX.WorkSheet, preparedData: any[]) {
          const startRow = 1; // Assuming you want to start filling from row 5
          preparedData.forEach((item, index) => {
            const rowIndex = startRow + index; // Calculate the correct row index
      
            // Fill in the worksheet using the prepared data
            worksheet[`A${rowIndex}`] = { v: item['Reference No *'] };
            worksheet[`B${rowIndex}`] = { v: item['Billing Area'] };
            worksheet[`C${rowIndex}`] = { v: item['Billing Customer Code *'] };
            worksheet[`D${rowIndex}`] = { v: item['Pickup Date'] };
            worksheet[`E${rowIndex}`] = { v: item['Pickup Time'] };
            worksheet[`F${rowIndex}`] = { v: item['Shipper Name'] };
            worksheet[`G${rowIndex}`] = { v: item['Pickup Address *'] };
            worksheet[`H${rowIndex}`] = { v: item['Pickup Pincode *'] };
            worksheet[`I${rowIndex}`] = { v: item['Company Name'] };
            worksheet[`J${rowIndex}`] = { v: item['Delivery Address *'] };
            worksheet[`K${rowIndex}`] = { v: item['Delivery Pincode *'] };
            worksheet[`L${rowIndex}`] = { v: item['Product Code *'] };
            worksheet[`M${rowIndex}`] = { v: item['Product Type *'] };
            worksheet[`N${rowIndex}`] = { v: item['Sub Product Code'] };
            worksheet[`O${rowIndex}`] = { v: item['Pack Type'] };
            worksheet[`P${rowIndex}`] = { v: item['Piece Count *'] };
            worksheet[`Q${rowIndex}`] = { v: item['Actual Weight *'] };
            worksheet[`R${rowIndex}`] = { v: item['Declared Value'] };
            worksheet[`S${rowIndex}`] = { v: item['Register Pickup'] };
            worksheet[`T${rowIndex}`] = { v: item['Length'] };
            worksheet[`U${rowIndex}`] = { v: item['Breadth'] };
            worksheet[`V${rowIndex}`] = { v: item['Height'] };
            worksheet[`W${rowIndex}`] = { v: item['To Pay Customer'] };
            worksheet[`X${rowIndex}`] = { v: item['Sender'] };
            worksheet[`Y${rowIndex}`] = { v: item['Vendor Code'] };
            worksheet[`Z${rowIndex}`] = { v: item['Sender Mobile'] };
            worksheet[`AA${rowIndex}`] = { v: item['Receiver Telephone'] };
            worksheet[`AB${rowIndex}`] = { v: item['Receiver Mobile'] };
            worksheet[`AC${rowIndex}`] = { v: item['Receiver Name'] };
            worksheet[`AD${rowIndex}`] = { v: item['Receiver Email ID'] };
            worksheet[`AE${rowIndex}`] = { v: item['Receiver Latitude'] };
            worksheet[`AF${rowIndex}`] = { v: item['Receiver Longitude'] };
            worksheet[`AG${rowIndex}`] = { v: item['Receiver Masked Contact Number'] };
            worksheet[`AH${rowIndex}`] = { v: item['Invoice Number'] };
            worksheet[`AI${rowIndex}`] = { v: item['Special Instruction'] };
            worksheet[`AJ${rowIndex}`] = { v: item['Collectable Amount'] };
            worksheet[`AK${rowIndex}`] = { v: item['Commodity Detail 1'] };
            worksheet[`AL${rowIndex}`] = { v: item['Commodity Detail 2'] };
            worksheet[`AM${rowIndex}`] = { v: item['Commodity Detail 3'] };
            worksheet[`AN${rowIndex}`] = { v: item['Is Reverse Pickup'] };
            worksheet[`AO${rowIndex}`] = { v: item['Reference No 2'] };
            worksheet[`AP${rowIndex}`] = { v: item['Reference No 3'] };
            worksheet[`AQ${rowIndex}`] = { v: item['Item Count'] };
            worksheet[`AR${rowIndex}`] = { v: item['OTP Based Delivery'] };
            worksheet[`AS${rowIndex}`] = { v: item['Office Closure Time'] };
            worksheet[`AT${rowIndex}`] = { v: item['AWB No'] };
            worksheet[`AU${rowIndex}`] = { v: item['Status'] };
            worksheet[`AV${rowIndex}`] = { v: item['Message'] };
            worksheet[`AW${rowIndex}`] = { v: item['Cluster Code'] };
            worksheet[`AX${rowIndex}`] = { v: item['Destination Area'] };
            worksheet[`AY${rowIndex}`] = { v: item['Destination Location'] };
            worksheet[`AZ${rowIndex}`] = { v: item['Pick Up Token No'] };
            worksheet[`BA${rowIndex}`] = { v: item['Response Pickup Date'] };
            worksheet[`BB${rowIndex}`] = { v: item['Transaction Amount'] };
            worksheet[`BC${rowIndex}`] = { v: item['Wallet Balance'] };
            worksheet[`BD${rowIndex}`] = { v: item['Available Booking Amount'] };
          });
        }
      
        convertDateFormat(date: string): string {
          // Implement your date formatting logic here
          return new Date(date).toLocaleDateString(); // Example: format as 'MM/DD/YYYY'
        }

     

     // Generating FileName
     getFormattedDate(): string {
          const date = new Date();
          const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
          const year = date.getFullYear();
          
          return `${day}-${month}-${year}`;
     }

     // Importing Excel for reading the Status orders 
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
                    this.validIds = this.jsonData.slice(1) // Skip headers
                    .map((row: any[]) => row[0]) // Assuming the first column contains the ID (adjust index as needed)
                    .filter((ReferenceNumber: string) => ReferenceNumber); // Filter out any undefined or empty values
                    this.requestData = this.apiService.convertArrayToObjects(this.jsonData,  this.validIds);
                    console.log(this.requestData);
                    this.uploadData(this.requestData);

               };
               reader.readAsBinaryString(file);    
          }
     }

     // Generating Request object for saving records
     prepareRequestObjects(data: any[]): { AWBNo: string; Status: string; Message: string; ReferenceNumber: string }[] {
          return data.map(item => ({
               AWBNo: item["AWB No"] || "", // Use the appropriate field for AWB number
               Status: item["Status"] || "", // Use the appropriate field for Status
               Message: item["Message"] || "", // Use the appropriate field for Message
               ReferenceNumber: item["Reference No *"].replace("RVR", "") || "" // Use the appropriate field for ReferenceNumber
          }));
     }

     // Saving records w.r.t ReferenceNumber and Status.
     uploadData(data: BookingData[]) {
          const requestObjects = this.prepareRequestObjects(data);
          console.log(requestObjects);

          this.apiService.updateStatus(requestObjects).subscribe(
               (response) => {
                    this.apiService.showAlert({
                         type: 'success',
                         message: response.message
                    });
               },
               (error) => {
                    console.error('Error updating data:', error);
                    this.apiService.showAlert({
                         type: 'error',
                         message: error
                    });
               }
          );
     }
}