import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VendorHomeComponent } from './vendor/vendor-home/vendor-home.component';
import { ProductHomeComponent } from '@app/product/product-home/product-home.component';
import { GeneratorComponent } from '@app/purchaseorder/generator/generator.component';
import { ViewerComponent } from './viewer/viewer.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, title: 'Exercises - Home' },
  { path: 'vendors', component: VendorHomeComponent, title: 'Exercises - Vendors' },
  { path: '', component: HomeComponent, title: 'Exercises - Home' },
  { path: 'products', component: ProductHomeComponent, title: 'Exercises - Products' },
  { path: 'generator', component: GeneratorComponent },
  { path: 'viewer', component: ViewerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
