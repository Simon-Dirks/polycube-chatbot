import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {QuestionService} from "../../services/question.service";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

    constructor(private chat: ChatService, private questions: QuestionService) {
    }

    ngOnInit() {
    }

}
