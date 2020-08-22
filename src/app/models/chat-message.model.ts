import {ChatMessageSourceModel} from './chat-message-source.model';

export interface ChatMessageModel {
    sentByBot: boolean;
    messageText: string;
    imageUrl?: string;
    source?: ChatMessageSourceModel;
}
