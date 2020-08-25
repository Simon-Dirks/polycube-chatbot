import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {QuestionService} from '../../services/question.service';
import {CameraService} from '../../services/camera.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
    @ViewChild('chatMessages', {static: false}) chatMessagesElRef: ElementRef;

    constructor(public chat: ChatService,
                public questions: QuestionService,
                public camera: CameraService,
                private http: HttpClient,
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

    async predictPhotoClass() {
        const img = await this.camera.takePhoto();

        const formData = new FormData();
        formData.append('imgBase64', img.dataUrl);

        this.http.post<any>(environment.objectRecognitionApiUrl + '/classify', formData).toPromise().then((data) => {
            console.log(data);
            alert(JSON.stringify(data));
        }).catch((err) => {
            console.error(err);
        });

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
