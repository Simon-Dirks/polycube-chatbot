import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {ChatMessageModel} from '../models/chat-message.model';
import {environment} from '../../environments/environment';
import {SourceModel} from '../models/source.model';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    typingBotMessage: BehaviorSubject<boolean>;
    chatMessages: BehaviorSubject<ChatMessageModel[]>;

    constructor(private http: HttpClient) {
        this.chatMessages = new BehaviorSubject<ChatMessageModel[]>([]);
        this.typingBotMessage = new BehaviorSubject<boolean>(false);

        this.sendWelcomeMessages();
    }

    sendWelcomeMessages() {
        const startMessage: ChatMessageModel = {
            messageText: 'Welcome to the exhibition. This ArtBot Guide will introduce the Nias/Indies masks and their history.',
            sentByBot: true
        };

        const disclaimerMessage: ChatMessageModel = {
            messageText: 'Despite the best efforts of the researchers to include the perspective of the locals, limited written resources were available on this topic. Therefore, please note that the information in the chatbot mostly relies on Western sources.',
            sentByBot: true
        };

        const sourcesMessage: ChatMessageModel = {
            messageText: 'If you want to learn more about the Nias/Indies masks and physical anthropology, you can click on the source’s title on the top left of each message to access the original source.',
            sentByBot: true
        };

        this.sendMessage(startMessage);
        this.sendMessage(disclaimerMessage);
        this.sendMessage(sourcesMessage);
    }

    sendMessage(message: ChatMessageModel) {
        const messages = this.chatMessages.getValue();
        messages.push(message);
        this.chatMessages.next(messages);
    }

    sendMessages(messages: ChatMessageModel[]) {
        this.typingBotMessage.next(true);
        let timer = 0;
        let prevSourceId: string;

        // tslint:disable-next-line:prefer-for-of
        for (let messageIdx = 0; messageIdx < messages.length; messageIdx++) {
            const message = messages[messageIdx];
            let timeToTypeMessage = environment.timeDelayPerKeystroke * message.messageText.length;
            if (timeToTypeMessage < environment.minDelayForMessage) {
                timeToTypeMessage = environment.minDelayForMessage;
            }
            timer += timeToTypeMessage;

            setTimeout(() => {
                const sentMessage: ChatMessageModel = JSON.parse(JSON.stringify(message));

                // Check if the previous message was sent by the same person/source
                if (prevSourceId && sentMessage.sourceId && prevSourceId === sentMessage.sourceId) {
                    // Don't show the same source for every message
                    sentMessage.sourceId = undefined;
                }
                prevSourceId = sentMessage.sourceId;

                this.sendMessage(sentMessage);

                const isLastMessage = messageIdx === messages.length - 1;
                if (isLastMessage) {
                    this.typingBotMessage.next(false);
                }
            }, timer);
        }

    }

}
