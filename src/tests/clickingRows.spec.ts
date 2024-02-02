import { Component } from '@angular/core';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColDef, GridOptions, ModuleRegistry } from '@ag-grid-community/core';

ModuleRegistry.register(ClientSideRowModelModule);

@Component({
    selector: 'app-grid-wrapper',
    standalone: true,
    imports: [AgGridAngular],
    template: `<div data-testid="rowClicked">Row Clicked: {{ rowClicked?.make }}</div>
        <ag-grid-angular [gridOptions]="gridOptions" [columnDefs]="columnDefs" [rowData]="rowData"> </ag-grid-angular>`,
})
export class GridWrapperComponent {
    rowData: any[] = [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxster', price: 72000 },
    ];
    columnDefs: ColDef[] = [{ field: 'make' }, { field: 'model' }, { field: 'price' }];
    rowClicked: any;

    gridOptions: GridOptions = {
        onRowClicked: (params) => {
            this.rowClicked = params.data;
        },
    };
}

describe('Test Row Clicked', () => {
    it('Test cell clicked run row handler', async () => {
        render(GridWrapperComponent);

        const row = await screen.findByText('Ford');

        await userEvent.click(row);

        const rowClicked = await screen.findByTestId('rowClicked');
        expect(rowClicked.textContent).toBe('Row Clicked: Ford');
    });
});
