import css from './apx-radio.scss';

export class Radio extends HTMLElement {
    private _label: HTMLSpanElement;

    caption: string;
    htmlFor: string;

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this._label = document.createElement('span');
        this.shadowRoot.appendChild(this._label);
    }

    connectedCallback() {
        this._label.textContent = this.caption;
    }
}

customElements.define('apx-radio', Radio);