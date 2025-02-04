import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component'
import { AboutComponent } from './Components/about/about.component';
import { ContactComponent } from './Components/contact/contact.component';
import { ProductsComponent } from './Components/products/products.component';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { BlogComponent } from './Components/blog/blog.component';
import { PagenotfoundComponent } from './Components/pagenotfound/pagenotfound.component';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { InternalusersComponent } from './Components/internalusers/internalusers.component';
import { BookingsComponent } from './Components/bookings/bookings.component';
import { CustomersComponent } from './Components/customers/customers.component';
import { OrderFormComponent } from './Components/order-form/order-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    ProductsComponent,
    LoginComponent,
    SignupComponent,
    BlogComponent,
    PagenotfoundComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    InternalusersComponent,
    BookingsComponent,
    CustomersComponent,
    OrderFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
