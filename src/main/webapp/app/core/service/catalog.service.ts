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
export class CatalogService extends BasicService {
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

  importFile(file: any, isAddNew: any) {
    const url = this.applicationConfigService.getEndpointFor('api/catalogs/importFile');
    // const url =`http://localhost:8080/api/students/uploadFile`;
    const formData: FormData = new FormData();
    formData.append('file', file ? file : null);
    formData.append('isAddNew', isAddNew);
    return this.httpClient.post(url, formData, {
      observe: 'response',
    });
  }

  downloadErrorFile(classroomDTO: any) {
    const url = this.applicationConfigService.getEndpointFor('api/catalogs/downloadErrorFile');
    return this.commonService.downloadFile(url, classroomDTO, null, 'DS_ImportLoi.xlsx');
  }

  downloadSampleFile() {
    const url = this.applicationConfigService.getEndpointFor('api/catalogs/getSampleFile');
    return this.commonService.downloadFile(url, null, null, 'DSdanhmucsanphammau.xlsx');
  }

  searchForTree(code?, name?, id?) {
    let param = {
      id: id,
      code: code,
      name: name,
    };
    return this.http.post<any>(`${this.applicationConfigService.getEndpointFor('api/catalogs/searchForTree')}`, param).toPromise();
  }

  getCatalog(id) {
    return this.http.get<any>(`${this.applicationConfigService.getEndpointFor('api/catalogs/')}` + id).toPromise();
  }

  export(data) {
    let url = this.applicationConfigService.getEndpointFor('api/catalogs/exportExcel');
    return this.commonService.downloadFile(url, data, null, 'DSdanhmucsanpham' + `${moment().format('DDMMYYYY').toString()}.xlsx`);
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
