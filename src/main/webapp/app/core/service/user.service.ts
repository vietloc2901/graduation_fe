import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { ApplicationConfigService } from '../config/application-config.service';
import { BasicService } from './basic.service';
import { CommonServiceService } from './common-service.service';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BasicService{

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
      `${this.applicationConfigService.getEndpointFor('api/admin/allUser')}?page=${page}&pageSize=${pageSize}`,
      data
    );
  }

  createUser(data){
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor('api/admin/createUser')}`,
      data
    );
  }

  updateUser(data){
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor('api/admin/changeStatus')}`,
      data
    );
  }

}
