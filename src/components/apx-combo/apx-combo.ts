import css from './apx-combo.scss';
import { Context } from 'caracal_polaris/dist/types/model/context.model';

export class Combo extends HTMLElement {
    private _container: HTMLDivElement;
    private _label: HTMLLabelElement;
    private _combo: HTMLDivElement;
    private _input: HTMLInputElement;
    private _itemContainer: HTMLUListElement;

    caption: string;
    ctx:Context;
    items: [];

   get value() { console.log('getValue'); return this._input.value; }
   set value(value) { this._input.value = value; }

    constructor(){
        super();

        let isOpen = false;

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this._container = document.createElement('div');
        this._container.className = 'container';
        this._container.tabIndex = 0;
        this.shadowRoot.appendChild(this._container);

        this._label = document.createElement('label');
        this._container.appendChild(this._label);

        this._combo = document.createElement('div');
        this._combo.className = 'combo';
        this._combo.tabIndex = 0;
        
        this._container.appendChild(this._combo);

        this._input = document.createElement('input');
        this._combo.appendChild(this._input);

        const arrow = document.createElement('div');
        arrow.className = 'arrow';

        arrow.innerHTML = '<div>&#x25BC;</div>';
        this._combo.appendChild(arrow);
        arrow.addEventListener('click', () => {
            if(isOpen === true)
                this._container.focus();
            else {
                this._input.focus();
                return;
            }

            isOpen = !isOpen;
        });

        this._input.addEventListener('focus', () => {
            isOpen = true;
        });

        this._itemContainer = document.createElement('ul');
        this._combo.appendChild(this._itemContainer);

        this._itemContainer.addEventListener('click', (e: any) => {
            this.value = e.target.textContent;//e.target.dataset.value;
            this.dispatchEvent(new Event('input'));
            this._container.focus();
            isOpen = false;
        });
    }

    connectedCallback() {
        this._label.textContent = this.caption;
        this._input.id = this.id;

        this._itemContainer.innerHTML = '';

        this.items.forEach(this.createItem.bind(this));
    }

    createItem(item: any) {
        const li = document.createElement('li');
        li.dataset.value = item.value;
        li.textContent = this.ctx.model.getInterpolatedValue(item.caption);

        this._itemContainer.appendChild(li);
    }
}

customElements.define('apx-combo', Combo);