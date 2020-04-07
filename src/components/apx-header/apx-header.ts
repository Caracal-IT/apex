import css from './apx-header.scss';

export class Header extends HTMLElement {
    private _header: HTMLElement;

    caption: string;
    level: '1'|'2'|'3' = '1';
    htmlFor: string;

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this._header = document.createElement(`h${this.level}`);
        this.shadowRoot.appendChild(this._header);
    }

    connectedCallback() {
        this._header.textContent = this.caption;
    }
}

customElements.define('apx-header', Header);