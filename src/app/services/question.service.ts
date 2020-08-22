import {Injectable} from '@angular/core';
import {ChatService} from './chat.service';
import {BehaviorSubject} from 'rxjs';
import {QuestionModel} from '../models/question.model';

@Injectable({
    providedIn: 'root',
})
export class QuestionService {
    askedQuestionIds: string[] = [];

    allQuestions: BehaviorSubject<QuestionModel[]>;
    filterInput: string;

    constructor(private chat: ChatService) {
        const message = {
            messageText: 'fsdj33aklfj',
            sentByBot: false,
        };
        const message2 = {
            messageText: 'fsdj33a3444lfj',
            sentByBot: false,
        };

        const botMessage = {
            messageText: 'bot msg',
            sentByBot: true,
            source: {name: 'Simon DIrks', url: '#', role: 'Engineer'}
        };
        const questions: QuestionModel[] = [{
            id: 'test1',
            questionAsked: message,
            questionAnswers: [botMessage, botMessage]
        },
            {id: 'test2', questionAsked: message2, questionAnswers: [botMessage, botMessage]}];
        this.allQuestions = new BehaviorSubject<QuestionModel[]>(questions);
    }

    public getAllFilteredQuestions(): QuestionModel[] {
        let filteredQuestions: QuestionModel[] = this.allQuestions.getValue();
        if (this.filterInput) {
            filteredQuestions = filteredQuestions.filter((question) => {
                return question.questionAsked.messageText.toLowerCase().indexOf(this.filterInput.toLowerCase()) !== -1;
            });
        }
        return filteredQuestions;
    }

    public async askQuestion(question: QuestionModel) {
        this.chat.typingBotMessage.next(true);
        this.chat.sendMessage(question.questionAsked);

        let timer = 1000;
        // tslint:disable-next-line:prefer-for-of
        for (let answerIdx = 0; answerIdx < question.questionAnswers.length; answerIdx++) {
            const answer = question.questionAnswers[answerIdx];

            setTimeout(() => {
                this.chat.sendMessage(answer);

                if (answerIdx === question.questionAnswers.length - 1) {
                    this.chat.typingBotMessage.next(false);
                }
            }, timer);

            timer += 1000;
        }

        this.filterInput = '';

        this.askedQuestionIds.push(question.id);
    }

    questionHasBeenAsked(id: string) {
        return this.askedQuestionIds.includes(id);
    }
}
