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
import { UserService } from 'app/core/service/user.service';
import { CreateUserManagerComponent } from './create-user-manager/create-user-manager.component';
import { ActionUserManagerComponent } from './action-user-manager/action-user-manager.component';

@Component({
  selector: 'jhi-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  formData;
  keySearch;
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
      id: 'ROLE_MANAGE',
      name: 'Quản lý',
    },
    {
      id: 'ROLE_USER',
      name: 'Người dùng',
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
    private userService: UserService,
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
        headerName: 'Tên đăng nhập',
        headerTooltip: 'Tên đăng nhập',
        field: 'login',
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
        tooltipField: 'login',
      },
      {
        headerName: 'Địa chỉ',
        headerTooltip: 'Địa chỉ',
        field: 'address',
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
        tooltipField: 'address',
      },
      {
        headerName: 'Họ và tên',
        headerTooltip: 'Họ và tên',
        field: 'fullName',
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
        tooltipField: 'fullName',
      },
      {
        headerName: 'Email',
        headerTooltip: 'Email',
        field: 'email',
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
        tooltipField: 'email',
      },
      {
        headerName: 'Trạng thái',
        headerTooltip: 'Trạng thái',
        field: 'activated',
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
          overflow: 'activated',
        },
      },
      {
        headerName: '',
        field: 'undefined',
        suppressMovable: true,
        //displayce: 'nowrap',
        cellRendererFramework: ActionUserManagerComponent,
        minWidth: 48,
        maxWidth: 48,
      },
    ];
  }

  ngOnInit(): void {
    this.statusSearch = this.listStatus[0].id
    this.search(1);
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
    console.log(params)
    if (params.value === true) return 'Đã kích hoạt';
    else return 'Đã vô hiệu hóa';
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
      login: this.keySearch??"",
      authString: this.statusSearch,
    };
    this.userService.search(data, page, this.pageSize).subscribe(
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

  openModalCreate(){
    this.matDialog
      .open(CreateUserManagerComponent, {
        maxHeight: window.innerHeight + 'px',
        disableClose: true,
        hasBackdrop: true,
        width: '446px',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe(res => {
        console.log(res);
        if (res.event != 'cancel') {
          this.search(1);
        }
      });
  }

}
