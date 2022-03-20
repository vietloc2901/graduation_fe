import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogService } from 'app/core/service/catalog.service';
import { CommonServiceService } from 'app/core/service/common-service.service';
import { ProductService } from 'app/core/service/product.service';

@Component({
  selector: 'jhi-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  constructor(
    private router: Router,
    private catalogService: CatalogService,
    private productService: ProductService,
    private commonService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  totalRecord = 0;
  first = 1;
  last = 10;
  total = 0;
  totalPage = 0;
  pageSize = 12;
  page;
  rangeWithDots: any[];
  searchKey;
  order;
  listOrder = [
    {
      id: 'asc',
      name: 'Tăng dần',
    },
    {
      id: 'desc',
      name: 'Giảm dần',
    },
  ];

  search(page) {
    let searchData = {
      catalogId: this.parentIdSearch,
      name: this.searchKey,
      orderType: this.order,
    };
    this.page = page;
    this.productService.searchForViewProducts(searchData, page, this.pageSize).subscribe(
      (res: any) => {
        this.listSpecical = res.data;
        this.totalRecord = res.total;
        this.first = (page - 1) * this.pageSize + 1;
        this.last = this.first + this.listSpecical.length - 1;
        if (this.totalRecord % this.pageSize === 0) {
          this.totalPage = Math.floor(this.totalRecord / this.pageSize);
          this.rangeWithDots = this.commonService.pagination(this.page, this.totalPage);
        } else {
          this.totalPage = Math.floor(this.totalRecord / this.pageSize) + 1;
          this.rangeWithDots = this.commonService.pagination(this.page, this.totalPage);
        }
      },
      err => {}
    );
    // this.productService.search(searchData, page, this.pageSize).subscribe((res) => {
    //   this.listSpecical = res.data;
    //   if(!this.check()){
    //     this.catalogName = res.data[0].catalogName;
    //   }
    // })
  }

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

  placeHolder = 'Danh mục sản phẩm';
  nodes: any = [];
  parentIdSearch;
  listSpecical: any = [];
  catalogName;
  listCatalogs = [];
  listDataMore = [];

  onChange($event: string): void {
    this.parentIdSearch = $event;
  }

  check() {
    if (this.parentIdSearch == undefined || this.parentIdSearch == null || this.parentIdSearch == '') {
      return false;
    }
    return true;
  }

  routerToDetails(id) {
    this.router.navigate(['product-detail', id]);
  }

  getName(data) {
    if (data.length > 50) {
      return data.substring(0, 50) + '...';
    } else {
      return data;
    }
  }

  getData() {
    this.catalogService.searchForTree().then(res => {
      this.listCatalogs = res;
      this.removeExpand(res);
      this.nodes = res;
    });
    this.order = this.listOrder[1].id;
    this.search(1);
  }

  formatCurrency(params) {
    return params.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' });
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
}
