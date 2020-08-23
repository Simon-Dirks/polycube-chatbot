import {ChatMessageModel} from './chat-message.model';

export interface QuestionModel {
    id: string;
    questionAsked: ChatMessageModel;
    questionAnswers: ChatMessageModel[];
    followUpQuestions?: QuestionModel[];
}
