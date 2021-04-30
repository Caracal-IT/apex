import css from './apx-grid.scss';
import { Context } from 'caracal_polaris/dist/types/model/context.model';
export class Grid extends HTMLElement {
    private _table: HTMLTableElement;
    private _content: HTMLDivElement;
    private _isResizing = false;

    private _items = [];
   
    caption: string;
    selectable: boolean;
    columns: Array<Column>;
    items: []|string;
    height: string;

    ctx: Context;    

    searchColumn = '';
    searchDirection = 'asc';
    
    
    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this._content = document.createElement('div');
        this._content.className = 'content';
        this.shadowRoot.appendChild(this._content);
        this._table = document.createElement('table');
        this._content.appendChild(this._table);
    }

    async connectedCallback() {
        if(this.height) 
            this.style.maxHeight = this.height;        

        await this.initItems();
        
        this.render();
    }

    private render() {
        this.createCaption();    
        
        if(this._items?.length > 0)
            this.renderTable();
        else 
            this.renderNoItems();
    }

    renderNoItems() {
        this._table.innerHTML = '<h2 class="no-items">No Items</h2>';
    }

    private renderTable() {
        this._table.innerHTML = '';
        this.createHeader();
        this.createBody();        
    }
    
    private createCaption() {
        if(this.caption?.length < 1)
            return;

        var container = document.createElement('div');
        var content = document.createElement('h2');

        content.innerText = this.caption;

        container.appendChild(content);
        this.shadowRoot.prepend(container);
    }

    private createHeader() {              
        this.enforceColumns();

        const header = document.createElement('thead');
        this._table.appendChild(header);
        
        const row = document.createElement('tr');
        header.appendChild(row);

        if(this.selectable) {
            const col = document.createElement('th');
            row.appendChild(col);

            const ckb: any = document.createElement('apx-check');
            ckb.ctx = this.ctx;
            ckb.id = 'select_all';

            ckb.onclick = (e) => this.selectAll(e, ckb);
            col.appendChild(ckb);
        }

        this.columns.forEach(c => this.createColumn(c, row));  
    }

    private selectAll(e: Event, ckb) {
        ckb.value = !ckb.value;

        this._table.querySelectorAll('apx-check').forEach((c:any) => { 
            c.value = ckb.value;
            c.closest('tr').className = ckb.value ? 'selected': '';
        });

        this._items.forEach(i => i.selected = ckb.value);

        e.preventDefault();
    }

    private enforceColumns() {        
        if(this.columns?.length > 0 || this._items?.length < 1) return;

        this.columns = Object.keys(this._items[0]).map(this.createHeaderModel);
    }

    private createHeaderModel(header: string): Column {
        return {
          name: header,
          caption: (header).replace(/([A-Z])/g, ' $1').trim()
        };
    }    

    private createColumn(column: any, row: HTMLTableRowElement){
        const col = document.createElement('th');
        row.appendChild(col);        
        col.style.width = column.width;

        let sortIcon = '';

        if(this.searchColumn === column.name) 
            sortIcon = this.searchDirection === 'asc' ? '<span>&uarr;</span>' : '<span>&darr;</span>';
        
        col.innerHTML = `${column.caption} ${sortIcon}`;

        this.createResizeHandler(col, column);
        col.addEventListener('click', this.sortHandler.bind(this, column));
    }

    private createResizeHandler(header, column) {
        const resizeHandle = document.createElement('div');
        resizeHandle.classList.add('resizable');
        header.appendChild(resizeHandle);

        let x = 0;
        let w = 0;

        let mouseMoveHandler1;
        let mouseUpHandler2;

        const mouseDownHandler = function(e) {
            this._isResizing = true;
            x = e.clientX;

            const styles = window.getComputedStyle(header);
            w = parseInt(styles.width, 10);

            document.addEventListener('mousemove', mouseMoveHandler1);
            document.addEventListener('mouseup', mouseUpHandler2);
        };

        const mouseMoveHandler = function(e) {
            const dx = e.clientX - x;
            header.style.width = `${w + dx}px`;

            column.width = `${w + dx}px`;
        };

        const mouseUpHandler = function() {
            document.removeEventListener('mousemove', mouseMoveHandler1);
            document.removeEventListener('mouseup', mouseUpHandler2);

            setTimeout(() => this._isResizing = false, 0); 
        };

        mouseMoveHandler1 = mouseMoveHandler.bind(this);
        mouseUpHandler2 = mouseUpHandler.bind(this);

        resizeHandle.addEventListener('mousedown', mouseDownHandler.bind(this));
    }

    private sortHandler(column) {
        if(this._isResizing === true) return;

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
            this.renderTable();
    }

    public compare(order: number, name: string, a: any, b: any) {        
        if(a[name] > b[name]) return 1 * order;
        if(a[name] < b[name]) return -1 * order;

        return 0;
    }

    private createBody() {
        var body = document.createElement('tbody');        
        this._table.appendChild(body);

        this._items.forEach(i => this.createRow(i, body));
    }

    private createRow(item: any, body: HTMLTableSectionElement) {
        const row = document.createElement('tr');
        body.appendChild(row);
        
        this.createSelectCell(item, row);

        this.columns.forEach(c => this.createCell(item[c.name], row)); 
    }

    private createSelectCell(item, row: HTMLTableRowElement) {
        if(!this.selectable) return;

        const cell = this.createCell('', row);
        cell.className = 'select-item';

        if(item.isSelectable == false)
            return;

        const ckb: any = document.createElement('apx-check');
        ckb.ctx = this.ctx;
        ckb.id = item.id;

        row.onclick = (e) => this.selectRow(e, ckb, row, item);
        cell.appendChild(ckb);
    }

    private selectRow(e: Event, ckb, row, item) {
        ckb.value = !ckb.value;
        row.className = ckb.value ? 'selected': '';
        item.selected = ckb.value;
        e.preventDefault();
    }

    private createCell(text: string, row: HTMLTableRowElement): HTMLTableCellElement {
        const cell = document.createElement('td');
        row.appendChild(cell);
        cell.textContent = text;

        return cell;
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
    caption: string;
    name: string;
}