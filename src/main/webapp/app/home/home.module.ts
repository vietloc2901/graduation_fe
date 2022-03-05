import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { CreateUpdateCatalogComponent } from 'app/admin/catalogs/create-update-catalog/create-update-catalog.component';
import { ActionCatalogComponent } from 'app/admin/catalogs/action-catalog/action-catalog.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent],
  entryComponents: [CreateUpdateCatalogComponent, ActionCatalogComponent],
})
export class HomeModule {}
