export class DateBuilder {
    private currDate: Date;

    private startDay: number;
    private monthName: string;
    private today = new Date();

    private table: HTMLTableElement;

    date: Date;

    constructor(private container: HTMLDivElement) { }

    buildDays(currDate: Date, date: Date) {
        this.currDate = currDate;
        this.date = date||new Date();

        this.startDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
        this.monthName = this.getMonthName(this.date.getMonth(), 'long');

        this.container.innerHTML = '';

        this.createTable();
        this.createHeader();
        this.createWeekDays();
        this.createDays();
    }

    buildMonths(){
        this.container.innerHTML = '';

        this.createTable();

        for(let i = 0; i < 4; i++) {
            const tr = document.createElement('tr');
            this.table.appendChild(tr);

            for(let j = 0; j < 3; j++) {
                const td = document.createElement('td');
                td.dataset.action = 'select-month';
                td.dataset.month = `${j + i * 3}`;
                td.textContent = this.getMonthName(j + i * 3);
                tr.appendChild(td);
            }
        }
    }

    buildYears(){
        this.container.innerHTML = '';

        this.createTable();
        
        const tr = document.createElement('tr');
        this.table.appendChild(tr);

        const td = document.createElement('td');
        tr.appendChild(td);

        const input = document.createElement('input');
        input.type = 'number';
        input.value = this.date.getFullYear().toString();
        input.maxLength = 4;
        td.appendChild(input);

        const td2 = document.createElement('td');
        td2.textContent = "Select";
        td2.className = 'set-year';
        td2.dataset.action = 'set-year';
        tr.appendChild(td2);
    }

    private createTable() {
        this.table = document.createElement('table');
        this.container.appendChild(this.table);
    }

    private createHeader() {
        const tr = document.createElement('tr');
        this.table.appendChild(tr);

        const td = document.createElement('td');
        td.colSpan = 7;
        tr.appendChild(td);

        const header = document.createElement('div');
        header.className = 'header';
        td.appendChild(header);
        
        this.createHeaderItem(header, "<", "left-arrow");
        this.createHeaderItem(header, "clear", "clear-label");
        this.createHeaderItem(header, this.monthName, "month");
        this.createHeaderItem(header, this.date.getFullYear()+'', "year");
        this.createHeaderItem(header, "today", "today-label");
        this.createHeaderItem(header, ">", "right-arrow");
    }

    private createHeaderItem(header: HTMLDivElement, text: string, css: string) {
        const td = document.createElement('span');
        td.textContent = text;
        td.className = css;
        td.dataset.action = css;
        td.dataset.date = `${this.date.getFullYear()}/${this.date.getMonth() + 1}/${this.date.getDate()}`;
        header.appendChild(td);
    }

    private createWeekDays() {
        const row = document.createElement('tr');
        this.table.appendChild(row);
        
        for(let day of this.getWeekDays()) {
            const cell = document.createElement('th');
            cell.textContent = day;
            row.appendChild(cell);
        }
    }

    private getWeekDays() {
        var baseDate = new Date(Date.UTC(1900, 0, 0)); 
        var weekDays = [];
    
        for(let day = 0; day < 7; day++) {       
            weekDays.push(baseDate.toLocaleDateString('default', { weekday: 'short' }));
            baseDate.setDate(baseDate.getDate() + 1);       
        }

        return weekDays;
    }

    private createDays() {
        for(let row = 0; row < 6; row++) {
            const tr = document.createElement('tr');
            this.table.appendChild(tr);

            for(let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++)
                this.createDateCell(tr, (row * 7) + dayOfWeek);
        } 
    }

    private createDateCell(tr: HTMLTableRowElement, dayNumber: number) {
        const td = document.createElement('td');
        tr.appendChild(td);
        
        let day = dayNumber - this.startDay;
        let currDate = new Date(this.date.getFullYear(), this.date.getMonth(), day);

        if(this.date.getMonth() !== currDate.getMonth())
            td.classList.add('disable');
        
        if(this.isDatesEqual(this.today, currDate))
            td.classList.add('today');

        if(this.currDate && this.isDatesEqual(this.currDate, currDate))
            td.classList.add('selected');

        td.textContent = `${currDate.getDate()}`;
        td.dataset.date = `${currDate.getFullYear()}/${currDate.getMonth() + 1}/${currDate.getDate()}`;
    }

    private isDatesEqual(date1: Date, date2: Date) {
        return (
            date1.getFullYear() === date2.getFullYear() 
            && date1.getMonth() === date2.getMonth()
            && date1.getDate() === date2.getDate()
        );
    }

    private getMonthName(month: number, format = 'short') {
        return (new Date(0, month, 1)) .toLocaleString('default', { month: format });
    }

}