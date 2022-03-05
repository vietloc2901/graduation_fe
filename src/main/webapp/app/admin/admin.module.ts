import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserManagementComponent } from './user-management/user-management.component';
import { CatalogsComponent } from './catalogs/catalogs.component';
import { OrdersComponent } from './orders/orders.component';
import { httpInterceptorProviders } from 'app/core/interceptor';
import { ActionCatalogComponent } from './catalogs/action-catalog/action-catalog.component';
import { CreateUpdateCatalogComponent } from './catalogs/create-update-catalog/create-update-catalog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProductsComponent } from './products/products.component';

@NgModule({
  declarations: [
    UserManagementComponent,
    CatalogsComponent,
    OrdersComponent,
    ActionCatalogComponent,
    CreateUpdateCatalogComponent,
    ProductsComponent,
  ],
  imports: [
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzTreeSelectModule,
    CommonModule,
    NgSelectModule,
    MatTooltipModule,
    ModalModule,
    AgGridModule.withComponents([]),
  ],
  entryComponents: [CreateUpdateCatalogComponent, ActionCatalogComponent],
  providers: [httpInterceptorProviders],
})
export class AdminModule {}
