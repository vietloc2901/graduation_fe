import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { CatalogService } from 'app/core/service/catalog.service';
import { ProductService } from 'app/core/service/product.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private catalogService: CatalogService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
    this.getData();
    this.loadMoreData();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  search() {
    let searchData = {
      catalogId: this.parentIdSearch,
    };
    this.productService.searchForView(searchData).subscribe(res => {
      this.listSpecical = res.data;
      if (!this.check()) {
        this.catalogName = res.data[0].catalogName;
      }
    });
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

  loadMoreData() {
    setTimeout(() => {
      this.listCatalogs.forEach(val => {
        let data = { catalogId: val.id };
        this.productService.search(data, 0, 8).subscribe(res => {
          this.listDataMore.push(res.data);
          console.log(this.listDataMore);
        });
      });
    }, 500);
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
    this.search();
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
