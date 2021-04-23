import css from './apx-filter.scss';
import { Context } from 'caracal_polaris/dist/types/model/context.model';

export class Filter extends HTMLElement {
    ctx: Context;
    caption: string;
    
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
        const combo: any = document.createElement("apx-combo");
        combo.ctx = this.ctx;
        combo.caption = 'Field';

        combo.items = [
            {"caption": "Combo 1", "value": "combo1"},
            {"caption": "Combo 2", "value": "combo2"},
            {"caption": "Combo 3", "value": "combo3"},
            {"caption": "Combo 1 A", "value": "combo1A"},
            {"caption": "Combo 2 A", "value": "combo2A"},
            {"caption": "Combo 2 B", "value": "combo2B"}
        ];

        this._content.appendChild(combo);
    }

    createFieldCombo2() {
        const combo: any = document.createElement("apx-combo");
        combo.ctx = this.ctx;
        combo.caption = 'Operator';

        combo.items = [
            {"caption": "Greater", "value": "greater"},
            {"caption": "Smaller", "value": "smaller"},
            {"caption": "Equal", "value": "equal"},
            {"caption": "Between", "value": "Between"}
        ];

        this._content.appendChild(combo);
    }

    createFieldDate() {
        const date: any = document.createElement("apx-date");
        date.ctx = this.ctx;
        date.caption = 'Search Value';

        this._content.appendChild(date);
    }

    createButton() {
        const button: any = document.createElement("apx-button");
        button.ctx = this.ctx;
        button.caption = 'Filter';

        this._content.appendChild(button);
    }
}

customElements.define('apx-filter', Filter);