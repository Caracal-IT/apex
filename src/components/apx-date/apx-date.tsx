import css from './apx-date.scss';

import {DateBuilder} from './date-builder';
import { DateEventHandler } from './date-event-handlers';

export class DateControl extends HTMLElement {
    private _builder: DateBuilder;
    private _dateHandler: DateEventHandler;

    private _caption: HTMLSpanElement;
    private _inputContainer: HTMLDivElement;
    private _valueLabel: HTMLSpanElement;
    private _dropdown: HTMLSpanElement;
    private _popup: HTMLDivElement;

    private _popupClickHandler: EventListener;
    private _togglePopupHandler: EventListener;
    private _hidePopupHandler: EventListener;

    caption: string;
    _value: Date;
    
    get value() { 
        if(!this._value)
            return '';

        return `${this._value.getFullYear()}/${this._value.getMonth() + 1}/${this._value.getDate()}`; 
    }
    set value(value) { 
        if(value === '' || Date.parse(value) === NaN) 
            this._value = null;
        else
            this._value = new Date(value);

        this.setLabelText();
    }

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;
        
        this.createInput();
        this.createPopup();
        this.createHandlers();
    }

    connectedCallback() {
        this._caption.textContent = this.caption;
        this.setLabelText();

        this._dropdown.addEventListener('click', this._togglePopupHandler);
        this._inputContainer.addEventListener('click', this._togglePopupHandler);

        this._inputContainer.addEventListener('mouseleave', this._hidePopupHandler);
        this._inputContainer.addEventListener('blur', this._hidePopupHandler);

        this._popup.addEventListener('click', this._popupClickHandler);
    }

    disconnectedCallback() {
        this._dropdown.removeEventListener('click', this._togglePopupHandler);
        this._inputContainer.removeEventListener('click', this._togglePopupHandler);

        this._inputContainer.removeEventListener('mouseleave', this._hidePopupHandler);
        this._inputContainer.removeEventListener('blur', this._hidePopupHandler);

        this._popup.removeEventListener('click', this._popupClickHandler);
    }

    private createInput() {
        this.createCaption();
        this.createInputContainer();
    }

    private createCaption() {
        this._caption = document.createElement('span');
        this._caption.className = 'caption';
        this.shadowRoot.appendChild(this._caption);
    }

    private createInputContainer() {
        this._inputContainer = document.createElement('div');
        this._inputContainer.className = "dateContainer";
        this._inputContainer.tabIndex = 10;
        this.shadowRoot.appendChild(this._inputContainer);

        this.createValueLabel();
        this.createDropDownIcon();
    }

    private createValueLabel () {
        this._valueLabel = document.createElement('span');
        this._valueLabel.className = "valueLabel";
        this._inputContainer.appendChild(this._valueLabel);
    }

    private createDropDownIcon() {
        this._dropdown = document.createElement('span');
        this._dropdown.innerHTML = '<div>&#x25BC;</div>';
        this._dropdown.className = "dropdown";
        this._inputContainer.appendChild(this._dropdown);
    }
    
    private createPopup() {
        this._popup = document.createElement('div');
        this._popup.className = 'popup hidden';
        this._inputContainer.appendChild(this._popup);
        this._builder = new DateBuilder(this._popup);

        this._builder.buildDays(this._value, this._value);
    }

    private createHandlers() {
        this._dateHandler = new DateEventHandler(this, this._popup, this._builder);
        this._popupClickHandler = this._dateHandler.handleClick.bind(this._dateHandler);
        this._togglePopupHandler = this._dateHandler.handleToggle.bind(this._dateHandler);
        this._hidePopupHandler = this._dateHandler.handleHide.bind(this._dateHandler);
    }

    private setLabelText() {
        if(!this._valueLabel)
            return;

        this._valueLabel.textContent = '';

        if(this._value)
            this._valueLabel.textContent = this._value.toLocaleDateString('default', { day:'numeric', month: 'long', year: 'numeric' });
    }
}

customElements.define('apx-date', DateControl);