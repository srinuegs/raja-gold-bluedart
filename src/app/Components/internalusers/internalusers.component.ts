import { Component } from '@angular/core';

@Component({
  selector: 'app-internalusers',
  templateUrl: './internalusers.component.html',
  styleUrls: ['./internalusers.component.css']
})
export class InternalusersComponent {
  isModalOpen: boolean = false;
 originalData = [
    {
      "id": 1,
      "Name": "Raju G",
      "PhoneNumber": "9966961096",
      "Gender": 'Male',
      "Role": "Admin",
      "Status":"Active"      
    },
    {
      "id": 2,
      "Name": "Ravi M",
      "PhoneNumber": "8866961086",
      "Gender": 'Male',
      "Role": "Seller",
      "Status":"Active"      
    },
    {
      "id": 3,
      "Name": "Rama G",
      "PhoneNumber": "9966961096",
      "Gender": 'Male',
      "Role": "Seller",
      "Status":"Active"      
    },
    {
      "id": 4,
      "Name": "Rao G",
      "PhoneNumber": "9966961096",
      "Gender": 'Male',
      "Role": "Seller",
      "Status":"Inactive"      
    },
    
  ];


  openModal(): void {
    this.isModalOpen = true;
    // Add backdrop class manually if needed
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.isModalOpen = false;
    // Remove backdrop class manually
    document.body.classList.remove('modal-open');
  }

  onSubmit(nameInput: HTMLInputElement, emailInput: HTMLInputElement, mobileInput: HTMLInputElement, genderMale: HTMLInputElement, genderFemale: HTMLInputElement, typeInternal: HTMLInputElement, typeExternal: HTMLInputElement): void {
    const name = nameInput.value;
    const email = emailInput.value;
    const mobile = mobileInput.value;
    const gender = genderMale.checked ? 'Male' : (genderFemale.checked ? 'Female' : '');
    const type = typeInternal.checked ? 'Internal' : (typeExternal.checked ? 'External' : '');

    this.closeModal();
    
    // Clear the form fields
    nameInput.value = '';
    emailInput.value = '';
    mobileInput.value = '';
    genderMale.checked = false;
    genderFemale.checked = false;
    typeInternal.checked = false;
    typeExternal.checked = false;
  }
}
