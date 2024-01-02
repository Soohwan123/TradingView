import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GenericHttpService } from '@app/generic-http.service';
import { Vendor } from './vendor';

@Injectable({
  providedIn: 'root',
})
export class VendorService extends GenericHttpService<Vendor> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `vendors`);
  } // constructor
} // VendorService
