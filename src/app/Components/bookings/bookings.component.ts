import { Component, OnInit } from '@angular/core';

export interface BookingData {
  id: number;
  name: string;
  email: string;
  date: Date;
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
  originalData: BookingData[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', date: new Date('2024-01-15') },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', date: new Date('2024-02-20') },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', date: new Date('2024-03-10') },
    { id: 4, name: 'Bob Brown', email: 'bob.brown@example.com', date: new Date('2024-04-05') },
    { id: 5, name: 'John Doe', email: 'john.doe@example.com', date: new Date('2024-01-15') },
    { id: 6, name: 'Jane Smith', email: 'jane.smith@example.com', date: new Date('2024-02-20') },
    { id: 7, name: 'Alice Johnson', email: 'alice.johnson@example.com', date: new Date('2024-03-10') },
    { id: 8, name: 'Bob Brown', email: 'bob.brown@example.com', date: new Date('2024-04-05') },
    { id: 9, name: 'John Doe', email: 'john.doe@example.com', date: new Date('2024-01-15') },
    { id: 10, name: 'Jane Smith', email: 'jane.smith@example.com', date: new Date('2024-02-20') },
    { id: 11, name: 'Alice Johnson', email: 'alice.johnson@example.com', date: new Date('2024-03-10') },
    { id: 12, name: 'Bob Brown', email: 'bob.brown@example.com', date: new Date('2024-04-05') },
    { id: 13, name: 'John Doe', email: 'john.doe@example.com', date: new Date('2024-01-15') },
    { id: 14, name: 'Jane Smith', email: 'jane.smith@example.com', date: new Date('2024-02-20') },
    { id: 15, name: 'Alice Johnson', email: 'alice.johnson@example.com', date: new Date('2024-03-10') },
    { id: 16, name: 'Jane Smith', email: 'jane.smith@example.com', date: new Date('2024-02-20') },
    { id: 17, name: 'Alice Johnson', email: 'alice.johnson@example.com', date: new Date('2024-03-10') },
    { id: 18, name: 'Bob Brown', email: 'bob.brown@example.com', date: new Date('2024-04-05') },
    { id: 19, name: 'John Doe', email: 'john.doe@example.com', date: new Date('2024-01-15') },
    { id: 20, name: 'Jane Smith', email: 'jane.smith@example.com', date: new Date('2024-02-20') },
    { id: 21, name: 'Alice Johnson', email: 'alice.johnson@example.com', date: new Date('2024-03-10') },
    // Add more data here
  ];
  
  displayedData: BookingData[] = [];
  currentPage = 1;
  pageSize = 10;
  searchQuery = '';
  filterDate: string | null = null;
  sortColumn: keyof BookingData = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  editData: EditableBookingData | null = null;

  ngOnInit() {
    this.updateDisplayedData();
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
        return this.formatDate(item.date) === this.filterDate;
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

  updateDisplayedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedData = this.filteredData.slice(startIndex, endIndex);
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
    this.currentPage = page;
    this.updateDisplayedData();
  }

  openEditModal(item: BookingData) {
    this.editData = { 
      ...item, 
      dateStr: this.formatDate(item.date) 
    };
  }

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

  closeEditModal() {
    this.editData = null;
  }

  updateEditDate() {
    if (this.editData) {
      const updatedDate = this.parseDate(this.editData.dateStr);
      if (updatedDate) {
        this.editData.date = updatedDate;
      }
    }
  }

  parseDate(dateStr: string | null): Date | null {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/').map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new Date(year, month - 1, day);
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}