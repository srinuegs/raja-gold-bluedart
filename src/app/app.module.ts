import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactComponent } from './Components/contact/contact.component';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { PagenotfoundComponent } from './Components/pagenotfound/pagenotfound.component';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { InternalusersComponent } from './Components/internalusers/internalusers.component';
import { BookingsComponent } from './Components/bookings/bookings.component';
import { CustomersComponent } from './Components/customers/customers.component';
import { OrderFormComponent } from './Components/order/order.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    LoginComponent,
    SignupComponent,
    PagenotfoundComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    InternalusersComponent,
    BookingsComponent,
    CustomersComponent,
    OrderFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    HttpClientModule ,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
