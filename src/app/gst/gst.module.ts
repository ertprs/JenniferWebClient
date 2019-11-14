import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask'
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';


import { SelectDropDownModule } from 'ngx-select-dropdown'
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxTypeaheadModule } from 'ngx-typeahead';

import { GridModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import * as bootstrap from "bootstrap";
import * as $ from "jquery";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { InputsModule } from '@progress/kendo-angular-inputs';
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  
constructor(private sanitizer:DomSanitizer){}
  transform(html) {
    
return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

//component

import { GstComponent } from './gst/gst.component';
import { GstlistComponent } from './gstlist/gstlist.component';
import { GstdownloadComponent } from './gstdownload/gstdownload.component';
import { GstapprovalComponent } from './gstapproval/gstapproval.component'


import {GstRoutingModule} from '../gst/gst.routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    DataTablesModule,

    NgxSpinnerModule,
    FormsModule,
    PreventDoubleSubmitModule.forRoot(),
    MomentModule,
    NgxDaterangepickerMd.forRoot(),
    DeviceDetectorModule.forRoot(),

    ToastrModule.forRoot({
      timeOut: 5000,
      //positionClass: 'toast-bottom-right',
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    InputsModule,// ToastrModule added,
    NgxMaskModule.forRoot(),
    SelectDropDownModule,
    NgxTypeaheadModule,
    GridModule,
    DropDownListModule,
    PopupModule,
    NgbModule,
    GstRoutingModule
  ],

  declarations: [SafeHtmlPipe, GstComponent, GstlistComponent, GstdownloadComponent, GstapprovalComponent,
   ],
   providers: [
    CookieService,
    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class GstModule { }
