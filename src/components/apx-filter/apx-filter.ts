import css from './apx-filter.scss';
import { Context } from 'caracal_polaris/dist/types/model/context.model';

export class Filter extends HTMLElement {
    ctx: Context;
    caption: string;
    id: string;

    _field: any;


    get value() { return {field: this._field.value}; }
    set value(value) { this._field.value = value.field; }

    private _content: HTMLDivElement;

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this._content = document.createElement('div');
        this._content.className = 'content';
        this.shadowRoot.appendChild(this._content);
    }

    connectedCallback() {
        this.createHeader();
        this.createFieldCombo();
        this.createFieldCombo2();
        this.createFieldDate();
        this.createButton();
    }

    createHeader() {
        const header = document.createElement("h2"); 
        header.innerText = this.caption;
        this._content.appendChild(header);
    }

    createFieldCombo() {
        this._field = document.createElement("apx-combo");
        this._field.ctx = this.ctx;
        this._field.caption = 'Field';
        this._field.id = `${this.id}_field`;

        this._field.items = [
            {"caption": "Combo 1", "value": "combo1"},
            {"caption": "Combo 2", "value": "combo2"},
            {"caption": "Combo 3", "value": "combo3"},
            {"caption": "Combo 1 A", "value": "combo1A"},
            {"caption": "Combo 2 A", "value": "combo2A"},
            {"caption": "Combo 2 B", "value": "combo2B"}
        ];

        this._content.appendChild(this._field);
    }

    createFieldCombo2() {
        const operator: any = document.createElement("apx-combo");
        operator.ctx = this.ctx;
        operator.caption = 'Operator';
        operator.id = `${this.id}_condition`;

        operator.items = [
            {"caption": "Greater", "value": "greater"},
            {"caption": "Smaller", "value": "smaller"},
            {"caption": "Equal", "value": "equal"},
            {"caption": "Between", "value": "Between"}
        ];

        this._content.appendChild(operator);
    }

    createFieldDate() {
        const valueInput: any = document.createElement("apx-date");
        valueInput.ctx = this.ctx;
        valueInput.caption = 'Search Value';
        valueInput.id = `${this.id}_value`;

        this._content.appendChild(valueInput);
    }

    createButton() {
        const button: any = document.createElement("apx-button");
        button.ctx = this.ctx;
        button.caption = 'Filter';

        this._content.appendChild(button);
    }
}

customElements.define('apx-filter', Filter);