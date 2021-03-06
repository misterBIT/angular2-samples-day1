import {Component, Injectable, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';

////////////////////////////////////////////////////////////////////////

export class FormBase<T> {
	value: T;
	key: string;
	label: string;
	required: boolean;
	readonly: boolean;
	disabled: boolean;
	order: number;
	controlType: string;
	placeholder: string;

	constructor(options: {
		value?: T,
		key?: string,
		label?: string,
		required?: boolean,
		"readonly"?: boolean,
		disabled?: boolean,
		order?: number,
		controlType?: string,
		placeholder?: string
	} = {}) {
		this.value = options.value;
		this.key = options.key || '';
		this.label = options.label || '';
		this.required = !!options.required;
		this.readonly = !!options.readonly;
		this.disabled = !!options.disabled;
		this.order = options.order === undefined ? 1 : options.order;
		this.controlType = options.controlType || '';
		this.placeholder = options.placeholder || '';
	}
}

////////////////////////////////////////////////////////////////////////


export class TextboxField extends FormBase<string> {
	controlType = 'textbox';
	type: string;

	constructor(options: {} = {}) {
		super(options);
		this.type = options['type'] || '';
	}
}

////////////////////////////////////////////////////////////////////////


export class DropdownField extends FormBase<string> {
	controlType = 'dropdown';
	options: {key: string, value: string}[] = [];

	constructor(options: {} = {}) {
		super(options);
		this.options = options['options'] || [];
	}
}

////////////////////////////////////////////////////////////////////////


@Injectable()
export class FormControlService {

	constructor(private fb: FormBuilder) {
	}

	toControlGroup(fields: FormBase<any>[]) {
		let group = {};

		fields.forEach(field => {
			group[field.key] = new FormControl({value: field.value, disabled: field.disabled}, (field.required) ? Validators.required : []);
		});
		return this.fb.group(group);
	}
}

////////////////////////////////////////////////////////////////////////

@Component({
	selector: 'df-field',
	template: `
<div [formGroup]="form" class="form-group">
  <label [attr.for]="field.key" class="control-label">{{field.label}}</label>
  <div [ngSwitch]="field.controlType">
    <input *ngSwitchCase="'textbox'" [formControlName]="field.key" [id]="field.key" [type]="field.type"  class="form-control" [placeholder]="field.placeholder" [readonly]="field.readonly">
    <select [id]="field.key" *ngSwitchCase="'dropdown'" [formControlName]="field.key" class="form-control">
      <option style="display:none" value="">Choose an option</option>
      <option *ngFor="let opt of field.options" [value]="opt.key">{{opt.value}}</option>
    </select>
  </div>
  <div style="color: red;" *ngIf="!isValid">({{field.label}} is required)</div>
</div>`
})
export class DynamicFormFieldComponent {
	@Input() field: FormBase<any>;
	@Input() form: FormGroup;

	get isValid() {
		return this.form.get(this.field.key).valid;
	}
}

////////////////////////////////////////////////////////////////////////

@Component({
	selector: 'dynamic-form',
	template: `
<div>
  <form (ngSubmit)="onSubmit()" [formGroup]="form">
    <div *ngFor="let field of fields" class="form-row">
      <df-field [field]="field" [form]="form"></df-field>
    </div>
    <div class="form-row">
      <button type="submit" [disabled]="!form.valid" class="btn btn-success btn-md">Save</button>
    </div>
  </form>
  
  <div *ngIf="payLoad" class="form-row">
    <br><strong>Saved the following values</strong><br>{{payLoad}}
  </div>
</div>`
})
export class DynamicFormComponent {
	@Input() fields: FormBase<any>[] = [];
	@Output('send') submitted: EventEmitter<any> = new EventEmitter();
	form: FormGroup;
	payLoad = '';

	constructor(private qcs: FormControlService) {
	}

	ngOnInit() {
		this.form = this.qcs.toControlGroup(this.fields);
	}

	onSubmit() {
		this.payLoad = JSON.stringify(this.form.value);
		this.submitted.emit(this.form.value);
	}
}


