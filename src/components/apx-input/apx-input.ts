import css from './apx-input.scss';

export class Input extends HTMLElement {
    private _label: HTMLLabelElement;
    private _input: HTMLInputElement;
    private _inputHandler: any;

    id: string;
    type: string;
    caption: string;
    
    get value() { return this._input.value; }
    set value(value) { this._input.value = value; }

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this.createLabel();
        this.createInput();
    }

    connectedCallback() {
        this._label.textContent = this.caption;
        this._input.type = this.type;

        if(this.type === 'password') {
            this.value = '';
            this.dispatchEvent(new Event('input'));
        }

        this._input.addEventListener('input', this._inputHandler);
    }

    disconnectedCallback() {
        this._input.removeEventListener('input', this._inputHandler);
    }    

    private createLabel() {
        this._label = document.createElement('label');
        this._label.htmlFor = this.id;
        this.shadowRoot.appendChild(this._label);
    }

    private createInput() {
        this._input = document.createElement('input');
        this._inputHandler = this.inputHandler.bind(this);
        this.shadowRoot.appendChild(this._input);
    }

    private inputHandler(e: any) {
        this.value = e.target.value;
    }
}

customElements.define('apx-input', Input);