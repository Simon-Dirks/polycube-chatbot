import {Injectable} from '@angular/core';
import {ChatService} from './chat.service';
import {BehaviorSubject} from 'rxjs';
import {QuestionModel} from '../models/question.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class QuestionService {
    askedQuestionIds: string[] = [];

    allQuestions: BehaviorSubject<QuestionModel[]>;
    availableQuestions: BehaviorSubject<QuestionModel[]>;
    filterInput: string;

    constructor(private chat: ChatService,
                private http: HttpClient) {
        this.availableQuestions = new BehaviorSubject<QuestionModel[]>([]);
        this.allQuestions = new BehaviorSubject<QuestionModel[]>([]);

        this.loadAvailableQuestionsFromFile();
    }

    async loadFollowupQuestions(questions: QuestionModel[]): Promise<QuestionModel[]> {
        let allQuestions: QuestionModel[] = this.allQuestions.getValue();
        allQuestions = allQuestions.concat(questions);
        for (const question of questions) {
            if (!question.followUpQuestions || question.followUpQuestions.length === 0) {
                continue;
            }

            for (const followupQuestion of question.followUpQuestions) {
                allQuestions = allQuestions.concat(await this.loadFollowupQuestions([followupQuestion]));
            }
        }
        this.allQuestions.next(allQuestions);
        return this.allQuestions.getValue();
    }

    async loadAvailableQuestionsFromFile() {
        const questions: QuestionModel[] = await this.http.get<QuestionModel[]>('/assets/data/questions.json').toPromise();
        this.availableQuestions.next(questions);
        this.loadFollowupQuestions(questions);
    }

    public getAllFilteredQuestions(): QuestionModel[] {
        let filteredQuestions: QuestionModel[] = this.availableQuestions.getValue();
        if (this.filterInput) {
            filteredQuestions = filteredQuestions.filter((question) => {
                return question.questionAsked.messageText.toLowerCase().indexOf(this.filterInput.toLowerCase()) !== -1;
            });
        }
        return filteredQuestions;
    }

    private makeQuestionAvailable(question: QuestionModel) {
        if (this.questionIsAvailable(question.id)) {
            return;
        }

        const allQuestions = this.availableQuestions.getValue();
        allQuestions.push(question);
        const askedQuestions = allQuestions.filter(q => this.questionHasBeenAsked(q.id));
        const unaskedQuestions = allQuestions.filter(q => !this.questionHasBeenAsked(q.id));
        this.availableQuestions.next(unaskedQuestions.concat(askedQuestions));
    }

    private questionIsAvailable(questionId: string) {
        return this.availableQuestions.getValue().find((q) => q.id === questionId) !== undefined;
    }

    public async askQuestion(question: QuestionModel) {
        question.questionAnswers.forEach(answer => {
            answer.sentByBot = true;
        });
        this.chat.sendMessage(question.questionAsked);
        this.chat.sendMessages(question.questionAnswers);
        this.filterInput = '';

        const questionHasBeenAsked = this.askedQuestionIds.includes(question.id);
        if (!questionHasBeenAsked) {
            this.askedQuestionIds.push(question.id);

            if (!this.questionIsAvailable(question.id)) {
                this.makeQuestionAvailable(question);
            }

            if (question.followUpQuestions) {
                question.followUpQuestions.forEach(q => {
                    this.makeQuestionAvailable(q);
                });

                // const timeBeforeShowingFollowupQuestions = environment.delayBetweenMessages * (question.questionAnswers.length + 0.5);
                // setTimeout(() => {
                //     question.followUpQuestions.forEach(q => {
                //         this.makeQuestionAvailable(q);
                //     });
                // }, timeBeforeShowingFollowupQuestions);
            }
        }


    }

    questionHasBeenAsked(id: string) {
        return this.askedQuestionIds.includes(id);
    }
}
