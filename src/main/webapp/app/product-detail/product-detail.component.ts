import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProductService } from 'app/core/service/product.service';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'jhi-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  productId;
  numberSpec;
  imageUrl;
  data;
  listSame;
  constructor(private productService: ProductService, public router: Router, private route: ActivatedRoute, private toaStr: ToastrService) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.productId = +params.get('id');
    });
  }

  ngOnInit(): void {
    this.productService.getProduct(this.productId).then(res => {
      if (res.status == 'OK') {
        this.data = res.data;
        this.numberSpec = res.data.specsDTOList;
        this.imageUrl = res.data.image;
      } else {
        this.toaStr.error('Sản phẩm không còn tồn tại');
        this.router.navigate(['admin/product-management']);
      }
    });
    this.loadSameProduct();
  }

  loadSameProduct() {
    setTimeout(() => {
      this.productService.search({ catalogId: this.data.catalogId }, 0, 8).subscribe(res => {
        this.listSame = res.data;
      });
    }, 500);
  }

  routerToDetails(id) {
    this.redirectTo('product-detail/' + id);
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([uri]));
  }

  getName(data) {
    if (data.length > 50) {
      return data.substring(0, 50) + '...';
    } else {
      return data;
    }
  }

  formatCurrency(params) {
    return params.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' });
  }
}
