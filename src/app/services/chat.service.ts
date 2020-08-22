import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {ChatMessageModel} from '../models/chat-message.model';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    typingBotMessage: BehaviorSubject<boolean>;
    chatMessages: BehaviorSubject<ChatMessageModel[]>;

    constructor(private http: HttpClient) {
        this.chatMessages = new BehaviorSubject<ChatMessageModel[]>([]);
        this.typingBotMessage = new BehaviorSubject<boolean>(true);
    }

    sendMessage(message: ChatMessageModel) {
        const messages = this.chatMessages.getValue();
        messages.push(message);
        this.chatMessages.next(messages);
    }
}
