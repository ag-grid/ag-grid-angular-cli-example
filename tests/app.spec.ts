import {Component, DebugElement} from "@angular/core";
import {ColumnApi, GridApi} from "ag-grid-community";
import {AgGridModule} from "ag-grid-angular";
import {async, TestBed} from "@angular/core/testing";
import { By } from '@angular/platform-browser';

@Component({
    template: `
        <div id="editable-cell">{{this.params.value * 2}}</div>`
})
class RendererComponent {
    params: any;

    public agInit(params) {
        this.params = params;
    }
}

@Component({
    template: `
        <div>
            <ag-grid-angular style="width: 100%; height: 350px;" class="ag-theme-balham"
                             [columnDefs]="columnDefs"
                             [rowData]="rowData"

                             [frameworkComponents]="frameworkComponents"

                             (gridReady)="onGridReady($event)">
            </ag-grid-angular>
        </div>`
})
class TestHostComponent {
    rowData: any[] = [{name: 'Test Name', number: 42}];

    columnDefs: any[] = [
        {field: "name"},
        {field: "number", headerName: "Raw Number"},
        {field: "number", headerName: "Renderer Value", editable: true, cellRenderer: 'renderer'}
    ];

    frameworkComponents = {
        'renderer': RendererComponent
    };

    api: GridApi;
    columnApi: ColumnApi;

    public onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
    }
}

describe('angular-cli App', function () {
    let fixture: any;
    let component: TestHostComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AgGridModule.withComponents([RendererComponent])
            ],
            declarations: [TestHostComponent, RendererComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    }));

    it('the application should render', () => {
        expect(component).toBeDefined();
    });

    it('the grid cells should be as expected', () => {
        const appElement = fixture.nativeElement;

        const cellElements = appElement.querySelectorAll('.ag-cell-value');
        expect(cellElements.length).toEqual(3);
        expect(cellElements[0].textContent).toEqual("Test Name");
        expect(cellElements[1].textContent).toEqual("42");
        expect(cellElements[2].textContent).toEqual("84");
    });
});
