import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {QuestionService} from '../../services/question.service';
import {CameraService} from '../../services/camera.service';
import {HttpClient} from '@angular/common/http';
import {ImageClassifierService} from '../../services/image-classifier.service';
import {WebcamImage} from 'ngx-webcam';
import {ModalController} from '@ionic/angular';
import {CameraModalComponent} from './camera-modal/camera-modal.component';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit {
    @ViewChild('chatMessages', {static: false}) chatMessagesElRef: ElementRef;
    constructor(public chat: ChatService,
                public questions: QuestionService,
                public camera: CameraService,
                public imageClassifier: ImageClassifierService,
                public modalController: ModalController
    ) {
    }

    ngOnInit() {
        this.chat.chatMessages.subscribe(() => {
            this.scrollToBottom();
        });
        this.questions.availableQuestions.subscribe(() => {
            this.scrollToBottom();
        });
        this.chat.typingBotMessage.subscribe(() => {
            this.scrollToBottom();
        });
    }

    async showCamPopup() {
        const modal = await this.modalController.create({
            component: CameraModalComponent,
            componentProps: {controller: this.modalController}
        });
        await modal.present();
        this.imageClassifier.lastPrediction = '';
    }

    scrollToBottom() {
        if (!this.chatMessagesElRef) {
            return;
        }
        setTimeout(() => {
            this.chatMessagesElRef.nativeElement.scrollTop = this.chatMessagesElRef.nativeElement.scrollHeight;
        }, 25);
    }
}
