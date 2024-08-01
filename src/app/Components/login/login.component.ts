import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('email') emailInput!: ElementRef;
  @ViewChild('password') passwordInput!: ElementRef;
  @ViewChild('rememberMe') rememberMeCheckbox!: ElementRef;

  constructor() {}

  onSubmit(): void {
    const email = this.emailInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;
    const rememberMe = this.rememberMeCheckbox.nativeElement.checked;

    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Remember Me:', rememberMe);

    // Clear the fields after submission
    this.emailInput.nativeElement.value = '';
    this.passwordInput.nativeElement.value = '';
    this.rememberMeCheckbox.nativeElement.checked = false;
  }
}
