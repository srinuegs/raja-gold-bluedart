import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  couriers: string[] = ['BlueDart'];
  constructor(private fb: FormBuilder) { 
    this.orderForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      courierList: ['BlueDart', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9./?;:'~!\\@\"#$%^&*()[\]=_ /-]*$/)
      ]],
      pickupDate: ['', [
        Validators.required,
      ]],
      pickupTime: ['', [
        Validators.required,
      ]],
      companyName: ['', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9./?;:'~!\\@\"#$%^&*()[\]=_ /-]*$/)
      ]],
      deliveryPincode: ['', [
        Validators.required,
        Validators.pattern(/^\d{6}$/)  // 6 digits
      ]],
      pieceCount: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{1,4}$/)  // 0 to 9999
      ]],
      actualWeight: ['', [
        Validators.required,
        Validators.pattern(/^\d{1,8}(\.\d{1,2})?$/)  // 0 to 99999999.99
      ]],
      declareValue: ['', [
        Validators.required,
        Validators.pattern(/^\d{1,10}(\.\d{1,2})?$/)  // 0 to 9999999999.99
      ]],
      length: ['', [
        Validators.required,
        Validators.pattern(/^\d{1,6}(\.\d{1,2})?$/)  // 0 to 999999.99
      ]],
      breadth: ['', [
        Validators.required,
        Validators.pattern(/^\d{1,6}(\.\d{1,2})?$/)  // 0 to 999999.99
      ]],
      height: ['', [
        Validators.required,
        Validators.pattern(/^\d{1,6}(\.\d{1,2})?$/)  // 0 to 999999.99
      ]],
      senderName: ['', [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9./?;:'~!\\@\"#$%^&*()[\]=_ /-]*$/)
      ]],
      senderMobile: ['', [
        Validators.required,
        Validators.pattern(/^\d{10}$/)  // 10 digits
      ]],
      receiverTelephone: ['', [
        Validators.required,
        Validators.pattern(/^\d{10}$/)  // 10 digits
      ]],
      receiverMobile: ['', [
        Validators.required,
        Validators.pattern(/^\d{10}$/)  // 10 digits
      ]],
      receiverName: ['', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9./?;:'~!\\@\"#$%^&*()[\]=_ /-]*$/)
      ]],
      receiverEmail: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]],
      maskedContactNo: ['', [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern(/^[a-zA-Z0-9./?;:'~!\\@\"#$%^&*()[\]=_ /-]*$/)
      ]],
      deliveryAddress: ['', [
        Validators.required,
        Validators.maxLength(90),
        Validators.pattern(/^[a-zA-Z0-9./?;:'~!\\@\"#$%^&*()[\]=_ /-]*$/)
      ]]
    });
  }

  onSubmit(): void {
    let requestObject;
    if (this.orderForm.valid) {
      console.log(this.orderForm.value);
        requestObject = {
          "courierList": this.orderForm.value.courierList,
          "pickupDate":conversionDateFormat(this.orderForm.value.pickupDate),
          "pickupTime": convertTimeFormat(this.orderForm.value.pickupTime),
          "companyName":this.orderForm.value.companyName,
          "deliveryPincode":this.orderForm.value.deliveryPincode,
          "pieceCount":this.orderForm.value.pieceCount,
          "actualWeight":this.orderForm.value.actualWeight,
          "declareValue":this.orderForm.value.declareValue,
          "length":this.orderForm.value.length,
          "breadth":this.orderForm.value.breadth,
          "height":this.orderForm.value.height,
          "senderName": this.orderForm.value.senderName,
          "senderMobile": this.orderForm.value.senderMobile,
          "receiverTelephone": this.orderForm.value.receiverTelephone,
          "receiverMobile": this.orderForm.value.receiverMobile,
          "receiverName": this.orderForm.value.receiverName,
          "receiverEmail":this.orderForm.value.receiverEmail,
          "maskedContactNo":this.orderForm.value.maskedContactNo,
          "deliveryAddress":this.orderForm.value.deliveryAddress
        }
      console.log(requestObject);
    } else {
      console.log('Form is invalid');
    }
  }
}
function convertTimeFormat(data: string): string {
  // Check if the input timeString is in the correct format
  const timePattern = /^(\d{2}):(\d{2})$/;
  const match = data.match(timePattern);

  if (match) {
    // Extract hours and minutes from the matched groups
    const hours = match[1];
    const minutes = match[2];

    // Concatenate hours and minutes to get the new format
    return `${hours}${minutes}`;
  } else {
    // Return an error message or handle invalid format
    throw new Error('Invalid time format. Expected format is HH:mm');
  }
}
function conversionDateFormat(data: Date) {
  // Parse the input date string to a Date object
  const date = new Date(data);

  // Extract day, month, and year from the Date object
  const day = date.getDate().toString().padStart(2, '0'); // Ensure two-digit day
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
  const year = date.getFullYear();

  // Format the date as DD-MM-YYYY
  return `${day}-${month}-${year}`;
}
