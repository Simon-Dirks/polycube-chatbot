import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ChatMessageModel} from '../../../models/chat-message.model';

@Component({
    selector: 'app-chat-message-bubble',
    templateUrl: './chat-message-bubble.component.html',
    styleUrls: ['./chat-message-bubble.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChatMessageBubbleComponent implements OnInit {
    @Input() messageIdx: number;
    @Input() message: ChatMessageModel;

    constructor() {
    }

    ngOnInit() {
    }

}
