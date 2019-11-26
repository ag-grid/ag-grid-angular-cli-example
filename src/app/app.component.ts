import { Component } from '@angular/core';
import { DataService } from './data.service';

declare var Zone;

import {AllModules} from '@ag-grid-enterprise/all-modules'

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rows: any[] = [];
  cols: any[];
  name = 'AgGrid Data LoadTest';
  loadBtnDisabled = false;
  columnDefs = this.getColModel();
  modules=AllModules;
  rowData = [];
  timeStart = 0;
  timeEnd = 0;
  dataLoaded = false;

  constructor(private dataService: DataService) {
  }

  doLoad() {
    this.loadBtnDisabled = true;

    this.dataService.getData().then(d => {
      this.timeEnd = 0;
      this.dataLoaded = false;
      this.timeStart = new Date().getTime();
      this.rowData = d;
    });
  }

  ngOnInit() {
    this.cols = this.getColModel();
    this.doLoad();
  }

  getColModel(): any[] {
    const colModel: any[] = [];

    for (let i = 0; i < 150; i++) {
      colModel.push({
        field: 'col' + i,
        headerName: 'col' + i,
        editable: false,
        cellRenderer:
          i === 0 || i === 5 ? (params) => {
            return '<span class="badge badge-secondary">' + params.value + '</span>';
          } : null
      });
    }

    return colModel;
  }

  onRowClicked($event) {
    if (Zone.current.name != "angular") {
      debugger
      throw new Error("onRowClicked: not angular zone!");
    }
  }
  onCellFocused($event) {
    if (Zone.current.name != "angular") {
      debugger
      throw new Error("onCellFocused: not angular zone!");
    }
  }

  onModelUpdated(e) {
    this.loadBtnDisabled = false;
    if (!this.dataLoaded) {
      this.dataLoaded = true;
      this.timeEnd = new Date().getTime();
    }
  }

  get gridLoadedMessage(): string {
    if (this.timeStart > 0 && this.timeEnd > 0) {
      return 'Data loaded in ' + (this.timeEnd - this.timeStart) + ' milliseconds';
    }

    return '';
  }
}
