import css from './apx-filter.scss';
import { Context } from 'caracal_polaris/dist/types/model/context.model';

export class Filter extends HTMLElement {
    ctx: Context;
    
    private _content: HTMLDivElement;

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this._content = document.createElement('div');
        this._content.className = 'content';
        this.shadowRoot.appendChild(this._content);

        this._content.innerHTML = '<h3>TesTING</h3>';
    }
}

customElements.define('apx-filter', Filter);