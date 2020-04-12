import css from './apx-date.scss';

import {DateBuilder} from './date-builder';
import { Context } from 'caracal_polaris/dist/types/model/context.model';

export class DateControl extends HTMLElement {
    private _builder: DateBuilder;
    private _caption: HTMLSpanElement;
    private _dateContainer: HTMLDivElement;
    private _label: HTMLSpanElement;
    private _calendar: HTMLSpanElement;
    private _popup: HTMLDivElement;
    private _date = new Date();
    private _value: string;

    private _popupClickHandler: EventListener;
    private _togglePopupHandler: EventListener;
    private _hidePopupHandler: EventListener;

    caption: string;
    ctx: Context;
    
    get value() { 
        return this._value||''; 
    }
    set value(value) { 
        if(value === '' || Date.parse(value) === NaN)
            return;

        this._date = new Date(value);
        this._value = value; 
    }

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

        this._popupClickHandler = this.popupClickHandler.bind(this);
        this._togglePopupHandler = this.togglePopupHandler.bind(this);
        this._hidePopupHandler = this.hidePopupHandler.bind(this);
    }

    connectedCallback() {
        this._caption.textContent = this.caption;
        this._label.textContent = '';

        if(this.value)
            this._label.textContent = this._date.toLocaleDateString('default', { day:'numeric', month: 'long', year: 'numeric' });

        this._calendar.innerHTML = '<div>&#x25BC;</div>';

        this._calendar.addEventListener('click', this._togglePopupHandler);
        this._dateContainer.addEventListener('click', this._togglePopupHandler);

        this._dateContainer.addEventListener('mouseleave', this._hidePopupHandler);
        this._dateContainer.addEventListener('blur', this._hidePopupHandler);

        this._popup.addEventListener('click', this._popupClickHandler);
    }

    disconnectedCallback() {
        this._calendar.removeEventListener('click', this._togglePopupHandler);
        this._dateContainer.removeEventListener('click', this._togglePopupHandler);

        this._dateContainer.removeEventListener('mouseleave', this._hidePopupHandler);
        this._dateContainer.removeEventListener('blur', this._hidePopupHandler);

        this._popup.removeEventListener('click', this._popupClickHandler);
    }

    private popupClickHandler(event: any) {
        const parent = this.shadowRoot.querySelector("table");
        if(parent && parent.contains(event.target))
            event.cancelBubble = true;
        
        if(event.target.dataset.action === 'month') return;
        if(event.target.dataset.action === 'year') return;

        if(event.target.dataset.action === 'left-arrow' || event.target.dataset.action === 'right-arrow'){
            const date = new Date(event.target.dataset.date);
            let newDate = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());

            if(event.target.dataset.action === 'right-arrow')
                newDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());

            this._builder.build(this._date, newDate);

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
        this.value = `${this._date.getFullYear()}/${this._date.getMonth() + 1}/${this._date.getDate()}`;
        this._popup.classList.add("hidden");
        this.dispatchEvent(new Event('input'));
    }

    private togglePopupHandler(event: any) {
        event.cancelBubble = true;

        const parent = this.shadowRoot.querySelector("table");

        if(parent && parent.contains(event.target))
            return;

        if(this._popup.classList.contains("hidden"))
            this._builder.build(this._date, this._date);

        this._popup.classList.toggle("hidden");
    }

    private hidePopupHandler() {
        this._popup.classList.add("hidden");
    }

    private createPopup() {
        this._popup = document.createElement('div');
        this._popup.className = 'popup hidden';
        this._dateContainer.appendChild(this._popup);
        this._builder = new DateBuilder(this._popup);

        this._builder.build(this._date, this._date);
    }
}

customElements.define('apx-date', DateControl);