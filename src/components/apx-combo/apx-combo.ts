import css from './apx-combo.scss';
import { Context } from 'caracal_polaris/dist/types/model/context.model';

export class Combo extends HTMLElement {
    private _container: HTMLDivElement;
    private _label: HTMLLabelElement;
    private _combo: HTMLDivElement;
    private _input: HTMLInputElement;
    private _icon: HTMLDivElement;
    private _itemContainer: HTMLUListElement;
    private _isOpen = false;

    private _inputFocusHandler: EventListener;
    private _inputHandler: EventListener;
    private _iconClickHandler: EventListener;
    private _comboClickHandler: EventListener;

    caption: string;
    ctx:Context;
    items: [];

   get value() { return this._input.value; }
   set value(value) { this._input.value = value; }

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this.createCombo();
       
        this._comboClickHandler = this.comboClickHandler.bind(this);
        this._iconClickHandler = this.iconClickHandler.bind(this);
        this._inputFocusHandler = this.inputFocusHandler.bind(this);
        this._inputHandler = this.inputHandler.bind(this);
    }

    connectedCallback() {
        this._label.textContent = this.caption;
        this._input.id = this.id;

        this._itemContainer.innerHTML = '';
        this.items.forEach(this.createItem.bind(this));
        this.inputHandler();

        this._itemContainer.addEventListener('click', this._comboClickHandler);
        this._icon.addEventListener('click', this._iconClickHandler);
        this._input.addEventListener('focus', this._inputFocusHandler);
        this._input.addEventListener('input', this._inputHandler);
    }

    disconnectedCallback() {
        this._itemContainer.removeEventListener('click', this._comboClickHandler);
        this._icon.removeEventListener('click', this._iconClickHandler);
        this._input.removeEventListener('focus', this._inputFocusHandler);
    }

    private inputHandler() {
        const text = this.value.trim().toLowerCase();
        const items = Array.from(this._itemContainer.childNodes);
        items.forEach(this.displayHideItem.bind(this, text));

        const count = items.filter((i: any) => i.classList.contains('hide'))
                           .length;
        
        if(count === items.length)
            this._combo.classList.add('no-items');
        else
            this._combo.classList.remove('no-items');
    }

    private displayHideItem(text: string, item: HTMLUListElement) {
        if(item.textContent.toLowerCase().indexOf(text) > -1)
            item.classList.remove("hide");
        else
            item.classList.add("hide");
    }

    private comboClickHandler(event: any) {
        this.value = event.target.textContent;//e.target.dataset.value;
        this.dispatchEvent(new Event('input'));
        this._container.focus();
        this._isOpen = false;
    }

    private iconClickHandler() {
        if(this._isOpen === true)
            this._container.focus();
        else {
            this._input.focus();
            return;
        }

        this._isOpen = !this._isOpen;
    }

    private inputFocusHandler() {
        this._isOpen = true;
    }

    private createCombo() {
        this.createContainer();
        this.createCaption();
        this.createComboInput();
    }

    private createContainer() {
        this._container = document.createElement('div');
        this._container.className = 'container';
        this._container.tabIndex = 0;
        this.shadowRoot.appendChild(this._container);
    }

    private createCaption() {
        this._label = document.createElement('label');
        this._container.appendChild(this._label);
    }

    private createComboInput() {
        this.createComboContainer();
        this.createInput();
        this.createIcon();
        this.createLookupItems();
    }

    private createComboContainer(){
        this._combo = document.createElement('div');
        this._combo.className = 'combo';
        this._combo.tabIndex = 0;
        
        this._container.appendChild(this._combo);
    }

    private createInput() {
        this._input = document.createElement('input');
        this._combo.appendChild(this._input);
    }

    private createIcon(){
        this._icon = document.createElement('div');
        this._icon.className = 'arrow';

        this._icon.innerHTML = '<div>&#x25BC;</div>';
        this._combo.appendChild(this._icon);
    }

    private createLookupItems() {
        this._itemContainer = document.createElement('ul');
        this._combo.appendChild(this._itemContainer);

        this._itemContainer.addEventListener('click', (e: any) => {
            this.value = e.target.textContent;//e.target.dataset.value;
            this.dispatchEvent(new Event('input'));
            this._container.focus();
            this._isOpen = false;
        });
    }

    private createItem(item: any) {
        const li = document.createElement('li');
        li.dataset.value = item.value;
        li.textContent = this.ctx.model.getInterpolatedValue(item.caption);

        this._itemContainer.appendChild(li);
    }
}

customElements.define('apx-combo', Combo);