import css from './apx-date.scss';

export class DateControl extends HTMLElement {
    private _label: HTMLSpanElement;
    private _popup: HTMLDivElement;

    caption: string;
    htmlFor: string;

    constructor(){
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<style>${css}</style>`;

        this._label = document.createElement('span');
        this.shadowRoot.appendChild(this._label);

        this.createPopup();
    }

    connectedCallback() {
        this._label.textContent = this.caption;
    }

    private createPopup() {
        this._popup = document.createElement('div');
        this.shadowRoot.appendChild(this._popup);
        const day = 1;
        const month = 3;
        const year = 2020;
        const date = new Date(year, month, day);
        const today = new Date(Date.now());
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const dayOfWeek = date.getDay();
        const startDaysInPrevMonth = new Date(year, month, 0).getDate() - dayOfWeek + 1;
        const totalDays = 72;

        let days = '';
        

        days += '<tr>';
        for(let i = dayOfWeek; i > 0; i--) {
           if(
               today.getFullYear() === date.getFullYear() &&
               today.getMonth() === date.getMonth() - 1 &&
               today.getDate() == i
           ) {
                days += `<td style="color:hotpink">${daysInPrevMonth - i}</td>`;
           }
           else {
                days += `<td style="color:#ccc">${daysInPrevMonth - i}</td>`;
           }
        }

        for(let i = dayOfWeek + 1; i <= 7; i++) {
            if(
                today.getFullYear() === date.getFullYear() &&
                today.getMonth() === date.getMonth() &&
                today.getDate() == i
            ) {
                 days += `<td style="text-align:center;color:hotpink">${i - dayOfWeek}</td>`;
            }
            else {
                days += `<td style="text-align:center;">${i - dayOfWeek}</td>`;
            }

           
        }

        days += '</td>';

        let dayCounter = 7 - dayOfWeek;
        let color = "#000"
        let cuuMonth = date.getMonth();
        for(let row = 1; row < 6; row++) {
            days += '<tr>';

            for(let i = 0; i < 7; i++) {
                dayCounter++;

                if(dayCounter > daysInMonth) {
                    dayCounter = 1;
                    cuuMonth++;
                    color = "#ccc"
                }

                if(
                    today.getFullYear() === date.getFullYear() &&
                    today.getMonth() === cuuMonth &&
                    today.getDate() == dayCounter
                ) {
                    days += `<td style="color:${color};text-align:center;background-color:hotpink;border-radius:100%">${dayCounter}</td>`;
                }
                else {
                    days += `<td style="color:${color};text-align:center;">${dayCounter}</td>`;
                }


                
            }

            days += '</tr>';
        }

        const monthName = date.toLocaleString('default', { month: 'long' });
        this._popup.innerHTML = `
            <div>
                <div>
                    <span>&lt;</span>
                    <span>${monthName}</<span>
                    <span>${date.getFullYear()}</span>
                    <span><br>
                    Day Of Week = ${dayOfWeek} ${totalDays}<br>
                    Days In Month = ${daysInMonth}<br>
                    Days In Prev Month = ${daysInPrevMonth}<br>
                    Start In Prev Month = ${startDaysInPrevMonth}
                    </span>
                    <span>&gt;</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Sun</th>
                            <th>Mon</th>
                            <th>Tue</th>
                            <th>Wed</th>
                            <th>Thu</th>
                            <th>Fri</th>
                            <th>Sat</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${days}
                    </tbody>
                </table>
            </div>
        `;
    }
}

customElements.define('apx-date', DateControl);