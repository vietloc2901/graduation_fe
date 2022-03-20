import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CatalogService } from 'app/core/service/catalog.service';
import { ProductService } from 'app/core/service/product.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PopupConfirmComponent } from 'app/popup-confirm/popup-confirm.component';

@Component({
  selector: 'jhi-creat-update-product',
  templateUrl: './creat-update-product.component.html',
  styleUrls: ['./creat-update-product.component.scss'],
})
export class CreatUpdateProductComponent implements OnInit {
  productId;

  constructor(
    private fb: FormBuilder,
    private toaStr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
    private matDilog: MatDialog,
    private productService: ProductService,
    public router: Router,
    private route: ActivatedRoute,
    private catalogService: CatalogService
  ) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.productId = +params.get('id');
    });
    if (this.productId == 0 || this.productId == undefined || this.productId == null) {
      this.isCreate = true;
    } else {
      this.isCreate = false;
    }
    this.catalogService.searchForTree().then(res => {
      this.removeExpand(res);
      this.listCatalog = res;
    });

    this.form = this.fb.group({
      id: [null],
      status: [this.listStatus[0].id],
      code: [null, [Validators.required, Validators.maxLength(50)]],
      name: [null, [Validators.required, Validators.maxLength(250)]],
      brand: [null, [Validators.required]],
      price: [null, [Validators.required]],
      productDetails: [null],
      descriptionDocument: [null],
      catalog: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.imageUrl = '../../../content/images/camera.png';
    if (this.isCreate) {
      this.form = this.fb.group({
        id: [null],
        status: [this.listStatus[0].id],
        code: [null, [Validators.required, Validators.maxLength(50)]],
        name: [null, [Validators.required, Validators.maxLength(250)]],
        brand: [null, [Validators.required]],
        price: [null, [Validators.required]],
        productDetails: [null],
        descriptionDocument: [null],
        catalog: [null, [Validators.required]],
      });
    } else {
      this.productService.getProduct(this.productId).then(res => {
        if (res.status == 'OK') {
          let data = res.data;
          this.form = this.fb.group({
            id: [data.id],
            status: [data.status ? 1 : 0],
            code: [data.code, [Validators.required, Validators.maxLength(50)]],
            name: [data.name, [Validators.required, Validators.maxLength(250)]],
            brand: [data.brand, [Validators.required]],
            price: [data.price, [Validators.required]],
            productDetails: [data.productDetails],
            descriptionDocument: [data.descriptionDocument],
            catalog: [data.catalogId, [Validators.required]],
          });
          this.numberSpec = data.specsDTOList;
          this.imageUrl = data.image;
        } else {
          this.toaStr.error('Sản phẩm không còn tồn tại');
          this.router.navigate(['admin/product-management']);
        }
      });
    }
  }

  getTitle() {
    return this.isCreate ? 'Thêm mới sản phẩm' : 'Cập nhật sản phẩm';
  }

  form;

  isCreate = true;
  placeHolder = 'Danh mục sản phẩm';

  productImage: File;
  previousFile: File;
  previousImage;
  imageUrl;
  listImages;
  numberSpec = [];
  listCatalog: any = [];
  listStatus = [
    {
      id: 1,
      name: 'Kinh doanh',
    },
    {
      id: 0,
      name: 'Ngừng kinh doanh',
    },
  ];

  get getControl() {
    return this.form.controls;
  }

  log(text: string) {
    console.log(text);
  }

  addItem() {
    let id = 'spec' + this.numberSpec.length;
    while (this.numberSpec.findIndex(x => x.id === id) != -1) {
      id = id + 1;
    }
    this.numberSpec.push({
      id: id,
      key: '',
      value: this.numberSpec.length + 1,
      productId: '',
    });
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

  deleteSpecInlist(item) {
    this.numberSpec = this.numberSpec.filter(x => x.id !== item.id);
  }

  deleteSpec(item) {
    if (item.productId == '' || item.productId == undefined || item.productId == null) {
      this.deleteSpecInlist(item);
      return;
    }
    if (this.isCreate) {
      this.deleteSpecInlist(item);
      return;
    } else {
      const dataConfirm = { title: 'Xóa thông số', message: 'Bạn có chắc chắn muốn xóa thông số này ?' };
      this.matDilog
        .open(PopupConfirmComponent, {
          data: dataConfirm,
          disableClose: true,
          hasBackdrop: true,
          width: '420px',
        })
        .afterClosed()
        .subscribe(res => {
          if (res.event == 'confirm') {
            const dataDelete: any = {
              id: item.id,
            };
            this.productService.deleteSpec(dataDelete).subscribe(res => {
              if (res.status == 'OK') {
                this.toaStr.success(res.message);
                this.deleteSpecInlist(item);
              } else {
                this.toaStr.error(res.message);
              }
            });
          }
        });
    }
  }

  processFile(imageInput: any) {
    if (imageInput == undefined || !imageInput.files[0]) return;

    this.productImage = imageInput.files[0];
    const nameImage = this.productImage.name;
    const sizeImage = this.productImage.size;

    if (sizeImage > 5242880) {
      this.toaStr.error('File không quá 5MB');
      this.productImage = this.previousFile || null;
      imageInput.value = this.previousImage?.value || null;
      return;
    }

    this.previousFile = imageInput.files[0];
    this.previousImage = imageInput;
    const reader = new FileReader();
    reader.readAsDataURL(this.productImage);
    reader.onload = _event => {
      this.imageUrl = reader.result;
      this.changeDetectorRef.detectChanges();
    };
  }

  createProduct() {
    if (this.productImage == null) {
      this.toaStr.error('Ảnh sản phẩm không được để trống!');
      return;
    }
    if (this.isCreate) {
      this.numberSpec.forEach(val => {
        val.id = '';
      });
    }
    const formData = new FormData();
    formData.append('name', this.form.value.name);
    formData.append('code', this.form.value.code);
    formData.append('brand', this.form.value.brand);
    formData.append('price', this.form.value.price);
    formData.append('productDetails', this.form.value.productDetails);
    formData.append('descriptionDocument', this.form.value.descriptionDocument);
    formData.append('status', this.form.value.status);
    formData.append('spec', JSON.stringify(this.numberSpec));
    formData.append('image', this.productImage);
    formData.append('catalog', this.form.value.catalog);

    this.productService.create(formData).subscribe(res => {
      if (res.status == 'OK') {
        this.toaStr.success(res.message);
        this.router.navigate(['admin/product-management']);
      } else {
        this.toaStr.error(res.message);
      }
      err => {
        this.toaStr.error('Lỗi không xác định. Thử lại sau');
      };
    });
  }

  updateProduct() {
    this.numberSpec.forEach(val => {
      if (val.id.toString().startsWith('spec')) {
        val.id = '';
      }
    });
    const formData = new FormData();
    formData.append('id', this.form.value.id);
    formData.append('name', this.form.value.name);
    formData.append('code', this.form.value.code);
    formData.append('brand', this.form.value.brand);
    formData.append('price', this.form.value.price);
    formData.append('productDetails', this.form.value.productDetails);
    formData.append('descriptionDocument', this.form.value.descriptionDocument);
    formData.append('status', this.form.value.status);
    formData.append('spec', JSON.stringify(this.numberSpec));
    formData.append('image', this.productImage);
    formData.append('catalog', this.form.value.catalog);

    this.productService.update(formData).subscribe(res => {
      if (res.status == 'OK') {
        this.toaStr.success(res.message);
        this.router.navigate(['admin/product-management']);
      } else {
        this.toaStr.error(res.message);
      }
      err => {
        this.toaStr.error('Lỗi không xác định. Thử lại sau');
      };
    });
  }

  open() {}

  onSubmit() {
    const recursive = (f: FormGroup | FormArray) => {
      for (const i in f.controls) {
        if (typeof f.controls[i].value === 'string') {
          if (Boolean(f.controls[i].value)) {
            f.controls[i].value = f.controls[i].value.trim();
          }
        }

        if (f.controls[i] instanceof FormControl) {
          f.controls[i].markAsDirty();
          f.controls[i].updateValueAndValidity();
        } else {
          recursive(f.controls[i] as any);
        }
      }
    };
    recursive(this.form);
    if (this.form.invalid) {
      return;
    }
    if (this.isCreate === true) {
      this.createProduct();
    } else {
      this.updateProduct();
    }
  }
}
