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
export class OrderService extends BasicService {
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
      `${this.applicationConfigService.getEndpointFor('api/orders/search')}?page=${page}&pageSize=${pageSize}`,
      data
    );
  }

  searchWithAuthority(data, page, pageSize) {
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor('api/orders/getWithAuthority')}?page=${page}&pageSize=${pageSize}`,
      data
    );
  }

  findById(data){
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor('api/orders/getById')}`,
      data
    );
  }

  updateStatus(data){
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor('api/orders/getChangeStatus')}`,
      data
    );
  }

  exportExcel(data){
    let url = this.applicationConfigService.getEndpointFor('api/orders/exportExcel');
    return this.commonService.downloadFile(url, data, null, 'DSdonhang' + `${moment().format('DDMMYYYY').toString()}.xlsx`);
  }

  cancel(data){
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor('api/orders/cancelOrder')}`,
      data
    );
  }

  statistic(data){
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor('api/statistic')}`,
      data
    );
  }
}
