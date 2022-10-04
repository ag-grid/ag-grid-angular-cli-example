import { Component, ViewEncapsulation } from '@angular/core';
// for enterprise features
import { ColumnApi, GridApi, Module, ColDef, ColGroupDef, GridReadyEvent, CellClickedEvent, CellDoubleClickedEvent, CellContextMenuEvent, ICellRendererParams } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { MenuModule } from '@ag-grid-enterprise/menu';
import { SideBarModule } from '@ag-grid-enterprise/side-bar';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { FiltersToolPanelModule } from '@ag-grid-enterprise/filter-tool-panel';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { StatusBarModule } from '@ag-grid-enterprise/status-bar';

import { ProficiencyFilter } from '../filters/proficiency.component.filter';
import { SkillFilter } from '../filters/skill.component.filter';
import RefData from '../data/refData';
import { HeaderGroupComponent } from '../header-group-component/header-group.component';
import { DateComponent } from '../date-component/date.component';
import { SortableHeaderComponent } from '../header-component/sortable-header.component';
import { RendererComponent } from '../renderer-component/renderer.component';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';

// set your key here
// import {LicenseManager} from "@ag-grid-enterprise/core";
// LicenseManager.setLicenseKey(<your key>);

@Component({
    selector: 'rich-grid',
    templateUrl: 'rich-grid.component.html',
    styleUrls: ['rich-grid.css', 'proficiency-renderer.css'],
    encapsulation: ViewEncapsulation.None
})
export class RichGridComponent {
    public rowData!: any[];
    public columnDefs!: (ColDef | ColGroupDef)[];
    public rowCount!: string;

    public defaultColDef: ColDef;
    public components: any;
    public sideBar!: boolean;

    public modules: Module[] = [
        ClientSideRowModelModule,
        MenuModule,
        SideBarModule,
        ColumnsToolPanelModule,
        FiltersToolPanelModule,
        StatusBarModule,
        RowGroupingModule,
        SetFilterModule,
        RangeSelectionModule
    ];

    public api!: GridApi;
    public columnApi!: ColumnApi;

    constructor() {
        this.defaultColDef = {
            resizable: true,
            sortable: true,
            filter: true,
            floatingFilter: true,
            headerComponent: 'sortableHeaderComponent',
            headerComponentParams: {
                menuIcon: 'fa-bars'
            }
        };

        this.components = {
            sortableHeaderComponent: SortableHeaderComponent,
            agDateInput: DateComponent,
            headerGroupComponent: HeaderGroupComponent,
            rendererComponent: RendererComponent
        };

        this.createRowData();
        this.createColumnDefs();
    }

    public createRowData() {
        const rowData: any[] = [];

        for (let i = 0; i < 200; i++) {
            const countryData = RefData.countries[i % RefData.countries.length];
            rowData.push({
                name: RefData.firstNames[i % RefData.firstNames.length] + ' ' + RefData.lastNames[i % RefData.lastNames.length],
                skills: {
                    android: Math.random() < 0.4,
                    html5: Math.random() < 0.4,
                    mac: Math.random() < 0.4,
                    windows: Math.random() < 0.4,
                    css: Math.random() < 0.4
                },
                dob: RefData.DOBs[i % RefData.DOBs.length],
                address: RefData.addresses[i % RefData.addresses.length],
                years: Math.round(Math.random() * 100),
                proficiency: Math.round(Math.random() * 100),
                country: countryData.country,
                continent: countryData.continent,
                language: countryData.language,
                mobile: createRandomPhoneNumber()
            });
        }

        this.rowData = rowData;
    }

    private createColumnDefs() {
        this.columnDefs = [
            {
                headerName: '#',
                width: 40,
                checkboxSelection: true,
                filter: false,
                sortable: false,
                suppressMenu: true,
                pinned: true
            },
            {
                headerName: 'Employee',
                headerGroupComponent: 'headerGroupComponent',
                children: [
                    {
                        field: 'name',
                        width: 150,
                        pinned: true,
                        enableRowGroup: true,
                        enablePivot: true
                    },
                    {
                        field: 'country',
                        width: 150,
                        cellRenderer: countryCellRenderer,
                        pinned: true,
                        filterParams: {
                            cellRenderer: countryCellRenderer,
                            cellHeight: 20
                        },
                        enableRowGroup: true,
                        enablePivot: true,
                        columnGroupShow: 'show'
                    },
                    {
                        headerName: 'DOB',
                        field: 'dob',
                        width: 195,
                        pinned: true,
                        cellRenderer: (params: ICellRendererParams) => {
                            return pad(params.value.getDate(), 2) + '/' +
                                pad(params.value.getMonth() + 1, 2) + '/' +
                                params.value.getFullYear();
                        },
                        menuTabs: ['filterMenuTab'],
                        filter: 'agDateColumnFilter',
                        columnGroupShow: 'open'
                    }
                ]
            },
            {
                headerName: 'IT Skills',
                children: [
                    {
                        field: 'skills',
                        width: 125,
                        sortable: false,
                        cellRenderer: skillsCellRenderer,
                        menuTabs: ['filterMenuTab'],
                        filter: SkillFilter,
                        enableRowGroup: true,
                        enablePivot: true
                    },
                    {
                        field: 'proficiency',
                        width: 160,
                        cellRenderer: percentCellRenderer,
                        menuTabs: ['filterMenuTab'],
                        filter: ProficiencyFilter
                    },
                ]
            },
            {
                headerName: 'Contact',
                children: [
                    {
                        field: 'mobile',
                        cellRenderer: RendererComponent,
                        minWidth: 150,
                        filter: 'agTextColumnFilter'
                    },
                    {
                        field: 'address',
                        minWidth: 500,
                        filter: 'agTextColumnFilter'
                    }
                ]
            }
        ];
    }

    private calculateRowCount() {
        if (this.api && this.rowData) {
            const model = this.api.getModel();
            const totalRows = this.rowData.length;
            const processedRows = model.getRowCount();
            this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
        }
    }

    public onModelUpdated() {
        console.log('onModelUpdated');
        this.calculateRowCount();
    }

    public onGridReady(params: GridReadyEvent) {
        console.log('onGridReady');

        this.api = params.api;
        this.columnApi = params.columnApi;

        this.api.sizeColumnsToFit();

        this.calculateRowCount();
    }

    public onCellClicked($event: CellClickedEvent) {
        console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    public onCellDoubleClicked($event: CellDoubleClickedEvent) {
        console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    public onCellContextMenu($event: CellContextMenuEvent) {
        console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    public onQuickFilterChanged($event: any) {
        this.api.setQuickFilter($event.target.value);
    }

    public invokeSkillsFilterMethod() {
        this.api.getFilterInstance('skills', (instance) => {
            (instance as any).helloFromSkillsFilter();
        });
    }

    public dobFilter() {
        this.api.getFilterInstance('dob', (dateFilterComponent: any) => {
            dateFilterComponent.setModel({
                type: 'equals',
                dateFrom: '2000-01-01'
            });

            this.api.onFilterChanged();
        });
    }

    public toggleSidebar($event: any) {
        this.sideBar = $event.target.checked;
    }
}

function skillsCellRenderer(params: ICellRendererParams) {
    const data = params.data;
    const skills: string[] = [];
    RefData.IT_SKILLS.forEach(function(skill) {
        if (data && data.skills && data.skills[skill]) {
            skills.push(`<img src="images/skills/${skill}.png" width="16px" title="${skill}" />`);
        }
    });
    return skills.join(' ');
}

function countryCellRenderer(params: ICellRendererParams) {
    return `<img border='0' width='15' height='10' style='margin-bottom: 2px' src='images/flags/${RefData.COUNTRY_CODES[params.value]}.png'>${params.value}`;
}

function createRandomPhoneNumber() {
    let result = '+';
    for (let i = 0; i < 12; i++) {
        result += Math.round(Math.random() * 10);
        if (i === 2 || i === 5 || i === 8) {
            result += ' ';
        }
    }
    return result;
}

function percentCellRenderer(params: ICellRendererParams) {
    const value = params.value;

    const eDivPercentBar = document.createElement('div');
    eDivPercentBar.className = 'div-percent-bar';
    eDivPercentBar.style.width = value + '%';
    if (value < 20) {
        eDivPercentBar.style.backgroundColor = 'red';
    } else if (value < 60) {
        eDivPercentBar.style.backgroundColor = '#ff9900';
    } else {
        eDivPercentBar.style.backgroundColor = '#00A000';
    }

    const eValue = document.createElement('div');
    eValue.className = 'div-percent-value';
    eValue.innerHTML = value + '%';

    const eOuterDiv = document.createElement('div');
    eOuterDiv.className = 'div-outer-div';
    eOuterDiv.appendChild(eValue);
    eOuterDiv.appendChild(eDivPercentBar);

    return eOuterDiv;
}

// Utility function used to pad the date formatting.
function pad(num: number, totalStringSize: number) {
    let asString = num + '';
    while (asString.length < totalStringSize) { asString = '0' + asString; }
    return asString;
}

