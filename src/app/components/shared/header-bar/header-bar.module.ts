import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {HeaderBarComponent} from './header-bar.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
    ],
    declarations: [HeaderBarComponent],
    exports: [HeaderBarComponent]
})
export class HeaderBarModule {
}
