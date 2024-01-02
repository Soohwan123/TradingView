import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { PurchaseOrder } from '../purchase-order';
import { PurchaseOrderLineItem } from '../purchase-order-line-item';
import { PurchaseOrderService } from '../purchase-order-service';
import { Vendor } from '@app/vendor/vendor';
import { VendorService } from '@app/vendor/vendor.service';
import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';
import { PDFURL } from '@app/constants';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
  templateUrl: './generator.component.html',
})
export class GeneratorComponent implements OnInit, OnDestroy {
  // form
  generatorForm: FormGroup;
  vendorid: FormControl;
  productid : FormControl;
  qty : FormControl;
  // data
  formSubscription?: Subscription;
  products: Product[] = []; // everybody's products
  vendors: Vendor[] = []; // all vendors
  vendorproducts: Product[] = []; // all products for a particular vendor
  items: PurchaseOrderLineItem[] = []; // product items that will be in report
  selectedproducts: Product[] = []; // products that being displayed currently in app
  qtyOptions: string[] = [];
  tempQty: number;
  selectedProduct: Product; // the current selected product
  selectedVendor: Vendor; // the current selected vendor
  // misc
  pickedProduct: boolean;
  pickedVendor: boolean;
  pickedQty: boolean;
  generated: boolean;
  hasProducts: boolean;
  msg: string;
  total: number;
  sub: number;
  tax: number;
  pono: number = 0;
  constructor(
    private builder: FormBuilder,
    private vendorService: VendorService,
    private productService: ProductService,
    private purchaseOrderService: PurchaseOrderService
  ) {
    this.pickedVendor = false;
    this.pickedProduct = false;
    this.pickedQty = false;
    this.generated = false;
    this.msg = '';
    this.vendorid = new FormControl('');
    this.productid = new FormControl('');
    this.qty = new FormControl('');
    this.generatorForm = this.builder.group({
      productid: this.productid,
      vendorid: this.vendorid,
      qty: this.qty,
    });
    this.selectedProduct = {
      id: '',
      vendorid: 0,
      name: '',
      costprice: 0.0,
      msrp: 0.0,
      rop: 0.0,
      eoq: 0.0,
      qoh: 0.0,
      qoo: 0.0,
      qrcode: '',
      qrcodetxt: '',
    };
    this.selectedVendor = {
      id: 0,
      name: '',
      address1: '',
      city: '',
      province: '',
      postalcode: '',
      phone: '',
      type: '',
      email: '',
    };
    this.hasProducts = false;
    this.total = 0.0;
    this.sub = 0.0;
    this.tax = 0.0;
    this.tempQty = 0;
  } // constructor
  ngOnInit(): void {
    this.onPickVendor(); // sets up subscription for dropdown click
    this.onPickProduct(); // sets up subscription for dropdown click
    this.onPickQty();
    this.msg = 'loading vendors from server...';
    this.getAllVendors();
  } // ngOnInit
  ngOnDestroy(): void {
    if (this.formSubscription !== undefined) {
      this.formSubscription.unsubscribe();
    }
  } // ngOnDestroy

  /**
   * getAllVendors - retrieve everything
   */
  getAllVendors(passedMsg: string = ''): void {
    this.vendorService.getAll().subscribe({
      // Create observer object
      next: (vendors: Vendor[]) => {
        this.vendors = vendors;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get vendors - ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Vendors loaded!`),
    });
  } // getAllVendors
  /**
   * loadVendorProducts - retrieve a particular vendor's products
   */
  loadVendorProducts(): void {
    this.vendorproducts = [];
    this.productService.getSome(this.selectedVendor.id).subscribe({
      // observer object
      next: (products: Product[]) => {
        this.vendorproducts = products;
      },
      error: (err: Error) =>
        (this.msg = `product fetch failed! - ${err.message}`),
      complete: () => {},
    });
  } // loadVendorProducts
  /**
   * onPickVendor - Another way to use Observables, subscribe to the select change event
   * then load specific Vendor products for subsequent selection
   */
  onPickVendor(): void {
    this.formSubscription = this.generatorForm
      .get('vendorid')
      ?.valueChanges.subscribe((val) => {
        this.selectedProduct = {
          id: '',
          vendorid: 0,
          name: '',
          costprice: 0.0,
          msrp: 0.0,
          rop: 0.0,
          eoq: 0.0,
          qoh: 0.0,
          qoo: 0.0,
          qrcode: '',
          qrcodetxt: '',
        };
        this.selectedVendor = val;
        this.loadVendorProducts();
        this.pickedProduct = false;
        this.msg = 'Choose Product for Vendor';
        this.pickedVendor = true;
        this.generated = false;
        this.items = []; // array for the report
        this.selectedproducts = []; // array for the details in app html
      });
  } // onPickVendor
  /**
   * onPickProduct - subscribe to the select change event then
   * update array containing items.
   */
  onPickProduct(): void {
    this.formSubscription = this.generatorForm
      .get('productid')
      ?.valueChanges.subscribe((val) => {
        console.log(val);
        this.selectedProduct = val;
        this.pickedProduct = true;
        this.msg = 'Choose Qty for Product';
        this.generated = false;
        this.GenerateQtyOptions(this.selectedProduct.qoh);
      });
  } // onPickProduct


  onPickQty(): void {
    const productSubscription = this.generatorForm
      .get('qty')
      ?.valueChanges.subscribe((val) => {
        var item: PurchaseOrderLineItem = {
          id: 0,
          poid: 0,
          productid: this.selectedProduct?.id,
          qty: parseInt(val),
          price: this.selectedProduct?.costprice * parseInt(val),
        };

        if(isNaN(val)){
          item = {
            id: 0,
            poid: 0,
            productid: this.selectedProduct?.id,
            qty: this.selectedProduct.eoq,
            price: this.selectedProduct?.costprice * this.selectedProduct.eoq,
          };
        } else{
          const item: PurchaseOrderLineItem = {
            id: 0,
            poid: 0,
            productid: this.selectedProduct?.id,
            qty: parseInt(val),
            price: this.selectedProduct?.costprice * parseInt(val),
          };
        }

        this.pickedQty = true;
        const existingItem = this.items.find((item) => item.productid === this.selectedProduct?.id);
        const existingItemIndex = this.items.findIndex((item) => item.productid === this.selectedProduct?.id);

        if (existingItem) {
          if(item.qty === 0){
            //remove it
            this.items.splice(existingItemIndex, 1);
            this.msg = `All ${this.selectedProduct.name}s removed!`
          } else {
            // Update the quantity and price if the item exists
            existingItem.qty = parseInt(val);
            existingItem.price = this.selectedProduct?.costprice * parseInt(val);
            this.msg = `${val} ${this.selectedProduct.name}(s) Added!`
          }
        } else {
          if(item.qty !== 0){
            // add entry
            this.items.push(item);
            this.selectedproducts.push(this.selectedProduct);
            this.msg = `${val} ${this.selectedProduct.name}(s) Added!`
          }
        }
        if (this.items.length > 0) {
          this.hasProducts = true;
        }
        this.total = 0.0;
        this.sub = 0.0;
        this.tax = 0.0;
        this.items.forEach((item) => (this.sub += item.price));
        this.tax = this.sub * 0.15;
        this.total = this.sub + this.tax;

      });
    this.formSubscription?.add(productSubscription); // add it as a child, so all can be destroyed together
  } // onPickQty

  /**
   * createPurchaseOrder - create the client side PurchaseOrder
   */
  createPurchaseOrder(): void {
    this.generated = false;
    const purchaseOrder: PurchaseOrder = {
      id: 0,
      vendorid: this.selectedProduct.vendorid,
      amount: this.total,
      podate: formatDate(new Date(), 'yyyy-MM-dd@HH:mm:ss', 'en-US'),
      items: this.items,
    };
    this.purchaseOrderService.create(purchaseOrder).subscribe({
      // observer object
      next: (purchaseOrder: PurchaseOrder) => {
        // server should be returning report with new id
        purchaseOrder.id > 0
          ? (this.msg = `Purchase Order ${purchaseOrder.id} added!`)
          : (this.msg = 'Purchase Order not added! - server error');
        this.pono = purchaseOrder.id;
      },
      error: (err: Error) => (this.msg = `Purchase Order not added! - ${err.message}`),
      complete: () => {
        this.hasProducts = false;
        this.pickedVendor = false;
        this.pickedProduct = false;
        this.pickedQty = false;
        this.generated = true;
      },
    });
  } // createReport

  GenerateQtyOptions(qoh: number): string[] {
    // Generate an array of strings starting from 'EOQ' and going up to 'eoq'
    this.qtyOptions = [];
    this.qtyOptions.push('EOQ');

    for (let i = 0; i <= qoh; i++) {
      this.qtyOptions.push(`${i}`);
    }

    return this.qtyOptions;
  }

  viewPdf(): void {
    window.open(`${PDFURL}${this.pono}`, '');
  } // viewPdf
} // GeneratorComponent
