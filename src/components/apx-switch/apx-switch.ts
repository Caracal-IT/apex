import css from './apx-switch.scss';

export class Switch extends HTMLElement {
    private _input: HTMLInputElement;
    private _label: HTMLLabelElement;
    private _span: HTMLSpanElement;
    private _textLabel: HTMLLabelElement;
    
    id: string;
    caption: string;

    get value() { return this._input.checked; }
    set value(value) { this._input.checked = value; }

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this._label = document.createElement('label');
        this._label.className = 'switch';
        this.shadowRoot.appendChild(this._label);

        this._input = document.createElement('input');
        this._input.type = "checkbox";        
        this._label.appendChild(this._input);

        this._span = document.createElement('span');
        this._span.className = 'slider round';
        this._label.appendChild(this._span);

        this._textLabel = document.createElement('label');
        this.shadowRoot.appendChild(this._textLabel);
    }

    connectedCallback() {
        this._input.id = this.id;
        this._label.htmlFor = this.id;
        this._textLabel.htmlFor = this.id;
        this._textLabel.textContent = this.caption;
    }
}

customElements.define('apx-switch', Switch);