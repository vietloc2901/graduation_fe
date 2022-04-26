import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NO_ROW_GRID_TEMPLATE } from 'app/app.constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { CommonServiceService } from 'app/core/service/common-service.service';
import { CatalogService } from 'app/core/service/catalog.service';
import { ProductService } from 'app/core/service/product.service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ActionProductComponent } from './action-product/action-product.component';

@Component({
  selector: 'jhi-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  formData;
  codeSearch;
  nameSearch;
  parentIdSearch;
  statusSearch;
  placeHolder = 'Danh mục';
  nodes: any = [];
  hide = true;
  modalRef: BsModalRef;
  modalRefApprove: BsModalRef;
  form: FormGroup;
  columnDefs = [];
  rowData = [];
  noRowsTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', 'Chưa có thông tin');
  gridApi;
  gridColumnApi;
  headerHeight = 56;
  rowHeight = 56;
  frameworkComponents;
  currentRoles = [];
  isRole: boolean;
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

  constructor(
    private toastr: ToastrService,
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private renderer: Renderer2,
    private catalogService: CatalogService,
    private productService: ProductService,
    public router: Router
  ) {
    this.columnDefs = [
      {
        headerName: 'Stt',
        headerTooltip: 'Stt',
        lockPosition: true,
        suppressMovable: true,
        field: 'id',
        minWidth: 48,
        maxWidth: 48,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          display: 'flex',
          // top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          // textAlign: 'center',
          'justify-content': 'center',
        },
        valueGetter: param => {
          return param.node.rowIndex + ((this.page - 1) * this.pageSize + 1);
        },
      },
      {
        headerName: 'Mã sản phẩm',
        headerTooltip: 'Mã sản phẩm',
        field: 'code',
        suppressMovable: true,
        minWidth: 142,
        width: 142,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'code',
      },
      {
        headerName: 'Tên sản phẩm',
        headerTooltip: 'Tên sản phẩm',
        field: 'name',
        suppressMovable: true,
        minWidth: 128,
        width: 128,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'name',
      },
      {
        headerName: 'Danh mục',
        headerTooltip: 'Danh mục',
        field: 'catalogName',
        suppressMovable: true,
        minWidth: 128,
        width: 128,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'catalogName',
      },
      {
        headerName: 'Giá bán',
        headerTooltip: 'Giá bán',
        field: 'price',
        valueFormatter: this.formatCurrency,
        suppressMovable: true,
        width: 128,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'price',
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'status',
        valueFormatter: this.formatStatus,
        tooltipValueGetter: params => {
          return this.formatStatus(params);
        },
        suppressMovable: true,
        width: 128,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
      },
      {
        headerName: 'Ngày sửa cuối',
        headerTooltip: 'Ngày sửa cuối',
        field: 'lastModifiedDate',
        valueFormatter: this.dateFormatter,
        tooltipValueGetter: params => {
          return this.dateFormatter(params);
        },
        suppressMovable: true,
        minWidth: 128,
        width: 128,
        cellClass: 'grid-cell-centered',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'margin-left': '5px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'lastModifiedDate',
      },
      {
        headerName: 'Người sửa cuối',
        headerTooltip: 'Người sửa cuối',
        field: 'lastModifiedBy',
        suppressMovable: true,
        minWidth: 128,
        width: 128,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'margin-left': '5px',
          color: '#101840',
          //display: 'flex',
          top: '12px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        tooltipField: 'lastModifiedBy',
      },
      {
        headerName: '',
        field: 'undefined',
        suppressMovable: true,
        //displayce: 'nowrap',
        cellRendererFramework: ActionProductComponent,
        minWidth: 48,
        maxWidth: 48,
      },
    ];
  }

  ngOnInit(): void {
    this.buildForm();
    this.getData();
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.changeDetectorRef.detectChanges();
    }, 0);
  }

  onChange($event: string): void {
    this.parentIdSearch = $event;
  }

  getData() {
    this.catalogService.searchForTree().then(res => {
      this.removeExpand(res);
      this.nodes = res;
    });
    this.search(1);
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

  formatCurrency(params) {
    return params.value.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' });
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  dateFormatter(params) {
    return new Date(Date.parse(params.value)).toLocaleString();
  }

  formatStatus(params) {
    if (params.value === true) return 'Kinh doanh';
    else return 'Ngừng kinh doanh';
  }

  totalRecord = 0;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  pageSize = 10;
  page;
  rangeWithDots: any[];
  searchDataExport: any;

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
    }, 50);
  }

  exportExcel() {
    let data = {
      code: this.codeSearch,
      name: this.nameSearch,
      catalogId: this.parentIdSearch,
      status: this.statusSearch,
    };
    this.productService.export(data);
  }

  search(page: number) {
    try {
      this.gridApi.showLoadingOverlay();
    } catch (e) {}
    this.page = page;
    const data = {
      code: this.codeSearch,
      name: this.nameSearch,
      catalogId: this.parentIdSearch,
      status: this.statusSearch,
    };
    this.productService.search(data, page, this.pageSize).subscribe(
      (res: any) => {
        this.rowData = res.data;
        this.totalRecord = res.total;
        this.first = (page - 1) * this.pageSize + 1;
        this.last = this.first + this.rowData.length - 1;
        if (this.totalRecord % this.pageSize === 0) {
          this.totalPage = Math.floor(this.totalRecord / this.pageSize);
          this.rangeWithDots = this.commonService.pagination(this.page, this.totalPage);
        } else {
          this.totalPage = Math.floor(this.totalRecord / this.pageSize) + 1;
          this.rangeWithDots = this.commonService.pagination(this.page, this.totalPage);
        }
        this.hide = true;
        this.gridApi.sizeColumnsToFit();
        this.gridApi.setRowData(this.rowData);
        this.changeDetectorRef.detectChanges();
      },
      err => {}
    );
  }

  buildForm() {
    this.form = this.formBuilder.group({
      documentType: [''],
      releaseDate: [null],
      compendia: [''],
    });
    this.changeDetectorRef.detectChanges();
  }

  //===============================Paging=============
  paging(pageSearch: number): void {
    if (this.page == pageSearch) {
      return;
    }
    this.page = pageSearch;
    this.search(pageSearch);
    console.log(this.page);
  }

  prev(): void {
    this.page--;
    if (this.page < 1) {
      this.page = 1;
      return;
    }
    this.search(this.page);
  }

  next(): void {
    this.page++;
    if (this.page > this.totalPage) {
      this.page = this.totalPage;
      return;
    }
    this.search(this.page);
  }

  routerToCreatePage() {
    this.router.navigate(['admin/create-update-product']);
  }

  routerToUpdatePage(id) {
    this.router.navigate(['admin/create-update-product', id]);
  }
}
