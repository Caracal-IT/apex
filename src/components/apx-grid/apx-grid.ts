import css from './apx-grid.scss';

export class Grid extends HTMLElement {
    private _table: HTMLTableElement;

    private _items = [];

    caption: string;
    

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this._table = document.createElement('table');
        this.shadowRoot.appendChild(this._table);
    }

    connectedCallback() {
        this.initItems();
        this._table.innerHTML = '';
        this.createHeader();
        this.createBody();
    }

    private createHeader() {
        const header = document.createElement('thead');
        const row = document.createElement('tr');
        header.appendChild(row);
        this._table.appendChild(header);

        this.createColumn("Id", row);
        this.createColumn("Name", row);
        this.createColumn("Surname", row);
    }

    private createColumn(text: string, row: HTMLTableRowElement){
        const col = document.createElement('th');
        row.appendChild(col);
        col.textContent = text;
    }

    private createBody() {
        const body = document.createElement('tbody');
        this._table.appendChild(body);
        
        this._items.forEach(i => this.createRow(i, body));
    }

    private createRow(item: any, body: HTMLTableSectionElement) {
        const row = document.createElement('tr');
        body.appendChild(row);

        this.createCell(item.id, row);
        this.createCell(item.name, row);
        this.createCell(item.surname, row);
    }

    private createCell(text: string, row: HTMLTableRowElement) {
        const cell = document.createElement('td');
        row.appendChild(cell);
        cell.textContent = text;
    }

    private initItems() {
        for(let i = 1; i < 5; i++) {
            this._items.push({
                "id": i,
                "name": `Name ${i}`,
                "surname": `Surname ${i}`
            });
        }
    }
}

customElements.define('apx-grid', Grid);