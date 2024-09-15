import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { AboutComponent } from './Components/about/about.component';
import { LoginComponent } from './Components/login/login.component';
import { ProductsComponent } from './Components/products/products.component';
import { PagenotfoundComponent } from './Components/pagenotfound/pagenotfound.component';
import { ContactComponent } from './Components/contact/contact.component';
import { SignupComponent } from './Components/signup/signup.component';
import { BlogComponent } from './Components/blog/blog.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { InternalusersComponent } from './Components/internalusers/internalusers.component';
import { BookingsComponent } from './Components/bookings/bookings.component';
import { OrderFormComponent } from './Components/order/order.component';

const routes: Routes = [
  {path: '', redirectTo:'/bookings', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'login', component: LoginComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'blog', component: BlogComponent},
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
