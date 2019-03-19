import {Component, ViewEncapsulation} from "@angular/core";
import {GridOptions} from "ag-grid-community";

import {ProficiencyFilter} from '../filters/proficiency.component.filter';
import {SkillFilter} from '../filters/skill.component.filter';
import RefData from '../data/refData';
// only import this if you are using the ag-Grid-Enterprise
import 'ag-grid-enterprise';

import {HeaderGroupComponent} from "../header-group-component/header-group.component";
import {DateComponent} from "../date-component/date.component";
import {HeaderComponent} from "../header-component/header.component";
import {RendererComponent} from "../renderer-component/renderer.component";

@Component({
    selector: 'rich-grid',
    templateUrl: 'rich-grid.component.html',
    styleUrls: ['rich-grid.css', 'proficiency-renderer.css'],
    encapsulation: ViewEncapsulation.None
})
export class RichGridComponent {
    private gridOptions: GridOptions;
    public showGrid: boolean;
    public rowData: any[];
    public columnDefs: any[];
    public rowCount: string;

    public sideBar: false;

    constructor() {
        this.showGrid = true;
        this.gridOptions = <GridOptions>{
            dateComponent: 'dateComponent',
            defaultColDef: {
                resizable: true,
                sortable: true,
                filter: true,
                headerComponent: 'customHeaderComponent',
                headerComponentParams: {
                    menuIcon: 'fa-bars'
                }
            },
            frameworkComponents: {
                customHeaderComponent: HeaderComponent,
                dateComponent: DateComponent,
                headerGroupComponent: HeaderGroupComponent,
                rendererComponent: RendererComponent,
                proficiencyFilter: ProficiencyFilter,
                skillFilter: SkillFilter
            }
        };
        this.createRowData();
        this.createColumnDefs();
    }

    private createRowData() {
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
                width: 30,
                checkboxSelection: true,
                sortable: false,
                suppressMenu: true,
                pinned: true
            },
            {
                headerName: 'Employee',
                headerGroupComponent: 'headerGroupComponent',
                children: [
                    {
                        field: "name",
                        width: 150,
                        pinned: true
                    },
                    {
                        field: "country",
                        width: 150,
                        cellRenderer: countryCellRenderer,
                        pinned: true,
                        filterParams: {
                            cellRenderer: countryCellRenderer,
                            cellHeight: 20
                        },
                        columnGroupShow: 'show'
                    },
                    {
                        headerName: "DOB",
                        field: "dob",
                        width: 120,
                        pinned: true,
                        cellRenderer: (params) => {
                            return pad(params.value.getDate(), 2) + '/' +
                                pad(params.value.getMonth() + 1, 2) + '/' +
                                params.value.getFullYear();
                        },
                        menuTabs: ['filterMenuTab'],
                        filter: 'agDateColumnFilter',
                        columnGroupShow: 'show'
                    }
                ]
            },
            {
                headerName: 'IT Skills',
                children: [
                    {
                        headerName: "Skills",
                        width: 125,
                        sortable: false,
                        cellRenderer: skillsCellRenderer,
                        menuTabs: ['filterMenuTab'],
                        filter: 'skillFilter'
                    },
                    {
                        field: "proficiency",
                        width: 120,
                        cellRenderer: percentCellRenderer,
                        menuTabs: ['filterMenuTab'],
                        filter: 'proficiencyFilter'
                    },
                ]
            },
            {
                headerName: 'Contact',
                children: [
                    {
                        field: "mobile",
                        cellRendererFramework: RendererComponent,
                        width: 150,
                        filter: 'agTextColumnFilter'
                    },
                    {
                        field: "address",
                        width: 500,
                        filter: 'agTextColumnFilter'
                    }
                ]
            }
        ];
    }

    private calculateRowCount() {
        if (this.gridOptions.api && this.rowData) {
            const model = this.gridOptions.api.getModel();
            const totalRows = this.rowData.length;
            const processedRows = model.getRowCount();
            this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
        }
    }

    private onModelUpdated() {
        console.log('onModelUpdated');
        this.calculateRowCount();
    }

    public onReady() {
        console.log('onReady');
        this.calculateRowCount();
    }

    private onCellClicked($event) {
        console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    private onCellDoubleClicked($event) {
        console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    private onCellContextMenu($event) {
        console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
}

function skillsCellRenderer(params) {
    const data = params.data;
    const skills = [];
    RefData.IT_SKILLS.forEach(function (skill) {
        if (data && data.skills && data.skills[skill]) {
            skills.push(`<img src="images/skills/${skill}.png" width="16px" title="${skill}" />`);
        }
    });
    return skills.join(' ');
}

function countryCellRenderer(params) {
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

function percentCellRenderer(params) {
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

//Utility function used to pad the date formatting.
function pad(num, totalStringSize) {
    let asString = num + "";
    while (asString.length < totalStringSize) asString = "0" + asString;
    return asString;
}

