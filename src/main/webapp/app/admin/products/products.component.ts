import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NO_ROW_GRID_TEMPLATE } from 'app/app.constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { CommonServiceService } from 'app/core/service/common-service.service';
import { CatalogService } from 'app/core/service/catalog.service';

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

  isCreateNew: boolean;

  constructor(
    private toastr: ToastrService,
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonServiceService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private renderer: Renderer2,
    private catalogService: CatalogService
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
        headerClass: 'center unPadding',
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
        headerName: 'Ngày sửa cuối',
        headerTooltip: 'Ngày sửa cuối',
        field: 'lastModifiedDate',
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
        cellClass: 'grid-cell-centered',
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          'align-items': 'center',
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

  onChange($event: string): void {
    this.parentIdSearch = $event;
  }

  getData() {
    this.catalogService.searchForTree().then(res => {
      this.removeExpand(res);
      this.nodes = res;
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

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  dateFormatter(params) {
    return new Date(Date.parse(params.value)).toLocaleTimeString();
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
    this.hide = false;
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

  //======================Open Modal=======================
  // openModalDocument() {
  //   const dataAdd : any = {};
  //   dataAdd.listDocumentAdd = this.listDocumentAdd;
  //   dataAdd.listSigner = this.listSigner;
  //   this.isCreateNew = true;
  //   dataAdd.isCreateNew = this.isCreateNew;
  //   this.matDialog.open(
  //     CreateOfficalLetterComponent,{
  //       data: dataAdd,
  //       maxHeight: window.innerHeight + 'px',
  //       disableClose: true,
  //       hasBackdrop: true,
  //       width: '446px',
  //       autoFocus: false,
  //     }
  //   ).afterClosed().subscribe((res) => {
  //     console.log(res);
  //     if(res.event != 'cancel'){
  //       this.search(1);
  //     }
  //   });
  // }
}
