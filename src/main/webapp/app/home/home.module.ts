import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { CreateUpdateCatalogComponent } from 'app/admin/catalogs/create-update-catalog/create-update-catalog.component';
import { ActionCatalogComponent } from 'app/admin/catalogs/action-catalog/action-catalog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { FormFieldModule, InputsModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([HOME_ROUTE]),
    MatMenuModule,
    MatTreeModule,
    MatIconModule,
    NzTreeSelectModule,
    FormFieldModule,
    InputsModule,
    TextBoxModule,
    LabelModule,
    NgSelectModule,
  ],
  declarations: [HomeComponent],
  entryComponents: [CreateUpdateCatalogComponent, ActionCatalogComponent],
})
export class HomeModule {}
