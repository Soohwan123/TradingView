import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product';
import { GenericHttpService } from '@app/generic-http.service';


@Injectable({
  providedIn: 'root'
})

export class ProductService extends GenericHttpService<Product> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `products`);
  } // constructor
} // ProductService
