import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {QuestionService} from '../../services/question.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
    @ViewChild('chatMessages', {static: false}) chatMessagesElRef: ElementRef;

    constructor(public chat: ChatService,
                public questions: QuestionService) {
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

    scrollToBottom() {
        if (!this.chatMessagesElRef) {
            return;
        }
        setTimeout(() => {
            this.chatMessagesElRef.nativeElement.scrollTop = this.chatMessagesElRef.nativeElement.scrollHeight;
        }, 25);
    }
}
