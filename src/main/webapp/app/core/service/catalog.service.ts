import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, never } from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../../environment/environment';
import {BasicService} from './basic.service';
import {HelperService} from './helper.service';
import { CommonServiceService } from './common-service.service';


@Injectable({
    providedIn: 'root'
  })

  export class CatalogService extends BasicService{

    private API = `${environment.API_GATEWAY_ENDPOINT}`;
    private API_TEST = `${environment.API_GATEWAY_ENDPOINT}`;
    public loading = new BehaviorSubject<any>('next')

    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      })
    }

  // Kiểu chọn
  public type = new BehaviorSubject<any>('');
  type$ = this.type.asObservable();

  // Năm đc chọn trên header
  public yearCurrent = new BehaviorSubject<any>('');
  yearCurrent$ = this.yearCurrent.asObservable();

  // Tháng đc chọn trên header
  public monthCurrent = new BehaviorSubject<any>('');
  monthCurrent$ = this.monthCurrent.asObservable();

  // Quý đc chọn trên header
  public quartersCurrent = new BehaviorSubject<any>('');
  quartersCurrent$ = this.quartersCurrent.asObservable();

  public subheaderObj = new BehaviorSubject<any>({});
  currentSubheader$ = this.subheaderObj.asObservable()

    constructor(private http: HttpClient,private commonService: CommonServiceService,
                public helperService: HelperService) {
      super(http,helperService);
    }

    


}
