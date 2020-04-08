import css from './apx-grid.scss';
import { Context } from 'caracal_polaris/dist/types/model/context.model';

export class Grid extends HTMLElement {
    private _table: HTMLTableElement;
    private _content: HTMLDivElement;

    private _items = [];
   
    caption: string;
    columns: Array<Column>;
    items: []|string;
    ctx: Context;

    searchColumn = '';
    searchDirection = 'asc';
    
    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this._content = document.createElement('div');
        this.shadowRoot.appendChild(this._content);
        this._table = document.createElement('table');
        this._content.appendChild(this._table);
    }

    async connectedCallback() {
        await this.initItems();
        this.render();
    }

    private render() {
        this._table.innerHTML = '';
        this.createHeader();
        this.createBody();
    }

    private createHeader() {
        const header = document.createElement('thead');
        const row = document.createElement('tr');
        header.appendChild(row);
        this._table.appendChild(header);

        this.columns.forEach(c => this.createColumn(c, row));        
    }

    private createColumn(column: any, row: HTMLTableRowElement){
        const col = document.createElement('th');
        row.appendChild(col);

        let sortIcon = '';

        if(this.searchColumn === column.name) {
            sortIcon = this.searchDirection === 'asc' ? '<span>&uarr;</span>' : '<span>&darr;</span>';
        }

        col.innerHTML = column.caption + " " + sortIcon;

        col.addEventListener('click', () => {
            if(this.searchColumn !== column.name)
                this.searchDirection = 'desc';

                this.searchColumn = column.name;

            if(this.searchDirection === 'desc')
                this.searchDirection = 'asc';
            else
                this.searchDirection = 'desc';

            const order = this.searchDirection === 'desc' ? -1 : 1;
            const a = this._items.sort(this.compare.bind(this, order, column.name));

            this._items =  a;
            this.render();

        });
    }

    public compare(order: number, name: string, a: any, b: any) {        
        if(a[name] > b[name]) return 1 * order;
        if(a[name] < b[name]) return -1 * order;

        return 0;
    }

    private createBody() {
        const body = document.createElement('tbody');
        this._table.appendChild(body);

        this._items.forEach(i => this.createRow(i, body));
    }

    private createRow(item: any, body: HTMLTableSectionElement) {
        const row = document.createElement('tr');
        body.appendChild(row);

        this.columns.forEach(c => this.createCell(item[c.name], row)); 
    }

    private createCell(text: string, row: HTMLTableRowElement) {
        const cell = document.createElement('td');
        row.appendChild(cell);
        cell.textContent = text;
    }

    private async initItems() {
        if(typeof this.items === 'string') {
            if(this.items.indexOf('/') === -1)
                this._items = this.ctx.model.getValue(this.items);
            else if(this.items.length > 0) 
                this._items = await this.ctx.http.fetch({url: this.items, method: 'GET'});
        }

        if(!this._items)
            this._items = [];
    }
}

customElements.define('apx-grid', Grid);

class Column {
    cation: string;
    name: string;
}