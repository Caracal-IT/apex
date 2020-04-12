import { DateControl } from "./apx-date";
import { DateBuilder } from "./date-builder";

export class DateEventHandler {
    private _event: any;

    constructor(
        private container: DateControl, 
        private popup: HTMLDivElement, 
        private builder: DateBuilder) { }

    handle(event: any){
        this._event = event;
        this.cancelBubble();

        switch (this._event.target.dataset.action) {
            case 'month':  return this.builder.buildMonths();;
            case 'select-month': return this.selectMonth();
            case 'year': return this.builder.buildYears();
            case 'set-year': return this.selectYear();
            case 'clear-label': return this.clearDate();
            case 'today-label': return this.setToday();
            case 'left-arrow': return this.goToMonth(-1);
            case 'right-arrow': return this.goToMonth(1);
            default: return this.selectDate();
        }
    }

    private cancelBubble() {
        const parent = this.popup.querySelector("table")

        if(parent && parent.contains(this._event.target))
            this._event.cancelBubble = true;
    }

    private selectMonth() {
        const month = this._event.target.dataset.month;

        const date = new Date(this.builder.date.getFullYear(), month, 1);
        this.builder.buildDays(this.container._value, date);
    }

    private selectYear() {
        const year = this.container.shadowRoot.querySelector('input').value;
            
        if(!/^\d{4}$/.test(year))
            return;

        const date = new Date(+year, this.builder.date.getMonth(), 1);
        this.builder.buildDays(this.container._value, date);
    }

    private clearDate() {
        this.container.value = '';
        this.popup.classList.add("hidden");
        this.container.dispatchEvent(new Event('input'));
    }

    private setToday() {
        const date = new Date();
        this.container.value = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        this.popup.classList.add("hidden");
        this.container.dispatchEvent(new Event('input'));
    }

    private goToMonth(direction: number) {
        const date = new Date(this._event.target.dataset.date);
        let newDate = new Date(date.getFullYear(), date.getMonth() + direction, date.getDate());

        this.builder.buildDays(this.container._value, newDate);
    }

    private selectDate() {
        if(!this._event.target.dataset.date)
            return;

        this.clearSelected();
        this._event.target.classList.add('selected');
        this.setDate();
    }

    private clearSelected() {
        const selected = this.popup.querySelector('.selected');

        if(selected)
            selected.classList.remove('selected');
    }

    private setDate() {
        this.container.value = this._event.target.dataset.date;
        this.popup.classList.add("hidden");
        this.container.dispatchEvent(new Event('input'));
    }
}