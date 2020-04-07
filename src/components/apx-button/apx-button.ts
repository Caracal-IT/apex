import {Context} from 'caracal_polaris/dist/types/model/context.model';

import css from './apx-button.scss';

export class Button extends HTMLElement {
    private _button: HTMLButtonElement;
    private _buttonHandler: any;

    caption: string;
    ctx: Context;
    next: string;

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this._button = document.createElement('button');
        this.shadowRoot.appendChild(this._button);
        this._buttonHandler = this.buttonHandler.bind(this);
    }

    connectedCallback() {
        this._button.textContent = this.caption;
        this._button.addEventListener('click', this._buttonHandler);
    }

    disconnectedCallback() {
        this._button.removeEventListener('click', this._buttonHandler);
    }
    
    private buttonHandler() {
        this.ctx.wf.goto(this.next);
    }
}

customElements.define('apx-button', Button);