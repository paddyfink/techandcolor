import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipsModule } from 'primeng/primeng';
import { NgStringPipesModule } from 'angular-pipes';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    ChipsModule,
    NgStringPipesModule,
    TranslateModule]
})
export class SharedModule { }
