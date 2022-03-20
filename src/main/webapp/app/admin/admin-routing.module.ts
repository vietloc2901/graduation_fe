import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CatalogsComponent } from './catalogs/catalogs.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CreatUpdateProductComponent } from './products/creat-update-product/creat-update-product.component';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'user-management',
        component: UserManagementComponent,
        data: {
          pageTitle: 'userManagement.home.title',
        },
      },
      {
        path: 'catalog-management',
        component: CatalogsComponent,
      },
      {
        path: 'product-management',
        component: ProductsComponent,
      },
      {
        path: 'order-management',
        component: OrdersComponent,
      },
      {
        path: 'create-update-product',
        component: CreatUpdateProductComponent,
      },
      {
        path: 'create-update-product/:id',
        component: CreatUpdateProductComponent,
      },
      /* jhipster-needle-add-admin-route - JHipster will add admin routes here */
    ]),
  ],
})
export class AdminRoutingModule {}
