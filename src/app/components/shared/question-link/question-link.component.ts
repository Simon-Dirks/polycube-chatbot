import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {QuestionService} from '../../../services/question.service';
import {QuestionModel} from '../../../models/question.model';

@Component({
    selector: 'app-question-link',
    templateUrl: './question-link.component.html',
    styleUrls: ['./question-link.component.scss'],
})
export class QuestionLinkComponent implements OnInit {
    @Input() linkText: string;
    @Input() question: QuestionModel;

    constructor(private router: Router,
                private questionService: QuestionService) {
    }

    ngOnInit() {
    }

    onLinkClicked() {
        this.questionService.askQuestion(this.question);
    }

}
