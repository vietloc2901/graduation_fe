import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, never } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { BasicService } from './basic.service';
import { HelperService } from './helper.service';
import { CommonServiceService } from './common-service.service';
import { ApplicationConfigService } from '../config/application-config.service';

@Injectable({
  providedIn: 'root',
})
export class CatalogService extends BasicService {
  private API = `${environment.API_GATEWAY_ENDPOINT}`;
  private API_TEST = `${environment.API_GATEWAY_ENDPOINT}`;
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

  searchForTree(code?, name?, id?) {
    let param = {
      id: id,
      code: code,
      name: name,
    };
    return this.http.post(`${this.applicationConfigService.getEndpointFor('api/catalogs/searchForTree')}`, param).toPromise();
  }

  getCatalog(id) {
    return this.http.get<any>(`${this.applicationConfigService.getEndpointFor('api/catalogs/')}` + id).toPromise();
  }

  checkExist(data) {
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor('api/management/catalogs/checkExist')}`,
      data,
      this.httpOptions
    );
  }

  create(data) {
    return this.http.post<any>(`${this.applicationConfigService.getEndpointFor('api/management/catalogs')}`, data, this.httpOptions);
  }

  update(data) {
    return this.http.post<any>(`${this.applicationConfigService.getEndpointFor('api/management/catalogs/update')}`, data, this.httpOptions);
  }

  delete(data) {
    return this.http.post<any>(`${this.applicationConfigService.getEndpointFor('api/management/catalogs/delete')}`, data, this.httpOptions);
  }
}
