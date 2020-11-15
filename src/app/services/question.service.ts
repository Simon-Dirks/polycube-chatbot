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
    filterInput: string;

    constructor(private chat: ChatService,
                private http: HttpClient) {
        this.allQuestions = new BehaviorSubject<QuestionModel[]>([]);
        this.loadQuestionsFromFile();
    }

    async loadQuestionsFromFile() {
        const questions: QuestionModel[] = await this.http.get<QuestionModel[]>('/assets/data/questions.json').toPromise();
        this.allQuestions.next(questions);
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

    private addQuestion(question: QuestionModel) {
        const allQuestions = this.allQuestions.getValue();
        allQuestions.push(question);
        const askedQuestions = allQuestions.filter(q => this.questionHasBeenAsked(q.id));
        const unaskedQuestions = allQuestions.filter(q => !this.questionHasBeenAsked(q.id));
        this.allQuestions.next(unaskedQuestions.concat(askedQuestions));
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

            if (question.followUpQuestions) {
                question.followUpQuestions.forEach(q => {
                    this.addQuestion(q);
                });

                // const timeBeforeShowingFollowupQuestions = environment.delayBetweenMessages * (question.questionAnswers.length + 0.5);
                // setTimeout(() => {
                //     question.followUpQuestions.forEach(q => {
                //         this.addQuestion(q);
                //     });
                // }, timeBeforeShowingFollowupQuestions);
            }
        }



    }

    questionHasBeenAsked(id: string) {
        return this.askedQuestionIds.includes(id);
    }
}
