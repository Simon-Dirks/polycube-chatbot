import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {QuestionService} from '../../../services/question.service';

@Component({
    selector: 'app-question-link',
    templateUrl: './question-link.component.html',
    styleUrls: ['./question-link.component.scss'],
})
export class QuestionLinkComponent implements OnInit {
    @Input() linkText: string;

    constructor(private router: Router,
                private questionService: QuestionService ) {
    }

    ngOnInit() {
    }

    onLinkClicked() {
        this.questionService.filterInput = this.linkText;
        this.questionService.makeQuestionsAvailableByKeyword(this.linkText);
    }

}
