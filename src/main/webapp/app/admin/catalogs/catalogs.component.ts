import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CatalogService } from '../../core/service/catalog.service';
import {NO_ROW_GRID_TEMPLATE} from '../../app.constants';
import { ActionCatalogComponent } from './action-catalog/action-catalog.component';

@Component({
  selector: 'jhi-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.scss']
})
export class CatalogsComponent implements OnInit {

  noRowTemplate = NO_ROW_GRID_TEMPLATE.replace('{{field}}', 'Chưa có thông tin');
  columnDefs;
  tooltipShowDelay = 0;
  headerHeight = 56;
  rowHeight = 50;
  rowData;
  gridApi;
  gridColumnApi;
  codeSearch;
  nameSearch;
  defaultColDef;
  autoGroupColumnDef;
  serverSideStoreType;
  isServerSideGroupOpenByDefault;
  isServerSideGroup;
  getServerSideGroupKey;
  rowModelType="serverSide";

  constructor(
    private catalogService : CatalogService,
    public http: HttpClient,
    private toatr: ToastrService,
  ) {
    this.serverSideStoreType = 'partial';
    this.isServerSideGroupOpenByDefault = function (params) {
      return params.rowNode.level < 90;
    };
    this.getServerSideGroupKey = function (dataItem) {
      return dataItem.code;
    };
    this.isServerSideGroup = function (dataItem) {
      return dataItem.group;
    };
    this.defaultColDef = { sortable: true,  resizable: true , lockPosition: true, };
    this.columnDefs = [
      {
        headerName: "Tên danh mục",
        field: 'name',
        tooltipField: 'name',
        cellStyle: {
          'font-weight': '500',
          'font-size': '13px',
          'top': '10px',
          'align-items': 'center',
          color: '#3366FF',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'margin-right':'15px'
        }
      },
      {
        headerName: "Ngày sửa cuối",
        field: 'createDate',
        valueFormatter: this.dateFormatter,
        tooltipValueGetter: params => {
          return this.dateFormatter(params);
        },
        cellStyle: {
          'font-weight': '500',
          'font-size': '13px',
          'align-items': 'center',
          color: '#3366FF',
          'top': '10px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'margin-right':'15px'
        }
      },
      {
        headerName: "Người sửa cuối",
        field: 'createBy',
        tooltipField: 'createBy',
        cellStyle: {
          'font-weight': '500',
          'font-size': '13px',
          'align-items': 'center',
          color: '#3366FF',
          'top': '10px',
          'white-space': 'nowrap',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
          'margin-right':'15px'
        }
      },
      {
        headerName: '',
        field: '',
        minWidth: 40,
        maxWidth: 40,
        lockPosition: true,
        cellRendererFramework: ActionCatalogComponent,
        cellStyle: {
          'font-weight': '500',
          'font-size': '12px',
          color: '#101840',
          display: 'flex',
          'justify-content': 'center',
        }
      }
    ];
    this.autoGroupColumnDef = {
      field: 'code',
      lockPosition: true,
      headerName: "Mã danh mục",
      cellRendererParams: {
        innerRenderer(params) {
          return params.data.code;
        },
      },
      tooltipField: 'code',
      tooltip: (value: string): string => value,
      minWidth:200,
      cellStyle: {
        'top': '10px',
        'font-weight': '600',
        'font-size': '14px',
        'align-items': 'center',
        color: '#3366FF',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'margin-right':'15px'
      }

    };
   }

  ngOnInit(): void {
    this.loadingData();
  }

  dateFormatter(params) {
    return new Date(Date.parse(params.value)).toLocaleString();
  }

  loadingData() {
    this.catalogService.searchForTree(this.codeSearch, this.nameSearch).then(res => {
      this.rowData = res;
      console.log(res);

      // grid to
      const fakeServer = createFakeServer(this.rowData);
      const datasource = createServerSideDatasource(fakeServer);
      if(this.gridApi){
        this.gridApi.setServerSideDatasource(datasource);
      }
    });
  }

  searchData() {
    this.rowData = [];
    this.catalogService.searchForTree(this.codeSearch, this.nameSearch).then(res => {
      this.rowData = res;
      if (this.rowData.length === 0) {
        const fakeServer = createFakeServer(this.rowData);
        const datasource = createServerSideDatasource(fakeServer);
        this.gridApi.setServerSideDatasource(datasource);
        this.gridApi.showNoRowsOverlay();
      } else {
        const fakeServer = createFakeServer(this.rowData);
        const datasource = createServerSideDatasource(fakeServer);
        this.gridApi.setServerSideDatasource(datasource);
      }
    });
  }

  gridSizeChanged(params) {
    params.api.sizeColumnsToFit();
    // if(getWidthOfElement('ag-center-cols-container') > 1164){
    //   changeWidthAgCenterColsContainerStyle();
    // }
    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
      this.resizeTwoLastColumns();
    }, 500);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.showNoRowsOverlay();
    this.rowData = [];
    this.catalogService.searchForTree(this.codeSearch, this.nameSearch).then(res => {
      this.rowData = res;
      const fakeServer = createFakeServer(this.rowData);
      const datasource = createServerSideDatasource(fakeServer);
      params.api.setServerSideDatasource(datasource);
    });
    setTimeout(() => {
      params.api.sizeColumnsToFit();
      this.resizeTwoLastColumns();
    }, 1000);
    
  }

  resizeTwoLastColumns(): void {
    const wrapper = (document.querySelector('.ag-center-cols-viewport') as HTMLElement)
    const body = (document.querySelector('.ag-center-cols-container') as HTMLElement)
    setTimeout(() => body.style.minWidth = `${wrapper.offsetWidth}px`);
  }

}

function createFakeServer(fakeServerData) {
  function FakeServer(allData) {
    this.data = allData;
  }
  FakeServer.prototype.getData = function (request) {
    function extractRowsFromData(groupKeys, data) {
      if (groupKeys.length === 0) {
        return data.map(function (d) {
          return {
            group: !!d.children,
            name: d.name,
            code: d.code,
            id: d.id,
            parentId: d.parentId,
            createDate: d.createDate,
            createBy: d.createBy
          };
        });
      }
      const key = groupKeys[0];
      for (let i = 0; i < data.length; i++) {
        if (data[i].code === key) {
          return extractRowsFromData(
            groupKeys.slice(1),
            data[i].children.slice()
          );
        }
      }
    }
    return extractRowsFromData(request.groupKeys, this.data);
  };
  return new FakeServer(fakeServerData);
}

function createServerSideDatasource(fakeServer) {
  function ServerSideDatasource(fakeServer) {
    this.fakeServer = fakeServer;
  }
  ServerSideDatasource.prototype.getRows = function (params) {
    console.log('ServerSideDatasource.getRows: params = ', params);
    const allRows = this.fakeServer.getData(params.request);
    const request = params.request;
    const doingInfinite = request.startRow != null && request.endRow != null;
    const result = doingInfinite
      ? {

        rowData: allRows.slice(request.startRow, request.endRow),
        rowCount: allRows.length,
      }
      : { rowData: allRows };
    console.log('getRows: result = ', result);
    setTimeout(function () {
      params.success(result);
    }, 200);
  };
  return new ServerSideDatasource(fakeServer);
}