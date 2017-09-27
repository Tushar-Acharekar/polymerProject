import {Component, DynamicComponentLoader, ElementRef, ComponentRef, Injector, ViewChild, NgModule, CUSTOM_ELEMENTS_SCHEMA,} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators} from 'angular2/common';
import { PolymerModule, PolymerElement } from '@vaadin/angular2-polymer';

@NgModule({
  imports: [ PolymerModule ],
  declarations: [
    AppComponent,
    PolymerElement('paper-input'),
    PolymerElement('vaadin-combo-box')
  ],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }


@Component ({
   selector: 'my-app',
	 template: `
   <div>
      <h1>{{appTitle}}</h1>
      <div>To Tutorials Point</div>
			<paper-input [(value)]="appTitle"></paper-input>
   </div>
	`  
})

export class AppComponent {
   appTitle: string = 'Tushara_2';
}