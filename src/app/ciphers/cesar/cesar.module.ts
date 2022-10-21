import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CesarPageRoutingModule } from './cesar-routing.module';

import { CesarPage } from './cesar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CesarPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CesarPage]
})
export class CesarPageModule {}
