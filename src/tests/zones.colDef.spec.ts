import { Component, NgZone } from '@angular/core';

import { fireEvent, render, screen, within } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { CellClickedEvent, CellDoubleClickedEvent, ColDef, Module, NewValueParams } from '@ag-grid-community/core';

@Component({
    selector: 'app-grid-wrapper',
    standalone: true,
    imports: [AgGridAngular],
    template: `<ag-grid-angular
        [columnDefs]="columnDefs"
        [rowData]="rowData"
        [modules]="modules"></ag-grid-angular>`,
})
export class GridWrapperComponent {
    modules: Module[] = [ClientSideRowModelModule];
    rowData: any[] = [{ make: 'Toyota', model: 'Celica', price: 35000 }];
    columnDefs: ColDef[] = [
        {
            field: 'make',
            editable: true,
            onCellClicked: (event: CellClickedEvent) => {
                this.zoneStatus['cellClicked'] = NgZone.isInAngularZone();
            },
            onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
                this.zoneStatus['cellDoubleClicked'] = NgZone.isInAngularZone();
            },
            onCellValueChanged: (event: NewValueParams) => {
                this.zoneStatus['cellValueChanged'] = NgZone.isInAngularZone();
            },
            onCellContextMenu: (event: CellClickedEvent) => {
                this.zoneStatus['cellContextMenu'] = NgZone.isInAngularZone();
            },
            
        },
        { field: 'model' },
        { field: 'price' },
    ];

    public zoneStatus: { [key: string]: boolean } = {};

}

describe('Test ColDef Event ZoneJs Status', () => {
    it('Test cell is rendered and price updated', async () => {
        await render(GridWrapperComponent);
        const toyota = await screen.findByText('Toyota');
        expect(toyota).toBeDefined();
    });

    it('Test cell clicked is run in Zone', async () => {
        const component = await render(GridWrapperComponent);

        const toyota = await screen.findByText('Toyota');

        const user = userEvent.setup();
        // Validate clicks
        await user.click(toyota);
        await user.dblClick(toyota);

        // Validate cell value changed
        let input: HTMLInputElement = within(toyota).getByLabelText('Input Editor');
        await userEvent.keyboard('New Toyota');
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        await screen.findByText('New Toyota');

        // Validate context menu
        await user.pointer({keys: '[MouseRight]', target: toyota});

        expect(component.fixture.componentInstance.zoneStatus['cellClicked']).toBeTrue();
        expect(component.fixture.componentInstance.zoneStatus['cellDoubleClicked']).toBeTrue();
        expect(component.fixture.componentInstance.zoneStatus['cellValueChanged']).toBeTrue();        
        expect(component.fixture.componentInstance.zoneStatus['cellContextMenu']).toBeTrue();
    });
});
