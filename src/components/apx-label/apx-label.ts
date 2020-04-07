import css from './apx-label.scss';

export class Label extends HTMLElement {
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

customElements.define('apx-label', Label);