//core npms  
import { NgModule, NO_ERRORS_SCHEMA,   } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
 
//kendo
import { GridModule } from '@progress/kendo-angular-grid'; 
import { InputsModule } from '@progress/kendo-angular-inputs';  
import { EditorModule } from '@progress/kendo-angular-editor';

import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CookieService } from 'ngx-cookie-service';

//only for this module
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

import { HelpnavigationComponent } from './helpnavigation/helpnavigation.component';
import { HelpmenulistComponent } from './helpmenulist/helpmenulist.component';
import { HelpmenuComponent } from './helpmenu/helpmenu.component';

import { HelpRoutingModule } from './/help.routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule, 
    ReactiveFormsModule,  
    PreventDoubleSubmitModule.forRoot(),
    //kendo
    GridModule,
    EditorModule,
    InputsModule,
    Ng2SearchPipeModule, 
    HelpRoutingModule
  ],
  declarations: [
    SafeHtmlPipe,
    HelpnavigationComponent,
    HelpmenulistComponent,
    HelpmenuComponent,
  ],
  providers: [
    CookieService,
    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class HelpModule { }
