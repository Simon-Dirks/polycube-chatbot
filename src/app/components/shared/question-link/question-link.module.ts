import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {QuestionLinkComponent} from './question-link.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
    ],
    declarations: [QuestionLinkComponent],
    exports: [QuestionLinkComponent],
    entryComponents: [QuestionLinkComponent]
})
export class QuestionLinkModule {
}
