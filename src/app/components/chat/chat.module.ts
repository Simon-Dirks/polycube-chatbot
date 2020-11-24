import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {ChatComponent} from './chat.component';
import {BrowserModule} from '@angular/platform-browser';
import {ChatMessageBubbleComponent} from './chat-message-bubble/chat-message-bubble.component';
import {HeaderBarModule} from '../shared/header-bar/header-bar.module';
import {QuestionOptionComponent} from './question-option/question-option.component';
import {WebcamModule} from 'ngx-webcam';
import {CameraModalComponent} from './camera-modal/camera-modal.component';
import {TextWithLinksModule} from '../../directives/text-with-links.module';
import {CubeModule} from '../polycube/components/cube.component/cube.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HeaderBarModule,
        WebcamModule,
        TextWithLinksModule,
        CubeModule
    ],
    declarations: [ChatComponent, CameraModalComponent, ChatMessageBubbleComponent, QuestionOptionComponent]
})
export class ChatModule {
}
