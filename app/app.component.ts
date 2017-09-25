import {Component, DynamicComponentLoader, ElementRef, ComponentRef, Injector, ViewChild} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators} from 'angular2/common';

@Component({
  selector:'into',
  template:`
      <form [ngFormModel]="myForm"  
        (ngSubmit)="onSubmit(myForm.value)"  
        class="ui form">
 
    <div class="field"  
      [class.error]="!myForm.find('sku').valid && myForm.find('sku').touched">  
      <label for="skuInput">SKU</label>  
      <input type="text"  
             id="skuInput"  
             placeholder="SKU"  
             #sku="ngForm"  
             [ngFormControl]="myForm.controls['sku']">  
       <div *ngIf="!sku.control.valid"  
         class="ui error message">SKU is invalid</div>  
       <div *ngIf="sku.control.hasError('required')"  
         class="ui error message">SKU is required</div>  
    </div>
 
    <div *ngIf="!myForm.valid"  
      class="ui error message">Form is invalid</div>
 
    <button type="submit" class="ui button">Submit</button>  
  </form>
  `,
  directives: [FORM_DIRECTIVES]
})
class into{
    myForm: ControlGroup;
 
  constructor(fb: FormBuilder) {  
    this.myForm = fb.group({  
      'sku':  ['', Validators.required]  
    });  
  }
 
  onSubmit(value: string): void {  
    console.log('you submitted value: ', value);  
  }
}

@Component({
  selector: 'micro',
  template: 
 `<button (click)="showcomponents()">Show</button>
	<div style="background-color:yellow">
  	<div #child class='child'>
	    <div>loadinto will be loaded next to it</div>
	  </div>
	  this parent item is 
	  <ng-content></ng-content>
	</div>`
})
export class MicroComponent {
  constructor(private _dcl: DynamicComponentLoader, private _injector: Injector, private _e:ElementRef) {
  
  }
  @ViewChild('child')
  private child;
  showcomponents(){
    console.log(this.child);
    //this._dcl.loadIntoLocation(into, this._e,'child');
    this._dcl.loadAsRoot(into, this.child.nativeElement, this._injector);

  }
  
}

@Component({
	selector: 'my-app',
	directives: [MicroComponent]
	template: `
	<ul>
	  <li *ngFor="#item of data">
	    <micro>{{item}}</micro>
	  </li>
	</ul>
	`
})
export class AppComponent { 
  constructor(private _dcl: DynamicComponentLoader, private _injector: Injector, private _e:ElementRef) {
    this.data = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  }
  ngAfterViewInit() {
    // this._dcl.loadAsRoot(into, "#child", this._injector);
  }
  
}
