import {Component, Input, OnInit} from '@angular/core';
import {ChatService} from '../../../services/chat.service';
import {QuestionModel} from "../../../models/question.model";
import {QuestionService} from "../../../services/question.service";

@Component({
    selector: 'app-question-option',
    templateUrl: './question-option.component.html',
    styleUrls: ['./question-option.component.scss'],
})
export class QuestionOptionComponent implements OnInit {
    @Input() question: QuestionModel;

    constructor(public chat: ChatService,
                public questionService: QuestionService) {
    }

    ngOnInit() {
    }

    getFilteredWordString(): string[] {
        const questionAsked = this.question.questionAsked.messageText;

        if (!this.questionService.filterInput) {
            return [questionAsked, '', ''];
        }

        const filterInputIdx = questionAsked.toLowerCase().indexOf(this.questionService.filterInput.toLowerCase());
        const beforeFilteredWord = questionAsked.substring(0, filterInputIdx);
        const afterFilteredWord = questionAsked.substring(filterInputIdx + this.questionService.filterInput.length, questionAsked.length);
        return [beforeFilteredWord, this.questionService.filterInput, afterFilteredWord];
    }
}
