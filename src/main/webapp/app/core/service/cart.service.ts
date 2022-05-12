import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, never } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { BasicService } from './basic.service';
import { HelperService } from './helper.service';
import { CommonServiceService } from './common-service.service';
import { ApplicationConfigService } from '../config/application-config.service';
import { SessionStorageService } from 'ngx-webstorage';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CartService extends BasicService {
  public loading = new BehaviorSubject<any>('next');

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    }),
  };

  constructor(
    private http: HttpClient,
    private commonService: CommonServiceService,
    public helperService: HelperService,
    private applicationConfigService: ApplicationConfigService,
    private toaStr: ToastrService // private sessionStorage : SessionStorageService
  ) {
    super(http, helperService);
  }

  loggedIn() {
    return sessionStorage.getItem('jhi-authenticationToken') != null;
  }

  getCart() {
    var cart = sessionStorage.getItem('cart');
    if (cart == null) {
      return [];
    } else {
      return JSON.parse(cart);
    }
  }

  addToCart(data, quantity) {
    let isNew = true;
    // if (this.loggedIn()) {
    //   this.http.post<any>(`${this.applicationConfigService.getEndpointFor('api/cart-item')}`, data);
    // } else {
    let cart = sessionStorage.getItem('cart');
    if (cart == null) {
      let orderCart = [];
      orderCart.push({ productId: data.id, quantity: quantity, name: data.name, price: data.price, image: data.image });
      sessionStorage.setItem('cart', JSON.stringify(orderCart));
      this.toaStr.success('Đã thêm sản phẩm vào giỏ hàng');
    } else {
      let orderCart = JSON.parse(cart);
      orderCart.forEach(element => {
        if (element.productId === data.id) {
          element.quantity = element.quantity + quantity;
          isNew = false;
        }
      });
      if (isNew) {
        orderCart.push({ productId: data.id, quantity: quantity, name: data.name, price: data.price, image: data.image });
      }
      sessionStorage.setItem('cart', JSON.stringify(orderCart));
      this.toaStr.success('Đã thêm sản phẩm vào giỏ hàng');
    }
    // }
  }

  changeCart(data) {
    let cart = sessionStorage.getItem('cart');
    if (cart == null) {
      let orderCart = [];
      orderCart.push({ productId: data.id, quantity: data.quantity, name: data.name, price: data.price, image: data.image });
      sessionStorage.setItem('cart', JSON.stringify(orderCart));
    } else {
      let orderCart = JSON.parse(cart);
      orderCart.forEach(element => {
        if (element.productId === data.productId) {
          element.quantity = data.quantity;
        }
      });
      sessionStorage.setItem('cart', JSON.stringify(orderCart));
    }
  }

  remove(data) {
    console.log(data);
    let cart = sessionStorage.getItem('cart');
    if (cart == null) {
      return;
    }
    let cartOrder = JSON.parse(cart);
    cartOrder = cartOrder.filter(x => x.productId !== data.productId);
    sessionStorage.setItem('cart', JSON.stringify(cartOrder));
    this.toaStr.success('Đã xóa sản phẩm vào giỏ hàng');
  }

  createOrder(data) {
    return this.http.post<any>(`${this.applicationConfigService.getEndpointFor('api/orders/create')}`, data);
  }

  removeCart() {
    sessionStorage.removeItem('cart');
  }

  searchForView(data) {
    return this.http.post<any>(`${this.applicationConfigService.getEndpointFor('api/products/specialSearch')}`, data);
  }

  getProduct(id) {
    return this.http.get<any>(`${this.applicationConfigService.getEndpointFor('api/products/')}` + id).toPromise();
  }

  checkExist(data) {
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor('api/management/catalogs/checkExist')}`,
      data,
      this.httpOptions
    );
  }

  create(data) {
    return this.http.post<any>(`${this.applicationConfigService.getEndpointFor('api/products/create')}`, data);
  }

  update(data) {
    return this.http.post<any>(`${this.applicationConfigService.getEndpointFor('api/products/update')}`, data);
  }

  delete(data) {
    return this.http.post<any>(`${this.applicationConfigService.getEndpointFor('api/management/catalogs/delete')}`, data, this.httpOptions);
  }

  deleteSpec(data) {
    return this.http.post<any>(`${this.applicationConfigService.getEndpointFor('api/product-specs/delete')}`, data, this.httpOptions);
  }
}
