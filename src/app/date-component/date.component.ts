import {Component, OnDestroy} from "@angular/core";
import {IDateParams} from "@ag-grid-enterprise/all-modules";
import {IDateAngularComp} from "@ag-grid-community/angular";


@Component({
    selector: 'ag-full-width-grid',
    templateUrl: 'date.component.html',
    styleUrls: ['date.component.css'],
})
export class DateComponent implements OnDestroy, IDateAngularComp {
    private date: Date;
    private params: IDateParams;
    public dd: string = '';
    public mm: string = '';
    public yyyy: string = '';
    public disabled: boolean = false;

    agInit(params: IDateParams): void {
        this.params = params;
    }

    ngOnDestroy() {
        console.log(`Destroying DateComponent`);
    }

    onResetDate() {
        this.setDateToEmpty();
        this.params.onDateChanged();
    }

    setDateToEmpty() {
        this.dd = '';
        this.mm = '';
        this.yyyy = '';
        this.date = null;
    }

    onDateChanged(on: string, newValue: string) {
        this.date = this.parseDate(
            on === 'dd' ? newValue : this.dd,
            on === 'mm' ? newValue : this.mm,
            on === 'yyyy' ? newValue : this.yyyy
        );

        this.params.onDateChanged();
    }

    getDate(): Date {
        return this.date;
    }

    setDate(date: Date): void {
        if (date) {
            this.dd = date.getDate() + '';
            this.mm = (date.getMonth() + 1) + '';
            this.yyyy = date.getFullYear() + '';
            this.date = date;
            this.params.onDateChanged();
        } else {
            this.setDateToEmpty();
        }
    }

    setDisabled(disabled: boolean): void {
        this.disabled = disabled;
    }

    //*********************************************************************************
    //          INTERNAL LOGIC
    //*********************************************************************************

    parseDate(dd, mm, yyyy) {
        //If any of the three input date fields are empty, stop and return null
        if (dd.trim() === '' || mm.trim() === '' || yyyy.trim() === '') {
            return null;
        }

        let day = Number(dd);
        let month = Number(mm);
        let year = Number(yyyy);

        let date = new Date(year, month - 1, day);

        //If the date is not valid
        if (isNaN(date.getTime())) {
            return null;
        }

        //Given that new Date takes any garbage in, it is possible for the user to specify a new Date
        //like this (-1, 35, 1) and it will return a valid javascript date. In this example, it will
        //return Sat Dec 01    1 00:00:00 GMT+0000 (GMT) - Go figure...
        //To ensure that we are not letting non sensical dates to go through we check that the resultant
        //javascript date parts (month, year and day) match the given date fields provided as parameters.
        //If the javascript date parts don't match the provided fields, we assume that the input is nonsensical
        // ... ie: Day=-1 or month=14, if this is the case, we return null
        //This also protects us from non sensical dates like dd=31, mm=2 of any year
        if (date.getDate() != day || date.getMonth() + 1 != month || date.getFullYear() != year) {
            return null;
        }

        return date;
    }
}
