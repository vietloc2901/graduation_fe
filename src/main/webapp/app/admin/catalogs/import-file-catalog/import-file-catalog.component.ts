import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { CatalogService } from 'app/core/service/catalog.service';

@Component({
  selector: 'jhi-import-file-catalog',
  templateUrl: './import-file-catalog.component.html',
  styleUrls: ['./import-file-catalog.component.scss'],
})
export class ImportFileCatalogComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  formImportSubject: FormGroup;
  fileImport: File;
  errorUpload = false;
  errorUploadMsg: any;
  totalSuccess: number;
  totalRecord: number;
  totalError: number;
  isImported = false;
  subjectDTOSaveInfoError: any;
  disableImport = true;
  nameFile: any;
  uploaded = false;
  sizeFile: any;
  hide = true;
  isAddNew;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ImportFileCatalogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private catalogService: CatalogService,
    private toastr: ToastrService
  ) {
    this.disableImport = true;
  }

  ngOnInit(): void {
    console.log('isAddNew', this.isAddNew);
    // this.formImportSubject = this.fb.group({
    //   years: [{value: '', disabled: true}, Validators.required],
    //   isAddNew: ['', Validators.required]
    // })
    // // this.formImportSubject.get('years').setValue(this.years);
    // this.formImportSubject.get('isAddNew').setValue(0);
    this.isAddNew = 1;
  }

  onDismiss() {
    this.dialogRef.close({ event: 'cancel' });
  }

  onFileInput(event) {
    console.log(event);
    if (event.target.files[0] === undefined) {
      return;
    }
    console.log(event);
    const file: File = event.target.files[0];
    console.log('size', file.size);
    console.log('type', file.type);
    if (!(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
      this.toastr.error('File phải có định dạng xlsx, xls!');
      this.uploaded = false;
      this.disableImport = true;
      return;
    }
    if (file.size > 5242880) {
      this.toastr.error('File phải có dung lượng nhỏ hơn 5Mb');
      this.uploaded = false;
      this.disableImport = true;
      return;
    }
    this.fileImport = file;

    this.uploaded = true;
    this.disableImport = false;
    this.nameFile = event.target.files[0].name;
    this.sizeFile = event.target.files[0].size;
    this.myInputVariable.nativeElement.value = '';
  }

  deleteFile() {
    this.uploaded = false;
    this.disableImport = true;
    this.isImported = false;
  }

  importFile() {
    this.hide = false;
    console.log('isAddNew', this.isAddNew);
    this.catalogService.importFile(this.fileImport, this.isAddNew).subscribe(
      resAPI => {
        this.hide = true;
        console.log(resAPI);
        const dataRes: any = resAPI.body;
        if (dataRes.status === 'OK') {
          this.subjectDTOSaveInfoError = dataRes.data.pop();
          this.totalSuccess = this.subjectDTOSaveInfoError.totalSuccess;
          this.totalError = this.subjectDTOSaveInfoError.totalFail;
          this.totalRecord = this.totalError + this.totalSuccess;
          this.isImported = true;
          this.toastr.success(dataRes.message);
        } else if (dataRes.status === 'BAD_REQUEST') {
          if (dataRes.data !== null) {
            this.subjectDTOSaveInfoError = dataRes.data.pop();
            this.totalSuccess = this.subjectDTOSaveInfoError.totalSuccess;
            this.totalError = this.subjectDTOSaveInfoError.totalFail;
            this.totalRecord = this.totalError + this.totalSuccess;
            this.isImported = true;
          }
          this.toastr.error(dataRes.message);
        }
      },
      err => {
        this.toastr.error('Import lỗi!');
      }
    );

    this.disableImport = true;
  }

  downloadErrorFile() {
    this.catalogService.downloadErrorFile(this.subjectDTOSaveInfoError);
  }

  downloadSampleFile() {
    this.catalogService.downloadSampleFile();
  }
}
function MAT_DIALOG_DATA(MAT_DIALOG_DATA: any) {
  throw new Error('Function not implemented.');
}
