import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {QuestionService} from '../../services/question.service';
import {CameraService} from '../../services/camera.service';
import {HttpClient} from '@angular/common/http';
import {ImageClassifierService} from '../../services/image-classifier.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class ChatComponent implements OnInit {
    @ViewChild('chatMessages', {static: false}) chatMessagesElRef: ElementRef;

    constructor(public chat: ChatService,
                public questions: QuestionService,
                public camera: CameraService,
                private http: HttpClient,
                public imageClassifier: ImageClassifierService
    ) {
    }

    ngOnInit() {
        this.chat.chatMessages.subscribe(() => {
            this.scrollToBottom();
        });
        this.questions.allQuestions.subscribe(() => {
            this.scrollToBottom();
        });
        this.chat.typingBotMessage.subscribe(() => {
            this.scrollToBottom();
        });
    }

    test() {
        alert('jfsaklfajs');
    }

    async predictPhotoClass() {
        const img = await this.camera.takePhoto();
        const prediction = await this.imageClassifier.predictImageClass(img.webPath);
        alert(JSON.stringify(prediction));
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
