import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NO_ROW_GRID_TEMPLATE } from 'app/app.constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { CommonServiceService } from 'app/core/service/common-service.service';
import { Router } from '@angular/router';
import { OrderService } from 'app/core/service/order.service';

@Component({
  selector: 'jhi-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  formData;
  createDate;
  statusSearch;
  placeHolder = 'Danh mục';
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
      id: 'WAITING',
      name: 'Đang chờ',
    },
    {
      id: 'PREPARING',
      name: 'Đang chuẩn bị',
    },
    {
      id: 'TRANSFERING',
      name: 'Đang giao',
    },
    {
      id: 'DONE',
      name: 'Hoàn thành',
    },
    {
      id: 'CANCEL',
      name: 'Hủy',
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
    public router: Router,
    private orderService: OrderService
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
        headerName: 'Tên người đặt',
        headerTooltip: 'Tên người đặt',
        field: 'name',
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
        tooltipField: 'name',
      },
      {
        headerName: 'SĐT người đặt',
        headerTooltip: 'SĐT người đặt',
        field: 'phone',
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
        tooltipField: 'phone',
      },
      {
        headerName: 'Tên người nhận',
        headerTooltip: 'Tên người nhận',
        field: 'receiverName',
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
        tooltipField: 'receiverName',
      },
      {
        headerName: 'SĐT người nhận',
        headerTooltip: 'SĐT người nhận',
        field: 'receiverPhone',
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
        tooltipField: 'receiverPhone',
      },
      {
        headerName: 'Địa chỉ',
        headerTooltip: 'Địa chỉ',
        field: 'address',
        suppressMovable: true,
        tooltipField: 'address',
        minWidth: 128,
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
        headerName: 'Ngày tạo',
        headerTooltip: 'Ngày tạo',
        field: 'createDate',
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
        tooltipField: 'createDate',
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
        cellRendererFramework: '',
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

  getData() {
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

  search(page: number) {
    try {
      this.gridApi.showLoadingOverlay();
    } catch (e) {}
    this.page = page;
    const data = {
      createDate: this.createDate,
      status: this.statusSearch,
    };
    this.orderService.search(data, page, this.pageSize).subscribe(
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
