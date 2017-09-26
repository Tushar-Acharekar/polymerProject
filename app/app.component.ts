import {Component, DynamicComponentLoader, ElementRef, ComponentRef, Injector, ViewChild} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators} from 'angular2/common';



@Component ({
   selector: 'my-app',
	 template: `
   <div>
      <h1>{{appTitle}}</h1>
      <div>To Tutorials Point</div>
   </div>
	`  
})

export class AppComponent {
   appTitle: string = 'Tushara';
}