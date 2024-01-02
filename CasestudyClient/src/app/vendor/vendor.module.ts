import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { MatComponentsModule } from '../mat-components/mat-components.module';
import { MatSelectModule } from '@angular/material/select';
import { VendorHomeComponent } from './vendor-home/vendor-home.component';
import { VendorDetailComponent } from './vendor-detail/vendor-detail.component';

@NgModule({
  declarations: [VendorListComponent, VendorHomeComponent, VendorDetailComponent],
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule,MatSelectModule],
})
export class VendorModule {}
