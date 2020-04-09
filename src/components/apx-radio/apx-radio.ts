import css from './apx-radio.scss';

export class Radio extends HTMLElement {
    private _input: HTMLInputElement;
    private _label: HTMLLabelElement;
    private _textLabel: HTMLLabelElement;
    
    id: string;
    name: string;
    caption: string;
    htmlFor: string;

    get value() { return this._input.value; }
    set value(value) { this._input.value = value; }

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this._input = document.createElement('input');
        this._input.type = "radio";
        this.shadowRoot.appendChild(this._input);

        this._label = document.createElement('label');
        this.shadowRoot.appendChild(this._label);

        this._textLabel = document.createElement('label');
        this.shadowRoot.appendChild(this._textLabel);
    }

    connectedCallback() {
        this._input.id = this.id;
        this._input.name = this.name;
        this._label.htmlFor = this.id;
        this._textLabel.htmlFor = this.id;
        this._textLabel.textContent = this.caption;
    }
}

customElements.define('apx-radio', Radio);