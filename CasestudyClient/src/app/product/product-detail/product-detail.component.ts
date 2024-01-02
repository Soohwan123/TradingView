import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Product } from '@app/product/product';
import { Vendor } from '@app/vendor/vendor';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { ProductService } from '../product.service';
import { ValidateMoney } from '@app/validators/money.validator';
import { ValidateInt } from '@app/validators/int.validator';
import { BASEURL } from '@app/constants';
import { ConfirmDialogService } from '@app/confirm-dialog.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, ReactiveFormsModule, MatComponentsModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './product-detail.component.html',
  styles: [],
})
export class ProductDetailComponent {
  isAdding: boolean = false;
  // setter
  @Input() selectedProduct: Product = {
    id: '',
    vendorid: 0,
    name: '',
    costprice: 0.00,
    msrp: 0.00,
    rop: 0,
    eoq: 0,
    qoh: 0,
    qoo: 0,
    qrcode: '',
    qrcodetxt: '',
  };
  @Input() vendors: Vendor[] | null = null;
  @Input() products: Product[] = [];
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter();



  productForm: FormGroup;
  id: FormControl;
  vendorid: FormControl;
  name: FormControl;
  costprice: FormControl;
  msrp: FormControl;
  rop: FormControl;
  eoq: FormControl;
  qoh: FormControl;
  qoo: FormControl;
  qrcodetxt: FormControl;


  constructor(private builder: FormBuilder, public productService: ProductService, private confirmDialogService: ConfirmDialogService) {
    this.id = new FormControl(
    '',
      Validators.compose([Validators.required, this.uniqueCodeValidator.bind(this)])
    );
    this.vendorid = new FormControl(
    '',
      Validators.compose([Validators.required])
    );
    this.name = new FormControl(
    '',
      Validators.compose([Validators.required])
    );
    this.costprice = new FormControl(
    '',
      Validators.compose([Validators.required, ValidateMoney])
    );
    this.msrp = new FormControl(
    '',
      Validators.compose([Validators.required, ValidateMoney])
    );

    this.rop = new FormControl(
    '',
      Validators.compose([Validators.required, ValidateInt])
    );
    this.eoq = new FormControl(
    '',
      Validators.compose([Validators.required, ValidateInt])
    );
    this.qoh = new FormControl(
    '',
      Validators.compose([Validators.required, ValidateInt])
    );
    this.qoo = new FormControl(
    '',
      Validators.compose([Validators.required, ValidateInt])
    );

    this.qrcodetxt = new FormControl(
      '',
        Validators.compose([Validators.required])
    );

    this.productForm = this.builder.group({
      id: this.id,
      vendorid: this.vendorid,
      name: this.name,
      costprice: this.costprice,
      msrp: this.msrp,
      rop: this.rop,
      eoq: this.eoq,
      qoh: this.qoh,
      qoo: this.qoo,
      qrcodetxt: this.qrcodetxt,
    });
  } // constructor

  uniqueCodeValidator(control: AbstractControl): { idExists: boolean } | null {
    /**
    * uniqueCodeValidator - needed access to products property so not
    * with the rest of the validators
    */
    if (this.products && this.products?.length > 0) {
      if (
        this.products.find(
          (p) => p.id === control.value && !this.selectedProduct.id
        ) !== undefined
      ) {
      return { idExists: true };
      }
    }
    return null; // if we make it here there are no product codes
  } // uniqueCodeValidator

  ngOnInit(): void {
    // patchValue doesn't care if all values are present
    this.productForm.patchValue({
      id: this.selectedProduct.id,
      vendorid: this.selectedProduct.vendorid,
      name: this.selectedProduct.name,
      costprice: this.selectedProduct.costprice,
      msrp: this.selectedProduct.msrp,
      rop: this.selectedProduct.rop,
      eoq: this.selectedProduct.eoq,
      qoh: this.selectedProduct.qoh,
      qoo: this.selectedProduct.qoo,
      qrcodetxt : this.selectedProduct.qrcodetxt,
    });

    if(!this.id.value){
      this.isAdding = false;
    } else {
      this.isAdding = true;
    }
  } // ngOnInit

  updateSelectedProduct(): void {
    this.selectedProduct.id = this.productForm.value.id;
    this.selectedProduct.vendorid = this.productForm.value.vendorid;
    this.selectedProduct.name = this.productForm.value.name;
    this.selectedProduct.costprice = this.productForm.value.costprice;
    this.selectedProduct.msrp = this.productForm.value.msrp;

    this.selectedProduct.rop = this.productForm.value.rop;
    this.selectedProduct.eoq = this.productForm.value.eoq;
    this.selectedProduct.qoh = this.productForm.value.qoh;
    this.selectedProduct.qoo = this.productForm.value.qoo;

    this.selectedProduct.qrcodetxt = this.productForm.value.qrcodetxt;

    this.saved.emit(this.selectedProduct);
  } // updateSelectedProduct

  selectFile(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      const file = fileList[0];
      const reader: FileReader = new FileReader();
      reader.onloadend = (e) => {
        this.selectedProduct.qrcode = reader.result?.toString();
      };
      reader.readAsDataURL(file);
    }
  } // selectFile

  deleteProduct(): void {
    this.confirmDialogService.openConfirmDialog().subscribe((result) => {
      if (result) {
        // User clicked 'Yes', emit the deleted event
        this.deleted.emit(this.selectedProduct);
      }
    });
  }

} // ProductDetailComponent


