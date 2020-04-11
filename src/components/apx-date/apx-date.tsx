import css from './apx-date.scss';

import {DateBuilder} from './date-builder';

export class DateControl extends HTMLElement {
    private _caption: HTMLSpanElement;
    private _dateContainer: HTMLDivElement;
    private _label: HTMLSpanElement;
    private _calendar: HTMLSpanElement;
    private _popup: HTMLDivElement;
    private _date = new Date();
    private _value: string;

    caption: string;
    
    get value() { return this._value; }
    set value(value) { this._value = value; }

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this._caption = document.createElement('span');
        this._caption.className = 'caption';
        this.shadowRoot.appendChild(this._caption);

        this._dateContainer = document.createElement('div');
        this._dateContainer.className = "dateContainer";
        this._dateContainer.tabIndex = 10;
        this.shadowRoot.appendChild(this._dateContainer);

        this._label = document.createElement('span');
        this._label.className = "dateLabel";
        this._dateContainer.appendChild(this._label);

        this._calendar = document.createElement('span');
        this._calendar.className = "calendar";
        this._dateContainer.appendChild(this._calendar);

        this.createPopup();
    }

    connectedCallback() {
        this._caption.textContent = this.caption;
        this._label.textContent = '';
        this._calendar.innerHTML = '<div>&#x25BC;</div>';

        this._calendar.addEventListener('click', () => {
            this._popup.classList.toggle("hidden");
        });

        this._dateContainer.addEventListener('click', (event: any) => {
            if(event.target.dataset.action === 'month') return;
            if(event.target.dataset.action === 'year') return;
            if(event.target.dataset.action === 'left-arrow') return;
            if(event.target.dataset.action === 'right-arrow') return;

            this._popup.classList.toggle("hidden");
        });

        this._calendar.addEventListener('click', () => {
            this._popup.classList.toggle("hidden");
        });

        this._dateContainer.addEventListener('mouseleave', () => {
            this._popup.classList.add("hidden");
        });

        this._dateContainer.addEventListener('blur', () => {
            this._popup.classList.add("hidden");
        });
    }

    private createPopup() {
        this._popup = document.createElement('div');
        this._popup.className = 'popup hidden';
        this._dateContainer.appendChild(this._popup);

        this._popup.addEventListener('click', (event: any) => {
            if(event.target.dataset.action === 'month') return;
            if(event.target.dataset.action === 'year') return;

            if(event.target.dataset.action === 'left-arrow' || event.target.dataset.action === 'right-arrow'){
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
            this._label.textContent = this._date.toLocaleDateString('default', { day:'numeric', month: 'long', year: 'numeric' });
            this._popup.classList.remove("hidden");
        });

        const builder = new DateBuilder(this._date, this._date, this._popup);
        builder.build();
    }
}

customElements.define('apx-date', DateControl);