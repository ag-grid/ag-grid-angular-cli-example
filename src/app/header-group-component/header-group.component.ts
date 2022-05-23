import {Component, OnDestroy} from "@angular/core";
import { IHeaderGroupParams } from "@ag-grid-community/core";
import {IHeaderGroupAngularComp} from "@ag-grid-community/angular";

@Component({
    templateUrl: 'header-group.component.html',
    styleUrls: ['header-group.component.css']
})
export class HeaderGroupComponent implements OnDestroy, IHeaderGroupAngularComp {
    public params!: IHeaderGroupParams;
    public expanded!: boolean;

    agInit(params: IHeaderGroupParams): void {
        this.params = params;
        this.params.columnGroup.getProvidedColumnGroup().addEventListener('expandedChanged', this.onExpandChanged.bind(this));
    }

    ngOnDestroy() {
        console.log(`Destroying HeaderComponent`);
    }


    expandOrCollapse() {
        this.params.setExpanded(!this.expanded);
    };

    onExpandChanged() {
        this.expanded = this.params.columnGroup.getProvidedColumnGroup().isExpanded()
    }
}
