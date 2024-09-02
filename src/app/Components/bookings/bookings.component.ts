import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../api.service';

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
    originalData: BookingData[] = [];
    displayedData: BookingData[] = [];
    requestData: any[] = [];
    currentPage = 1;
    pageSize = 10;
    searchQuery = '';
    filterDate: string | null = null;
    sortColumn: keyof BookingData = 'ReferenceNumber';
    sortDirection: 'asc' | 'desc' = 'asc';
    editData: EditableBookingData | null = null;
    jsonData: any;
    uploadFilterDate: string = '';  // Date input bound to this property
    selectedItems: Set<number> = new Set<number>();

    constructor(private http: HttpClient, private apiService: ApiService) { }

    ngOnInit() {
        //this.loadData();
        this.getBookingList();
    }

    // loadData(): void {
    //     this.http.get<BookingData[]>('assets/masterdata1.json').subscribe(
    //         (data) => {
    //             this.originalData = data;
    //             this.updateDisplayedData();
    //             console.log(this.originalData);  // To verify data loading
    //         },
    //         (error) => {
    //             console.error('Error loading data', error);
    //         }
    //     );
    // }
    // refreshData(): void {
    //         this.searchQuery = '';
    //         this.filterDate = null; // or ''
    //         this.updateDisplayedData();
    //     }
    // }
    resetFilters(): void {
        this.searchQuery = '';
        this.filterDate = null; // or ''
        this.updateDisplayedData();
    }
    getBookingList(): void {
        this.apiService.getData<BookingData[]>().subscribe(
            (response) => {
                // console.log(JSON.stringify(response));
                // console.log('Original data type:', typeof this.originalData);
                // console.log('Original data value:', this.originalData);
                this.originalData = response.message;
                this.updateDisplayedData();
                console.log(this.originalData);  // To verify data loading
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
            item.ReferenceNumber.toString().toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.CompanyName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.ReceiverName.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

        if (this.filterDate) {
            data = data.filter(item => item.PickupDate === this.filterDate);
        }


        // Sort
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

    updateDisplayedData() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.displayedData = this.filteredData.slice(startIndex, endIndex);
        console.log(this.displayedData);
    }

    onSearch(query: string) {
        this.searchQuery = query;
        this.updateDisplayedData();
    }

    onDateChange() {
        this.updateDisplayedData();
    }

    onSort(column: keyof BookingData) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.updateDisplayedData();
    }

    onPageChange(page: number) {
        if (page < 1) page = 1;
        if (page > this.totalPages) page = this.totalPages;
        this.currentPage = page;
        this.updateDisplayedData();
    }

    openEditModal(item: BookingData) {
        this.editData = {
            ...item,
            dateStr: item.PickupDate
        };
    }

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
                    this.updateDisplayedData();
                }
            }
            this.editData = null;
        }
    }

    closeEditModal() {
        this.editData = null;
    }
    updateEditDate() {
        if (this.editData) {
            const updatedDate = this.parseDate(this.editData.dateStr);
            if (updatedDate) {
                this.editData.PickupDate = updatedDate.toISOString(); // Ensure date is in ISO format
            }
        }
    }
    parseDate(dateStr: string | null): Date | null {
        if (!dateStr) return null;

        // Split the input string into components
        const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));

        // Validate components and format them correctly
        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

        // Return Date object
        return new Date(year, month - 1, day); // month is zero-based in Date
    }

    sendWhatsAppMessage(item: BookingData) {
        try {
            let phoneNumber = this.getPhoneNumber(item.ReceiverMobile);
            const message = 'Hello, this is a test message from Angular!';
            this.apiService.sendMessage(phoneNumber, message);
        } catch (e) {
            console.error('Error sending message:', e);
        }
    }

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

    onSelectionChange(item: BookingData, isChecked: boolean) {
        if (isChecked) {
            this.selectedItems.add(item.ReferenceNumber);
        } else {
            this.selectedItems.delete(item.ReferenceNumber);
        }
    }

    exportToExcel(): void {
        const selectedData = this.originalData.filter(item => this.selectedItems.has(item.ReferenceNumber));

        if (selectedData.length === 0) {
            alert('No items selected for export.');
            return;
        }
        const preparedData = selectedData.map(item => ({
            'Reference No *': item.ReferenceNumber,
            'Billing Area': item.BillingArea,
            'Billing Customer Code *': '200034',
            'Pickup Date': item.PickupDate,
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
            'Invoice Number': item.InvoiceNumber,
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
            'Response Pickup Date': item.ResponsePicupDate,
            'Transaction Amount': item.TransactionAmount,
            'Wallet Balance': item.WalletBalance,
            'Available Booking Amount': item.AvailableBookingAmount,
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(preparedData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Waybill');

        const wbout: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
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