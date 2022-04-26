import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, never } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { BasicService } from './basic.service';
import { HelperService } from './helper.service';
import { CommonServiceService } from './common-service.service';
import { ApplicationConfigService } from '../config/application-config.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BasicService {
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
    private applicationConfigService: ApplicationConfigService
  ) {
    super(http, helperService);
  }

  search(data, page, pageSize) {
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor('api/products/search')}?page=${page}&pageSize=${pageSize}`,
      data
    );
  }

  searchForViewProducts(data, page, pageSize) {
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor('api/products/searchForViewProduct')}?page=${page}&pageSize=${pageSize}`,
      data
    );
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

  export(data) {
    let url = this.applicationConfigService.getEndpointFor('api/products/exportExcel');
    return this.commonService.downloadFile(url, data, null, 'DSsanpham' + `${moment().format('DDMMYYYY').toString()}.xlsx`);
  }
}
