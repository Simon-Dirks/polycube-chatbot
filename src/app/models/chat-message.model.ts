import {SourceModel} from './source.model';

export interface ChatMessageModel {
    messageText: string;
    sentByBot?: boolean;
    imageUrl?: string;
    sourceId?: string;
    source?: SourceModel;
}
