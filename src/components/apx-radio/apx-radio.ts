import css from './apx-radio.scss';

export class Radio extends HTMLElement {
    private _clickHandler: EventListener;
    private _value = '';

    id: string;
    name: string;
    items: [];


    get value() { return this._value; }
    set value(value) { this._value = value||''; }

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this._clickHandler = this.clickHandler.bind(this);
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `<style>${css}</style>`;
        this.items.forEach(this.addItem.bind(this));
        this.addEventListener('click', this._clickHandler);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._clickHandler);
    }

    clickHandler(){
        const item = Array.from(this.shadowRoot.querySelectorAll('input'))
                          ?.find(i => i.checked === true);
             
        this._value = item?.value||'';
    }

    addItem(item: any, index: number) {
        const input = document.createElement('input');
        input.type = "radio";
        input.value = item.value;
        input.id = `${this.id}_${index}`;
        input.name = this.id;

        if(this._value === input.value)
            input.checked = true;

        this.shadowRoot.appendChild(input);

        const label = document.createElement('label');
        label.htmlFor = input.id;
        this.shadowRoot.appendChild(label);

        const textLabel = document.createElement('label');
        textLabel.htmlFor = input.id;
        textLabel.className = "label";
        textLabel.textContent = item.caption;
        this.shadowRoot.appendChild(textLabel);
    }
}

customElements.define('apx-radio', Radio);