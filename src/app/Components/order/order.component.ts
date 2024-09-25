import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Alert, ApiService } from '../../api.service'; // Ensure correct import

@Component({
     selector: 'app-order',
     templateUrl: './order.component.html',
     styleUrls: ['./order.component.css']
})
export class OrderFormComponent implements OnInit {
     orderForm!: FormGroup;
     couriers: string[] = ['BlueDart'];
     isLoading$ = this.apiService.loading$;
     alert: Alert  | null = null;
     constructor(private fb: FormBuilder, private apiService: ApiService) { }

     ngOnInit(): void {
          this.apiService.alert$.subscribe(alert => {
               this.alert = alert;
               if (alert) 
               {
                    setTimeout(() => {
                         this.alert = null;
                    }, 5000); // Auto-hide after 5 seconds
               }
             });
          this.orderForm = this.fb.group({
               courierList: ['', [
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
               // receiverTelephone: ['', [
               //      Validators.required,
               //      Validators.pattern(/^\d{10}$/)  // 10 digits
               // ]],
               receiverMobile: ['', [
                    Validators.required,
                    Validators.pattern(/^\d{10}$/)  // 10 digits
               ]],
               receiverName: ['', [
                    Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern(/^[a-zA-Z0-9./?;:'~!\\@\"#$%^&*()[\]=_ /-]*$/)
               ]],
               // receiverEmail: ['', [
               //      Validators.required,
               //      Validators.email,
               //      Validators.maxLength(50)
               // ]],
               // maskedContactNo: ['', [
               //      Validators.required,
               //      Validators.maxLength(10),
               //      Validators.pattern(/^[a-zA-Z0-9./?;:'~!\\@\"#$%^&*()[\]=_ /-]*$/)
               // ]],
               deliveryAddress: ['', [
                    Validators.required,
                    Validators.maxLength(90),
                    Validators.pattern(/^[a-zA-Z0-9./?;:,/-/'~!\r\n\\@\"#$%^&*()[\]=_ /-]*$/)
               ]]
          });
     }

     getAlertClass() {
     if (!this.alert) return '';
          return `alert-${this.alert.type}`;
     }

     onSubmit(): void {
          if (this.orderForm.valid) {
               console.log(this.orderForm.value);

               // let requestObject = {
               //   "courierList": this.orderForm.value.courierList,
               //   "pickupDate": conversionDateFormat(this.orderForm.value.pickupDate),
               //   "pickupTime": convertTimeFormat(this.orderForm.value.pickupTime),
               //   "companyName": this.orderForm.value.companyName,
               //   "deliveryPincode": this.orderForm.value.deliveryPincode,
               //   "pieceCount": this.orderForm.value.pieceCount,
               //   "actualWeight": this.orderForm.value.actualWeight,
               //   "declareValue": this.orderForm.value.declareValue,
               //   "length": this.orderForm.value.length,
               //   "breadth": this.orderForm.value.breadth,
               //   "height": this.orderForm.value.height,
               //   "senderName": this.orderForm.value.senderName,
               //   "senderMobile": this.orderForm.value.senderMobile,
               //   "receiverTelephone": this.orderForm.value.receiverTelephone,
               //   "receiverMobile": this.orderForm.value.receiverMobile,
               //   "receiverName": this.orderForm.value.receiverName,
               //   "receiverEmail": this.orderForm.value.receiverEmail,
               //   "maskedContactNo": this.orderForm.value.maskedContactNo,
               //   "deliveryAddress": this.orderForm.value.deliveryAddress
               // };
               let requestObject = {
                    //BillingArea: "MLM", // Defalut Value = "MLM"
                    ShipperName: this.orderForm.value.courierList != null ? this.orderForm.value.courierList : "", // Need to enter
                    //PickupAddress: "plat no 396 mij park,machilipatnam", // Defalut Value = "plat no 396 mij park,machilipatnam", 
                    //PickupPincode: 521001, // Defalut Value = 521001
                    CreatedBy: "", // ------------------------------------------------------- ?? Login User Name
                    UpdatedBy: "", // ------------------------------------------------------- ?? Login User Name
                    CompanyName: this.orderForm.value.companyName != null ? this.orderForm.value.companyName : "", // Need to Enter
                    DeliveryAddress: this.orderForm.value.deliveryAddress != null ? this.orderForm.value.deliveryAddress : "", // Need to Enter
                    DeliveryPincode: this.orderForm.value.deliveryPincode != null ? this.orderForm.value.deliveryPincode : "",	// Need to Enter
                    //ProductType: "NDOX", // Defalut Value = "NDOX",
                    //SubProductCode: "P", // Defalut Value = "P", 
                    //PakType: request.body.PakType != null ? request.body.PakType : "", // Not Mandatory ---------------------------------------------------------- ?? Is this reffers to //"Product Code" 
                    PieceCount: this.orderForm.value.pieceCount != null ? this.orderForm.value.pieceCount : "",  // Need to Enter
                    PickupDate: this.orderForm.value.pickupDate != null ? this.orderForm.value.pickupDate : "", // Need to Enter
                    PickupTime: convertTimeFormat(this.orderForm.value.pickupTime) != null ? convertTimeFormat(this.orderForm.value.pickupTime) : "", // Need to Enter
                    //BillingCustomerCode: 200034, //200034,
                    ActualWeight: this.orderForm.value.actualWeight != null ? this.orderForm.value.actualWeight : "", // Need to Enter
                    DeclaredValue: this.orderForm.value.declareValue != null ? this.orderForm.value.declareValue : "", // Need to Enter
                    RegisterPickup: "", // Need to Enter
                    Length: this.orderForm.value.length != null ? this.orderForm.value.length : "", // Need to Enter
                    Breath: this.orderForm.value.breadth != null ? this.orderForm.value.breadth : "", // Need to Enter
                    Height: this.orderForm.value.height != null ? this.orderForm.value.height : "", // Need to Enter
                    ToPayCustomer: "", // Not Mandatory
                    Sender: this.orderForm.value.senderName != null ? this.orderForm.value.senderName : "",  // Not Mandatory
                    //VendorCode: request.body.VendorCode != null ? request.body.VendorCode : "",  // Not Mandatory
                    SenderMobile: this.orderForm.value.senderMobile != null ? this.orderForm.value.senderMobile : "", // Need to Enter
                    ReceiverTelephone:  "",  // Not Mandatory
                    ReceiverMobile: this.orderForm.value.receiverMobile != null ? this.orderForm.value.receiverMobile : "", // Need to Enter
                    ReceiverName: this.orderForm.value.receiverName != null ? this.orderForm.value.receiverName : "", // Need to Enter
                    ReceiverEmailId: "", // Not Mandatory
                    ReceiverLatitude: "", // Not Mandatory
                    ReceiverLongitude: "", // Not Mandatory
                    ReceiverMaskedContactNumber: "",  // Not Mandatory
                    InvoiceNumber: "", // Not Mandatory
                    SpecialInstruction: "", // Not Mandatory
                    CollectableAmount: "", // Not Mandatory
                    CommodityDetail1: "", // Not Mandatory
                    CommodityDetail2: "", // Not Mandatory
                    CommodityDetail3: "", // Not Mandatory
                    IsReversePickup: "", // Not Mandatory
                    ReferenceNo2: "", // Not Mandatory
                    ReferenceNo3: "", // Not Mandatory
                    ItemCount: "", // Not Mandatory
                    OTPBasedDelivery: "", // Not Mandatory
                    OfficeClosureTime: "", // Not Mandatory
                    AWBNo: "", // Not Mandatory
                    Status: "PENDING", // Not Mandatory
                    Message: "", // Not Mandatory
                    ClusterCode: "", // Not Mandatory
                    DestinationArea: "", // Not Mandatory
                    DestinationLocation: "", // Not Mandatory
                    PickupTokenNo: "", // Not Mandatory
                    ResponsePicupDate: "", // Not Mandatory
                    TransactionAmount: "", // Not Mandatory
                    WalletBalance: "", // Not Mandatory
                    AvailableBookingAmout: "" // Not Mandatory
               }
               console.log(requestObject);

               this.apiService.postData(requestObject).subscribe(
                    (response) => {
                         this.apiService.showAlert({
                              type: 'success',
                              message: response.message
                         });
                    },
                    (error) => {
                         console.error('Error submitting data:', error);
                         this.apiService.showAlert({
                              type: 'error',
                              message: error
                         });
                    }
               );
          } else {
               console.log('Form is invalid');
               this.apiService.showAlert({
                    type: 'error',
                    message: 'Form is invalid'
               });
          }
     }
}

function convertTimeFormat(data: string): string {
     const timePattern = /^(\d{2}):(\d{2})$/;
     const match = data.match(timePattern);

     if (match) {
          const hours = match[1];
          const minutes = match[2];
          return `${hours}${minutes}`;
     } else {
          throw new Error('Invalid time format. Expected format is HH:mm');
     }
}


