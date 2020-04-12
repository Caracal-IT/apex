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
        
        if(event.target.dataset.action === 'month') {
            this.builder.buildMonths();
            return;
        }

        if(event.target.dataset.action === 'select-month') {
            const month = event.target.dataset.month;

            const date = new Date(this.builder.date.getFullYear(), month, 1);
            this.builder.buildDays(this.container._value, date);
            return;
        }

        if(event.target.dataset.action === 'year') { 
            this.builder.buildYears();
            return; 
        }

        if(event.target.dataset.action === 'set-year') { 
            const year = this.container.shadowRoot.querySelector('input').value;
            
            if(!/^\d{4}$/.test(year))
                return;

            const date = new Date(+year, this.builder.date.getMonth(), 1);
            this.builder.buildDays(this.container._value, date);
            return; 
        }

        if(event.target.dataset.action === 'clear-label') {
            this.container.value = '';
            this.popup.classList.add("hidden");
            this.container.dispatchEvent(new Event('input'));
            return;
        }

        if(event.target.dataset.action === 'today-label'){
            const date = new Date();
            this.container.value = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            this.popup.classList.add("hidden");
            this.container.dispatchEvent(new Event('input'));
            return;
        }

        if(event.target.dataset.action === 'left-arrow' || event.target.dataset.action === 'right-arrow'){
            const date = new Date(event.target.dataset.date);
            let newDate = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());

            if(event.target.dataset.action === 'right-arrow')
                newDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());

            this.builder.buildDays(this.container._value, newDate);

            return;
        }

        if(!event.target.dataset.date)
            return;

        const selected = this.popup.querySelector('.selected');

        if(selected)
            selected.classList.remove('selected');

        event.target.classList.add('selected');

        this.container.value = event.target.dataset.date;
        this.popup.classList.add("hidden");
        this.container.dispatchEvent(new Event('input'));
    }

    private cancelBubble() {
        const parent = this.popup.querySelector("table")

        if(parent && parent.contains(this._event.target))
            this._event.cancelBubble = true;
    }
}