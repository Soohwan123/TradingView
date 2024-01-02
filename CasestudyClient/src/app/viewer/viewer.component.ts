import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { PurchaseOrder } from '../purchaseorder/purchase-order';
import { PurchaseOrderLineItem } from '../purchaseorder/purchase-order-line-item';
import { PurchaseOrderService } from '../purchaseorder/purchase-order-service';
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
import { EMPTY, Observable, Subscription, catchError, tap } from 'rxjs';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
  providers: [DatePipe],
  styles: [
  ]
})
export class ViewerComponent implements OnInit, OnDestroy {
  // form
  viewerform: FormGroup;
  vendorid: FormControl;
  productid: FormControl;
  poid: FormControl;

  // data
  formSubscription?: Subscription;
  products: Product[] = [];
  vendors: Vendor[] = [];
  vendorproducts?: Product[];
  poProducts?: Product[];
  vendorPOs?: PurchaseOrder[];
  items: PurchaseOrderLineItem[] = [];
  selectedproducts: Product[] = []; //
  selectedPurchaseOrder: PurchaseOrder;
  selectedProduct: Product;
  selectedVendor: Vendor;

  // misc
  pickedProduct: boolean;
  pickedVendor: boolean;
  generated: boolean;
  hasProducts: boolean;
  msg: string;
  total: number;
  reportno: number = 0;
  sub: number = 0;
  constructor(
    private builder: FormBuilder,
    private vendorService: VendorService,
    private productService: ProductService,
    private poService: PurchaseOrderService,
    private datePipe: DatePipe
  ) {
    this.pickedVendor = false;
    this.pickedProduct = false;
    this.generated = false;
    this.msg = '';
    this.vendorid = new FormControl('');
    this.productid = new FormControl('');
    this.poid = new FormControl('');
    this.viewerform = this.builder.group({
      productid: this.productid,
      vendorid: this.vendorid,
      poid: this.poid,
    });
    this.selectedProduct = {
      id: '',
      vendorid: 0,
      name: '',
      costprice: 0,
      msrp: 0.0,
      rop: 0,
      eoq: 0,
      qoh: 0,
      qoo: 0,
      qrcode : '',
      qrcodetxt: ''
    };
    this.selectedPurchaseOrder = {
      id: 0,
      vendorid: 0,
      items: [],
      podate: '',
      amount: 0,
    }
    this.selectedVendor = {
      id: 0,
      name: '',
      address1: '',
      city: '',
      province: '',
      postalcode: '',
      phone: '',
      type: '',
      email: ''
    };
    this.hasProducts = false;
    this.total = 0.0;
  } // constructor
  ngOnInit(): void {
    this.onPickVendor(); // sets up subscription for dropdown click
    this.onPickPO(); // sets up subscription for dropdown click
    this.msg = 'loading employees from server...';
    this.getAllVendors();
  } // ngOnInit
  ngOnDestroy(): void {
    if (this.formSubscription !== undefined) {
      this.formSubscription.unsubscribe();
    }
  } // ngOnDestroy

 formattedDate(datecreated?:string): string {
   // Convert string to Date object
   const dateObject = new Date(datecreated ?? '');

   // Format the date using DatePipe
   const formattedDate = this.datePipe.transform(dateObject, 'MM/dd/yy, hh:mm a');

   return formattedDate || ''; // Handle null or undefined case
 }


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
  }

  loadVendorProducts(id: number): Observable<Product[]> {
   return this.productService.getSome(id).pipe(
     tap((products: Product[]) => {
       this.vendorproducts = products;
       console.log(this.vendorproducts);
     }),
     catchError((err: Error) => {
       this.msg = `product fetch failed! - ${err.message}`;
       return EMPTY; // or handle the error as needed
     })
   );
 }


  loadVendorPOs(): void {
       this.vendorPOs = [];
       this.poService.getSome(this.selectedVendor.id).subscribe({
         // observer object
         next: (POs: PurchaseOrder[]) => {
           this.vendorPOs = POs;
           this.vendorPOs.forEach((po) => {
              po.podate = this.formattedDate(po.podate);
           })
         },
         error: (err: Error) =>
           (this.msg = `po fetch failed! - ${err.message}`),
         complete: () => {},
       });
   }


  onPickVendor(): void {
    this.formSubscription = this.viewerform
      .get('vendorid')
      ?.valueChanges.subscribe((val) => {
       this.selectedPurchaseOrder = {
         id: 0,
         vendorid: 0,
         items: [],
         podate: '',
         amount : 0
       }
        this.selectedVendor = val;
        this.loadVendorPOs();
        this.pickedVendor = false;
        this.hasProducts = false;
        this.msg = 'Vendor\'s Purchase Order loaded!';
        this.pickedVendor = true;
        this.generated = false;
        this.items = []; // array for the report
        this.selectedproducts = []; // array for the details in app html
        this.sub = 0;
      });
  }


  onPickPO(): void {
    const productSubscription = this.viewerform
      .get('poid')
      ?.valueChanges.subscribe((val) => {
        this.selectedPurchaseOrder = val;
      // Use forkJoin to wait for both loadEmployeeExpenses and subsequent logic
      forkJoin([
       this.loadVendorProducts(this.selectedVendor.id),
       // Other async tasks or logic you need to wait for
      ]).subscribe(() => {
         if (this.vendorproducts) {
           // Retrieve just the expenses in the report
           this.poProducts = this.vendorproducts.filter((product) =>
             this.selectedPurchaseOrder?.items.some((item) => item.productid === product.id)
           );
           console.log(this.selectedPurchaseOrder);

           if (this.selectedPurchaseOrder.items.length > 0) {
             this.hasProducts = true;
           }
         }

         this.selectedPurchaseOrder.items.forEach((item) => {
            this.sub += item.price;
         });
         this.total = 0.0;
         this.poProducts?.forEach((exp) => (this.total += exp.costprice));
         this.generated = true;
         this.reportno = this.selectedPurchaseOrder.id;
       });
     });

   this.formSubscription?.add(productSubscription); // add it as a child, so all can be destroyed together
 } // onPickExpense

 findNameById(id: string): string | undefined {
    return this.poProducts?.find(product => product.id === id)?.name;
 }


  viewPdf(): void {
    window.open(`${PDFURL}${this.reportno}`, '');
  } // viewPdf

}
