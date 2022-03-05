import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CatalogService } from 'app/core/service/catalog.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, forkJoin } from 'rxjs';

@Component({
  selector: 'jhi-create-update-catalog',
  templateUrl: './create-update-catalog.component.html',
  styleUrls: ['./create-update-catalog.component.scss'],
})
export class CreateUpdateCatalogComponent implements OnInit {
  isCreateNew: boolean;
  nodes: any = [];
  form1: FormGroup;
  placeHolder = 'Danh mục cha';
  isSubmit = false;

  code = {
    value: null,
    error: null,
    message: '',
  };

  name = {
    value: null,
    error: null,
    message: '',
  };

  parentId = {
    value: null,
    error: null,
    message: '',
  };

  sortOrder = {
    value: null,
    error: null,
    message: '',
  };

  constructor(
    public dialogRef: MatDialogRef<CreateUpdateCatalogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private catalogService: CatalogService,
    private toastr: ToastrService
  ) {
    this.isCreateNew = data.isCreateNew;
    this.buildForm1();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getDataForCreateUpdate();
    }, 0);
  }

  getDataForCreateUpdate() {
    console.log(this.data);
    if (this.isCreateNew == true) {
      this.catalogService.searchForTree().then(res => {
        this.removeExpand(res);
        this.nodes = res;
      });
    } else {
      forkJoin([
        this.catalogService.getCatalog(this.data.oldData.id),
        this.catalogService.searchForTree(null, null, this.data.oldData.id),
      ]).subscribe(
        ([res1, res2]) => {
          this.form1.get('id').setValue(res1.id);
          this.code.value = res1.code;
          this.name.value = res1.name;
          this.parentId.value = res1.parentId;
          this.sortOrder.value = res1.sortOrder;
          this.removeExpand(res2);
          this.nodes = res2;
        },
        err => {
          this.toastr.error('Lỗi không xác định. Thử lại sau');
          this.dialogRef.close({ event: 'research' });
        }
      );
    }
  }

  removeExpand(catalogstList: any) {
    if (catalogstList.constructor === Array) {
      catalogstList.map(e => {
        e.key = e.id;
        e.title = e.name;
        if (e.children === null) {
          e.isLeaf = true;
          return e;
        } else {
          this.removeExpand(e.children);
        }
      });
    }
  }

  buildForm1() {
    this.form1 = this.formBuilder.group({
      id: [null],
      code: [null],
      parentId: [null],
      name: [null],
      sortOrder: [null],
    });
    setTimeout(() => {
      this.resetData();
    }, 0);
  }

  resetData() {
    this.code.value = null;
    this.name.value = null;
    this.parentId.value = null;
    this.sortOrder.value = null;
    setTimeout(() => {
      this.code.error = false;
      this.name.error = false;
      this.parentId.error = false;
      this.sortOrder.error = false;
    }, 100);
  }

  closeModal() {
    // this.files =[];
    // this.form1.reset;
    this.dialogRef.close({ event: 'cancel' });
  }

  onChange($event: string): void {
    this.parentId.value = $event;
  }

  //====================Validate===================
  checkExist() {
    let data = {
      code: this.code.value?.trim(),
    };
    this.catalogService.checkExist(data).subscribe(res => {
      if (res.status == 'BAD_REQUEST') {
        this.code.error = true;
        this.code.message = res.message;
      }
    });
  }

  validateCatalogCode() {
    const pattern = /^[0-9A-Za-z{}|\\;:\[\]'"/+=\-_ )(><?.,]{1,50}$/;
    if (this.code.value == null || this.code.value.trim() == '' || this.code.value == undefined) {
      this.code.error = true;
      this.code.message = 'Mã danh mục không được để trống';
    } else {
      if (this.code.value.trim().includes(' ')) {
        this.code.message = 'Mã danh mục không được chứa khoảng trắng';
        this.code.error = true;
      } else {
        if (this.code.value.trim().length > 50) {
          this.code.error = true;
          this.code.message = 'Mã danh mục không quá 50 ký tự';
        } else if (!pattern.test(this.code.value)) {
          this.code.error = true;
          this.code.message = 'Mã danh mục không chứa ký tự đặc biệt';
        } else {
          this.code.error = false;
          this.code.message = '';
        }
      }
    }
  }

  validateName() {
    if (this.name.value == null || this.name.value.trim() == '' || this.name.value == undefined) {
      this.name.error = true;
      this.name.message = 'Tên danh mục không được để trống';
    } else {
      if (this.name.value.trim().length > 250) {
        this.name.error = true;
        this.name.message = 'Mã danh mục không quá 250 ký tự';
      } else {
        this.name.error = false;
        this.name.message = '';
      }
    }
  }

  validateSortOrder() {
    if (this.sortOrder.value == undefined || this.sortOrder == null) {
      return;
    }
    try {
      if (parseFloat(this.sortOrder.value) < 0) {
        this.sortOrder.error = true;
        this.sortOrder.message = 'Sai định dạng';
      } else {
        this.sortOrder.error = false;
        this.sortOrder.message = '';
      }
    } catch (err) {
      this.sortOrder.error = true;
      this.sortOrder.message = 'Sai định dạng';
    }
  }
  //Thêm mới catalog

  async createNewCatalog() {
    await this.checkExist();
    this.validateCatalogCode();
    this.validateName();
    this.isSubmit = true;
    if (this.code.error || this.name.error || this.parentId.error || this.sortOrder.error) {
      this.isSubmit = false;
      return;
    }
    const data = {
      code: this.code.value,
      name: this.name.value,
      parentId: this.parentId.value,
      sortOrder: this.sortOrder.value,
    };
    console.log(data);
    this.catalogService.create(data).subscribe(res => {
      if (res.status == 'OK') {
        this.toastr.success(res.message);
        this.dialogRef.close({ event: 'add' });
        this.isSubmit = false;
      } else {
        if (res.status == 'BAD_REQUEST') {
          this.code.error = true;
          this.code.message = res.message;
        } else {
          this.toastr.error(res.message);
        }
        this.isSubmit = false;
      }
      err => {
        this.toastr.error('Lỗi không xác định. Thử lại sau');
        this.isSubmit = false;
      };
    });
  }

  updateCatalog() {
    this.validateCatalogCode();
    this.validateName();
    this.isSubmit = true;
    if (this.code.error || this.name.error || this.parentId.error || this.sortOrder.error) {
      this.isSubmit = false;
      return;
    }
    const data = {
      id: this.form1.value['id'],
      code: this.code.value,
      name: this.name.value,
      parentId: this.parentId.value,
      sortOrder: this.sortOrder.value,
    };
    console.log(data);
    this.catalogService.update(data).subscribe(res => {
      if (res.status == 'OK') {
        this.toastr.success(res.message);
        this.dialogRef.close({ event: 'update' });
        this.isSubmit = false;
      } else {
        if (res.status == 'BAD_REQUEST') {
          this.code.error = true;
          this.code.message = res.message;
        } else {
          this.toastr.error(res.message);
        }
        this.isSubmit = false;
      }
      err => {
        this.toastr.error('Lỗi không xác định. Thử lại sau');
        this.isSubmit = false;
      };
    });
  }
}
