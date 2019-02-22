import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
// ag-grid
import { AgGridModule } from "ag-grid-angular";
// application
import { AppComponent } from "./app.component";
// rich grid
import { RichGridComponent } from "./rich-grid-example/rich-grid.component";
import { DateComponent } from "./date-component/date.component";
import { HeaderComponent } from "./header-component/header.component";
import { HeaderGroupComponent } from "./header-group-component/header-group.component";
import { RendererComponent } from './renderer-component/renderer.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AgGridModule.withComponents(
            [
                DateComponent,
                HeaderComponent,
                HeaderGroupComponent,
                RendererComponent
            ]
        )
    ],
    declarations: [
        AppComponent,
        RichGridComponent,
        DateComponent,
        HeaderComponent,
        HeaderGroupComponent,
        RendererComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
