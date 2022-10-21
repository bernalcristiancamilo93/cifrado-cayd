import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CesarPage } from './cesar.page';

const routes: Routes = [
  {
    path: '',
    component: CesarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CesarPageRoutingModule {}
