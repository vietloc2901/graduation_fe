import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
// @ts-ignore
// import * as fileSaver from 'file-saver';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class CommonServiceService {
  constructor(
    public httpClient: HttpClient,
    public helperService: HelperService,
    private toastr: ToastrService,
  ) {}

  downloadFile(
    url: string,
    data?: any,
    params?: any,
    fileName?: string,
    mimeType?: any
  ) {
    this.helperService.isProcessing(true);
    this.httpClient
      .post(url, data, {
        observe: 'response',
        responseType: 'arraybuffer',
        params,
      })
      .pipe(
        finalize(() => {
          this.helperService.isProcessing(false);
        })
      )
      .subscribe(
        (res) => {
          this.helperService.APP_TOAST_MESSAGE.next(res);
          try {
            const response = JSON.parse(
              new TextDecoder('utf-8').decode(res.body)
            );
            if (response.status.code === '200') {
              this.saveFile(response.data, fileName, mimeType);
              return;
            }
            this.toastr.error(response.status.message);
          } catch {
            this.saveFile(res.body, fileName, mimeType);
          }
        },
        (error) => {
          this.helperService.APP_TOAST_MESSAGE.next(error);
          this.toastr.error(
           "Lỗi"
          );
        }
      );
  }

  downloadFileUsingGet(
    url: string,
    params?: any,
    fileName?: string,
    mimeType?: any
  ) {
    this.helperService.isProcessing(true);
    this.httpClient
      .get(url, {
        observe: 'response',
        responseType: 'arraybuffer',
        params,
      })
      .pipe(
        finalize(() => {
          this.helperService.isProcessing(false);
        })
      )
      .subscribe(
        (res) => {
          this.helperService.APP_TOAST_MESSAGE.next(res);
          try {
            const response = JSON.parse(
              new TextDecoder('utf-8').decode(res.body)
            );
            if (response.status.code === '200') {
              this.saveFile(response.data, fileName, mimeType);
              return;
            }
            this.toastr.error(response.status.message);
          } catch {
            this.saveFile(res.body, fileName, mimeType);
          }
        },
        (error) => {
          this.helperService.APP_TOAST_MESSAGE.next(error);
          this.toastr.error(
            "Lỗi"
          );
        }
      );
  }

  downloadFileImport(
    url: string,
    data?: any,
    params?: any,
    fileName?: string,
    mimeType?: any
  ) {
    this.helperService.isProcessing(true);
    this.httpClient
      .post(url, data, {
        observe: 'response',
        responseType: 'arraybuffer',
        params,
      })
      .pipe(
        finalize(() => {
          this.helperService.isProcessing(false);
        })
      )
      .subscribe(
        (res) => {
          this.helperService.APP_TOAST_MESSAGE.next(res);
          try {
            // tslint:disable-next-line:triple-equals
            if (res.status == 200) {
              this.toastr.error(
                "Lỗi"
              );
              this.saveFile(res.body, fileName, mimeType);
              return;
            }
            // tslint:disable-next-line:triple-equals
            if (res.status == 202) {
              this.toastr.success(
                "Ok"
              );
              return;
            }
            // this.toastr.error(response.status.message);
          } catch {
            this.toastr.error(
              "Lỗi"
            );
            // this.saveFile(res.body, fileName, mimeType);
          }
        },
        (error) => {
          this.helperService.APP_TOAST_MESSAGE.next(error);
          this.toastr.error(
            "Lỗi"
          );
        }
      );
  }
  saveFile(data: any, filename?: string, mimeType?: any) {
    const blob = new Blob([data], {
      type:
        mimeType ||
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, filename);
  }
  pagination(current, last) {
    var delta = 2,
      left = current - delta,
      right = current + delta + 1,
      range = [],
      rangeWithDots = [],
      l;

    for (let i = 1; i <= last; i++) {
      if (i == 1 || i == last || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }
}
