import css from './apx-date.scss';

import {DateBuilder} from './date-builder';

export class DateControl extends HTMLElement {
    private _label: HTMLSpanElement;
    private _popup: HTMLDivElement;
    private _date = new Date(2020, 3, 6);

    caption: string;
    htmlFor: string;

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this._label = document.createElement('span');
        this.shadowRoot.appendChild(this._label);

        this.createPopup();
    }

    connectedCallback() {
        this._label.textContent = this.caption;
    }

    private createPopup() {
        this._popup = document.createElement('div');
        this._popup.className = 'popup';
        this.shadowRoot.appendChild(this._popup);

        this._popup.addEventListener('click', (event: any) => {
            if(event.target.dataset.action === 'month') return;
            if(event.target.dataset.action === 'year') return;

            if(event.target.dataset.action === 'left-arrow' || event.target.dataset.action === 'right-arrow'){
                console.log(event.target.dataset.date);
                const date = new Date(event.target.dataset.date);
                let newDate = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());

                if(event.target.dataset.action === 'right-arrow')
                    newDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());

                this._popup.innerHTML = '';
                const builder = new DateBuilder(this._date, newDate, this._popup);
                builder.build();

                return;
            }

            if(!event.target.dataset.date)
                return;

            const selected = this._popup.querySelector('.selected');

            if(selected)
                selected.classList.remove('selected');

            event.target.classList.add('selected');


            this._date = new Date(event.target.dataset.date);
        });

        const builder = new DateBuilder(this._date, this._date, this._popup);
        builder.build();
    }
}

customElements.define('apx-date', DateControl);