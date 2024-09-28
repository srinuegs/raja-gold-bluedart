import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { PagenotfoundComponent } from './Components/pagenotfound/pagenotfound.component';
import { ContactComponent } from './Components/contact/contact.component';
import { SignupComponent } from './Components/signup/signup.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { InternalusersComponent } from './Components/internalusers/internalusers.component';
import { BookingsComponent } from './Components/bookings/bookings.component';
import { OrderFormComponent } from './Components/order/order.component';

const routes: Routes = [
  {path: '', redirectTo:'/dashboard', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'internalusers', component: InternalusersComponent},
  {path: 'bookings', component: BookingsComponent},
  {path: 'order', component: OrderFormComponent},
  {path: '**', component: PagenotfoundComponent},
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
